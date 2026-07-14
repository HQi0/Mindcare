const mockDelay = (data, ms = 300) =>
  new Promise((resolve) => setTimeout(() => resolve({ data }), ms));

const DUMMY_PROFILE = {
  alias: 'Pahlawan Sunyi',
  subtitle: 'Mahasiswa Psikologi • Angkatan 2021',
  anonymousId: 'MC-7729',
  wellbeingScore: 82,
  wellbeingNote: 'Bagus! Kamu telah konsisten melakukan check-in selama 12 hari terakhir.',
};

const DUMMY_PRIVACY_SETTINGS = [
  { id: 'incognito', label: 'Mode Penyamaran (Incognito)', description: 'Sembunyikan aktivitas Anda dari riwayat komunitas.', enabled: true },
  { id: 'research', label: 'Berbagi Data Penelitian', description: 'Kontribusi data anonim untuk pengembangan kesehatan mental kampus.', enabled: false },
];

const DUMMY_APP_SETTINGS = [
  { id: 'darkmode', label: 'Mode Gelap', description: 'Gunakan tampilan gelap untuk mengurangi kelelahan mata.', type: 'button' },
  { id: 'language', label: 'Bahasa Aplikasi', description: 'Saat ini: Bahasa Indonesia', type: 'select', value: 'Bahasa Indonesia' },
  { id: 'notifications', label: 'Notifikasi Push', description: 'Atur jadwal pengingat untuk check-in harian.', type: 'toggle', enabled: true },
];

const DUMMY_SESSIONS = [
  { id: 's1', device: 'MacBook Pro - Safari', location: 'Jakarta, Indonesia • Aktif Sekarang' },
  { id: 's2', device: 'iPhone 13 - App', location: 'Sleman, Yogyakarta • 2 jam yang lalu' },
];

export async function getProfile() {
  const res = await mockDelay(DUMMY_PROFILE);
  return res.data;
}

export async function getPrivacySettings() {
  const res = await mockDelay(DUMMY_PRIVACY_SETTINGS);
  return res.data;
}

export async function getAppSettings() {
  const res = await mockDelay(DUMMY_APP_SETTINGS);
  return res.data;
}

export async function getActiveSessions() {
  const res = await mockDelay(DUMMY_SESSIONS);
  return res.data;
}
