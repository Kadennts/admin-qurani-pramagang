import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Fungsi: createClient
 * Menginisialisasi dan mengembalikan instance Supabase client untuk digunakan di Server (Server Components / API Routes).
 * Bagian menyambungkan Supabase: Secara otomatis mengelola cookies untuk SSR autentikasi.
 */
export async function createClient() {
  const cookieStore = await cookies();

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
    throw new Error('Missing Supabase environment variables');
  }

  // Bagian menyambungkan Supabase: Membuat client dengan URL dan API Key
  return createServerClient<any>(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              try {
                cookieStore.set(name, value, options);
              } catch (error) {
                console.warn('Failed to set cookie:', { name, error });
              }
            });
          } catch (error) {
            console.warn('Cookie setAll called from Server Component:', error);
          }
        },
      },
    }
  );
}
