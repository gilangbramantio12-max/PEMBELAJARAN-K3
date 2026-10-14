import { describe, it, expect, beforeEach } from 'vitest';
import { quizService } from '../services/quizService';
import { courseService } from '../services/courseService';
import { certificateService } from '../services/certificateService';

describe('Integration Test: Alur Kuis & Keamanan Kunci Jawaban K3Learn', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('keamanan kunci: getQuestionsForParticipant TIDAK BOLEH membocorkan is_correct atau explanation kepada browser', async () => {
    const questions = await quizService.getQuestionsForParticipant('q1');

    expect(questions.length).toBeGreaterThan(0);

    for (const q of questions) {
      // Explanation harus undefined selama pengerjaan
      expect(q.explanation).toBeUndefined();

      // Setiap opsi jawaban TIDAK boleh memiliki properti is_correct
      for (const opt of q.options) {
        expect(opt.is_correct).toBeUndefined();
      }
    }
  });

  it('alur penilaian otomatis: submit kuis dengan 5 jawaban benar menghasilkan nilai 100 dan status LULUS', async () => {
    const userId = 'test-user-1';
    const quizId = 'q1';
    const courseId = 'c1-dasar-k3';

    // Jawaban benar untuk q1:
    // q1-1 -> opt1-1a
    // q1-2 -> opt1-2b
    // q1-3 -> opt1-3b
    // q1-4 -> opt1-4b
    // q1-5 -> opt1-5b
    const correctResponses = {
      'q1-1': 'opt1-1a',
      'q1-2': 'opt1-2b',
      'q1-3': 'opt1-3b',
      'q1-4': 'opt1-4b',
      'q1-5': 'opt1-5b',
    };

    const submission = await quizService.submitQuiz(
      userId,
      quizId,
      courseId,
      correctResponses,
      120, // 2 menit
      75   // KKM
    );

    expect(submission.passed).toBe(true);
    expect(submission.score).toBe(100);
    expect(submission.attempt.attempt_number).toBe(1);
    expect(submission.attempt.correct_count).toBe(5);

    // Setelah submit, review pengerjaan harus menampilkan pembahasan dan kunci
    const review = await quizService.getAttemptReview(submission.attempt.id, quizId);
    expect(review).not.toBeNull();
    expect(review?.questions[0].explanation).toBeDefined();
    expect(review?.questions[0].correct_option_id).toBe('opt1-1a');
  });

  it('alur penilaian otomatis: submit kuis dengan nilai di bawah KKM menghasilkan status BELUM LULUS', async () => {
    const userId = 'test-user-2';
    const quizId = 'q1';
    const courseId = 'c1-dasar-k3';

    // Hanya 2 jawaban benar dari 5 soal (Nilai = 40%)
    const partialResponses = {
      'q1-1': 'opt1-1a', // benar
      'q1-2': 'opt1-2b', // benar
      'q1-3': 'opt1-3a', // salah
      'q1-4': 'opt1-4a', // salah
      'q1-5': 'opt1-5a', // salah
    };

    const submission = await quizService.submitQuiz(
      userId,
      quizId,
      courseId,
      partialResponses,
      90,
      75
    );

    expect(submission.score).toBe(40);
    expect(submission.passed).toBe(false);
  });

  it('validasi sertifikat: tidak boleh menerbitkan sertifikat jika belum menyelesaikan materi atau belum lulus', async () => {
    const userId = 'test-user-3';
    const courseId = 'c1-dasar-k3';

    // Belum menyelesaikan materi
    const check1 = await certificateService.checkEligibility(userId, courseId);
    expect(check1.eligible).toBe(false);

    // Selesaikan semua materi kursus c1
    const lessons = await courseService.getLessonsByCourseId(courseId);
    for (const l of lessons) {
      await courseService.markLessonCompleted(userId, courseId, l.id);
    }

    // Materi sudah selesai, tapi kuis belum dikerjakan / belum lulus
    const check2 = await certificateService.checkEligibility(userId, courseId);
    expect(check2.eligible).toBe(false);

    // Kerjakan kuis dan lulus
    const correctResponses = {
      'q1-1': 'opt1-1a',
      'q1-2': 'opt1-2b',
      'q1-3': 'opt1-3b',
      'q1-4': 'opt1-4b',
      'q1-5': 'opt1-5b',
    };
    await quizService.submitQuiz(userId, 'q1', courseId, correctResponses, 100, 75);

    // Sekarang harus eligible!
    const check3 = await certificateService.checkEligibility(userId, courseId);
    expect(check3.eligible).toBe(true);

    // Terbitkan sertifikat
    const certResult = await certificateService.issueCertificate(
      userId,
      courseId,
      'Siswa Uji',
      'Dasar-dasar K3'
    );
    expect(certResult.certificate).not.toBeNull();
    expect(certResult.certificate?.certificate_number).toMatch(/^K3L-/);
  });
});
