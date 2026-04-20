-- 1. Buat ekstensi UUID jika belum ada (wajib untuk UUID)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Buat tabel user_profiles untuk menyimpan data pendaftar (Sign Up)
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(100) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  role VARCHAR(50) DEFAULT 'member',
  status VARCHAR(50) DEFAULT 'Active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Aktifkan RLS dan atur izin keamanan
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Izinkan akses Select, Insert (untuk pendaftaran), Update (untuk edit)
CREATE POLICY "Public can select user profiles." ON public.user_profiles FOR SELECT USING (true);
CREATE POLICY "Public can insert user profiles." ON public.user_profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update user profiles." ON public.user_profiles FOR UPDATE USING (true);

-- ========================================================
-- (Contoh Pancingan) - Jika Anda ingin mencoba 1-2 baris data
-- Jika tidak mau, baris INSERT INTO di bawah boleh dihapus
-- ========================================================
INSERT INTO public.user_profiles (username, full_name, email, role, status) VALUES
('kadennts', 'Refan', 'refan@example.com', 'admin', 'Active'),
('alvia', 'Alvia', 'alvia@example.com', 'member', 'Active')
ON CONFLICT (username) DO NOTHING;
