import { useNavigate } from 'react-router-dom';
import { loginAsGuest } from '../../services/authService.js';

export default function SocialAuthOptions() {
  const navigate = useNavigate();

  const handleGuestLogin = async () => {
    try {
      await loginAsGuest();
      navigate('/self-assessment');
    } catch (err) {
      alert('Gagal masuk sebagai Tamu. Silakan coba lagi.');
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="relative flex items-center justify-center w-full">
        <div className="border-t border-auth-card w-full" />
        <span className="absolute bg-white px-4 text-[11px] font-medium tracking-[1.1px] uppercase text-auth-label">
          Atau
        </span>
      </div>

      <div className="flex flex-col gap-3 w-full">
        <button
          type="button"
          onClick={handleGuestLogin}
          className="flex items-center justify-center gap-2 w-full rounded-lg px-4 py-2.5 text-[13.5px] font-medium text-auth-primary hover:bg-auth-input transition-colors"
        >
          Mode Tamu (Anonim)
        </button>
      </div>
    </div>
  );
}
