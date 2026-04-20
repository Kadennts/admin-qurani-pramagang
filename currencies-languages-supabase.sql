-- ========================================================
-- MASTER CURRENCIES + LANGUAGES
-- Diselaraskan dengan negara utama target pengguna sign up.
-- Total seed:
-- - 10 currencies
-- - 10 languages
-- ========================================================

CREATE TABLE IF NOT EXISTS public.currencies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    symbol VARCHAR(50),
    code VARCHAR(10) NOT NULL UNIQUE,
    decimals INTEGER DEFAULT 2,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.currencies ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Currencies" ON public.currencies;
CREATE POLICY "Public Currencies" ON public.currencies FOR ALL USING (true) WITH CHECK (true);

TRUNCATE TABLE public.currencies RESTART IDENTITY CASCADE;

INSERT INTO public.currencies (name, symbol, code, decimals) VALUES
('Indonesian Rupiah', 'Rp', 'IDR', 2),
('Malaysian Ringgit', 'RM', 'MYR', 2),
('Saudi Riyal', 'SAR', 'SAR', 2),
('Egyptian Pound', 'E£', 'EGP', 2),
('Pakistani Rupee', 'Rs', 'PKR', 2),
('Bangladeshi Taka', '৳', 'BDT', 2),
('Turkish Lira', '₺', 'TRY', 2),
('UAE Dirham', 'AED', 'AED', 2),
('Qatari Riyal', 'QAR', 'QAR', 2),
('Pound Sterling', '£', 'GBP', 2);

CREATE TABLE IF NOT EXISTS public.languages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    native_name VARCHAR(255),
    code VARCHAR(20) NOT NULL UNIQUE,
    direction VARCHAR(10) DEFAULT 'LTR',
    status VARCHAR(50) DEFAULT 'Inactive',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.languages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Languages" ON public.languages;
CREATE POLICY "Public Languages" ON public.languages FOR ALL USING (true) WITH CHECK (true);

TRUNCATE TABLE public.languages RESTART IDENTITY CASCADE;

INSERT INTO public.languages (name, native_name, code, direction, status) VALUES
('Indonesian', 'Bahasa Indonesia', 'ID', 'LTR', 'Active'),
('Malay', 'Bahasa Melayu', 'MS', 'LTR', 'Active'),
('Arabic', 'العربية', 'AR', 'RTL', 'Active'),
('English', 'English', 'EN', 'LTR', 'Active'),
('Urdu', 'اردو', 'UR', 'RTL', 'Active'),
('Bengali', 'বাংলা', 'BN', 'LTR', 'Active'),
('Turkish', 'Türkçe', 'TR', 'LTR', 'Active'),
('Persian', 'فارسی', 'FA', 'RTL', 'Inactive'),
('French', 'Français', 'FR', 'LTR', 'Inactive'),
('Hausa', 'Hausa', 'HA', 'LTR', 'Inactive');
