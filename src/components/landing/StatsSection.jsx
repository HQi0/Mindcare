import useFetch from '../../hooks/useFetch.js';
import { getStats } from '../../services/landingService.js';

export default function StatsSection() {
  const { data: stats, loading } = useFetch(getStats, []);

  return (
    <section className="bg-surface-tint px-6 md:px-16 py-16">
      <div className="max-w-content mx-auto flex flex-wrap justify-center gap-8">
        {loading &&
          [1, 2, 3, 4].map((n) => (
            <div key={n} className="flex-1 min-w-[140px] h-16 rounded-lg bg-white/60 animate-pulse" />
          ))}

        {stats?.map((stat) => (
          <div key={stat.id} className="flex-1 min-w-[140px] flex flex-col items-center gap-1">
            <p className="text-[40px] md:text-[48px] leading-[56px] font-bold tracking-[-0.96px] text-primary">
              {stat.value}
            </p>
            <p className="text-sm font-medium tracking-[0.14px] text-ink-muted text-center">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
