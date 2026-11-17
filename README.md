# Frontend CRUD Data Siswa (React.js)

Aplikasi antarmuka pengguna (Frontend) untuk manajemen CRUD Data Siswa yang dibangun menggunakan **React.js** (Vite), meng-consume RESTful API dari backend Express.js.

Tugas Praktik Skema: **Pengembangan Web dengan Node.js dan React** (Waktu 180 menit).

---

## ✨ Fitur Aplikasi
- **Menampilkan Data Siswa**: Tabel responsif dengan format tanggal Indonesia, badge kode siswa, dan badge warna jurusan.
- **Menambah Data Siswa**: Formulir modal dengan validasi input (Kode Siswa, Nama Siswa, Alamat Siswa, Tgl Siswa, Jurusan Siswa) serta saran otomatis kode berikutnya.
- **Mengedit Data Siswa**: Formulir modal edit yang terisi otomatis dengan data siswa yang dipilih.
- **Menghapus Data Siswa**: Dilengkapi modal konfirmasi untuk mencegah penghapusan data secara tidak sengaja.
- **Pencarian & Filter**: Pencarian real-time berdasarkan kode, nama, alamat, atau jurusan, serta dropdown filter jurusan.
- **Statistik Ringkas**: Kartu ringkasan total siswa terdaftar, total program jurusan, dan jurusan terbanyak.
- **Status Koneksi Backend**: Indikator koneksi API real-time dan notifikasi Toast (sukses / gagal).

---

## 🛠️ Prasyarat
- **Node.js** v18+ (direkomendasikan v20+)
- **Backend Express.js** telah berjalan di `http://localhost:5000`

---

## 🚀 Cara Menjalankan Frontend

1. Buka terminal di folder `Frontend`:
   ```bash
   cd Frontend
   ```

2. Install dependencies (jika belum):
   ```bash
   npm install
   ```

3. Jalankan server development:
   ```bash
   npm run dev
   ```

4. Buka browser pada URL yang ditampilkan di terminal (biasanya `http://localhost:5173`).

---

## ⚙️ Konfigurasi URL API Backend
Secara default, frontend menghubungi API backend di `http://localhost:5000/api/siswa`.
Jika port backend berbeda, buat file `.env` di folder `Frontend`:
```env
VITE_API_URL=http://localhost:5000/api/siswa
```

---

## 📦 Build Production
Untuk melakukan build siap saji (production):
```bash
npm run build
```
Hasil build akan tersimpan di direktori `dist/`.
