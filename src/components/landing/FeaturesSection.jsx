import useFetch from '../../hooks/useFetch.js';
import { getFeatures } from '../../services/landingService.js';
import SectionHeading from '../common/SectionHeading.jsx';
import FeatureCard from './FeatureCard.jsx';

export default function FeaturesSection() {
  const { data: features, loading } = useFetch(getFeatures, []);

  return (
    <section id="fitur" className="px-6 md:px-10 py-16 md:py-24">
      <div className="max-w-content mx-auto px-6 flex flex-col gap-16">
        <SectionHeading
          title="Fitur Unggulan MindCare"
          description="Dirancang khusus untuk kebutuhan mahasiswa dengan teknologi yang mengutamakan aksesibilitas dan keamanan."
        />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {loading &&
            [1, 2, 3, 4].map((n) => (
              <div key={n} className="md:col-span-6 h-64 rounded-xl2 bg-surface-tint animate-pulse" />
            ))}

          {features?.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
