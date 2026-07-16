import useFetch from '../../hooks/useFetch.js';
import { getDailyInsight } from '../../services/moodTrackerService.js';

export default function DailyInsightCard() {
  const { data: insight, loading } = useFetch(getDailyInsight, []);

  return (
    <div className="relative bg-dash-primary rounded-xl2 p-4 overflow-hidden">
      <div className="absolute -bottom-4 -right-4 size-24 rounded-full bg-white/10 blur-xl" />
      <div className="relative flex flex-col gap-2">
        <p className="text-sm font-semibold text-white/80 tracking-[0.7px] uppercase">
          Insight Hari Ini
        </p>
        <p className="text-[15px] leading-[21px] font-semibold text-white pb-1">
          {loading ? 'Memuat insight...' : insight?.text}
        </p>
      </div>
    </div>
  );
}
