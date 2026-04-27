import { createBrowserClient } from '@supabase/ssr'

/**
 * Fungsi: createClient
 * Menginisialisasi dan mengembalikan instance Supabase client untuk digunakan di Browser (Client Components).
 * Bagian menyambungkan Supabase: Memanfaatkan environment variables (URL dan ANON KEY).
 */
export const createClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
