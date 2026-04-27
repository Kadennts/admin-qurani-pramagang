-- ==============================================================
-- 1. TABEL TIMEZONES (Tabel Baru)
-- Karena tabel lokasi lain sudah ada, kita hanya perlu membuat
-- tabel khusus Timezone yang merelasikan Data Negara
-- ==============================================================

CREATE TABLE IF NOT EXISTS timezones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    country_id INTEGER REFERENCES countries(id) ON DELETE CASCADE,
    name TEXT NOT NULL,       -- contoh: 'Asia/Jakarta'
    utc_offset TEXT NOT NULL, -- contoh: '+07:00'
    label TEXT NOT NULL,      -- contoh: 'WIB - Asia/Jakarta (UTC+7)'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- ==============================================================
-- 2. INSERT DATA TABEL BARU SECARA DINAMIS
-- Data timezone akan otomatis mencari ID dari negara yang sudah
-- ada di Supabase Anda berdasarkan nama Negaranya.
-- ==============================================================

INSERT INTO timezones (country_id, name, utc_offset, label)
SELECT id, 'Asia/Jakarta', '+07:00', 'WIB - Asia/Jakarta (UTC+7)' FROM countries WHERE name = 'Indonesia'
ON CONFLICT DO NOTHING;

INSERT INTO timezones (country_id, name, utc_offset, label)
SELECT id, 'Asia/Makassar', '+08:00', 'WITA - Asia/Makassar (UTC+8)' FROM countries WHERE name = 'Indonesia'
ON CONFLICT DO NOTHING;

INSERT INTO timezones (country_id, name, utc_offset, label)
SELECT id, 'Asia/Jayapura', '+09:00', 'WIT - Asia/Jayapura (UTC+9)' FROM countries WHERE name = 'Indonesia'
ON CONFLICT DO NOTHING;

INSERT INTO timezones (country_id, name, utc_offset, label)
SELECT id, 'Europe/London', '+00:00', 'GMT - Europe/London (UTC+0)' FROM countries WHERE name IN ('United Kingdom', 'UK', 'Inggris') LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO timezones (country_id, name, utc_offset, label)
SELECT id, 'Asia/Tokyo', '+09:00', 'JST - Asia/Tokyo (UTC+9)' FROM countries WHERE name IN ('Japan', 'Jepang') LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO timezones (country_id, name, utc_offset, label)
SELECT id, 'America/New_York', '-05:00', 'EST - America/New_York (UTC-5)' FROM countries WHERE name IN ('United States', 'US', 'Amerika Serikat') LIMIT 1
ON CONFLICT DO NOTHING;


-- ==============================================================
-- 3. INSERT DATA TAMBAHAN KE TABEL YANG SUDAH ADA
-- Anda hanya perlu menjalankan ini jika data masih kosong.
-- Abaikan (hapus baris di bawah) jika isinya sudah lengkap.
-- ==============================================================

INSERT INTO languages (name, code) VALUES 
    ('Indonesian', 'id'),
    ('English', 'en'),
    ('Japanese', 'jp');

INSERT INTO currencies (name, code, symbol) VALUES 
    ('Rupiah', 'IDR', 'Rp'),
    ('Pound Sterling', 'GBP', '£'),
    ('US Dollar', 'USD', '$'),
    ('Japanese Yen', 'JPY', '¥');

-- Untuk Insert Data Countries, States, Cities, dan Tax_rates
-- karena tabel ini saling berelasi dengan tipe UUID, sangat
-- disarankan Anda menambahkan datanya langsung via 
-- Dashboard UI Supabase > Table Editor agar tidak error 
-- jika UUID induknya (seperti country_id) tidak tersambung.
