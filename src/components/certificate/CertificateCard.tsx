import React, { useRef } from 'react';
import { Certificate } from '../../types';
import { formatDateIndo } from '../../lib/scoring';
import { ShieldCheck, Award, Printer, Download, CheckCircle, ExternalLink } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface CertificateCardProps {
  certificate: Certificate;
  onPrint?: () => void;
}

export const CertificateCard: React.FC<CertificateCardProps> = ({ certificate }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { success } = useToast();

  const handlePrint = () => {
    window.print();
    success('Mempersiapkan dokumen sertifikat untuk dicetak atau disimpan sebagai PDF...');
  };

  return (
    <div className="flex flex-col items-center gap-6 max-w-4xl mx-auto w-full">
      {/* Action Buttons (Hidden when printing via CSS @media print) */}
      <div className="flex flex-wrap items-center justify-between gap-4 w-full print:hidden bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Award className="w-5 h-5 text-brand-600" />
          <span>Sertifikat Digital Terverifikasi No: <strong>{certificate.certificate_number}</strong></span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Cetak / Simpan PDF
          </button>
        </div>
      </div>

      {/* Main Printable Certificate Frame */}
      <div
        ref={cardRef}
        id="printable-certificate"
        className="w-full bg-white border-8 border-double border-navy-900 rounded-2xl p-8 sm:p-12 relative shadow-xl overflow-hidden print:shadow-none print:border-8 print:p-8 print:m-0 text-center"
      >
        {/* Subtle Background Safety Seal Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
          <ShieldCheck className="w-96 h-96 text-navy-900" />
        </div>

        {/* Top Header & Emblem */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            {/* Safety Cross Icon */}
            <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shadow-md">
              <span className="text-2xl font-black">✚</span>
            </div>
            <div className="text-left">
              <h2 className="text-xl sm:text-2xl font-black tracking-wider text-navy-900 uppercase">
                K3Learn Indonesia
              </h2>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest">
                Pusat Pembelajaran Keselamatan & Kesehatan Kerja
              </p>
            </div>
          </div>

          <div className="w-32 h-1 bg-gradient-to-r from-brand-600 via-safety-orange to-emerald-600 rounded-full mb-6" />

          <p className="text-xs sm:text-sm font-bold text-brand-700 uppercase tracking-widest mb-1">
            SERTIFIKAT KELULUSAN KURSUS
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 mb-6 tracking-tight">
            CERTIFICATE OF COMPLETION
          </h1>

          <p className="text-sm text-slate-500 italic mb-2">Diberikan secara resmi kepada:</p>
          
          {/* Recipient Full Name */}
          <div className="text-2xl sm:text-4xl font-black text-brand-900 tracking-tight mb-2 border-b-2 border-slate-300 pb-2 px-8 inline-block max-w-xl">
            {certificate.recipient_name || 'Peserta Terdaftar K3'}
          </div>

          <p className="text-sm text-slate-600 max-w-xl mt-4 mb-2 leading-relaxed">
            Atas keberhasilannya menyelesaikan seluruh rangkaian modul materi pembelajaran dan dinyatakan <strong>LULUS</strong> evaluasi kuis uji kompetensi pada kursus:
          </p>

          {/* Course Title */}
          <h3 className="text-lg sm:text-2xl font-bold text-navy-900 px-6 py-2 bg-blue-50/80 rounded-xl border border-blue-200/80 my-3 max-w-2xl">
            {certificate.course_title || 'Kursus Standar Keselamatan Kerja (K3)'}
          </h3>

          {/* Score Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 font-semibold text-xs sm:text-sm mb-8">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Nilai Kelulusan: <strong>{certificate.score} / 100</strong> (Sangat Memuaskan)</span>
          </div>

          {/* Footer Grid: Date, QR Hash, Signature */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-6 items-end pt-6 border-t border-slate-200 text-left">
            {/* Serial & Date */}
            <div className="space-y-1 text-xs text-slate-600">
              <div>No. Seri: <strong className="text-slate-800 font-mono">{certificate.certificate_number}</strong></div>
              <div>Tanggal Terbit: <strong className="text-slate-800">{formatDateIndo(certificate.issued_at)}</strong></div>
              <div>Kode Verifikasi: <span className="font-mono text-[10px] text-slate-500 break-all">{certificate.verification_hash.substring(0, 16)}</span></div>
            </div>

            {/* Security Verification Stamp */}
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-emerald-600 flex flex-col items-center justify-center p-1 bg-emerald-50/50">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
                <span className="text-[8px] font-black uppercase text-emerald-800 tracking-tighter">
                  TERVERIFIKASI
                </span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1">Sistem K3Learn</span>
            </div>

            {/* Signature */}
            <div className="flex flex-col items-end text-right">
              <div className="w-36 border-b border-slate-400 pb-1 mb-1 text-center">
                <span className="font-serif italic text-lg text-slate-700">Hendra Wijaya</span>
              </div>
              <div className="text-xs font-bold text-slate-800">Ir. Hendra Wijaya, M.KKK</div>
              <div className="text-[10px] text-slate-500">Direktur Akademik K3Learn</div>
            </div>
          </div>

          {/* Legal Disclaimer Sub-banner */}
          <div className="w-full mt-8 pt-4 border-t border-slate-100 text-[10px] text-slate-400 leading-normal text-center">
            * Sertifikat ini diterbitkan secara elektronik oleh platform K3Learn sebagai bukti telah menyelesaikan modul edukasi daring dan kuis uji pemahaman. Dokumen ini bukan merupakan pengganti sertifikasi resmi personil K3 Kemenaker RI atau lisensi BNSP.
          </div>
        </div>
      </div>
    </div>
  );
};
