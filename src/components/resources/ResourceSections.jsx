import { Link } from 'react-router-dom';
import { ChevronRight, Play, PlayCircle } from 'lucide-react';

function SectionHeader({ title, description, cta = true }) {
  return (
    <div className="flex items-end justify-between w-full">
      <div>
        <h3 className="text-[22px] leading-8 font-semibold tracking-[-0.22px] text-dash-text">{title}</h3>
        <p className="text-[13px] text-dash-linkMuted">{description}</p>
      </div>
      {cta && (
        <Link to="#" className="flex items-center gap-1 text-dash-primary text-sm font-medium">
          Lihat Semua <ChevronRight size={14} />
        </Link>
      )}
    </div>
  );
}

export function StressManagementSection({ section }) {
  if (!section) return null;
  return (
    <div className="flex flex-col gap-6 w-full">
      <SectionHeader title={section.title} description={section.description} />
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <Link
          to={`/resources/artikel/${section.featured.id}`}
          className="md:col-span-7 flex flex-col bg-white border border-auth-card rounded-xl overflow-hidden hover:shadow-sm transition-shadow"
        >
          <div className="h-64 bg-gradient-to-br from-dash-primary/20 to-dash-moodBlue/20 relative">
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="rounded-full bg-white/90 backdrop-blur px-3 py-1 text-[11px] font-bold text-dash-primary uppercase">
                {section.featured.type}
              </span>
              <span className="rounded-full bg-black/20 backdrop-blur px-3 py-1 text-[11px] font-bold text-white uppercase">
                {section.featured.duration}
              </span>
            </div>
          </div>
          <div className="p-6 flex flex-col gap-2">
            <h4 className="text-[22px] leading-8 font-semibold tracking-[-0.22px] text-dash-text">
              {section.featured.title}
            </h4>
            <p className="text-[13.5px] text-dash-muted">{section.featured.description}</p>
            <div className="flex items-center gap-3 pt-2">
              <span className="size-6 rounded-full bg-dash-primary/30" />
              <span className="text-xs text-dash-linkMuted">Ditulis oleh {section.featured.author}</span>
            </div>
          </div>
        </Link>

        <div className="md:col-span-5 flex flex-col gap-6">
          {section.secondary.map((item) => (
            <div key={item.id} className="flex gap-4 p-4 bg-white border border-auth-card rounded-xl">
              <div className="size-24 rounded-lg bg-gradient-to-br from-dash-primary/15 to-dash-moodBlue/15 shrink-0" />
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-dash-primary uppercase">{item.type}</span>
                  <span className="text-[11px] text-dash-linkMuted">• {item.duration}</span>
                </div>
                <p className="text-[16px] text-dash-text leading-snug mt-0.5">{item.title}</p>
                <button type="button" className="flex items-center gap-1 text-dash-primary text-xs font-bold pt-2">
                  {item.type === 'AUDIO' ? <Play size={11} /> : <PlayCircle size={13} />}
                  {item.actionLabel}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SleepOptimizationSection({ section }) {
  if (!section) return null;
  return (
    <div className="flex flex-col gap-6 w-full pt-4">
      <SectionHeader title={section.title} description={section.description} cta={false} />
      <div className="flex gap-6 overflow-x-auto pb-2">
        {section.cards.map((card) => (
          <div
            key={card.id}
            className="min-w-[280px] w-80 shrink-0 bg-white border border-auth-card rounded-xl overflow-hidden"
          >
            <div className="h-40 bg-gradient-to-br from-dash-moodBlue/20 to-dash-primary/10 relative">
              <span className="absolute left-3 bottom-3 rounded bg-white/90 px-2 py-0.5 text-[11px] font-bold text-dash-primary">
                {card.category}
              </span>
            </div>
            <div className="p-4 flex flex-col gap-4">
              <p className="text-[16px] text-dash-text">{card.title}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-dash-linkMuted">{card.duration}</span>
                <PlayCircle size={16} className="text-dash-primary" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AcademicPressureSection({ section }) {
  if (!section) return null;
  return (
    <div className="flex flex-col gap-6 w-full pt-4">
      <SectionHeader title={section.title} description={section.description} cta={false} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {section.cards.map((card) => (
          <div key={card.id} className="bg-white border border-auth-card rounded-xl p-6 flex flex-col justify-between">
            <div className="flex flex-col gap-2">
              <div className="h-48 rounded-lg bg-gradient-to-br from-dash-primary/15 to-dash-moodBlue/15" />
              <h4 className="text-[22px] leading-8 font-semibold tracking-[-0.22px] text-dash-text pt-2">{card.title}</h4>
              <p className="text-[13.5px] text-dash-muted">{card.description}</p>
            </div>
            <div className="border-t border-auth-card flex items-center justify-between pt-4 mt-6">
              <span className="text-xs font-bold text-dash-text">{card.meta}</span>
              <span className="text-[11px] uppercase text-dash-linkMuted">{card.badge}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RecommendationBanner() {
  return (
    <div className="bg-dash-primary rounded-2xl px-8 pt-12 pb-8 flex flex-col gap-2 w-full">
      <h3 className="text-[22px] leading-8 font-semibold tracking-[-0.22px] text-white">Ingin rekomendasi personal?</h3>
      <p className="text-[15px] text-white/90 max-w-xl">
        Ambil kuis penilaian diri singkat (2 menit) untuk menemukan sumber daya yang paling sesuai dengan kondisi mental
        Anda saat ini.
      </p>
      <div className="flex gap-4 pt-4">
        <Link to="/self-assessment" className="rounded-lg bg-white px-8 py-3 text-dash-primary text-sm shadow-lg">
          Mulai Penilaian
        </Link>
        <button type="button" className="rounded-lg border border-white/20 bg-white/10 px-8 py-3 text-white text-sm">
          Pelajari Caranya
        </button>
      </div>
    </div>
  );
}
