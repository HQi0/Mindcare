import { ArrowRight } from 'lucide-react';

export function ResourcesHero({ hero }) {
  if (!hero) return null;
  return (
    <div className="relative h-80 rounded-xl overflow-hidden border border-auth-card bg-gradient-to-br from-dash-primary/10 via-white to-white flex items-center">
      <div className="max-w-2xl px-12 flex flex-col gap-3">
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-dash-primary/10 px-3 py-1">
          <span className="size-1.5 rounded-full bg-dash-primary" />
          <span className="text-[11px] font-bold tracking-wider text-dash-primary uppercase">{hero.badge}</span>
        </span>
        <h2 className="text-[22px] leading-tight font-semibold tracking-[-0.22px] text-dash-text">{hero.title}</h2>
        <p className="text-[15px] text-dash-muted">{hero.description}</p>
        <button
          type="button"
          className="mt-2 inline-flex w-fit items-center gap-2 rounded-lg bg-dash-primary px-6 py-2.5 text-white text-sm"
        >
          {hero.cta}
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

export function CategoryFilters({ categories, active, onSelect }) {
  if (!categories?.length) return null;
  return (
    <div className="flex gap-3 items-center overflow-x-auto pt-2">
      {categories.map((cat) => {
        const isActive = active === cat.id;
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelect(cat.id)}
            className={`shrink-0 rounded-full px-5 py-2 text-sm transition-colors ${
              isActive
                ? 'bg-dash-primary text-white shadow-sm'
                : 'bg-white border border-auth-card text-dash-muted hover:border-dash-primary/40'
            }`}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}
