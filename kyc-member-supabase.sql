-- Tabel Support KYC Members
CREATE TABLE IF NOT EXISTS public.support_kyc_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id_str VARCHAR(20) NOT NULL DEFAULT '#9999',
    full_name VARCHAR(255) NOT NULL,
    username VARCHAR(100) NOT NULL,
    phone_number VARCHAR(50),
    birth_place VARCHAR(100),
    birth_date DATE,
    address TEXT,
    nik VARCHAR(50),
    document_type VARCHAR(50) DEFAULT 'KTP',
    doc_image_url TEXT,
    selfie_image_url TEXT,
    status VARCHAR(50) DEFAULT 'Pending', -- 'Pending', 'Approved', 'Rejected'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Hapus data dummy lama jika ada
TRUNCATE TABLE public.support_kyc_members;

-- Insert 2 Mock Data Berdasarkan Gambar
INSERT INTO public.support_kyc_members (
    user_id_str, full_name, username, phone_number, birth_place, birth_date, address, nik, document_type, status, created_at
) VALUES
(
    '#9999', 'Johan Liebert', '@johanliebert', '081234567890', 'SIPANGAN BOLON', '1985-04-06', 'KAV. KBI 3 NO. B1 RANCAKASIAT', '1208184604850001', 'KTP', 'Pending', '2026-01-28 10:00:00+00'
),
(
    '#9998', 'Kadennts', '@kadennts', '081298765432', 'JAKARTA', '1990-12-12', 'JL. MAWAR NO 12 KEBAYORAN', '3174025212900002', 'KTP', 'Pending', '2026-01-27 15:30:00+00'
);
