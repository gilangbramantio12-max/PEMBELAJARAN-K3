# K3Learn — Platform Kursus & Kuis Keselamatan dan Kesehatan Kerja (K3)

> **"Belajar K3, Ciptakan Lingkungan Kerja Aman"**  
> Platform pembelajaran daring interaktif modern untuk edukasi K3, penerapan SMK3 PP 50/2012, studi kasus bahaya industri, kuis berbobot dengan skoring otomatis di server, dan penerbitan sertifikat digital terverifikasi.

---

## 📌 Daftar Isi
1. [Tentang K3Learn](#-tentang-k3learn)
2. [Fitur Unggulan](#-fitur-unggulan)
3. [Teknologi yang Digunakan](#-teknologi-yang-digunakan)
4. [Arsitektur Keamanan & Skoring Server](#-arsitektur-keamanan--skoring-server)
5. [Struktur Proyek](#-struktur-proyek)
6. [Panduan Instalasi Lokal](#-panduan-instalasi-lokal)
7. [Konfigurasi Database Supabase & Migrasi](#-konfigurasi-database-supabase--migrasi)
8. [Panduan Deployment ke Vercel](#-panduan-deployment-ke-vercel)
9. [Menjalankan Pengujian (Testing)](#-menjalankan-pengujian-testing)
10. [Keterangan & Disclaimer Resmi K3](#-keterangan--disclaimer-resmi-k3)

---

## 🌟 Tentang K3Learn

K3Learn adalah aplikasi web berbasis **React + TypeScript + Tailwind CSS** yang didukung backend relasional **Supabase (PostgreSQL + RLS)**. Aplikasi ini dirancang untuk:
- Siswa dan mahasiswa kejuruan/teknik.
- Karyawan baru dan staf industri (*safety induction*).
- Peserta pelatihan K3 mandiri.
- Admin, instruktur, dan praktisi HSE (*Health, Safety, and Environment*).

Mencakup 6 pilar materi K3 wajib:
1. **Dasar-dasar K3** (Landasan hukum UU No. 1/1970, filosofi K3, 5R/5S, segitiga kecelakaan Heinrich).
2. **Penggunaan Alat Pelindudng Diri (APD)** (Standar SNI/ANSI, helm, sepatu safety, full body harness, batas kedaluwarsa).
3. **Pertolongan Pertama pada Kecelakaan (P3K)** (Prinsip 3A, Resusitasi Jantung Paru/RJP 100-120 bpm, pendarahan, luka bakar, patah tulang).
4. **Keselamatan dan Pencegahan Kebakaran** (Segitiga api, klasifikasi A-B-C-D, teknik pemadaman APAR PASS, jalur evakuasi).
5. **Identifikasi Bahaya dan Penilaian Risiko (HIRADC / IBPR)** (Matriks peluang x keparahan, 5 hierarki kendali: Eliminasi, Substitusi, Rekayasa Teknik, Administrasi, APD, dan JSA).
6. **Ergonomi dan Keselamatan Lingkungan Kerja** (Pencegahan MSDs, batas angkat manual 15-20 kg, aturan 20-20-20, Nilai Ambang Batas kebisingan 85 dB).

---

## 🚀 Fitur Unggulan

### 1. Beranda Interaktif
- Hero section modern dengan headline resmi.
- Statistik peserta dan kelulusan real-time.
- 6 Kategori K3 dengan ikon khusus.
- Kursus terpopuler dan keunggulan platform.

### 2. Autentikasi & Role-Based Access Control (RBAC)
- Registrasi dan login aman menggunakan Supabase Auth (atau Demo Switcher satu klik).
- Pemisahan peran: **Peserta** dan **Admin / Pengelola K3**.
- Validasi formulir dengan feedback pesan toast modern.

### 3. Ruang Belajar (Interactive Classroom)
- Materi kaya konten: Teks terstruktur, gambar, poin kunci keselamatan, dan video simulasi K3.
- Sidebar navigasi modul dengan indikator persentase progres.
- Tombol *"Tandai Selesai"* yang menyimpan progres ke database.
- Tombol *"Lanjut ke Kuis"*.

### 4. Kuis Interaktif & Blind Answer Key
- Pilihan ganda 4 opsi (A, B, C, D).
- Timer hitung mundur (*countdown timer*).
- Palet navigasi nomor soal (soal aktif, terjawab, belum dijawab).
- **Keamanan Kunci Jawaban**: Kunci jawaban (`is_correct`) **TIDAK PERNAH** dikirim ke browser peserta selama kuis berlangsung, mencegah inspeksi via Network DevTools.
- Proteksi double-submission agar peserta tidak mengirimkan jawaban ganda.

### 5. Sistem Skoring Otomatis Server
- Menggunakan rumus terstandarisasi:  
  $$\text{Nilai} = \left(\frac{\text{Jumlah Jawaban Benar}}{\text{Jumlah Soal}}\right) \times 100$$
- Evaluasi atomic di database PostgreSQL via RPC Stored Procedure `submit_quiz_attempt`.
- Batas KKM kelulusan dapat disesuaikan per kuis (default: 75%).
- Pembahasan edukatif lengkap untuk setiap nomor ditampilkan setelah kuis selesai disubmit.

### 6. Sertifikat Digital Terverifikasi
- Terbit otomatis setelah seluruh materi selesai dan kuis lulus KKM.
- Dilengkapi nomor seri sertifikat unik (`K3L-2026-XXXXXX`), tanggal terbit, stempel terverifikasi, dan tanda tangan digital.
- Fitur **Cetak / Simpan PDF** langsung dari browser dengan format cetak profesional.
- Halaman verifikasi publik sertifikat.

### 7. Dashboard Admin HSE
- CRUD Kursus & Modul Pelajaran.
- Pengaturan batas KKM, timer kuis, dan kuota percobaan.
- Pemantauan nilai, progres, dan kelulusan seluruh peserta.

---

## 💻 Teknologi yang Digunakan

| Komponen | Teknologi | Keterangan |
| :--- | :--- | :--- |
| **Frontend Framework** | React 18 + TypeScript | UI berbasis komponen yang modular dan type-safe |
| **Bundler & Tooling** | Vite 6 | Build super cepat dan optimasi bundling |
| **Styling** | Tailwind CSS | Utility-first CSS dengan palet warna navy, blue, dan safety orange |
| **Routing** | React Router DOM v6 | Single Page Application (SPA) dengan protected route |
| **Icons** | Lucide React | Ikonografi keselamatan dan UI yang konsisten |
| **Backend & DB** | Supabase (PostgreSQL) | Database relasional dengan Row Level Security (RLS) |
| **Autentikasi** | Supabase Auth (JWT) | Pengelolaan sesi dan peran peserta/admin |
| **Testing** | Vitest + Testing Library | Unit test formula skoring dan integration test alur kuis |
| **Deployment** | Vercel | Edge CDN hosting dengan zero-configuration SPA rewrites |

---

## 🔒 Arsitektur Keamanan & Skoring Server

```
[Browser Peserta]
       │
       ▼ (1) Permintaan Soal Kuis (GET)
[Supabase View: participant_answer_options]
       │ (Hanya mengirim id, question_id, option_text — TANPA is_correct)
       ▼
[Browser Peserta: Menjawab & Submit]
       │
       ▼ (2) POST RPC: submit_quiz_attempt(p_quiz_id, p_responses, p_duration)
[PostgreSQL Stored Procedure (SECURITY DEFINER)]
       │
       ├── Mengecek auth.uid() & kuota attempts
       ├── Membandingkan jawaban terhadap tabel aman `answer_options`
       ├── Menghitung Nilai = (Benar / Total) * 100
       ├── Mencatat record di `quiz_attempts` dan `quiz_responses`
       ├── Jika Nilai >= KKM & Materi Selesai -> Otomatis Terbitkan Sertifikat
       ▼
[Kembalikan Hasil: Skor, Status Lulus, & Pembahasan Lengkap ke Client]
```

---

## 📂 Struktur Proyek

```
d:/TUGAS PART 2/
├── public/                     # Aset statis & Favicon K3
├── src/
│   ├── components/
│   │   ├── certificate/        # Komponen CertificateCard (Print & PDF)
│   │   ├── common/             # Badge, ProgressBar, LoadingSpinner, EmptyState, ProtectedRoute
│   │   └── layout/             # Navbar (dengan Role Switcher) & Footer (Disclaimer K3)
│   ├── context/
│   │   ├── AuthContext.tsx     # Context autentikasi Supabase & Mode Demo
│   │   └── ToastContext.tsx    # Toast notifikasi aktivitas penting
│   ├── data/
│   │   └── mockData.ts         # Bank data komprehensif 6 kursus, materi, dan soal K3
│   ├── lib/
│   │   ├── scoring.ts          # Rumus matematis nilai, durasi, serial sertifikat
│   │   └── supabase.ts         # Inisialisasi klien Supabase
│   ├── pages/
│   │   ├── Home.tsx            # Beranda utama
│   │   ├── Catalog.tsx         # Katalog 6 kategori kursus & filter
│   │   ├── CourseDetail.tsx    # Silabus & pendaftaran kursus
│   │   ├── Classroom.tsx       # Ruang belajar interaktif (Teks, video, progres)
│   │   ├── QuizArena.tsx       # Arena kuis interaktif (Timer, palet soal)
│   │   ├── QuizResult.tsx      # Hasil nilai, confetti kelulusan & pembahasan
│   │   ├── Dashboard.tsx       # Dashboard progres belajar & sertifikat peserta
│   │   ├── CertificateDetail.tsx # Halaman cetak & verifikasi sertifikat
│   │   ├── AdminDashboard.tsx  # Panel admin kelola kursus, KKM & nilai
│   │   ├── Login.tsx           # Halaman login & demo login
│   │   └── Register.tsx        # Registrasi akun baru
│   ├── services/
│   │   ├── courseService.ts    # Service kursus, materi, enrollment, progress
│   │   ├── quizService.ts      # Service kuis & skoring aman
│   │   └── certificateService.ts # Service penerbitan sertifikat digital
│   ├── test/
│   │   ├── setup.ts            # Setup Vitest & JSDOM localStorage mock
│   │   ├── scoring.test.ts     # Unit test formula nilai & KKM
│   │   └── quizFlow.test.ts    # Integration test alur kuis & keamanan kunci
│   ├── types/
│   │   └── index.ts            # Definisi tipe TypeScript
│   ├── App.tsx                 # Master Routing aplikasi
│   ├── main.tsx                # Entry point
│   └── index.css               # Styling Tailwind & Print rules
├── supabase/
│   ├── schema.sql              # Skema 11 tabel, RLS, Trigger, dan RPC function
│   └── seed.sql                # SQL Seed data awal 6 kursus K3
├── .env.example                # Template variabel lingkungan
├── package.json
├── tailwind.config.js
├── vite.config.ts
├── vercel.json                 # Konfigurasi SPA rewrite hosting Vercel
└── README.md
```

---

## 🛠️ Panduan Instalasi Lokal

### Prasyarat
- **Node.js**: Versi 18 ke atas (Direkomendasikan Node.js LTS).
- **NPM** atau **PNPM** / **Yarn**.

### Langkah-Langkah:
1. **Clone atau Buka Direktori Proyek**:
   ```bash
   cd "d:/TUGAS PART 2"
   ```

2. **Pasang Dependensi**:
   ```bash
   npm install
   ```

3. **Jalankan Aplikasi dalam Mode Pengembangan**:
   ```bash
   npm run dev
   ```
   Buka peramban Anda di alamat yang tertera (biasanya `http://localhost:5173`).

> **Catatan Mode Demo Mandiri**: Jika Anda belum mengisi environment variables Supabase, aplikasi secara otomatis berjalan dalam **Mode Demo Interaktif** yang sepenuhnya fungsional menggunakan memori lokal. Anda dapat langsung menguji fitur pengerjaan kuis, skoring otomatis, pergantian peran Peserta/Admin, dan pencetakan sertifikat!

---

## 🗄️ Konfigurasi Database Supabase & Migrasi

Jika Anda ingin menghubungkan aplikasi ke backend Supabase cloud:

1. Buat proyek baru di [Supabase Dashboard](https://supabase.com).
2. Masuk ke menu **SQL Editor** di dashboard Supabase.
3. Buka file `supabase/schema.sql` pada proyek ini, salin seluruh isinya, dan tempelkan ke SQL Editor, lalu klik **Run**.
   - Ini akan membuat 11 tabel relasional, fungsi stored procedure `submit_quiz_attempt`, dan kebijakan Row Level Security (RLS).
4. Buka file `supabase/seed.sql`, tempelkan ke SQL Editor, lalu klik **Run** untuk mengisikan 6 kursus K3 awal.
5. Buat file `.env` di root direktori proyek berdasarkan `.env.example`:
   ```env
   VITE_SUPABASE_URL=https://proyek-anda.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
6. **Membuat Akun Admin Secara Aman**:
   - Daftarkan akun baru melalui halaman `/register` pada aplikasi dengan peran **Admin / Pengelola K3**.
   - Atau di SQL Editor Supabase, jalankan:
     ```sql
     UPDATE public.profiles SET role = 'admin' WHERE email = 'email_anda@domain.com';
     ```

---

## 🚀 Panduan Deployment ke Vercel

1. **Inisialisasi Git dan Unggah ke GitHub**:
   ```bash
   git init
   git add .
   git commit -m "feat: inisialisasi platform K3Learn lengkap"
   git branch -M main
   git remote add origin https://github.com/username-anda/k3learn.git
   git push -u origin main
   ```

2. **Hubungkan ke Vercel**:
   - Buka [Vercel Dashboard](https://vercel.com) dan klik **Add New Project**.
   - Impor repositori GitHub `k3learn`.
   - Pada bagian **Build and Output Settings**, pastikan Preset terdeteksi sebagai **Vite**.
   - Pada bagian **Environment Variables**, tambahkan:
     - `VITE_SUPABASE_URL`: URL Supabase proyek Anda.
     - `VITE_SUPABASE_ANON_KEY`: Anon key Supabase Anda.

3. **Klik Deploy**:
   - Vercel akan menjalankan build perintah `npm run build`.
   - File `vercel.json` yang telah disertakan akan memastikan seluruh rute SPA (`/courses`, `/dashboard`, `/learn/...`) berjalan lancar tanpa error 404 saat direfresh.
   - Setelah selesai, Vercel akan menghasilkan URL produksi aktif (misal: `https://k3learn.vercel.app`).

---

## 🧪 Menjalankan Pengujian (Testing)

Aplikasi telah dilengkapi unit test untuk rumus penilaian dan integration test alur kuis:

```bash
# Menjalankan pengujian dengan Vitest
npm test
```

Hasil pengujian mencakup:
- ✅ Perhitungan formula nilai: $(\text{Benar} / \text{Total}) \times 100$
- ✅ Pengujian batas kelulusan KKM 75%
- ✅ Pengujian penanganan nilai sempurna (100) dan remedial
- ✅ Verifikasi bahwa kunci jawaban tidak dibocorkan ke browser peserta
- ✅ Pengujian integrasi alur kuis dan penerbitan sertifikat

---

## ⚠️ Keterangan & Disclaimer Resmi K3

Sesuai dengan ketentuan etika profesional dan regulasi ketenagakerjaan di Indonesia:

> **PEMBERITAHUAN HUKUM:**  
> Platform **K3Learn** adalah media edukasi mandiri daring untuk meningkatkan literasi keselamatan dan kesehatan kerja. Sertifikat penyelesaian kursus yang diterbitkan oleh platform ini merupakan tanda bukti kelulusan modul daring mandiri dan **bukan merupakan sertifikasi personil resmi Kemenaker RI atau lisensi BNSP**. Untuk posisi pekerjaan yang diwajibkan oleh regulasi pemerintah memiliki Surat Izin Alat (SIO) atau Sertifikasi Ahli K3 Umum resmi, peserta wajib mengikuti pembinaan dan ujian tatap muka yang diselenggarakan oleh PJK3 terdaftar.
