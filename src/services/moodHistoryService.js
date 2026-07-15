import { supabase } from '../lib/supabaseClient';
import { getCurrentDatabaseUser } from './authService.js';

const mockDelay = (data, ms = 300) =>
  new Promise((resolve) => setTimeout(() => resolve({ data }), ms));

// Helper: Pemetaan nilai mood
const DB_MOOD_TO_SCORE = {
  'sangat_sedih': 1,
  'sedih': 2,
  'netral': 3,
  'senang': 4,
  'sangat_senang': 5
};

const DB_MOOD_TO_LABEL = {
  'sangat_sedih': 'Sangat Sedih',
  'sedih': 'Sedih',
  'netral': 'Netral',
  'senang': 'Senang',
  'sangat_senang': 'Sangat Senang'
};

const DB_MOOD_TO_CALENDAR_KEY = {
  'sangat_sedih': 'sedih',
  'sedih': 'sedih',
  'netral': 'netral',
  'senang': 'senang',
  'sangat_senang': 'senang'
};

const DB_MOOD_TO_TAGS = {
  'sangat_sedih': ['#Down', '#ButuhIstirahat'],
  'sedih': ['#Sedih', '#Lelah'],
  'netral': ['#BiasaAja', '#Rutinitas'],
  'senang': ['#Happy', '#Produktif'],
  'sangat_senang': ['#SangatHappy', '#LuarBiasa']
};

export async function getCalendarData() {
  const user = await getCurrentDatabaseUser();
  if (!user) return {};

  const date = new Date();
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);

  const { data } = await supabase
    .from('mood_entries')
    .select('mood, created_at')
    .eq('user_id', user.id)
    .gte('created_at', firstDay.toISOString())
    .lte('created_at', lastDay.toISOString())
    .order('created_at', { ascending: true });

  const result = {};
  if (data) {
    data.forEach(entry => {
      const d = new Date(entry.created_at).getDate();
      // Menyimpan mood terakhir pada hari itu
      result[d] = DB_MOOD_TO_CALENDAR_KEY[entry.mood] || 'netral';
    });
  }
  
  return result;
}

export async function getMoodTrend() {
  const user = await getCurrentDatabaseUser();
  if (!user) return [];

  // Ambil data 30 hari terakhir
  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);

  const { data } = await supabase
    .from('mood_entries')
    .select('mood, created_at')
    .eq('user_id', user.id)
    .gte('created_at', thirtyDaysAgo.toISOString())
    .order('created_at', { ascending: true });

  if (!data || data.length === 0) {
    return [];
  }

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  
  return data.map(entry => {
    const d = new Date(entry.created_at);
    // Asumsi chart intensity maksimal 10, sehingga score (1-5) dikali 2
    return {
      date: `${d.getDate()} ${months[d.getMonth()]}`,
      intensity: (DB_MOOD_TO_SCORE[entry.mood] || 3) * 2 
    };
  });
}

export async function getMostFrequentMood() {
  const user = await getCurrentDatabaseUser();
  if (!user) return { mood: 'Belum ada data', count: 0, percentage: 0 };

  const date = new Date();
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);

  const { data } = await supabase
    .from('mood_entries')
    .select('mood')
    .eq('user_id', user.id)
    .gte('created_at', firstDay.toISOString());

  if (!data || data.length === 0) {
    return { mood: 'Belum ada data', count: 0, percentage: 0 };
  }

  const counts = {};
  let maxMood = '';
  let maxCount = 0;

  data.forEach(entry => {
    counts[entry.mood] = (counts[entry.mood] || 0) + 1;
    if (counts[entry.mood] > maxCount) {
      maxCount = counts[entry.mood];
      maxMood = entry.mood;
    }
  });

  const percentage = Math.round((maxCount / data.length) * 100);

  return {
    mood: DB_MOOD_TO_LABEL[maxMood] || 'Netral',
    count: maxCount,
    percentage: percentage
  };
}

// Fungsi pembantu untuk menghitung rata-rata skor mood dalam rentang tanggal
async function getAverageMood(userId, startDate, endDate) {
  const { data } = await supabase
    .from('mood_entries')
    .select('mood')
    .eq('user_id', userId)
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString());

  if (!data || data.length === 0) return null;

  const totalScore = data.reduce((sum, entry) => sum + (DB_MOOD_TO_SCORE[entry.mood] || 3), 0);
  return totalScore / data.length;
}

export async function getImprovementStats() {
  const user = await getCurrentDatabaseUser();
  if (!user) return { percentage: 0, label: 'Belum cukup data', direction: 'up' };

  const today = new Date();
  const lastWeek = new Date();
  lastWeek.setDate(today.getDate() - 7);
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(lastWeek.getDate() - 7);

  const currentAvg = await getAverageMood(user.id, lastWeek, today);
  const previousAvg = await getAverageMood(user.id, twoWeeksAgo, lastWeek);

  if (currentAvg === null || previousAvg === null) {
    return { percentage: 0, label: 'Kumpulkan data minggu ini', direction: 'up' };
  }

  const diff = currentAvg - previousAvg;
  // Ubah beda rata-rata (skala 5) menjadi persentase peningkatan/penurunan relatif terhadap skor sebelumnya
  const percentage = Math.round(Math.abs(diff / previousAvg) * 100);
  
  return {
    percentage: percentage > 100 ? 100 : percentage, // Cap di 100%
    label: diff >= 0 ? 'Mood Anda meningkat' : 'Mood Anda menurun',
    direction: diff >= 0 ? 'up' : 'down'
  };
}

export async function getWeeklyTrendAnalysis() {
  const user = await getCurrentDatabaseUser();
  if (!user) return { text: 'Belum ada data cukup untuk dianalisis.' };

  const stats = await getImprovementStats();
  
  if (stats.percentage === 0) {
    return { text: 'Mari rutin mencatat mood Anda agar kami bisa menganalisis pola mingguan emosi Anda secara lebih baik.' };
  }

  if (stats.direction === 'up') {
    return { text: `Hebat! Ada peningkatan sebesar ${stats.percentage}% dibandingkan minggu lalu. Tetap pertahankan rutinitas positif Anda saat ini.` };
  } else {
    return { text: `Minggu ini terlihat sedikit menantang dengan penurunan ${stats.percentage}%. Jangan ragu untuk membaca rekomendasi artikel atau menjadwalkan konseling jika butuh bantuan.` };
  }
}

export async function getTimelineEntries() {
  const user = await getCurrentDatabaseUser();
  if (!user) return [];

  const { data } = await supabase
    .from('mood_entries')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10);

  if (!data || data.length === 0) return [];

  return data.map(entry => {
    const d = new Date(entry.created_at);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    
    return {
      id: entry.id,
      date: `${d.getDate()} ${months[d.getMonth()]}`,
      time: `${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}`,
      mood: DB_MOOD_TO_CALENDAR_KEY[entry.mood] || 'netral',
      title: `${DB_MOOD_TO_LABEL[entry.mood]}`,
      note: entry.note || 'Tidak ada catatan.',
      tags: DB_MOOD_TO_TAGS[entry.mood] || ['#Jurnal']
    };
  });
}
