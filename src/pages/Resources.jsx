import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import useFetch from '../hooks/useFetch.js';
import { getCategories, getHero, getArticles } from '../services/resourcesService.js';
import { ResourcesHero, CategoryFilters } from '../components/resources/ResourcesHero.jsx';
import { ResourceGrid, RecommendationBanner } from '../components/resources/ResourceSections.jsx';

export default function Resources() {
  const { data: categories } = useFetch(getCategories, []);
  const { data: hero } = useFetch(getHero, []);
  
  const [activeCategory, setActiveCategory] = useState('semua');
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    if (categories?.length && !activeCategory) setActiveCategory(categories[0].id);
  }, [categories, activeCategory]);

  // Fetch articles based on active category
  const { data: articles, loading } = useFetch(() => getArticles(activeCategory), [activeCategory]);

  // Apply search query filter
  const filteredArticles = (articles || []).filter(article => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      (article.title && article.title.toLowerCase().includes(q)) ||
      (article.description && article.description.toLowerCase().includes(q))
    );
  });

  const handleResetSearch = () => {
    setSearchParams({});
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      {!searchQuery ? (
        <>
          <ResourcesHero hero={hero} />
          <CategoryFilters categories={categories} active={activeCategory} onSelect={setActiveCategory} />
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full pt-4">
              {[1, 2, 3].map(n => (
                <div key={n} className="h-72 bg-white border border-auth-card rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <ResourceGrid articles={filteredArticles} />
          )}
          
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
              Menampilkan {filteredArticles.length} artikel.
            </p>
          </div>

          <CategoryFilters categories={categories} active={activeCategory} onSelect={setActiveCategory} />

          {filteredArticles.length === 0 ? (
            <div className="bg-white border border-dash-border rounded-xl p-12 text-center flex flex-col items-center justify-center gap-3 shadow-sm">
              <p className="text-sm font-semibold text-dash-text">
                Tidak menemukan hasil pencarian untuk "{searchQuery}"
              </p>
              <button
                type="button"
                onClick={handleResetSearch}
                className="rounded-lg bg-dash-primary hover:bg-opacity-90 text-white text-xs font-semibold px-4 py-2 transition-colors"
              >
                Reset Pencarian
              </button>
            </div>
          ) : (
            <ResourceGrid articles={filteredArticles} />
          )}
        </>
      )}
    </div>
  );
}
