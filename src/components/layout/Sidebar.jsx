import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Smile,
  History,
  ClipboardList,
  BookOpen,
  MessageCircle,
  CalendarClock,
  Users,
  User,
  Settings,
  LogOut,
  X,
} from 'lucide-react';
import { logout } from '../../services/authService.js';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/mood-tracker', label: 'Pelacak Suasana Hati', icon: Smile },
  { to: '/mood-history', label: 'Riwayat Suasana', icon: History },
  { to: '/self-assessment', label: 'Penilaian Diri', icon: ClipboardList },
  { to: '/resources', label: 'Sumber Daya', icon: BookOpen },
  { to: '/counselor-chat', label: 'Chat Konselor', icon: MessageCircle },
  { to: '/schedule-session', label: 'Booking Sesi', icon: CalendarClock },
  { to: '/community', label: 'Komunitas Anonim', icon: Users },
  { to: '/settings', label: 'Profil & Pengaturan', icon: Settings },
];

/**
 * Sidebar aplikasi (setelah login). Dipakai bersama oleh Dashboard
 * dan seluruh halaman app lainnya lewat DashboardLayout.
 */
export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    if (onClose) onClose();
    navigate('/login', { replace: true });
  };

  return (
    <aside className={`fixed left-0 top-0 h-screen w-[220px] bg-dash-sidebar border-r border-dash-border flex flex-col justify-between py-6 z-40 transition-transform duration-300 md:translate-x-0 ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
      <div className="pb-8 px-6 relative flex justify-between items-start">
        <div>
          <h1 className="text-[22px] leading-8 font-semibold tracking-[-0.22px] text-dash-primary">
            MindCare
          </h1>
          <p className="text-xs leading-4 text-dash-linkMuted">Kesejahteraan Mahasiswa</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="md:hidden p-1.5 rounded-lg hover:bg-dash-border/40 text-dash-muted transition-colors cursor-pointer"
          aria-label="Tutup Menu"
        >
          <X size={18} />
        </button>
      </div>

      <nav className="flex-1 flex flex-col gap-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 text-[13.5px] font-medium transition-colors ${
                isActive
                  ? 'border-l-2 border-dash-primary pl-[14px] text-dash-primary'
                  : 'text-dash-muted hover:text-dash-primary'
              }`
            }
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 flex flex-col gap-4">
        <Link
          to="/emergency-help"
          onClick={onClose}
          className="flex items-center justify-center gap-2 w-full bg-dash-dangerBg border border-dash-danger/20 text-dash-danger text-sm font-semibold rounded-lg py-2.5"
        >
          Bantuan Darurat
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2 text-[13.5px] font-medium text-dash-muted hover:text-dash-danger transition-colors cursor-pointer"
        >
          <LogOut size={18} />
          Keluar
        </button>
      </div>
    </aside>
  );
}
