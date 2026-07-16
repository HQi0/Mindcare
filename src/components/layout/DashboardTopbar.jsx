import { Search, Bell, CornerDownLeft, Menu } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useFetch from '../../hooks/useFetch.js';
import { getCurrentUser } from '../../services/dashboardService.js';
import { supabase } from '../../lib/supabaseClient';

const NAV_SUGGESTIONS = [
  { keys: ['dashboard', 'utama', 'home', 'beranda'], label: 'Dashboard', path: '/dashboard' },
  { keys: ['mood tracker', 'pelacak suasana hati', 'catat mood', 'catatan harian', 'pembukuan emosi'], label: 'Pelacak Suasana Hati', path: '/mood-tracker' },
  { keys: ['mood history', 'riwayat suasana', 'riwayat mood', 'timeline', 'riwayat catatan harian', 'timeline catatan harian', 'history'], label: 'Riwayat Suasana', path: '/mood-history' },
  { keys: ['self assessment', 'penilaian diri', 'tes mental', 'kuisioner', 'uji kesehatan', 'tes'], label: 'Penilaian Diri', path: '/self-assessment' },
  { keys: ['resources', 'sumber daya', 'artikel', 'video', 'meditasi', 'audio', 'galeri'], label: 'Sumber Daya & Artikel', path: '/resources' },
  { keys: ['chat', 'konselor', 'chat konselor', 'counselor', 'obrolan'], label: 'Chat Konselor', path: '/counselor-chat' },
  { keys: ['booking', 'booking sesi', 'jadwal konseling', 'schedule', 'reservasi', 'reservasi sesi'], label: 'Booking Sesi Konseling', path: '/schedule-session' },
  { keys: ['community', 'komunitas anonim', 'forum', 'postingan', 'anonim', 'komunitas'], label: 'Komunitas Anonim', path: '/community' },
  { keys: ['settings', 'pengaturan', 'profil', 'setting', 'ubah nama', 'akun'], label: 'Profil & Pengaturan', path: '/settings' },
  { keys: ['emergency', 'bantuan darurat', 'hotline', 'darurat', 'tolong'], label: 'Bantuan Darurat', path: '/emergency-help' },
];

function getInitials(name) {
  if (!name) return 'MC';
  return name.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
}

export default function DashboardTopbar({ onMenuClick }) {
  const navigate = useNavigate();
  const { data: user } = useFetch(getCurrentUser, []);
  
  const [activeSession, setActiveSession] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Helper to get the best navigation match based on word scoring
  const getBestMatch = (query) => {
    if (!query.trim()) return null;
    const q = query.toLowerCase().trim();
    const queryWords = q.split(/\s+/).filter(w => w.length > 2);

    let bestItem = null;
    let maxScore = 0;

    NAV_SUGGESTIONS.forEach(item => {
      let score = 0;
      
      // Exact label matching
      if (item.label.toLowerCase() === q) {
        score += 50;
      }

      item.keys.forEach(k => {
        const key = k.toLowerCase();
        // 1. Direct contains check
        if (q.includes(key)) {
          score += key.length * 3;
        }
        // 2. Individual query word checks (allows fuzzy matching for typos)
        queryWords.forEach(word => {
          if (key.includes(word)) {
            score += word.length;
          }
        });
      });

      if (score > maxScore) {
        maxScore = score;
        bestItem = item;
      }
    });

    return maxScore >= 3 ? bestItem : null;
  };

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }
    const q = searchQuery.toLowerCase().trim();
    const queryWords = q.split(/\s+/).filter(w => w.length > 2);

    const scored = NAV_SUGGESTIONS.map(item => {
      let score = 0;
      if (item.label.toLowerCase().includes(q)) {
        score += 10;
      }
      
      item.keys.forEach(k => {
        const key = k.toLowerCase();
        if (q.includes(key)) score += key.length * 2;
        if (key.includes(q)) score += q.length * 2;
        
        queryWords.forEach(word => {
          if (key.includes(word)) score += word.length;
        });
      });
      return { ...item, score };
    })
    .filter(item => item.score > 2)
    .sort((a, b) => b.score - a.score);

    setSuggestions(scored);
  }, [searchQuery]);

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      const bestMatch = getBestMatch(searchQuery);
      if (bestMatch) {
        navigate(bestMatch.path);
        setSearchQuery('');
        setShowSuggestions(false);
      } else {
        navigate(`/resources?search=${encodeURIComponent(searchQuery.trim())}`);
        setShowSuggestions(false);
      }
    }
  };

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

    const sessionStart = new Date(activeSession.scheduled_at);
    const sessionEndTimestamp = sessionStart.getTime() + (60 * 60 * 1000); 

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
    <header className="fixed top-0 left-0 md:left-[220px] right-0 h-14 bg-dash-sidebar border-b border-dash-border flex items-center justify-between px-4 md:px-6 z-30">
      <div className="flex items-center gap-3 flex-1 max-w-[256px] relative">
        <button
          onClick={onMenuClick}
          className="md:hidden p-1.5 rounded-lg hover:bg-dash-border/40 text-dash-muted transition-colors cursor-pointer"
          type="button"
          aria-label="Buka Menu"
        >
          <Menu size={20} />
        </button>
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-dash-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => {
              setTimeout(() => setShowSuggestions(false), 200);
            }}
            onKeyDown={handleSearchKeyDown}
            placeholder="Cari fitur atau artikel..."
            className="w-full bg-white rounded-full pl-10 pr-4 py-1.5 text-[13px] text-dash-muted placeholder:text-dash-muted border border-transparent focus:outline-none focus:border-dash-primary/30"
          />
        </div>

        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute left-0 right-0 mt-1.5 bg-white border border-dash-border rounded-xl shadow-xl overflow-hidden z-50 flex flex-col max-h-60 overflow-y-auto">
            {suggestions.map((item) => (
              <button
                key={item.path}
                type="button"
                onClick={() => {
                  navigate(item.path);
                  setSearchQuery('');
                  setShowSuggestions(false);
                }}
                className="w-full text-left px-4 py-2.5 hover:bg-surface-tint border-b border-dash-border/30 last:border-0 transition-colors flex justify-between items-center group"
              >
                <div className="flex flex-col">
                  <span className="text-[13px] font-bold text-dash-text group-hover:text-dash-primary transition-colors">{item.label}</span>
                  <span className="text-[10px] text-dash-muted mt-0.5">Navigasi ke {item.path}</span>
                </div>
                <CornerDownLeft size={12} className="text-dash-muted opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <Link
          to="/emergency-help"
          className="hidden sm:block bg-dash-primary text-white text-sm font-semibold rounded-full px-4 py-1.5"
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
            className="size-8 rounded-full bg-dash-primary/10 text-dash-primary flex items-center justify-center text-xs font-bold border border-dash-border overflow-hidden"
          >
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              getInitials(user?.name)
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}