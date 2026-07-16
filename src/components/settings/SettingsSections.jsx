import { Link } from 'react-router-dom';
import { ShieldCheck, SlidersHorizontal, Laptop, Smartphone, Download, AlertTriangle, ChevronRight } from 'lucide-react';

function getInitials(name) {
  if (!name) return 'MC';

  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

export function IdentityCard({ profile }) {
  if (!profile) return null;
  return (
    <div className="flex-1 bg-white border border-auth-card rounded-xl p-6 flex items-center gap-6 relative overflow-hidden">
      <span className="size-24 rounded-full bg-dash-primary/10 border-4 border-[#eceef0] shrink-0 flex items-center justify-center text-2xl font-semibold text-dash-primary">
        {getInitials(profile.alias)}
      </span>
      <div className="flex flex-col gap-1">
        <h2 className="text-[22px] leading-8 font-semibold tracking-[-0.22px] text-dash-text">{profile.alias}</h2>
        <p className="text-dash-muted text-base">{profile.subtitle}</p>
        <div className="flex gap-2 pt-2">
          <span className="flex items-center gap-1.5 rounded-full bg-dash-success/10 px-2 py-0.5 text-[11px] text-dash-success">
            <span className="size-1.5 rounded-full bg-dash-success" /> Status: Anonim Aktif
          </span>
          <span className="rounded-full bg-dash-primary/10 px-2 py-0.5 text-[11px] text-dash-primary">ID: {profile.anonymousId}</span>
        </div>
      </div>
    </div>
  );
}

export function WellbeingCard({ profile }) {
  if (!profile) return null;
  return (
    <div className="w-80 shrink-0 bg-white border border-auth-card rounded-xl p-6 flex flex-col justify-between">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-base text-dash-muted">Skor Kesejahteraan</span>
          <span className="text-base text-dash-primary">{profile.wellbeingScore}/100</span>
        </div>
        <div className="h-2 rounded-full bg-[#eceef0]">
          <div className="h-2 rounded-full bg-dash-primary" style={{ width: `${profile.wellbeingScore}%` }} />
        </div>
        <p className="text-xs text-dash-muted">{profile.wellbeingNote}</p>
      </div>
      <Link
        to="/mood-history"
        className="mt-6 flex items-center justify-center rounded-lg border border-auth-card bg-[#f2f4f6] py-2.5 text-sm font-medium text-dash-primary hover:bg-[#e2e6ea] transition-colors"
      >
        Lihat Laporan Lengkap
      </Link>
    </div>
  );
}

function ToggleRow({ label, description, enabled, last }) {
  return (
    <div className={`flex items-center justify-between px-6 py-5 ${!last ? 'border-b border-auth-card' : ''}`}>
      <div>
        <p className="text-base text-dash-text">{label}</p>
        <p className="text-base text-dash-muted">{description}</p>
      </div>
      <span className={`w-10 h-5 rounded-full flex items-center px-0.5 shrink-0 ${enabled ? 'bg-dash-primary justify-end' : 'bg-[#eceef0] justify-start'}`}>
        <span className="size-4 rounded-full bg-white" />
      </span>
    </div>
  );
}

export function PrivacySection({ settings }) {
  if (!settings?.length) return null;
  return (
    <div className="bg-white border border-auth-card rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-auth-card flex items-center gap-2">
        <ShieldCheck size={16} className="text-dash-text" />
        <p className="text-base text-dash-text">Privasi & Keamanan</p>
      </div>
      {settings.map((s, i) => (
        <ToggleRow key={s.id} {...s} last={i === settings.length - 1} />
      ))}
    </div>
  );
}

export function AppPreferencesSection({ settings }) {
  if (!settings?.length) return null;
  return (
    <div className="bg-white border border-auth-card rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-auth-card flex items-center gap-2">
        <SlidersHorizontal size={15} className="text-dash-text" />
        <p className="text-base text-dash-text">Preferensi Aplikasi</p>
      </div>
      {settings.map((s, i) => (
        <div key={s.id} className={`flex items-center justify-between px-6 py-5 ${i !== settings.length - 1 ? 'border-b border-auth-card' : ''}`}>
          <div>
            <p className="text-base text-dash-text">{s.label}</p>
            <p className="text-base text-dash-muted">{s.description}</p>
          </div>
          {s.type === 'toggle' && (
            <span className={`w-10 h-5 rounded-full flex items-center px-0.5 shrink-0 ${s.enabled ? 'bg-dash-primary justify-end' : 'bg-[#eceef0] justify-start'}`}>
              <span className="size-4 rounded-full bg-white" />
            </span>
          )}
          {s.type === 'select' && (
            <span className="rounded-lg bg-[#f2f4f6] px-3 py-1.5 text-[13px] text-dash-text">{s.value}</span>
          )}
          {s.type === 'button' && (
            <button type="button" className="rounded-lg bg-[#eceef0] p-2"><SlidersHorizontal size={18} className="text-dash-muted" /></button>
          )}
        </div>
      ))}
    </div>
  );
}

const DEVICE_ICONS = { 'MacBook Pro - Safari': Laptop, 'iPhone 13 - App': Smartphone };

import { useNavigate } from 'react-router-dom';
import { logout } from '../../services/authService.js';

export function SessionManagementCard({ sessions }) {
  const navigate = useNavigate();

  const handleGlobalLogout = async () => {
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (!sessions?.length) return null;
  return (
    <div className="bg-white border border-auth-card rounded-xl p-6 flex flex-col gap-4">
      <p className="text-base text-dash-text">Sesi Aktif</p>
      <div className="flex flex-col gap-4">
        {sessions.map((s) => {
          const Icon = DEVICE_ICONS[s.device] || Laptop;
          return (
            <div key={s.id} className="flex items-center gap-3">
              <span className="size-10 rounded-lg bg-dash-primary/5 flex items-center justify-center shrink-0">
                <Icon size={18} className="text-dash-primary" />
              </span>
              <div>
                <p className="text-base font-semibold text-dash-text">{s.device}</p>
                <p className="text-[11px] text-dash-muted">{s.location}</p>
              </div>
            </div>
          );
        })}
      </div>
      <button 
        type="button" 
        onClick={handleGlobalLogout}
        className="text-dash-danger text-base pt-2 hover:opacity-80 transition-opacity text-left"
      >
        Keluar dari Semua Perangkat
      </button>
    </div>
  );
}

export function DangerZoneCard() {
  return (
    <div className="bg-white border border-auth-card rounded-xl overflow-hidden">
      <div className="bg-[#fef2f2]/30 px-6 py-4 border-b border-auth-card flex items-center gap-2">
        <AlertTriangle size={16} className="text-dash-danger" />
        <p className="text-base text-dash-danger">Zona Berbahaya</p>
      </div>
      <div className="p-6 flex flex-col gap-4">
        <button type="button" className="flex items-center justify-between text-base text-dash-text">
          Unduh Seluruh Data Saya <Download size={16} />
        </button>
        <div className="border-t border-auth-card pt-4 flex flex-col gap-3">
          <button type="button" className="rounded-lg border border-dash-danger py-2.5 text-base text-dash-danger">
            Hapus Akun Permanen
          </button>
          <p className="text-[11px] text-center text-dash-muted">
            Tindakan ini tidak dapat dibatalkan. Semua data riwayat kesehatan Anda akan dihapus selamanya.
          </p>
        </div>
      </div>
    </div>
  );
}

export function SupportFooter() {
  return (
    <div className="flex flex-col gap-2 items-center px-6">
      <p className="text-[11px] text-dash-muted">MindCare v2.4.1-stable</p>
      <div className="flex gap-4">
        <a href="#" className="text-[11px] text-dash-primary flex items-center">Kebijakan Privasi</a>
        <a href="#" className="text-[11px] text-dash-primary flex items-center">Syarat & Ketentuan <ChevronRight size={10} /></a>
      </div>
    </div>
  );
}
