import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar.jsx';
import DashboardTopbar from '../components/layout/DashboardTopbar.jsx';
import { Lock } from 'lucide-react';

/**
 * Layout bersama untuk seluruh halaman setelah login (Dashboard,
 * Pelacak Mood, Sumber Daya, dst). Sidebar & Topbar fixed, konten
 * discroll di area kanan dengan padding menyesuaikan lebar sidebar.
 */
export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  // Check if current user is guest
  const isGuest = localStorage.getItem('mindcare_guest') === 'true';

  // Allowed paths for guest: /self-assessment, its details, and /emergency-help
  const isAllowedPath = 
    path === '/self-assessment' || 
    path.startsWith('/self-assessment/') || 
    path === '/emergency-help';

  // Show lock modal if guest tries to access any other page
  const isLocked = isGuest && !isAllowedPath;

  const handleRegisterRedirect = () => {
    navigate('/register');
  };

  const handleAssessmentRedirect = () => {
    navigate('/self-assessment');
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb]">
      <Sidebar />
      <DashboardTopbar />
      <main className="pl-[220px] pt-14">
        <div className="max-w-[1152px] mx-auto p-6 flex flex-col gap-6">
          <Outlet />
        </div>
      </main>

      {isLocked && (
        <div className="fixed inset-0 bg-[#0c111d]/75 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl2 p-6 md:p-8 max-w-md w-full shadow-2xl border border-gray-100 flex flex-col items-center text-center animate-in fade-in zoom-in duration-300">
            <div className="size-16 rounded-full bg-red-50 border-8 border-red-100 flex items-center justify-center text-dash-danger mb-5">
              <Lock className="size-6 text-[#ba1a1a]" />
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Akses Terbatas
            </h3>
            
            <p className="text-[14px] leading-[22px] text-gray-500 mb-6">
              Mode Tamu (Anonim) hanya memiliki izin untuk mengakses halaman <strong>Penilaian Diri (Asesmen Mandiri)</strong> serta mengunduh hasil asesmen. 
              <br /><br />
              Silakan daftarkan akun untuk melacak suasana hati secara rutin, berdiskusi di Komunitas Anonim, atau berkonsultasi dengan Konselor profesional.
            </p>

            <div className="flex flex-col gap-2.5 w-full">
              <button
                type="button"
                onClick={handleRegisterRedirect}
                className="w-full bg-dash-primary text-white font-semibold rounded-xl py-3 hover:bg-dash-primary/95 transition-all text-sm shadow-sm"
              >
                Daftar Akun Baru
              </button>
              
              <button
                type="button"
                onClick={handleAssessmentRedirect}
                className="w-full border border-gray-300 text-gray-700 font-semibold rounded-xl py-3 hover:bg-gray-50 transition-all text-sm"
              >
                Kembali ke Penilaian Diri
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
