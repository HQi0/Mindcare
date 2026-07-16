import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, SlidersHorizontal, Laptop, Smartphone, Download, AlertTriangle, ChevronRight, Edit2, X, Camera } from 'lucide-react';

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

export function IdentityCard({ profile, onEditClick }) {
  if (!profile) return null;
  return (
    <div className="flex-1 bg-white border border-auth-card rounded-xl p-6 flex items-center gap-6 relative overflow-hidden">
      <button 
        type="button"
        onClick={onEditClick}
        className="absolute top-4 right-4 p-2 text-dash-muted hover:text-dash-primary hover:bg-dash-primary/5 rounded-lg transition-colors"
        title="Edit Profil"
      >
        <Edit2 size={18} />
      </button>
      {profile.avatar_url ? (
        <img src={profile.avatar_url} alt="Profile Avatar" className="size-24 rounded-full border-4 border-[#eceef0] shrink-0 object-cover" />
      ) : (
        <span className="size-24 rounded-full bg-dash-primary/10 border-4 border-[#eceef0] shrink-0 flex items-center justify-center text-2xl font-semibold text-dash-primary">
          {getInitials(profile.alias)}
        </span>
      )}
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

function ToggleRow({ label, description, enabled: initialEnabled, last }) {
  const [enabled, setEnabled] = useState(initialEnabled);

  return (
    <div 
      className={`flex items-center justify-between px-6 py-5 cursor-pointer hover:bg-gray-50 transition-colors ${!last ? 'border-b border-auth-card' : ''}`}
      onClick={() => setEnabled(!enabled)}
    >
      <div>
        <p className="text-base text-dash-text">{label}</p>
        <p className="text-base text-dash-muted">{description}</p>
      </div>
      <span className={`w-10 h-5 rounded-full flex items-center px-0.5 shrink-0 transition-colors duration-200 ${enabled ? 'bg-dash-primary justify-end' : 'bg-[#eceef0] justify-start'}`}>
        <span className="size-4 rounded-full bg-white shadow-sm" />
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
      {settings.map((s, i) => {
        if (s.type === 'select') {
          return (
            <div key={s.id} className={`flex items-center justify-between px-6 py-5 ${i !== settings.length - 1 ? 'border-b border-auth-card' : ''}`}>
              <div>
                <p className="text-base text-dash-text">{s.label}</p>
                <p className="text-base text-dash-muted">{s.description}</p>
              </div>
              <select 
                className="rounded-lg bg-[#f2f4f6] px-3 py-1.5 text-[13px] text-dash-text outline-none cursor-pointer hover:bg-[#e2e6ea] transition-colors border-none"
                defaultValue={s.value}
              >
                <option value="Bahasa Indonesia">Bahasa Indonesia</option>
                <option value="Bahasa Inggris">English</option>
              </select>
            </div>
          );
        }
        return <ToggleRow key={s.id} {...s} last={i === settings.length - 1} />;
      })}
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
          const isMobile = s.device?.includes('iOS') || s.device?.includes('Android');
          const Icon = isMobile ? Smartphone : Laptop;
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
        <div className="flex flex-col gap-3">
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

export function EditProfileModal({ profile, onClose, onSave, onChangePasswordClick }) {
  const [alias, setAlias] = useState(profile?.alias || '');
  const [subtitle, setSubtitle] = useState(profile?.subtitle || '');
  const [avatarPreview, setAvatarPreview] = useState(profile?.avatar_url || null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    await onSave(alias, subtitle, selectedFile);
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md overflow-hidden flex flex-col shadow-xl">
        <div className="px-6 py-4 border-b border-auth-card flex items-center justify-between">
          <h2 className="text-lg font-semibold text-dash-text">Edit Profil</h2>
          <button 
            type="button" 
            onClick={onClose}
            className="text-dash-muted hover:text-dash-text transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 flex flex-col gap-5 overflow-y-auto max-h-[70vh]">
          {/* Ubah Gambar Section */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" className="size-20 rounded-full border-4 border-[#eceef0] object-cover" />
              ) : (
                <span className="size-20 rounded-full bg-dash-primary/10 border-4 border-[#eceef0] flex items-center justify-center text-xl font-semibold text-dash-primary">
                  {getInitials(profile?.alias)}
                </span>
              )}
              <input 
                type="file" 
                ref={fileInputRef}
                accept="image/png, image/jpeg, image/jpg" 
                className="hidden" 
                onChange={handleFileChange}
              />
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-1.5 bg-white border border-auth-card rounded-full text-dash-primary hover:bg-gray-50 shadow-sm transition-colors"
                title="Ganti Foto Profil"
              >
                <Camera size={14} />
              </button>
            </div>
            <p className="text-[11px] text-dash-muted">Format yang didukung: JPG, PNG</p>
          </div>

          {/* Form Fields */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-dash-text">Username</label>
              <input 
                type="text" 
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                placeholder="Masukkan username baru"
                className="w-full rounded-lg border border-auth-card px-4 py-2.5 text-base text-dash-text outline-none focus:border-dash-primary transition-colors"
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-dash-text">Email</label>
              <input 
                type="text" 
                value={subtitle}
                readOnly
                className="w-full rounded-lg border border-auth-card px-4 py-2.5 text-base text-dash-muted bg-gray-50 outline-none cursor-not-allowed"
              />
            </div>

            <div className="flex flex-col gap-1.5 pt-2 border-t border-auth-card">
              <label className="text-sm font-medium text-dash-text">Keamanan Akun</label>
              <button 
                type="button"
                onClick={onChangePasswordClick}
                className="text-dash-primary text-sm font-medium hover:underline text-left"
              >
                Ubah Kata Sandi
              </button>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-auth-card flex justify-end gap-3">
          <button 
            type="button" 
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium text-dash-text hover:bg-gray-200 transition-colors"
          >
            Batal
          </button>
          <button 
            type="button" 
            onClick={handleSave}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg bg-dash-primary text-sm font-medium text-white hover:bg-dash-primary/90 transition-colors shadow-sm disabled:opacity-50"
          >
            {isLoading ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function ChangePasswordModal({ onClose, onSave }) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (newPassword !== confirmPassword) {
      setError('Password baru dan konfirmasi tidak cocok.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password baru minimal 6 karakter.');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      await onSave(oldPassword, newPassword);
    } catch (err) {
      setError(err.message || 'Gagal mengubah password');
    }
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl w-full max-w-sm overflow-hidden flex flex-col shadow-xl">
        <div className="px-6 py-4 border-b border-auth-card flex items-center justify-between">
          <h2 className="text-lg font-semibold text-dash-text">Ubah Kata Sandi</h2>
          <button 
            type="button" 
            onClick={onClose}
            className="text-dash-muted hover:text-dash-text transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 flex flex-col gap-4">
          {error && (
            <div className="p-3 bg-[#fef2f2] text-dash-danger text-sm rounded-lg border border-[#fef2f2]/50">
              {error}
            </div>
          )}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-dash-text">Password Saat Ini</label>
            <input 
              type="password" 
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full rounded-lg border border-auth-card px-4 py-2 text-base text-dash-text outline-none focus:border-dash-primary transition-colors"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-dash-text">Password Baru</label>
            <input 
              type="password" 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-lg border border-auth-card px-4 py-2 text-base text-dash-text outline-none focus:border-dash-primary transition-colors"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-dash-text">Konfirmasi Password Baru</label>
            <input 
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-lg border border-auth-card px-4 py-2 text-base text-dash-text outline-none focus:border-dash-primary transition-colors"
            />
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-auth-card flex justify-end gap-3">
          <button 
            type="button" 
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium text-dash-text hover:bg-gray-200 transition-colors"
          >
            Batal
          </button>
          <button 
            type="button" 
            onClick={handleSave}
            disabled={isLoading || !oldPassword || !newPassword || !confirmPassword}
            className="px-4 py-2 rounded-lg bg-dash-primary text-sm font-medium text-white hover:bg-dash-primary/90 transition-colors shadow-sm disabled:opacity-50"
          >
            {isLoading ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </div>
    </div>
  );
}
