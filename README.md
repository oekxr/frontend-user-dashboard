# Frontend User Dashboard

SPA React untuk menampilkan pengguna dari DummyJSON (data contoh publik). UI saya buat sendiri pakai Tailwind CSS, tanpa template dashboard.

## Menjalankan proyek

Pakai Node.js 22.12+ (dicek di 22.18.0) dan npm.

```sh
npm ci
npm run dev
```

Pemeriksaan sebelum deploy: `npm run lint` dan `npm run build`.

## Fitur

- Tabel responsif berisi 30 pengguna dari `https://dummyjson.com/users?limit=30&select=firstName,lastName,username,email,phone,address,company`.
- Pencarian nama atau email di sisi client, tidak peduli huruf besar/kecil.
- Pagination client-side, 10 pengguna per halaman. Pencarian baru kembali ke halaman 1.
- Klik baris atau nama untuk membuka modal detail (username, email, telepon, alamat, perusahaan, jabatan, departemen). Modal bisa ditutup dengan Escape atau tombol silang, dan fokus kembali ke pemicunya.
- Ada loading, pesan error yang ramah, timeout 15 detik, dan tombol Coba lagi. Pesan untuk API kosong dan pencarian tanpa hasil dibedakan.

## Pertanyaan Pemahaman

### 1. State Management & Lifecycle

Fetching saya lakukan di custom hook `useUsers`, memakai `fetch` di dalam `useEffect`. Hasilnya disimpan di state `users`, dan `isLoading` serta `error` menentukan tampilan. Di `App`, `search`, `page`, dan `selectedUser` disimpan dengan `useState`. Daftar hasil pencarian dihitung langsung dari `users` dan `search`, tidak disalin ke state lain.

**Mencegah infinite loop:** dependency effect hanya `attempt`, yaitu penghitung yang naik saat tombol Coba lagi ditekan. Mengetik di kolom pencarian atau mengubah `users` tidak memicu fetch baru. Endpoint juga saya taruh sebagai konstanta di luar hook.

**Mencegah memory leak:** cleanup effect membatalkan request dengan `AbortController`, membersihkan timer timeout, dan menandai effect sudah tidak aktif. Jadi hasil request lama diabaikan dan tidak mengubah state setelah unmount atau setelah ada request pengganti.

Catatan: di development, StrictMode bisa menjalankan setup-cleanup-setup, jadi request pertama kadang terlihat *canceled* di tab Network. Itu perilaku normal, bukan infinite loop.

### 2. Struktur Folder

```text
src/
  App.jsx                  # Susunan UI, pencarian, pagination, pengguna terpilih
  main.jsx                 # Entry React dan StrictMode
  index.css                # Import Tailwind
  components/
    UserTable.jsx          # Tabel, baris pengguna, navigasi halaman
    UserDetailsModal.jsx   # Detail dan perilaku dialog
  hooks/
    useUsers.js            # Fetch, loading, error, retry, cleanup
```

Saya memisahkan file berdasarkan tanggung jawabnya. `App` mengatur halaman, `UserTable` dan `UserDetailsModal` mengurus tampilan masing-masing, dan `useUsers` khusus untuk komunikasi dengan API. Dengan begini, mengubah UI tidak bercampur dengan logika request. Untuk satu halaman dengan satu modal, `useState` sudah cukup, jadi saya tidak memakai library global state atau router.

### 3. Optimasi Kinerja (10.000 data)

Versi sekarang memakai filter langsung karena datanya hanya 30. Kalau API mengembalikan 10.000 data dan mengetik jadi lag, saya akan memakai:

- `useDeferredValue(search)` supaya pengetikan diprioritaskan dan filter yang berat berjalan belakangan. Input tetap memakai `search`.
- `useMemo` untuk menghitung hasil filter dari `users` dan nilai pencarian yang ditunda.
- `React.memo` pada komponen daftar supaya tidak ikut dirender ulang saat hanya input yang berubah.

Perlu dicatat, `useDeferredValue` tidak mengurangi jumlah data. Karena itu saya juga akan menambah virtualisasi atau pagination supaya ribuan baris tidak dirender sekaligus. Kalau filter-nya sendiri masih berat, pindahkan ke Web Worker atau pencarian di server.