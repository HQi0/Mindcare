import { Flame, Smile, ClipboardCheck, CalendarClock } from 'lucide-react';
import useFetch from '../../hooks/useFetch.js';
import { getDashboardStats } from '../../services/dashboardService.js';

const ICON_MAP = {
  flame: Flame,
  smile: Smile,
  'clipboard-check': ClipboardCheck,
  'calendar-clock': CalendarClock,
};

const ICON_COLOR = {
  flame: 'text-dash-primary',
  smile: 'text-dash-moodBlue',
  'clipboard-check': 'text-dash-text',
  'calendar-clock': 'text-dash-primary',
};

function StatCard({ stat }) {
  const Icon = ICON_MAP[stat.icon] ?? Flame;
  return (
    <div className="flex-1 min-w-[150px] bg-white border border-dash-border rounded-xl2 p-[17px] flex flex-col gap-1">
      <div className="flex items-center gap-3">
        <Icon size={24} className={ICON_COLOR[stat.icon]} />
        <span className="text-sm font-semibold text-dash-muted">{stat.label}</span>
      </div>
      <p className={`text-2xl leading-8 font-bold pt-1 ${stat.valueColor}`}>{stat.value}</p>
      <p className={`text-[11px] leading-[14px] ${stat.subtitleColor}`}>{stat.subtitle}</p>
    </div>
  );
}

export default function StatsGrid() {
  const { data: stats, loading } = useFetch(getDashboardStats, []);

  return (
    <div className="flex flex-wrap gap-4">
      {loading &&
        [1, 2, 3, 4].map((n) => (
          <div key={n} className="flex-1 min-w-[150px] h-24 rounded-xl2 bg-white/60 animate-pulse" />
        ))}

      {stats?.map((stat) => (
        <StatCard key={stat.id} stat={stat} />
      ))}
    </div>
  );
}
