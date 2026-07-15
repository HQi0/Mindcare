import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export function ResourcesHero({ hero }) {
  if (!hero) return null;
  
  const content = (
    <>
      <div className="absolute inset-0 bg-black/40 z-10" />
      {hero.cover_image_url && (
        <img 
          src={hero.cover_image_url} 
          alt={hero.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      <div className="relative z-20 max-w-2xl px-12 flex flex-col gap-4">
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-dash-primary px-4 py-1.5 shadow-sm">
          <span className="size-1.5 rounded-full bg-white animate-pulse" />
          <span className="text-[11px] font-bold tracking-wider text-white uppercase">{hero.badge}</span>
        </span>
        <h2 className="text-[32px] leading-tight font-bold tracking-[-0.22px] text-white drop-shadow-md">{hero.title}</h2>
        <p className="text-[16px] text-white/90 drop-shadow">{hero.description}</p>
        <div className="mt-2 inline-flex w-fit items-center gap-2 rounded-lg bg-white px-6 py-3 text-dash-primary text-sm font-bold hover:bg-gray-50 transition-colors shadow-lg">
          {hero.cta}
          <ArrowRight size={16} />
        </div>
      </div>
    </>
  );

  return hero.id ? (
    <Link to={`/resources/artikel/${hero.id}`} className="relative h-96 rounded-xl2 overflow-hidden flex items-center group shadow-sm hover:shadow transition-shadow">
      {content}
    </Link>
  ) : (
    <div className="relative h-96 rounded-xl2 overflow-hidden flex items-center shadow-sm">
      {content}
    </div>
  );
}

export function CategoryFilters({ categories, active, onSelect }) {
  if (!categories?.length) return null;
  return (
    <div className="flex gap-3 items-center overflow-x-auto pt-4 pb-2">
      {categories.map((cat) => {
        const isActive = active === cat.id;
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelect(cat.id)}
            className={`shrink-0 rounded-full px-6 py-2.5 text-sm transition-all duration-300 font-medium ${
              isActive
                ? 'bg-dash-primary text-white shadow-md transform scale-105'
                : 'bg-white border border-auth-card text-dash-muted hover:border-dash-primary/40 hover:text-dash-text'
            }`}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}
