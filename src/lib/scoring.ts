/**
 * Modul Perhitungan Skoring Otomatis K3Learn
 * Sesuai Spesifikasi:
 * Nilai = (Jumlah Jawaban Benar / Jumlah Soal) * 100
 */

export interface ScoringResult {
  score: number;
  correctCount: number;
  incorrectCount: number;
  totalQuestions: number;
  passed: boolean;
  percentage: number;
}

/**
 * Menghitung nilai kuis secara matematis
 * @param correctCount Jumlah jawaban benar
 * @param totalQuestions Jumlah total soal
 * @param passingScore Batas nilai kelulusan (KKM), default 75
 * @returns ScoringResult dengan nilai terstandarisasi dalam rentang 0-100
 */
export function calculateQuizScore(
  correctCount: number,
  totalQuestions: number,
  passingScore: number = 75
): ScoringResult {
  if (totalQuestions <= 0) {
    return {
      score: 0,
      correctCount: 0,
      incorrectCount: 0,
      totalQuestions: 0,
      passed: false,
      percentage: 0,
    };
  }

  // Sanitasi batas nilai agar tidak melebihi total soal atau negatif
  const safeCorrect = Math.max(0, Math.min(correctCount, totalQuestions));
  const rawScore = (safeCorrect / totalQuestions) * 100;
  
  // Bulatkan ke 2 desimal jika tidak genap, atau bilangan bulat jika tepat
  const score = Math.round(rawScore * 100) / 100;
  const incorrectCount = totalQuestions - safeCorrect;
  const passed = score >= passingScore;

  return {
    score,
    correctCount: safeCorrect,
    incorrectCount,
    totalQuestions,
    passed,
    percentage: score,
  };
}

/**
 * Format durasi pengerjaan dalam format 'Xm Ys' atau 'X menit Y detik'
 */
export function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return '0 detik';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs} detik`;
  if (secs === 0) return `${mins} menit`;
  return `${mins} m ${secs} s`;
}

/**
 * Generate nomor sertifikat unik K3Learn
 * Format: K3L-{TAHUN}-{RANDOM_HEX}
 */
export function generateCertificateNumber(): string {
  const year = new Date().getFullYear();
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `K3L-${year}-${randomPart}`;
}

/**
 * Format tanggal Indonesia
 */
export function formatDateIndo(dateStr: string | Date): string {
  const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}
