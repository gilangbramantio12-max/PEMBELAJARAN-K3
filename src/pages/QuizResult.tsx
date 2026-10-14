import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { QuizResultReview, Course, Quiz } from '../types';
import { quizService } from '../services/quizService';
import { courseService } from '../services/courseService';
import { certificateService } from '../services/certificateService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { formatDuration } from '../lib/scoring';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  XCircle,
  Award,
  Clock,
  RotateCcw,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  FileCheck,
} from 'lucide-react';

export const QuizResult: React.FC = () => {
  const { courseId, quizId, attemptId } = useParams<{
    courseId: string;
    quizId: string;
    attemptId: string;
  }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { success, error: toastError } = useToast();

  const [review, setReview] = useState<QuizResultReview | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [claiming, setClaiming] = useState<boolean>(false);
  const [eligibleForCert, setEligibleForCert] = useState<boolean>(false);

  useEffect(() => {
    async function loadResult() {
      if (!attemptId || !quizId || !courseId) return;
      setLoading(true);
      try {
        const [foundCourse, loadedQuiz, reviewData] = await Promise.all([
          courseService.getCourseByIdOrSlug(courseId),
          quizService.getQuizByCourseId(courseId),
          quizService.getAttemptReview(attemptId, quizId),
        ]);

        if (foundCourse) setCourse(foundCourse);
        if (loadedQuiz) setQuiz(loadedQuiz);
        if (reviewData) {
          setReview(reviewData);

          // Jika lulus, trigger confetti
          if (reviewData.attempt.passed) {
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 },
            });
          }

          // Cek kelayakan sertifikat
          if (user && foundCourse) {
            const eligibility = await certificateService.checkEligibility(user.id, foundCourse.id);
            setEligibleForCert(eligibility.eligible);
          }
        }
      } catch (err) {
        console.error('Error loading result:', err);
      } finally {
        setLoading(false);
      }
    }
    loadResult();
  }, [courseId, quizId, attemptId, user]);

  const handleClaimCertificate = async () => {
    if (!user || !course || !review) return;
    setClaiming(true);
    try {
      const res = await certificateService.issueCertificate(
        user.id,
        course.id,
        user.full_name,
        course.title
      );

      if (res.certificate) {
        success('Sertifikat digital K3 Anda berhasil diterbitkan!');
        navigate(`/certificate/${res.certificate.id}`);
      } else {
        toastError(res.error || 'Belum memenuhi syarat sertifikat');
      }
    } catch (e: any) {
      toastError(e.message || 'Gagal menerbitkan sertifikat');
    } finally {
      setClaiming(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <LoadingSpinner message="Menganalisis lembar jawaban dan skor K3..." />
      </div>
    );
  }

  if (!review || !quiz || !course) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white border border-slate-200 rounded-2xl text-center">
        <h2 className="text-lg font-bold text-slate-800 mb-2">Hasil Kuis Tidak Ditemukan</h2>
        <Link to="/dashboard" className="px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold">
          Ke Dashboard
        </Link>
      </div>
    );
  }

  const { attempt, questions } = review;
  const isPassed = attempt.passed;
  const correctCount = attempt.correct_count ?? questions.filter((q) => q.is_correct).length;
  const incorrectCount = questions.length - correctCount;

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Score Hero Summary Card */}
        <div
          className={`p-8 rounded-3xl border shadow-md text-center mb-10 overflow-hidden relative ${
            isPassed
              ? 'bg-gradient-to-b from-emerald-50 to-white border-emerald-200'
              : 'bg-gradient-to-b from-rose-50 to-white border-rose-200'
          }`}
        >
          {/* Status Badge */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 shadow-2xs">
            {isPassed ? (
              <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Lulus Evaluasi Kompetensi (KKM {quiz.passing_score}%)
              </span>
            ) : (
              <span className="bg-rose-100 text-rose-800 px-3 py-1 rounded-full flex items-center gap-1.5">
                <XCircle className="w-4 h-4 text-rose-600" />
                Belum Memenuhi Batas KKM ({quiz.passing_score}%)
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-navy-900 tracking-tight mb-2">
            Hasil Evaluasi: {quiz.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mb-8 max-w-lg mx-auto">
            {course.title} • Percobaan Ke-{attempt.attempt_number}
          </p>

          {/* Large Circular Score Indicator */}
          <div className="inline-flex flex-col items-center justify-center w-36 h-36 rounded-full bg-white shadow-lg border-4 border-slate-100 mb-8">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
              Nilai Akhir
            </span>
            <span
              className={`text-4xl font-black tracking-tight ${
                isPassed ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {attempt.score}
            </span>
            <span className="text-[11px] font-bold text-slate-500">Skala 0 - 100</span>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto pt-6 border-t border-slate-200/80 text-left">
            <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100">
              <span className="text-[11px] font-semibold text-slate-500 block">Jawaban Benar</span>
              <span className="text-lg font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> {correctCount} Soal
              </span>
            </div>

            <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100">
              <span className="text-[11px] font-semibold text-slate-500 block">Jawaban Salah</span>
              <span className="text-lg font-bold text-rose-600 flex items-center gap-1">
                <XCircle className="w-4 h-4" /> {incorrectCount} Soal
              </span>
            </div>

            <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100">
              <span className="text-[11px] font-semibold text-slate-500 block">Durasi Pengerjaan</span>
              <span className="text-lg font-bold text-slate-800 flex items-center gap-1">
                <Clock className="w-4 h-4 text-slate-400" />
                {formatDuration(attempt.duration_seconds)}
              </span>
            </div>

            <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100">
              <span className="text-[11px] font-semibold text-slate-500 block">KKM Kelulusan</span>
              <span className="text-lg font-bold text-navy-900 flex items-center gap-1">
                <Award className="w-4 h-4 text-safety-orange" />
                {quiz.passing_score}%
              </span>
            </div>
          </div>

          {/* Primary Action Button (Claim Certificate / Retry) */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            {isPassed ? (
              <button
                onClick={handleClaimCertificate}
                disabled={claiming}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                <Award className="w-5 h-5" />
                {claiming ? 'Menerbitkan Sertifikat...' : 'Klaim & Unduh Sertifikat Digital K3'}
              </button>
            ) : (
              <Link
                to={`/learn/${course.id}/quiz/${quiz.id}`}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-md transition-all"
              >
                <RotateCcw className="w-5 h-5" />
                Ulangi Pengerjaan Kuis
              </Link>
            )}

            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl text-sm font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors shadow-xs"
            >
              Ke Dashboard Peserta
            </Link>
          </div>
        </div>

        {/* Detailed Answer Review & Explanations (Pembahasan Edukatif) */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-navy-900">Pembahasan Jawaban & Kunci Soal</h2>
              <p className="text-xs text-slate-500">
                Tinjau penjelasan standar K3 di bawah ini untuk memperdalam pemahaman materi Anda.
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-400">
              {questions.length} Pertanyaan
            </span>
          </div>

          <div className="space-y-6">
            {questions.map((q, qIndex) => {
              const isCorrect = q.is_correct;

              return (
                <div
                  key={q.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    isCorrect
                      ? 'bg-emerald-50/20 border-emerald-200'
                      : 'bg-rose-50/20 border-rose-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="text-xs font-bold text-slate-500">
                      Soal #{qIndex + 1}
                    </span>
                    {isCorrect ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Benar (+{Math.round(100 / questions.length)} Poin)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-100 px-2.5 py-0.5 rounded-full">
                        <XCircle className="w-3.5 h-3.5" /> Salah
                      </span>
                    )}
                  </div>

                  <p className="text-sm font-bold text-navy-900 mb-4 leading-relaxed">
                    {q.question_text}
                  </p>

                  {/* Options List */}
                  <div className="space-y-2 mb-4">
                    {q.options.map((opt, optIndex) => {
                      const optLetter = String.fromCharCode(65 + optIndex);
                      const isUserChoice = q.user_selected_option_id === opt.id;
                      const isCorrectChoice = q.correct_option_id === opt.id;

                      let rowClass = 'bg-white border-slate-200 text-slate-600';
                      if (isCorrectChoice) {
                        rowClass = 'bg-emerald-100/70 border-emerald-400 text-emerald-950 font-semibold';
                      } else if (isUserChoice && !isCorrectChoice) {
                        rowClass = 'bg-rose-100/70 border-rose-400 text-rose-950 font-semibold line-through';
                      }

                      return (
                        <div
                          key={opt.id}
                          className={`flex items-center gap-3 p-3 rounded-xl border text-xs sm:text-sm ${rowClass}`}
                        >
                          <span className="w-6 h-6 rounded-md bg-white/80 border border-slate-300 flex items-center justify-center font-bold text-xs shrink-0">
                            {optLetter}
                          </span>
                          <span className="flex-1">{opt.option_text}</span>
                          {isCorrectChoice && (
                            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-200/80 px-2 py-0.5 rounded">
                              Kunci Jawaban Benar
                            </span>
                          )}
                          {isUserChoice && !isCorrectChoice && (
                            <span className="text-[11px] font-bold text-rose-800 bg-rose-200/80 px-2 py-0.5 rounded">
                              Jawaban Anda
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation Box */}
                  <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-700 leading-relaxed">
                    <strong className="text-slate-900 block mb-1">💡 Pembahasan Edukatif:</strong>
                    {q.explanation}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
