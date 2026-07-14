import { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import useFetch from '../../hooks/useFetch.js';
import { getCalendarData } from '../../services/moodHistoryService.js';
import { MOOD_COLORS, MOOD_LEGEND } from '../../utils/moodColors.js';

const WEEKDAYS = ['SN', 'SL', 'RB', 'KM', 'JM', 'SB', 'MG'];

export default function MoodCalendar() {
  const { data: calendarData, loading } = useFetch(getCalendarData, []);

  // Bangun grid 1..akhir bulan berjalan, offset sesuai hari pertama.
  const cells = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7; // Senin = 0

    return [
      ...Array.from({ length: firstWeekday }, () => null),
      ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ];
  }, []);

  return (
    <div className="col-span-1 md:col-span-5 bg-white border border-auth-card rounded-xl2 p-[17px] flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-dash-text">Kalender Mood Bulanan</h3>
        <div className="flex gap-1">
          <button type="button" className="p-1 rounded hover:bg-auth-input">
            <ChevronLeft size={14} className="text-dash-linkMuted" />
          </button>
          <button type="button" className="p-1 rounded hover:bg-auth-input">
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
            const isToday = mood === 'today';
            const colors = mood && !isToday ? MOOD_COLORS[mood] : null;

            return (
              <div
                key={day}
                className={`h-10 rounded-lg flex items-center justify-center text-[13px] font-medium ${
                  isToday
                    ? 'bg-dash-primary text-white font-bold shadow-md'
                    : colors
                      ? `${colors.bg} border ${colors.border} ${colors.text}`
                      : 'border border-dashed border-auth-card/50 text-dash-linkMuted'
                }`}
              >
                {day}
              </div>
            );
          })}
      </div>

      <div className="border-t border-auth-card pt-[17px] flex items-center justify-between flex-wrap gap-2">
        <span className="text-[11px] font-bold uppercase text-dash-linkMuted">Legenda</span>
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
