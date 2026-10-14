import { Course, Lesson, Quiz, Question } from '../types';

export const INITIAL_COURSES: Course[] = [
  {
    id: 'c1-dasar-k3',
    slug: 'dasar-dasar-k3',
    title: 'Dasar-dasar Keselamatan dan Kesehatan Kerja (K3)',
    description: 'Pelajari konsep fundamental K3, landasan hukum UU No. 1 Tahun 1970, filosofi pencegahan kecelakaan kerja, dan implementasi Sistem Manajemen K3 (SMK3 PP 50/2012).',
    category: 'Dasar-dasar K3',
    level: 'Pemula',
    duration_minutes: 90,
    thumbnail_url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
    is_published: true,
    lessons_count: 3,
    created_at: '2026-01-10T08:00:00Z',
  },
  {
    id: 'c2-apd',
    slug: 'penggunaan-alat-pelindung-diri-apd',
    title: 'Standar & Praktik Penggunaan Alat Pelindung Diri (APD)',
    description: 'Panduan komprehensif pemilihan, pemeriksaan kelayakan, cara pakai yang benar, serta perawatan APD sesuai Permenakertrans No. 08/MEN/VII/2010.',
    category: 'Penggunaan Alat Pelindung Diri (APD)',
    level: 'Pemula',
    duration_minutes: 75,
    thumbnail_url: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80',
    is_published: true,
    lessons_count: 3,
    created_at: '2026-01-12T08:00:00Z',
  },
  {
    id: 'c3-p3k',
    slug: 'pertolongan-pertama-pada-kecelakaan-p3k',
    title: 'Pertolongan Pertama pada Kecelakaan (P3K) di Tempat Kerja',
    description: 'Keterampilan tanggap darurat medis: Resusitasi Jantung Paru (RJP/CPR), penanganan pendarahan hebat, luka bakar, patah tulang, dan manajemen kotak P3K.',
    category: 'Pertolongan Pertama pada Kecelakaan (P3K)',
    level: 'Menengah',
    duration_minutes: 105,
    thumbnail_url: 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=800&q=80',
    is_published: true,
    lessons_count: 3,
    created_at: '2026-01-15T08:00:00Z',
  },
  {
    id: 'c4-damkar',
    slug: 'keselamatan-dan-pencegahan-kebakaran',
    title: 'Keselamatan dan Pencegahan Bahaya Kebakaran',
    description: 'Teori segitiga api, klasifikasi kebakaran A-B-C-D, teknik pemadaman api dini menggunakan APAR (metode PASS), hidran, dan prosedur evakuasi darurat.',
    category: 'Keselamatan dan Pencegahan Kebakaran',
    level: 'Menengah',
    duration_minutes: 90,
    thumbnail_url: 'https://images.unsplash.com/photo-1542385151-efd9000785a0?auto=format&fit=crop&w=800&q=80',
    is_published: true,
    lessons_count: 3,
    created_at: '2026-01-18T08:00:00Z',
  },
  {
    id: 'c5-hiradc',
    slug: 'identifikasi-bahaya-dan-penilaian-risiko',
    title: 'Identifikasi Bahaya dan Penilaian Risiko (HIRADC / IBPR)',
    description: 'Metodologi sistematis mengenali sumber bahaya, menganalisis peluang dan konsekuensi, serta menerapkan 5 tingkatan hierarki pengendalian bahaya di tempat kerja.',
    category: 'Identifikasi Bahaya dan Penilaian Risiko',
    level: 'Lanjutan',
    duration_minutes: 120,
    thumbnail_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    is_published: true,
    lessons_count: 3,
    created_at: '2026-01-20T08:00:00Z',
  },
  {
    id: 'c6-ergonomi',
    slug: 'ergonomi-dan-keselamatan-lingkungan-kerja',
    title: 'Ergonomi dan Keselamatan Lingkungan Kerja Industri',
    description: 'Optimasi postur kerja, teknik pengangkatan beban manual aman, penataan pencahayaan, pengendalian kebisingan sesuai Nilai Ambang Batas (NAB), dan ventilasi.',
    category: 'Ergonomi dan Keselamatan Lingkungan Kerja',
    level: 'Menengah',
    duration_minutes: 85,
    thumbnail_url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80',
    is_published: true,
    lessons_count: 3,
    created_at: '2026-01-22T08:00:00Z',
  },
];

export const INITIAL_LESSONS: Record<string, Lesson[]> = {
  'c1-dasar-k3': [
    {
      id: 'l1-1',
      course_id: 'c1-dasar-k3',
      title: '1. Landasan Hukum & Filosofi K3 di Indonesia',
      slug: 'landasan-hukum-filosofi-k3',
      order_index: 1,
      duration_minutes: 25,
      video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      key_points: [
        'UU No. 1 Tahun 1970 adalah payung hukum keselamatan kerja di seluruh wilayah hukum RI.',
        'Tujuan K3: Melindungi keselamatan tenaga kerja, menjamin keselamatan orang lain di tempat kerja, serta memelihara sumber produksi.',
        'Filosofi K3: Menjamin keutuhan jasmani dan rohani manusia demi kesejahteraan bersama.',
      ],
      content_text: `
### Pengantar Keselamatan dan Kesehatan Kerja (K3)

Keselamatan dan Kesehatan Kerja (K3) adalah segala kegiatan untuk menjamin dan melindungi keselamatan dan kesehatan tenaga kerja melalui upaya pencegahan kecelakaan kerja dan penyakit akibat kerja.

#### 1. Dasar Hukum K3 di Indonesia
- **Undang-Undang No. 1 Tahun 1970 tentang Keselamatan Kerja**: Mengatur kewajiban pengurus/perusahaan dan tenaga kerja dalam penerapan syarat-syarat keselamatan kerja di semua tempat kerja.
- **Undang-Undang No. 13 Tahun 2003 tentang Ketenagakerjaan**: Pasal 86 & 87 menegaskan setiap pekerja berhak atas perlindungan K3 dan setiap perusahaan wajib menerapkan SMK3.
- **PP No. 50 Tahun 2012**: Pedoman penerapan Sistem Manajemen Keselamatan dan Kesehatan Kerja (SMK3).

#### 2. Tiga Tujuan Pokok K3 (Berdasarkan UU No. 1/1970)
1. Melindungi dan menjamin keselamatan setiap tenaga kerja dan orang lain di tempat kerja.
2. Menjamin setiap sumber produksi dapat digunakan secara aman dan efisien.
3. Meningkatkan kesejahteraan dan produktivitas nasional.

> **Catatan Penting**: Penerapan K3 bukan semata-mata pemenuhan regulasi (*compliance*), melainkan investasi kemanusiaan dan keberlanjutan bisnis perusahaan.
      `,
    },
    {
      id: 'l1-2',
      course_id: 'c1-dasar-k3',
      title: '2. Teori Penyebab Kecelakaan Kerja & Segitiga Heinrich',
      slug: 'teori-penyebab-kecelakaan-kerja',
      order_index: 2,
      duration_minutes: 30,
      key_points: [
        'Kecelakaan kerja tidak terjadi secara kebetulan, melainkan memiliki akar penyebab (Root Cause).',
        '88% kecelakaan dipicu oleh Tindakan Tidak Aman (Unsafe Action), 10% Kondisi Tidak Aman (Unsafe Condition), dan 2% Takdir.',
        'Piramida Heinrich: 1 Insiden Fatal didahului oleh 29 Luka Ringan dan 300 Near Miss (Hampir Celaka).',
      ],
      content_text: `
### Teori Domino Heinrich & Akar Penyebab Kecelakaan

H.W. Heinrich mengemukakan teori domino yang menyatakan bahwa kecelakaan kerja terjadi karena rangkaian faktor yang saling berkaitan.

#### Piramida Kecelakaan Kerja (Heinrich Triangle)
1. **1 Kasus Cedera Berat / Fatalitas**
2. **29 Kasus Cedera Ringan / Memerlukan P3K**
3. **300 Kasus Nyaris Celaka (*Near Miss*)**

Jika perusahaan melaporkan dan mengendalikan 300 kejadian nyaris celaka sejak dini, probabilitas terjadinya cedera berat dan kematian dapat ditekan secara drastis!

#### Klasifikasi Penyebab Langsung
- **Tindakan Tidak Aman (Unsafe Action)**: Bekerja tanpa APD, bergurau saat mengoperasikan mesin, memotong prosedur SOP, bekerja dalam kondisi lelah.
- **Kondisi Tidak Aman (Unsafe Condition)**: Peralatan pelindung mesin rusak, kabel listrik terkelupas, lantai licin berminyak, ventilasi buruk, penerangan tidak mencukupi.
      `,
    },
    {
      id: 'l1-3',
      course_id: 'c1-dasar-k3',
      title: '3. Penerapan Budaya 5R (5S) & Tanggap Darurat',
      slug: 'budaya-5r-dan-tanggap-darurat',
      order_index: 3,
      duration_minutes: 35,
      key_points: [
        '5R: Ringkas (Seiri), Rapi (Seiton), Resik (Seiso), Rawat (Seiketsu), Rajin (Shitsuke).',
        'Lingkungan kerja yang bersih dan teratur mencegah 40% risiko kecelakaan tergelincir, tersandung, dan tertimpa benda jatuh.',
        'Setiap pekerja wajib mengenali denah darurat dan rute evakuasi terdekat.',
      ],
      content_text: `
### Prinsip Budaya Kerja 5R (5S)

Budaya 5R adalah fondasi keselamatan fisik di area kerja industri maupun perkantoran:
1. **Ringkas (Seiri)**: Pisahkan barang yang diperlukan dengan yang tidak diperlukan. Singkirkan benda yang mengganggu mobilitas.
2. **Rapi (Seiton)**: Letakkan barang pada tempatnya dengan label yang jelas agar mudah diakses.
3. **Resik (Seiso)**: Bersihkan area kerja, mesin, dan peralatan dari kotoran, debu, dan ceceran minyak.
4. **Rawat (Seiketsu)**: Pertahankan standar kebersihan dan keteraturan secara konsisten.
5. **Rajin (Shitsuke)**: Biasakan diri mematuhi aturan K3 tanpa perlu diawasi terus menerus.

#### Prosedur Tanggap Darurat
Ketika sirene alarm berbunyi:
- Hentikan pekerjaan dan matikan peralatan berputar jika aman.
- Ikuti rambu penunjuk arah menuju jalur evakuasi hijau (*Emergency Exit*).
- Jangan gunakan lift; gunakan tangga darurat.
- Berkumpullah di **Titik Kumpul (Assembly Point)** untuk pendataan kehadiran (*roll call*).
      `,
    },
  ],
  'c2-apd': [
    {
      id: 'l2-1',
      course_id: 'c2-apd',
      title: '1. Jenis dan Fungsi Utama APD Standar Industri',
      slug: 'jenis-dan-fungsi-utama-apd',
      order_index: 1,
      duration_minutes: 25,
      key_points: [
        'APD adalah garis pertahanan terakhir (Last Line of Defense) dalam hierarki pengendalian bahaya.',
        'Helm keselamatan (Safety Helmet) melindungi kepala dari benturan dan benda jatuh.',
        'Kacamata pengaman (Safety Glasses/Goggles) melindungi mata dari serpihan logam dan percikan kimia.',
      ],
      content_text: `
### Jenis-Jenis Alat Pelindung Diri (Permenakertrans No. 8/2010)

Alat Pelindung Diri (APD) adalah suatu perangkat yang digunakan oleh tenaga kerja untuk mengisolasi tubuh dari potensi bahaya di tempat kerja.

#### Daftar APD Berdasarkan Bagian Tubuh
- **Kepala**: Safety Helmet (SNI/ANSI Z89.1) dengan tali dagu (*chinstrap*).
- **Mata & Wajah**: Safety Spectacles, Goggles kimia, dan Face Shield untuk pengelasan atau pemotongan gerinda.
- **Pernapasan**: Masker debu N95/FFP2, Half-Mask Cartridge Respirator untuk gas toksik.
- **Telinga**: Earplug (peredam 15-25 dB) dan Earmuff (peredam 25-35 dB) untuk kebisingan >85 dBA.
- **Tangan**: Sarung tangan katun, kulit (tahan goresan), nitrile/neoprene (tahan bahan kimia berbahaya).
- **Kaki**: Safety Shoes dengan *steel toe cap* yang menahan impak hingga 200 Joule serta sol anti-slip dan anti-tusukan.
      `,
    },
    {
      id: 'l2-2',
      course_id: 'c2-apd',
      title: '2. APD Khusus Pekerjaan Ketinggian & Ruang Terbatas',
      slug: 'apd-pekerjaan-khusus',
      order_index: 2,
      duration_minutes: 25,
      key_points: [
        'Full Body Harness wajib dipakai saat bekerja pada ketinggian di atas 1.8 meter.',
        'Lanyard harus dilengkapi shock absorber untuk meredam gaya kejut jatuh.',
        'Bekerja di ruang terbatas (Confined Space) mewajibkan SCBA (Self-Contained Breathing Apparatus) dan gas detector.',
      ],
      content_text: `
### APD untuk Pekerjaan Berisiko Tinggi

#### 1. Keselamatan Bekerja di Ketinggian (Working at Heights)
- **Full Body Harness**: Menahan seluruh tubuh saat terjadi jatuh dan mendistribusikan gaya henti ke paha dan bahu.
- **Double Lanyard with Shock Absorber**: Sistem 100% *tie-off* memastikan pekerja selalu terhubung ke titik jangkar (*anchor point*).
- Kapasitas minimum anchor point: 15 kN (sekitar 1.500 kg).

#### 2. Ruang Terbatas (Confined Space)
Di ruang seperti tangki, silo, atau gorong-gorong bawah tanah:
- Pemeriksaan 4 gas (Oksigen, CO, H2S, LEL).
- Pemakaian tripod penyelamat (*rescue winch*) dan tali pengaman.
- Masker pasokan udara mandiri jika kadar oksigen <19.5%.
      `,
    },
    {
      id: 'l2-3',
      course_id: 'c2-apd',
      title: '3. Inspeksi, Perawatan, dan Masa Kedaluwarsa APD',
      slug: 'inspeksi-perawatan-apd',
      order_index: 3,
      duration_minutes: 25,
      key_points: [
        'Inspeksi visual wajib dilakukan setiap hari sebelum APD digunakan.',
        'Helm safety memiliki masa pakai maksimal 3 hingga 5 tahun sejak tanggal produksi pabrik.',
        'APD yang pernah mengalami benturan keras atau jatuh wajib segera diafkir (dimusnahkan).',
      ],
      content_text: `
### Pemeliharaan dan Standar Kelayakan APD

APD yang rusak atau kedaluwarsa memberikan rasa aman palsu (*false sense of security*) yang sangat berbahaya.

#### Hal yang Harus Diperiksa
- **Helm**: Cek adanya retakan rambut, kelenturan suspensi harness, dan elastisitas chinstrap.
- **Harness & Tali**: Cek jahitan yang terurai, serat yang aus, karat pada cincin D-ring, dan label lolos uji berkala.
- **Kacamata**: Pastikan lensa tidak buram atau tergores parah yang membatasi jarak pandang pekerja.
- **Pembersihan**: Cuci dengan air hangat dan sabun netral, hindari zat pelarut kimia keras yang dapat merusak struktur polimer plastik.
      `,
    },
  ],
  'c3-p3k': [
    {
      id: 'l3-1',
      course_id: 'c3-p3k',
      title: '1. Prinsip Dasar P3K & Bantuan Hidup Dasar (BHD / RJP)',
      slug: 'prinsip-dasar-p3k-dan-rjp',
      order_index: 1,
      duration_minutes: 35,
      key_points: [
        'Prinsip 3A: Aman Diri, Aman Pasien, Aman Lingkungan sebelum menolong korban.',
        'Cek respon korban dan panggil bantuan darurat medis segera.',
        'RJP / CPR: Kompresi dada sedalam 5-6 cm dengan kecepatan 100-120 kali per menit (rasio 30 kompresi : 2 tiupan).',
      ],
      content_text: `
### Bantuan Hidup Dasar (Basic Life Support)

Saat terjadi henti jantung mendadak (*sudden cardiac arrest*) di tempat kerja, setiap detik sangat berharga. Kerusakan otak permanen mulai terjadi setelah 4-6 menit tanpa oksigen.

#### Langkah Bantuan Hidup Dasar:
1. **Pastikan 3A**:
   - Aman Penolong (Gunakan sarung tangan medis / APD).
   - Aman Korban (Pindahkan dari sumber listrik atau bahaya langsung).
   - Aman Lingkungan (Sterilkan kerumunan orang).
2. **Cek Respon**: Tepuk bahu korban dan panggil dengan lantang: *"Bapak/Ibu, apakah Anda mendengar saya?"*
3. **Panggil Bantuan Medis (Emergency Call)**: Tunjuk satu orang spesifik: *"Tolong hubungi klinik kantor / ambulans 118 dan bawakan AED sekarang!"*
4. **Cek Nadi & Napas**: Cek denyut nadi karotis di leher dan pergerakan dada maksimal 10 detik.
5. **Lakukan Kompresi RJP**:
   - Titik tumpu: Tengah tulang dada (*sternum*).
   - Kecepatan: 100 - 120 bpm (Irama lagu *"Stayin' Alive"*).
   - Kedalaman: 5 hingga 6 cm untuk orang dewasa.
   - Izinkan dada kembali mengembang penuh (*chest recoil*).
      `,
    },
    {
      id: 'l3-2',
      course_id: 'c3-p3k',
      title: '2. Penanganan Pendarahan Parah & Patah Tulang',
      slug: 'penanganan-pendarahan-dan-fraktur',
      order_index: 2,
      duration_minutes: 35,
      key_points: [
        'Metode utama menghentikan pendarahan luar: Tekan Langsung (Direct Pressure) dengan kain kasa steril.',
        'Jangan mencabut benda yang tertancap di tubuh korban; stabilkan benda tersebut di posisinya.',
        'Imobilisasi patah tulang menggunakan bidai (spalk) yang melewati dua sendi.',
      ],
      content_text: `
### Manajemen Trauma Fisik di Tempat Kerja

#### Menghentikan Pendarahan Eksternal
1. **Tekan Langsung**: Berikan tekanan kuat pada luka menggunakan kassa steril atau perban bersih.
2. **Tinggikan**: Jika tidak dicurigai ada patah tulang, tinggikan area luka di atas level jantung.
3. **Perban Penekan**: Balut dengan perban elastis tanpa menghentikan sirkulasi darah ke ujung jari.
4. **Tourniquet**: Hanya digunakan untuk pendarahan arteri yang mengancam nyawa pada anggota gerak (tangan/kaki) jika balut tekan gagal.

#### Patah Tulang (Fraktur)
- Tanda: Nyeri hebat, pembengkakan, deformitas bentuk, krepitasi (bunyi gesekan tulang).
- Penanganan: Jangan paksa meluruskan tulang yang bengkok. Pasang bidai yang mencakup satu sendi di atas dan satu sendi di bawah lokasi fraktur.
      `,
    },
    {
      id: 'l3-3',
      course_id: 'c3-p3k',
      title: '3. Penanganan Luka Bakar, Tersengat Listrik & Syok',
      slug: 'penanganan-luka-bakar-listrik-syok',
      order_index: 3,
      duration_minutes: 35,
      key_points: [
        'Dinginkan luka bakar dengan air mengalir suhu ruang selama minimal 15-20 menit.',
        'Jangan pernah mengoleskan odol, kecap, atau mentega pada luka bakar.',
        'Matikan sumber arus listrik utama sebelum menyentuh korban sengatan listrik.',
      ],
      content_text: `
### Luka Bakar dan Sengatan Listrik

#### Penanganan Luka Bakar Termal
- Aliri dengan air bersih yang mengalir selama 15-20 menit.
- Lepaskan cincin, jam tangan, atau pakaian ketat sebelum area membengkak (kecuali pakaian yang melekat pada luka bakar).
- Tutup dengan kain steril yang tidak berbulu.
- **Pantangan**: Jangan pecahkan lepuhan (*bullae*), jangan gunakan es batu (memicu hipotermia jaringan).

#### Sengatan Listrik (*Electrical Shock*)
- Prioritas pertama: Putuskan aliran listrik lewat sakelar pemutus utama (*circuit breaker*).
- Jika tidak memungkinkan, gunakan benda isolator (kayu kering, tongkat plastik) untuk memisahkan kabel dari korban.
- Bersiap lakukan RJP jika korban mengalami henti jantung akibat fibrilasi ventrikel.
      `,
    },
  ],
  'c4-damkar': [
    {
      id: 'l4-1',
      course_id: 'c4-damkar',
      title: '1. Teori Segitiga Api & Klasifikasi Kelas Kebakaran',
      slug: 'segitiga-api-dan-kelas-kebakaran',
      order_index: 1,
      duration_minutes: 30,
      key_points: [
        'Segitiga Api terdiri dari 3 elemen: Bahan Bakar (Fuel), Oksigen (O2), dan Sumber Panas (Heat).',
        'Kebakaran Kelas A: Bahan padat mudah terbakar (kayu, kertas, kain, plastik).',
        'Kebakaran Kelas B: Bahan cair/gas mudah terbakar (bensin, solar, cat, alkohol).',
        'Kebakaran Kelas C: Instalasi listrik yang bertegangan.',
        'Kebakaran Kelas D: Logam mudah terbakar (magnesium, sodium, titanium).',
      ],
      content_text: `
### Fenomena Pembakaran dan Reaksi Rantai Api

Kebakaran terjadi ketika ketiga unsur segitiga api bereaksi membentuk reaksi rantai kimia yang berkelanjutan (*Fire Tetrahedron*).

#### Prinsip Pemadaman Api:
1. **Smothering (Penyelimutan)**: Mengisolasi oksigen (misalnya menutup dengan kain basah atau serbuk kimia kering).
2. **Cooling (Pendinginan)**: Menurunkan suhu panas di bawah titik nyala (misalnya menyemprotkan air pada kelas A).
3. **Starvation (Pengurangan Bahan Bakar)**: Memutus pasokan minyak atau gas yang mengalir.
4. **Breaking the Chain Reaction**: Menghentikan reaksi radikal bebas menggunakan zat pemadam kimia (Halon replacement / Clean agent).
      `,
    },
    {
      id: 'l4-2',
      course_id: 'c4-damkar',
      title: '2. Pengoperasian Alat Pemadam Api Ringan (APAR) Metode PASS',
      slug: 'pengoperasian-apar-metode-pass',
      order_index: 2,
      duration_minutes: 30,
      key_points: [
        'Metode P-A-S-S: Pull, Aim, Squeeze, Sweep.',
        'APAR hanya efektif untuk memadamkan kebakaran pada tahap awal (kebakaran kecil).',
        'Selalu berdiri dengan membelakangi arah angin (tidak melawan angin) dan menjaga jarak 2-3 meter dari api.',
      ],
      content_text: `
### Teknik Penggunaan APAR dengan Metode P-A-S-S

Sebelum menggunakan APAR, pastikan jarum penunjuk tekanan (*pressure gauge*) berada di zona hijau.

#### Langkah-Langkah PASS:
1. **P - Pull (Tarik)**: Tarik pin pengaman segel pada tuas pemadam.
2. **A - Aim (Arahkan)**: Arahkan corong/selang nozzle ke pangkal api (dasar bahan bakar), bukan ke puncak jilatan lidah api!
3. **S - Squeeze (Tekan)**: Tekan tuas pegangan secara penuh untuk mengeluarkan media pemadam.
4. **S - Sweep (Sapukan)**: Gerakkan corong menyapu dari sisi ke sisi secara merata hingga api padam sempurna.

> **Peringatan Keselamatan**: Jangan pernah menggunakan APAR jenis air atau busa (*foam*) pada kebakaran Kelas C (peralatan listrik aktif), karena dapat menghantarkan listrik dan menyengat operator!
      `,
    },
    {
      id: 'l4-3',
      course_id: 'c4-damkar',
      title: '3. Evakuasi Bangunan Bertingkat & Tanggap Darurat',
      slug: 'evakuasi-dan-tanggap-darurat-kebakaran',
      order_index: 3,
      duration_minutes: 30,
      key_points: [
        'Jika terjebak asap tebal, merangkaklah rendah di lantai karena udara bersih berada di lapisan bawah.',
        'Raba pintu dengan punggung tangan sebelum membukanya; jika panas, jangan dibuka!',
        'Assembly Point (Titik Kumpul) harus berjarak aman minimal 1.5 kali tinggi bangunan gedung.',
      ],
      content_text: `
### Prosedur Evakuasi Kebakaran Gedung

Asap beracun (seperti Karbon Monoksida dan Hidrogen Sianida) adalah penyebab kematian terbanyak dalam kebakaran gedung, melebihi jilatan api langsung.

#### Petunjuk Evakuasi:
- Segera tinggalkan ruangan begitu mendengar bunyi alarm evakuasi.
- Tutup pintu di belakang Anda untuk memperlambat penyebaran api dan asap.
- Berjalan cepat dan tertib; jangan berlari atau saling dorong di tangga darurat.
- Gunakan kain basah untuk menutup hidung dan mulut jika ada asap pekat.
- Laporkan diri ke koordinator evakuasi (*Floor Warden*) di Titik Kumpul untuk absen verifikasi jumlah penghuni gedung.
      `,
    },
  ],
  'c5-hiradc': [
    {
      id: 'l5-1',
      course_id: 'c5-hiradc',
      title: '1. Konsep Bahaya, Risiko, dan Penilaian Peluang-Konsekuensi',
      slug: 'konsep-bahaya-dan-risiko',
      order_index: 1,
      duration_minutes: 40,
      key_points: [
        'Bahaya (Hazard): Segala sesuatu yang berpotensi menyebabkan kerugian, cidera, kerusakan properti, atau gangguan kesehatan.',
        'Risiko (Risk): Kombinasi antara Peluang (Likelihood) terjadinya peristiwa bahaya dan Tingkat Keparahan (Severity/Consequence).',
        'Rumus Risiko: Tingkat Risiko = Peluang × Keparahan.',
      ],
      content_text: `
### Membedakan Bahaya vs Risiko

Banyak praktisi pemula menyamakan bahaya dan risiko. Padahal keduanya berbeda secara fundamental:
- **Contoh**: Ceceran oli di lantai kerja adalah **Bahaya**.
- **Risiko**: Pekerja terpeleset dan mengalami gegar otak dengan tingkat keparahan tinggi.

#### Matriks Risiko K3 (Risk Assessment Matrix)
Matriks 5x5 umum digunakan di industri:
- **Peluang (Likelihood)**: 1 (Sangat Jarang) hingga 5 (Hampir Pasti Terjadi).
- **Keparahan (Severity)**: 1 (Tidak Signifikan) hingga 5 (Bencana / Kematian).
- Skor 1-4: Rendah (*Low* - diterima tanpa tindakan tambahan).
- Skor 5-9: Sedang (*Medium* - perlu pengendalian SOP & pengawasan).
- Skor 10-15: Tinggi (*High* - butuh tindakan perbaikan terencana).
- Skor 16-25: Ekstrem (*Extreme* - pekerjaan wajib dihentikan sampai risiko dimitigasi!).
      `,
    },
    {
      id: 'l5-2',
      course_id: 'c5-hiradc',
      title: '2. 5 Tingkatan Hierarki Pengendalian Bahaya (Hierarchy of Controls)',
      slug: 'hierarki-pengendalian-bahaya',
      order_index: 2,
      duration_minutes: 40,
      key_points: [
        'Hierarki pengendalian diurutkan dari yang paling efektif hingga yang paling tidak efektif.',
        '1. Eliminasi (Menghilangkan bahaya secara fisik).',
        '2. Substitusi (Mengganti bahan/alat berbahaya dengan yang lebih aman).',
        '3. Rekayasa Teknik / Engineering Control (Mengisolasi pekerja dari bahaya).',
        '4. Pengendalian Administratif (Mengubah cara orang bekerja, SOP, rotasi kerja, rambu).',
        '5. Alat Pelindung Diri (APD) (Melindungi pekerja dengan perlengkapan pribadi).',
      ],
      content_text: `
### Hierarki Pengendalian Bahaya ISO 45001 & SMK3

Pengendalian bahaya tidak boleh langsung bertumpu pada APD! Pendekatan terbaik adalah mengeliminasi bahaya di sumbernya.

#### Rincian Tingkatan Hierarki:
1. **Eliminasi (Paling Efektif)**: Menghapus proses yang berbahaya sama sekali. Contoh: Menghentikan penggunaan zat kimia karsinogenik.
2. **Substitusi**: Mengganti pelarut berbahan dasar benzena dengan pelarut berbahan dasar air (*water-based*).
3. **Rekayasa Teknik (Engineering)**: Memasang peredam suara pada mesin bising, memasang sensor interlock penghenti otomatis pada mesin pres, ventilasi hisap lokal (*local exhaust ventilation*).
4. **Administratif**: Pelatihan K3 berkala, izin kerja khusus (*Work Permit*), rambu peringatan, pembatasan jam kerja di area panas.
5. **APD (Garis Pertahanan Terakhir)**: Helm, sarung tangan, earplug. APD tidak menghilangkan bahaya di tempat kerja, melainkan hanya membatasi kontak fisik jika pengendalian lain jebol.
      `,
    },
    {
      id: 'l5-3',
      course_id: 'c5-hiradc',
      title: '3. Penyusunan Formulir HIRADC & Job Safety Analysis (JSA)',
      slug: 'penyusunan-hiradc-dan-jsa',
      order_index: 3,
      duration_minutes: 40,
      key_points: [
        'JSA (Job Safety Analysis) membedah setiap langkah tugas pekerjaan spesifik untuk mengidentifikasi bahaya di tiap tahapan.',
        'HIRADC harus ditinjau ulang secara berkala minimal 1 tahun sekali atau jika terjadi kecelakaan dan perubahan proses kerja.',
      ],
      content_text: `
### Praktik Pembuatan Job Safety Analysis (JSA)

JSA adalah alat praktis yang digunakan oleh pengawas dan pekerja di lapangan sebelum memulai pekerjaan non-rutin.

#### Tiga Kolom Inti JSA:
1. **Urutan Langkah Pekerjaan**: Diuraikan secara kronologis (misal: menyiapkan alat las, memposisikan benda kerja, menyalakan busur las).
2. **Potensi Bahaya**: Bahaya spesifik pada tiap langkah (misal: percikan api mengenai tabung gas, radiasi sinar UV merusak mata).
3. **Tindakan Pencegahan**: Tindakan pengendalian yang disepakati (misal: pasang flashback arrestor, gunakan apron kulit dan helm las dengan kaca pelindung gelap shade 10-12).
      `,
    },
  ],
  'c6-ergonomi': [
    {
      id: 'l6-1',
      course_id: 'c6-ergonomi',
      title: '1. Prinsip Ergonomi Postur Kerja & Pencegahan MSDs',
      slug: 'prinsip-ergonomi-postur-kerja',
      order_index: 1,
      duration_minutes: 30,
      key_points: [
        'Ergonomi: Menyesuaikan pekerjaan dengan kemampuan fisik manusia, bukan memaksa manusia menyesuaikan diri dengan alat.',
        'MSDs (Musculoskeletal Disorders) adalah gangguan pada otot, tendon, saraf, dan persendian akibat posisi kerja yang tidak ergonomis.',
        'Gejala awal: Nyeri punggung bawah (LBP), kaku leher, kesemutan pergelangan tangan (Carpal Tunnel Syndrome).',
      ],
      content_text: `
### Menjaga Postur Netral Tubuh Saat Bekerja

Postur netral adalah posisi di mana otot dan tulang berada dalam posisi paling seimbang dengan beban stres minimum pada sendi.

#### Panduan Bekerja di Depan Komputer (Ergonomi Kantor):
- Layar monitor sejajar dengan pandangan mata bagian atas (jarak 50-70 cm).
- Siku menekuk membentuk sudut 90 derajat rileks di atas sandaran tangan.
- Kaki menapak rata di lantai atau gunakan *footrest*.
- Terapkan aturan **20-20-20**: Setiap 20 menit menatap layar, istirahatkan mata dengan melihat objek berjarak 20 kaki (6 meter) selama 20 detik.
      `,
    },
    {
      id: 'l6-2',
      course_id: 'c6-ergonomi',
      title: '2. Teknik Pengangkatan Manual Aman (Manual Handling)',
      slug: 'teknik-pengangkatan-manual-aman',
      order_index: 2,
      duration_minutes: 25,
      key_points: [
        'Beban maksimal pengangkatan manual per orang yang direkomendasikan adalah 15-20 kg untuk pria dan 12-15 kg untuk wanita dalam kondisi ideal.',
        'Gunakan kekuatan otot paha dan kaki, BUKAN otot punggung saat mengangkat benda dari lantai!',
        'Jaga beban selalu sedekat mungkin dengan tubuh.',
      ],
      content_text: `
### SOP Pengangkatan Beban Manual (Manual Material Handling)

Cedera tulang belakang (*Herniated Nucleus Pulposus* / saraf terjepit) sering kali disebabkan oleh kebiasaan mengangkat benda berat dengan membungkukkan punggung.

#### 5 Langkah Mengangkat Aman:
1. Rencanakan rute perjalanan dan pastikan tidak ada halangan di lantai.
2. Buka kedua kaki selebar bahu untuk stabilitas pondasi tubuh.
3. Tekuk lutut (berjongkok) dan jaga tulang punggung tetap lurus alami.
4. Pegang benda dengan mantap menggunakan telapak tangan (*power grip*).
5. Angkat secara perlahan dengan meluruskan kaki; jangan memutar pinggang (*twisting*) saat membawa beban!
      `,
    },
    {
      id: 'l6-3',
      course_id: 'c6-ergonomi',
      title: '3. Faktor Lingkungan Kerja: Kebisingan, Pencahayaan & Suhu',
      slug: 'faktor-lingkungan-kerja-fisik',
      order_index: 3,
      duration_minutes: 30,
      key_points: [
        'Nilai Ambang Batas (NAB) Kebisingan: 85 dBA untuk paparan maksimal 8 jam per hari (Permenaker No. 5/2018).',
        'Pencahayaan minimal area kerja umum: 100-200 Lux; pekerjaan teliti: 300-500 Lux.',
        'Suhu nyaman kerja di iklim tropis: 23°C - 26°C dengan kelembapan 40-60%.',
      ],
      content_text: `
### Pengukuran & Pengendalian Lingkungan Fisik Kerja

Permenaker No. 5 Tahun 2018 mengatur batas aman paparan faktor fisik dan kimia di lingkungan kerja.

#### 1. Kebisingan
- Paparan terus menerus di atas 85 dBA merusak sel-sel rambut silia di telinga dalam yang tidak dapat beregenerasi (*Noise Induced Hearing Loss* / Tuli Akibat Kerja).
- Jika tingkat suara naik 3 dB (aturan *3-dB exchange rate*), waktu paparan aman terpotong setengahnya (contoh: 88 dBA hanya aman selama 4 jam).

#### 2. Pencahayaan
- Pencahayaan yang kurang menyebabkan ketegangan mata, sakit kepala, dan meningkatkan tingkat kesalahan operasi mesin.
- Hindari silau langsung (*glare*) dari lampu atau pantulan sinar matahari pada permukaan meja kerja.
      `,
    },
  ],
};

export const INITIAL_QUIZZES: Record<string, Quiz> = {
  'c1-dasar-k3': {
    id: 'q1',
    course_id: 'c1-dasar-k3',
    title: 'Ujian Evaluasi Kompetensi: Dasar-dasar K3',
    description: 'Uji pemahaman Anda mengenai undang-undang K3 di Indonesia, teori penyebab kecelakaan, budaya 5R, dan tanggap darurat.',
    passing_score: 75,
    time_limit_minutes: 15,
    max_attempts: 3,
    is_active: true,
    shuffle_questions: false,
    total_questions: 5,
  },
  'c2-apd': {
    id: 'q2',
    course_id: 'c2-apd',
    title: 'Ujian Evaluasi Kompetensi: Standar Penggunaan APD',
    description: 'Uji pemahaman mendalam tentang kriteria kelayakan APD, inspeksi keselamatan, dan penggunaan harness di ketinggian.',
    passing_score: 75,
    time_limit_minutes: 15,
    max_attempts: 3,
    is_active: true,
    shuffle_questions: false,
    total_questions: 5,
  },
  'c3-p3k': {
    id: 'q3',
    course_id: 'c3-p3k',
    title: 'Ujian Evaluasi Kompetensi: Tanggap Darurat P3K',
    description: 'Evaluasi respon tanggap darurat medis, teknik RJP/CPR yang benar, penanganan trauma pendarahan, dan luka bakar.',
    passing_score: 75,
    time_limit_minutes: 15,
    max_attempts: 3,
    is_active: true,
    shuffle_questions: false,
    total_questions: 5,
  },
  'c4-damkar': {
    id: 'q4',
    course_id: 'c4-damkar',
    title: 'Ujian Evaluasi Kompetensi: Pencegahan Kebakaran & APAR',
    description: 'Evaluasi segitiga api, pemadaman metode PASS, kelas kebakaran listrik, dan jalur evakuasi aman.',
    passing_score: 75,
    time_limit_minutes: 15,
    max_attempts: 3,
    is_active: true,
    shuffle_questions: false,
    total_questions: 5,
  },
  'c5-hiradc': {
    id: 'q5',
    course_id: 'c5-hiradc',
    title: 'Ujian Evaluasi Kompetensi: HIRADC & Hierarki Pengendalian',
    description: 'Uji kemampuan analisa risiko, perhitungan matriks risiko K3, dan penerapan 5 hierarki kendali bahaya.',
    passing_score: 75,
    time_limit_minutes: 15,
    max_attempts: 3,
    is_active: true,
    shuffle_questions: false,
    total_questions: 5,
  },
  'c6-ergonomi': {
    id: 'q6',
    course_id: 'c6-ergonomi',
    title: 'Ujian Evaluasi Kompetensi: Ergonomi & Lingkungan Fisik',
    description: 'Evaluasi postur kerja aman, teknik mengangkat barang, ambang batas kebisingan 85 dB, dan tata kelola pencahayaan.',
    passing_score: 75,
    time_limit_minutes: 15,
    max_attempts: 3,
    is_active: true,
    shuffle_questions: false,
    total_questions: 5,
  },
};

export const INITIAL_QUESTIONS: Record<string, Question[]> = {
  q1: [
    {
      id: 'q1-1',
      quiz_id: 'q1',
      question_text: 'Peraturan perundang-undangan pokok yang menjadi landasan utama keselamatan kerja di Indonesia adalah...',
      order_index: 1,
      explanation: 'Undang-Undang No. 1 Tahun 1970 tentang Keselamatan Kerja mengatur kewajiban pengurus dan pekerja terkait syarat-syarat keselamatan di seluruh tempat kerja di Indonesia.',
      options: [
        { id: 'opt1-1a', question_id: 'q1-1', option_text: 'Undang-Undang No. 1 Tahun 1970', order_index: 1, is_correct: true },
        { id: 'opt1-1b', question_id: 'q1-1', option_text: 'Undang-Undang No. 20 Tahun 2003', order_index: 2, is_correct: false },
        { id: 'opt1-1c', question_id: 'q1-1', option_text: 'Peraturan Pemerintah No. 10 Tahun 1980', order_index: 3, is_correct: false },
        { id: 'opt1-1d', question_id: 'q1-1', option_text: 'Instruksi Presiden No. 5 Tahun 1995', order_index: 4, is_correct: false },
      ],
    },
    {
      id: 'q1-2',
      quiz_id: 'q1',
      question_text: 'Berdasarkan teori segitiga kecelakaan Heinrich, perbandingan antara 1 kecelakaan fatal/berat terhadap kecelakaan ringan dan insiden nyaris celaka (near miss) adalah...',
      order_index: 2,
      explanation: 'Menurut H.W. Heinrich, rasio statistik kecelakaan adalah 1 kecelakaan fatal : 29 cedera ringan : 300 kejadian nyaris celaka (near-miss).',
      options: [
        { id: 'opt1-2a', question_id: 'q1-2', option_text: '1 fatal : 10 cedera ringan : 100 near miss', order_index: 1, is_correct: false },
        { id: 'opt1-2b', question_id: 'q1-2', option_text: '1 fatal : 29 cedera ringan : 300 near miss', order_index: 2, is_correct: true },
        { id: 'opt1-2c', question_id: 'q1-2', option_text: '1 fatal : 50 cedera ringan : 500 near miss', order_index: 3, is_correct: false },
        { id: 'opt1-2d', question_id: 'q1-2', option_text: '1 fatal : 5 cedera ringan : 25 near miss', order_index: 4, is_correct: false },
      ],
    },
    {
      id: 'q1-3',
      quiz_id: 'q1',
      question_text: 'Tindakan seorang operator yang sengaja melepaskan penutup pelindung (guard) mesin berputar saat bekerja dikategorikan sebagai...',
      order_index: 3,
      explanation: 'Melepaskan pelindung pengaman mesin merupakan pelanggaran perilaku kerja yang disebut Tindakan Tidak Aman (Unsafe Action).',
      options: [
        { id: 'opt1-3a', question_id: 'q1-3', option_text: 'Kondisi Tidak Aman (Unsafe Condition)', order_index: 1, is_correct: false },
        { id: 'opt1-3b', question_id: 'q1-3', option_text: 'Tindakan Tidak Aman (Unsafe Action)', order_index: 2, is_correct: true },
        { id: 'opt1-3c', question_id: 'q1-3', option_text: 'Force Majeure', order_index: 3, is_correct: false },
        { id: 'opt1-3d', question_id: 'q1-3', option_text: 'Kegagalan Pabrikasi Mesin', order_index: 4, is_correct: false },
      ],
    },
    {
      id: 'q1-4',
      quiz_id: 'q1',
      question_text: 'Dalam prinsip budaya kerja 5R (5S), tahap "Seiri" atau "Ringkas" bermakna...',
      order_index: 4,
      explanation: 'Seiri (Ringkas) adalah memilah dan memisahkan barang yang masih dibutuhkan dari barang yang tidak lagi diperlukan, kemudian menyingkirkan yang tidak berguna.',
      options: [
        { id: 'opt1-4a', question_id: 'q1-4', option_text: 'Membersihkan lantai dan mesin dari ceceran oli', order_index: 1, is_correct: false },
        { id: 'opt1-4b', question_id: 'q1-4', option_text: 'Memilah dan menyingkirkan barang yang tidak diperlukan dari tempat kerja', order_index: 2, is_correct: true },
        { id: 'opt1-4c', question_id: 'q1-4', option_text: 'Membiasakan diri bekerja disiplin sesuai SOP', order_index: 3, is_correct: false },
        { id: 'opt1-4d', question_id: 'q1-4', option_text: 'Memberi label nama pada laci penyimpanan', order_index: 4, is_correct: false },
      ],
    },
    {
      id: 'q1-5',
      quiz_id: 'q1',
      question_text: 'Ketika alarm tanda bahaya evakuasi berbunyi di gedung bertingkat, tindakan yang PALING BENAR adalah...',
      order_index: 5,
      explanation: 'Saat evakuasi gedung tinggi, dilarang keras memakai lift karena berisiko macet akibat putusnya pasokan listrik. Gunakan selalu tangga darurat menuju titik kumpul.',
      options: [
        { id: 'opt1-5a', question_id: 'q1-5', option_text: 'Segera turun menggunakan lift agar cepat sampai ke lobi', order_index: 1, is_correct: false },
        { id: 'opt1-5b', question_id: 'q1-5', option_text: 'Evakuasi tenang melalui tangga darurat menuju Assembly Point', order_index: 2, is_correct: true },
        { id: 'opt1-5c', question_id: 'q1-5', option_text: 'Bersembunyi di dalam toilet sampai situasi aman', order_index: 3, is_correct: false },
        { id: 'opt1-5d', question_id: 'q1-5', option_text: 'Kembali ke meja kerja untuk membereskan berkas-berkas penting', order_index: 4, is_correct: false },
      ],
    },
  ],
  q2: [
    {
      id: 'q2-1',
      quiz_id: 'q2',
      question_text: 'Dalam hierarki pengendalian bahaya K3, posisi Alat Pelindung Diri (APD) berada pada tingkatan...',
      order_index: 1,
      explanation: 'APD adalah garis pertahanan terakhir (Last Line of Defense) karena bahaya tetap ada di tempat kerja jika APD dilepas atau gagal berfungsi.',
      options: [
        { id: 'opt2-1a', question_id: 'q2-1', option_text: 'Paling pertama dan paling efektif', order_index: 1, is_correct: false },
        { id: 'opt2-1b', question_id: 'q2-1', option_text: 'Garis pertahanan terakhir (paling tidak efektif)', order_index: 2, is_correct: true },
        { id: 'opt2-1c', question_id: 'q2-1', option_text: 'Setara dengan rekayasa teknik', order_index: 3, is_correct: false },
        { id: 'opt2-1d', question_id: 'q2-1', option_text: 'Satu-satunya pengendalian yang diwajibkan undang-undang', order_index: 4, is_correct: false },
      ],
    },
    {
      id: 'q2-2',
      quiz_id: 'q2',
      question_text: 'Ketinggian minimal di mana pekerja diwajibkan menggunakan Full Body Harness dengan tali pengaman (lanyard) menurut standar K3 adalah...',
      order_index: 2,
      explanation: 'Sesuai regulasi K3 bekerja di ketinggian (Permenaker 9/2016), ketinggian 1.8 meter (atau bila ada potensi jatuh berakibat fatal) mewajibkan pemakaian sistem penahan jatuh.',
      options: [
        { id: 'opt2-2a', question_id: 'q2-2', option_text: '1.0 meter', order_index: 1, is_correct: false },
        { id: 'opt2-2b', question_id: 'q2-2', option_text: '1.8 meter', order_index: 2, is_correct: true },
        { id: 'opt2-2c', question_id: 'q2-2', option_text: '3.5 meter', order_index: 3, is_correct: false },
        { id: 'opt2-2d', question_id: 'q2-2', option_text: '5.0 meter', order_index: 4, is_correct: false },
      ],
    },
    {
      id: 'q2-3',
      quiz_id: 'q2',
      question_text: 'Masa kedaluwarsa umum helm keselamatan (safety helmet) industri sejak tanggal pembuatan pabrik rata-rata berkisar antara...',
      order_index: 3,
      explanation: 'Material polimer plastik helm keselamatan mengalami degradasi akibat paparan sinar UV dan suhu, sehingga memiliki masa pakai maksimal 3 sampai 5 tahun.',
      options: [
        { id: 'opt2-3a', question_id: 'q2-3', option_text: '1 tahun', order_index: 1, is_correct: false },
        { id: 'opt2-3b', question_id: 'q2-3', option_text: '3 hingga 5 tahun', order_index: 2, is_correct: true },
        { id: 'opt2-3c', question_id: 'q2-3', option_text: '10 hingga 15 tahun', order_index: 3, is_correct: false },
        { id: 'opt2-3d', question_id: 'q2-3', option_text: 'Tidak ada batas kedaluwarsa selama tidak pecah', order_index: 4, is_correct: false },
      ],
    },
    {
      id: 'q2-4',
      quiz_id: 'q2',
      question_text: 'Jenis sarung tangan yang PALING TEPAT digunakan saat menangani larutan asam atau zat kimia pelarut korosif adalah...',
      order_index: 4,
      explanation: 'Sarung tangan nitrile atau neoprene memiliki ketahanan tinggi terhadap penetrasi bahan kimia berbahaya, sedangkan katun dan kulit mudah menyerap cairan kimia.',
      options: [
        { id: 'opt2-4a', question_id: 'q2-4', option_text: 'Sarung tangan katun rajut', order_index: 1, is_correct: false },
        { id: 'opt2-4b', question_id: 'q2-4', option_text: 'Sarung tangan kulit las', order_index: 2, is_correct: false },
        { id: 'opt2-4c', question_id: 'q2-4', option_text: 'Sarung tangan karet Nitrile / Neoprene', order_index: 3, is_correct: true },
        { id: 'opt2-4d', question_id: 'q2-4', option_text: 'Sarung tangan wol hangat', order_index: 4, is_correct: false },
      ],
    },
    {
      id: 'q2-5',
      quiz_id: 'q2',
      question_text: 'Jika sebuah helm pelindung pernah tertimpa bongkahan batu besar dari atas namun secara kasat mata tampak tidak pecah, tindakan yang harus diambil adalah...',
      order_index: 5,
      explanation: 'Struktur molekul helm yang telah menerima impak berat telah mengalami kelelahan bahan (*stress fractures*) mikroskopis dan wajib diafkir/dimusnahkan.',
      options: [
        { id: 'opt2-5a', question_id: 'q2-5', option_text: 'Tetap dipakai karena masih mulus tanpa goresan dalam', order_index: 1, is_correct: false },
        { id: 'opt2-5b', question_id: 'q2-5', option_text: 'Segera diafkir dan diganti baru karena kekuatan strukturnya sudah melemah', order_index: 2, is_correct: true },
        { id: 'opt2-5c', question_id: 'q2-5', option_text: 'Dibersihkan dengan bensin lalu dipakai kembali', order_index: 3, is_correct: false },
        { id: 'opt2-5d', question_id: 'q2-5', option_text: 'Diberikan kepada pekerja magang', order_index: 4, is_correct: false },
      ],
    },
  ],
  q3: [
    {
      id: 'q3-1',
      quiz_id: 'q3',
      question_text: 'Sebelum mendekati dan menolong korban kecelakaan, penolong wajib menerapkan prinsip "3A", yaitu...',
      order_index: 1,
      explanation: 'Prinsip keselamatan penolong pertama adalah 3A: Aman Diri (penolong tidak boleh jadi korban kedua), Aman Korban, dan Aman Lingkungan.',
      options: [
        { id: 'opt3-1a', question_id: 'q3-1', option_text: 'Aman Diri, Aman Pasien/Korban, Aman Lingkungan', order_index: 1, is_correct: true },
        { id: 'opt3-1b', question_id: 'q3-1', option_text: 'Amankan Harta, Ambil Foto, Ajukan Laporan', order_index: 2, is_correct: false },
        { id: 'opt3-1c', question_id: 'q3-1', option_text: 'Antisipasi, Aksi Cepat, Ambulans Tiba', order_index: 3, is_correct: false },
        { id: 'opt3-1d', question_id: 'q3-1', option_text: 'Analisa Biaya, Amati Luka, Angkat Pasien', order_index: 4, is_correct: false },
      ],
    },
    {
      id: 'q3-2',
      quiz_id: 'q3',
      question_text: 'Kecepatan kompresi dada yang direkomendasikan saat melakukan Resusitasi Jantung Paru (RJP) pada korban henti jantung dewasa adalah...',
      order_index: 2,
      explanation: 'Panduan standar American Heart Association (AHA) dan PMI menetapkan kecepatan kompresi dada adalah 100 hingga 120 kali per menit dengan kedalaman 5-6 cm.',
      options: [
        { id: 'opt3-2a', question_id: 'q3-2', option_text: '40 - 60 kali per menit', order_index: 1, is_correct: false },
        { id: 'opt3-2b', question_id: 'q3-2', option_text: '70 - 80 kali per menit', order_index: 2, is_correct: false },
        { id: 'opt3-2c', question_id: 'q3-2', option_text: '100 - 120 kali per menit', order_index: 3, is_correct: true },
        { id: 'opt3-2d', question_id: 'q3-2', option_text: '150 - 180 kali per menit', order_index: 4, is_correct: false },
      ],
    },
    {
      id: 'q3-3',
      quiz_id: 'q3',
      question_text: 'Tindakan pertolongan pertama yang PALING TEPAT pada luka bakar termal adalah...',
      order_index: 3,
      explanation: 'Luka bakar harus dialiri air bersih suhu ruang selama minimal 15-20 menit untuk mendinginkan jaringan. Odol dan mentega justru memerangkap panas dan memicu infeksi.',
      options: [
        { id: 'opt3-3a', question_id: 'q3-3', option_text: 'Mengoleskan pasta gigi (odol) atau minyak goreng', order_index: 1, is_correct: false },
        { id: 'opt3-3b', question_id: 'q3-3', option_text: 'Mengaliri luka dengan air bersih suhu ruang selama 15-20 menit', order_index: 2, is_correct: true },
        { id: 'opt3-3c', question_id: 'q3-3', option_text: 'Menempelkan balok es batu langsung pada luka bakar', order_index: 3, is_correct: false },
        { id: 'opt3-3d', question_id: 'q3-3', option_text: 'Memecahkan gelembung luka yang melepuh dengan jarum', order_index: 4, is_correct: false },
      ],
    },
    {
      id: 'q3-4',
      quiz_id: 'q3',
      question_text: 'Langkah pertama yang mutlak dilakukan saat melihat rekan kerja tergeletak tersengat kabel listrik beraliran aktif adalah...',
      order_index: 4,
      explanation: 'Jangan pernah langsung memegang korban sebelum sumber listrik dimatikan atau diputus. Penolong bisa tersengat aliran arus yang sama.',
      options: [
        { id: 'opt3-4a', question_id: 'q3-4', option_text: 'Menarik tangan korban secepat mungkin dengan tangan kosong', order_index: 1, is_correct: false },
        { id: 'opt3-4b', question_id: 'q3-4', option_text: 'Memutuskan aliran listrik utama (sakelar/breaker) terlebih dahulu', order_index: 2, is_correct: true },
        { id: 'opt3-4c', question_id: 'q3-4', option_text: 'Menyiram korban dengan air agar cepat sadar', order_index: 3, is_correct: false },
        { id: 'opt3-4d', question_id: 'q3-4', option_text: 'Memberikan kompresi RJP langsung di atas kabel', order_index: 4, is_correct: false },
      ],
    },
    {
      id: 'q3-5',
      quiz_id: 'q3',
      question_text: 'Jika ada sebatang besi atau paku yang menancap dalam di tubuh korban kecelakaan kerja, tindakan yang benar adalah...',
      order_index: 5,
      explanation: 'Benda yang menancap berfungsi sebagai sumbat pendarahan. Mencabutnya sembarangan dapat menyebabkan pendarahan masif yang fatal. Stabilkan posisi benda tersebut.',
      options: [
        { id: 'opt3-5a', question_id: 'q3-5', option_text: 'Mencabut besi secepatnya agar luka bisa dibersihkan', order_index: 1, is_correct: false },
        { id: 'opt3-5b', question_id: 'q3-5', option_text: 'Menstabilkan benda pada posisinya tanpa dicabut lalu bawa ke rumah sakit', order_index: 2, is_correct: true },
        { id: 'opt3-5c', question_id: 'q3-5', option_text: 'Memutar besi agar tidak menempel di tulang', order_index: 3, is_correct: false },
        { id: 'opt3-5d', question_id: 'q3-5', option_text: 'Menekan besi lebih dalam agar tidak goyang saat ambulans jalan', order_index: 4, is_correct: false },
      ],
    },
  ],
  q4: [
    {
      id: 'q4-1',
      quiz_id: 'q4',
      question_text: 'Tiga elemen dasar pembentuk "Segitiga Api" (Fire Triangle) adalah...',
      order_index: 1,
      explanation: 'Api hanya dapat menyala jika terdapat tiga unsur yang cukup: Bahan Bakar (Fuel), Oksigen (O2), dan Sumber Panas (Heat).',
      options: [
        { id: 'opt4-1a', question_id: 'q4-1', option_text: 'Bahan Bakar, Oksigen, dan Sumber Panas', order_index: 1, is_correct: true },
        { id: 'opt4-1b', question_id: 'q4-1', option_text: 'Minyak, Asap, dan Karbondioksida', order_index: 2, is_correct: false },
        { id: 'opt4-1c', question_id: 'q4-1', option_text: 'Bensin, Korek Api, dan Air', order_index: 3, is_correct: false },
        { id: 'opt4-1d', question_id: 'q4-1', option_text: 'Kayu, Listrik, dan Tekanan Udara', order_index: 4, is_correct: false },
      ],
    },
    {
      id: 'q4-2',
      quiz_id: 'q4',
      question_text: 'Kebakaran yang terjadi pada panel listrik bertegangan atau instalasi kabel masuk ke dalam klasifikasi kebakaran kelas...',
      order_index: 2,
      explanation: 'Sesuai standar NFPA dan Permenakertrans 04/1980, Kebakaran Kelas C adalah kebakaran yang melibatkan peralatan listrik bertegangan aktif.',
      options: [
        { id: 'opt4-2a', question_id: 'q4-2', option_text: 'Kelas A', order_index: 1, is_correct: false },
        { id: 'opt4-2b', question_id: 'q4-2', option_text: 'Kelas B', order_index: 2, is_correct: false },
        { id: 'opt4-2c', question_id: 'q4-2', option_text: 'Kelas C', order_index: 3, is_correct: true },
        { id: 'opt4-2d', question_id: 'q4-2', option_text: 'Kelas D', order_index: 4, is_correct: false },
      ],
    },
    {
      id: 'q4-3',
      quiz_id: 'q4',
      question_text: 'Kepanjangan dari akronim metode penggunaan APAR "PASS" adalah...',
      order_index: 3,
      explanation: 'P.A.S.S = Pull the pin (tarik pin), Aim at base of fire (arahkan ke pangkal api), Squeeze lever (tekan tuas), Sweep side to side (sapukan sisi ke sisi).',
      options: [
        { id: 'opt4-3a', question_id: 'q4-3', option_text: 'Push, Alert, Save, Stop', order_index: 1, is_correct: false },
        { id: 'opt4-3b', question_id: 'q4-3', option_text: 'Pull, Aim, Squeeze, Sweep', order_index: 2, is_correct: true },
        { id: 'opt4-3c', question_id: 'q4-3', option_text: 'Press, Attack, Secure, Safe', order_index: 3, is_correct: false },
        { id: 'opt4-3d', question_id: 'q4-3', option_text: 'Point, Activate, Spray, Step', order_index: 4, is_correct: false },
      ],
    },
    {
      id: 'q4-4',
      quiz_id: 'q4',
      question_text: 'Mengapa APAR jenis Air (Water Extinguisher) dilarang keras digunakan pada kebakaran panel listrik?',
      order_index: 4,
      explanation: 'Air merupakan penghantar listrik yang baik sehingga berisiko tinggi menyengat penolong dengan arus fatal.',
      options: [
        { id: 'opt4-4a', question_id: 'q4-4', option_text: 'Air akan membuat api semakin membesar secara instan', order_index: 1, is_correct: false },
        { id: 'opt4-4b', question_id: 'q4-4', option_text: 'Air menghantarkan arus listrik dan dapat menyengat operator pemadam', order_index: 2, is_correct: true },
        { id: 'opt4-4c', question_id: 'q4-4', option_text: 'Air merusak cat tembok di sekitar panel listrik', order_index: 3, is_correct: false },
        { id: 'opt4-4d', question_id: 'q4-4', option_text: 'Tabung APAR air mudah meledak jika terkena panas', order_index: 4, is_correct: false },
      ],
    },
    {
      id: 'q4-5',
      quiz_id: 'q4',
      question_text: 'Ketika berada di ruangan yang dipenuhi asap tebal akibat kebakaran, cara terbaik bergerak menuju pintu keluar adalah...',
      order_index: 5,
      explanation: 'Asap panas beracun bergerak naik ke atas langit-langit ruangan. Lapisan udara bersih tersisa sekitar 30 cm dari lantai, sehingga merangkak adalah cara teraman.',
      options: [
        { id: 'opt4-5a', question_id: 'q4-5', option_text: 'Berlari tegak secepat mungkin sambil menahan napas', order_index: 1, is_correct: false },
        { id: 'opt4-5b', question_id: 'q4-5', option_text: 'Merangkak rendah dekat lantai menuju jalur keluar', order_index: 2, is_correct: true },
        { id: 'opt4-5c', question_id: 'q4-5', option_text: 'Melompat-lompat agar kepala berada di atas kabut asap', order_index: 3, is_correct: false },
        { id: 'opt4-5d', question_id: 'q4-5', option_text: 'Membuka semua jendela ruangan lebar-lebar', order_index: 4, is_correct: false },
      ],
    },
  ],
  q5: [
    {
      id: 'q5-1',
      quiz_id: 'q5',
      question_text: 'Tingkatan pengendalian bahaya yang PALING EFEKTIF menurut Hierarchy of Controls adalah...',
      order_index: 1,
      explanation: 'Eliminasi adalah tindakan tertinggi dan paling efektif karena menghilangkan sumber bahaya secara total dari lingkungan kerja.',
      options: [
        { id: 'opt5-1a', question_id: 'q5-1', option_text: 'Alat Pelindung Diri (APD)', order_index: 1, is_correct: false },
        { id: 'opt5-1b', question_id: 'q5-1', option_text: 'Pengendalian Administratif (SOP)', order_index: 2, is_correct: false },
        { id: 'opt5-1c', question_id: 'q5-1', option_text: 'Eliminasi (Menghilangkan bahaya)', order_index: 3, is_correct: true },
        { id: 'opt5-1d', question_id: 'q5-1', option_text: 'Rekayasa Teknik (Engineering Control)', order_index: 4, is_correct: false },
      ],
    },
    {
      id: 'q5-2',
      quiz_id: 'q5',
      question_text: 'Mengganti bahan pembersih kimia beracun benzena dengan bahan berbasis air (water-based) merupakan contoh penerapan pengendalian...',
      order_index: 2,
      explanation: 'Substitusi adalah mengganti material, zat, atau peralatan berbahaya dengan alternatif lain yang lebih aman.',
      options: [
        { id: 'opt5-2a', question_id: 'q5-2', option_text: 'Substitusi', order_index: 1, is_correct: true },
        { id: 'opt5-2b', question_id: 'q5-2', option_text: 'Eliminasi', order_index: 2, is_correct: false },
        { id: 'opt5-2c', question_id: 'q5-2', option_text: 'Pengendalian Rekayasa Teknik', order_index: 3, is_correct: false },
        { id: 'opt5-2d', question_id: 'q5-2', option_text: 'Pengendalian Administratif', order_index: 4, is_correct: false },
      ],
    },
    {
      id: 'q5-3',
      quiz_id: 'q5',
      question_text: 'Dalam matriks penilaian risiko (Risk Assessment Matrix), nilai tingkat risiko ditentukan oleh perkalian antara...',
      order_index: 3,
      explanation: 'Tingkat Risiko (Risk Score) = Peluang Terjadi (Likelihood) × Tingkat Keparahan Akibat (Severity/Consequence).',
      options: [
        { id: 'opt5-3a', question_id: 'q5-3', option_text: 'Biaya Alat × Jumlah Pekerja', order_index: 1, is_correct: false },
        { id: 'opt5-3b', question_id: 'q5-3', option_text: 'Peluang Terjadi (Likelihood) × Tingkat Keparahan (Severity)', order_index: 2, is_correct: true },
        { id: 'opt5-3c', question_id: 'q5-3', option_text: 'Kecepatan Mesin × Waktu Kerja', order_index: 3, is_correct: false },
        { id: 'opt5-3d', question_id: 'q5-3', option_text: 'Jumlah Jam Lembur × Gaji Karyawan', order_index: 4, is_correct: false },
      ],
    },
    {
      id: 'q5-4',
      quiz_id: 'q5',
      question_text: 'Memasang kap peredam suara (acoustic enclosure) pada kompresor mesin bising termasuk ke dalam jenis pengendalian...',
      order_index: 4,
      explanation: 'Engineering control (Rekayasa Teknik) memodifikasi desain fisik atau peralatan untuk mengisolasi atau meredam bahaya dari pekerja.',
      options: [
        { id: 'opt5-4a', question_id: 'q5-4', option_text: 'Rekayasa Teknik (Engineering Control)', order_index: 1, is_correct: true },
        { id: 'opt5-4b', question_id: 'q5-4', option_text: 'Alat Pelindung Diri (APD)', order_index: 2, is_correct: false },
        { id: 'opt5-4c', question_id: 'q5-4', option_text: 'Eliminasi', order_index: 3, is_correct: false },
        { id: 'opt5-4d', question_id: 'q5-4', option_text: 'Pengendalian Finansial', order_index: 4, is_correct: false },
      ],
    },
    {
      id: 'q5-5',
      quiz_id: 'q5',
      question_text: 'Tujuan utama pembuatan Job Safety Analysis (JSA) sebelum memulai pekerjaan berisiko tinggi adalah...',
      order_index: 5,
      explanation: 'JSA memecah langkah kerja menjadi tahapan sistematis guna mengidentifikasi potensi bahaya di tiap langkah serta merumuskan tindakan mitigasinya.',
      options: [
        { id: 'opt5-5a', question_id: 'q5-5', option_text: 'Mempercepat waktu kerja agar lembur tidak terlalu lama', order_index: 1, is_correct: false },
        { id: 'opt5-5b', question_id: 'q5-5', option_text: 'Mengidentifikasi bahaya pada setiap langkah kerja dan menentukan tindakan pencegahannya', order_index: 2, is_correct: true },
        { id: 'opt5-5c', question_id: 'q5-5', option_text: 'Sebagai formalitas agar perusahaan tidak dikenakan denda pajak', order_index: 3, is_correct: false },
        { id: 'opt5-5d', question_id: 'q5-5', option_text: 'Menghitung estimasi biaya kerusakan mesin', order_index: 4, is_correct: false },
      ],
    },
  ],
  q6: [
    {
      id: 'q6-1',
      quiz_id: 'q6',
      question_text: 'Menurut Permenaker No. 5 Tahun 2018, Nilai Ambang Batas (NAB) kebisingan di tempat kerja untuk waktu paparan 8 jam per hari adalah...',
      order_index: 1,
      explanation: 'NAB kebisingan yang diizinkan untuk 8 jam kerja terus menerus per hari adalah 85 dBA. Paparan di atas 85 dBA mewajibkan pengendalian dan alat pelindung pendengaran.',
      options: [
        { id: 'opt6-1a', question_id: 'q6-1', option_text: '70 dBA', order_index: 1, is_correct: false },
        { id: 'opt6-1b', question_id: 'q6-1', option_text: '85 dBA', order_index: 2, is_correct: true },
        { id: 'opt6-1c', question_id: 'q6-1', option_text: '100 dBA', order_index: 3, is_correct: false },
        { id: 'opt6-1d', question_id: 'q6-1', option_text: '120 dBA', order_index: 4, is_correct: false },
      ],
    },
    {
      id: 'q6-2',
      quiz_id: 'q6',
      question_text: 'Saat mengangkat beban berat secara manual dari lantai, bagian tubuh yang harus menjadi tumpuan tenaga utama adalah...',
      order_index: 2,
      explanation: 'Otot paha dan kaki adalah kelompok otot terkuat tubuh. Hindari bertumpu pada otot pinggang atau membungkuk karena rentan memicu cedera saraf tulang belakang (HNP).',
      options: [
        { id: 'opt6-2a', question_id: 'q6-2', option_text: 'Otot punggung bawah sambil membungkuk', order_index: 1, is_correct: false },
        { id: 'opt6-2b', question_id: 'q6-2', option_text: 'Otot paha dan kaki dengan posisi lutut menekuk dan punggung lurus', order_index: 2, is_correct: true },
        { id: 'opt6-2c', question_id: 'q6-2', option_text: 'Otot leher dan pundak', order_index: 3, is_correct: false },
        { id: 'opt6-2d', question_id: 'q6-2', option_text: 'Ujung jari tangan', order_index: 4, is_correct: false },
      ],
    },
    {
      id: 'q6-3',
      quiz_id: 'q6',
      question_text: 'Istilah "Rule of 20-20-20" pada ergonomi perkantoran bertujuan untuk...',
      order_index: 3,
      explanation: 'Aturan 20-20-20 (setiap 20 menit menatap layar, istirahatkan mata selama 20 detik dengan melihat objek berjarak 20 kaki/6 meter) efektif mencegah kelelahan mata digital.',
      options: [
        { id: 'opt6-3a', question_id: 'q6-3', option_text: 'Mencegah kelelahan mata akibat menatap monitor komputer', order_index: 1, is_correct: true },
        { id: 'opt6-3b', question_id: 'q6-3', option_text: 'Mengatur jeda waktu istirahat makan siang', order_index: 2, is_correct: false },
        { id: 'opt6-3c', question_id: 'q6-3', option_text: 'Menghitung konsumsi air minum karyawan', order_index: 3, is_correct: false },
        { id: 'opt6-3d', question_id: 'q6-3', option_text: 'Membatasi durasi rapat kerja', order_index: 4, is_correct: false },
      ],
    },
    {
      id: 'q6-4',
      quiz_id: 'q6',
      question_text: 'Batas beban pengangkatan manual per individu yang direkomendasikan untuk pekerja pria dewasa dalam kondisi ergonomis ideal umumnya adalah...',
      order_index: 4,
      explanation: 'Standar ergonomi dan pedoman ILO merekomendasikan beban angkat manual maksimum pria dewasa berkisar antara 15 hingga 20 kg. Di atas angka tersebut dianjurkan mengangkat berdua atau menggunakan forklift/troli.',
      options: [
        { id: 'opt6-4a', question_id: 'q6-4', option_text: '5 - 8 kg', order_index: 1, is_correct: false },
        { id: 'opt6-4b', question_id: 'q6-4', option_text: '15 - 20 kg', order_index: 2, is_correct: true },
        { id: 'opt6-4c', question_id: 'q6-4', option_text: '45 - 50 kg', order_index: 3, is_correct: false },
        { id: 'opt6-4d', question_id: 'q6-4', option_text: '70 - 80 kg', order_index: 4, is_correct: false },
      ],
    },
    {
      id: 'q6-5',
      quiz_id: 'q6',
      question_text: 'Keluhan gangguan otot, saraf, dan tendon yang timbul bertahap akibat postur janggal dan gerakan berulang (repetitif) dikenal dengan istilah...',
      order_index: 5,
      explanation: 'MSDs (Musculoskeletal Disorders) adalah gangguan kesehatan kerja paling umum yang menyerang sistem muskuloskeletal akibat desain kerja yang tidak ergonomis.',
      options: [
        { id: 'opt6-5a', question_id: 'q6-5', option_text: 'Musculoskeletal Disorders (MSDs)', order_index: 1, is_correct: true },
        { id: 'opt6-5b', question_id: 'q6-5', option_text: 'Acute Respiratory Syndrome (ARS)', order_index: 2, is_correct: false },
        { id: 'opt6-5c', question_id: 'q6-5', option_text: 'Dermatitis Kontak Alergi', order_index: 3, is_correct: false },
        { id: 'opt6-5d', question_id: 'q6-5', option_text: 'Tinitus Akut', order_index: 4, is_correct: false },
      ],
    },
  ],
};
