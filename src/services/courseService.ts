import { Course, Lesson, Enrollment, LessonProgress } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { INITIAL_COURSES, INITIAL_LESSONS } from '../data/mockData';

const LOCAL_ENROLLMENTS_KEY = 'k3learn_enrollments';
const LOCAL_PROGRESS_KEY = 'k3learn_lesson_progress';
const LOCAL_COURSES_KEY = 'k3learn_courses';
const LOCAL_LESSONS_KEY = 'k3learn_lessons';

// Helper get stored local courses
function getStoredCourses(): Course[] {
  try {
    const raw = localStorage.getItem(LOCAL_COURSES_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  localStorage.setItem(LOCAL_COURSES_KEY, JSON.stringify(INITIAL_COURSES));
  return INITIAL_COURSES;
}

function getStoredLessons(): Record<string, Lesson[]> {
  try {
    const raw = localStorage.getItem(LOCAL_LESSONS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  localStorage.setItem(LOCAL_LESSONS_KEY, JSON.stringify(INITIAL_LESSONS));
  return INITIAL_LESSONS;
}

export const courseService = {
  // Ambil semua kursus yang dipublikasikan
  async getCourses(): Promise<Course[]> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: true });

      if (error) {
        console.warn('Supabase getCourses error, using fallback:', error.message);
        return getStoredCourses();
      }
      return data || [];
    }
    return getStoredCourses();
  },

  // Ambil semua kursus untuk admin (termasuk yang draft)
  async getAllCoursesAdmin(): Promise<Course[]> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase getAllCoursesAdmin error:', error.message);
        return getStoredCourses();
      }
      return data || [];
    }
    return getStoredCourses();
  },

  // Ambil detail kursus berdasarkan ID atau Slug
  async getCourseByIdOrSlug(idOrSlug: string): Promise<Course | null> {
    const courses = await this.getCourses();
    const found = courses.find((c) => c.id === idOrSlug || c.slug === idOrSlug);
    return found || null;
  },

  // Ambil daftar materi (lessons) untuk kursus
  async getLessonsByCourseId(courseId: string): Promise<Lesson[]> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index', { ascending: true });

      if (error) {
        console.warn('Supabase getLessons error:', error.message);
        const map = getStoredLessons();
        return map[courseId] || [];
      }
      return data || [];
    }
    const map = getStoredLessons();
    return map[courseId] || [];
  },

  // Pendaftaran peserta ke kursus (Enroll)
  async enrollCourse(userId: string, courseId: string): Promise<Enrollment> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('enrollments')
        .insert({
          user_id: userId,
          course_id: courseId,
          status: 'enrolled',
        })
        .select()
        .single();

      if (!error && data) return data;
    }

    // LocalStorage fallback
    const raw = localStorage.getItem(LOCAL_ENROLLMENTS_KEY);
    const enrollments: Enrollment[] = raw ? JSON.parse(raw) : [];
    const existing = enrollments.find((e) => e.user_id === userId && e.course_id === courseId);
    if (existing) return existing;

    const newEnrollment: Enrollment = {
      id: `enr-${Date.now()}`,
      user_id: userId,
      course_id: courseId,
      status: 'enrolled',
      enrolled_at: new Date().toISOString(),
    };
    enrollments.push(newEnrollment);
    localStorage.setItem(LOCAL_ENROLLMENTS_KEY, JSON.stringify(enrollments));
    return newEnrollment;
  },

  // Cek status pendaftaran user pada kursus
  async getUserEnrollment(userId: string, courseId: string): Promise<Enrollment | null> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('enrollments')
        .select('*')
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .maybeSingle();

      if (!error && data) return data;
    }

    const raw = localStorage.getItem(LOCAL_ENROLLMENTS_KEY);
    const enrollments: Enrollment[] = raw ? JSON.parse(raw) : [];
    return enrollments.find((e) => e.user_id === userId && e.course_id === courseId) || null;
  },

  // Ambil semua kursus yang diikuti user
  async getUserEnrollments(userId: string): Promise<Enrollment[]> {
    let enrollments: Enrollment[] = [];
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('enrollments')
        .select('*, courses(*)')
        .eq('user_id', userId);

      if (!error && data) {
        enrollments = data.map((d: any) => ({ ...d, course: d.courses }));
      }
    }

    if (enrollments.length === 0) {
      const raw = localStorage.getItem(LOCAL_ENROLLMENTS_KEY);
      enrollments = raw ? JSON.parse(raw) : [];
      enrollments = enrollments.filter((e) => e.user_id === userId);
      const courses = await this.getCourses();
      enrollments = enrollments.map((e) => ({
        ...e,
        course: courses.find((c) => c.id === e.course_id),
      }));
    }

    // Hitung progress percentage
    for (const enr of enrollments) {
      const lessons = await this.getLessonsByCourseId(enr.course_id);
      if (lessons.length > 0) {
        const completedCount = await this.getCompletedLessonCount(userId, enr.course_id);
        enr.progress_percentage = Math.round((completedCount / lessons.length) * 100);
      } else {
        enr.progress_percentage = 0;
      }
    }

    return enrollments;
  },

  // Tandai materi selesai dipelajari
  async markLessonCompleted(userId: string, courseId: string, lessonId: string): Promise<boolean> {
    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('lesson_progress')
        .upsert(
          {
            user_id: userId,
            lesson_id: lessonId,
            is_completed: true,
            completed_at: new Date().toISOString(),
          },
          { onConflict: 'user_id,lesson_id' }
        );
      if (!error) return true;
    }

    const raw = localStorage.getItem(LOCAL_PROGRESS_KEY);
    const progressList: LessonProgress[] = raw ? JSON.parse(raw) : [];
    const index = progressList.findIndex((p) => p.user_id === userId && p.lesson_id === lessonId);
    if (index >= 0) {
      progressList[index].is_completed = true;
      progressList[index].completed_at = new Date().toISOString();
    } else {
      progressList.push({
        id: `prog-${Date.now()}`,
        user_id: userId,
        lesson_id: lessonId,
        is_completed: true,
        completed_at: new Date().toISOString(),
      });
    }
    localStorage.setItem(LOCAL_PROGRESS_KEY, JSON.stringify(progressList));
    return true;
  },

  // Cek status materi tertentu untuk user
  async isLessonCompleted(userId: string, lessonId: string): Promise<boolean> {
    if (isSupabaseConfigured) {
      const { data } = await supabase
        .from('lesson_progress')
        .select('is_completed')
        .eq('user_id', userId)
        .eq('lesson_id', lessonId)
        .maybeSingle();
      if (data) return data.is_completed;
    }

    const raw = localStorage.getItem(LOCAL_PROGRESS_KEY);
    const progressList: LessonProgress[] = raw ? JSON.parse(raw) : [];
    const found = progressList.find((p) => p.user_id === userId && p.lesson_id === lessonId);
    return found ? found.is_completed : false;
  },

  // Jumlah materi selesai pada kursus
  async getCompletedLessonCount(userId: string, courseId: string): Promise<number> {
    const lessons = await this.getLessonsByCourseId(courseId);
    let count = 0;
    for (const l of lessons) {
      const done = await this.isLessonCompleted(userId, l.id);
      if (done) count++;
    }
    return count;
  },

  // Admin: Buat Kursus Baru
  async createCourse(courseData: Partial<Course>): Promise<Course> {
    const newCourse: Course = {
      id: `c-${Date.now()}`,
      slug: (courseData.title || 'kursus').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: courseData.title || 'Kursus Baru K3',
      description: courseData.description || '',
      category: courseData.category || 'Dasar-dasar K3',
      level: courseData.level || 'Pemula',
      duration_minutes: courseData.duration_minutes || 60,
      thumbnail_url: courseData.thumbnail_url || 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
      is_published: courseData.is_published ?? true,
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('courses').insert(newCourse).select().single();
      if (!error && data) return data;
    }

    const courses = getStoredCourses();
    courses.unshift(newCourse);
    localStorage.setItem(LOCAL_COURSES_KEY, JSON.stringify(courses));
    return newCourse;
  },

  // Admin: Update Kursus
  async updateCourse(id: string, updates: Partial<Course>): Promise<Course | null> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('courses')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (!error && data) return data;
    }

    const courses = getStoredCourses();
    const idx = courses.findIndex((c) => c.id === id);
    if (idx >= 0) {
      courses[idx] = { ...courses[idx], ...updates, updated_at: new Date().toISOString() };
      localStorage.setItem(LOCAL_COURSES_KEY, JSON.stringify(courses));
      return courses[idx];
    }
    return null;
  },

  // Admin: Hapus Kursus
  async deleteCourse(id: string): Promise<boolean> {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('courses').delete().eq('id', id);
      if (!error) return true;
    }

    const courses = getStoredCourses().filter((c) => c.id !== id);
    localStorage.setItem(LOCAL_COURSES_KEY, JSON.stringify(courses));
    return true;
  },
};
