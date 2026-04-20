-- Tabel Support Tickets
CREATE TABLE IF NOT EXISTS public.support_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id_str VARCHAR(50) UNIQUE NOT NULL,
    subject VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Open',
    priority VARCHAR(50) NOT NULL DEFAULT 'Medium',
    department VARCHAR(100) NOT NULL DEFAULT 'TECHNICAL',
    contact_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    last_reply_at TIMESTAMP WITH TIME ZONE
);

-- Hapus data lama jika ada (jika ingin reset)
TRUNCATE TABLE public.support_tickets;

-- Insert Mock Data Berdasarkan Gambar (Open, In Progress, Answered, On Hold)
INSERT INTO public.support_tickets (ticket_id_str, subject, status, priority, department, contact_name, created_at, last_reply_at)
VALUES
-- Status: Open
('88F2090B', 'Tambahan fitur baru', 'Open', 'Medium', 'TECHNICAL', 'Virly', '2026-01-25 20:43:00+00', '2026-01-28 14:40:00+00'),
('TKT-M4N5O6', 'Cara upgrade membership', 'Open', 'Low', 'TECHNICAL', 'Abdullah Mahmud', '2024-12-16 18:30:00+00', NULL),
('TKT-A1B2C3', 'Tidak bisa login ke akun', 'Open', 'Low', 'TECHNICAL', 'Ahmad Fauzi', '2024-12-15 15:30:00+00', NULL),

-- Status: In Progress
('TKT-O4P5Q6', 'Error upload tugas', 'In Progress', 'Medium', 'TECHNICAL', 'Ismail Taufik', '2024-12-18 22:30:00+00', '2024-12-18 17:00:00+00'),
('TKT-B1C2D3', 'Tidak bisa akses materi', 'In Progress', 'Medium', 'TECHNICAL', 'Aminah Putri', '2024-12-16 21:20:00+00', '2024-12-16 16:00:00+00'),
('TKT-Q7R8S9', 'Request fitur baru', 'In Progress', 'Medium', 'TECHNICAL', 'Umar Farhan', '2024-12-14 23:00:00+00', '2024-12-15 09:00:00+00'),
('TKT-G7H8I9', 'Video kursus tidak bisa diputar', 'In Progress', 'High', 'TECHNICAL', 'Muhammad Rizki', '2024-12-13 16:00:00+00', '2024-12-13 11:00:00+00'),

-- Status: Answered
('CB9A9F66', 'Marketplace', 'Answered', 'Low', 'TECHNICAL', 'Virly', '2026-03-12 09:38:00+00', '2026-03-25 13:15:00+00'),
('41FFA6AC', 'Ada masalah pada grup', 'Answered', 'Low', 'TECHNICAL', 'Fatkul Amri', '2026-03-12 08:03:00+00', NULL),
('EF5295C7', 'Tampilan yang kurang menarik', 'Answered', 'Medium', 'TECHNICAL', 'Virly', '2026-01-27 14:40:00+00', '2026-03-10 08:33:00+00'),
('3160A64A', 'web nya lamban', 'Answered', 'Medium', 'TECHNICAL', 'Annisa', '2026-01-26 10:51:00+00', '2026-01-28 04:29:00+00'),

-- Status: On Hold
('TKT-W4X5Y6', 'Data kursus hilang', 'On Hold', 'High', 'TECHNICAL', 'Khalid Ridwan', '2024-12-12 15:00:00+00', '2024-12-12 10:00:00+00'),
('TKT-P7Q8R9', 'Sertifikat belum diterima', 'On Hold', 'Medium', 'TECHNICAL', 'Khadijah Nur', '2024-12-08 20:00:00+00', '2024-12-09 10:00:00+00');
