import { Star } from 'lucide-react';

const AVATAR_BG = {
  'primary-light': 'bg-primary-light text-primary',
  'primary-soft': 'bg-primary-soft text-[#2a5ea8]',
  slate: 'bg-[#657785] text-white',
};

export default function TestimonialCard({ testimonial }) {
  return (
    <div className="bg-white border border-border rounded-xl2 p-8 md:p-10 flex flex-col gap-4 w-full md:w-[400px] shrink-0">
      <div className="flex gap-1">
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <Star key={i} size={18} className="fill-primary-soft text-primary-soft" />
        ))}
      </div>

      <p className="text-base leading-6 italic text-ink-muted">“{testimonial.quote}”</p>

      <div className="flex items-center gap-4 pt-2">
        <span
          className={`flex items-center justify-center size-10 rounded-full font-bold text-base ${AVATAR_BG[testimonial.color]}`}
        >
          {testimonial.initials}
        </span>
        <p className="text-sm font-medium tracking-[0.14px] text-ink">{testimonial.name}</p>
      </div>
    </div>
  );
}
