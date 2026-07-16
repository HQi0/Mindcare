import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import useFetch from '../../hooks/useFetch.js';
import { getCalendarData } from '../../services/moodHistoryService.js';
import { MOOD_COLORS, MOOD_LEGEND } from '../../utils/moodColors.js';

const WEEKDAYS = ['SN', 'SL', 'RB', 'KM', 'JM', 'SB', 'MG'];
const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export default function MoodCalendar({ currentDate, setCurrentDate }) {

  // Fetch data berdasarkan bulan/tahun saat ini
  const { data: calendarData, loading } = useFetch(
    () => getCalendarData(currentDate),
    [currentDate]
  );

  // Bangun grid 1..akhir bulan berjalan, offset sesuai hari pertama.
  const cells = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7; // Senin = 0

    return [
      ...Array.from({ length: firstWeekday }, () => null),
      ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ];
  }, [currentDate]);

  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  // Cek apakah tanggal di sel adalah hari ini secara real-time
  const isRealToday = (day) => {
    const today = new Date();
    return today.getDate() === day &&
           today.getMonth() === currentDate.getMonth() &&
           today.getFullYear() === currentDate.getFullYear();
  };

  return (
    <div className="col-span-1 md:col-span-5 bg-white border border-auth-card rounded-xl2 p-[17px] flex flex-col gap-2 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-dash-text">
          Kalender Mood - {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <div className="flex gap-1">
          <button 
            type="button" 
            onClick={handlePrevMonth}
            className="p-1.5 rounded hover:bg-auth-input cursor-pointer transition-colors"
            title="Bulan Sebelumnya"
          >
            <ChevronLeft size={14} className="text-dash-linkMuted" />
          </button>
          <button 
            type="button" 
            onClick={handleNextMonth}
            className="p-1.5 rounded hover:bg-auth-input cursor-pointer transition-colors"
            title="Bulan Berikutnya"
          >
            <ChevronRight size={14} className="text-dash-linkMuted" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 pt-4">
        {WEEKDAYS.map((day) => (
          <span key={day} className="text-center text-[11px] font-bold tracking-[1.1px] text-dash-linkMuted">
            {day}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2 pb-6">
        {loading &&
          Array.from({ length: 35 }).map((_, i) => (
            <div key={i} className="h-10 rounded-lg bg-auth-input animate-pulse" />
          ))}

        {!loading &&
          cells.map((day, index) => {
            if (!day) return <div key={`empty-${index}`} />;
            const mood = calendarData?.[day];
            const isToday = isRealToday(day);
            const colors = mood ? MOOD_COLORS[mood] : null;

            let cellClass = "h-10 rounded-lg flex items-center justify-center text-[13px] font-medium transition-all duration-200 ";
            if (isToday) {
              if (colors) {
                cellClass += `${colors.bg} border-2 ${colors.border} ${colors.text} font-bold ring-2 ring-dash-primary/30`;
              } else {
                cellClass += "bg-dash-primary/10 border-2 border-dash-primary text-dash-primary font-bold shadow-sm";
              }
            } else {
              if (colors) {
                cellClass += `${colors.bg} border ${colors.border} ${colors.text}`;
              } else {
                cellClass += "border border-dashed border-auth-card/50 text-dash-linkMuted hover:border-auth-card hover:bg-auth-input/30 cursor-default";
              }
            }

            return (
              <div
                key={day}
                className={cellClass}
                title={isToday ? "Hari ini" : undefined}
              >
                {day}
              </div>
            );
          })}
      </div>

      <div className="border-t border-auth-card pt-[17px] flex items-center flex-wrap gap-2">
        <div className="flex gap-3 flex-wrap">
          {MOOD_LEGEND.map((item) => (
            <div key={item.key} className="flex items-center gap-1.5">
              <span className={`size-2.5 rounded-full ${MOOD_COLORS[item.key].dot}`} />
              <span className="text-[11px] text-dash-text">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
