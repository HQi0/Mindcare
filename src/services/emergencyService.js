const mockDelay = (data, ms = 300) =>
  new Promise((resolve) => setTimeout(() => resolve({ data }), ms));

const DUMMY_QUICK_CONTACTS = [
  { id: 'halo-kemkes', name: 'Halo Kemkes (Bunuh Diri)', note: 'Layanan 24 Jam', phone: '1500-567', color: 'red' },
  { id: 'layanan-konseling', name: 'Layanan Konseling', note: 'Emergency Chat (MindCare)', phone: 'Chat', color: 'purple' },
];

const DUMMY_GROUNDING_STEPS = [
  { count: 5, label: 'Lihat', description: 'Benda di sekitar Anda' },
  { count: 4, label: 'Sentuh', description: 'Tekstur yang berbeda' },
  { count: 3, label: 'Dengar', description: 'Suara di sekitar Anda' },
  { count: 2, label: 'Cium', description: 'Aroma yang tercium' },
  { count: 1, label: 'Rasakan', description: 'Satu hal yang bisa dicicipi' },
];

const DUMMY_SAFETY_TIPS = [
  'Cari tempat yang tenang dan aman.',
  'Hubungi seseorang yang Anda percayai.',
  'Singkirkan benda-benda berbahaya.',
];

const DUMMY_AFFIRMATIONS = [
  'Perasaan ini hanya sementara dan akan berlalu.',
  'Saya aman saat ini, di sini.',
  'Saya berani meminta bantuan.',
];

const DUMMY_HOSPITAL = {
  name: 'RSUP Persahabatan',
  address: 'Jl. Persahabatan Raya No. 1, Rawamangun, Jakarta Timur',
  phone: '(021) 4891708',
  distance: '1.2 KM',
};

export async function getQuickContacts() {
  const res = await mockDelay(DUMMY_QUICK_CONTACTS);
  return res.data;
}

export async function getGroundingSteps() {
  const res = await mockDelay(DUMMY_GROUNDING_STEPS);
  return res.data;
}

export async function getSafetyTips() {
  const res = await mockDelay(DUMMY_SAFETY_TIPS);
  return res.data;
}

export async function getAffirmations() {
  const res = await mockDelay(DUMMY_AFFIRMATIONS);
  return res.data;
}

export async function getNearestHospital() {
  const res = await mockDelay(DUMMY_HOSPITAL);
  return res.data;
}
