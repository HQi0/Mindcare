import { Link } from 'react-router-dom';
import { Wind, Smile, BookOpenText } from 'lucide-react';
import useFetch from '../../hooks/useFetch.js';
import { getRecentActivities } from '../../services/dashboardService.js';

const ICON_MAP = {
  wind: Wind,
  smile: Smile,
  'book-open-text': BookOpenText,
};

const ICON_COLOR = {
  wind: 'text-dash-success',
  smile: 'text-dash-primary',
  'book-open-text': 'text-dash-amber',
};

export default function RecentActivity() {
  const { data: activities, loading } = useFetch(getRecentActivities, []);

  return (
    <div className="md:col-span-4 bg-white border border-dash-border rounded-xl2 p-6 flex flex-col">
      <h3 className="text-sm font-semibold text-dash-text pb-6">Aktivitas Terbaru</h3>

      <div className="flex flex-col gap-4">
        {loading &&
          [1, 2, 3].map((n) => (
            <div key={n} className="h-12 rounded-lg bg-dash-border/30 animate-pulse" />
          ))}

        {activities?.map((activity, index) => {
          const Icon = ICON_MAP[activity.icon] ?? Smile;
          const isLast = index === activities.length - 1;
          return (
            <div
              key={activity.id}
              className={`flex gap-4 items-start pb-4 ${
                !isLast ? 'border-b border-dash-border' : ''
              }`}
            >
              <span
                className={`flex items-center justify-center size-8 rounded-full shrink-0 ${activity.iconBg} ${ICON_COLOR[activity.icon]}`}
              >
                <Icon size={16} />
              </span>
              <div>
                <p className="text-[13.5px] font-medium text-dash-text">{activity.title}</p>
                <p className="text-[11px] text-dash-muted">{activity.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>

      <Link
        to="/mood-history"
        className="mt-4 flex items-center justify-center py-2 rounded-lg text-sm font-semibold text-dash-primary hover:bg-dash-primary/5 transition-colors"
      >
        Lihat Semua Riwayat
      </Link>
    </div>
  );
}
