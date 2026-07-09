import { NextResponse } from "next/server";

/**
 * TEMPORARY DIAGNOSTIC ENDPOINT — remove after debugging is complete.
 *
 * Verifies the FACEBOOK_PAGE_ACCESS_TOKEN by calling the Meta Graph API.
 * Does NOT modify any data. Read-only.
 *
 * Usage: GET http://localhost:3000/api/debug/meta-token
 */
export async function GET() {
  const token = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
  const configuredPageId = process.env.FACEBOOK_PAGE_ID;

  if (!token) {
    return NextResponse.json({
      ok: false,
      error: "FACEBOOK_PAGE_ACCESS_TOKEN is not set in environment variables.",
    }, { status: 500 });
  }

  const results: Record<string, any> = {
    configured_page_id_in_env: configuredPageId || "(not set)",
    token_prefix: token.slice(0, 10) + "...",
  };

  // ── 1. Token debug info ────────────────────────────────────────────────────
  // Calls /debug_token to check if the token is valid and who it belongs to.
  try {
    const debugRes = await fetch(
      `https://graph.facebook.com/debug_token?input_token=${token}&access_token=${token}`
    );
    const debugData = await debugRes.json();
    results.token_debug = debugData?.data ?? debugData;
  } catch (err: any) {
    results.token_debug_error = err.message;
  }

  // ── 2. /me — which Page does this token represent? ─────────────────────────
  try {
    const meRes = await fetch(
      `https://graph.facebook.com/v19.0/me?fields=id,name,access_token&access_token=${token}`
    );
    const meData = await meRes.json();
    results.me = meData;
  } catch (err: any) {
    results.me_error = err.message;
  }

  // ── 3. Instagram Business Account attached to the Page ────────────────────
  // Uses the Page ID from /me (if available) or from env, whichever resolves.
  const resolvedPageId = results.me?.id ?? configuredPageId;

  if (resolvedPageId) {
    try {
      const igRes = await fetch(
        `https://graph.facebook.com/v19.0/${resolvedPageId}?fields=id,name,instagram_business_account&access_token=${token}`
      );
      const igData = await igRes.json();
      results.page_with_instagram = igData;
    } catch (err: any) {
      results.instagram_lookup_error = err.message;
    }

    // ── 4. Subscribed apps on this Page ──────────────────────────────────────
    try {
      const subsRes = await fetch(
        `https://graph.facebook.com/v19.0/${resolvedPageId}/subscribed_apps?access_token=${token}`
      );
      const subsData = await subsRes.json();
      results.subscribed_apps = subsData;
    } catch (err: any) {
      results.subscribed_apps_error = err.message;
    }
  } else {
    results.instagram_lookup = "Skipped — could not resolve a Page ID from token or env.";
  }

  return NextResponse.json(results, { status: 200 });
}
