import React, { useEffect, useState } from 'react';
import { Course, Quiz, Question, QuizAttempt, CourseCategory, CourseLevel } from '../types';
import { courseService } from '../services/courseService';
import { quizService } from '../services/quizService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { formatDateIndo, formatDuration } from '../lib/scoring';
import {
  ShieldAlert,
  BookOpen,
  Award,
  Users,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sliders,
  Settings,
  Eye,
  Save,
  X,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { success, error: toastError } = useToast();

  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'quizzes' | 'participants'>('overview');
  const [courses, setCourses] = useState<Course[]>([]);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Modal State untuk Tambah Kursus
  const [showCourseModal, setShowCourseModal] = useState<boolean>(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseForm, setCourseForm] = useState({
    title: '',
    category: 'Dasar-dasar K3' as CourseCategory,
    level: 'Pemula' as CourseLevel,
    duration_minutes: 60,
    description: '',
    thumbnail_url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
  });

  // Modal State untuk Edit Konfigurasi Kuis
  const [showQuizModal, setShowQuizModal] = useState<boolean>(false);
  const [selectedCourseForQuiz, setSelectedCourseForQuiz] = useState<Course | null>(null);
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [quizForm, setQuizForm] = useState({
    passing_score: 75,
    max_attempts: 3,
    time_limit_minutes: 15,
  });

  useEffect(() => {
    async function fetchAdminData() {
      setLoading(true);
      try {
        const [loadedCourses, loadedAttempts] = await Promise.all([
          courseService.getAllCoursesAdmin(),
          quizService.getAllAttemptsAdmin(),
        ]);
        setCourses(loadedCourses);
        setAttempts(loadedAttempts);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchAdminData();
  }, []);

  const handleOpenCourseModal = (courseToEdit?: Course) => {
    if (courseToEdit) {
      setEditingCourse(courseToEdit);
      setCourseForm({
        title: courseToEdit.title,
        category: courseToEdit.category,
        level: courseToEdit.level,
        duration_minutes: courseToEdit.duration_minutes,
        description: courseToEdit.description,
        thumbnail_url: courseToEdit.thumbnail_url,
      });
    } else {
      setEditingCourse(null);
      setCourseForm({
        title: '',
        category: 'Dasar-dasar K3',
        level: 'Pemula',
        duration_minutes: 60,
        description: '',
        thumbnail_url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
      });
    }
    setShowCourseModal(true);
  };

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseForm.title.trim()) {
      toastError('Judul kursus wajib diisi');
      return;
    }

    try {
      if (editingCourse) {
        const updated = await courseService.updateCourse(editingCourse.id, courseForm);
        if (updated) {
          setCourses((prev) => prev.map((c) => (c.id === editingCourse.id ? updated : c)));
          success('Kursus K3 berhasil diperbarui!');
        }
      } else {
        const created = await courseService.createCourse(courseForm);
        setCourses((prev) => [created, ...prev]);
        success('Kursus K3 baru berhasil ditambahkan!');
      }
      setShowCourseModal(false);
    } catch (err: any) {
      toastError(err.message || 'Gagal menyimpan kursus');
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus kursus K3 ini?')) return;
    try {
      await courseService.deleteCourse(courseId);
      setCourses((prev) => prev.filter((c) => c.id !== courseId));
      success('Kursus berhasil dihapus');
    } catch (err: any) {
      toastError('Gagal menghapus kursus');
    }
  };

  const handleOpenQuizConfig = async (course: Course) => {
    setSelectedCourseForQuiz(course);
    const q = await quizService.getQuizByCourseId(course.id);
    if (q) {
      setCurrentQuiz(q);
      setQuizForm({
        passing_score: q.passing_score,
        max_attempts: q.max_attempts,
        time_limit_minutes: q.time_limit_minutes || 15,
      });
    }
    setShowQuizModal(true);
  };

  const handleSaveQuizConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentQuiz) return;
    try {
      await quizService.updateQuizConfig(currentQuiz.id, {
        passing_score: Number(quizForm.passing_score),
        max_attempts: Number(quizForm.max_attempts),
        time_limit_minutes: Number(quizForm.time_limit_minutes),
      });
      success('Konfigurasi batas KKM & pengerjaan kuis berhasil diperbarui!');
      setShowQuizModal(false);
    } catch (err: any) {
      toastError('Gagal menyimpan konfigurasi kuis');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <LoadingSpinner message="Membuka konsol administrasi K3..." />
      </div>
    );
  }

  const passedAttemptsCount = attempts.filter((a) => a.passed).length;
  const passRate = attempts.length > 0 ? Math.round((passedAttemptsCount / attempts.length) * 100) : 100;

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Header Card */}
        <div className="bg-navy-900 text-white p-6 sm:p-8 rounded-3xl border border-navy-800 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-safety-orange text-white uppercase tracking-wider">
                Panel Kontrol
              </span>
              <span className="text-xs text-slate-400">SMK3 Administrator</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Pusat Manajemen Kurikulum & Kuis K3
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Kelola modul pembelajaran, batas nilai kelulusan kuis, bank soal, dan pantau progres peserta.
            </p>
          </div>

          <button
            onClick={() => handleOpenCourseModal()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-xs transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" /> Tambah Kursus Baru
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-bold rounded-t-xl transition-colors ${
              activeTab === 'overview'
                ? 'bg-white text-brand-600 border-t border-x border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Ringkasan Metrik
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-bold rounded-t-xl transition-colors ${
              activeTab === 'courses'
                ? 'bg-white text-brand-600 border-t border-x border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Kelola Kursus & Modul ({courses.length})
          </button>
          <button
            onClick={() => setActiveTab('quizzes')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-bold rounded-t-xl transition-colors ${
              activeTab === 'quizzes'
                ? 'bg-white text-brand-600 border-t border-x border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Bank Soal & Skoring K3
          </button>
          <button
            onClick={() => setActiveTab('participants')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-bold rounded-t-xl transition-colors ${
              activeTab === 'participants'
                ? 'bg-white text-brand-600 border-t border-x border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pantau Nilai Peserta ({attempts.length})
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
                <span className="text-xs text-slate-500 font-semibold block mb-1">Total Kursus K3</span>
                <span className="text-3xl font-black text-navy-900">{courses.length}</span>
                <span className="text-[11px] text-emerald-600 font-semibold mt-2 block">
                  Aktif dipublikasikan
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
                <span className="text-xs text-slate-500 font-semibold block mb-1">Total Pengerjaan Kuis</span>
                <span className="text-3xl font-black text-brand-600">{attempts.length}</span>
                <span className="text-[11px] text-slate-400 mt-2 block">Oleh seluruh peserta</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
                <span className="text-xs text-slate-500 font-semibold block mb-1">Tingkat Kelulusan</span>
                <span className="text-3xl font-black text-emerald-600">{passRate}%</span>
                <span className="text-[11px] text-slate-400 mt-2 block">
                  {passedAttemptsCount} percobaan lulus
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
                <span className="text-xs text-slate-500 font-semibold block mb-1">Standar Keamanan</span>
                <span className="text-3xl font-black text-safety-orange">100%</span>
                <span className="text-[11px] text-slate-400 mt-2 block">Blind Answer Key Active</span>
              </div>
            </div>

            {/* Recent Activity Table */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
              <h3 className="font-bold text-navy-900 text-base">Aktivitas Ujian Kuis Terbaru</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 text-[11px] uppercase">
                      <th className="pb-3">Waktu</th>
                      <th className="pb-3">Peserta</th>
                      <th className="pb-3">Kursus</th>
                      <th className="pb-3">Nilai</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {attempts.slice(0, 5).map((att) => (
                      <tr key={att.id} className="hover:bg-slate-50">
                        <td className="py-3 text-slate-500">{formatDateIndo(att.completed_at)}</td>
                        <td className="py-3 font-semibold text-slate-800">Budi Santoso</td>
                        <td className="py-3 text-slate-600">{att.quiz_title || 'Evaluasi K3'}</td>
                        <td className="py-3 font-bold text-navy-900">{att.score}</td>
                        <td className="py-3">
                          {att.passed ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              LULUS
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                              REMEDIAL
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MANAGE COURSES */}
        {activeTab === 'courses' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-navy-900">Daftar Modul & Kursus K3</h2>
              <button
                onClick={() => handleOpenCourseModal()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700"
              >
                <Plus className="w-4 h-4" /> Tambah Kursus
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 text-[11px] uppercase">
                    <th className="pb-3">Kursus</th>
                    <th className="pb-3">Kategori</th>
                    <th className="pb-3">Tingkat</th>
                    <th className="pb-3">Durasi</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {courses.map((course) => (
                    <tr key={course.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={course.thumbnail_url}
                            alt=""
                            className="w-12 h-10 object-cover rounded-lg bg-slate-100"
                          />
                          <div>
                            <div className="font-bold text-navy-900">{course.title}</div>
                            <div className="text-[11px] text-slate-400 line-clamp-1 max-w-xs">
                              {course.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 font-semibold text-slate-600">{course.category}</td>
                      <td className="py-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-brand-800">
                          {course.level}
                        </span>
                      </td>
                      <td className="py-4 text-slate-500">{course.duration_minutes} Mnt</td>
                      <td className="py-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Dipublikasikan
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenCourseModal(course)}
                            className="p-1.5 text-slate-500 hover:text-brand-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit Kursus"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCourse(course.id)}
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Hapus Kursus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: QUIZZES & SCORING CONFIG */}
        {activeTab === 'quizzes' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
            <div className="pb-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-navy-900">Konfigurasi Nilai Kelulusan & Bank Soal</h2>
              <p className="text-xs text-slate-500">
                Atur passing score (KKM), batas maksimal pengerjaan, dan durasi pengerjaan kuis pada setiap kursus.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between"
                >
                  <div className="space-y-2 mb-4">
                    <span className="text-[10px] font-bold text-brand-600 uppercase">
                      {course.category}
                    </span>
                    <h4 className="font-bold text-navy-900 text-sm leading-snug">{course.title}</h4>
                    <p className="text-xs text-slate-500">
                      Standard KKM: <strong>75%</strong> • Percobaan: <strong>3x</strong>
                    </p>
                  </div>

                  <button
                    onClick={() => handleOpenQuizConfig(course)}
                    className="w-full inline-flex items-center justify-center gap-2 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 transition-colors"
                  >
                    <Sliders className="w-3.5 h-3.5" /> Atur KKM & Durasi
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: PARTICIPANTS MONITORING */}
        {activeTab === 'participants' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
            <div className="pb-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-navy-900">Monitoring Nilai & Kelulusan Peserta</h2>
              <p className="text-xs text-slate-500">
                Data pengerjaan kuis, skor otomatis, dan status penerbitan sertifikat digital.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 text-[11px] uppercase">
                    <th className="pb-3">Peserta</th>
                    <th className="pb-3">Kursus</th>
                    <th className="pb-3">Waktu Selesai</th>
                    <th className="pb-3">Durasi</th>
                    <th className="pb-3">Skor</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {attempts.map((att) => (
                    <tr key={att.id} className="hover:bg-slate-50">
                      <td className="py-3.5 font-bold text-slate-800">Budi Santoso, S.T.</td>
                      <td className="py-3.5 text-slate-600">{att.quiz_title || 'Evaluasi Mandiri'}</td>
                      <td className="py-3.5 text-slate-500">{formatDateIndo(att.completed_at)}</td>
                      <td className="py-3.5 text-slate-500">{formatDuration(att.duration_seconds)}</td>
                      <td className="py-3.5 font-black text-navy-900">{att.score} / 100</td>
                      <td className="py-3.5">
                        {att.passed ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            LULUS
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                            BELUM LULUS
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Course Edit/Create Modal */}
      {showCourseModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <h3 className="text-lg font-bold text-navy-900">
                {editingCourse ? 'Ubah Informasi Kursus' : 'Tambah Kursus K3 Baru'}
              </h3>
              <button onClick={() => setShowCourseModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Judul Kursus K3</label>
                <input
                  type="text"
                  required
                  value={courseForm.title}
                  onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                  placeholder="Contoh: Keselamatan Bekerja di Ruang Terbatas (Confined Space)"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-brand-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kategori K3</label>
                  <select
                    value={courseForm.category}
                    onChange={(e) =>
                      setCourseForm({ ...courseForm, category: e.target.value as CourseCategory })
                    }
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="Dasar-dasar K3">Dasar-dasar K3</option>
                    <option value="Penggunaan Alat Pelindung Diri (APD)">Alat Pelindung Diri (APD)</option>
                    <option value="Pertolongan Pertama pada Kecelakaan (P3K)">P3K di Tempat Kerja</option>
                    <option value="Keselamatan dan Pencegahan Kebakaran">Pencegahan Kebakaran</option>
                    <option value="Identifikasi Bahaya dan Penilaian Risiko">HIRADC / IBPR</option>
                    <option value="Ergonomi dan Keselamatan Lingkungan Kerja">Ergonomi & Lingkungan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tingkat Kesulitan</label>
                  <select
                    value={courseForm.level}
                    onChange={(e) =>
                      setCourseForm({ ...courseForm, level: e.target.value as CourseLevel })
                    }
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="Pemula">Pemula</option>
                    <option value="Menengah">Menengah</option>
                    <option value="Lanjutan">Lanjutan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Estimasi Durasi (Menit)
                </label>
                <input
                  type="number"
                  min="15"
                  value={courseForm.duration_minutes}
                  onChange={(e) =>
                    setCourseForm({ ...courseForm, duration_minutes: Number(e.target.value) })
                  }
                  className="w-full px-3.5 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi Kursus</label>
                <textarea
                  rows={3}
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                  placeholder="Ringkasan materi, tujuan pembelajaran, dan kompetensi yang dicapai..."
                  className="w-full px-3.5 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-brand-600"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCourseModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-xs"
                >
                  Simpan Kursus
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quiz Configuration Modal */}
      {showQuizModal && selectedCourseForQuiz && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <h3 className="text-base font-bold text-navy-900">
                Konfigurasi Kuis: {selectedCourseForQuiz.title}
              </h3>
              <button onClick={() => setShowQuizModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuizConfig} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Batas Kelulusan (KKM dalam %)
                </label>
                <input
                  type="number"
                  min="50"
                  max="100"
                  required
                  value={quizForm.passing_score}
                  onChange={(e) => setQuizForm({ ...quizForm, passing_score: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Peserta harus mencapai nilai ini agar status LULUS dan sertifikat terbit.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Batas Maksimal Percobaan (Attempts)
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  required
                  value={quizForm.max_attempts}
                  onChange={(e) => setQuizForm({ ...quizForm, max_attempts: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Batas Waktu Timer (Menit)
                </label>
                <input
                  type="number"
                  min="5"
                  max="60"
                  required
                  value={quizForm.time_limit_minutes}
                  onChange={(e) =>
                    setQuizForm({ ...quizForm, time_limit_minutes: Number(e.target.value) })
                  }
                  className="w-full px-3.5 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowQuizModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-xs"
                >
                  Terapkan Pengaturan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
