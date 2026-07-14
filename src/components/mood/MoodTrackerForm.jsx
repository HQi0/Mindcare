import { useState } from 'react';
import useFetch from '../../hooks/useFetch.js';
import { getEmotions, getEmotionTags, saveMoodEntry } from '../../services/moodTrackerService.js';
import EmojiSelector from './EmojiSelector.jsx';
import IntensitySlider from './IntensitySlider.jsx';
import EmotionTagSelector from './EmotionTagSelector.jsx';

export default function MoodTrackerForm() {
  const { data: emotions } = useFetch(getEmotions, []);
  const { data: tags } = useFetch(getEmotionTags, []);

  const [selectedEmotion, setSelectedEmotion] = useState('senang');
  const [intensity, setIntensity] = useState(7);
  const [selectedTags, setSelectedTags] = useState(['pertemanan', 'hobi']);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const toggleTag = (key) => {
    setSelectedTags((prev) =>
      prev.includes(key) ? prev.filter((t) => t !== key) : [...prev, key]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await saveMoodEntry({ emotion: selectedEmotion, intensity, tags: selectedTags, note });
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="md:col-span-8 backdrop-blur-sm bg-white/80 border border-auth-card rounded-xl2 p-[17px] flex flex-col gap-8">
      <EmojiSelector emotions={emotions} selected={selectedEmotion} onSelect={setSelectedEmotion} />
      <IntensitySlider value={intensity} onChange={setIntensity} />
      <EmotionTagSelector tags={tags} selected={selectedTags} onToggle={toggleTag} />

      <div className="flex flex-col gap-4 w-full">
        <p className="text-sm font-semibold text-dash-primary">Catatan Harian (Opsional)</p>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Tuliskan apa yang ada di pikiranmu..."
          rows={4}
          className="w-full bg-white/50 border border-auth-card rounded-xl2 px-[17px] py-[17px] text-[13.5px] text-dash-text placeholder:text-[#6b7280] resize-none focus:outline-none focus:ring-2 focus:ring-dash-primary/20"
        />
      </div>

      <div className="flex items-center justify-end gap-3">
        {saved && <span className="text-xs text-dash-success">Tersimpan!</span>}
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="bg-dash-primary text-white text-sm font-semibold rounded-lg px-8 py-3 shadow-[0px_10px_15px_-3px_rgba(0,74,198,0.2),0px_4px_6px_-4px_rgba(0,74,198,0.2)] disabled:opacity-60"
        >
          {saving ? 'Menyimpan...' : 'Simpan Suasana Hati'}
        </button>
      </div>
    </div>
  );
}
