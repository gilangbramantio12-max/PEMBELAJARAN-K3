import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Course, CourseCategory, CourseLevel } from '../types';
import { courseService } from '../services/courseService';
import { Badge } from '../components/common/Badge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import {
  Search,
  BookOpen,
  Clock,
  Filter,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

const CATEGORIES: Array<'Semua' | CourseCategory> = [
  'Semua',
  'Dasar-dasar K3',
  'Penggunaan Alat Pelindung Diri (APD)',
  'Pertolongan Pertama pada Kecelakaan (P3K)',
  'Keselamatan dan Pencegahan Kebakaran',
  'Identifikasi Bahaya dan Penilaian Risiko',
  'Ergonomi dan Keselamatan Lingkungan Kerja',
];

const LEVELS: Array<'Semua' | CourseLevel> = ['Semua', 'Pemula', 'Menengah', 'Lanjutan'];

export const Catalog: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedCategory = searchParams.get('category') || 'Semua';
  const selectedLevel = searchParams.get('level') || 'Semua';
  const searchQuery = searchParams.get('q') || '';

  useEffect(() => {
    async function fetchCourses() {
      setLoading(true);
      try {
        const data = await courseService.getCourses();
        setCourses(data);
      } catch (err) {
        console.error('Error fetching courses:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, []);

  const updateParam = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (!value || value === 'Semua') {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  // Filter courses based on active filters
  const filteredCourses = courses.filter((c) => {
    const matchCategory =
      selectedCategory === 'Semua' || c.category === selectedCategory;
    const matchLevel = selectedLevel === 'Semua' || c.level === selectedLevel;
    const matchQuery =
      searchQuery.trim() === '' ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchCategory && matchLevel && matchQuery;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Title */}
        <div className="max-w-3xl mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-brand-800 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            Kurikulum Terstandarisasi SMK3 & UU No. 1/1970
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
            Katalog Kursus Pembelajaran K3
          </h1>
          <p className="mt-2 text-slate-600 text-sm sm:text-base leading-relaxed">
            Pilih kursus K3 sesuai dengan kebutuhan spesifik industri dan bidang kerja Anda. Setiap kursus dilengkapi materi interaktif, video, dan kuis evaluasi.
          </p>
        </div>

        {/* Filter Bar & Search */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari materi K3, APD, kebakaran, risiko..."
                value={searchQuery}
                onChange={(e) => updateParam('q', e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-brand-600"
              />
            </div>

            {/* Level Filter Dropdown */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
                Tingkat Kesulitan:
              </span>
              <select
                value={selectedLevel}
                onChange={(e) => updateParam('level', e.target.value)}
                className="w-full md:w-auto px-3 py-2 text-xs font-semibold border border-slate-300 rounded-xl bg-white text-slate-700 focus:outline-none focus:border-brand-600"
              >
                {LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category Pills Slider */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => updateParam('category', cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-brand-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Course Cards Grid */}
        {loading ? (
          <div className="py-20">
            <LoadingSpinner message="Memuat kurikulum kursus K3..." />
          </div>
        ) : filteredCourses.length === 0 ? (
          <EmptyState
            title="Tidak Ada Kursus yang Sesuai"
            description="Tidak ditemukan kursus K3 dengan kriteria pencarian Anda. Silakan reset filter atau gunakan kata kunci lain."
            actionText="Tampilkan Semua Kursus"
            onAction={() => setSearchParams(new URLSearchParams())}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="flex flex-col bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                {/* Thumbnail */}
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img
                    src={course.thumbnail_url}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge variant={course.level === 'Pemula' ? 'blue' : course.level === 'Menengah' ? 'yellow' : 'orange'}>
                      {course.level}
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-6">
                  <span className="text-[11px] font-bold text-brand-600 uppercase tracking-wider mb-2">
                    {course.category}
                  </span>
                  <h3 className="text-lg font-bold text-navy-900 group-hover:text-brand-600 transition-colors line-clamp-2 mb-2 leading-snug">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-3 mb-6 flex-1 leading-relaxed">
                    {course.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs text-slate-500 mb-5">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {course.duration_minutes} Menit
                    </span>
                    <span className="flex items-center gap-1.5 font-medium">
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
        )}
      </div>
    </div>
  );
};
