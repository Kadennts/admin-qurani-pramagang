-- Tabel Master Guru
CREATE TABLE IF NOT EXISTS public.master_guru (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    rating DECIMAL(2,1),
    reviews_count INT DEFAULT 0,
    metode VARCHAR(100),
    murid INT DEFAULT 0,
    revenue BIGINT DEFAULT 0,
    pesanan_aktif INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'Menunggu', -- 'Terverifikasi', 'Menunggu', 'Nonaktif'
    avatar_url TEXT,
    location VARCHAR(100),
    experience VARCHAR(100),
    education VARCHAR(255),
    badges TEXT[],
    about TEXT,
    course_desc TEXT,
    join_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

TRUNCATE TABLE public.master_guru;

INSERT INTO public.master_guru 
(name, email, rating, reviews_count, metode, murid, revenue, pesanan_aktif, status, avatar_url, location, experience, education, badges, about, course_desc, join_date)
VALUES
('Hasyim asy''ari, Lc', 'hasyim.lc@superprof.id', 5.0, 45, 'Ummi', 2, 180000, 1, 'Terverifikasi', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hasyim', 'Jakarta Selatan', '10 Tahun Pengalaman', 'Lulusan Al-Azhar Kairo-Mesir', ARRAY['Tahfidz', 'Tajwid', 'Al-Qur''an Dasar'], 'Assalamualaikum, saya Hasyim Asy''ari, Lc., lulusan Al-Azhar Kairo Mesir jurusan Ushuluddin. Saya telah mengajar Al-Qur''an selama lebih dari 10 tahun...', 'Kursus ini dirancang untuk membantu Anda menguasai Tajwid dan Tahfidz dengan bimbingan langsung...', '2024-03-10 10:00:00+00'),
('Indi fitriani', 'indi.f@superprof.id', 4.9, 32, 'Tilawati', 3, 1390000, 2, 'Terverifikasi', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Indi', 'Bandung', '5 Tahun Pengalaman', 'Universitas Pendidikan Indonesia', ARRAY['Tilawati Dasar', 'Tahsin'], 'Halo, saya Indi Fitriani. Belajar membaca Al-Quran dengan metode Tilawati jadi lebih mudah...', 'Fokus utama kursus ini adalah pembenahan makharijul huruf...', '2024-05-12 10:00:00+00'),
('Nanda', 'nanda.q@superprof.id', NULL, 0, 'Al-Baghdadi', 0, 0, 0, 'Menunggu', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nanda', 'Surabaya', '2 Tahun Pengalaman', 'Pondok Pesantren Lirboyo', ARRAY['Pemula', 'Al-Baghdadi'], 'Saya Nanda, dengan metode Al-Baghdadi saya siap membantu anak-anak belajar mengaji...', 'Kursus ini cocok bagi pemula dari nol...', '2025-01-20 10:00:00+00');
