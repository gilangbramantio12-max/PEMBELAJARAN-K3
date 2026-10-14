import {
  Quiz,
  Question,
  QuizAttempt,
  QuizResultReview,
  AnswerOption,
} from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { calculateQuizScore } from '../lib/scoring';
import { INITIAL_QUIZZES, INITIAL_QUESTIONS } from '../data/mockData';

const LOCAL_ATTEMPTS_KEY = 'k3learn_quiz_attempts';
const LOCAL_RESPONSES_KEY = 'k3learn_quiz_responses';
const LOCAL_QUIZZES_KEY = 'k3learn_quizzes';
const LOCAL_QUESTIONS_KEY = 'k3learn_questions';

function getStoredQuizzes(): Record<string, Quiz> {
  try {
    const raw = localStorage.getItem(LOCAL_QUIZZES_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  localStorage.setItem(LOCAL_QUIZZES_KEY, JSON.stringify(INITIAL_QUIZZES));
  return INITIAL_QUIZZES;
}

function getStoredQuestions(): Record<string, Question[]> {
  try {
    const raw = localStorage.getItem(LOCAL_QUESTIONS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  localStorage.setItem(LOCAL_QUESTIONS_KEY, JSON.stringify(INITIAL_QUESTIONS));
  return INITIAL_QUESTIONS;
}

export const quizService = {
  // Ambil metadata kuis berdasarkan ID kursus
  async getQuizByCourseId(courseId: string): Promise<Quiz | null> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .eq('course_id', courseId)
        .eq('is_active', true)
        .maybeSingle();

      if (!error && data) return data;
    }

    const quizzes = getStoredQuizzes();
    return quizzes[courseId] || null;
  },

  // Ambil soal kuis untuk PESERTA
  // KUNCI JAWABAN (is_correct) DIHILANGKAN agar tidak bisa diintip di inspect element / network tab!
  async getQuestionsForParticipant(quizId: string): Promise<Question[]> {
    if (isSupabaseConfigured) {
      // Ambil pertanyaan & opsi dari VIEW public yang tidak memuat kolom is_correct
      const { data: qData, error: qErr } = await supabase
        .from('questions')
        .select('id, quiz_id, question_text, order_index')
        .eq('quiz_id', quizId)
        .order('order_index', { ascending: true });

      if (!qErr && qData) {
        const { data: optData } = await supabase
          .from('participant_answer_options')
          .select('id, question_id, option_text, order_index');

        return qData.map((q: any) => ({
          ...q,
          options: (optData || [])
            .filter((o: any) => o.question_id === q.id)
            .sort((a: any, b: any) => a.order_index - b.order_index),
        }));
      }
    }

    // Fallback: Clone questions dan hilangkan is_correct dari browser peserta
    const questionMap = getStoredQuestions();
    const rawQuestions = questionMap[quizId] || [];

    return rawQuestions.map((q) => ({
      id: q.id,
      quiz_id: q.quiz_id,
      question_text: q.question_text,
      order_index: q.order_index,
      // Pembahasan dan is_correct sengaja dikosongkan selama kuis berlangsung
      explanation: undefined,
      options: q.options.map((opt) => ({
        id: opt.id,
        question_id: opt.question_id,
        option_text: opt.option_text,
        order_index: opt.order_index,
        // Kunci is_correct tidak diserahkan ke state pengerjaan
      })),
    }));
  },

  // Hitung jumlah percobaan yang telah dilakukan peserta pada kuis ini
  async getUserAttemptCount(userId: string, quizId: string): Promise<number> {
    if (isSupabaseConfigured) {
      const { count } = await supabase
        .from('quiz_attempts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('quiz_id', quizId);

      return count || 0;
    }

    const raw = localStorage.getItem(LOCAL_ATTEMPTS_KEY);
    const attempts: QuizAttempt[] = raw ? JSON.parse(raw) : [];
    return attempts.filter((a) => a.user_id === userId && a.quiz_id === quizId).length;
  },

  // Submit Jawaban Kuis Secara Aman & Atomic
  async submitQuiz(
    userId: string,
    quizId: string,
    courseId: string,
    responses: Record<string, string>, // { question_id: selected_option_id }
    durationSeconds: number,
    passingScore: number = 75
  ): Promise<{ attempt: QuizAttempt; passed: boolean; score: number }> {
    // 1. Jika Supabase aktif, gunakan Stored Procedure / RPC PostgreSQL
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.rpc('submit_quiz_attempt', {
        p_quiz_id: quizId,
        p_responses: responses,
        p_duration_seconds: durationSeconds,
      });

      if (!error && data) {
        return {
          attempt: {
            id: data.attempt_id,
            quiz_id: quizId,
            user_id: userId,
            score: data.score,
            passed: data.passed,
            attempt_number: data.attempt_number,
            duration_seconds: durationSeconds,
            correct_count: data.correct_count,
            total_questions: data.total_questions,
            started_at: new Date(Date.now() - durationSeconds * 1000).toISOString(),
            completed_at: new Date().toISOString(),
          },
          passed: data.passed,
          score: data.score,
        };
      }
      console.warn('Supabase RPC error, evaluating via local secure evaluator:', error);
    }

    // 2. Evaluator Mode Aman (Local Database Storage)
    const questionMap = getStoredQuestions();
    const questionsWithKeys = questionMap[quizId] || [];
    const totalQuestions = questionsWithKeys.length;

    let correctCount = 0;
    const evaluatedResponses: Array<{
      question_id: string;
      selected_option_id: string;
      is_correct: boolean;
    }> = [];

    for (const q of questionsWithKeys) {
      const selectedOptionId = responses[q.id];
      const correctOption = q.options.find((o) => o.is_correct);
      const isCorrect = Boolean(correctOption && correctOption.id === selectedOptionId);

      if (isCorrect) correctCount++;

      evaluatedResponses.push({
        question_id: q.id,
        selected_option_id: selectedOptionId || '',
        is_correct: isCorrect,
      });
    }

    // Hitung Nilai menggunakan Rumus: (Benar / Total) * 100
    const scoring = calculateQuizScore(correctCount, totalQuestions, passingScore);
    const existingAttemptCount = await this.getUserAttemptCount(userId, quizId);

    const attemptId = `att-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newAttempt: QuizAttempt = {
      id: attemptId,
      quiz_id: quizId,
      user_id: userId,
      score: scoring.score,
      passed: scoring.passed,
      attempt_number: existingAttemptCount + 1,
      duration_seconds: durationSeconds,
      correct_count: scoring.correctCount,
      total_questions: scoring.totalQuestions,
      started_at: new Date(Date.now() - durationSeconds * 1000).toISOString(),
      completed_at: new Date().toISOString(),
      course_id: courseId,
    };

    // Simpan ke local storage
    const attemptsRaw = localStorage.getItem(LOCAL_ATTEMPTS_KEY);
    const attempts: QuizAttempt[] = attemptsRaw ? JSON.parse(attemptsRaw) : [];
    attempts.unshift(newAttempt);
    localStorage.setItem(LOCAL_ATTEMPTS_KEY, JSON.stringify(attempts));

    // Simpan respon pengerjaan
    const respRaw = localStorage.getItem(LOCAL_RESPONSES_KEY);
    const responsesStore = respRaw ? JSON.parse(respRaw) : {};
    responsesStore[attemptId] = evaluatedResponses;
    localStorage.setItem(LOCAL_RESPONSES_KEY, JSON.stringify(responsesStore));

    return {
      attempt: newAttempt,
      passed: scoring.passed,
      score: scoring.score,
    };
  },

  // Ambil detail review pengerjaan kuis (Pembahasan hanya muncul setelah submit!)
  async getAttemptReview(attemptId: string, quizId: string): Promise<QuizResultReview | null> {
    const rawAttempts = localStorage.getItem(LOCAL_ATTEMPTS_KEY);
    const attempts: QuizAttempt[] = rawAttempts ? JSON.parse(rawAttempts) : [];
    const attempt = attempts.find((a) => a.id === attemptId);

    if (!attempt) return null;

    const questionMap = getStoredQuestions();
    const questions = questionMap[quizId] || [];

    const respRaw = localStorage.getItem(LOCAL_RESPONSES_KEY);
    const responsesStore = respRaw ? JSON.parse(respRaw) : {};
    const recordedResponses: Array<{
      question_id: string;
      selected_option_id: string;
      is_correct: boolean;
    }> = responsesStore[attemptId] || [];

    const reviewQuestions = questions.map((q) => {
      const resp = recordedResponses.find((r) => r.question_id === q.id);
      const correctOption = q.options.find((o) => o.is_correct);

      return {
        id: q.id,
        question_text: q.question_text,
        explanation: q.explanation || 'Pembahasan standar K3.',
        user_selected_option_id: resp ? resp.selected_option_id : '',
        correct_option_id: correctOption ? correctOption.id : '',
        is_correct: resp ? resp.is_correct : false,
        options: q.options,
      };
    });

    return {
      attempt,
      questions: reviewQuestions,
    };
  },

  // Riwayat pengerjaan kuis pengguna
  async getUserAttempts(userId: string): Promise<QuizAttempt[]> {
    if (isSupabaseConfigured) {
      const { data } = await supabase
        .from('quiz_attempts')
        .select('*, quizzes(title, course_id, courses(title))')
        .eq('user_id', userId)
        .order('completed_at', { ascending: false });

      if (data) {
        return data.map((d: any) => ({
          ...d,
          quiz_title: d.quizzes?.title,
          course_title: d.quizzes?.courses?.title,
          course_id: d.quizzes?.course_id,
        }));
      }
    }

    const raw = localStorage.getItem(LOCAL_ATTEMPTS_KEY);
    const attempts: QuizAttempt[] = raw ? JSON.parse(raw) : [];
    return attempts.filter((a) => a.user_id === userId);
  },

  // Riwayat semua pengerjaan untuk Admin
  async getAllAttemptsAdmin(): Promise<QuizAttempt[]> {
    if (isSupabaseConfigured) {
      const { data } = await supabase
        .from('quiz_attempts')
        .select('*, profiles(full_name, email), quizzes(title)')
        .order('completed_at', { ascending: false });
      if (data) return data;
    }

    const raw = localStorage.getItem(LOCAL_ATTEMPTS_KEY);
    return raw ? JSON.parse(raw) : [];
  },

  // Admin: Update Kuis
  async updateQuizConfig(quizId: string, updates: Partial<Quiz>): Promise<Quiz | null> {
    const quizzes = getStoredQuizzes();
    for (const key of Object.keys(quizzes)) {
      if (quizzes[key].id === quizId) {
        quizzes[key] = { ...quizzes[key], ...updates };
        localStorage.setItem(LOCAL_QUIZZES_KEY, JSON.stringify(quizzes));
        return quizzes[key];
      }
    }
    return null;
  },
};
