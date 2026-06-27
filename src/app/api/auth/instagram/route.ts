import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // Must use the Instagram App ID (not the Facebook App ID).
  // Set INSTAGRAM_CLIENT_ID=3874124406223491 in .env.local
  const clientId = process.env.INSTAGRAM_CLIENT_ID;
  if (!clientId) {
    return new NextResponse("Instagram Client ID not configured", { status: 500 });
  }

  // Instagram Business Login REQUIRES a public https:// redirect URI registered
  // in the Meta App Dashboard. localhost is rejected by Instagram's OAuth server.
  //
  // For local development:
  //   1. Run a tunnel: e.g. `ngrok http 3000`
  //   2. Set INSTAGRAM_REDIRECT_URI=https://<your-tunnel>.ngrok-free.app/api/auth/instagram/callback
  //      in .env.local
  //   3. Add that same URI to: App Dashboard > Instagram > API setup with Instagram login
  //      > Set up Instagram business login > Business login settings > OAuth redirect URIs
  //
  // In production, set INSTAGRAM_REDIRECT_URI to your real domain.
  const host = request.headers.get("host") || "localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";
  const redirectUri =
    process.env.INSTAGRAM_REDIRECT_URI ||
    `${protocol}://${host}/api/auth/instagram/callback`;

  // Instagram Business Login scopes (post Jan 27 2025 names).
  // These must also be added to your Instagram app in the Meta App Dashboard
  // under: App Dashboard > Instagram > API setup with Instagram login >
  //        Set up Instagram business login > Business login settings
  const scopes = [
    "instagram_business_basic",
    "instagram_business_manage_messages",
  ].join(",");

  // Instagram Business Login endpoint — NOT facebook.com/dialog/oauth
  const authUrl =
    `https://www.instagram.com/oauth/authorize` +
    `?client_id=${clientId}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&scope=${scopes}` +
    `&response_type=code`;

  return NextResponse.redirect(authUrl);
}
