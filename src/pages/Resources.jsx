import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch.js';
import { getCategories, getHero, getStressSection, getSleepSection, getAcademicSection } from '../services/resourcesService.js';
import { ResourcesHero, CategoryFilters } from '../components/resources/ResourcesHero.jsx';
import {
  StressManagementSection,
  SleepOptimizationSection,
  AcademicPressureSection,
  RecommendationBanner,
} from '../components/resources/ResourceSections.jsx';

function SearchCard({ resource }) {
  const badgeColors = {
    artikel: 'text-dash-moodBlue bg-blue-50 border-blue-150',
    video: 'text-dash-amber bg-amber-50 border-amber-150',
    audio: 'text-dash-primary bg-indigo-50 border-indigo-150',
    meditasi: 'text-dash-success bg-green-50 border-green-150'
  };
  const badgeClass = badgeColors[resource.category] || 'text-dash-muted bg-gray-50 border-gray-150';

  return (
    <Link 
      to={`/resources/artikel/${resource.id}`} 
      className="bg-white border border-dash-border rounded-xl p-5 flex flex-col justify-between shadow-sm hover:shadow-md hover:border-dash-primary/30 transition-all group w-full md:w-[31.5%]"
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <span className={`rounded px-2.5 py-0.5 text-[9px] font-bold uppercase border ${badgeClass}`}>
            {resource.category}
          </span>
          <span className="text-[10px] text-dash-muted font-semibold">{resource.duration}</span>
        </div>
        <div>
          <h4 className="text-sm font-bold text-dash-text group-hover:text-dash-primary transition-colors leading-snug">
            {resource.title}
          </h4>
          {resource.description && (
            <p className="text-xs text-dash-muted pt-1.5 leading-relaxed line-clamp-2">
              {resource.description}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-dash-border/40 pt-3 mt-4 text-[10px] text-dash-muted">
        <span className="italic font-medium">{resource.sectionTitle}</span>
        <span className="font-semibold text-dash-primary group-hover:underline">Buka →</span>
      </div>
    </Link>
  );
}

export default function Resources() {
  const { data: categories } = useFetch(getCategories, []);
  const { data: hero } = useFetch(getHero, []);
  const { data: stress } = useFetch(getStressSection, []);
  const { data: sleep } = useFetch(getSleepSection, []);
  const { data: academic } = useFetch(getAcademicSection, []);
  
  const [activeCategory, setActiveCategory] = useState('semua');
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  const [filteredResources, setFilteredResources] = useState([]);

  useEffect(() => {
    if (categories?.length) {
      setActiveCategory((c) => c || categories[0].id);
    }
  }, [categories]);

  // Index and filter all available resource cards
  useEffect(() => {
    const pool = [];

    // 1. Collect stress section resources
    if (stress) {
      if (stress.featured) {
        pool.push({
          id: stress.featured.id,
          title: stress.featured.title,
          description: stress.featured.description,
          category: stress.featured.type?.toLowerCase() || 'artikel',
          duration: stress.featured.duration || '8 Menit',
          sectionTitle: stress.title
        });
      }
      if (stress.secondary) {
        stress.secondary.forEach(item => {
          pool.push({
            id: item.id,
            title: item.title,
            description: '',
            category: item.type?.toLowerCase() || 'audio',
            duration: item.duration || '12 Menit',
            sectionTitle: stress.title
          });
        });
      }
    }

    // 2. Collect sleep section resources
    if (sleep && sleep.cards) {
      sleep.cards.forEach(item => {
        pool.push({
          id: item.id,
          title: item.title,
          description: '',
          category: item.category?.toLowerCase() || 'meditasi',
          duration: item.duration || '15 Menit',
          sectionTitle: sleep.title
        });
      });
    }

    // 3. Collect academic section resources
    if (academic && academic.cards) {
      academic.cards.forEach(item => {
        const cat = item.meta?.toLowerCase().includes('video') ? 'video' : 'artikel';
        pool.push({
          id: item.id,
          title: item.title,
          description: item.description || '',
          category: cat,
          duration: item.badge || item.meta || 'BARU',
          sectionTitle: academic.title
        });
      });
    }

    // Search query filter
    let results = pool;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      results = results.filter(item => 
        (item.title && item.title.toLowerCase().includes(q)) ||
        (item.description && item.description.toLowerCase().includes(q)) ||
        (item.sectionTitle && item.sectionTitle.toLowerCase().includes(q))
      );
    }

    // Category chip filter (if it's not 'semua')
    if (activeCategory && activeCategory !== 'semua') {
      results = results.filter(item => item.category === activeCategory);
    }

    setFilteredResources(results);
  }, [stress, sleep, academic, searchQuery, activeCategory]);

  const handleResetSearch = () => {
    setSearchParams({});
  };

  return (
    <div className="flex flex-col gap-8">
      {!searchQuery ? (
        <>
          <ResourcesHero hero={hero} />
          <CategoryFilters categories={categories} active={activeCategory} onSelect={setActiveCategory} />
          <StressManagementSection section={stress} />
          <SleepOptimizationSection section={sleep} />
          <AcademicPressureSection section={academic} />
          <RecommendationBanner />
        </>
      ) : (
        <>
          <div className="flex flex-col gap-2 pt-2">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-[20px] font-bold text-dash-text">
                Hasil Pencarian untuk: <span className="text-dash-primary">"{searchQuery}"</span>
              </h3>
              <button
                type="button"
                onClick={handleResetSearch}
                className="text-xs font-semibold text-dash-primary hover:underline"
              >
                ← Kembali ke Semua Sumber Daya
              </button>
            </div>
            <p className="text-xs text-dash-muted">
              Menampilkan {filteredResources.length} materi pembelajaran.
            </p>
          </div>

          <CategoryFilters categories={categories} active={activeCategory} onSelect={setActiveCategory} />

          {filteredResources.length === 0 ? (
            <div className="bg-white border border-dash-border rounded-xl p-12 text-center flex flex-col items-center justify-center gap-3 shadow-sm">
              <p className="text-sm font-semibold text-dash-text">
                Tidak menemukan hasil pencarian untuk "{searchQuery}"
              </p>
              <button
                type="button"
                onClick={handleResetSearch}
                className="rounded-lg bg-dash-primary hover:bg-primary-light text-white text-xs font-semibold px-4 py-2 transition-colors"
              >
                Reset Pencarian
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-6 items-stretch">
              {filteredResources.map((resource) => (
                <SearchCard key={resource.id} resource={resource} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
