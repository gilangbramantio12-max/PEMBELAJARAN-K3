import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Course, Lesson, Quiz } from '../types';
import { courseService } from '../services/courseService';
import { quizService } from '../services/quizService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ProgressBar } from '../components/common/ProgressBar';
import {
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  PlayCircle,
  FileCheck,
  Award,
  ShieldCheck,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';

export const Classroom: React.FC = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { success, info } = useToast();

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState<boolean>(true);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [marking, setMarking] = useState<boolean>(false);

  useEffect(() => {
    async function initClassroom() {
      if (!courseId) return;
      setLoading(true);
      try {
        const foundCourse = await courseService.getCourseByIdOrSlug(courseId);
        if (foundCourse) {
          setCourse(foundCourse);
          const [loadedLessons, loadedQuiz] = await Promise.all([
            courseService.getLessonsByCourseId(foundCourse.id),
            quizService.getQuizByCourseId(foundCourse.id),
          ]);
          setLessons(loadedLessons);
          setQuiz(loadedQuiz);

          // Tentukan materi aktif
          const active = lessonId
            ? loadedLessons.find((l) => l.id === lessonId || l.slug === lessonId)
            : loadedLessons[0];
          setCurrentLesson(active || loadedLessons[0]);

          // Cek progres materi yang sudah selesai untuk user
          if (user) {
            const completed = new Set<string>();
            for (const l of loadedLessons) {
              const isDone = await courseService.isLessonCompleted(user.id, l.id);
              if (isDone) completed.add(l.id);
            }
            setCompletedLessonIds(completed);
          }
        }
      } catch (err) {
        console.error('Error loading classroom:', err);
      } finally {
        setLoading(false);
      }
    }
    initClassroom();
  }, [courseId, lessonId, user]);

  const currentIndex = lessons.findIndex((l) => l.id === currentLesson?.id);
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;
  const isCurrentCompleted = currentLesson ? completedLessonIds.has(currentLesson.id) : false;

  const progressPercentage =
    lessons.length > 0 ? Math.round((completedLessonIds.size / lessons.length) * 100) : 0;

  const handleMarkCompleted = async () => {
    if (!currentLesson || !course || !user) return;
    setMarking(true);
    try {
      await courseService.markLessonCompleted(user.id, course.id, currentLesson.id);
      setCompletedLessonIds((prev) => new Set([...prev, currentLesson.id]));
      success('Materi telah ditandai selesai! Progres Anda tersimpan.');

      // Jika ada materi selanjutnya, arahkan otomatis
      if (nextLesson) {
        navigate(`/learn/${course.id}/lesson/${nextLesson.id}`);
      } else if (quiz) {
        info('Selamat! Semua materi telah selesai. Anda siap mengerjakan kuis evaluasi.');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setMarking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <LoadingSpinner message="Membuka ruang belajar K3..." />
      </div>
    );
  }

  if (!course || !currentLesson) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold">Materi Tidak Ditemukan</h2>
        <Link to="/courses" className="text-brand-600 underline mt-4 inline-block">
          Kembali ke Katalog
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Top Learning Bar */}
      <div className="bg-navy-900 text-white px-4 sm:px-6 py-3 border-b border-navy-800 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <Link
            to={`/courses/${course.slug || course.id}`}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-navy-800 rounded-lg transition-colors"
            title="Keluar dari Ruang Belajar"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="leading-tight">
            <h1 className="text-xs sm:text-sm font-bold text-white line-clamp-1">{course.title}</h1>
            <p className="text-[11px] text-slate-400">
              Modul {currentIndex + 1} dari {lessons.length}
            </p>
          </div>
        </div>

        {/* Progress & Sidebar Toggle */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 w-44">
            <ProgressBar progress={progressPercentage} size="sm" color="green" />
            <span className="text-xs font-semibold text-emerald-400 shrink-0">
              {progressPercentage}%
            </span>
          </div>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 text-slate-300 hover:text-white rounded-lg bg-navy-800"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Main Classroom Body with Sidebar */}
      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        {/* Left Sidebar (Desktop fixed / Mobile drawer) */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-20 w-80 bg-white border-r border-slate-200/90 flex flex-col transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Mobile Sidebar Close Header */}
          <div className="lg:hidden p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <span className="font-bold text-sm text-slate-800">Daftar Modul Belajar</span>
            <button onClick={() => setSidebarOpen(false)} className="p-1 text-slate-500">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Sidebar Progress Bar */}
          <div className="p-4 border-b border-slate-100 bg-blue-50/50">
            <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-2">
              <span>Progres Kursus</span>
              <span className="text-brand-600">{progressPercentage}% Selesai</span>
            </div>
            <ProgressBar progress={progressPercentage} size="md" color="blue" />
            <div className="mt-2 text-[11px] text-slate-500">
              {completedLessonIds.size} dari {lessons.length} materi diselesaikan
            </div>
          </div>

          {/* Lesson List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
            {lessons.map((lesson, idx) => {
              const isCurrent = lesson.id === currentLesson.id;
              const isDone = completedLessonIds.has(lesson.id);

              return (
                <Link
                  key={lesson.id}
                  to={`/learn/${course.id}/lesson/${lesson.id}`}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-start gap-3 p-3 rounded-xl text-left transition-all ${
                    isCurrent
                      ? 'bg-brand-600 text-white shadow-sm font-semibold'
                      : isDone
                      ? 'bg-emerald-50/60 text-slate-700 hover:bg-emerald-50'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="shrink-0 mt-0.5">
                    {isDone ? (
                      <CheckCircle2
                        className={`w-4 h-4 ${isCurrent ? 'text-emerald-200' : 'text-emerald-600'}`}
                      />
                    ) : (
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center text-[9px] ${
                          isCurrent ? 'border-white text-white' : 'border-slate-400 text-slate-500'
                        }`}
                      >
                        {idx + 1}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-xs leading-snug line-clamp-2">{lesson.title}</div>
                    <div
                      className={`text-[10px] mt-1 flex items-center gap-1 ${
                        isCurrent ? 'text-blue-100' : 'text-slate-400'
                      }`}
                    >
                      <Clock className="w-3 h-3" /> {lesson.duration_minutes} mnt
                    </div>
                  </div>
                </Link>
              );
            })}

            {/* Quiz Navigation in Sidebar */}
            {quiz && (
              <div className="pt-3 border-t border-slate-100 mt-2">
                <Link
                  to={`/learn/${course.id}/quiz/${quiz.id}`}
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-xl bg-orange-50 border border-orange-200/80 text-orange-900 font-bold hover:bg-orange-100 transition-colors"
                >
                  <Award className="w-5 h-5 text-safety-orange" />
                  <div className="flex-1">
                    <div className="text-xs">Ujian Kuis Evaluasi</div>
                    <div className="text-[10px] text-orange-700 font-normal">
                      Syarat Kelulusan (KKM: {quiz.passing_score}%)
                    </div>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </aside>

        {/* Center / Right Content Article Area */}
        <main className="flex-1 max-w-4xl px-4 sm:px-8 py-8 overflow-y-auto">
          {/* Lesson Header */}
          <div className="mb-6 pb-6 border-b border-slate-200">
            <div className="flex items-center gap-2 text-xs font-semibold text-brand-600 uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Modul Keselamatan Kerja {currentIndex + 1}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight mb-3">
              {currentLesson.title}
            </h2>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Estimasi Baca: {currentLesson.duration_minutes} Menit
              </span>
              {isCurrentCompleted && (
                <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Sudah Selesai
                </span>
              )}
            </div>
          </div>

          {/* Key Safety Takeaways Highlight Box */}
          {currentLesson.key_points && currentLesson.key_points.length > 0 && (
            <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200 mb-8">
              <h4 className="text-xs font-bold text-brand-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-600" />
                Poin Kunci Keselamatan (Key Safety Points):
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                {currentLesson.key_points.map((pt, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-600 mt-2 shrink-0" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Video Lesson Embed if present */}
          {currentLesson.video_url && (
            <div className="mb-8 rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-black aspect-video">
              <iframe
                src={currentLesson.video_url}
                title={currentLesson.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          {/* Lesson Text Body (Markdown-like formatting) */}
          <article className="prose prose-slate max-w-none text-slate-800 leading-relaxed text-sm sm:text-base space-y-4">
            {currentLesson.content_text.split('\n\n').map((paragraph, index) => {
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={index} className="text-xl font-bold text-navy-900 pt-4 pb-1 border-b border-slate-100">
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              }
              if (paragraph.startsWith('#### ')) {
                return (
                  <h4 key={index} className="text-base font-bold text-slate-800 pt-2">
                    {paragraph.replace('#### ', '')}
                  </h4>
                );
              }
              if (paragraph.startsWith('> ')) {
                return (
                  <blockquote
                    key={index}
                    className="p-4 bg-amber-50/80 border-l-4 border-amber-500 rounded-r-xl text-amber-900 text-xs sm:text-sm italic my-4"
                  >
                    {paragraph.replace('> ', '').replace(/\*\*/g, '')}
                  </blockquote>
                );
              }
              return (
                <p key={index} className="text-slate-700 whitespace-pre-line">
                  {paragraph}
                </p>
              );
            })}
          </article>

          {/* Action Bar (Mark Completed & Navigations) */}
          <div className="mt-12 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {prevLesson ? (
                <Link
                  to={`/learn/${course.id}/lesson/${prevLesson.id}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors shadow-xs"
                >
                  <ChevronLeft className="w-4 h-4" /> Sebelumnya
                </Link>
              ) : (
                <div />
              )}

              {nextLesson && (
                <Link
                  to={`/learn/${course.id}/lesson/${nextLesson.id}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors shadow-xs"
                >
                  Selanjutnya <ChevronRight className="w-4 h-4" />
                </Link>
              )}
            </div>

            {/* Mark as Completed / Go to Quiz Button */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={handleMarkCompleted}
                disabled={marking}
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-all cursor-pointer ${
                  isCurrentCompleted
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-brand-600 hover:bg-brand-700 text-white'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                {marking
                  ? 'Menyimpan...'
                  : isCurrentCompleted
                  ? 'Telah Selesai (Simpan Lagi)'
                  : 'Tandai Selesai & Lanjut'}
              </button>

              {quiz && (
                <Link
                  to={`/learn/${course.id}/quiz/${quiz.id}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-safety-orange hover:bg-safety-darkOrange rounded-xl shadow-xs transition-all"
                >
                  <Award className="w-4 h-4" /> Ikuti Kuis
                </Link>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
