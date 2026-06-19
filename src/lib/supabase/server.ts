import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Creates a Supabase client for use in Server Components, Server Actions,
 * and Route Handlers. Reads/writes cookies via the Next.js `cookies()` API
 * so that auth sessions are correctly persisted across requests.
 *
 * Must be called inside an async Server Component or Route Handler — never
 * at module scope — because it awaits the Next.js `cookies()` store.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // `setAll` is called from a Server Component — cookies can only be
            // mutated inside a Server Action or Route Handler. This catch block
            // silences the error; a Middleware refresh keeps sessions alive.
          }
        },
      },
    }
  );
}
