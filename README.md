# Frontend User Dashboard

SPA React untuk menampilkan user dari DummyJSON (data contoh publik). UI saya buat sendiri menggunakan Tailwind CSS, tanpa template dashboard.

## Menjalankan proyek

Gunakan Node.js 22.12+ pada versi mayor 22 dan npm. Proyek ini diperiksa menggunakan Node.js 22.18.0.

```sh
npm ci
npm run dev
```

Buka alamat lokal yang muncul di terminal.

Pemeriksaan sebelum deploy:

```sh
npm run lint
npm run build
```

Hasil build tersimpan di folder `dist`.

## Fitur

- Tabel responsif berisi 30 user dari API DummyJSON.
- Pencarian nama atau email di sisi client, tanpa membedakan huruf besar/kecil.
- Pagination client-side, 10 user per halaman. Pencarian dilakukan pada seluruh 30 user dan pencarian baru kembali ke halaman 1.
- Klik baris atau nama untuk membuka modal detail berisi username, email, telepon, alamat, perusahaan, jabatan, dan departemen.
- Modal bisa ditutup dengan Escape atau tombol silang, dan fokus kembali ke pemicunya.
- Loading, pesan error yang ramah, timeout 15 detik, dan tombol Coba lagi.
- Pesan berbeda untuk data API kosong dan pencarian tanpa hasil.

Endpoint yang digunakan:

```text
https://dummyjson.com/users?limit=30&select=firstName,lastName,username,email,phone,address,company
```

## Pertanyaan Pemahaman

### 1. State Management & Lifecycle

Fetching saya lakukan di custom hook `useUsers`, menggunakan `fetch` di dalam `useEffect`. Hasilnya disimpan di state `users`, sedangkan `isLoading` dan `error` menentukan tampilan.

Di `App`, `search`, `page`, dan `selectedUser` disimpan menggunakan `useState`. Hasil pencarian dan data halaman aktif dihitung dari state tersebut, tanpa disalin ke state tambahan.

**Mencegah infinite loop:** dependency effect hanya `attempt`, yaitu penghitung yang naik saat tombol Coba lagi ditekan. Mengetik di kolom pencarian atau memperbarui `users` tidak memicu fetch baru. Endpoint juga didefinisikan sebagai konstanta di luar hook.

**Cleanup request:** cleanup effect membatalkan request menggunakan `AbortController`, membersihkan timer timeout, dan menandai effect sudah tidak aktif. Hasil request lama diabaikan agar tidak memperbarui state setelah unmount atau setelah ada request pengganti.

Di development, StrictMode bisa menjalankan setup-cleanup-setup. Karena itu, request pertama mungkin terlihat sebagai *canceled* di tab Network. Ini perilaku normal, bukan infinite loop.

### 2. Struktur Folder

```text
src/
  App.jsx                  # Susunan UI, pencarian, pagination, user terpilih
  main.jsx                 # Entry React dan StrictMode
  index.css                # Import Tailwind dan CSS scrollbar
  components/
    UserTable.jsx          # Tabel, baris user, navigasi halaman
    UserDetailsModal.jsx   # Detail dan perilaku dialog
  hooks/
    useUsers.js            # Fetch, loading, error, retry, cleanup
```

Saya memisahkan file berdasarkan tanggung jawabnya. `App` mengatur halaman, `UserTable` dan `UserDetailsModal` mengurus tampilan masing-masing, sedangkan `useUsers` menangani komunikasi dengan API.

Pemisahan ini membuat perubahan UI tidak bercampur dengan logika request. Untuk satu halaman dengan satu modal, state lokal menggunakan `useState` sudah cukup, sehingga saya tidak memakai library global state atau router.

### 3. Optimasi Kinerja untuk 10.000 Data

Versi sekarang menggunakan filter langsung karena hanya memuat 30 user. Jika API mengembalikan 10.000 user dan pengetikan menjadi lambat, saya akan mempertimbangkan:

- `useDeferredValue(search)` untuk memberi prioritas lebih rendah pada pembaruan hasil pencarian. Input tetap menggunakan `search` agar pembaruan saat mengetik diprioritaskan.
- `useMemo` untuk menghitung hasil filter berdasarkan `users` dan nilai pencarian yang ditunda, sehingga perhitungan tidak diulang ketika dependency tersebut tidak berubah.
- `React.memo` pada komponen tabel, dengan props yang stabil, agar render input dapat melewati tabel saat datanya belum berubah.

`useDeferredValue` tidak mengurangi jumlah data dan tidak membuat proses filtering sinkron menjadi asynchronous.

Aplikasi sudah menggunakan pagination 10 user per halaman untuk membatasi jumlah baris yang dirender. Jika dibutuhkan tampilan daftar panjang tanpa pagination, saya akan mempertimbangkan virtualisasi. Jika proses filtering masih berat, saya akan mempertimbangkan Web Worker atau pencarian di server.