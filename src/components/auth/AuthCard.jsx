import { Link } from 'react-router-dom';
import { HeartHandshake, ArrowLeft } from 'lucide-react';

/**
 * AuthCard adalah shell (bingkai) yang dipakai bersama oleh
 * halaman Login dan Register: logo header, tab switcher, area form
 * (children), dan footer privacy notice.
 *
 * mode: 'login' | 'register' -> menentukan tab mana yang aktif
 */
export default function AuthCard({ mode, children }) {
  return (
    <div className="bg-white border border-auth-card rounded-xl overflow-hidden shadow-[0px_4px_20px_0px_rgba(15,45,107,0.04)] w-full relative">
      <Link
        to="/"
        className="absolute top-4 left-4 text-auth-muted hover:text-auth-primary transition-colors"
        title="Kembali ke Beranda"
      >
        <ArrowLeft size={18} />
      </Link>

      {/* Header / Logo Area */}
      <div className="flex flex-col items-center gap-1 pt-8 pb-4 px-8">
        <span className="flex items-center justify-center w-12 py-1.5 rounded-lg bg-auth-primary/10 text-auth-primary">
          <HeartHandshake size={20} />
        </span>
        <h1 className="pt-2 text-[22px] leading-8 font-semibold tracking-[-0.55px] text-auth-primary text-center">
          MindCare
        </h1>
        <p className="text-[13px] leading-[18px] text-auth-muted text-center">
          Solusi kesehatan mental untuk perjalanan akademik Anda
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-auth-card px-8">
        <div className="flex items-start justify-center -mb-px">
          <Link
            to="/login"
            className={`flex-1 text-center pt-4 pb-[18px] text-sm font-semibold border-b-2 transition-colors ${
              mode === 'login'
                ? 'text-auth-primary border-auth-primary'
                : 'text-auth-muted border-transparent'
            }`}
          >
            Masuk
          </Link>
          <Link
            to="/register"
            className={`flex-1 text-center pt-[16.5px] pb-[17.5px] text-sm font-semibold border-b-2 transition-colors ${
              mode === 'register'
                ? 'text-auth-primary border-auth-primary'
                : 'text-auth-muted border-transparent'
            }`}
          >
            Daftar
          </Link>
        </div>
      </div>

      {/* Form Canvas */}
      <div className="p-8 flex flex-col gap-8">{children}</div>

      {/* Footer - Privacy Notice */}
      <div className="bg-auth-input border-t border-auth-card px-8 pt-[21px] pb-5">
        <p className="text-xs leading-[19.5px] text-center text-auth-muted">
          Dengan melanjutkan, Anda menyetujui{' '}
          <a href="#" className="text-auth-primary">
            Ketentuan Layanan
          </a>{' '}
          dan{' '}
          <a href="#" className="text-auth-primary">
            Kebijakan Privasi
          </a>{' '}
          kami. Privasi data Anda adalah prioritas kami.
        </p>
      </div>
    </div>
  );
}
