import { useEffect, useState } from 'react';
import useFetch from '../hooks/useFetch.js';
import { getCategories, getHero, getStressSection, getSleepSection, getAcademicSection } from '../services/resourcesService.js';
import { ResourcesHero, CategoryFilters } from '../components/resources/ResourcesHero.jsx';
import {
  StressManagementSection,
  SleepOptimizationSection,
  AcademicPressureSection,
  RecommendationBanner,
} from '../components/resources/ResourceSections.jsx';

export default function Resources() {
  const { data: categories } = useFetch(getCategories, []);
  const { data: hero } = useFetch(getHero, []);
  const { data: stress } = useFetch(getStressSection, []);
  const { data: sleep } = useFetch(getSleepSection, []);
  const { data: academic } = useFetch(getAcademicSection, []);
  const [activeCategory, setActiveCategory] = useState('semua');

  useEffect(() => {
    if (categories?.length) setActiveCategory((c) => c || categories[0].id);
  }, [categories]);

  return (
    <div className="flex flex-col gap-8">
      <ResourcesHero hero={hero} />
      <CategoryFilters categories={categories} active={activeCategory} onSelect={setActiveCategory} />
      <StressManagementSection section={stress} />
      <SleepOptimizationSection section={sleep} />
      <AcademicPressureSection section={academic} />
      <RecommendationBanner />
    </div>
  );
}
