/**
 * Heading + deskripsi center-aligned yang dipakai berulang di
 * Landing Page (Features, How It Works, Testimonials, FAQ, dst).
 */
export default function SectionHeading({ title, description, className = '' }) {
  return (
    <div className={`flex flex-col items-center gap-4 w-full ${className}`}>
      <h2 className="text-[32px] leading-[40px] font-semibold tracking-[-0.32px] text-ink text-center">
        {title}
      </h2>
      {description && (
        <p className="text-base leading-6 text-ink-muted text-center max-w-2xl">{description}</p>
      )}
    </div>
  );
}
