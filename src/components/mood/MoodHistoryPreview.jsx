import { Link } from 'react-router-dom';
import useFetch from '../../hooks/useFetch.js';
import { getRecentMoodEntries } from '../../services/moodTrackerService.js';

export default function MoodHistoryPreview() {
  const { data: entries, loading } = useFetch(getRecentMoodEntries, []);

  return (
    <div className="backdrop-blur-sm bg-white/80 border border-auth-card rounded-xl2 p-[17px] flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-dash-text">Riwayat Terakhir</h3>
        <Link to="/mood-history" className="text-[11px] font-bold text-dash-primary">
          LIHAT SEMUA
        </Link>
      </div>

      <div className="flex flex-col gap-4">
        {loading &&
          [1, 2, 3].map((n) => (
            <div key={n} className="h-14 rounded-lg bg-auth-input animate-pulse" />
          ))}

        {entries?.map((entry, index) => {
          const isLast = index === entries.length - 1;
          return (
            <div
              key={entry.id}
              className={`flex gap-3 items-start pb-[17px] ${
                !isLast ? 'border-b border-auth-card/50' : ''
              }`}
            >
              <span className="flex items-center justify-center size-10 rounded-lg bg-auth-input shrink-0 text-xl">
                {entry.emoji}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[13.5px] font-bold text-dash-text">{entry.mood}</p>
                  <p className="text-[11px] font-medium text-dash-linkMuted whitespace-nowrap uppercase">
                    {entry.date}
                  </p>
                </div>
                <p className="text-[13px] text-dash-muted truncate">{entry.note}</p>
                <span className="inline-block mt-1 bg-auth-input text-dash-linkMuted text-[10px] font-bold px-2 py-0.5 rounded">
                  {entry.tag}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
