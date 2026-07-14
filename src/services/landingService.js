// NOTE: import instance axios di bawah ini akan dipakai kembali
// begitu endpoint backend tersedia (lihat komentar di tiap function).
// import api from './api';

// ------------------------------------------------------------------
// DUMMY DATA
// Data di bawah ini sementara bersifat statis (sesuai desain Figma).
// Ketika backend sudah menyediakan endpoint konten landing page
// (misalnya untuk mengelola testimoni atau statistik secara dinamis),
// cukup ganti isi function di bagian "EXPORTED FUNCTIONS" tanpa
// mengubah komponen yang memakainya.
// ------------------------------------------------------------------

const DUMMY_STATS = [
  { id: 'stat-1', value: '50k+', label: 'Mahasiswa Terbantu' },
  { id: 'stat-2', value: '100%', label: 'Kerahasiaan Terjamin' },
  { id: 'stat-3', value: '200+', label: 'Konselor Profesional' },
  { id: 'stat-4', value: '24/7', label: 'Dukungan Siaga' },
];

const DUMMY_FEATURES = [
  {
    id: 'feature-1',
    icon: 'shield-check',
    title: 'Anonimitas Penuh',
    description:
      'Anda bebas bercerita tanpa takut dihakimi. Identitas Anda terenkripsi dan tidak pernah dibagikan kepada siapapun, termasuk pihak universitas.',
    hasImage: true,
    size: 'lg',
  },
  {
    id: 'feature-2',
    icon: 'wifi',
    title: 'Hemat Data',
    description:
      'Aplikasi ringan yang dioptimalkan untuk koneksi internet minim sekalipun, memastikan bantuan selalu ada saat dibutuhkan.',
    hasImage: false,
    size: 'sm',
  },
  {
    id: 'feature-3',
    icon: 'users',
    title: 'Konselor Ahli',
    description:
      'Tim psikolog dan konselor berlisensi yang memahami dinamika kehidupan kampus secara mendalam.',
    hasImage: false,
    size: 'sm',
  },
  {
    id: 'feature-4',
    icon: 'accessibility',
    title: 'Aksesibilitas',
    description:
      'Dirancang dengan standar inklusivitas tinggi, memudahkan navigasi bagi setiap mahasiswa tanpa hambatan visual atau teknis.',
    hasImage: true,
    size: 'lg',
  },
];

const DUMMY_STEPS = [
  {
    id: 'step-1',
    number: 1,
    title: 'Daftar Akun',
    description: 'Gunakan email kampus Anda untuk verifikasi status mahasiswa secara aman.',
  },
  {
    id: 'step-2',
    number: 2,
    title: 'Pilih Konselor',
    description: 'Temukan partner bicara yang sesuai dengan topik yang ingin Anda bahas.',
  },
  {
    id: 'step-3',
    number: 3,
    title: 'Mulai Sesi',
    description: 'Berbagi cerita kapan saja dan di mana saja melalui chat atau video call.',
  },
];

const DUMMY_BENEFITS = [
  {
    id: 'benefit-1',
    icon: 'heart-pulse',
    title: 'Kesehatan Mental Lebih Baik',
    description:
      'Kelola kecemasan, stres, dan kelelahan akademik dengan teknik yang teruji secara profesional.',
  },
  {
    id: 'benefit-2',
    icon: 'brain',
    title: 'Peningkatan Fokus Akademik',
    description: 'Pikiran yang tenang membantu Anda menyerap materi kuliah lebih efektif dan efisien.',
  },
  {
    id: 'benefit-3',
    icon: 'users-round',
    title: 'Komunitas yang Aman',
    description:
      'Terhubung dengan sesama mahasiswa yang memiliki perjuangan serupa dalam wadah yang positif.',
  },
];

const DUMMY_TESTIMONIALS = [
  {
    id: 'testi-1',
    rating: 5,
    quote:
      'MindCare sangat membantu saya saat menghadapi burnout skripsi. Konselornya sangat sabar dan fiturnya benar-benar menjaga privasi saya.',
    initials: 'AN',
    name: 'Mahasiswa Teknik, Jakarta',
    color: 'primary-light',
  },
  {
    id: 'testi-2',
    rating: 5,
    quote:
      'Fitur chat anonimnya yang terbaik. Saya tidak perlu merasa malu untuk curhat masalah keluarga yang mengganggu konsentrasi belajar saya.',
    initials: 'RA',
    name: 'Mahasiswa Kedokteran, Surabaya',
    color: 'primary-soft',
  },
  {
    id: 'testi-3',
    rating: 5,
    quote:
      'Biayanya sangat terjangkau bagi kantong mahasiswa, bahkan banyak program gratisnya. MindCare adalah penyelamat di masa pandemi kemarin.',
    initials: 'MI',
    name: 'Mahasiswa Sastra, Bandung',
    color: 'slate',
  },
];

const DUMMY_TRUST_BADGES = [
  { id: 'trust-1', icon: 'lock', label: 'PRIVASI TERJAMIN' },
  { id: 'trust-2', icon: 'user-check', label: '100% ANONIM' },
  { id: 'trust-3', icon: 'badge-check', label: 'KONSELOR PROFESIONAL' },
  { id: 'trust-4', icon: 'signal-low', label: 'LOW DATA USAGE' },
];

const DUMMY_FAQS = [
  {
    id: 'faq-1',
    question: 'Apakah identitas saya benar-benar anonim?',
    answer:
      'Ya, MindCare menggunakan enkripsi end-to-end. Kami tidak menyimpan data pribadi yang bisa mengidentifikasi Anda secara langsung kepada konselor kecuali jika Anda memilih untuk membagikannya.',
  },
  {
    id: 'faq-2',
    question: 'Bagaimana kualitas konselor di MindCare?',
    answer:
      'Seluruh konselor kami adalah psikolog dan konselor berlisensi resmi yang telah melalui proses seleksi dan pelatihan khusus untuk menangani isu-isu kehidupan mahasiswa.',
  },
  {
    id: 'faq-3',
    question: 'Apakah layanan ini berbayar?',
    answer:
      'MindCare menyediakan sejumlah layanan dasar secara gratis untuk mahasiswa terverifikasi, dengan opsi sesi lanjutan berbayar dengan harga terjangkau.',
  },
  {
    id: 'faq-4',
    question: 'Bagaimana jika saya dalam keadaan darurat?',
    answer:
      'Gunakan tombol "Bantuan Darurat" yang tersedia di dalam aplikasi untuk terhubung langsung dengan hotline krisis 24/7.',
  },
];

// ------------------------------------------------------------------
// SIMULASI LATENSI NETWORK (agar behaviour mirip pemanggilan API asli)
// ------------------------------------------------------------------
const mockDelay = (data, ms = 300) =>
  new Promise((resolve) => setTimeout(() => resolve({ data }), ms));

// ------------------------------------------------------------------
// EXPORTED FUNCTIONS
// Komponen HANYA boleh memanggil function-function di bawah ini,
// tidak boleh mengakses DUMMY_* secara langsung ataupun melakukan
// axios.get(...) langsung di dalam komponen.
// ------------------------------------------------------------------

export async function getStats() {
  // Ketika backend siap:
  // const res = await api.get('/landing/stats');
  // return res.data;
  const res = await mockDelay(DUMMY_STATS);
  return res.data;
}

export async function getFeatures() {
  // const res = await api.get('/landing/features');
  const res = await mockDelay(DUMMY_FEATURES);
  return res.data;
}

export async function getHowItWorksSteps() {
  // const res = await api.get('/landing/how-it-works');
  const res = await mockDelay(DUMMY_STEPS);
  return res.data;
}

export async function getBenefits() {
  // const res = await api.get('/landing/benefits');
  const res = await mockDelay(DUMMY_BENEFITS);
  return res.data;
}

export async function getTestimonials() {
  // const res = await api.get('/landing/testimonials');
  const res = await mockDelay(DUMMY_TESTIMONIALS);
  return res.data;
}

export async function getTrustBadges() {
  // const res = await api.get('/landing/trust-badges');
  const res = await mockDelay(DUMMY_TRUST_BADGES);
  return res.data;
}

export async function getFaqs() {
  // const res = await api.get('/landing/faqs');
  const res = await mockDelay(DUMMY_FAQS);
  return res.data;
}
