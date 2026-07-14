/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1a58b7', // biru utama (button, heading angka)
          light: '#3d72d2',   // biru ikon/aksen
          soft: '#80aefe',    // biru muda (badge, background)
        },
        ink: {
          DEFAULT: '#111c2d', // teks heading utama
          muted: '#424752',   // teks paragraf/deskripsi
        },
        border: {
          DEFAULT: '#c3c6d4',
        },
        surface: {
          DEFAULT: '#ffffff',
          soft: '#f9f9ff',
          tint: '#f0f3ff',
          tint2: '#e7eeff',
        },
        // Palet khusus halaman Autentikasi — sengaja berbeda dari token
        // di atas karena Figma memang mendesainnya dengan warna sendiri.
        auth: {
          primary: '#004ac6',
          muted: '#434655',
          border: '#c3c6d7',
          input: '#f2f4f6',
          card: '#d1e4f5',
          label: '#737686',
        },
        // Palet untuk shell aplikasi (Sidebar, Topbar) & konten dashboard
        dash: {
          sidebar: '#f7f9fb',
          border: '#e5e7eb',
          text: '#191c1e',
          muted: '#434655',
          primary: '#004ac6',
          linkMuted: '#6b93b8',
          success: '#22c55e',
          danger: '#ba1a1a',
          dangerBg: '#fef2f2',
          amber: '#f59e0b',
          moodBlue: '#445c9c',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl2: '16px',
        '2xl2': '24px',
        '3xl2': '32px',
      },
      maxWidth: {
        content: '1200px',
      },
    },
  },
  plugins: [],
};
