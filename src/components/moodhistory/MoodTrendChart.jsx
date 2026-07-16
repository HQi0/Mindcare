import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import useFetch from '../../hooks/useFetch.js';
import { getMoodTrend } from '../../services/moodHistoryService.js';

export default function MoodTrendChart({ selectedDate }) {
  const { data: trend, loading } = useFetch(
    () => getMoodTrend(selectedDate),
    [selectedDate]
  );

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
            <LineChart data={trend} margin={{ left: 15, right: 15, top: 10, bottom: 25 }}>
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 9, fill: '#6b93b8' }}
                interval={isMobile ? 2 : 'preserveStartEnd'}
                label={{ value: 'Tanggal', position: 'insideBottom', style: { fontSize: 11, fill: '#6b93b8', fontWeight: 500 }, offset: -15 }}
              />
              <YAxis
                domain={[1, 5]}
                tickCount={5}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#6b93b8' }}
                label={{ value: 'Skor Mood', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 11, fill: '#6b93b8', fontWeight: 500 }, offset: 5 }}
              />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, borderColor: '#d1e4f5' }}
                labelStyle={{ fontWeight: 600 }}
              />
              <Line
                type="monotone"
                dataKey="intensity"
                name="Skor Mood"
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
