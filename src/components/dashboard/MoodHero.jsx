import { useState } from 'react';
import useFetch from '../../hooks/useFetch.js';
import { getCurrentUser, submitMood } from '../../services/dashboardService.js';

const MOODS = [
  { key: 'sedih', emoji: '😔', label: 'Sedih' },
  { key: 'biasa', emoji: '😕', label: 'Biasa' },
  { key: 'senang', emoji: '😊', label: 'Senang' },
  { key: 'sangat-baik', emoji: '🤩', label: 'Sangat Baik' },
  { key: 'bertenaga', emoji: '🔋', label: 'Bertenaga' },
];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 11) return 'Selamat pagi';
  if (hour < 15) return 'Selamat siang';
  if (hour < 18) return 'Selamat sore';
  return 'Selamat malam';
}

export default function MoodHero() {
  const { data: user } = useFetch(getCurrentUser, []);
  const [selectedMood, setSelectedMood] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSelectMood = async (mood) => {
    setSelectedMood(mood.key);
    setSubmitting(true);
    try {
      await submitMood({ mood: mood.key });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      className="rounded-xl2 p-8 flex flex-col md:flex-row items-start md:items-end justify-between gap-6"
      style={{
        backgroundImage: 'linear-gradient(170deg, #004ac6 0%, #0051b1 100%)',
      }}
    >
      <div className="flex flex-col gap-2">
        <h2 className="text-[30px] leading-9 text-white">
          {getGreeting()}, {user?.name ?? '...'} 👋
        </h2>
        <p className="text-base leading-6 text-white/90 max-w-md">
          Bagaimana perasaanmu saat ini? Melacak suasana hati membantu kita memahami pola emosi
          harian.
        </p>
      </div>

      <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl2 p-4 w-full md:w-[343px] flex flex-col gap-3">
        <p className="text-[10px] font-semibold tracking-[0.8px] uppercase text-white/80">
          Pilih Mood Saat Ini
        </p>
        <div className="flex items-start justify-between">
          {MOODS.map((mood) => (
            <button
              key={mood.key}
              type="button"
              disabled={submitting}
              onClick={() => handleSelectMood(mood)}
              className={`flex flex-col items-center gap-1 text-white text-center rounded-lg px-1 transition-transform hover:scale-110 ${
                selectedMood === mood.key ? 'scale-110 opacity-100' : 'opacity-90'
              }`}
            >
              <span className="text-2xl leading-8">{mood.emoji}</span>
              <span className="text-[11px] font-medium leading-[14px] whitespace-nowrap">
                {mood.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
