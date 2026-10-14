import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Certificate } from '../types';
import { certificateService } from '../services/certificateService';
import { CertificateCard } from '../components/certificate/CertificateCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ArrowLeft, ShieldCheck, AlertCircle } from 'lucide-react';

export const CertificateDetail: React.FC = () => {
  const { certificateId } = useParams<{ certificateId: string }>();
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadCert() {
      if (!certificateId) return;
      setLoading(true);
      try {
        const found = await certificateService.verifyCertificate(certificateId);
        setCertificate(found);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadCert();
  }, [certificateId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <LoadingSpinner message="Memverifikasi keaslian nomor sertifikat K3..." />
      </div>
    );
  }

  if (!certificate) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-red-200 text-center shadow-sm">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-800 mb-2">Sertifikat Tidak Ditemukan</h2>
          <p className="text-xs text-slate-500 mb-6 leading-relaxed">
            Nomor sertifikat atau ID yang Anda tuju tidak terdaftar pada basis data terverifikasi K3Learn.
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 text-white font-bold rounded-xl text-xs"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Navigation Breadcrumb (Hidden during print) */}
        <div className="flex items-center justify-between print:hidden">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard
          </Link>

          <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> Sertifikat Sah & Terverifikasi
          </span>
        </div>

        {/* Certificate Render Frame */}
        <CertificateCard certificate={certificate} />
      </div>
    </div>
  );
};
