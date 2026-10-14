import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, PhoneCall, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-navy-900 text-slate-300 pt-14 pb-10 border-t border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand & Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-md">
                <ShieldCheck className="w-5 h-5 text-emerald-300" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                K3<span className="text-brand-500">Learn</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Platform pembelajaran daring mandiri Keselamatan dan Kesehatan Kerja (K3) berbasis kompetensi. Mendorong terwujudnya budaya kerja aman, sehat, dan bebas kecelakaan (*Zero Accident*).
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Selaras UU No. 1/1970 & PP No. 50/2012</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Kategori Kursus
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link to="/courses?category=Dasar-dasar+K3" className="hover:text-white transition-colors">
                  Dasar-dasar K3
                </Link>
              </li>
              <li>
                <Link to="/courses?category=Penggunaan+Alat+Pelindung+Diri+(APD)" className="hover:text-white transition-colors">
                  Alat Pelindung Diri (APD)
                </Link>
              </li>
              <li>
                <Link to="/courses?category=Pertolongan+Pertama+pada+Kecelakaan+(P3K)" className="hover:text-white transition-colors">
                  P3K di Tempat Kerja
                </Link>
              </li>
              <li>
                <Link to="/courses?category=Keselamatan+dan+Pencegahan+Kebakaran" className="hover:text-white transition-colors">
                  Pencegahan Kebakaran
                </Link>
              </li>
              <li>
                <Link to="/courses?category=Identifikasi+Bahaya+dan+Penilaian+Risiko" className="hover:text-white transition-colors">
                  HIRADC / IBPR
                </Link>
              </li>
              <li>
                <Link to="/courses?category=Ergonomi+dan+Keselamatan+Lingkungan+Kerja" className="hover:text-white transition-colors">
                  Ergonomi & Lingkungan Kerja
                </Link>
              </li>
            </ul>
          </div>

          {/* Emergency Contacts */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-safety-orange" />
              Hotline Tanggap Darurat
            </h4>
            <p className="text-xs text-slate-400 mb-3">
              Nomor panggilan darurat nasional Indonesia saat terjadi insiden di tempat kerja:
            </p>
            <div className="space-y-2 text-sm font-medium">
              <div className="flex justify-between items-center p-2 rounded-lg bg-navy-800/80 border border-navy-700">
                <span className="text-slate-300">Medis & Ambulans</span>
                <span className="font-bold text-emerald-400">118 / 119</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-navy-800/80 border border-navy-700">
                <span className="text-slate-300">Pemadam Kebakaran</span>
                <span className="font-bold text-safety-orange">113</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-navy-800/80 border border-navy-700">
                <span className="text-slate-300">Layanan Darurat Terpadu</span>
                <span className="font-bold text-brand-400">112</span>
              </div>
            </div>
          </div>

          {/* Important Legal Disclaimer Banner */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Keterangan Resmi
            </h4>
            <div className="p-3.5 rounded-xl bg-navy-800/90 border border-amber-500/30 text-xs text-slate-300 leading-relaxed space-y-2">
              <p>
                Platform <strong>K3Learn</strong> merupakan media pembelajaran daring edukasi mandiri untuk meningkatkan kesadaran (*awareness*) dan kompetensi dasar.
              </p>
              <p className="text-slate-400 font-normal">
                Sertifikat penyelesaian dari website ini <span className="text-amber-300 font-semibold">tidak otomatis menggantikan</span> sertifikasi personil resmi K3 Kemenaker RI atau sertifikasi kompetensi BNSP yang mewajibkan pelatihan tatap muka resmi.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-navy-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} K3Learn Platform. Hak Cipta Dilindungi Undang-Undang.</p>
          <div className="flex items-center gap-6">
            <span>Standar Keselamatan Kerja ISO 45001:2018</span>
            <span>Versi 1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
