-- Tabel Master Tax Rates
CREATE TABLE IF NOT EXISTS public.master_tax_rates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tax_code VARCHAR(50) NOT NULL,
    tax_type VARCHAR(50) NOT NULL, -- 'VAT', 'GST', 'PPh', 'Exempt'
    tax_name VARCHAR(255) NOT NULL,
    country_code VARCHAR(10) NOT NULL,
    country_name VARCHAR(100) NOT NULL,
    tax_rate DECIMAL(5,2) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Hapus data jika diperlukan
TRUNCATE TABLE public.master_tax_rates;

-- Insert 6 Dummy Data Berdasarkan Gambar
INSERT INTO public.master_tax_rates 
(tax_code, tax_type, tax_name, country_code, country_name, tax_rate, description, created_at)
VALUES
('VAT-EG-14', 'VAT', 'Value Added Tax Egypt', 'EG', 'Egypt', 14.00, 'Pajak standar Egypt', '2025-04-01 10:00:00+00'),
('PPN-ID-11', 'VAT', 'Pajak Pertambahan Nilai Indonesia', 'ID', 'Indonesia', 11.00, 'Pajak Pertambahan Nilai Indonesia reguler', '2025-01-01 10:00:00+00'),
('PPH-ID-2.5', 'PPh', 'Pajak Penghasilan Final untuk guru/pelatih', 'ID', 'Indonesia', 2.50, 'Pajak Penghasilan Final untuk guru/pelatih lepas', '2025-01-01 10:00:00+00'),
('GST-MY-6', 'GST', 'Goods and Services Tax Malaysia', 'MY', 'Malaysia', 6.00, 'Standar GST Malaysia', '2025-03-01 10:00:00+00'),
('VAT-SA-15', 'VAT', 'VAT Saudi Arabia - zakat exemption app...', 'SA', 'Saudi Arabia', 15.00, 'VAT Saudi Arabia beserta regulasi zakat', '2025-07-01 10:00:00+00'),
('VAT-TR-20', 'VAT', 'Value Added Tax Turkey', 'TR', 'Turkey', 20.00, 'Value Added Tax Turkey tingkat atas', '2025-09-01 10:00:00+00');
