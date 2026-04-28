## Feature Folder Convention

Gunakan pola ini untuk setiap feature baru:

- `data/`
  - akses Supabase, fetch, insert, update, delete
- `hooks/`
  - state halaman, flow aksi, orchestration UI
- `model/`
  - types, constants, utils, formatter, mapper
- `ui/`
  - komponen tampilan dan komponen kecil khusus feature

Aturan praktis:

- `page.tsx` di `src/app/...` harus tipis, hanya menjadi entry point
- query database jangan ditulis langsung di page atau view
- komponen `ui/` sebaiknya tidak tahu detail query Supabase
- logic filter, pagination, aggregation, mapping data diletakkan di `hooks/` atau `model/`
