import { Smile, TrendingUp } from 'lucide-react';
import useFetch from '../../hooks/useFetch.js';
import { getMostFrequentMood, getImprovementStats } from '../../services/moodHistoryService.js';

export function MostFrequentMoodCard() {
  const { data } = useFetch(getMostFrequentMood, []);

  return (
    <div className="bg-white border border-auth-card rounded-xl2 p-[17px] flex flex-col gap-4 shadow-sm">
      <h3 className="text-sm font-semibold text-dash-text">Paling Sering Merasa</h3>
      <div className="flex items-center gap-4">
        <span className="flex items-center justify-center size-16 rounded-2xl bg-dash-success/10 text-dash-success shrink-0">
          <Smile size={28} />
        </span>
        <div>
          <p className="text-[15px] font-bold text-dash-text">{data?.mood}</p>
          <p className="text-xs text-dash-linkMuted">
            Muncul {data?.count} kali ({data?.percentage}%) bulan ini
          </p>
        </div>
      </div>
      <div className="h-1.5 rounded-full bg-auth-input overflow-hidden">
        <div
          className="h-full bg-dash-success rounded-full"
          style={{ width: `${data?.percentage ?? 0}%` }}
        />
      </div>
    </div>
  );
}

export function ImprovementCard() {
  const { data } = useFetch(getImprovementStats, []);
  const pct = data?.percentage ?? 0;
  // Ring progress sederhana pakai conic-gradient (tanpa dependency chart tambahan)
  const ringStyle = {
    background: `conic-gradient(#22c55e ${Math.min(pct, 100) * 3.6}deg, #eceef0 0deg)`,
  };

  return (
    <div className="bg-white border border-auth-card rounded-xl2 p-[17px] flex flex-col gap-4 shadow-sm">
      <h3 className="text-sm font-semibold text-dash-text">Perbaikan vs Bulan Lalu</h3>
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <TrendingUp size={15} className="text-dash-success" />
            <span className="text-[15px] font-bold text-dash-success">{pct}%</span>
          </div>
          <p className="text-xs text-dash-linkMuted">{data?.label}</p>
        </div>
        <div className="size-12 rounded-full flex items-center justify-center" style={ringStyle}>
          <div className="size-8 rounded-full bg-white" />
        </div>
      </div>
    </div>
  );
}
