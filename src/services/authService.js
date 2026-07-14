import { supabase } from '../lib/supabaseClient'; // Pastikan jalur foldernya benar mengarah ke file inisialisasi Supabase kamu

const mockDelay = (data, ms = 500) =>
  new Promise((resolve) => setTimeout(() => resolve({ data }), ms));

/**
 * Login dengan email & password.
 * @param {{ email: string, password: string }} payload
 */
export async function login(payload) {
  // Ketika backend siap:
  // const res = await api.post('/auth/login', payload);
  // return res.data;
  const res = await mockDelay({
    user: { id: 'usr_dummy', email: payload.email, name: 'Mahasiswa Dummy' },
    token: 'dummy-jwt-token',
  });
  return res.data;
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

  // Mengembalikan format struktur data token dan user agar cocok dengan RegisterForm
  return {
    token: data?.session?.access_token || 'email_confirmation_required',
    user: data.user
  };
}

/** Masuk sebagai tamu anonim, tanpa perlu akun. */
export async function loginAsGuest() {
  // const res = await api.post('/auth/guest');
  const res = await mockDelay({
    user: { id: 'usr_guest', name: 'Tamu Anonim' },
    token: 'dummy-guest-token',
  });
  return res.data;
}

export async function logout() {
  localStorage.removeItem('mindcare_token');
}