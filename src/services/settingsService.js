import { getCurrentDatabaseUser } from './authService.js';
import { supabase } from '../lib/supabaseClient.js';

const mockDelay = (data, ms = 300) =>
  new Promise((resolve) => setTimeout(() => resolve({ data }), ms));

const DUMMY_PROFILE = {
  alias: 'Pengguna MindCare',
  subtitle: 'Akun aktif',
  anonymousId: 'MC-7729',
  wellbeingScore: 0,
  wellbeingNote: 'Belum ada data yang cukup untuk menilai kesejahteraan Anda.',
};

const DUMMY_PRIVACY_SETTINGS = [
  { id: 'incognito', label: 'Mode Penyamaran (Incognito)', description: 'Sembunyikan aktivitas Anda dari riwayat komunitas.', enabled: true },
  { id: 'research', label: 'Berbagi Data Penelitian', description: 'Kontribusi data anonim untuk pengembangan kesehatan mental kampus.', enabled: false },
];

const DUMMY_APP_SETTINGS = [
  { id: 'darkmode', label: 'Mode Gelap', description: 'Gunakan tampilan gelap untuk mengurangi kelelahan mata.', enabled: false },
  { id: 'language', label: 'Bahasa Aplikasi', description: 'Saat ini: Bahasa Indonesia', type: 'select', value: 'Bahasa Indonesia' },
  { id: 'notifications', label: 'Notifikasi Push', description: 'Atur jadwal pengingat untuk check-in harian.', enabled: true },
];

const DUMMY_SESSIONS = [
  { id: 's1', device: 'MacBook Pro - Safari', location: 'Jakarta, Indonesia • Aktif Sekarang' },
  { id: 's2', device: 'iPhone 13 - App', location: 'Sleman, Yogyakarta • 2 jam yang lalu' },
];

const MOOD_SCORES = {
  'sangat_senang': 100,
  'senang': 80,
  'netral': 60,
  'sedih': 40,
  'sangat_sedih': 20
};

async function calculateWellbeing(userId) {
  // 1. Ambil data mood 14 hari terakhir
  const fourteenDaysAgo = new Date();
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

  const { data: moods } = await supabase
    .from('mood_entries')
    .select('mood')
    .eq('user_id', userId)
    .gte('created_at', fourteenDaysAgo.toISOString());

  // 2. Ambil assessment terakhir (PHQ-9/GAD-7)
  const { data: assessments } = await supabase
    .from('assessments')
    .select('severity_level')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1);

  // Jika tidak ada data sama sekali
  if (!moods?.length && !assessments?.length) {
    return {
      score: 50,
      note: 'Kami belum punya cukup data. Yuk, mulai rutin catat suasana hatimu!'
    };
  }

  // Hitung rata-rata mood
  let baseScore = 50;
  if (moods?.length > 0) {
    const totalScore = moods.reduce((acc, curr) => acc + (MOOD_SCORES[curr.mood] || 60), 0);
    baseScore = Math.round(totalScore / moods.length);
  }

  // Penyesuaian dari assessment terakhir
  let penalty = 0;
  if (assessments?.length > 0) {
    const severity = assessments[0].severity_level?.toLowerCase();
    if (severity === 'berat') penalty = 20;
    else if (severity === 'sedang') penalty = 10;
  }

  let finalScore = Math.max(0, Math.min(100, baseScore - penalty));

  // Tentukan teks catatan (note)
  let note = '';
  if (finalScore >= 80) {
    note = 'Kondisi Anda sangat baik! Pertahankan rutinitas check-in dan pikiran positif Anda.';
  } else if (finalScore >= 60) {
    note = 'Anda cukup stabil, luangkan sedikit waktu untuk relaksasi minggu ini.';
  } else {
    note = 'Sepertinya minggu ini cukup berat. Jangan ragu menjadwalkan sesi dengan konselor kami.';
  }

  return { score: finalScore, note };
}

export async function getProfile() {
  const storedUser = await getCurrentDatabaseUser();
  if (!storedUser) return DUMMY_PROFILE;

  try {
    const { data: profileData, error } = await supabase
      .from('profiles')
      .select('full_name, anonymous_id, avatar_url')
      .eq('id', storedUser.id)
      .single();

    if (error) throw error;

    // Hitung wellbeing dinamis
    const dynamicWellbeing = await calculateWellbeing(storedUser.id);

    return {
      alias: profileData?.full_name || storedUser.fullName || DUMMY_PROFILE.alias,
      subtitle: storedUser.email || DUMMY_PROFILE.subtitle,
      anonymousId: profileData?.anonymous_id || DUMMY_PROFILE.anonymousId,
      wellbeingScore: dynamicWellbeing.score,
      wellbeingNote: dynamicWellbeing.note,
      avatar_url: profileData?.avatar_url || null,
    };
  } catch (err) {
    console.error('Error fetching profile from Supabase:', err);
    return {
      ...DUMMY_PROFILE,
      alias: storedUser?.fullName || DUMMY_PROFILE.alias,
      subtitle: storedUser?.email || DUMMY_PROFILE.subtitle,
    };
  }
}

export async function updateProfile(alias, subtitle, avatarFile) {
  const storedUser = await getCurrentDatabaseUser();
  if (!storedUser || storedUser.id === 'usr_guest') {
    throw new Error('Anda harus login untuk mengubah profil');
  }

  let avatarUrl = undefined;

  // 1. Upload foto profil jika ada
  if (avatarFile) {
    const fileExt = avatarFile.name.split('.').pop();
    const fileName = `${storedUser.id}-${Date.now()}.${fileExt}`;
    const filePath = `${storedUser.id}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, avatarFile, { upsert: true });

    if (uploadError) {
      throw new Error(`Gagal mengunggah foto profil: ${uploadError.message}`);
    }

    // Dapatkan public URL
    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
    avatarUrl = data.publicUrl;
  }

  // 2. Update tabel profiles
  const updates = {
    full_name: alias,
  };
  
  if (avatarUrl) {
    updates.avatar_url = avatarUrl;
  }

  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', storedUser.id);

  if (error) {
    throw new Error(`Gagal menyimpan profil: ${error.message}`);
  }

  // Opsional: update user metadata di auth jika perlu konsistensi
  await supabase.auth.updateUser({
    data: { full_name: alias }
  });
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
  const storedUser = await getCurrentDatabaseUser();
  if (!storedUser) return DUMMY_SESSIONS;

  try {
    const { data, error } = await supabase
      .from('user_sessions')
      .select('id, device, last_active, created_at')
      .eq('user_id', storedUser.id)
      .eq('is_active', true)
      .order('last_active', { ascending: false });

    if (error) throw error;
    if (!data || data.length === 0) return [];

    return data.map((session, index) => ({
      id: session.id,
      device: session.device,
      // For now, location is hidden as requested
      location: index === 0 ? 'Sesi Saat Ini' : `Aktif sejak ${new Date(session.created_at).toLocaleDateString()}`
    }));
  } catch (err) {
    console.error('Error fetching sessions from Supabase:', err);
    // Tampilkan error langsung ke UI agar kita bisa melihat penyebabnya
    return [{
      id: 'error-1',
      device: 'Database Error',
      location: err.message || JSON.stringify(err)
    }];
  }
}
