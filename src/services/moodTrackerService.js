// import api from './api'; // aktifkan saat backend siap

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

const DUMMY_DAILY_INSIGHT = {
  text: "Kamu lebih sering merasa 'Senang' saat membahas 'Hobi'.",
};

const DUMMY_QUOTE = {
  text: 'Tidak apa-apa untuk tidak merasa baik-baik saja hari ini. Besok adalah kesempatan baru untuk tumbuh.',
};

const DUMMY_RECENT_ENTRIES = [
  {
    id: 'entry-1',
    emoji: '😊',
    mood: 'Senang',
    date: 'Hari ini, 08:30',
    note: 'Berhasil menyelesaikan tugas tepat…',
    tag: 'KULIAH',
  },
  {
    id: 'entry-2',
    emoji: '😐',
    mood: 'Biasa Saja',
    date: 'Kemarin, 19:45',
    note: 'Hanya hari yang tenang di…',
    tag: 'STUDI',
  },
  {
    id: 'entry-3',
    emoji: '🤩',
    mood: 'Sangat Bahagia',
    date: '22 Okt, 14:20',
    note: 'Makan siang bareng teman-teman…',
    tag: 'SOSIAL',
  },
];

export async function getEmotions() {
  const res = await mockDelay(DUMMY_EMOTIONS);
  return res.data;
}

export async function getEmotionTags() {
  const res = await mockDelay(DUMMY_TAGS);
  return res.data;
}

export async function getDailyInsight() {
  // const res = await api.get('/mood/insight/today');
  const res = await mockDelay(DUMMY_DAILY_INSIGHT);
  return res.data;
}

export async function getDailyQuote() {
  // const res = await api.get('/quotes/today');
  const res = await mockDelay(DUMMY_QUOTE);
  return res.data;
}

export async function getRecentMoodEntries() {
  // const res = await api.get('/mood/entries/recent');
  const res = await mockDelay(DUMMY_RECENT_ENTRIES);
  return res.data;
}

/**
 * Simpan entri mood lengkap (emosi, intensitas, tag, catatan).
 * @param {{ emotion: string, intensity: number, tags: string[], note: string }} payload
 */
export async function saveMoodEntry(payload) {
  // const res = await api.post('/mood/entries', payload);
  const res = await mockDelay({ success: true, entry: payload }, 500);
  return res.data;
}
