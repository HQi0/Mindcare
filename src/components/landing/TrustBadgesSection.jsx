import { Lock, UserCheck, BadgeCheck, SignalLow } from 'lucide-react';
import useFetch from '../../hooks/useFetch.js';
import { getTrustBadges } from '../../services/landingService.js';

const ICON_MAP = {
  lock: Lock,
  'user-check': UserCheck,
  'badge-check': BadgeCheck,
  'signal-low': SignalLow,
};

export default function TrustBadgesSection() {
  const { data: badges, loading } = useFetch(getTrustBadges, []);

  return (
    <section className="border-y border-border px-6 md:px-10 py-10">
      <div className="max-w-content mx-auto flex flex-wrap justify-center gap-x-16 gap-y-4">
        {loading &&
          [1, 2, 3, 4].map((n) => (
            <div key={n} className="h-5 w-40 rounded bg-surface-tint animate-pulse" />
          ))}

        {badges?.map((badge) => {
          const Icon = ICON_MAP[badge.icon] ?? Lock;
          return (
            <div key={badge.id} className="flex items-center gap-2 opacity-60">
              <Icon size={18} className="text-ink" />
              <span className="text-sm font-bold tracking-[0.7px] uppercase text-ink">
                {badge.label}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
