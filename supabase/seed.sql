-- ====================================================================
-- SEED DATA UNTUK K3LEARN (6 KURSUS K3 STANDAR)
-- ====================================================================

-- 1. Kursus 1: Dasar-dasar K3
INSERT INTO public.courses (id, slug, title, description, category, level, duration_minutes, thumbnail_url, is_published)
VALUES (
    'c1111111-1111-1111-1111-111111111111',
    'dasar-dasar-k3',
    'Dasar-dasar Keselamatan dan Kesehatan Kerja (K3)',
    'Pelajari konsep fundamental K3, landasan hukum UU No. 1 Tahun 1970, filosofi pencegahan kecelakaan kerja, dan implementasi SMK3.',
    'Dasar-dasar K3',
    'Pemula',
    90,
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
    true
) ON CONFLICT (slug) DO NOTHING;

-- 2. Kursus 2: APD
INSERT INTO public.courses (id, slug, title, description, category, level, duration_minutes, thumbnail_url, is_published)
VALUES (
    'c2222222-2222-2222-2222-222222222222',
    'penggunaan-alat-pelindung-diri-apd',
    'Standar & Praktik Penggunaan Alat Pelindung Diri (APD)',
    'Panduan komprehensif pemilihan, pemeriksaan kelayakan, cara pakai yang benar, serta perawatan APD sesuai regulasi.',
    'Penggunaan Alat Pelindung Diri (APD)',
    'Pemula',
    75,
    'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80',
    true
) ON CONFLICT (slug) DO NOTHING;

-- 3. Kursus 3: P3K
INSERT INTO public.courses (id, slug, title, description, category, level, duration_minutes, thumbnail_url, is_published)
VALUES (
    'c3333333-3333-3333-3333-333333333333',
    'pertolongan-pertama-pada-kecelakaan-p3k',
    'Pertolongan Pertama pada Kecelakaan (P3K) di Tempat Kerja',
    'Keterampilan tanggap darurat medis: Resusitasi Jantung Paru (RJP/CPR), pendarahan, luka bakar, dan manajemen kotak P3K.',
    'Pertolongan Pertama pada Kecelakaan (P3K)',
    'Menengah',
    105,
    'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=800&q=80',
    true
) ON CONFLICT (slug) DO NOTHING;

-- 4. Kursus 4: Damkar
INSERT INTO public.courses (id, slug, title, description, category, level, duration_minutes, thumbnail_url, is_published)
VALUES (
    'c4444444-4444-4444-4444-444444444444',
    'keselamatan-dan-pencegahan-kebakaran',
    'Keselamatan dan Pencegahan Bahaya Kebakaran',
    'Teori segitiga api, klasifikasi kebakaran A-B-C-D, teknik pemadaman api dini menggunakan APAR metode PASS, dan evakuasi.',
    'Keselamatan dan Pencegahan Kebakaran',
    'Menengah',
    90,
    'https://images.unsplash.com/photo-1542385151-efd9000785a0?auto=format&fit=crop&w=800&q=80',
    true
) ON CONFLICT (slug) DO NOTHING;

-- 5. Kursus 5: HIRADC
INSERT INTO public.courses (id, slug, title, description, category, level, duration_minutes, thumbnail_url, is_published)
VALUES (
    'c5555555-5555-5555-5555-555555555555',
    'identifikasi-bahaya-dan-penilaian-risiko',
    'Identifikasi Bahaya dan Penilaian Risiko (HIRADC / IBPR)',
    'Metodologi sistematis mengenali sumber bahaya, menganalisis peluang dan konsekuensi, serta menerapkan 5 hierarki kendali bahaya.',
    'Identifikasi Bahaya dan Penilaian Risiko',
    'Lanjutan',
    120,
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    true
) ON CONFLICT (slug) DO NOTHING;

-- 6. Kursus 6: Ergonomi
INSERT INTO public.courses (id, slug, title, description, category, level, duration_minutes, thumbnail_url, is_published)
VALUES (
    'c6666666-6666-6666-6666-666666666666',
    'ergonomi-dan-keselamatan-lingkungan-kerja',
    'Ergonomi dan Keselamatan Lingkungan Kerja Industri',
    'Optimasi postur kerja, pengangkatan manual, pencahayaan, pengendalian kebisingan sesuai NAB 85 dB, dan ventilasi udara.',
    'Ergonomi dan Keselamatan Lingkungan Kerja',
    'Menengah',
    85,
    'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80',
    true
) ON CONFLICT (slug) DO NOTHING;
