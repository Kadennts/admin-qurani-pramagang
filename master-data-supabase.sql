-- ========================================================
-- MASTER LOCATION DATA FOR SIGN UP
-- Fokus: negara dengan pasar Muslim besar / tinggi potensi
-- penggunaan web untuk belajar mengaji.
-- Total seed:
-- - 10 countries
-- - 10 states
-- - 10 cities
-- ========================================================

CREATE TABLE IF NOT EXISTS public.countries (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    iso2 VARCHAR(5) NOT NULL,
    iso3 VARCHAR(5) NOT NULL,
    phone_code VARCHAR(50) NOT NULL,
    currency VARCHAR(50),
    capital VARCHAR(255),
    region VARCHAR(255),
    subregion VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.states (
    id SERIAL PRIMARY KEY,
    country_id INTEGER REFERENCES public.countries(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    iso2 VARCHAR(10),
    type VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.cities (
    id SERIAL PRIMARY KEY,
    state_id INTEGER REFERENCES public.states(id) ON DELETE CASCADE,
    country_id INTEGER REFERENCES public.countries(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.states ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Access Countries" ON public.countries;
DROP POLICY IF EXISTS "Public Access States" ON public.states;
DROP POLICY IF EXISTS "Public Access Cities" ON public.cities;

CREATE POLICY "Public Access Countries" ON public.countries FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Access States" ON public.states FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Access Cities" ON public.cities FOR ALL USING (true) WITH CHECK (true);

TRUNCATE TABLE public.cities RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.states RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.countries RESTART IDENTITY CASCADE;

INSERT INTO public.countries (
    name, iso2, iso3, phone_code, currency, capital, region, subregion
) VALUES
('Indonesia', 'ID', 'IDN', '+62', 'IDR', 'Jakarta', 'Asia', 'South-Eastern Asia'),
('Malaysia', 'MY', 'MYS', '+60', 'MYR', 'Kuala Lumpur', 'Asia', 'South-Eastern Asia'),
('Saudi Arabia', 'SA', 'SAU', '+966', 'SAR', 'Riyadh', 'Asia', 'Western Asia'),
('Egypt', 'EG', 'EGY', '+20', 'EGP', 'Cairo', 'Africa', 'Northern Africa'),
('Pakistan', 'PK', 'PAK', '+92', 'PKR', 'Islamabad', 'Asia', 'Southern Asia'),
('Bangladesh', 'BD', 'BGD', '+880', 'BDT', 'Dhaka', 'Asia', 'Southern Asia'),
('Turkey', 'TR', 'TUR', '+90', 'TRY', 'Ankara', 'Asia', 'Western Asia'),
('United Arab Emirates', 'AE', 'ARE', '+971', 'AED', 'Abu Dhabi', 'Asia', 'Western Asia'),
('Qatar', 'QA', 'QAT', '+974', 'QAR', 'Doha', 'Asia', 'Western Asia'),
('United Kingdom', 'GB', 'GBR', '+44', 'GBP', 'London', 'Europe', 'Northern Europe');

INSERT INTO public.states (country_id, name, iso2, type) VALUES
((SELECT id FROM public.countries WHERE iso2 = 'ID'), 'DKI Jakarta', 'JK', 'Province'),
((SELECT id FROM public.countries WHERE iso2 = 'MY'), 'Selangor', 'SGR', 'State'),
((SELECT id FROM public.countries WHERE iso2 = 'SA'), 'Makkah Region', '02', 'Region'),
((SELECT id FROM public.countries WHERE iso2 = 'EG'), 'Cairo Governorate', 'C', 'Governorate'),
((SELECT id FROM public.countries WHERE iso2 = 'PK'), 'Punjab', 'PB', 'Province'),
((SELECT id FROM public.countries WHERE iso2 = 'BD'), 'Dhaka Division', 'C', 'Division'),
((SELECT id FROM public.countries WHERE iso2 = 'TR'), 'Istanbul', '34', 'Province'),
((SELECT id FROM public.countries WHERE iso2 = 'AE'), 'Dubai', 'DU', 'Emirate'),
((SELECT id FROM public.countries WHERE iso2 = 'QA'), 'Doha Municipality', 'DA', 'Municipality'),
((SELECT id FROM public.countries WHERE iso2 = 'GB'), 'England', 'ENG', 'Country');

INSERT INTO public.cities (country_id, state_id, name, latitude, longitude) VALUES
(
  (SELECT id FROM public.countries WHERE iso2 = 'ID'),
  (SELECT id FROM public.states WHERE name = 'DKI Jakarta'),
  'Jakarta Selatan', -6.26149300, 106.81060000
),
(
  (SELECT id FROM public.countries WHERE iso2 = 'MY'),
  (SELECT id FROM public.states WHERE name = 'Selangor'),
  'Shah Alam', 3.07327800, 101.51851800
),
(
  (SELECT id FROM public.countries WHERE iso2 = 'SA'),
  (SELECT id FROM public.states WHERE name = 'Makkah Region'),
  'Jeddah', 21.54333300, 39.17277900
),
(
  (SELECT id FROM public.countries WHERE iso2 = 'EG'),
  (SELECT id FROM public.states WHERE name = 'Cairo Governorate'),
  'Cairo', 30.04442000, 31.23571200
),
(
  (SELECT id FROM public.countries WHERE iso2 = 'PK'),
  (SELECT id FROM public.states WHERE name = 'Punjab'),
  'Lahore', 31.52037000, 74.35874900
),
(
  (SELECT id FROM public.countries WHERE iso2 = 'BD'),
  (SELECT id FROM public.states WHERE name = 'Dhaka Division'),
  'Dhaka', 23.81033100, 90.41252100
),
(
  (SELECT id FROM public.countries WHERE iso2 = 'TR'),
  (SELECT id FROM public.states WHERE name = 'Istanbul'),
  'Istanbul', 41.00823800, 28.97835900
),
(
  (SELECT id FROM public.countries WHERE iso2 = 'AE'),
  (SELECT id FROM public.states WHERE name = 'Dubai'),
  'Dubai', 25.20484900, 55.27078200
),
(
  (SELECT id FROM public.countries WHERE iso2 = 'QA'),
  (SELECT id FROM public.states WHERE name = 'Doha Municipality'),
  'Doha', 25.28544700, 51.53104000
),
(
  (SELECT id FROM public.countries WHERE iso2 = 'GB'),
  (SELECT id FROM public.states WHERE name = 'England'),
  'London', 51.50735100, -0.12775800
);
