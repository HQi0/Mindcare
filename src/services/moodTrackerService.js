import { supabase } from '../lib/supabaseClient';
import { getCurrentDatabaseUser } from './authService.js';

const mockDelay = (data, ms = 300) =>
  new Promise((resolve) => setTimeout(() => resolve({ data }), ms));

const DUMMY_EMOTIONS = [
  { key: 'sangat-bahagia', emoji: '🤩', label: 'Sangat Bahagia' },
  { key: 'senang', emoji: '😊', label: 'Senang' },
  { key: 'biasa-saja', emoji: '😐', label: 'Biasa Saja' },
  { key: 'sedih', emoji: '😔', label: 'Sedih' },
  { key: 'marah', emoji: '😠', label: 'Marah' },
];

const DUMMY_TAGS = [
  { key: 'kuliah', label: 'Kuliah' },
  { key: 'pertemanan', label: 'Pertemanan' },
  { key: 'keluarga', label: 'Keluarga' },
  { key: 'kesehatan', label: 'Kesehatan' },
  { key: 'hobi', label: 'Hobi' },
  { key: 'keuangan', label: 'Keuangan' },
  { key: 'lainnya', label: 'Lainnya...' },
];

const DUMMY_QUOTE = {
  text: 'Tidak apa-apa untuk tidak merasa baik-baik saja hari ini. Besok adalah kesempatan baru untuk tumbuh.',
};

export async function getEmotions() {
  return DUMMY_EMOTIONS;
}

export async function getEmotionTags() {
  return DUMMY_TAGS;
}

export async function getDailyInsight() {
  const user = await getCurrentDatabaseUser();
  if (!user) {
    return { text: "Catat mood harianmu untuk mendapatkan insight di sini." };
  }

  // Insight sederhana berdasarkan mood terakhir
  const { data } = await supabase
    .from('mood_entries')
    .select('mood')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(3);

  if (!data || data.length === 0) {
    return { text: "Kamu belum mencatat mood akhir-akhir ini. Yuk mulai catat!" };
  }

  const recentMoods = data.map(d => d.mood);
  const isHappy = recentMoods.includes('sangat_senang') || recentMoods.includes('senang');
  const isSad = recentMoods.includes('sedih') || recentMoods.includes('sangat_sedih');

  if (isHappy && !isSad) {
    return { text: "Luar biasa! Kamu sering merasa positif belakangan ini. Terus pertahankan kegiatan yang membuatmu bahagia." };
  } else if (isSad && !isHappy) {
    return { text: "Sepertinya akhir-akhir ini terasa berat. Jangan ragu untuk mencari dukungan atau sekadar istirahat sejenak." };
  } else {
    return { text: "Emosimu cukup fluktuatif akhir-akhir ini. Jaga keseimbangan dengan rutinitas yang menenangkan." };
  }
}

export async function getDailyQuote() {
  return DUMMY_QUOTE; // Bisa dibuat random dari array jika diinginkan
}

const DB_MOOD_TO_UI = {
  'sangat_senang': { emoji: '🤩', label: 'Sangat Bahagia' },
  'senang': { emoji: '😊', label: 'Senang' },
  'netral': { emoji: '😐', label: 'Biasa Saja' },
  'sedih': { emoji: '😔', label: 'Sedih' },
  'sangat_sedih': { emoji: '😠', label: 'Marah / Sangat Sedih' }
};

export async function getRecentMoodEntries() {
  const user = await getCurrentDatabaseUser();
  if (!user) return [];

  const { data } = await supabase
    .from('mood_entries')
    .select('id, mood, note, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(3);

  if (!data) return [];

  return data.map(entry => {
    const uiProps = DB_MOOD_TO_UI[entry.mood] || DB_MOOD_TO_UI['netral'];
    const d = new Date(entry.created_at);
    
    // Ekstrak tag jika ada di dalam note, format "[Tag: xyz] note asli"
    let displayNote = entry.note || 'Tidak ada catatan';
    let extractedTag = 'JURNAL';
    
    if (displayNote.startsWith('[Tag:')) {
      const match = displayNote.match(/\[Tag:\s*(.*?)\]/);
      if (match) {
        extractedTag = match[1].split(',')[0].toUpperCase().substring(0, 10);
        displayNote = displayNote.replace(match[0], '').trim();
      }
    }

    return {
      id: entry.id,
      emoji: uiProps.emoji,
      mood: uiProps.label,
      date: `${d.getDate()}/${d.getMonth()+1} ${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}`,
      note: displayNote,
      tag: extractedTag,
    };
  });
}

const UI_MOOD_TO_DB = {
  'sangat-bahagia': 'sangat_senang',
  'senang': 'senang',
  'biasa-saja': 'netral',
  'sedih': 'sedih',
  'marah': 'sangat_sedih'
};

/**
 * Simpan entri mood lengkap (emosi, intensitas, tag, catatan).
 * @param {{ emotion: string, intensity: number, tags: string[], note: string }} payload
 */
export async function saveMoodEntry(payload) {
  const user = await getCurrentDatabaseUser();
  if (!user) throw new Error("Harap login terlebih dahulu.");

  const dbMood = UI_MOOD_TO_DB[payload.emotion] || 'netral';
  
  // Karena tabel tidak punya kolom tag dan intensitas, kita gabung ke note
  let finalNote = payload.note || '';
  if (payload.tags && payload.tags.length > 0) {
    const tagsStr = payload.tags.map(t => t.label).join(', ');
    finalNote = `[Tag: ${tagsStr}] ${finalNote}`;
  }

  const { data, error } = await supabase
    .from('mood_entries')
    .insert([
      { 
        user_id: user.id, 
        mood: dbMood,
        note: finalNote
      }
    ])
    .select()
    .single();

  if (error) throw new Error(error.message);

  return { success: true, entry: data };
}
