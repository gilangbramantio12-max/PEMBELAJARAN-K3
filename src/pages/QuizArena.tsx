import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Course, Quiz, Question } from '../types';
import { courseService } from '../services/courseService';
import { quizService } from '../services/quizService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import {
  Award,
  Clock,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Send,
  HelpCircle,
  ShieldAlert,
} from 'lucide-react';

export const QuizArena: React.FC = () => {
  const { courseId, quizId } = useParams<{ courseId: string; quizId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { success, error, warning } = useToast();

  const [course, setCourse] = useState<Course | null>(null);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({}); // { question_id: option_id }
  const [timeLeft, setTimeLeft] = useState<number>(15 * 60); // default 15 mins
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [attemptCount, setAttemptCount] = useState<number>(0);

  const startTimeRef = useRef<number>(Date.now());
  const timerRef = useRef<any>(null);

  useEffect(() => {
    async function loadQuizData() {
      if (!courseId) return;
      setLoading(true);
      try {
        const foundCourse = await courseService.getCourseByIdOrSlug(courseId);
        if (!foundCourse) return;
        setCourse(foundCourse);

        const loadedQuiz = await quizService.getQuizByCourseId(foundCourse.id);
        if (!loadedQuiz) return;
        setQuiz(loadedQuiz);

        // Ambil soal kuis tanpa is_correct (Blind Answer Key)
        const loadedQuestions = await quizService.getQuestionsForParticipant(loadedQuiz.id);
        setQuestions(loadedQuestions);

        // Set timer jika dikonfigurasi
        if (loadedQuiz.time_limit_minutes) {
          setTimeLeft(loadedQuiz.time_limit_minutes * 60);
        }

        // Cek percobaan pengerjaan yang sudah dilakukan
        if (user) {
          const count = await quizService.getUserAttemptCount(user.id, loadedQuiz.id);
          setAttemptCount(count);
        }
      } catch (err) {
        console.error('Error loading quiz:', err);
      } finally {
        setLoading(false);
      }
    }
    loadQuizData();
  }, [courseId, user]);

  // Timer Countdown Effect
  useEffect(() => {
    if (loading || isSubmitting || timeLeft <= 0) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [loading, isSubmitting]);

  const handleTimeUp = () => {
    warning('Waktu pengerjaan telah habis! Sistem secara otomatis mengirimkan jawaban Anda.');
    handleSubmitQuiz();
  };

  const handleSelectOption = (questionId: string, optionId: string) => {
    if (isSubmitting) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const currentQ = questions[activeQuestionIndex];
  const answeredCount = Object.keys(selectedAnswers).length;
  const isAllAnswered = questions.length > 0 && answeredCount === questions.length;

  const handleSubmitQuiz = async () => {
    if (!quiz || !course || !user || isSubmitting) return;

    // Kunci double-submission
    setIsSubmitting(true);
    setShowConfirmModal(false);

    const durationSeconds = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));

    try {
      const result = await quizService.submitQuiz(
        user.id,
        quiz.id,
        course.id,
        selectedAnswers,
        durationSeconds,
        quiz.passing_score
      );

      success(
        result.passed
          ? `LULUS! Selamat, nilai Anda ${result.score} (KKM: ${quiz.passing_score})`
          : `Kuis Selesai. Nilai Anda ${result.score} (KKM: ${quiz.passing_score}). Tetap semangat!`
      );

      // Arahkan ke Halaman Hasil & Pembahasan
      navigate(`/learn/${course.id}/quiz/${quiz.id}/result/${result.attempt.id}`);
    } catch (err: any) {
      error(err.message || 'Gagal mengirimkan kuis.');
      setIsSubmitting(false);
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <LoadingSpinner message="Mempersiapkan lembar evaluasi kuis K3..." />
      </div>
    );
  }

  if (!quiz || !course || questions.length === 0) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white border border-slate-200 rounded-2xl text-center">
        <h2 className="text-lg font-bold text-slate-800 mb-2">Kuis Belum Tersedia</h2>
        <p className="text-xs text-slate-500 mb-6">
          Belum ada bank soal aktif yang terhubung dengan kursus ini.
        </p>
        <Link to={`/courses/${courseId}`} className="px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold">
          Kembali ke Kursus
        </Link>
      </div>
    );
  }

  // Cek apakah melampaui batas maksimal percobaan
  if (quiz.max_attempts && attemptCount >= quiz.max_attempts) {
    return (
      <div className="max-w-lg mx-auto my-20 p-8 bg-white border border-red-200 rounded-2xl text-center shadow-sm">
        <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Batas Pengerjaan Telah Habis</h2>
        <p className="text-sm text-slate-600 mb-6">
          Anda telah menggunakan seluruh kuota ({quiz.max_attempts} dari {quiz.max_attempts} kali percobaan) pengerjaan kuis ini.
        </p>
        <Link
          to={`/dashboard`}
          className="px-5 py-2.5 bg-brand-600 text-white font-bold rounded-xl text-sm"
        >
          Lihat Riwayat di Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Sticky Top Bar: Quiz Title & Countdown Timer */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs px-4 sm:px-6 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xs sm:text-sm font-bold text-navy-900 line-clamp-1">{quiz.title}</h1>
            <p className="text-[11px] text-slate-500">
              {course.title} • Standar Kelulusan: KKM {quiz.passing_score}%
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Timer Badge */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs font-bold border transition-colors ${
                timeLeft < 180
                  ? 'bg-rose-50 text-rose-600 border-rose-200 animate-pulse'
                  : 'bg-slate-100 text-slate-800 border-slate-200'
              }`}
            >
              <Clock className="w-4 h-4 text-slate-500" />
              <span>{formatTimer(timeLeft)}</span>
            </div>

            {/* Submit CTA */}
            <button
              onClick={() => setShowConfirmModal(true)}
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-safety-orange hover:bg-safety-darkOrange rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Kirim Jawaban</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Question Arena */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left 3 Columns: Active Question Card */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-sm">
            {/* Question Counter Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <span className="text-xs font-extrabold uppercase tracking-wider text-brand-600">
                Soal Nomor {activeQuestionIndex + 1} dari {questions.length}
              </span>
              <span className="text-xs font-semibold text-slate-400">
                Terjawab: {answeredCount}/{questions.length}
              </span>
            </div>

            {/* Question Text */}
            <h2 className="text-base sm:text-lg font-bold text-navy-900 leading-relaxed mb-6">
              {currentQ.question_text}
            </h2>

            {/* 4 Answer Options (A, B, C, D) */}
            <div className="space-y-3">
              {currentQ.options.map((opt, optIndex) => {
                const optLetter = String.fromCharCode(65 + optIndex);
                const isSelected = selectedAnswers[currentQ.id] === opt.id;

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(currentQ.id, opt.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50/80 border-brand-600 text-brand-900 shadow-xs'
                        : 'bg-white border-slate-200/90 text-slate-700 hover:border-slate-300 hover:bg-slate-50/60'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-brand-600 text-white'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {optLetter}
                    </div>
                    <div className="text-xs sm:text-sm font-medium leading-relaxed flex-1">
                      {opt.option_text}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Bottom Nav Buttons for Question */}
            <div className="flex items-center justify-between pt-8 mt-8 border-t border-slate-100">
              <button
                onClick={() => setActiveQuestionIndex((prev) => Math.max(0, prev - 1))}
                disabled={activeQuestionIndex === 0}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Soal Sebelumnya
              </button>

              {activeQuestionIndex < questions.length - 1 ? (
                <button
                  onClick={() =>
                    setActiveQuestionIndex((prev) => Math.min(questions.length - 1, prev + 1))
                  }
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 transition-colors"
                >
                  Soal Berikutnya <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => setShowConfirmModal(true)}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-safety-orange hover:bg-safety-darkOrange transition-colors"
                >
                  Selesai & Kirim <Send className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right 1 Column: Number Palette Navigator */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4">
              Navigasi Nomor Soal
            </h3>

            <div className="grid grid-cols-5 gap-2">
              {questions.map((q, idx) => {
                const isCurrent = idx === activeQuestionIndex;
                const isAnswered = Boolean(selectedAnswers[q.id]);

                return (
                  <button
                    key={q.id}
                    onClick={() => setActiveQuestionIndex(idx)}
                    className={`h-9 rounded-lg font-bold text-xs flex items-center justify-center transition-all cursor-pointer ${
                      isCurrent
                        ? 'ring-2 ring-brand-600 ring-offset-2 bg-brand-600 text-white'
                        : isAnswered
                        ? 'bg-blue-100 text-brand-800 border border-blue-300'
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 space-y-2 text-[11px] text-slate-500">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-blue-100 border border-blue-300 inline-block" />
                <span>Sudah Dijawab ({answeredCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-slate-100 inline-block" />
                <span>Belum Dijawab ({questions.length - answeredCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-brand-600 inline-block" />
                <span>Nomor Aktif</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal Before Submit */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-center animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-orange-100 text-safety-orange flex items-center justify-center mx-auto mb-4">
              <HelpCircle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-navy-900 mb-2">Konfirmasi Pengiriman Kuis</h3>

            <p className="text-xs sm:text-sm text-slate-600 mb-4 leading-relaxed">
              Anda telah menjawab <strong>{answeredCount}</strong> dari <strong>{questions.length}</strong> pertanyaan.
              {!isAllAnswered && (
                <span className="block text-amber-600 font-semibold mt-1">
                  Peringatan: Masih ada {questions.length - answeredCount} soal yang belum Anda isi.
                </span>
              )}
            </p>

            <p className="text-xs text-slate-500 mb-6">
              Setelah dikirim, jawaban Anda akan dinilai secara otomatis di server dan pembahasan akan ditampilkan.
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors"
              >
                Periksa Kembali
              </button>
              <button
                onClick={handleSubmitQuiz}
                disabled={isSubmitting}
                className="flex-1 py-2.5 rounded-xl bg-safety-orange hover:bg-safety-darkOrange text-white font-bold text-xs shadow-sm transition-colors"
              >
                {isSubmitting ? 'Menilai...' : 'Ya, Kirim Sekarang'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
