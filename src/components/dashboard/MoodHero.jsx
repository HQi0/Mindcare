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
  const [showModal, setShowModal] = useState(false);
  const [lastSavedMood, setLastSavedMood] = useState(null);

  const handleSelectMood = async (mood) => {
    setSelectedMood(mood.key);
    setSubmitting(true);
    try {
      await submitMood({ mood: mood.key });
      setLastSavedMood(mood);
      setShowModal(true);
    } catch (error) {
      alert("Gagal mencatat mood: " + error.message);
      setSelectedMood(null);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedMood(null);
  };

  return (
    <>
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
          <div className="flex justify-between items-center h-4">
            <p className="text-[10px] font-semibold tracking-[0.8px] uppercase text-white/80">
              {selectedMood ? 'Mood Tercatat!' : 'Pilih Mood Saat Ini'}
            </p>
            {selectedMood && (
              <span className="text-[9px] font-bold text-white bg-dash-success border border-white/10 px-2 py-0.5 rounded-full animate-in fade-in zoom-in">
                Sukses
              </span>
            )}
          </div>
          <div className="flex items-start justify-between">
            {MOODS.map((mood) => (
              <button
                key={mood.key}
                type="button"
                disabled={submitting}
                onClick={() => handleSelectMood(mood)}
                className="flex flex-col items-center text-center cursor-pointer transition-transform duration-200"
              >
                <div className={`size-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                  selectedMood === mood.key
                    ? 'bg-white shadow-lg ring-4 ring-white/30 scale-110'
                    : 'bg-white/10 text-white hover:bg-white/25 hover:scale-105'
                }`}>
                  <span className="text-xl leading-none">{mood.emoji}</span>
                </div>
                <span className={`text-[10px] font-semibold leading-[14px] mt-1.5 whitespace-nowrap transition-colors duration-200 ${
                  selectedMood === mood.key ? 'text-white font-bold opacity-100' : 'text-white/70 opacity-90'
                }`}>
                  {mood.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-200">
          <div className="bg-white rounded-xl2 p-6 max-w-sm w-full mx-4 shadow-2xl border border-dash-border text-center flex flex-col items-center gap-4 animate-in zoom-in-95 duration-200">
            <div className="size-20 bg-dash-primary/5 text-dash-primary rounded-full flex items-center justify-center text-4xl shadow-inner border border-dash-primary/10">
              {lastSavedMood?.emoji}
            </div>
            <div>
              <h3 className="text-xl font-bold text-dash-text">Mood Tercatat!</h3>
              <p className="text-sm text-dash-muted mt-2">
                Terima kasih! Suasana hati Anda ("<span className="font-semibold text-dash-primary">{lastSavedMood?.label}</span>") telah berhasil disimpan.
              </p>
            </div>
            <button
              onClick={handleCloseModal}
              className="w-full bg-dash-primary text-white rounded-xl py-3 text-sm font-semibold hover:bg-[#004ac6] transition-all shadow-md mt-2 cursor-pointer"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
}
