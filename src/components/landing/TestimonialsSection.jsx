import useFetch from '../../hooks/useFetch.js';
import { getTestimonials } from '../../services/landingService.js';
import SectionHeading from '../common/SectionHeading.jsx';
import TestimonialCard from './TestimonialCard.jsx';

export default function TestimonialsSection() {
  const { data: testimonials, loading } = useFetch(getTestimonials, []);

  return (
    <section id="testimoni" className="bg-surface-tint2 px-6 md:px-10 py-16 md:py-24 overflow-hidden">
      <div className="max-w-content mx-auto px-6 flex flex-col gap-16">
        <SectionHeading
          title="Cerita Mereka"
          description="Bagaimana MindCare mengubah hari-hari mahasiswa di seluruh Indonesia."
        />

        <div className="flex gap-6 overflow-x-auto pb-4 -mx-6 px-6 md:mx-0 md:px-0 md:justify-center md:flex-wrap">
          {loading &&
            [1, 2, 3].map((n) => (
              <div key={n} className="w-full md:w-[400px] h-64 rounded-xl2 bg-white/60 animate-pulse shrink-0" />
            ))}

          {testimonials?.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}
