-- SQL Script untuk menambahkan kolom baru yang dibutuhkan untuk UI Users,
-- beserta data 1 User Admin Utama & 4 User Test UTC 

-- 1. Tambahkan kolom baru (jika belum ada) agar sesuai dengan form Edit yang baru
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS country TEXT,
ADD COLUMN IF NOT EXISTS province TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Active';

-- 2. Insert baris baru (gen_random_uuid dideklarasikan agar mendapatkan unique ID)
INSERT INTO user_profiles (id, username, full_name, email, role, status, created_at)
VALUES 
(gen_random_uuid(), 'admin', 'Admin Utama', 'admin@qurani.com', 'Admin', 'Active', NOW()),
(gen_random_uuid(), 'admin_london', 'Admin London', 'london@qurani.com', 'Admin', 'Active', NOW()),
(gen_random_uuid(), 'admin_tokyo', 'Admin Tokyo', 'tokyo@qurani.com', 'Admin', 'Active', NOW()),
(gen_random_uuid(), 'admin_ny', 'Admin New York', 'ny@qurani.com', 'Admin', 'Active', NOW()),
(gen_random_uuid(), 'admin_sydney', 'Admin Sydney', 'sydney@qurani.com', 'Admin', 'Active', NOW());
