const mockDelay = (data, ms = 300) =>
  new Promise((resolve) => setTimeout(() => resolve({ data }), ms));

const DUMMY_CATEGORIES = [
  { id: 'semua', label: 'Semua' },
  { id: 'artikel', label: 'Artikel' },
  { id: 'video', label: 'Video' },
  { id: 'meditasi', label: 'Meditasi' },
  { id: 'audio', label: 'Audio' },
];

const DUMMY_HERO = {
  badge: 'TOPIK UTAMA MINGGU INI',
  title: 'Menavigasi Tekanan Akademik di Akhir Semester',
  description:
    'Kumpulan strategi teruji untuk menjaga kesehatan mental saat menghadapi tumpukan tugas dan ujian akhir.',
  cta: 'Mulai Belajar',
};

const DUMMY_STRESS_SECTION = {
  title: 'Manajemen Stres',
  description: 'Teknik praktis untuk meredakan kecemasan sehari-hari.',
  featured: {
    id: 'grounding-kuliah',
    type: 'ARTIKEL',
    duration: '8 MENIT',
    title: '5 Menit Mindfulness: Teknik Grounding di Tengah Kuliah',
    description:
      'Pelajari cara menenangkan sistem saraf Anda secara instan bahkan di ruang kelas yang ramai dengan metode 5-4-3-2-1.',
    author: 'Dr. Amira Sari',
  },
  secondary: [
    {
      id: 'box-breathing',
      type: 'AUDIO',
      duration: '12 Menit',
      title: 'Panduan Pernapasan Box untuk Fokus',
      actionLabel: 'Putar Sekarang',
    },
    {
      id: 'burnout-skripsi',
      type: 'VIDEO',
      duration: '15 Menit',
      title: 'Mengelola Burnout Saat Mengerjakan Skripsi',
      actionLabel: 'Tonton Sekarang',
    },
  ],
};

const DUMMY_SLEEP_SECTION = {
  title: 'Optimasi Tidur',
  description: 'Perbaiki kualitas istirahat Anda untuk performa kognitif yang lebih baik.',
  cards: [
    { id: 'visualisasi-pantai', category: 'Meditasi', title: 'Visualisasi: Pantai di Malam Hari', duration: '20 Menit' },
    { id: 'sains-tidur', category: 'Artikel', title: 'Sains di Balik Tidur 8 Jam', duration: '6 Menit' },
    { id: 'wind-down', category: 'Audio', title: 'Ritual Sebelum Tidur (Wind Down)', duration: '15 Menit' },
  ],
};

const DUMMY_ACADEMIC_SECTION = {
  title: 'Tekanan Akademik',
  description: 'Menyeimbangkan prestasi tanpa mengorbankan diri sendiri.',
  cards: [
    {
      id: 'kecemasan-akademik',
      title: 'Teknik Pomodoro untuk Mahasiswa ADHD',
      description: 'Bagaimana memodifikasi teknik manajemen waktu populer untuk otak yang bekerja secara berbeda.',
      meta: 'Video Series • 3 Bagian',
      badge: 'SELESAI 40%',
    },
    {
      id: 'seni-menghadapi-kegagalan',
      title: 'Seni Menghadapi Kegagalan Akademik',
      description: 'Membangun ketangguhan (resilience) setelah mendapatkan nilai yang tidak sesuai ekspektasi.',
      meta: 'Artikel Panjang',
      badge: 'BARU',
    },
  ],
};

const DUMMY_ARTICLE_DETAIL = {
  id: 'kecemasan-ujian',
  badges: ['KESEHATAN MENTAL', 'TIPS MAHASISWA'],
  title: 'Strategi Menghadapi Kecemasan Akademik Selama Masa Ujian',
  author: { name: 'Dr. Sarah Kencana, M.Psi', role: 'PSIKOLOG KLINIS', bio: 'Spesialis Kecemasan & Produktivitas Mahasiswa di MindCare.' },
  readTime: '8 menit baca',
  date: '24 Okt 2023',
  toc: [
    'Memahami Akar Kecemasan',
    'Tips Praktis Mengelola Stres',
    'Pentingnya Self-Compassion',
    'Kesimpulan',
  ],
  intro:
    'Masa ujian seringkali menjadi periode yang paling menantang bagi mahasiswa. Tekanan untuk berprestasi, ditambah dengan kurangnya waktu istirahat, dapat memicu kecemasan akademik yang signifikan. Kecemasan ini bukan hanya sekadar rasa gugup biasa, namun bisa berdampak pada kemampuan kognitif dan kesehatan fisik secara keseluruhan.',
  sections: [
    {
      heading: 'Memahami Akar Kecemasan Akademik',
      body: 'Kecemasan akademik sering kali berakar dari ketakutan akan kegagalan atau standar perfeksionisme yang terlalu tinggi. Di lingkungan universitas yang kompetitif, mahasiswa cenderung membandingkan diri dengan rekan-rekan mereka, yang kemudian memperburuk perasaan tidak mampu.',
    },
  ],
  quote:
    'Kecemasan adalah sinyal dari pikiran kita, bukan hukuman. Mengenali kehadirannya adalah langkah pertama untuk mengelolanya dengan bijak.',
  tips: [
    { title: 'Teknik Pernapasan 4-7-8:', body: 'Tarik napas selama 4 detik, tahan selama 7 detik, dan buang napas perlahan selama 8 detik. Lakukan ini saat Anda mulai merasa kewalahan.' },
    { title: 'Jadwal Belajar Terstruktur:', body: 'Hindari sistem kebut semalam. Bagi materi menjadi bagian-bagian kecil yang bisa dikelola setiap harinya.' },
    { title: 'Batasi Kafein Berlebih:', body: 'Meskipun membantu tetap terjaga, kafein berlebih dapat meningkatkan gejala fisik kecemasan seperti jantung berdebar.' },
    { title: 'Tidur yang Cukup:', body: 'Otak memerlukan fase REM untuk mengonsolidasi memori. Belajar tanpa tidur justru menurunkan efektivitas ingatan.' },
  ],
  compassion:
    'Bersikap baik pada diri sendiri adalah kunci. Sadarilah bahwa hasil ujian tidak menentukan nilai diri Anda sebagai manusia seutuhnya. Berikan ruang bagi diri Anda untuk beristirahat tanpa rasa bersalah.',
  conclusion:
    'Kesehatan mental Anda jauh lebih berharga daripada angka di atas kertas. Dengan menerapkan strategi yang tepat, Anda tidak hanya dapat melewati ujian dengan lebih baik, tetapi juga membangun ketahanan mental yang akan berguna di masa depan.',
  helpfulCount: 124,
  related: [
    { id: 'meditasi-pemula', category: 'MINDFULNESS', title: 'Cara Memulai Meditasi untuk Pemula di Kampus', meta: '5 MENIT BACA' },
    { id: 'sistem-pendukung', category: 'KOMUNITAS', title: 'Membangun Sistem Pendukung Antar Teman', meta: '7 MENIT BACA' },
    { id: 'nutrisi-otak', category: 'EDUKASI', title: 'Nutrisi Otak: Makanan yang Meningkatkan Fokus', meta: '10 MENIT BACA' },
  ],
};

export async function getCategories() {
  const res = await mockDelay(DUMMY_CATEGORIES);
  return res.data;
}

export async function getHero() {
  const res = await mockDelay(DUMMY_HERO);
  return res.data;
}

export async function getStressSection() {
  const res = await mockDelay(DUMMY_STRESS_SECTION);
  return res.data;
}

export async function getSleepSection() {
  const res = await mockDelay(DUMMY_SLEEP_SECTION);
  return res.data;
}

export async function getAcademicSection() {
  const res = await mockDelay(DUMMY_ACADEMIC_SECTION);
  return res.data;
}

export async function getArticleDetail(_articleId) {
  // const res = await api.get(`/resources/articles/${articleId}`);
  const res = await mockDelay(DUMMY_ARTICLE_DETAIL);
  return res.data;
}
