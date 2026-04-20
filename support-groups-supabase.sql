-- Tabel Support Groups
CREATE TABLE IF NOT EXISTS public.support_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    initials VARCHAR(10) NOT NULL,
    type VARCHAR(20) NOT NULL DEFAULT 'PUBLIC',
    description TEXT DEFAULT 'No description available',
    category VARCHAR(50),
    member_count INT DEFAULT 0,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Hapus data lama jika ada
TRUNCATE TABLE public.support_groups;

-- Insert Mock Data Berdasarkan Gambar 1
INSERT INTO public.support_groups (name, initials, type, member_count, is_verified, created_at, description)
VALUES
('Auer, Hirthe and Effertz Group', 'AHA', 'PUBLIC', 3, false, '2025-10-04 10:00:00+00', 'Et quasi sed nihil rem rerum velit quaerat.'),
('Aufderhar - Roob', 'A-R', 'PRIVATE', 0, false, '2024-01-01 10:00:00+00', 'No description available'),
('Beer, Kub and Schuppe', 'BKA', 'PRIVATE', 0, false, '2024-01-01 10:00:00+00', 'No description available'),
('Belajar', 'B', 'PUBLIC', 1, false, '2024-01-01 10:00:00+00', 'No description available'),
('Belajar mengaji', 'BM', 'PUBLIC', 1, false, '2024-01-01 10:00:00+00', 'No description available'),
('Boyle LLC Group', 'BLG', 'PRIVATE', 0, false, '2024-01-01 10:00:00+00', 'No description available');

-- Secara opsional, kita bisa membuat tabel support_group_members jika butuh relational,
-- Namun untuk mempercepat sesuai instruksi dummy, member detail dapat kita hardcode/mock di Frontend
-- berdasarkan ID group yang dibuka, atau kita buat saja struktur simple:

CREATE TABLE IF NOT EXISTS public.support_group_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID REFERENCES public.support_groups(id) ON DELETE CASCADE,
    member_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'Member',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Note: Karena ID Support Groups dibuat otomatis via UUID, kita agak sulit menyuntikkan
-- member di SQL statis tanpa mengetahui UUID pastinya. 
-- Oleh karena itu, Member List di halaman detail akan disimulasikan secara dummy di kode frontend (React)
-- agar bisa berjalan sempurna sesuai gambar!
