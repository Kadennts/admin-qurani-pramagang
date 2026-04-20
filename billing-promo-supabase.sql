CREATE TABLE IF NOT EXISTS public.billing_promos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    discount_type VARCHAR(50) NOT NULL, -- 'Nominal (Rp)' or 'Persentase (%)'
    discount_value BIGINT NOT NULL,
    max_discount_value BIGINT DEFAULT 0,
    min_purchase BIGINT DEFAULT 0,
    max_usage INT DEFAULT 0,
    current_usage INT DEFAULT 0,
    usage_percentage INT DEFAULT 0, 
    start_date DATE,
    end_date DATE,
    status VARCHAR(50), -- 'Aktif', 'Nonaktif', 'Kedaluwarsa'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

TRUNCATE TABLE public.billing_promos;

INSERT INTO public.billing_promos (
  code, name, description, discount_type, discount_value, max_discount_value, min_purchase, max_usage, current_usage, usage_percentage, start_date, end_date, status
) VALUES 
('ANNIVERSARY', 'Promo HUT Qurani', 'Diskon flat Rp 30.000 dalam rangka ulang tahun Qurani.', 'Nominal (Rp)', 30000, 30000, 90000, 500, 0, 0, '2026-03-01', '2026-03-08', 'Nonaktif'),
('COBA-GRATIS', 'Sesi Perdana Gratis', 'Sesi pertama gratis, maksimal 1 kali penggunaan per akun.', 'Nominal (Rp)', 90000, 90000, 0, 300, 291, 97, '2025-10-01', '2026-04-01', 'Kedaluwarsa'),
('FLASH20', 'Flash Sale Weekend', 'Diskon 20% khusus hari Sabtu dan Minggu.', 'Persentase (%)', 20, 50000, 100000, 150, 150, 100, '2026-02-08', '2026-02-10', 'Nonaktif'),
('HEMAT50K', 'Potongan Paket Intensif', 'Potongan Rp 50.000 untuk pembelian paket intensif.', 'Nominal (Rp)', 50000, 50000, 200000, 200, 200, 100, '2026-01-01', '2026-02-01', 'Nonaktif'),
('PELAJAR15', 'Diskon Pelajar & Mahasiswa', 'Diskon 15% khusus untuk pelajar dan mahasiswa berstatus aktif.', 'Persentase (%)', 15, 30000, 0, 400, 118, 30, '2026-01-15', '2026-07-16', 'Aktif'),
('QURANI10', 'Diskon Member Baru', 'Diskon 10% untuk semua pengguna baru.', 'Persentase (%)', 10, 20000, 0, 500, 312, 62, '2026-01-01', '2026-07-01', 'Aktif');
