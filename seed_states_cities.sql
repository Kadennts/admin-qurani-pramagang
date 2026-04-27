-- ==============================================================
-- INSERT DATA: States & Cities untuk 10 Negara di Supabase
-- Jalankan di SQL Editor Supabase Anda.
-- CATATAN: Script ini menggunakan negara yang sudah ada di
-- tabel 'countries' Anda. ID negara dicari secara dinamis.
-- ==============================================================


-- ===== STATES / PROVINCES =====
-- Indonesia
INSERT INTO states (country_id, name, iso2, type) SELECT id, 'Jawa Timur',       'JI',  'province'   FROM countries WHERE name = 'Indonesia' LIMIT 1;
INSERT INTO states (country_id, name, iso2, type) SELECT id, 'Jawa Barat',       'JB',  'province'   FROM countries WHERE name = 'Indonesia' LIMIT 1;
INSERT INTO states (country_id, name, iso2, type) SELECT id, 'Jawa Tengah',      'JT',  'province'   FROM countries WHERE name = 'Indonesia' LIMIT 1;
INSERT INTO states (country_id, name, iso2, type) SELECT id, 'Sulawesi Selatan', 'SN',  'province'   FROM countries WHERE name = 'Indonesia' LIMIT 1;
INSERT INTO states (country_id, name, iso2, type) SELECT id, 'Sumatera Utara',   'SU',  'province'   FROM countries WHERE name = 'Indonesia' LIMIT 1;
INSERT INTO states (country_id, name, iso2, type) SELECT id, 'Papua',            'PA',  'province'   FROM countries WHERE name = 'Indonesia' LIMIT 1;
INSERT INTO states (country_id, name, iso2, type) SELECT id, 'Bali',             'BA',  'province'   FROM countries WHERE name = 'Indonesia' LIMIT 1;
INSERT INTO states (country_id, name, iso2, type) SELECT id, 'Kalimantan Timur', 'KI',  'province'   FROM countries WHERE name = 'Indonesia' LIMIT 1;
INSERT INTO states (country_id, name, iso2, type) SELECT id, 'Riau',             'RI',  'province'   FROM countries WHERE name = 'Indonesia' LIMIT 1;

-- Malaysia
INSERT INTO states (country_id, name, iso2, type) SELECT id, 'Kuala Lumpur',     'KUL', 'territory'  FROM countries WHERE name = 'Malaysia' LIMIT 1;
INSERT INTO states (country_id, name, iso2, type) SELECT id, 'Johor',            'JHR', 'state'      FROM countries WHERE name = 'Malaysia' LIMIT 1;
INSERT INTO states (country_id, name, iso2, type) SELECT id, 'Penang',           'PNG', 'state'      FROM countries WHERE name = 'Malaysia' LIMIT 1;
INSERT INTO states (country_id, name, iso2, type) SELECT id, 'Sabah',            'SBH', 'state'      FROM countries WHERE name = 'Malaysia' LIMIT 1;

-- Saudi Arabia
INSERT INTO states (country_id, name, iso2, type) SELECT id, 'Riyadh Region',    '01',  'region'     FROM countries WHERE name = 'Saudi Arabia' LIMIT 1;
INSERT INTO states (country_id, name, iso2, type) SELECT id, 'Madinah Region',   '03',  'region'     FROM countries WHERE name = 'Saudi Arabia' LIMIT 1;
INSERT INTO states (country_id, name, iso2, type) SELECT id, 'Eastern Province', '04',  'region'     FROM countries WHERE name = 'Saudi Arabia' LIMIT 1;

-- Egypt
INSERT INTO states (country_id, name, iso2, type) SELECT id, 'Alexandria',       'ALX', 'governorate' FROM countries WHERE name = 'Egypt' LIMIT 1;
INSERT INTO states (country_id, name, iso2, type) SELECT id, 'Giza',             'GZ',  'governorate' FROM countries WHERE name = 'Egypt' LIMIT 1;

-- Pakistan
INSERT INTO states (country_id, name, iso2, type) SELECT id, 'Sindh',            'SD',  'province'   FROM countries WHERE name = 'Pakistan' LIMIT 1;
INSERT INTO states (country_id, name, iso2, type) SELECT id, 'Khyber Pakhtunkhwa', 'KP', 'province'  FROM countries WHERE name = 'Pakistan' LIMIT 1;

-- Bangladesh
INSERT INTO states (country_id, name, iso2, type) SELECT id, 'Chittagong Division', 'B', 'division'  FROM countries WHERE name = 'Bangladesh' LIMIT 1;

-- Turkey
INSERT INTO states (country_id, name, iso2, type) SELECT id, 'Ankara',           '06',  'province'   FROM countries WHERE name = 'Turkey' LIMIT 1;
INSERT INTO states (country_id, name, iso2, type) SELECT id, 'Izmir',            '35',  'province'   FROM countries WHERE name = 'Turkey' LIMIT 1;

-- UAE
INSERT INTO states (country_id, name, iso2, type) SELECT id, 'Abu Dhabi',        'AZ',  'emirate'    FROM countries WHERE name = 'United Arab Emirates' LIMIT 1;
INSERT INTO states (country_id, name, iso2, type) SELECT id, 'Sharjah',          'SH',  'emirate'    FROM countries WHERE name = 'United Arab Emirates' LIMIT 1;

-- Qatar
INSERT INTO states (country_id, name, iso2, type) SELECT id, 'Al Rayyan',        'RA',  'municipality' FROM countries WHERE name = 'Qatar' LIMIT 1;

-- United Kingdom
INSERT INTO states (country_id, name, iso2, type) SELECT id, 'Scotland',         'SCT', 'country'    FROM countries WHERE name = 'United Kingdom' LIMIT 1;
INSERT INTO states (country_id, name, iso2, type) SELECT id, 'Wales',            'WLS', 'country'    FROM countries WHERE name = 'United Kingdom' LIMIT 1;


-- ===== CITIES =====
-- Indonesia – DKI Jakarta
INSERT INTO cities (state_id, name, latitude, longitude) SELECT id, 'Jakarta Pusat', -6.1862, 106.8341  FROM states WHERE name = 'DKI Jakarta' LIMIT 1;
INSERT INTO cities (state_id, name, latitude, longitude) SELECT id, 'Jakarta Barat', -6.1682, 106.7637  FROM states WHERE name = 'DKI Jakarta' LIMIT 1;
INSERT INTO cities (state_id, name, latitude, longitude) SELECT id, 'Jakarta Utara', -6.1214, 106.9040  FROM states WHERE name = 'DKI Jakarta' LIMIT 1;
INSERT INTO cities (state_id, name, latitude, longitude) SELECT id, 'Jakarta Timur', -6.2250, 106.9004  FROM states WHERE name = 'DKI Jakarta' LIMIT 1;

-- Indonesia – Jawa Timur
INSERT INTO cities (state_id, name, latitude, longitude) SELECT id, 'Surabaya',    -7.2575, 112.7521 FROM states WHERE name = 'Jawa Timur' LIMIT 1;
INSERT INTO cities (state_id, name, latitude, longitude) SELECT id, 'Malang',      -7.9797, 112.6304 FROM states WHERE name = 'Jawa Timur' LIMIT 1;
INSERT INTO cities (state_id, name, latitude, longitude) SELECT id, 'Mojokerto',   -7.4675, 112.4342 FROM states WHERE name = 'Jawa Timur' LIMIT 1;
INSERT INTO cities (state_id, name, latitude, longitude) SELECT id, 'Sidoarjo',    -7.4558, 112.7183 FROM states WHERE name = 'Jawa Timur' LIMIT 1;
INSERT INTO cities (state_id, name, latitude, longitude) SELECT id, 'Pasuruan',    -7.6453, 112.9075 FROM states WHERE name = 'Jawa Timur' LIMIT 1;
INSERT INTO cities (state_id, name, latitude, longitude) SELECT id, 'Banyuwangi',  -8.2191, 114.3691 FROM states WHERE name = 'Jawa Timur' LIMIT 1;

-- Indonesia – Sulawesi Selatan
INSERT INTO cities (state_id, name, latitude, longitude) SELECT id, 'Makassar',    -5.1477, 119.4327 FROM states WHERE name = 'Sulawesi Selatan' LIMIT 1;
INSERT INTO cities (state_id, name, latitude, longitude) SELECT id, 'Gowa',        -5.2787, 119.4441 FROM states WHERE name = 'Sulawesi Selatan' LIMIT 1;
INSERT INTO cities (state_id, name, latitude, longitude) SELECT id, 'Bone',        -4.5554, 120.3259 FROM states WHERE name = 'Sulawesi Selatan' LIMIT 1;

-- Indonesia – Papua
INSERT INTO cities (state_id, name, latitude, longitude) SELECT id, 'Jayapura',    -2.5337, 140.7180 FROM states WHERE name = 'Papua' LIMIT 1;
INSERT INTO cities (state_id, name, latitude, longitude) SELECT id, 'Sorong',      -0.8750, 131.2500 FROM states WHERE name = 'Papua' LIMIT 1;

-- Indonesia – Bali
INSERT INTO cities (state_id, name, latitude, longitude) SELECT id, 'Denpasar',    -8.6705, 115.2126 FROM states WHERE name = 'Bali' LIMIT 1;
INSERT INTO cities (state_id, name, latitude, longitude) SELECT id, 'Ubud',        -8.5069, 115.2625 FROM states WHERE name = 'Bali' LIMIT 1;

-- Malaysia – Selangor
INSERT INTO cities (state_id, name, latitude, longitude) SELECT id, 'Petaling Jaya', 3.1073, 101.6069 FROM states WHERE name = 'Selangor' LIMIT 1;
INSERT INTO cities (state_id, name, latitude, longitude) SELECT id, 'Klang',       3.0444, 101.4481 FROM states WHERE name = 'Selangor' LIMIT 1;
INSERT INTO cities (state_id, name, latitude, longitude) SELECT id, 'Ampang',      3.1500, 101.7500 FROM states WHERE name = 'Selangor' LIMIT 1;

-- Malaysia – Kuala Lumpur
INSERT INTO cities (state_id, name, latitude, longitude) SELECT id, 'Kuala Lumpur City', 3.1390, 101.6869 FROM states WHERE name = 'Kuala Lumpur' LIMIT 1;
INSERT INTO cities (state_id, name, latitude, longitude) SELECT id, 'Bukit Bintang',     3.1466, 101.7109 FROM states WHERE name = 'Kuala Lumpur' LIMIT 1;

-- Saudi Arabia – Makkah Region
INSERT INTO cities (state_id, name, latitude, longitude) SELECT id, 'Mecca',       21.3891, 39.8579 FROM states WHERE name = 'Makkah Region' LIMIT 1;
INSERT INTO cities (state_id, name, latitude, longitude) SELECT id, 'Taif',        21.2703, 40.4158 FROM states WHERE name = 'Makkah Region' LIMIT 1;

-- Saudi Arabia – Riyadh Region
INSERT INTO cities (state_id, name, latitude, longitude) SELECT id, 'Riyadh',      24.6877, 46.7219 FROM states WHERE name = 'Riyadh Region' LIMIT 1;
INSERT INTO cities (state_id, name, latitude, longitude) SELECT id, 'Al Kharj',    24.1536, 47.3122 FROM states WHERE name = 'Riyadh Region' LIMIT 1;

-- Saudi Arabia – Madinah Region
INSERT INTO cities (state_id, name, latitude, longitude) SELECT id, 'Medina',      24.5247, 39.5692 FROM states WHERE name = 'Madinah Region' LIMIT 1;
INSERT INTO cities (state_id, name, latitude, longitude) SELECT id, 'Yanbu',       24.0895, 38.0618 FROM states WHERE name = 'Madinah Region' LIMIT 1;

-- Egypt – Cairo Governorate
INSERT INTO cities (state_id, name, latitude, longitude) SELECT id, 'Heliopolis',  30.0870, 31.3291 FROM states WHERE name = 'Cairo Governorate' LIMIT 1;

-- Egypt – Alexandria
INSERT INTO cities (state_id, name, latitude, longitude) SELECT id, 'Alexandria',  31.2001, 29.9187 FROM states WHERE name = 'Alexandria' LIMIT 1;
INSERT INTO cities (state_id, name, latitude, longitude) SELECT id, 'Sidi Gaber',  31.2107, 29.9479 FROM states WHERE name = 'Alexandria' LIMIT 1;

-- Egypt – Giza
INSERT INTO cities (state_id, name, latitude, longitude) SELECT id, 'Giza',        30.0131, 31.2089 FROM states WHERE name = 'Giza' LIMIT 1;

-- Pakistan – Punjab
INSERT INTO cities (state_id, name, latitude, longitude) SELECT id, 'Faisalabad',  31.4504, 73.1350 FROM states WHERE name = 'Punjab' LIMIT 1;
INSERT INTO cities (state_id, name, latitude, longitude) SELECT id, 'Rawalpindi',  33.5651, 73.0169 FROM states WHERE name = 'Punjab' LIMIT 1;
INSERT INTO cities (state_id, name, latitude, longitude) SELECT id, 'Multan',      30.1575, 71.5249 FROM states WHERE name = 'Punjab' LIMIT 1;

-- Pakistan – Sindh
INSERT INTO cities (state_id, name, latitude, longitude) SELECT id, 'Karachi',     24.8607, 67.0011 FROM states WHERE name = 'Sindh' LIMIT 1;
INSERT INTO cities (state_id, name, latitude, longitude) SELECT id, 'Hyderabad',   25.3960, 68.3578 FROM states WHERE name = 'Sindh' LIMIT 1;

-- Bangladesh – Dhaka Division
INSERT INTO cities (state_id, name, latitude, longitude) SELECT id, 'Narayanganj', 23.6238, 90.4998 FROM states WHERE name = 'Dhaka Division' LIMIT 1;
INSERT INTO cities (state_id, name, latitude, longitude) SELECT id, 'Gazipur',     23.9999, 90.4203 FROM states WHERE name = 'Dhaka Division' LIMIT 1;

-- Bangladesh – Chittagong
INSERT INTO cities (state_id, name, latitude, longitude) SELECT id, 'Chittagong',  22.3569, 91.7832 FROM states WHERE name = 'Chittagong Division' LIMIT 1;
INSERT INTO cities (state_id, name, latitude, longitude) SELECT id, 'Cox''s Bazar',21.4272, 92.0058 FROM states WHERE name = 'Chittagong Division' LIMIT 1;

-- Turkey – Istanbul
INSERT INTO cities (state_id, name, latitude, longitude) SELECT id, 'Kadıköy',     40.9909, 29.0236 FROM states WHERE name = 'Istanbul' LIMIT 1;
INSERT INTO cities (state_id, name, latitude, longitude) SELECT id, 'Beşiktaş',    41.0429, 29.0086 FROM states WHERE name = 'Istanbul' LIMIT 1;

-- Turkey – Ankara
INSERT INTO cities (state_id, name, latitude, longitude) SELECT id, 'Ankara',      39.9334, 32.8597 FROM states WHERE name = 'Ankara' LIMIT 1;
INSERT INTO cities (state_id, name, latitude, longitude) SELECT id, 'Çankaya',     39.9179, 32.8628 FROM states WHERE name = 'Ankara' LIMIT 1;

-- UAE – Abu Dhabi
INSERT INTO cities (state_id, name, latitude, longitude) SELECT id, 'Abu Dhabi',   24.4539, 54.3773 FROM states WHERE name = 'Abu Dhabi' LIMIT 1;
INSERT INTO cities (state_id, name, latitude, longitude) SELECT id, 'Al Ain',      24.2075, 55.7447 FROM states WHERE name = 'Abu Dhabi' LIMIT 1;

-- Qatar – Al Rayyan
INSERT INTO cities (state_id, name, latitude, longitude) SELECT id, 'Al Rayyan',   25.2924, 51.4138 FROM states WHERE name = 'Al Rayyan' LIMIT 1;

-- UK – England
INSERT INTO cities (state_id, name, latitude, longitude) SELECT id, 'Manchester',  53.4808, -2.2426  FROM states WHERE name = 'England' LIMIT 1;
INSERT INTO cities (state_id, name, latitude, longitude) SELECT id, 'Birmingham',  52.4862, -1.8904  FROM states WHERE name = 'England' LIMIT 1;
INSERT INTO cities (state_id, name, latitude, longitude) SELECT id, 'Leeds',       53.8008, -1.5491  FROM states WHERE name = 'England' LIMIT 1;
INSERT INTO cities (state_id, name, latitude, longitude) SELECT id, 'Sheffield',   53.3811, -1.4701  FROM states WHERE name = 'England' LIMIT 1;

-- UK – Scotland
INSERT INTO cities (state_id, name, latitude, longitude) SELECT id, 'Edinburgh',   55.9533, -3.1883  FROM states WHERE name = 'Scotland' LIMIT 1;
INSERT INTO cities (state_id, name, latitude, longitude) SELECT id, 'Glasgow',     55.8642, -4.2518  FROM states WHERE name = 'Scotland' LIMIT 1;

-- UK – Wales
INSERT INTO cities (state_id, name, latitude, longitude) SELECT id, 'Cardiff',     51.4816, -3.1791  FROM states WHERE name = 'Wales' LIMIT 1;
