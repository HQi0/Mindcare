import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import AuthInput from '../common/AuthInput.jsx';
import SocialAuthOptions from './SocialAuthOptions.jsx';
import { register, setStoredAuth } from '../../services/authService.js';

// NOTE: Desain Figma hanya menyediakan tab "Daftar" tanpa detail
// field, jadi form ini dibuat mengikuti gaya visual Login Form
// (Input, Button, spacing) supaya konsisten satu design system.
export default function RegisterForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (form.password !== form.confirmPassword) {
      setError('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    setLoading(true);
    try {
      const result = await register(form);
      
      // Jika konfigurasi Supabase memerlukan konfirmasi email (Default Supabase)
      if (result.token === 'email_confirmation_required') {
        setStoredAuth({ token: result.token, user: result.user });
        alert('Registrasi sukses! Silakan periksa kotak masuk email Anda untuk verifikasi akun sebelum masuk.');
        navigate('/login');
      } else {
        // Jika auto-login aktif langsung setelah daftar
        setStoredAuth({ token: result.token, user: result.user });
        navigate('/dashboard');
      }
    } catch (err) {
      // Menangkap pesan error spesifik (misal format email salah atau email sudah terdaftar)
      setError(err.message || 'Registrasi gagal. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 w-full">
      <div className="flex flex-col gap-5 w-full">
        <AuthInput
          label="Nama Lengkap"
          type="text"
          name="name"
          placeholder="Nama sesuai KTM"
          value={form.name}
          onChange={handleChange}
          required
        />

        <AuthInput
          label="Email"
          type="email"
          name="email"
          placeholder="nama@email.com"
          value={form.email}
          onChange={handleChange}
          required
        />

        <AuthInput
          label="Kata Sandi"
          type={showPassword ? 'text' : 'password'}
          name="password"
          placeholder="••••••••"
          value={form.password}
          onChange={handleChange}
          required
          rightSlot={
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="text-auth-label"
              aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
        />

        <AuthInput
          label="Konfirmasi Kata Sandi"
          type={showPassword ? 'text' : 'password'}
          name="confirmPassword"
          placeholder="••••••••"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />

        {error && <p className="text-xs text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-auth-primary text-white text-sm font-semibold rounded-lg py-3 drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] disabled:opacity-60 transition-opacity"
        >
          {loading ? 'Memproses...' : 'Daftar Akun'}
        </button>
      </div>

      <SocialAuthOptions />
    </form>
  );
}