import { supabase } from '../lib/supabaseClient';
import { getCurrentDatabaseUser } from './authService.js';

const mockDelay = (data, ms = 300) =>
  new Promise((resolve) => setTimeout(() => resolve({ data }), ms));

const DUMMY_USER = { id: 'usr_dummy', name: 'Pengguna MindCare', avatarInitials: 'PM' };

export async function getCurrentUser() {
  const storedUser = await getCurrentDatabaseUser();
  if (storedUser) {
    return {
      ...DUMMY_USER,
      ...storedUser,
      avatarInitials: storedUser.fullName
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase(),
    };
  }
  return DUMMY_USER;
}

export async function getDashboardStats() {
  const user = await getCurrentDatabaseUser();
  
  // Default values
  let nextSessionVal = 'Belum ada jadwal';
  let nextSessionSub = 'Buat jadwal baru';
  let streakVal = 0;
  let avgMoodVal = 'Belum ada data';
  let lastAssessmentVal = 'Belum ada';
  let lastAssessmentSub = 'Yuk ikuti tes pertama!';
  
  if (user) {
    // 1. Ambil sesi berikutnya dari tabel bookings
    const { data: bookingData } = await supabase
      .from('bookings')
      .select('scheduled_at, counselors(full_name)')
      .eq('user_id', user.id)
      .gte('scheduled_at', new Date().toISOString())
      .order('scheduled_at', { ascending: true })
      .limit(1)
      .single();
      
    if (bookingData) {
      const date = new Date(bookingData.scheduled_at);
      nextSessionVal = `${date.getDate()}/${date.getMonth()+1}, ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
      nextSessionSub = bookingData.counselors?.full_name ? `Bersama ${bookingData.counselors.full_name}` : 'Sesi Konseling';
    }

    // 2. Kalkulasi Streak
    const { data: moodData } = await supabase
      .from('mood_entries')
      .select('created_at, mood')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (moodData && moodData.length > 0) {
      const uniqueDates = [...new Set(moodData.map(entry => new Date(entry.created_at).toDateString()))];
      
      let currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      const todayStr = currentDate.toDateString();
      
      let yesterday = new Date(currentDate);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toDateString();

      // Jika hari ini atau kemarin ada entri, hitung mundur
      if (uniqueDates.includes(todayStr) || uniqueDates.includes(yesterdayStr)) {
        let checkDate = new Date(currentDate);
        while (true) {
          const checkStr = checkDate.toDateString();
          if (uniqueDates.includes(checkStr)) {
            streakVal++;
          } else if (checkStr !== todayStr) {
            // Putus jika bukan hari ini yang bolong
            break;
          }
          checkDate.setDate(checkDate.getDate() - 1);
        }
      }

      // 3. Kalkulasi Rata-rata Mood (7 hari terakhir)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const recentMoods = moodData.filter(m => new Date(m.created_at) >= sevenDaysAgo);
      if (recentMoods.length > 0) {
        const DB_MOOD_TO_SCORE = { 'sangat_sedih': 1, 'sedih': 2, 'netral': 3, 'senang': 4, 'sangat_senang': 5 };
        const totalScore = recentMoods.reduce((sum, entry) => sum + (DB_MOOD_TO_SCORE[entry.mood] || 3), 0);
        const avgScore = totalScore / recentMoods.length;
        
        if (avgScore >= 4) avgMoodVal = 'Positif';
        else if (avgScore >= 3) avgMoodVal = 'Netral';
        else avgMoodVal = 'Negatif';
      }
    }

    // 4. Asesmen Terakhir
    const { data: assessmentData } = await supabase
      .from('assessments')
      .select('type, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (assessmentData) {
      lastAssessmentVal = assessmentData.type.toUpperCase();
      const d = new Date(assessmentData.created_at);
      lastAssessmentSub = `Diambil pd ${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`;
    }
  }

  // Stats
  const stats = [
    {
      id: 'streak',
      icon: 'flame',
      label: 'Streak',
      value: `${streakVal} Hari`,
      valueColor: 'text-dash-primary',
      subtitle: streakVal > 0 ? 'Tetap konsisten!' : 'Yuk mulai mencatat!',
      subtitleColor: 'text-dash-success',
    },
    {
      id: 'avg-mood',
      icon: 'smile',
      label: 'Mood Rata-rata',
      value: avgMoodVal,
      valueColor: 'text-dash-moodBlue',
      subtitle: 'Berdasarkan 7 hari terakhir',
      subtitleColor: 'text-dash-muted',
    },
    {
      id: 'last-assessment',
      icon: 'clipboard-check',
      label: 'Asesmen Terakhir',
      value: lastAssessmentVal,
      valueColor: 'text-dash-text',
      subtitle: lastAssessmentSub,
      subtitleColor: 'text-dash-muted',
    },
    {
      id: 'next-session',
      icon: 'calendar-clock',
      label: 'Sesi Berikutnya',
      value: nextSessionVal,
      valueColor: 'text-dash-text',
      subtitle: nextSessionSub,
      subtitleColor: 'text-dash-primary',
    },
  ];

  return stats;
}

// Mapping mood dari string database ke angka untuk chart
const DB_MOOD_TO_NUMBER = {
  'sangat_sedih': 1,
  'sedih': 2,
  'netral': 3,
  'senang': 4,
  'sangat_senang': 5
};

export async function getMoodHistory() {
  const user = await getCurrentDatabaseUser();
  if (!user) return [];

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { data, error } = await supabase
    .from('mood_entries')
    .select('mood, created_at')
    .eq('user_id', user.id)
    .gte('created_at', sevenDaysAgo.toISOString())
    .order('created_at', { ascending: true });

  const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  
  if (error || !data || data.length === 0) {
     return [
       { day: 'Sen', value: 3 },
       { day: 'Sel', value: 3 },
       { day: 'Rab', value: 3 },
       { day: 'Kam', value: 3 },
       { day: 'Jum', value: 3 },
       { day: 'Sab', value: 3 },
       { day: 'Min', value: 3 },
     ];
  }

  const todayKey = new Date().toDateString();
  const grouped = {};
  const todayEntries = [];

  data.forEach((entry) => {
    const date = new Date(entry.created_at);
    const dateKey = date.toDateString();

    if (dateKey === todayKey) {
      // Jika hari ini, jangan dirata-ratakan dulu agar entri hari ini muncul terpisah
      todayEntries.push({
        date: date,
        day: days[date.getDay()],
        value: DB_MOOD_TO_NUMBER[entry.mood] || 3
      });
    } else {
      // Jika hari yang sudah lewat, rata-ratakan per hari agar tidak menumpuk
      if (!grouped[dateKey]) {
        grouped[dateKey] = {
          date: date,
          day: days[date.getDay()],
          sum: 0,
          count: 0,
        };
      }
      grouped[dateKey].sum += DB_MOOD_TO_NUMBER[entry.mood] || 3;
      grouped[dateKey].count += 1;
    }
  });

  // Petakan entri masa lalu yang sudah dirata-ratakan
  const pastEntries = Object.keys(grouped).map((key) => {
    const item = grouped[key];
    return {
      date: item.date,
      day: item.day,
      value: Number((item.sum / item.count).toFixed(1)),
    };
  });

  // Gabungkan dan urutkan secara kronologis berdasarkan objek Date asli
  const combined = [...pastEntries, ...todayEntries];
  combined.sort((a, b) => a.date - b.date);

  return combined.map((item) => ({
    day: item.day,
    value: item.value,
  }));
}

export async function getRecentActivities() {
  const user = await getCurrentDatabaseUser();
  if (!user) return [];

  const activities = [];

  // 1. Ambil mood terakhir
  const { data: moodData } = await supabase
    .from('mood_entries')
    .select('mood, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(3);

  if (moodData) {
    moodData.forEach((item, index) => {
      const date = new Date(item.created_at);
      const hour = date.getHours();
      let timeOfDay = 'Malam';
      if (hour >= 5 && hour < 11) timeOfDay = 'Pagi';
      else if (hour >= 11 && hour < 15) timeOfDay = 'Siang';
      else if (hour >= 15 && hour < 18) timeOfDay = 'Sore';

      activities.push({
        id: `act-mood-${index}`,
        icon: 'smile',
        iconBg: 'bg-dash-primary/10',
        title: `Mencatat Mood ${timeOfDay}`,
        subtitle: date.toLocaleString('id-ID'),
        timestamp: date.getTime()
      });
    });
  }

  // 2. Ambil asesmen terakhir
  const { data: assessmentData } = await supabase
    .from('assessments')
    .select('type, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(2);

  if (assessmentData) {
    assessmentData.forEach((item, index) => {
      activities.push({
        id: `act-assessment-${index}`,
        icon: 'clipboard-check',
        iconBg: 'bg-dash-success/10',
        title: `Menyelesaikan Asesmen ${item.type.toUpperCase()}`,
        subtitle: new Date(item.created_at).toLocaleString('id-ID'),
        timestamp: new Date(item.created_at).getTime()
      });
    });
  }

  // Urutkan berdasarkan waktu terbaru dan ambil 5 teratas
  activities.sort((a, b) => b.timestamp - a.timestamp);
  const finalActivities = activities.slice(0, 5);

  if (finalActivities.length === 0) {
    return [{
      id: 'act-default',
      icon: 'wind',
      iconBg: 'bg-dash-success/10',
      title: 'Selamat Datang!',
      subtitle: 'Aktivitasmu akan muncul di sini',
    }];
  }

  return finalActivities;
}

export async function getRecommendedResources() {
  // Ambil dari tabel articles
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(3);

  if (error || !data || data.length === 0) {
     return [
      {
        id: 'res-default',
        type: 'ARTIKEL',
        typeColor: 'text-dash-moodBlue',
        title: 'Mengelola Stres Akademik',
        subtitle: 'Tips Praktis Mahasiswa',
      }
     ];
  }

  return data.map(article => ({
    id: article.id,
    type: (article.category || 'ARTIKEL').toUpperCase(),
    typeColor: 'text-dash-primary',
    title: article.title,
    subtitle: '5 Menit Baca',
    cover_image_url: article.cover_image_url
  }));
}

// Mapping UI mood ke DB mood enum
const UI_MOOD_TO_DB = {
  'sedih': 'sedih',
  'biasa': 'netral',
  'senang': 'senang',
  'sangat-baik': 'sangat_senang',
  'bertenaga': 'sangat_senang'
};

/**
 * Kirim mood yang dipilih user dari Mood Hero.
 * @param {{ mood: string }} payload
 */
export async function submitMood(payload) {
  const user = await getCurrentDatabaseUser();
  if (!user) throw new Error("Harap login terlebih dahulu.");

  const dbMood = UI_MOOD_TO_DB[payload.mood] || 'netral';

  const { error } = await supabase
    .from('mood_entries')
    .insert([
      { user_id: user.id, mood: dbMood }
    ]);
  
  if (error) throw new Error(error.message);

  return { success: true, mood: payload.mood };
}
