import { Sparkles, ChevronRight } from 'lucide-react';
import useFetch from '../../hooks/useFetch.js';
import { getWeeklyTrendAnalysis } from '../../services/moodHistoryService.js';

export default function WeeklyTrendCard() {
  const { data } = useFetch(getWeeklyTrendAnalysis, []);

  return (
    <div className="bg-dash-primary/5 border border-dash-primary/10 rounded-xl2 p-[17px] flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Sparkles size={15} className="text-dash-primary" />
        <h3 className="text-sm font-semibold text-dash-primary">Analisis Tren Mingguan</h3>
      </div>
      <p className="text-[13px] leading-[21px] text-dash-muted">{data?.text}</p>
      <button
        type="button"
        className="self-start flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.55px] text-dash-primary pt-1"
      >
        Lihat Saran Personalisasi
        <ChevronRight size={12} />
      </button>
    </div>
  );
}
