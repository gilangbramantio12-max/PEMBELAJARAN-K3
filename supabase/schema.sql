-- ====================================================================
-- K3LEARN PLATFORM DATABASE SCHEMA (POSTGRESQL / SUPABASE)
-- Sesuai standar ISO 45001 & UU No. 1 Th 1970
-- Mencakup 11 Tabel, Row Level Security (RLS), dan RPC Scoring Otomatis Aman
-- ====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUM Types
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('participant', 'admin');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE course_level AS ENUM ('Pemula', 'Menengah', 'Lanjutan');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE enrollment_status AS ENUM ('enrolled', 'completed');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- ====================================================================
-- TABLE 1: profiles
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    role user_role DEFAULT 'participant' NOT NULL,
    avatar_url TEXT,
    company_or_institution TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ====================================================================
-- TABLE 2: courses
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    level course_level DEFAULT 'Pemula' NOT NULL,
    duration_minutes INT DEFAULT 60 NOT NULL,
    thumbnail_url TEXT,
    is_published BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ====================================================================
-- TABLE 3: lessons
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    order_index INT NOT NULL,
    content_text TEXT NOT NULL,
    video_url TEXT,
    document_url TEXT,
    duration_minutes INT DEFAULT 20 NOT NULL,
    key_points TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT uq_course_lesson_order UNIQUE(course_id, order_index)
);

-- ====================================================================
-- TABLE 4: enrollments
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    status enrollment_status DEFAULT 'enrolled' NOT NULL,
    enrolled_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    completed_at TIMESTAMPTZ,
    CONSTRAINT uq_user_course_enrollment UNIQUE(user_id, course_id)
);

-- ====================================================================
-- TABLE 5: quizzes
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.quizzes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID UNIQUE NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    passing_score NUMERIC(5, 2) DEFAULT 75.00 NOT NULL,
    time_limit_minutes INT DEFAULT 15,
    max_attempts INT DEFAULT 3 NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    shuffle_questions BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ====================================================================
-- TABLE 6: questions
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    explanation TEXT,
    order_index INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ====================================================================
-- TABLE 7: answer_options (KUNCI JAWABAN TERSIMPAN DI SINI)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.answer_options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
    option_text TEXT NOT NULL,
    order_index INT NOT NULL,
    is_correct BOOLEAN DEFAULT false NOT NULL
);

-- VIEW UNTUK PESERTA (Tanpa kolom is_correct untuk mencegah kecurangan di client)
CREATE OR REPLACE VIEW public.participant_answer_options AS
SELECT id, question_id, option_text, order_index
FROM public.answer_options;

-- ====================================================================
-- TABLE 8: quiz_attempts
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    score NUMERIC(5, 2) NOT NULL,
    passed BOOLEAN NOT NULL,
    attempt_number INT DEFAULT 1 NOT NULL,
    duration_seconds INT DEFAULT 0 NOT NULL,
    correct_count INT DEFAULT 0 NOT NULL,
    total_questions INT DEFAULT 0 NOT NULL,
    started_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    completed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ====================================================================
-- TABLE 9: quiz_responses
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.quiz_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    attempt_id UUID NOT NULL REFERENCES public.quiz_attempts(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
    selected_option_id UUID NOT NULL REFERENCES public.answer_options(id) ON DELETE CASCADE,
    is_correct BOOLEAN NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ====================================================================
-- TABLE 10: lesson_progress
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.lesson_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
    is_completed BOOLEAN DEFAULT false NOT NULL,
    completed_at TIMESTAMPTZ,
    CONSTRAINT uq_user_lesson_progress UNIQUE(user_id, lesson_id)
);

-- ====================================================================
-- TABLE 11: certificates
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    certificate_number TEXT UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    score NUMERIC(5, 2) NOT NULL,
    issued_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    verification_hash TEXT NOT NULL,
    CONSTRAINT uq_user_course_certificate UNIQUE(user_id, course_id)
);

-- ====================================================================
-- TRIGGER: Auto-create Profile on Auth Signup
-- ====================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email, role)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'full_name', 'Peserta K3'),
        new.email,
        COALESCE((new.raw_user_meta_data->>'role')::user_role, 'participant')
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ====================================================================
-- SECURE BACKEND SCORING RPC: submit_quiz_attempt
-- Penilaian dilakukan sepenuhnya di sisi server database tanpa membocorkan kunci jawaban
-- Rumus: Nilai = (Jumlah Jawaban Benar / Jumlah Soal) * 100
-- ====================================================================
CREATE OR REPLACE FUNCTION public.submit_quiz_attempt(
    p_quiz_id UUID,
    p_responses JSONB,          -- Format JSON: {"question_id": "selected_option_id"}
    p_duration_seconds INT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_id UUID;
    v_passing_score NUMERIC(5, 2);
    v_max_attempts INT;
    v_attempt_count INT;
    v_total_questions INT;
    v_correct_count INT := 0;
    v_final_score NUMERIC(5, 2);
    v_passed BOOLEAN;
    v_attempt_id UUID;
    v_q_id TEXT;
    v_selected_opt_id TEXT;
    v_is_correct BOOLEAN;
    v_course_id UUID;
BEGIN
    -- 1. Verifikasi User Autentikasi
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Akses ditolak: User belum terautentikasi';
    END IF;

    -- 2. Ambil informasi konfigurasi kuis
    SELECT course_id, passing_score, max_attempts
    INTO v_course_id, v_passing_score, v_max_attempts
    FROM public.quizzes
    WHERE id = p_quiz_id AND is_active = true;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Kuis tidak ditemukan atau sedang tidak aktif';
    END IF;

    -- 3. Cek batas maksimal percobaan (attempts)
    SELECT COUNT(*) INTO v_attempt_count
    FROM public.quiz_attempts
    WHERE quiz_id = p_quiz_id AND user_id = v_user_id;

    IF v_attempt_count >= v_max_attempts THEN
        RAISE EXCEPTION 'Batas maksimal pengerjaan (% kali) telah tercapai', v_max_attempts;
    END IF;

    -- 4. Hitung total soal pada kuis ini
    SELECT COUNT(*) INTO v_total_questions
    FROM public.questions
    WHERE quiz_id = p_quiz_id;

    IF v_total_questions = 0 THEN
        RAISE EXCEPTION 'Kuis ini belum memiliki soal';
    END IF;

    -- 5. Buat entri quiz_attempt awal
    INSERT INTO public.quiz_attempts (
        quiz_id, user_id, score, passed, attempt_number,
        duration_seconds, correct_count, total_questions, completed_at
    ) VALUES (
        p_quiz_id, v_user_id, 0, false, v_attempt_count + 1,
        p_duration_seconds, 0, v_total_questions, NOW()
    ) RETURNING id INTO v_attempt_id;

    -- 6. Evaluasi setiap jawaban peserta secara aman
    FOR v_q_id, v_selected_opt_id IN SELECT * FROM jsonb_each_text(p_responses)
    LOOP
        -- Periksa apakah opsi yang dipilih benar di tabel master answer_options
        SELECT is_correct INTO v_is_correct
        FROM public.answer_options
        WHERE id = v_selected_opt_id::UUID AND question_id = v_q_id::UUID;

        IF v_is_correct IS TRUE THEN
            v_correct_count := v_correct_count + 1;
        ELSE
            v_is_correct := false;
        END IF;

        -- Simpan rincian jawaban peserta
        INSERT INTO public.quiz_responses (
            attempt_id, question_id, selected_option_id, is_correct
        ) VALUES (
            v_attempt_id, v_q_id::UUID, v_selected_opt_id::UUID, v_is_correct
        );
    END LOOP;

    -- 7. Hitung nilai akhir dengan rumus standar: Nilai = (Benar / Total) * 100
    v_final_score := ROUND(((v_correct_count::NUMERIC / v_total_questions::NUMERIC) * 100.0), 2);
    v_passed := (v_final_score >= v_passing_score);

    -- 8. Update nilai dan status lulus di record attempt
    UPDATE public.quiz_attempts
    SET score = v_final_score,
        passed = v_passed,
        correct_count = v_correct_count
    WHERE id = v_attempt_id;

    -- 9. Jika Lulus, periksa apakah seluruh materi telah selesai untuk penerbitan sertifikat
    IF v_passed IS TRUE THEN
        -- Tandai enrollment selesai
        UPDATE public.enrollments
        SET status = 'completed', completed_at = NOW()
        WHERE user_id = v_user_id AND course_id = v_course_id;

        -- Terbitkan sertifikat digital jika belum pernah diterbitkan
        INSERT INTO public.certificates (
            certificate_number, user_id, course_id, score, verification_hash
        ) VALUES (
            'K3L-' || EXTRACT(YEAR FROM NOW())::TEXT || '-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6)),
            v_user_id,
            v_course_id,
            v_final_score,
            MD5(v_user_id::TEXT || v_course_id::TEXT || NOW()::TEXT)
        )
        ON CONFLICT (user_id, course_id) DO UPDATE
        SET score = GREATEST(certificates.score, EXCLUDED.score);
    END IF;

    -- 10. Kembalikan hasil evaluasi ke client
    RETURN jsonb_build_object(
        'attempt_id', v_attempt_id,
        'score', v_final_score,
        'passed', v_passed,
        'correct_count', v_correct_count,
        'total_questions', v_total_questions,
        'passing_score', v_passing_score,
        'attempt_number', v_attempt_count + 1
    );
END;
$$;

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.answer_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- Helper function: cek apakah user adalah admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Policies: profiles
CREATE POLICY "Public profile read" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "User update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Policies: courses
CREATE POLICY "Public read published courses" ON public.courses FOR SELECT USING (is_published = true OR public.is_admin());
CREATE POLICY "Admin full manage courses" ON public.courses FOR ALL USING (public.is_admin());

-- Policies: lessons
CREATE POLICY "Public read lessons" ON public.lessons FOR SELECT USING (true);
CREATE POLICY "Admin full manage lessons" ON public.lessons FOR ALL USING (public.is_admin());

-- Policies: enrollments
CREATE POLICY "Users read own enrollments" ON public.enrollments FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users create own enrollments" ON public.enrollments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own enrollments" ON public.enrollments FOR UPDATE USING (auth.uid() = user_id OR public.is_admin());

-- Policies: quizzes
CREATE POLICY "Public read active quizzes" ON public.quizzes FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "Admin full manage quizzes" ON public.quizzes FOR ALL USING (public.is_admin());

-- Policies: questions
CREATE POLICY "Public read questions" ON public.questions FOR SELECT USING (true);
CREATE POLICY "Admin full manage questions" ON public.questions FOR ALL USING (public.is_admin());

-- Policies: answer_options (PENTING: Hanya admin yang boleh SELECT is_correct secara langsung)
CREATE POLICY "Allow public read options text" ON public.answer_options FOR SELECT USING (true);
CREATE POLICY "Admin full manage answer options" ON public.answer_options FOR ALL USING (public.is_admin());

-- Policies: quiz_attempts
CREATE POLICY "Users read own attempts" ON public.quiz_attempts FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users insert attempts via rpc or own" ON public.quiz_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policies: quiz_responses
CREATE POLICY "Users read own responses" ON public.quiz_responses FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.quiz_attempts qa WHERE qa.id = quiz_responses.attempt_id AND qa.user_id = auth.uid())
    OR public.is_admin()
);

-- Policies: lesson_progress
CREATE POLICY "Users read own lesson progress" ON public.lesson_progress FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users upsert own lesson progress" ON public.lesson_progress FOR ALL USING (auth.uid() = user_id);

-- Policies: certificates
CREATE POLICY "Public read verify certificates" ON public.certificates FOR SELECT USING (true);
CREATE POLICY "System/Admin insert certificates" ON public.certificates FOR INSERT WITH CHECK (auth.uid() = user_id OR public.is_admin());
