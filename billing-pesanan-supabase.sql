CREATE TABLE IF NOT EXISTS public.billing_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    initials VARCHAR(5),
    avatar_color VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS public.billing_pesanan (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_name VARCHAR(255) NOT NULL,
    member_email VARCHAR(255) NOT NULL,
    member_initials VARCHAR(5),
    member_color VARCHAR(50),
    guru_name VARCHAR(255) NOT NULL,
    guru_email VARCHAR(255) NOT NULL,
    package_name VARCHAR(100) NOT NULL,
    package_sessions VARCHAR(50),
    order_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    price BIGINT DEFAULT 0,
    payment_method VARCHAR(50),
    status VARCHAR(50) -- 'Menunggu Guru', 'Menunggu Bayar', 'Lunas', 'Selesai', 'Pending', 'Batal'
);

TRUNCATE TABLE public.billing_members;
TRUNCATE TABLE public.billing_pesanan;

-- Insert dummy members
INSERT INTO public.billing_members (name, email, initials, avatar_color) VALUES 
('Siti Aminah', 'siti.aminah@yahoo.com', 'SA', 'bg-emerald-500'),
('Budi Santoso', 'budi.santoso@email.com', 'BS', 'bg-blue-500'),
('Dewi Rahayu', 'dewi.rahayu@gmail.com', 'DR', 'bg-orange-500'),
('Rizky Pratama', 'rizky.pratama@protonmail.com', 'RP', 'bg-teal-500'),
('Fauzia Nurrohma', 'fauzianurrohma@gmail.com', 'FN', 'bg-pink-500'),
('Rahma Aulia', 'rahmaaulia@gmail.com', 'RA', 'bg-amber-500'),
('Zulfa Hanum', 'zulfahanum@gmail.com', 'ZH', 'bg-fuchsia-500');

-- Insert dummy pesanan matching image exactly
INSERT INTO public.billing_pesanan (member_name, member_email, member_initials, member_color, guru_name, guru_email, package_name, package_sessions, order_date, price, payment_method, status) VALUES
('Fauzia Nurrohma', '@fauzianurrohma', 'FN', 'bg-pink-500', 'Indi fitriani', '@indi.f', '1x Pertemuan', '1x sesi', '2026-04-02 10:00:00+00', 89600, 'GoPay', 'Menunggu Guru'),
('Rahma Aulia', '@rahmaaulia', 'RA', 'bg-amber-500', 'Indi fitriani', '@indi.f', '5x Pertemuan', '5x sesi', '2026-04-01 10:00:00+00', 420000, '—', 'Menunggu Bayar'),
('Zulfa Hanum', '@zulfahanum', 'ZH', 'bg-fuchsia-500', 'Hasyim asy''ari, Lc', '@hasyim', '3x Pertemuan', '3x sesi', '2026-01-10 10:00:00+00', 250000, 'GoPay', 'Selesai'),
('Dewi Rahayu', '@dewirahayu', 'DR', 'bg-orange-500', 'Ustadz Iwan', '@iwanngaji', '1x Pertemuan', '1x sesi', '2026-04-09 10:00:00+00', 90000, 'GoPay', 'Lunas'),
('Siti Aminah', '@sitiaminah', 'SA', 'bg-emerald-500', 'Indi fitriani', '@indifitriani', '1x Pertemuan', '1x sesi', '2026-02-10 10:00:00+00', 90000, 'QRIS', 'Lunas'),
('Budi Santoso', '@budisantoso', 'BS', 'bg-blue-500', 'Ustadz Iwan', '@ustadziwan', '10x Pertemuan', '10x sesi', '2026-01-01 10:00:00+00', 705000, 'GoPay', 'Lunas'),
('Dewi Rahayu', '@dewirahayu', 'DR', 'bg-orange-500', 'Hasyim asy''ari, Lc', '@hasyimasyarilc', '1x Pertemuan', '1x sesi', '2026-01-05 10:00:00+00', 90000, 'GoPay', 'Lunas');
