import { Certificate } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { generateCertificateNumber } from '../lib/scoring';
import { courseService } from './courseService';
import { quizService } from './quizService';

const LOCAL_CERTS_KEY = 'k3learn_certificates';

function getStoredCertificates(): Certificate[] {
  try {
    const raw = localStorage.getItem(LOCAL_CERTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return [];
}

export const certificateService = {
  // Cek apakah user berhak mendapatkan sertifikat
  // Syarat: Semua materi kursus telah diselesaikan DAN kuis lulus (skor >= KKM)
  async checkEligibility(
    userId: string,
    courseId: string
  ): Promise<{ eligible: boolean; reason?: string; bestScore?: number }> {
    // 1. Cek materi
    const lessons = await courseService.getLessonsByCourseId(courseId);
    const completedCount = await courseService.getCompletedLessonCount(userId, courseId);

    if (lessons.length > 0 && completedCount < lessons.length) {
      return {
        eligible: false,
        reason: `Anda baru menyelesaikan ${completedCount} dari ${lessons.length} materi pembelajaran. Selesaikan semua materi terlebih dahulu.`,
      };
    }

    // 2. Cek kuis
    const quiz = await quizService.getQuizByCourseId(courseId);
    if (!quiz) {
      return { eligible: true, bestScore: 100 };
    }

    const attempts = await quizService.getUserAttempts(userId);
    const courseAttempts = attempts.filter((a) => a.quiz_id === quiz.id || a.course_id === courseId);
    const passedAttempt = courseAttempts.find((a) => a.passed);

    if (!passedAttempt) {
      return {
        eligible: false,
        reason: `Anda belum lulus kuis evaluasi kursus ini (Batas KKM: ${quiz.passing_score}). Ikuti kuis dan capai nilai kelulusan.`,
      };
    }

    // Ambil skor tertinggi
    const bestScore = Math.max(...courseAttempts.filter((a) => a.passed).map((a) => a.score));

    return {
      eligible: true,
      bestScore,
    };
  },

  // Terbitkan sertifikat jika syarat terpenuhi
  async issueCertificate(
    userId: string,
    courseId: string,
    recipientName: string,
    courseTitle: string
  ): Promise<{ certificate: Certificate | null; error?: string }> {
    const eligibility = await this.checkEligibility(userId, courseId);
    if (!eligibility.eligible) {
      return { certificate: null, error: eligibility.reason };
    }

    // Cek apakah sudah ada sertifikat sebelumnya
    const existing = await this.getCertificateByUserAndCourse(userId, courseId);
    if (existing) {
      return { certificate: existing };
    }

    const certNumber = generateCertificateNumber();
    const hash = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    const newCert: Certificate = {
      id: `cert-${Date.now()}`,
      certificate_number: certNumber,
      user_id: userId,
      course_id: courseId,
      score: eligibility.bestScore || 80,
      issued_at: new Date().toISOString(),
      verification_hash: hash,
      recipient_name: recipientName,
      course_title: courseTitle,
    };

    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('certificates').insert(newCert).select().single();
      if (!error && data) return { certificate: data };
    }

    const certs = getStoredCertificates();
    certs.push(newCert);
    localStorage.setItem(LOCAL_CERTS_KEY, JSON.stringify(certs));

    return { certificate: newCert };
  },

  // Ambil sertifikat berdasarkan User dan Course
  async getCertificateByUserAndCourse(userId: string, courseId: string): Promise<Certificate | null> {
    if (isSupabaseConfigured) {
      const { data } = await supabase
        .from('certificates')
        .select('*')
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .maybeSingle();
      if (data) return data;
    }

    const certs = getStoredCertificates();
    return certs.find((c) => c.user_id === userId && c.course_id === courseId) || null;
  },

  // Ambil seluruh sertifikat milik user
  async getUserCertificates(userId: string): Promise<Certificate[]> {
    if (isSupabaseConfigured) {
      const { data } = await supabase
        .from('certificates')
        .select('*, courses(title)')
        .eq('user_id', userId)
        .order('issued_at', { ascending: false });

      if (data) {
        return data.map((d: any) => ({
          ...d,
          course_title: d.courses?.title,
        }));
      }
    }

    const certs = getStoredCertificates();
    return certs.filter((c) => c.user_id === userId);
  },

  // Verifikasi sertifikat publik (Berdasarkan nomor sertifikat atau id)
  async verifyCertificate(certNumberOrId: string): Promise<Certificate | null> {
    if (isSupabaseConfigured) {
      const { data } = await supabase
        .from('certificates')
        .select('*, profiles(full_name), courses(title)')
        .or(`id.eq.${certNumberOrId},certificate_number.eq.${certNumberOrId}`)
        .maybeSingle();

      if (data) {
        return {
          ...data,
          recipient_name: data.profiles?.full_name,
          course_title: data.courses?.title,
        };
      }
    }

    const certs = getStoredCertificates();
    return (
      certs.find(
        (c) =>
          c.id === certNumberOrId ||
          c.certificate_number.toLowerCase() === certNumberOrId.toLowerCase()
      ) || null
    );
  },
};
