export type UserRole = 'participant' | 'admin';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  avatar_url?: string;
  company_or_institution?: string;
  created_at?: string;
}

export type CourseLevel = 'Pemula' | 'Menengah' | 'Lanjutan';

export type CourseCategory =
  | 'Dasar-dasar K3'
  | 'Penggunaan Alat Pelindung Diri (APD)'
  | 'Pertolongan Pertama pada Kecelakaan (P3K)'
  | 'Keselamatan dan Pencegahan Kebakaran'
  | 'Identifikasi Bahaya dan Penilaian Risiko'
  | 'Ergonomi dan Keselamatan Lingkungan Kerja';

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: CourseCategory;
  level: CourseLevel;
  duration_minutes: number;
  thumbnail_url: string;
  is_published: boolean;
  lessons_count?: number;
  created_at: string;
  updated_at?: string;
}

export interface Lesson {
  id: string;
  course_id: string;
  title: string;
  slug: string;
  order_index: number;
  content_text: string;
  video_url?: string;
  document_url?: string;
  duration_minutes: number;
  key_points?: string[];
  created_at?: string;
}

export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  status: 'enrolled' | 'completed';
  enrolled_at: string;
  completed_at?: string;
  course?: Course;
  progress_percentage?: number;
}

export interface LessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  is_completed: boolean;
  completed_at?: string;
}

export interface AnswerOption {
  id: string;
  question_id: string;
  option_text: string;
  order_index: number;
  is_correct?: boolean; // Hidden from participant during quiz
}

export interface Question {
  id: string;
  quiz_id: string;
  question_text: string;
  explanation?: string;
  order_index: number;
  options: AnswerOption[];
}

export interface Quiz {
  id: string;
  course_id: string;
  title: string;
  description: string;
  passing_score: number; // e.g. 75
  time_limit_minutes?: number; // optional, e.g. 15
  max_attempts: number; // e.g. 3
  is_active: boolean;
  shuffle_questions: boolean;
  questions?: Question[];
  total_questions?: number;
}

export interface QuizAttempt {
  id: string;
  quiz_id: string;
  user_id: string;
  score: number;
  passed: boolean;
  attempt_number: number;
  duration_seconds: number;
  started_at: string;
  completed_at: string;
  correct_count?: number;
  total_questions?: number;
  quiz_title?: string;
  course_title?: string;
  course_id?: string;
}

export interface QuizResponse {
  id?: string;
  attempt_id: string;
  question_id: string;
  selected_option_id: string;
  is_correct?: boolean;
}

export interface Certificate {
  id: string;
  certificate_number: string;
  user_id: string;
  course_id: string;
  score: number;
  issued_at: string;
  verification_hash: string;
  recipient_name?: string;
  course_title?: string;
}

export interface SubmissionPayload {
  quiz_id: string;
  responses: Record<string, string>; // question_id -> selected_option_id
  duration_seconds: number;
}

export interface QuizResultReview {
  attempt: QuizAttempt;
  questions: {
    id: string;
    question_text: string;
    explanation: string;
    user_selected_option_id: string;
    correct_option_id: string;
    is_correct: boolean;
    options: AnswerOption[];
  }[];
}
