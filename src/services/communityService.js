const mockDelay = (data, ms = 300) =>
  new Promise((resolve) => setTimeout(() => resolve({ data }), ms));

const DUMMY_CATEGORIES = ['Semua', 'Stres Kuliah', 'Motivasi', 'Hubungan', 'Kesehatan Mental'];

const DUMMY_POSTS = [
  {
    id: 'post-1',
    alias: 'Pahlawan Sunyi',
    category: 'Stres Kuliah',
    time: '2 jam lalu',
    text: 'Rasanya berat banget ngejar deadline skripsi sambil kerja part-time. Sering ngerasa burnout tapi nggak enak mau cerita ke orang tua karena mereka udah banyak keluar biaya. Ada yang punya tips cara bagi waktu yang efektif tanpa bikin mental breakdown?',
    likes: 24,
    comments: 8,
  },
  {
    id: 'post-2',
    alias: 'Bintang Malam',
    category: 'Motivasi',
    time: '5 jam lalu',
    text: 'Buat kalian yang lagi ngerasa gagal, ingat ya, progres itu nggak selalu linear. Kadang kita harus mundur satu langkah buat loncat lebih jauh nanti. Semangat buat hari ini, kita pasti bisa! ✨',
    likes: 56,
    comments: 12,
  },
  {
    id: 'post-3',
    alias: 'Awan Tenang',
    category: 'Hubungan',
    time: '1 hari lalu',
    text: 'Gimana ya caranya ngomong ke temen kos kalau kebiasaan dia yang suka berisik tengah malem itu ganggu banget? Takut jadi canggung kalau ditegur langsung, soalnya kita satu circle pertemanan.',
    likes: 15,
    comments: 19,
  },
];

const DUMMY_TRENDING = [
  { tag: '#DeadlineSkripsi', context: 'Trending di Stres Kuliah', posts: '1.2k postingan hari ini' },
  { tag: '#KomunikasiSehat', context: 'Trending di Hubungan', posts: '842 postingan hari ini' },
  { tag: '#SelfCareChallenge', context: 'Trending di Umum', posts: '531 postingan hari ini' },
];

const DUMMY_RULES = [
  'Jaga identitas anonim sesama anggota — jangan doxxing.',
  'Saling menghormati, tidak ada ujaran kebencian atau bullying.',
  'Ini bukan pengganti bantuan profesional untuk krisis mendesak.',
];

export async function getCategories() {
  const res = await mockDelay(DUMMY_CATEGORIES);
  return res.data;
}

export async function getPosts() {
  const res = await mockDelay(DUMMY_POSTS);
  return res.data;
}

export async function getTrendingTopics() {
  const res = await mockDelay(DUMMY_TRENDING);
  return res.data;
}

export async function getCommunityRules() {
  const res = await mockDelay(DUMMY_RULES);
  return res.data;
}

export async function createPost(text) {
  // const res = await api.post('/community/posts', { text });
  const res = await mockDelay({
    id: `post-${Date.now()}`,
    alias: 'Pahlawan Sunyi',
    category: 'Umum',
    time: 'Baru saja',
    text,
    likes: 0,
    comments: 0,
  });
  return res.data;
}
