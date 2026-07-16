import { supabase } from '../lib/supabaseClient';
import { getCurrentDatabaseUser } from './authService.js';

export const ASSESSMENTS_DATA = {
  'phq-9': {
    title: 'PHQ-9 (Kuesioner Kesehatan Pasien)',
    description: 'Skrining untuk mendeteksi gejala depresi dan tingkat keparahannya.',
    type: 'phq9',
    questions: [
      'Kurang berminat atau bergairah dalam melakukan apapun.',
      'Merasa murung, sedih, atau putus asa.',
      'Sulit tidur/tetap tidur, atau tidur terlalu banyak.',
      'Merasa lelah atau kurang tenaga.',
      'Kurang nafsu makan atau makan terlalu banyak.',
      'Merasa buruk tentang diri sendiri — atau merasa gagal atau mengecewakan diri atau keluarga.',
      'Sulit berkonsentrasi pada sesuatu, seperti membaca koran atau menonton TV.',
      'Bergerak atau berbicara sangat lambat sehingga orang lain memperhatikannya. Atau sebaliknya — gelisah atau resah sehingga bergerak lebih sering dari biasanya.',
      'Merasa lebih baik mati atau ingin melukai diri sendiri dengan cara apapun.'
    ],
    options: [
      { text: 'Tidak pernah', score: 0 },
      { text: 'Beberapa hari', score: 1 },
      { text: 'Lebih dari separuh waktu', score: 2 },
      { text: 'Hampir setiap hari', score: 3 }
    ],
    getSeverity: (score) => {
      if (score <= 4) return { level: 'minimal', text: 'Minimal' };
      if (score <= 9) return { level: 'ringan', text: 'Ringan' };
      if (score <= 14) return { level: 'sedang', text: 'Sedang' };
      if (score <= 19) return { level: 'cukup berat', text: 'Cukup Berat' };
      return { level: 'berat', text: 'Berat' };
    }
  },
  'gad-7': {
    title: 'GAD-7 (Gangguan Kecemasan Umum)',
    description: 'Alat skrining cepat untuk mengukur tingkat keparahan kecemasan.',
    type: 'gad7',
    questions: [
      'Merasa gugup, cemas, atau tegang.',
      'Tidak mampu menghentikan atau mengendalikan kekhawatiran.',
      'Terlalu khawatir tentang berbagai hal.',
      'Sulit untuk bersantai.',
      'Sangat gelisah sehingga sulit duduk diam.',
      'Mudah menjadi jengkel atau marah.',
      'Merasa takut seolah-olah sesuatu yang buruk akan terjadi.'
    ],
    options: [
      { text: 'Tidak pernah', score: 0 },
      { text: 'Beberapa hari', score: 1 },
      { text: 'Lebih dari separuh waktu', score: 2 },
      { text: 'Hampir setiap hari', score: 3 }
    ],
    getSeverity: (score) => {
      if (score <= 4) return { level: 'minimal', text: 'Minimal' };
      if (score <= 9) return { level: 'ringan', text: 'Ringan' };
      if (score <= 14) return { level: 'sedang', text: 'Sedang' };
      return { level: 'berat', text: 'Berat' };
    }
  }
};

const BASE_CARDS = [
  {
    id: 'phq-9',
    category: 'KESEHATAN MENTAL DASAR',
    categoryColor: 'text-dash-primary',
    title: 'PHQ-9 (Depresi)',
    time: '5 Menit',
    description: 'Instrumen standar emas untuk mendeteksi gejala depresi dan memantau respons terhadap pengobatan. Digunakan secara klinis di seluruh dunia.',
    questionCount: '9 Pertanyaan Klinis',
    size: 'lg',
  },
  {
    id: 'gad-7',
    category: 'KECEMASAN',
    categoryColor: 'text-dash-moodBlue',
    title: 'GAD-7',
    time: '4 Menit',
    description: 'Alat skrining cepat untuk mengukur tingkat keparahan gangguan kecemasan umum dalam 2 minggu terakhir.',
    questionCount: '7 Pertanyaan Klinis',
    size: 'md',
  },
  {
    id: 'pss',
    category: 'TEKANAN HIDUP',
    categoryColor: 'text-[#0051b1]',
    title: 'PSS (Skala Stres Terasa)',
    time: '7 Menit',
    description: 'Mengukur sejauh mana situasi dalam hidup Anda dinilai sebagai stres berlebihan selama satu bulan terakhir.',
    questionCount: '10 Pertanyaan',
    status: 'Segera Hadir',
    statusColor: 'text-dash-muted',
    progress: null,
    buttonLabel: 'Nantikan',
    outlined: true,
  }
];

function timeSince(dateStr) {
  const date = new Date(dateStr);
  const seconds = Math.floor((new Date() - date) / 1000);
  let interval = seconds / 86400;
  if (interval >= 1) return Math.floor(interval) + " Hari Lalu";
  interval = seconds / 3600;
  if (interval >= 1) return Math.floor(interval) + " Jam Lalu";
  interval = seconds / 60;
  if (interval >= 1) return Math.floor(interval) + " Menit Lalu";
  return "Baru Saja";
}

export async function getAssessments() {
  const user = await getCurrentDatabaseUser();
  
  // Clone cards to not mutate base config
  const cards = JSON.parse(JSON.stringify(BASE_CARDS));

  if (!user) {
    cards[0].status = 'Belum Dimulai';
    cards[0].statusColor = 'text-dash-primary';
    cards[0].buttonLabel = 'Mulai Asesmen';

    cards[1].status = 'Belum Dimulai';
    cards[1].statusColor = 'text-dash-primary';
    cards[1].buttonLabel = 'Mulai Asesmen';
    return cards;
  }

  // Fetch history for user
  const { data } = await supabase
    .from('assessments')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const history = data || [];

  // PHQ-9 Check
  const lastPhq9 = history.find(h => h.type === 'phq9');
  if (lastPhq9) {
    cards[0].status = `Terakhir: ${timeSince(lastPhq9.created_at)}`;
    cards[0].statusColor = 'text-dash-success';
    cards[0].progress = 100;
    cards[0].buttonLabel = 'Ulangi Asesmen';
    cards[0].lastResult = lastPhq9;
  } else {
    cards[0].status = 'Belum Dimulai';
    cards[0].statusColor = 'text-dash-primary';
    cards[0].buttonLabel = 'Mulai Asesmen';
  }

  // GAD-7 Check
  const lastGad7 = history.find(h => h.type === 'gad7');
  if (lastGad7) {
    cards[1].status = `Terakhir: ${timeSince(lastGad7.created_at)}`;
    cards[1].statusColor = 'text-dash-success';
    cards[1].progress = 100;
    cards[1].buttonLabel = 'Ulangi Asesmen';
    cards[1].lastResult = lastGad7;
  } else {
    cards[1].status = 'Belum Dimulai';
    cards[1].statusColor = 'text-dash-primary';
    cards[1].buttonLabel = 'Mulai Asesmen';
  }

  // Keep PSS disabled logic handled by UI or generic
  cards[2].buttonLabel = 'Segera Hadir';
  
  return cards;
}

export async function saveAssessment(assessmentId, answersArray) {
  const user = await getCurrentDatabaseUser();
  if (!user) throw new Error("Harap login terlebih dahulu.");

  const testConfig = ASSESSMENTS_DATA[assessmentId];
  if (!testConfig) throw new Error("Asesmen tidak ditemukan.");

  const score = answersArray.reduce((sum, val) => sum + val, 0);
  const severity = testConfig.getSeverity(score);

  let recommendation = "Tetap jaga kesehatan mentalmu.";
  if (severity.level === 'sedang' || severity.level === 'berat' || severity.level === 'cukup berat') {
    recommendation = "Kami menyarankan Anda untuk berkonsultasi dengan profesional atau konselor kami.";
  }

  const { data, error } = await supabase
    .from('assessments')
    .insert([
      {
        user_id: user.id,
        type: testConfig.type,
        answers: answersArray,
        score: score,
        severity_level: severity.level,
        recommendation: recommendation
      }
    ])
    .select()
    .single();

  if (error) throw new Error(error.message);

  return { success: true, result: data, severityText: severity.text };
}
