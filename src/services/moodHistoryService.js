const mockDelay = (data, ms = 300) =>
  new Promise((resolve) => setTimeout(() => resolve({ data }), ms));

// Mood per tanggal (1-21) untuk kalender bulan ini — dummy.
const DUMMY_CALENDAR_DATA = {
  2: 'senang',
  3: 'senang',
  4: 'cemas',
  5: 'senang',
  6: 'netral',
  7: 'netral',
  8: 'sedih',
  9: 'cemas',
  10: 'senang',
  11: 'senang',
  12: 'netral',
  13: 'today',
};

const DUMMY_TREND = [
  { date: '1 Okt', intensity: 5 },
  { date: '5 Okt', intensity: 7 },
  { date: '8 Okt', intensity: 4 },
  { date: '12 Okt', intensity: 8 },
  { date: '15 Okt', intensity: 6 },
  { date: '19 Okt', intensity: 5 },
  { date: '22 Okt', intensity: 9 },
  { date: '26 Okt', intensity: 7 },
  { date: '31 Okt', intensity: 8 },
];

const DUMMY_MOST_FREQUENT = {
  mood: 'Sangat Senang',
  count: 12,
  percentage: 38,
};

const DUMMY_IMPROVEMENT = {
  percentage: 14.2,
  label: 'Stabilitas Emosional',
  direction: 'up',
};

const DUMMY_WEEKLY_ANALYSIS = {
  text: 'Mood Anda cenderung meningkat di akhir pekan (Jumat-Sabtu). Penurunan mood biasanya terjadi di Selasa malam, kemungkinan terkait dengan beban tugas kuliah.',
};

const DUMMY_TIMELINE = [
  {
    id: 'tl-1',
    date: '13 Okt',
    time: '19:30',
    mood: 'netral',
    title: 'Netral - "Hari yang Produktif"',
    note: 'Sangat lega karena akhirnya menyelesaikan tugas besar Pemrograman. Sempat merasa pusing di siang hari, tapi tidur siang sebentar sangat membantu.',
    tags: ['#TugasKuliah', '#Lega'],
  },
  {
    id: 'tl-2',
    date: '12 Okt',
    time: '22:15',
    mood: 'cemas',
    title: 'Cemas - "Kepikiran Deadline"',
    note: 'Gak bisa fokus belajar karena kepikiran tugas besok. Terlalu banyak minum kopi jadi susah tidur.',
    tags: ['#Kecemasan', '#Begadang'],
  },
  {
    id: 'tl-3',
    date: '11 Okt',
    time: '23:00',
    mood: 'senang',
    title: 'Sangat Senang - "Nongkrong sama Teman"',
    note: 'Menghabiskan waktu di kafe bareng Andi dan Siti. Lupa sebentar sama stres kuliah. Benar-benar recharge energi sosial!',
    tags: ['#Pertemanan', '#SocialRecharge'],
  },
];

export async function getCalendarData() {
  const res = await mockDelay(DUMMY_CALENDAR_DATA);
  return res.data;
}

export async function getMoodTrend() {
  // const res = await api.get('/mood/trend?range=month');
  const res = await mockDelay(DUMMY_TREND);
  return res.data;
}

export async function getMostFrequentMood() {
  const res = await mockDelay(DUMMY_MOST_FREQUENT);
  return res.data;
}

export async function getImprovementStats() {
  const res = await mockDelay(DUMMY_IMPROVEMENT);
  return res.data;
}

export async function getWeeklyTrendAnalysis() {
  const res = await mockDelay(DUMMY_WEEKLY_ANALYSIS);
  return res.data;
}

export async function getTimelineEntries() {
  // const res = await api.get('/mood/entries?view=timeline');
  const res = await mockDelay(DUMMY_TIMELINE);
  return res.data;
}
