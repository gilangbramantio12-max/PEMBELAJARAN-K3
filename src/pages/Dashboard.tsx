import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Enrollment, QuizAttempt, Certificate } from '../types';
import { courseService } from '../services/courseService';
import { quizService } from '../services/quizService';
import { certificateService } from '../services/certificateService';
import { useAuth } from '../context/AuthContext';
import { ProgressBar } from '../components/common/ProgressBar';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { formatDateIndo, formatDuration } from '../lib/scoring';
import {
  BookOpen,
  Award,
  CheckCircle2,
  Clock,
  TrendingUp,
  FileCheck,
  Building,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchDashboardData() {
      if (!user) return;
      setLoading(true);
      try {
        const [userEnrollments, userAttempts, userCerts] = await Promise.all([
          courseService.getUserEnrollments(user.id),
          quizService.getUserAttempts(user.id),
          certificateService.getUserCertificates(user.id),
        ]);

        setEnrollments(userEnrollments);
        setAttempts(userAttempts);
        setCertificates(userCerts);
      } catch (err) {
        console.error('Error fetching dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <LoadingSpinner message="Menyiapkan data progres belajar Anda..." />
      </div>
    );
  }

  // Perhitungan statistik
  const totalCourses = enrollments.length;
  const completedCourses = enrollments.filter((e) => e.status === 'completed' || e.progress_percentage === 100).length;
  const averageScore =
    attempts.length > 0
      ? Math.round(attempts.reduce((acc, curr) => acc + curr.score, 0) / attempts.length)
      : 0;
  const latestAttempt = attempts.length > 0 ? attempts[0] : null;

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* User Profile Header Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            {user?.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.full_name}
                className="w-16 h-16 rounded-2xl object-cover ring-4 ring-blue-100"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-brand-600 text-white flex items-center justify-center text-2xl font-black shadow-md">
                {user?.full_name?.charAt(0) || 'P'}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-navy-900 tracking-tight">
                  {user?.full_name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-brand-800 capitalize">
                  {user?.role === 'admin' ? 'Pengelola K3' : 'Peserta Belajar'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5" />
                {user?.company_or_institution || 'Instansi / Perusahaan Terdaftar'}
              </p>
            </div>
          </div>

          <Link
            to="/courses"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-xs transition-colors"
          >
            <BookOpen className="w-4 h-4" /> Jelajahi Kursus Baru
          </Link>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-xs font-semibold text-slate-500 block mb-1">Kursus Diikuti</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-black text-navy-900">{totalCourses}</span>
              <BookOpen className="w-5 h-5 text-brand-600" />
            </div>
            <span className="text-[11px] text-slate-400 mt-2 block">
              {completedCourses} kursus telah selesai
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-xs font-semibold text-slate-500 block mb-1">Nilai Kuis Terakhir</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-black text-emerald-600">
                {latestAttempt ? latestAttempt.score : '-'}
              </span>
              <Award className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-[11px] text-slate-400 mt-2 block">
              {latestAttempt ? (latestAttempt.passed ? 'Lulus KKM' : 'Belum Lulus') : 'Belum ada kuis'}
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-xs font-semibold text-slate-500 block mb-1">Rata-rata Nilai</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-black text-navy-900">{averageScore}</span>
              <TrendingUp className="w-5 h-5 text-brand-600" />
            </div>
            <span className="text-[11px] text-slate-400 mt-2 block">
              Dari {attempts.length} kali pengerjaan
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-xs font-semibold text-slate-500 block mb-1">Sertifikat Digital</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-black text-safety-orange">
                {certificates.length}
              </span>
              <FileCheck className="w-5 h-5 text-safety-orange" />
            </div>
            <span className="text-[11px] text-slate-400 mt-2 block">
              Siap diunduh / dicetak
            </span>
          </div>
        </div>

        {/* Active & Enrolled Courses Section */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-navy-900">Kursus yang Sedang Berjalan</h2>
              <p className="text-xs text-slate-500">
                Lanjutkan materi dan selesaikan kuis untuk meraih sertifikat
              </p>
            </div>
            <Link to="/courses" className="text-xs font-bold text-brand-600 hover:text-brand-700">
              Lihat Katalog
            </Link>
          </div>

          {enrollments.length === 0 ? (
            <EmptyState
              title="Belum Ada Kursus yang Diikuti"
              description="Anda belum mendaftar di kursus K3 manapun. Mulai dari Dasar-dasar K3 atau Penggunaan APD sekarang."
              actionText="Mulai Belajar Sekarang"
              onAction={() => (window.location.href = '/courses')}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrollments.map((enr) => {
                const course = enr.course;
                if (!course) return null;
                const progress = enr.progress_percentage || 0;

                return (
                  <div
                    key={enr.id}
                    className="flex flex-col bg-slate-50/60 rounded-2xl border border-slate-200/80 p-5 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center justify-between mb-3 text-[11px] font-bold text-brand-600 uppercase">
                      <span>{course.category}</span>
                      <span className="text-slate-500 font-medium">{enr.status === 'completed' ? 'Selesai' : 'Aktif'}</span>
                    </div>

                    <h3 className="font-bold text-navy-900 text-base line-clamp-2 mb-4 group-hover:text-brand-600 transition-colors">
                      {course.title}
                    </h3>

                    {/* Progress Bar */}
                    <div className="mt-auto space-y-2 mb-4">
                      <div className="flex justify-between text-xs font-bold text-slate-600">
                        <span>Progres Belajar</span>
                        <span>{progress}%</span>
                      </div>
                      <ProgressBar progress={progress} size="sm" color={progress === 100 ? 'green' : 'blue'} />
                    </div>

                    <Link
                      to={`/courses/${course.slug || course.id}`}
                      className="w-full text-center py-2 px-3 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 transition-colors flex items-center justify-center gap-1.5"
                    >
                      Lanjutkan Belajar <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Certificates Section */}
        {certificates.length > 0 && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-navy-900 flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-safety-orange" />
                  Sertifikat Digital Saya
                </h2>
                <p className="text-xs text-slate-500">
                  Sertifikat kelulusan terverifikasi resmi K3Learn yang telah Anda raih
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {certificates.map((cert) => (
                <div
                  key={cert.id}
                  className="flex items-center justify-between p-5 rounded-2xl border-2 border-dashed border-emerald-200 bg-emerald-50/30"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest bg-emerald-100 px-2 py-0.5 rounded">
                      No: {cert.certificate_number}
                    </span>
                    <h4 className="font-bold text-navy-900 text-sm">{cert.course_title}</h4>
                    <p className="text-xs text-slate-500">
                      Terbit: {formatDateIndo(cert.issued_at)} • Nilai: {cert.score}
                    </p>
                  </div>

                  <Link
                    to={`/certificate/${cert.id}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs transition-colors shrink-0"
                  >
                    Buka Sertifikat <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quiz History Table */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
          <div className="pb-4 border-b border-slate-100">
            <h2 className="text-lg font-bold text-navy-900">Riwayat Pengerjaan Kuis</h2>
            <p className="text-xs text-slate-500">
              Catatan lengkap riwayat percobaan dan nilai evaluasi pemahaman K3 Anda
            </p>
          </div>

          {attempts.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">
              Belum ada riwayat kuis yang tercatat. Selesaikan materi pelajaran dan ikuti kuis evaluasi.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 text-[11px] uppercase tracking-wider">
                    <th className="pb-3 font-semibold">Kuis / Kursus</th>
                    <th className="pb-3 font-semibold">Tanggal</th>
                    <th className="pb-3 font-semibold">Durasi</th>
                    <th className="pb-3 font-semibold">Percobaan</th>
                    <th className="pb-3 font-semibold">Nilai</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {attempts.map((att) => (
                    <tr key={att.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 font-bold text-slate-800">
                        {att.quiz_title || 'Ujian Evaluasi K3'}
                      </td>
                      <td className="py-3.5 text-slate-500">{formatDateIndo(att.completed_at)}</td>
                      <td className="py-3.5 text-slate-500">{formatDuration(att.duration_seconds)}</td>
                      <td className="py-3.5 text-slate-500">Ke-{att.attempt_number}</td>
                      <td className="py-3.5 font-bold text-slate-900">{att.score}</td>
                      <td className="py-3.5">
                        {att.passed ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                            LULUS
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800">
                            BELUM LULUS
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 text-right">
                        {att.course_id && (
                          <Link
                            to={`/learn/${att.course_id}/quiz/${att.quiz_id}/result/${att.id}`}
                            className="text-xs font-bold text-brand-600 hover:text-brand-800"
                          >
                            Lihat Pembahasan
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
