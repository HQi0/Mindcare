import { ChevronDown } from 'lucide-react';
import useFetch from '../../hooks/useFetch.js';
import { getFaqs } from '../../services/landingService.js';
import SectionHeading from '../common/SectionHeading.jsx';

export default function FAQSection() {
  const { data: faqs, loading } = useFetch(getFaqs, []);

  return (
    <section id="faq" className="px-6 md:px-10 py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-6 flex flex-col gap-16">
        <SectionHeading
          title="Pertanyaan Populer"
          description="Segala hal yang ingin Anda ketahui tentang layanan kami."
        />

        <div className="flex flex-col gap-4">
          {loading &&
            [1, 2, 3, 4].map((n) => (
              <div key={n} className="h-16 rounded-xl2 bg-surface-tint animate-pulse" />
            ))}

          {faqs?.map((faq) => (
            <details
              key={faq.id}
              className="group bg-white border border-border rounded-xl2 overflow-hidden"
            >
              <summary className="flex items-center justify-between gap-4 p-6 cursor-pointer list-none">
                <span className="text-sm font-bold tracking-[0.14px] text-ink">{faq.question}</span>
                <ChevronDown
                  size={16}
                  className="shrink-0 text-ink-muted transition-transform duration-200 group-open:rotate-180"
                />
              </summary>
              <p className="px-6 pb-6 text-base leading-6 text-ink-muted">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
