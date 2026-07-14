// import api from './api'; // aktifkan saat backend siap

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
 * Registrasi akun baru.
 * @param {{ name: string, email: string, password: string }} payload
 */
export async function register(payload) {
  // const res = await api.post('/auth/register', payload);
  const res = await mockDelay({
    user: { id: 'usr_dummy', email: payload.email, name: payload.name },
    token: 'dummy-jwt-token',
  });
  return res.data;
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
