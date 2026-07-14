// import api from './api'; // aktifkan saat backend siap

const mockDelay = (data, ms = 300) =>
  new Promise((resolve) => setTimeout(() => resolve({ data }), ms));

const DUMMY_USER = { id: 'usr_dummy', name: 'Adid', avatarInitials: 'AD' };

const DUMMY_STATS = [
  {
    id: 'streak',
    icon: 'flame',
    label: 'Streak',
    value: '12 Hari',
    valueColor: 'text-dash-primary',
    subtitle: 'Konsistensi luar biasa!',
    subtitleColor: 'text-dash-success',
  },
  {
    id: 'avg-mood',
    icon: 'smile',
    label: 'Mood Rata-rata',
    value: 'Positif',
    valueColor: 'text-dash-moodBlue',
    subtitle: 'Berdasarkan 7 hari terakhir',
    subtitleColor: 'text-dash-muted',
  },
  {
    id: 'last-assessment',
    icon: 'clipboard-check',
    label: 'Asesmen Terakhir',
    value: '3 Hari lalu',
    valueColor: 'text-dash-text',
    subtitle: 'Skala stres: Rendah',
    subtitleColor: 'text-dash-muted',
  },
  {
    id: 'next-session',
    icon: 'calendar-clock',
    label: 'Sesi Berikutnya',
    value: 'Besok, 10:00',
    valueColor: 'text-dash-text',
    subtitle: 'Bersama Dr. Sarah',
    subtitleColor: 'text-dash-primary',
  },
];

const DUMMY_MOOD_HISTORY = [
  { day: 'Sen', value: 3 },
  { day: 'Sel', value: 4 },
  { day: 'Rab', value: 2 },
  { day: 'Kam', value: 5 },
  { day: 'Jum', value: 4 },
  { day: 'Sab', value: 4 },
  { day: 'Min', value: 5 },
];

const DUMMY_ACTIVITIES = [
  {
    id: 'act-1',
    icon: 'wind',
    iconBg: 'bg-dash-success/10',
    title: 'Meditasi Fokus selesai',
    subtitle: '10 Menit • Hari ini, 08:30',
  },
  {
    id: 'act-2',
    icon: 'smile',
    iconBg: 'bg-dash-primary/10',
    title: 'Mencatat Mood Pagi',
    subtitle: 'Hari ini, 07:15',
  },
  {
    id: 'act-3',
    icon: 'book-open-text',
    iconBg: 'bg-dash-amber/10',
    title: 'Jurnal Harian disimpan',
    subtitle: 'Kemarin, 21:00',
  },
];

const DUMMY_RESOURCES = [
  {
    id: 'res-1',
    type: 'AUDIO',
    typeColor: 'text-dash-primary',
    title: 'Relaksasi Sebelum Tidur',
    subtitle: '15 Menit • Dipandu oleh Dr. Hendri',
  },
  {
    id: 'res-2',
    type: 'ARTIKEL',
    typeColor: 'text-dash-moodBlue',
    title: 'Mengelola Stres Akademik',
    subtitle: '5 Menit Baca • Tips Praktis Mahasiswa',
  },
  {
    id: 'res-3',
    type: 'LATIHAN',
    typeColor: 'text-[#0051b1]',
    title: 'Teknik Pernapasan 4-7-8',
    subtitle: '3 Menit • Latihan Kecemasan',
  },
];

export async function getCurrentUser() {
  // const res = await api.get('/me');
  const res = await mockDelay(DUMMY_USER);
  return res.data;
}

export async function getDashboardStats() {
  // const res = await api.get('/dashboard/stats');
  const res = await mockDelay(DUMMY_STATS);
  return res.data;
}

export async function getMoodHistory() {
  // const res = await api.get('/mood/history?range=7d');
  const res = await mockDelay(DUMMY_MOOD_HISTORY);
  return res.data;
}

export async function getRecentActivities() {
  // const res = await api.get('/activities/recent');
  const res = await mockDelay(DUMMY_ACTIVITIES);
  return res.data;
}

export async function getRecommendedResources() {
  // const res = await api.get('/resources/recommended');
  const res = await mockDelay(DUMMY_RESOURCES);
  return res.data;
}

/**
 * Kirim mood yang dipilih user dari Mood Hero.
 * @param {{ mood: string }} payload
 */
export async function submitMood(payload) {
  // const res = await api.post('/mood', payload);
  const res = await mockDelay({ success: true, mood: payload.mood });
  return res.data;
}
