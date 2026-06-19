import { createBrowserClient } from "@supabase/ssr";

/**
 * Creates a Supabase client for use in Browser / Client Components.
 * Uses NEXT_PUBLIC_ prefixed vars so they are safely inlined at build time.
 * Call once per component tree — memoize at the module level if needed.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
