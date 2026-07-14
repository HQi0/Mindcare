import { Smile, Meh, Frown, AlertCircle } from 'lucide-react';
import useFetch from '../../hooks/useFetch.js';
import { getTimelineEntries } from '../../services/moodHistoryService.js';
import { MOOD_COLORS } from '../../utils/moodColors.js';

const MOOD_ICON = {
  senang: Smile,
  netral: Meh,
  cemas: AlertCircle,
  sedih: Frown,
};

export default function TimelineEntries() {
  const { data: entries, loading } = useFetch(getTimelineEntries, []);

  return (
    <div className="col-span-1 md:col-span-8 bg-white border border-auth-card rounded-xl2 overflow-hidden shadow-sm flex flex-col">
      <div className="border-b border-auth-card px-4 py-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-dash-text">Timeline Catatan Harian</h3>
        <select className="bg-auth-input rounded-lg px-3 py-1 text-[11px] font-bold text-dash-muted border-none focus:outline-none">
          <option>Semua Mood</option>
          <option>Senang</option>
          <option>Netral</option>
          <option>Cemas</option>
          <option>Sedih</option>
        </select>
      </div>

      <div className="max-h-[420px] overflow-y-auto">
        {loading &&
          [1, 2, 3].map((n) => (
            <div key={n} className="h-20 mx-4 my-3 rounded-lg bg-auth-input animate-pulse" />
          ))}

        {entries?.map((entry, index) => {
          const Icon = MOOD_ICON[entry.mood] ?? Meh;
          const colors = MOOD_COLORS[entry.mood];
          const isLast = index === entries.length - 1;
          return (
            <div
              key={entry.id}
              className={`flex gap-4 px-4 py-4 ${!isLast ? 'border-b border-auth-card/50' : ''}`}
            >
              <div className="flex flex-col items-center gap-1 shrink-0">
                <span className="text-[11px] font-bold uppercase text-dash-linkMuted">
                  {entry.date}
                </span>
                <span className={`flex items-center justify-center size-10 rounded-full ${colors.bg} ${colors.text}`}>
                  <Icon size={18} />
                </span>
              </div>

              <div className="flex-1 min-w-0 flex flex-col gap-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[13.5px] font-bold text-dash-text">{entry.title}</p>
                  <span className="text-[11px] text-dash-linkMuted whitespace-nowrap">
                    {entry.time}
                  </span>
                </div>
                <p className="text-[13px] leading-[18px] text-dash-muted">{entry.note}</p>
                <div className="flex gap-2 pt-1 flex-wrap">
                  {entry.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-auth-input text-dash-linkMuted text-[11px] px-2 py-0.5 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        className="bg-auth-input text-dash-primary text-[13px] font-bold py-3.5 hover:bg-auth-input/70 transition-colors"
      >
        Lihat Lebih Banyak Catatan
      </button>
    </div>
  );
}
