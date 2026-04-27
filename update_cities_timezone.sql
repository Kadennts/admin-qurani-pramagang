-- Add/Update missing cities with timezone data

-- First, ensure countries exist
INSERT INTO countries (id, name, iso2) VALUES 
(100, 'Indonesia', 'ID'),
(233, 'United States', 'US')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- Ensure states exist
INSERT INTO states (id, name, country_id) VALUES 
(1, 'Jawa Timur', 100),
(2, 'Bali', 100),
(3, 'Jakarta', 100),
(4, 'New York', 233),
(5, 'California', 233)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- Add or update cities
INSERT INTO cities (name, state_id, timezone) VALUES 
('Malang', 1, 'Asia/Jakarta'),
('Surabaya', 1, 'Asia/Jakarta'),
('Denpasar', 2, 'Asia/Makassar'),
('Jakarta', 3, 'Asia/Jakarta'),
('New York City', 4, 'America/New_York'),
('Los Angeles', 5, 'America/Los_Angeles')
ON CONFLICT (name, state_id) DO UPDATE SET timezone = EXCLUDED.timezone;

-- Mapping for Timezone codes in UI (this part is handled in the frontend utility)
