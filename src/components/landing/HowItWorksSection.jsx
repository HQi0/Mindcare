import useFetch from '../../hooks/useFetch.js';
import { getHowItWorksSteps } from '../../services/landingService.js';
import SectionHeading from '../common/SectionHeading.jsx';

export default function HowItWorksSection() {
  const { data: steps, loading } = useFetch(getHowItWorksSteps, []);

  return (
    <section id="cara-kerja" className="bg-primary/5 px-6 md:px-10 py-16 md:py-24">
      <div className="max-w-content mx-auto px-6 flex flex-col gap-16">
        <SectionHeading
          title="Bagaimana Cara Kerjanya?"
          description="Hanya butuh 3 langkah sederhana untuk mulai memprioritaskan diri Anda."
        />

        <div className="relative flex flex-col md:flex-row gap-12 md:gap-0">
          {loading &&
            [1, 2, 3].map((n) => (
              <div key={n} className="flex-1 h-40 rounded-xl2 bg-white/60 animate-pulse" />
            ))}

          {steps?.map((step, index) => (
            <div key={step.id} className="relative flex-1 flex flex-col items-center gap-2 text-center">
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-1/2 w-full border-t-2 border-dashed border-primary/30" />
              )}
              <span className="relative z-10 flex items-center justify-center size-16 rounded-full bg-primary text-white text-2xl font-bold tracking-[-0.24px]">
                {step.number}
              </span>
              <h4 className="text-2xl leading-8 font-semibold tracking-[-0.24px] text-ink pt-2">
                {step.title}
              </h4>
              <p className="text-base leading-6 text-ink-muted max-w-[260px]">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
