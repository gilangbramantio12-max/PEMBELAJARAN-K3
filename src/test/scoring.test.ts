import { describe, it, expect } from 'vitest';
import { calculateQuizScore, formatDuration, generateCertificateNumber } from '../lib/scoring';

describe('Unit Test: Sistem Skoring Otomatis K3Learn', () => {
  it('harus menghitung nilai sesuai spesifikasi prompt: (16 / 20) * 100 = 80 (LULUS)', () => {
    // Sesuai contoh pada spesifikasi:
    // Total soal: 20, Benar: 16, Salah: 4, Nilai: 80, KKM: 75 -> LULUS
    const result = calculateQuizScore(16, 20, 75);

    expect(result.score).toBe(80);
    expect(result.correctCount).toBe(16);
    expect(result.incorrectCount).toBe(4);
    expect(result.totalQuestions).toBe(20);
    expect(result.passed).toBe(true);
  });

  it('harus menandai BELUM LULUS jika nilai di bawah KKM', () => {
    // Total 20, Benar 14, Nilai 70, KKM 75 -> BELUM LULUS
    const result = calculateQuizScore(14, 20, 75);

    expect(result.score).toBe(70);
    expect(result.correctCount).toBe(14);
    expect(result.incorrectCount).toBe(6);
    expect(result.passed).toBe(false);
  });

  it('harus menangani nilai sempurna 100%', () => {
    const result = calculateQuizScore(5, 5, 75);

    expect(result.score).toBe(100);
    expect(result.correctCount).toBe(5);
    expect(result.incorrectCount).toBe(0);
    expect(result.passed).toBe(true);
  });

  it('harus menangani nilai 0 (semua salah)', () => {
    const result = calculateQuizScore(0, 10, 75);

    expect(result.score).toBe(0);
    expect(result.correctCount).toBe(0);
    expect(result.incorrectCount).toBe(10);
    expect(result.passed).toBe(false);
  });

  it('harus membulatkan skor desimal secara akurat', () => {
    // 2 / 3 = 66.666... -> 66.67
    const result = calculateQuizScore(2, 3, 75);
    expect(result.score).toBe(66.67);
    expect(result.passed).toBe(false);
  });

  it('harus menangani kasus batas aman (total pertanyaan 0)', () => {
    const result = calculateQuizScore(0, 0, 75);
    expect(result.score).toBe(0);
    expect(result.passed).toBe(false);
  });

  it('harus memformat durasi pengerjaan kuis dengan benar', () => {
    expect(formatDuration(45)).toBe('45 detik');
    expect(formatDuration(120)).toBe('2 menit');
    expect(formatDuration(135)).toBe('2 m 15 s');
  });

  it('harus menghasilkan format nomor seri sertifikat K3 yang valid (K3L-YYYY-XXXXXX)', () => {
    const certNum = generateCertificateNumber();
    const currentYear = new Date().getFullYear();

    expect(certNum).toMatch(new RegExp(`^K3L-${currentYear}-[A-Z0-9]{6}$`));
  });
});
