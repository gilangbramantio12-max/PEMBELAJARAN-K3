import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Course, Lesson, Quiz } from '../types';
import { courseService } from '../services/courseService';
import { quizService } from '../services/quizService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Badge } from '../components/common/Badge';
import {
  ShieldCheck,
  Clock,
  BookOpen,
  Award,
  PlayCircle,
  FileText,
  CheckCircle2,
  Lock,
  ArrowRight,
  AlertTriangle,
  UserCheck,
} from 'lucide-react';

export const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { success, error } = useToast();

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [isEnrolled, setIsEnrolled] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [enrolling, setEnrolling] = useState<boolean>(false);

  useEffect(() => {
    async function loadCourseDetails() {
      if (!id) return;
      setLoading(true);
      try {
        const found = await courseService.getCourseByIdOrSlug(id);
        if (found) {
          setCourse(found);
          const [loadedLessons, loadedQuiz] = await Promise.all([
            courseService.getLessonsByCourseId(found.id),
            quizService.getQuizByCourseId(found.id),
          ]);
          setLessons(loadedLessons);
          setQuiz(loadedQuiz);

          if (user) {
            const enrollment = await courseService.getUserEnrollment(user.id, found.id);
            setIsEnrolled(Boolean(enrollment));
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadCourseDetails();
  }, [id, user]);

  const handleEnrollAndStart = async () => {
    if (!course) return;

    if (!user) {
      navigate('/login');
      return;
    }

    setEnrolling(true);
    try {
      await courseService.enrollCourse(user.id, course.id);
      setIsEnrolled(true);
      success(`Berhasil terdaftar pada kursus ${course.title}!`);

      // Arahkan ke materi pelajaran pertama
      if (lessons.length > 0) {
        navigate(`/learn/${course.id}/lesson/${lessons[0].id}`);
      } else if (quiz) {
        navigate(`/learn/${course.id}/quiz/${quiz.id}`);
      }
    } catch (err: any) {
      error('Gagal mendaftar kursus');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner message="Menyiapkan rincian kurikulum K3..." />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-xl mx-auto my-20 p-8 text-center bg-white rounded-2xl border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Kursus Tidak Ditemukan</h2>
        <p className="text-sm text-slate-500 mb-6">
          Kursus yang Anda cari mungkin telah dinonaktifkan atau tautan tidak valid.
        </p>
        <Link to="/courses" className="px-5 py-2.5 bg-brand-600 text-white font-bold rounded-xl text-sm">
          Kembali ke Katalog
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Course Hero Banner */}
      <div className="bg-navy-900 text-white pt-12 pb-16 border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
            {/* Left Content */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="blue">{course.level}</Badge>
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                  {course.category}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                {course.title}
              </h1>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                {course.description}
              </p>

              {/* Meta Stats */}
              <div className="flex flex-wrap items-center gap-6 pt-4 text-xs sm:text-sm text-slate-300">
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-brand-400" />
                  Estimasi Waktu: {course.duration_minutes} Menit
                </span>
                <span className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-brand-400" />
                  {lessons.length} Materi Pembelajaran
                </span>
                <span className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-safety-orange" />
                  Kuis KKM: {quiz?.passing_score || 75}%
                </span>
              </div>
            </div>

            {/* Right Card / CTA Action */}
            <div className="bg-white text-slate-800 rounded-2xl p-6 border border-slate-200/90 shadow-xl">
              <div className="relative rounded-xl overflow-hidden mb-5 aspect-video bg-slate-100">
                <img
                  src={course.thumbnail_url}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-4">
                <button
                  onClick={handleEnrollAndStart}
                  disabled={enrolling}
                  className="w-full py-3.5 px-4 rounded-xl text-base font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isEnrolled ? (
                    <>
                      Lanjutkan Belajar <ArrowRight className="w-5 h-5" />
                    </>
                  ) : (
                    <>
                      {enrolling ? 'Mendaftarkan...' : 'Mulai Belajar Sekarang (Gratis)'}
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                <div className="text-center text-xs text-slate-500">
                  {isEnrolled ? (
                    <span className="text-emerald-700 font-semibold flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Anda sudah terdaftar di kursus ini
                    </span>
                  ) : (
                    'Akses materi lengkap, video, kuis, dan sertifikat kelulusan'
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-2.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Akses seumur hidup 100% online</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Kuis evaluasi pemahaman dengan pembahasan</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Sertifikat kelulusan digital setelah lulus KKM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Column: Syllabus & Learning Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Syllabus Section */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs">
              <h2 className="text-xl font-bold text-navy-900 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-brand-600" />
                Kurikulum & Silabus Materi
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mb-6">
                Selesaikan seluruh materi di bawah ini secara berurutan sebelum mengerjakan kuis evaluasi kelulusan akhir.
              </p>

              <div className="space-y-3">
                {lessons.map((lesson, idx) => (
                  <div
                    key={lesson.id}
                    className="flex items-center justify-between p-4 rounded-xl border border-slate-200/80 hover:border-brand-500/40 bg-slate-50/50 hover:bg-blue-50/30 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 text-brand-700 flex items-center justify-center font-bold text-xs">
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800">{lesson.title}</h4>
                        <span className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" /> {lesson.duration_minutes} Menit
                        </span>
                      </div>
                    </div>

                    <Link
                      to={`/learn/${course.id}/lesson/${lesson.id}`}
                      className="px-3.5 py-1.5 text-xs font-bold text-brand-700 bg-white border border-slate-300 rounded-lg hover:bg-brand-50 transition-colors"
                    >
                      Buka Modul
                    </Link>
                  </div>
                ))}

                {/* Final Quiz Item */}
                {quiz && (
                  <div className="flex items-center justify-between p-4 rounded-xl border-2 border-orange-200 bg-orange-50/40">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-safety-orange text-white flex items-center justify-center font-bold text-xs">
                        ★
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                          {quiz.title}
                          <span className="px-2 py-0.5 text-[10px] bg-orange-200 text-orange-900 font-bold rounded">
                            KKM {quiz.passing_score}
                          </span>
                        </h4>
                        <span className="text-xs text-slate-500">
                          {quiz.total_questions || 5} Soal Pilihan Ganda • {quiz.time_limit_minutes || 15} Menit
                        </span>
                      </div>
                    </div>

                    <Link
                      to={`/learn/${course.id}/quiz/${quiz.id}`}
                      className="px-3.5 py-1.5 text-xs font-bold text-white bg-safety-orange hover:bg-safety-darkOrange rounded-lg transition-colors shadow-xs"
                    >
                      Buka Kuis
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Target Audience / Persyaratan */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-lg font-bold text-navy-900">Target Peserta & Prasyarat</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Siswa, mahasiswa kejuruan/teknik, dan umum yang ingin memahami keselamatan kerja.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Karyawan baru atau staf industri yang memerlukan pelatihan induksi K3 (*Safety Induction*).</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Tidak memerlukan latar belakang khusus; materi disusun secara sistematis dari pemula.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Instructor & Legal Info */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
              <h3 className="text-sm font-bold text-navy-900 uppercase tracking-wider mb-4">
                Instruktur Kurikulum
              </h3>
              <div className="flex items-center gap-3 mb-3">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80"
                  alt="Instruktur K3"
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-brand-100"
                />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Ir. Hendra Wijaya, M.KKK</h4>
                  <p className="text-xs text-slate-500">Ahli K3 Utama & Lead Auditor SMK3</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Berpengalaman lebih dari 15 tahun mendampingi industri manufaktur, pertambangan, dan konstruksi dalam penerapan zero accident serta audit SMK3 PP 50/2012.
              </p>
            </div>

            <div className="bg-amber-50/80 p-6 rounded-2xl border border-amber-200/80 text-xs text-amber-900 leading-relaxed space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-950">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Catatan Penting
              </div>
              <p>
                Kursus daring ini bertujuan memperluas literasi dan pemahaman mandiri K3. Apabila posisi pekerjaan Anda secara regulasi mewajibkan sertifikasi resmi kemenaker (misal: Ahli K3 Umum Kemenaker atau Operator Forklift Berlisensi SIO), Anda tetap harus mengikuti pelatihan tatap muka resmi yang diatur undang-undang.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
