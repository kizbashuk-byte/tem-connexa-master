import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  console.log("CALLBACK URL:", request.url)
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  // Use the public redirect URI as the base to avoid https://localhost:3000 redirects
  const baseUrl = process.env.INSTAGRAM_REDIRECT_URI || request.url;

  if (error) {
    return NextResponse.redirect(
      new URL(`/channels?error=${encodeURIComponent(error)}`, baseUrl)
    );
  }
  if (!code) {
    return NextResponse.redirect(
      new URL(`/channels?error=NoCodeProvided`, baseUrl)
    );
  }

  // Must match the Instagram App ID used in the initiation route
  const clientId = process.env.INSTAGRAM_CLIENT_ID;
  const clientSecret = process.env.INSTAGRAM_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(
      new URL(`/channels?error=ConfigurationMissing`, request.url)
    );
  }

  const host = request.headers.get("host") || "localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";
  // Must be identical to the redirect_uri used in the initiation route
  const redirectUri =
    process.env.INSTAGRAM_REDIRECT_URI ||
    `${protocol}://${host}/api/auth/instagram/callback`;

  try {
    // 1. Authenticate the tenant using Supabase
    const supabase = await createClient();
    const { data: authData } = await supabase.auth.getUser();
    if (!authData?.user) {
      return NextResponse.redirect(new URL(`/login`, baseUrl));
    }

    const { data: member } = await supabase
      .from("tenant_members")
      .select("tenant_id")
      .eq("user_id", authData.user.id)
      .single();

    if (!member?.tenant_id) {
      return NextResponse.redirect(
        new URL(`/channels?error=NoTenantFound`, baseUrl)
      );
    }

    // 2. Exchange authorization code for a short-lived Instagram User access token.
    //    Instagram Business Login uses api.instagram.com, NOT graph.facebook.com.
    const tokenFormData = new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
      code,
    });

    const tokenRes = await fetch("https://api.instagram.com/oauth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: tokenFormData.toString(),
    });
    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      throw new Error(
        tokenData.error_message || tokenData.error?.message || "Failed to exchange code for token"
      );
    }

    const shortLivedToken = tokenData.access_token;
    // tokenData.user_id is the Instagram-scoped User ID for this app
    const igUserId = tokenData.user_id;

    // 3. Exchange short-lived token for a long-lived token (valid 60 days).
    //    Uses graph.instagram.com, NOT graph.facebook.com.
    const longLivedRes = await fetch(
      `https://graph.instagram.com/access_token` +
      `?grant_type=ig_exchange_token` +
      `&client_secret=${clientSecret}` +
      `&access_token=${shortLivedToken}`
    );
    const longLivedData = await longLivedRes.json();

    if (!longLivedData.access_token) {
      console.warn("Could not exchange for long-lived token; using short-lived token.", longLivedData);
    }

    const accessToken = longLivedData.access_token || shortLivedToken;

    // 4. Retrieve the connected Instagram Professional Account ID.
    //    With Instagram Business Login the token is a User token for graph.instagram.com.
    //    We call /me to get the IG user's ID (which is the Professional Account ID).
    const meRes = await fetch(
      `https://graph.instagram.com/v25.0/me?fields=id,username&access_token=${accessToken}`
    );
    const meData = await meRes.json();

    if (!meData.id) {
      throw new Error(
        meData.error?.message || "Failed to retrieve Instagram account ID."
      );
    }

    const igAccountId = meData.id;

    // 5. Securely store the access token and IG account ID in Supabase
    const { error: upsertError } = await supabase
      .from("tenant_integrations")
      .upsert(
        {
          tenant_id: member.tenant_id,
          channel: "instagram",
          provider_account_id: igAccountId,
          access_token: accessToken,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "tenant_id,channel" }
      );

    if (upsertError) {
      throw upsertError;
    }

    // 6. Explicitly subscribe the Meta App to this Instagram account's webhooks.
    //    Without this, Meta will NOT send DM events to your verified webhook endpoint.
    const subscribeRes = await fetch(
      `https://graph.instagram.com/v25.0/${igAccountId}/subscribed_apps?subscribed_fields=messages&access_token=${accessToken}`,
      { method: "POST" }
    );
    const subscribeData = await subscribeRes.json();

    if (!subscribeData.success) {
      console.error("Failed to subscribe to Instagram webhooks:", subscribeData);
    } else {
      console.log("Successfully subscribed to Instagram webhooks for account:", igAccountId);
    }

    return NextResponse.redirect(
      new URL(`/channels?success=InstagramConnected`, baseUrl)
    );
  } catch (err: any) {
    console.error("Instagram OAuth Error:", err);
    return NextResponse.redirect(
      new URL(`/channels?error=${encodeURIComponent(err.message)}`, baseUrl)
    );
  }
}
