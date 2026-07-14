import { HeartPulse, Brain, UsersRound } from 'lucide-react';
import useFetch from '../../hooks/useFetch.js';
import { getBenefits } from '../../services/landingService.js';

const ICON_MAP = {
  'heart-pulse': HeartPulse,
  brain: Brain,
  'users-round': UsersRound,
};

export default function BenefitsSection() {
  const { data: benefits, loading } = useFetch(getBenefits, []);

  return (
    <section className="px-6 md:px-10 py-16 md:py-24">
      <div className="max-w-content mx-auto px-6 flex flex-col md:flex-row gap-12 md:gap-16 items-center">
        <div className="flex-1 w-full h-[320px] md:h-[500px] rounded-2xl2 overflow-hidden relative shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] bg-ink/80">
          {/* Placeholder foto — ganti dengan asset final */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-10">
            <h3 className="text-2xl leading-8 font-semibold tracking-[-0.24px] text-white">
              Fokus pada Hal Terpenting
            </h3>
            <p className="text-base leading-6 text-white/80 pt-1">
              Kesehatan mental yang stabil mendukung performa akademik yang optimal.
            </p>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-8 w-full">
          <h2 className="text-[32px] leading-10 font-semibold tracking-[-0.32px] text-ink">
            Manfaat untuk Anda
          </h2>

          <div className="flex flex-col gap-6">
            {loading &&
              [1, 2, 3].map((n) => (
                <div key={n} className="h-16 rounded-xl2 bg-surface-tint animate-pulse" />
              ))}

            {benefits?.map((benefit) => {
              const Icon = ICON_MAP[benefit.icon] ?? HeartPulse;
              return (
                <div key={benefit.id} className="flex gap-4 items-start">
                  <span className="flex items-center justify-center p-2 rounded-lg bg-primary-light text-white shrink-0">
                    <Icon size={20} />
                  </span>
                  <div className="flex flex-col gap-1">
                    <h5 className="text-lg leading-7 font-bold text-ink">{benefit.title}</h5>
                    <p className="text-base leading-6 text-ink-muted">{benefit.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
