const mockDelay = (data, ms = 300) =>
  new Promise((resolve) => setTimeout(() => resolve({ data }), ms));

const DUMMY_ASSESSMENTS = [
  {
    id: 'phq-9',
    category: 'KESEHATAN MENTAL DASAR',
    categoryColor: 'text-dash-primary',
    title: 'PHQ-9 (Kuesioner Kesehatan Pasien)',
    time: '5 Menit',
    description:
      'Instrumen standar emas untuk mendeteksi gejala depresi dan memantau respons terhadap pengobatan. Digunakan secara klinis di seluruh dunia.',
    questionCount: '9 Pertanyaan Klinis',
    status: 'Belum Dimulai',
    statusColor: 'text-dash-primary',
    progress: 0,
    buttonLabel: 'Mulai Asesmen',
    size: 'lg',
  },
  {
    id: 'gad-7',
    category: 'KECEMASAN',
    categoryColor: 'text-dash-moodBlue',
    title: 'GAD-7',
    time: '4 Menit',
    description:
      'Alat skrining cepat untuk mengukur tingkat keparahan gangguan kecemasan umum dalam 2 minggu terakhir.',
    questionCount: '7 Pertanyaan Klinis',
    status: 'Lanjutkan (40%)',
    statusColor: 'text-dash-success',
    progress: 40,
    buttonLabel: 'Mulai Asesmen',
    size: 'md',
  },
  {
    id: 'pss',
    category: 'TEKANAN HIDUP',
    categoryColor: 'text-[#0051b1]',
    title: 'PSS (Skala Stres Terasa)',
    time: '7 Menit',
    description:
      'Mengukur sejauh mana situasi dalam hidup Anda dinilai sebagai stres berlebihan selama satu bulan terakhir.',
    questionCount: '10 Pertanyaan',
    status: 'Terakhir: 3 Minggu Lalu',
    statusColor: 'text-dash-muted',
    progress: null,
    buttonLabel: 'Ulangi Asesmen',
    outlined: true,
  },
  {
    id: 'academic-stress',
    category: 'KEBUTUHAN MAHASISWA',
    categoryColor: 'text-dash-amber',
    title: 'Skala Stres Akademik',
    time: '6 Menit',
    description:
      'Menilai tekanan yang berkaitan dengan beban kuliah, ujian, dan ekspektasi akademik di lingkungan universitas.',
    questionCount: '12 Pertanyaan Spesifik',
    status: 'Baru Tersedia',
    statusColor: 'text-dash-muted',
    progress: 0,
    buttonLabel: 'Mulai Asesmen',
  },
];

export async function getAssessments() {
  // const res = await api.get('/assessments');
  const res = await mockDelay(DUMMY_ASSESSMENTS);
  return res.data;
}
