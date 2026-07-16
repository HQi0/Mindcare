import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import useFetch from '../../hooks/useFetch.js';
import { getMoodTrend } from '../../services/moodHistoryService.js';

export default function MoodTrendChart({ selectedDate }) {
  const { data: trend, loading } = useFetch(
    () => getMoodTrend(selectedDate),
    [selectedDate]
  );

  return (
    <div className="col-span-1 md:col-span-7 bg-white border border-auth-card rounded-xl2 p-[17px] flex flex-col shadow-sm">
      <div className="flex items-start justify-between pb-4">
        <div>
          <h3 className="text-sm font-semibold text-dash-text">Tren Mood Bulanan</h3>
          <p className="text-xs text-dash-linkMuted">Fluktuasi intensitas emosi harian</p>
        </div>
      </div>

      <div className="h-[260px] w-full">
        {loading ? (
          <div className="w-full h-full rounded-lg bg-auth-input animate-pulse" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trend}>
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#6b93b8' }}
              />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, borderColor: '#d1e4f5' }}
                labelStyle={{ fontWeight: 600 }}
              />
              <Line
                type="monotone"
                dataKey="intensity"
                stroke="#004ac6"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#004ac6' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
