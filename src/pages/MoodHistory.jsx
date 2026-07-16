import { useState } from 'react';
import { Calendar, Download } from 'lucide-react';
import MoodCalendar from '../components/moodhistory/MoodCalendar.jsx';
import MoodTrendChart from '../components/moodhistory/MoodTrendChart.jsx';
import { MostFrequentMoodCard, ImprovementCard } from '../components/moodhistory/StatCards.jsx';
import TimelineEntries from '../components/moodhistory/TimelineEntries.jsx';
import FloatingActionButton from '../components/common/FloatingActionButton.jsx';
import { getCurrentDatabaseUser } from '../services/authService.js';
import { getCalendarData, getMostFrequentMood, getImprovementStats, getTimelineEntries } from '../services/moodHistoryService.js';

export default function MoodHistory() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [exporting, setExporting] = useState(false);

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      const user = await getCurrentDatabaseUser();
      const userName = user?.fullName || 'Pengguna MindCare';
      const nim = user?.nim || '-';
      
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth();
      
      // Mengambil data terkini untuk laporan berdasarkan tanggal yang dipilih
      const calendar = await getCalendarData(selectedDate);
      const freq = await getMostFrequentMood(selectedDate);
      const stats = await getImprovementStats(selectedDate);
      const timeline = await getTimelineEntries();
      
      const monthsIndo = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
      ];
      const monthYearName = `${monthsIndo[month]} ${year}`;
      
      // Saring catatan timeline khusus untuk bulan yang dipilih
      const monthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
      const monthlyTimeline = timeline.filter(entry => entry.date.includes(monthsShort[month]));

      // Membuat HTML Grid Kalender
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7; // Senin = 0
      
      const calendarCells = [
        ...Array.from({ length: firstWeekday }, () => null),
        ...Array.from({ length: daysInMonth }, (_, i) => i + 1)
      ];
      
      let calendarHtml = '<div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px; text-align: center; font-size: 11px;">';
      ['SN', 'SL', 'RB', 'KM', 'JM', 'SB', 'MG'].forEach(day => {
        calendarHtml += `<div style="font-weight: bold; color: #6b7280; padding: 4px 0;">${day}</div>`;
      });
      calendarCells.forEach(day => {
        if (!day) {
          calendarHtml += '<div style="height: 40px;"></div>';
        } else {
          const m = calendar[day];
          let bg = '#f9fafb';
          let textColor = '#9ca3af';
          let border = '1px dashed #e5e7eb';
          let moodText = '';
          if (m === 'senang') { bg = '#f0fdf4'; textColor = '#15803d'; border = '1px solid #bbf7d0'; moodText = 'Senang'; }
          else if (m === 'netral') { bg = '#eff6ff'; textColor = '#1d4ed8'; border = '1px solid #bfdbfe'; moodText = 'Netral'; }
          else if (m === 'cemas') { bg = '#fef9c3'; textColor = '#a16207'; border = '1px solid #fef08a'; moodText = 'Cemas'; }
          else if (m === 'sedih') { bg = '#fef2f2'; textColor = '#b91c1c'; border = '1px solid #fecaca'; moodText = 'Sedih'; }
          
          calendarHtml += `
            <div style="height: 48px; background-color: ${bg}; border: ${border}; border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 4px;">
              <span style="font-weight: bold; color: ${textColor};">${day}</span>
              ${moodText ? `<span style="font-size: 8px; color: ${textColor}; font-weight: bold; margin-top: 2px;">${moodText}</span>` : ''}
            </div>
          `;
        }
      });
      calendarHtml += '</div>';

      // Membuat HTML Timeline Catatan
      let timelineHtml = '<div style="display: flex; flex-direction: column; gap: 12px;">';
      if (monthlyTimeline.length === 0) {
        timelineHtml += '<p style="font-size: 13px; color: #6b7280; text-align: center; padding: 16px 0;">Tidak ada catatan harian untuk bulan ini.</p>';
      } else {
        monthlyTimeline.forEach(item => {
          let badgeBg = '#f3f4f6';
          let badgeText = '#374151';
          if (item.mood === 'senang') { badgeBg = '#dcfce7'; badgeText = '#166534'; }
          else if (item.mood === 'netral') { badgeBg = '#dbeafe'; badgeText = '#1e40af'; }
          else if (item.mood === 'cemas') { badgeBg = '#fef9c3'; badgeText = '#854d0e'; }
          else if (item.mood === 'sedih') { badgeBg = '#fee2e2'; badgeText = '#991b1b'; }
          
          timelineHtml += `
            <div style="border-bottom: 1px solid #f3f4f6; padding-bottom: 12px;">
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span style="font-size: 11px; font-weight: bold; color: #6b7280;">${item.date}</span>
                  <span style="font-size: 9px; padding: 2px 8px; border-radius: 9999px; font-weight: bold; background-color: ${badgeBg}; color: ${badgeText};">${item.title}</span>
                </div>
                <span style="font-size: 10px; color: #9ca3af;">${item.time} WIB</span>
              </div>
              <p style="font-size: 12px; color: #374151; margin-top: 4px; font-style: italic;">"${item.note}"</p>
              <div style="display: flex; gap: 6px; margin-top: 6px;">
                ${item.tags.map(t => `<span style="font-size: 8px; background-color: #f3f4f6; color: #4b5563; padding: 2px 6px; border-radius: 4px;">${t}</span>`).join('')}
              </div>
            </div>
          `;
        });
      }
      timelineHtml += '</div>';

      // Membuka window cetak baru
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>Laporan Perjalanan Emosional - ${userName}</title>
            <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
            <style>
              body { font-family: 'Inter', system-ui, sans-serif; }
              @media print {
                body { padding: 0; margin: 0; }
                .no-print { display: none; }
              }
            </style>
          </head>
          <body class="p-8 bg-white text-gray-800">
            <div class="max-w-3xl mx-auto border border-gray-200 p-8 rounded-xl shadow-sm">
              <!-- Header -->
              <div class="flex items-center justify-between border-b-2 border-blue-600 pb-4 mb-6">
                <div>
                  <h1 class="text-2xl font-bold text-blue-600">MindCare</h1>
                  <p class="text-[9px] text-gray-400 uppercase tracking-wider font-bold">Kesejahteraan & Kesehatan Mental Mahasiswa</p>
                </div>
                <div class="text-right">
                  <h2 class="text-md font-bold text-gray-800">LAPORAN BULANAN SUASANA HATI</h2>
                  <p class="text-xs text-gray-500 font-medium">Periode: ${monthYearName}</p>
                </div>
              </div>

              <!-- User Info -->
              <div class="bg-gray-50 p-4 rounded-lg flex items-center justify-between mb-6 text-xs">
                <div>
                  <p class="text-gray-400 font-bold uppercase">Nama Pengguna</p>
                  <p class="font-bold text-gray-800 text-sm mt-0.5">${userName}</p>
                </div>
                <div class="text-right">
                  <p class="text-gray-400 font-bold uppercase">NIM / Identitas</p>
                  <p class="font-bold text-gray-800 text-sm mt-0.5">${nim}</p>
                </div>
              </div>

              <!-- Stats Cards -->
              <div class="grid grid-cols-2 gap-4 mb-6">
                <div class="border border-gray-200 p-4 rounded-lg">
                  <h3 class="text-xs font-bold text-gray-400 uppercase">Mood Paling Sering</h3>
                  <p class="text-base font-bold text-gray-800 mt-1">${freq.mood}</p>
                  <p class="text-[10px] text-gray-500 mt-0.5">Muncul ${freq.count} kali (${freq.percentage}%) pada periode ini.</p>
                </div>
                <div class="border border-gray-200 p-4 rounded-lg">
                  <h3 class="text-xs font-bold text-gray-400 uppercase">Peningkatan Mood</h3>
                  <p class="text-base font-bold text-gray-800 mt-1">${stats.percentage}%</p>
                  <p class="text-[10px] text-gray-500 mt-0.5">${stats.label}</p>
                </div>
              </div>

              <!-- Calendar Section -->
              <div class="border border-gray-200 p-4 rounded-lg mb-6">
                <h3 class="text-xs font-bold text-gray-400 uppercase mb-3">Kalender Perjalanan Emosi</h3>
                ${calendarHtml}
              </div>

              <!-- Timeline Section -->
              <div class="border border-gray-200 p-4 rounded-lg">
                <h3 class="text-xs font-bold text-gray-400 uppercase mb-3">Timeline Catatan Harian</h3>
                ${timelineHtml}
              </div>

              <!-- Action Button (Hidden in Print) -->
              <div class="mt-8 text-center no-print">
                <button onclick="window.print()" class="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-2.5 rounded-lg shadow transition-colors">
                  Cetak / Simpan Sebagai PDF
                </button>
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
    } catch (err) {
      alert("Gagal mengekspor PDF: " + err.message);
    } finally {
      setExporting(false);
    }
  };

  return (
    <>
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-[22px] leading-8 font-semibold tracking-[-0.22px] text-dash-text">
            Riwayat Suasana Hati
          </h2>
          <p className="text-[13.5px] text-dash-linkMuted">
            Analisis perjalanan emosional Anda selama bulan ini
          </p>
        </div>

        <div className="flex gap-2">
          {/* Tombol Pemilih Bulan yang Interaktif */}
          <div className="relative">
            <input
              type="month"
              value={`${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}`}
              onChange={(e) => {
                if (e.target.value) {
                  const [y, m] = e.target.value.split('-');
                  setSelectedDate(new Date(parseInt(y), parseInt(m) - 1, 1));
                }
              }}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              title="Pilih Bulan & Tahun"
            />
            <button
              type="button"
              className="flex items-center gap-2 bg-white border border-auth-card rounded-lg px-3.5 py-2 text-[13px] text-dash-muted pointer-events-none"
            >
              <Calendar size={14} />
              {selectedDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
            </button>
          </div>

          {/* Tombol Ekspor PDF */}
          <button
            type="button"
            onClick={handleExportPDF}
            disabled={exporting}
            className="flex items-center gap-2 bg-dash-primary hover:bg-[#004ac6] disabled:opacity-50 text-white rounded-lg px-3 py-2 text-[13px] cursor-pointer transition-colors"
          >
            <Download size={14} />
            {exporting ? 'Mengekspor...' : 'Ekspor PDF'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        <MoodCalendar currentDate={selectedDate} setCurrentDate={setSelectedDate} />
        <MoodTrendChart selectedDate={selectedDate} />

        <div className="col-span-1 md:col-span-4 flex flex-col gap-6">
          <MostFrequentMoodCard selectedDate={selectedDate} />
          <ImprovementCard selectedDate={selectedDate} />
        </div>
        <TimelineEntries />
      </div>

      <FloatingActionButton to="/mood-tracker" label="Catat Suasana Baru" />
    </>
  );
}
