import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Course } from '../types';
import { courseService } from '../services/courseService';
import { Badge } from '../components/common/Badge';
import {
  ShieldCheck,
  BookOpen,
  Award,
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
  Flame,
  HeartPulse,
  HardHat,
  SearchCheck,
  Activity,
  AlertTriangle,
} from 'lucide-react';

export const Home: React.FC = () => {
  const [popularCourses, setPopularCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const courses = await courseService.getCourses();
        setPopularCourses(courses.slice(0, 3));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const categories = [
    { name: 'Dasar-dasar K3', icon: ShieldCheck, color: 'text-blue-600 bg-blue-50' },
    { name: 'Penggunaan Alat Pelindung Diri (APD)', icon: HardHat, color: 'text-amber-600 bg-amber-50' },
    { name: 'Pertolongan Pertama pada Kecelakaan (P3K)', icon: HeartPulse, color: 'text-rose-600 bg-rose-50' },
    { name: 'Keselamatan dan Pencegahan Kebakaran', icon: Flame, color: 'text-orange-600 bg-orange-50' },
    { name: 'Identifikasi Bahaya dan Penilaian Risiko', icon: SearchCheck, color: 'text-purple-600 bg-purple-50' },
    { name: 'Ergonomi dan Keselamatan Lingkungan Kerja', icon: Activity, color: 'text-emerald-600 bg-emerald-50' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-navy-950 via-navy-900 to-navy-800 text-white pt-20 pb-28">
        {/* Abstract Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            {/* National Safety Month Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-semibold mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Standar Keselamatan Kerja Indonesia (SMK3 PP 50/2012)</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight mb-6">
              Belajar K3, Ciptakan Lingkungan Kerja Aman
            </h1>

            <p className="text-base sm:text-xl text-slate-300 leading-relaxed mb-8">
              Tingkatkan kompetensi dan kesadaran keselamatan kerja Anda melalui modul pembelajaran terstruktur, studi kasus nyata, kuis evaluasi interaktif, dan sertifikat kelulusan digital.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/courses"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-base font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-lg shadow-brand-600/30 transition-all hover:scale-[1.02]"
              >
                Mulai Belajar Sekarang
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/courses"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-base font-bold text-slate-200 bg-white/10 hover:bg-white/20 border border-white/10 backdrop-blur-xs transition-all"
              >
                Lihat Semua Kursus
              </Link>
            </div>
          </div>
        </div>

        {/* Floating Stat Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-brand-400 flex items-center justify-center shrink-0">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-black text-white">6+ Kategori</div>
                <div className="text-xs text-slate-400">Modul Terstandar</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-black text-white">1,500+</div>
                <div className="text-xs text-slate-400">Peserta Terdaftar</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-black text-white">96%</div>
                <div className="text-xs text-slate-400">Tingkat Kelulusan Kuis</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-500/20 text-safety-orange flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-black text-white">100% Online</div>
                <div className="text-xs text-slate-400">Fleksibel Kapan Saja</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Platform Advantages / Safety Pillars */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-brand-600 mb-2">
              Keunggulan K3Learn
            </h2>
            <h3 className="text-3xl font-extrabold text-navy-900 tracking-tight">
              Mengapa Belajar K3 di Platform Kami?
            </h3>
            <p className="mt-3 text-slate-600 text-sm leading-relaxed">
              Kami merancang kurikulum praktis yang tidak membosankan, dilengkapi studi kasus nyata kecelakaan industri dan tata cara pencegahannya.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-brand-700 flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-navy-900 mb-3">Materi Akurat & Kredibel</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Disusun berlandaskan undang-undang ketenagakerjaan RI, pedoman Kemenaker, standar ISO 45001, dan praktik terbaik industri manufaktur serta konstruksi.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-orange-100 text-safety-orange flex items-center justify-center mb-6">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-navy-900 mb-3">Kuis & Skoring Otomatis</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Evaluasi pemahaman secara instan dengan rumus nilai terstandarisasi. Kunci jawaban dievaluasi di server dengan pembahasan edukatif setelah pengerjaan selesai.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-6">
                <Award className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-navy-900 mb-3">Sertifikat Digital Terverifikasi</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Raih sertifikat kelulusan digital unik dengan nomor seri verifikasi setelah menyelesaikan seluruh materi dan lulus batas minimal nilai kuis (KKM).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 6 Core Categories Grid */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-brand-600 mb-1">
                Kategori Kursus
              </h2>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-navy-900">
                Pilar Pembelajaran K3 Terlengkap
              </h3>
            </div>
            <Link
              to="/courses"
              className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 hover:text-brand-700"
            >
              Jelajahi Semua Kursus <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={idx}
                  to={`/courses?category=${encodeURIComponent(cat.name)}`}
                  className="flex items-start gap-4 p-5 rounded-2xl border border-slate-200/80 hover:border-brand-500/50 hover:shadow-md transition-all group bg-white"
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${cat.color} group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-navy-900 group-hover:text-brand-600 transition-colors text-base mb-1">
                      {cat.name}
                    </h4>
                    <p className="text-xs text-slate-500">
                      Modul terstruktur dengan evaluasi kuis akhir
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Popular Courses Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-brand-600 mb-2">
              Kursus Unggulan
            </h2>
            <h3 className="text-3xl font-extrabold text-navy-900 tracking-tight">
              Paling Banyak Dipelajari Bulan Ini
            </h3>
            <p className="mt-3 text-slate-600 text-sm">
              Mulai dari dasar-dasar keselamatan hingga teknik analisis bahaya mendalam.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {popularCourses.map((course) => (
              <div
                key={course.id}
                className="flex flex-col bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-lg transition-all overflow-hidden group"
              >
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img
                    src={course.thumbnail_url}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant="blue">{course.level}</Badge>
                  </div>
                </div>

                <div className="flex flex-col flex-1 p-6">
                  <div className="text-xs font-semibold text-brand-600 uppercase tracking-wider mb-2">
                    {course.category}
                  </div>
                  <h4 className="text-lg font-bold text-navy-900 group-hover:text-brand-600 transition-colors line-clamp-2 mb-3">
                    {course.title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-3 mb-6 flex-1 leading-relaxed">
                    {course.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs text-slate-500 mb-4">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {course.duration_minutes} Menit
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                      3 Modul + Kuis
                    </span>
                  </div>

                  <Link
                    to={`/courses/${course.slug || course.id}`}
                    className="w-full text-center py-2.5 px-4 rounded-xl text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 transition-colors shadow-xs"
                  >
                    Mulai Belajar Kursus
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-brand-700 bg-blue-50 hover:bg-blue-100 transition-colors"
            >
              Lihat Seluruh Katalog Kursus K3 ({6} Kursus Aktif)
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Legal Notice Disclaimer Strip */}
      <section className="bg-amber-50/70 border-t border-b border-amber-200/80 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-amber-900 leading-relaxed">
              <strong>Pemberitahuan Regulasi Edukasi:</strong> Platform K3Learn adalah sarana pembelajaran daring (*e-learning*) untuk meningkatkan pemahaman keselamatan dan kesehatan kerja secara mandiri. Sertifikat penyelesaian kursus ini berfungsi sebagai bukti partisipasi dan tidak secara otomatis menggantikan sertifikasi K3 resmi Kemenaker RI atau lisensi BNSP yang memiliki persyaratan regulasi khusus.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
