-- Tabel Support KYC Organisasi
CREATE TABLE IF NOT EXISTS public.support_kyc_organisasi (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id_str VARCHAR(20) NOT NULL DEFAULT '#001',
    org_name VARCHAR(255) NOT NULL,
    org_type VARCHAR(50) NOT NULL, -- 'LEMBAGA', 'YAYASAN', 'MADRASAH'
    org_category VARCHAR(100), -- 'Tilawati', 'Ummi', 'Tajwid'
    org_description TEXT,
    pic_name VARCHAR(255) NOT NULL,
    pic_username VARCHAR(100) NOT NULL,
    email VARCHAR(150),
    phone VARCHAR(50),
    address TEXT,
    website VARCHAR(150),
    coordinates VARCHAR(100),
    nib VARCHAR(50),
    npwp VARCHAR(50),
    status VARCHAR(50) DEFAULT 'Pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Hapus data dummy lama jika ada
TRUNCATE TABLE public.support_kyc_organisasi;

-- Insert 3 Mock Data Berdasarkan Gambar
INSERT INTO public.support_kyc_organisasi 
(org_id_str, org_name, org_type, org_category, org_description, pic_name, pic_username, email, phone, address, website, coordinates, nib, npwp, created_at)
VALUES
('#001', 'Lembaga Tilawati Nusantara', 'LEMBAGA', 'Tilawati', 'Lembaga pendidikan Al-Quran metode Tilawati yang tersebar di seluruh nusantara dengan ribuan santri aktif.', 'Siti Aminah', '@sitiaminah', 'tilawati@ltn.or.id', '082345678901', 'Jl. Masjid Raya No. 5, Surabaya, Jawa Timur', 'https://tilawatinusantara.or.id', '-7.2575, 112.7521', '912032334444', '01.234.567.2-012.000', '2026-02-11 10:00:00+00'),
('#002', 'Yayasan Qurani Madani', 'YAYASAN', 'Ummi', 'Yayasan pengembangan pendidikan dasar Al-Quran metode Ummi terpadu.', 'Budi Santoso', '@budisantoso', 'info@yqm.or.id', '08122334455', 'Jl. Pahlawan No. 10, Bandung, Jawa Barat', 'https://yqm.or.id', '-6.9175, 107.6191', '812304958111', '02.444.555.2-022.000', '2026-02-13 14:00:00+00'),
('#003', 'Madrasah Ibtidaiyah Terpadu', 'MADRASAH', 'Tajwid', 'Sekolah dasar Islam dengan kurikulum tahfiz dan tajwid terstruktur.', 'Dewi Rahayu', '@dewirahayu', 'mit.tajwid@sekolah.id', '085566778899', 'Jl. Jendral Sudirman No. 89, Jakarta Selatan', 'https://mit-terpadu.sch.id', '-6.2250, 106.8110', '334411122233', '03.777.888.1-033.000', '2026-02-14 09:30:00+00');
