import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import useFetch from '../../hooks/useFetch.js';
import { getRecommendedResources } from '../../services/dashboardService.js';

function ResourceCard({ resource }) {
  return (
    <Link to={`/resources/artikel/${resource.id}`} className="flex-1 min-w-[260px] group">
      <div className="relative h-40 rounded-xl2 overflow-hidden bg-dash-primary/10 flex items-center justify-center text-dash-primary/30 text-sm">
        {resource.cover_image_url ? (
          <img 
            src={resource.cover_image_url} 
            alt={resource.title} 
            className="absolute inset-0 w-full h-full object-cover group-hover:opacity-90 transition-opacity" 
          />
        ) : (
          "Ilustrasi"
        )}
        <span
          className={`absolute top-3 left-3 backdrop-blur-md bg-white/90 rounded px-2.5 py-1 text-[10px] font-bold uppercase ${resource.typeColor} shadow-sm`}
        >
          {resource.type}
        </span>
      </div>
      <h4 className="text-[15px] leading-snug font-semibold text-dash-text pt-3 group-hover:text-dash-primary transition-colors">
        {resource.title}
      </h4>
      <p className="text-[11px] font-medium text-dash-muted pt-1.5">{resource.subtitle}</p>
    </Link>
  );
}

export default function RecommendedResources() {
  const { data: resources, loading } = useFetch(getRecommendedResources, []);

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-dash-text">Rekomendasi Untukmu</h3>
        <Link
          to="/resources"
          className="flex items-center gap-1 text-[13px] text-dash-primary hover:underline"
        >
          Lihat Galeri
          <ChevronRight size={14} />
        </Link>
      </div>

      <div className="flex gap-6 flex-wrap">
        {loading &&
          [1, 2, 3].map((n) => (
            <div key={n} className="flex-1 min-w-[260px] h-52 rounded-xl2 bg-white/60 animate-pulse" />
          ))}

        {resources?.map((resource) => (
          <ResourceCard key={resource.id} resource={resource} />
        ))}
      </div>
    </section>
  );
}
