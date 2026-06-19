/**
 * Convenience re-exports.
 *
 * Usage:
 *   - Client Components  → import { createClient } from "@/lib/supabase/client"
 *   - Server Components  → import { createClient } from "@/lib/supabase/server"
 *
 * Do NOT import both in the same file; the server client awaits cookies() and
 * must only be used in async Server Components, Server Actions, or Route Handlers.
 */
export { createClient as createBrowserSupabaseClient } from "./client";
