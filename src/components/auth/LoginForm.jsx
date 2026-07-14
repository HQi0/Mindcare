import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import AuthInput from '../common/AuthInput.jsx';
import SocialAuthOptions from './SocialAuthOptions.jsx';
import { login } from '../../services/authService.js';

export default function LoginForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(form);
      navigate('/dashboard');
    } catch (err) {
      setError('Email atau kata sandi salah. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 w-full">
      <div className="flex flex-col gap-5 w-full">
        <AuthInput
          label="Email"
          type="email"
          name="email"
          placeholder="nama@email.com"
          value={form.email}
          onChange={handleChange}
          required
        />

        <div className="flex flex-col gap-1.5 w-full">
          <div className="flex items-center justify-between">
            <label className="text-[13px] font-medium text-auth-muted">Kata Sandi</label>
            <Link to="/forgot-password" className="text-[11px] font-medium text-auth-primary">
              Lupa Sandi?
            </Link>
          </div>
          <AuthInput
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
        </div>

        {error && <p className="text-xs text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-auth-primary text-white text-sm font-semibold rounded-lg py-3 drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] disabled:opacity-60 transition-opacity"
        >
          {loading ? 'Memproses...' : 'Masuk ke Akun'}
        </button>
      </div>

      <SocialAuthOptions />
    </form>
  );
}
