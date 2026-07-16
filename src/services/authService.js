import { supabase } from '../lib/supabaseClient'; // Pastikan jalur foldernya benar mengarah ke file inisialisasi Supabase kamu

const mockDelay = (data, ms = 500) =>
  new Promise((resolve) => setTimeout(() => resolve({ data }), ms));

const AUTH_TOKEN_KEY = 'mindcare_token';

function buildDisplayName(user) {
  if (user?.full_name) return user.full_name;
  if (user?.user_metadata?.full_name) return user.user_metadata.full_name;
  if (user?.user_metadata?.name) return user.user_metadata.name;
  if (user?.name) return user.name;

  const emailName = user?.email?.split('@')?.[0];
  if (!emailName) return 'Pengguna MindCare';

  return emailName
    .replace(/[._-]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getDeviceInfo() {
  const ua = navigator.userAgent || '';
  let browser = 'Unknown Browser';
  let os = 'Unknown OS';

  if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Edg/')) browser = 'Edge';
  else if (ua.includes('Chrome')) browser = 'Chrome';
  else if (ua.includes('Safari')) browser = 'Safari';

  if (ua.includes('Win')) os = 'Windows';
  else if (ua.includes('Mac')) os = 'Mac/iOS';
  else if (ua.includes('Linux')) os = 'Linux';
  else if (ua.includes('Android')) os = 'Android';

  return `${os} - ${browser}`;
}

function normalizeUser(user, fallbackEmail) {
  const email = user?.email ?? fallbackEmail ?? '';
  const fullName = buildDisplayName({ ...user, email });

  return {
    id: user?.id ?? 'usr_dummy',
    email,
    name: fullName,
    fullName,
  };
}

export function setStoredAuth({ token, user }) {
  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  }
}

export function clearStoredAuth() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

export async function getCurrentDatabaseUser() {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    throw new Error(error.message);
  }

  if (!data?.user) {
    return null;
  }

  return normalizeUser(data.user);
}

/**
 * Login dengan email & password.
 * @param {{ email: string, password: string }} payload
 */
export async function login(payload) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: payload.email,
    password: payload.password,
  });

  if (error) {
    throw new Error(error.message);
  }

  const user = normalizeUser(data.user);
  const token = data?.session?.access_token || '';

  if (user.id !== 'usr_dummy') {
    // Simpan sesi login ke tabel user_sessions
    await supabase.from('user_sessions').insert({
      user_id: user.id,
      device: getDeviceInfo(),
      is_active: true
    });
  }

  setStoredAuth({ token, user });

  return { user, token };
}

/**
 * Registrasi akun baru menggunakan Supabase Auth.
 * @param {{ name: string, email: string, password: string }} payload
 */
export async function register(payload) {
  // 1. Validasi dasar format email
  if (!payload.email || !payload.email.includes('@')) {
    throw new Error('Format email tidak valid.');
  }

  // 2. Kirim data pendaftaran ke Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email: payload.email,
    password: payload.password,
    options: {
      data: {
        full_name: payload.name // Disimpan ke metadata agar dibaca trigger SQL profiles otomatis
      }
    }
  });

  if (error) {
    throw new Error(error.message);
  }

  const user = normalizeUser(data.user ?? {
    id: data.user?.id,
    email: payload.email,
    user_metadata: { full_name: payload.name },
  });

  setStoredAuth({ token: data?.session?.access_token, user });

  // Mengembalikan format struktur data token dan user agar cocok dengan RegisterForm
  return {
    token: data?.session?.access_token || 'email_confirmation_required',
    user,
  };
}

/** Masuk sebagai tamu anonim, tanpa perlu akun. */
export async function loginAsGuest() {
  // const res = await api.post('/auth/guest');
  const res = await mockDelay({
    user: { id: 'usr_guest', name: 'Tamu Anonim', fullName: 'Tamu Anonim' },
    token: 'dummy-guest-token',
  });
  return res.data;
}

export async function logout() {
  const { data } = await supabase.auth.getUser();
  if (data?.user) {
    // Set semua sesi user menjadi tidak aktif
    await supabase
      .from('user_sessions')
      .update({ is_active: false })
      .eq('user_id', data.user.id);
  }

  await supabase.auth.signOut();
  clearStoredAuth();
}