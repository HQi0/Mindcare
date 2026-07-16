import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import useFetch from '../../hooks/useFetch.js';
import { getMoodHistory } from '../../services/dashboardService.js';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length || !payload[0].value) return null;
  return (
    <div className="bg-white border border-dash-border rounded-lg px-3 py-2 shadow-sm">
      <p className="text-xs font-semibold text-dash-text">{label}</p>
      <p className="text-xs text-dash-muted">Skor mood: {payload[0].value}/5</p>
    </div>
  );
}

export default function MoodHistoryChart() {
  const { data: history, loading } = useFetch(getMoodHistory, []);

  // Mendapatkan index hari ini (0 = Sen, ..., 6 = Min)
  const todayIndex = (() => {
    const day = new Date().getDay(); // 0: Minggu, 1: Senin, ..., 6: Sabtu
    return day === 0 ? 6 : day - 1;
  })();

  return (
    <div className="md:col-span-8 bg-white border border-dash-border rounded-xl2 p-6 flex flex-col gap-6 h-[350px]">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-dash-text">
          Riwayat Suasana Hati
        </h3>
        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-dash-primary" />
          <span className="text-[11px] font-medium text-dash-muted">Mood</span>
        </div>
      </div>

      <div className="flex-1 w-full">
        {loading ? (
          <div className="w-full h-full rounded-lg bg-dash-border/30 animate-pulse" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={history} barCategoryGap="24%">
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#737686' }}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,74,198,0.05)' }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={40}>
                {history?.map((entry, index) => (
                  <Cell key={index} fill={index === todayIndex ? '#004ac6' : '#c7d9f5'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
