import { ShieldCheck, Wifi, Users, Accessibility } from 'lucide-react';

const ICON_MAP = {
  'shield-check': ShieldCheck,
  wifi: Wifi,
  users: Users,
  accessibility: Accessibility,
};

const ICON_BG = {
  'shield-check': 'bg-primary-light',
  wifi: 'bg-primary-soft',
  users: 'bg-[#657785]',
  accessibility: 'bg-primary-light',
};

/**
 * Kartu fitur untuk bento grid Landing Page.
 * size 'lg' -> 8 kolom (menampilkan gambar di sisi kanan)
 * size 'sm' -> 4 kolom (teks saja)
 */
export default function FeatureCard({ feature }) {
  const Icon = ICON_MAP[feature.icon] ?? ShieldCheck;
  const isLarge = feature.size === 'lg';

  return (
    <div
      className={`bg-white border border-border rounded-xl2 shadow-[0px_1px_1px_rgba(0,0,0,0.05)] p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 ${
        isLarge ? 'md:col-span-8' : 'md:col-span-4'
      }`}
    >
      <div className={`flex-1 min-w-0 flex flex-col gap-2 ${isLarge ? '' : 'w-full'}`}>
        <span
          className={`flex items-center justify-center size-12 rounded-xl2 text-white ${ICON_BG[feature.icon]}`}
        >
          <Icon size={22} />
        </span>
        <h3 className="text-2xl leading-8 font-semibold tracking-[-0.24px] text-ink pt-2">
          {feature.title}
        </h3>
        <p className="text-base leading-6 text-ink-muted">{feature.description}</p>
      </div>

      {feature.hasImage && (
        <div className="flex-1 w-full h-48 rounded-xl2 bg-surface-tint flex items-center justify-center text-primary/30 text-sm">
          Ilustrasi
        </div>
      )}
    </div>
  );
}
