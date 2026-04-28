## Admin Feature Structure

- `dashboard/`
  - `data/`: query Supabase untuk statistik admin dashboard
  - `hooks/`: state dan flow halaman dashboard admin
  - `model/`: type dan helper agregasi data
  - `ui/`: komponen tampilan dashboard admin
- `users/`
  - `data/`: query Supabase untuk daftar user dan master lokasi
  - `hooks/`: state pencarian, pagination, modal edit, dan save user
  - `model/`: type, constants, dan helper list user
  - `ui/`: tampilan tabel user dan modal edit
