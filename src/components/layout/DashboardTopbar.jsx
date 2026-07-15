import { Search, Bell } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useFetch from '../../hooks/useFetch.js';
import { getCurrentUser } from '../../services/dashboardService.js';
import { supabase } from '../../lib/supabaseClient';

function getInitials(name) {
  if (!name) return 'MC';
  return name.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
}

export default function DashboardTopbar() {
  const navigate = useNavigate();
  const { data: user } = useFetch(getCurrentUser, []);
  
  const [activeSession, setActiveSession] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const checkActiveBooking = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;

      const { data, error } = await supabase
        .from('bookings')
        .select('id, scheduled_at, counselor_id, counselor:counselors(id, full_name)')
        .eq('user_id', authUser.id)
        .eq('session_type', 'online');

      if (data && data.length > 0) {
        const currentTime = new Date();

        const liveBooking = data.find((b) => {
          if (!b.scheduled_at) return false;
          const sessionStart = new Date(b.scheduled_at);
          const sessionEnd = new Date(sessionStart.getTime() + 60 * 60 * 1000); 
          return currentTime >= sessionStart && currentTime <= sessionEnd;
        });

        if (liveBooking) {
          setActiveSession(liveBooking);
        } else {
          setActiveSession(null);
        }
      } else {
        setActiveSession(null);
      }
    };

    checkActiveBooking();
    const interval = setInterval(checkActiveBooking, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleNotificationClick = async () => {
    if (!activeSession) return;

    const targetCounselorId = activeSession.counselor_id || activeSession.counselor?.id;
    const currentBookingId = activeSession.id;

    if (!targetCounselorId) {
      console.error('ID Konselor tidak ditemukan pada sesi aktif.');
      return;
    }

    // ============================================================
    // HITUNG BATAS JAM AKHIR ABSOLUT BERDASARKAN WAKTU BOOKING
    // ============================================================
    const sessionStart = new Date(activeSession.scheduled_at);
    const sessionEndTimestamp = sessionStart.getTime() + (60 * 60 * 1000); // Selesai 1 jam setelah mulai

    // Simpan data ke localStorage agar bisa dibaca halaman chat
    localStorage.setItem('active_counselor_redirect', targetCounselorId);
    localStorage.setItem(`session_expiry_${targetCounselorId}`, sessionEndTimestamp.toString());

    setShowDropdown(false);
    setActiveSession(null);
    navigate('/counselor-chat');

    try {
      await supabase
        .from('bookings')
        .delete()
        .eq('id', currentBookingId);

      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        await supabase.from('chat_messages').insert({
          user_id: authUser.id,
          counselor_id: targetCounselorId,
          sender: 'user',
          message: 'Halo Konselor, saya telah memasuki ruang konsultasi online.'
        });
      }
    } catch (err) {
      console.error('Gagal memproses background DB operation:', err.message);
    }
  };

  return (
    <header className="fixed top-0 left-[220px] right-0 h-14 bg-dash-sidebar border-b border-dash-border flex items-center justify-between px-6 z-30">
      <div className="flex-1 max-w-[256px]">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-dash-muted" />
          <input
            type="text"
            placeholder="Cari sumber daya..."
            className="w-full bg-white rounded-full pl-10 pr-4 py-1.5 text-[13px] text-dash-muted placeholder:text-dash-muted border border-transparent focus:outline-none focus:border-dash-primary/30"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Link
          to="/emergency-help"
          className="bg-dash-primary text-white text-sm font-semibold rounded-full px-4 py-1.5"
        >
          Bantuan Darurat
        </Link>

        <div className="flex items-center gap-2">
          <div 
            className="relative"
            onMouseEnter={() => activeSession && setShowDropdown(true)}
            onMouseLeave={() => activeSession && setShowDropdown(false)}
          >
            <button
              type="button"
              onClick={handleNotificationClick}
              className={`relative p-2 rounded-full transition-colors ${
                activeSession ? 'bg-blue-50 hover:bg-blue-100' : 'hover:bg-dash-border/40'
              }`}
              aria-label="Notifikasi"
            >
              <Bell 
                size={16} 
                className={activeSession ? 'text-blue-600 animate-bounce' : 'text-dash-muted'} 
              />
              {activeSession && (
                <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-red-500 animate-pulse" />
              )}
            </button>

            {showDropdown && activeSession && (
              <div 
                onClick={handleNotificationClick}
                className="absolute right-0 mt-2 w-72 bg-white border border-dash-border shadow-xl rounded-xl p-4 z-50 text-xs text-left cursor-pointer hover:bg-slate-50 transition-colors"
              >
                <p className="font-bold text-dash-primary flex items-center gap-1">
                  <span className="size-2 rounded-full bg-green-500 animate-pulse" />
                  Sesi Anda Sedang Aktif!
                </p>
                <p className="text-dash-muted mt-1.5 leading-relaxed">
                  Jadwal online dengan <b>{activeSession.counselor?.full_name || 'Konselor Anda'}</b> sedang berjalan. <b>Klik di sini sekarang</b> untuk langsung masuk ruang obrolan.
                </p>
              </div>
            )}
          </div>

          <Link
            to="/profile"
            className="size-8 rounded-full bg-dash-primary/10 text-dash-primary flex items-center justify-center text-xs font-bold border border-dash-border"
          >
            {getInitials(user?.name)}
          </Link>
        </div>
      </div>
    </header>
  );
}