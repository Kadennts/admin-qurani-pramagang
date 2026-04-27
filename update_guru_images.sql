-- SQL Script Update Avatar URL Guru
-- Sesuai dengan spesifikasi file gambar di dalam folder public/img Anda.

UPDATE master_guru SET avatar_url = '/img/profil1.jpg' WHERE name ILIKE '%Hasyim%';
UPDATE master_guru SET avatar_url = '/img/profil2.jpg' WHERE name ILIKE '%Indi%';
UPDATE master_guru SET avatar_url = '/img/profil3.jpg' WHERE name ILIKE '%Nanda%';
