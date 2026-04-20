CREATE TABLE IF NOT EXISTS public.billing_keluhan (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_name VARCHAR(255) NOT NULL,
    user_username VARCHAR(255),
    user_initials VARCHAR(10),
    user_color VARCHAR(50),
    type VARCHAR(50) NOT NULL, -- 'Saran', 'Keluhan', 'Pembatalan'
    status VARCHAR(50), -- 'Menunggu', 'Selesai' (khusus Pembatalan/Keluhan)
    date DATE,
    title VARCHAR(255),
    description TEXT,
    guru_name VARCHAR(255),
    guru_avatar VARCHAR(255),
    -- Fields for Pembatalan Details
    order_id VARCHAR(50),
    detail_paket VARCHAR(255),
    detail_kategori VARCHAR(255),
    detail_ulasan TEXT,
    detail_resolusi VARCHAR(100),
    detail_lampiran VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

TRUNCATE TABLE public.billing_keluhan;

INSERT INTO public.billing_keluhan (
    user_name, user_username, user_initials, user_color, type, status, date, title, description, guru_name, guru_avatar,
    order_id, detail_paket, detail_kategori, detail_ulasan, detail_resolusi, detail_lampiran
) VALUES 
('Rahma Aulia', '@rahmaaulia', 'RA', 'bg-[#059669]', 'Keluhan', NULL, '2026-04-05', 'GURU TIDAK RESPONSIF', 'Guru saya sudah 2 hari tidak membalas pesan saya di platform dan tidak hadir pada sesi yang sudah dijadwalkan. Saya sangat kecewa karena jadwal saya sudah terblokir.', 'Indi Fitriani', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Indi', NULL, NULL, NULL, NULL, NULL, NULL),

('Zulfa Hanum', '@zulfhanum', 'ZH', 'bg-blue-600', 'Saran', NULL, '2026-04-04', 'TAMBAHKAN FITUR REKAM SESI', 'Saya menyarankan agar platform Qurani menambahkan fitur perekaman sesi belajar secara otomatis, sehingga saya bisa menonton kembali materi yang sudah disampaikan guru.', 'Hasyim asy''ari, Lc', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hasyim', NULL, NULL, NULL, NULL, NULL, NULL),

('Nur Hidayah', '@nurhidayah', 'NH', 'bg-amber-500', 'Pembatalan', 'Menunggu', '2026-04-03', NULL, NULL, 'Indi Fitriani', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Indi', '#3006', '3x Pertemuan • Indi Fitriani', 'Kondisi Keluarga', 'Kondisi keluarga saya sedang tidak memungkinkan untuk mengikuti sesi belajar secara rutin dalam waktu dekat ini.', 'Refund Penuh', 'Tidak ada lampiran'),

('Siti Rahayu', '@sitirahayu', 'SR', 'bg-blue-500', 'Pembatalan', 'Selesai', '2026-03-30', NULL, NULL, 'Ustadzah Aminah', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aminah', '#3003', '5x Pertemuan • Ustadzah Aminah', 'Ketidaksesuaian Jadwal', 'Penampilan guru mirip dengan tetangga saya sehingga saya merasa kurang nyaman untuk belajar secara efektif.', 'Ganti Guru Baru', 'Tidak ada lampiran'),

('Fauzia Nurrohma', '@fauzianurrohma', 'FN', 'bg-purple-500', 'Saran', NULL, '2026-04-02', 'TAMPILAN JADWAL LEBIH INFORMATIF', 'Akan lebih baik jika kalender jadwal belajar bisa diunduh ke Google Calendar...', 'Indi Fitriani', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Indi', NULL, NULL, NULL, NULL, NULL, NULL);
