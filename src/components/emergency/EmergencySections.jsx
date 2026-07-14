import { AlertTriangle, PhoneCall, ShieldAlert, MessageSquareHeart, Wind, ShieldCheck, Heart, MapPin, Navigation, Phone } from 'lucide-react';

const COLOR_BG = { red: 'bg-[#fef2f2]', blue: 'bg-[#eff6ff]', purple: 'bg-[#faf5ff]' };
const COLOR_ICON = { red: PhoneCall, blue: ShieldAlert, purple: MessageSquareHeart };

export function EmergencyBannerHeader() {
  return (
    <div className="bg-[#fef2f2] border border-dash-danger/20 rounded-xl p-6 flex items-center justify-between shadow-sm">
      <div className="max-w-2xl flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <AlertTriangle size={18} className="text-dash-danger" />
          <h2 className="text-[22px] leading-8 font-semibold tracking-[-0.22px] text-dash-text">Anda Tidak Sendirian.</h2>
        </div>
        <p className="text-[15px] text-dash-muted">
          Jika Anda merasa dalam bahaya segera atau membutuhkan bantuan mendesak, gunakan tombol panggil cepat di bawah
          ini. Kami di sini untuk mendukung Anda.
        </p>
      </div>
      <a
        href="tel:119"
        className="flex items-center gap-3 rounded-lg bg-dash-danger px-8 py-4 text-white font-bold shadow-lg shrink-0"
      >
        <PhoneCall size={18} /> Hubungi 119
      </a>
    </div>
  );
}

export function QuickCallList({ contacts }) {
  if (!contacts?.length) return null;
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm font-semibold tracking-wider text-dash-linkMuted uppercase px-1">Kontak Cepat</p>
      {contacts.map((c) => {
        const Icon = COLOR_ICON[c.color] || PhoneCall;
        return (
          <div key={c.id} className="bg-white border border-dash-border rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className={`size-10 rounded-full flex items-center justify-center shrink-0 ${COLOR_BG[c.color]}`}>
                <Icon size={18} className="text-dash-danger" />
              </span>
              <div>
                <p className="text-base font-bold text-dash-text">{c.name}</p>
                <p className="text-xs text-dash-linkMuted">{c.note}</p>
              </div>
            </div>
            <span className="text-base font-bold text-dash-primary text-center">{c.phone}</span>
          </div>
        );
      })}
    </div>
  );
}

export function BreathingExercise() {
  return (
    <div className="bg-white border border-dash-border rounded-xl p-8 flex flex-col items-center gap-8 relative overflow-hidden">
      <div className="self-start flex flex-col gap-1">
        <p className="flex items-center gap-2 text-sm font-semibold tracking-widest text-dash-primary uppercase">
          <Wind size={16} /> Latihan Pernapasan
        </p>
        <p className="text-[13px] text-dash-linkMuted">Ikuti lingkaran untuk menenangkan diri</p>
      </div>
      <div className="size-48 rounded-full bg-dash-primary/10 border-2 border-dash-primary/30 flex items-center justify-center">
        <span className="text-dash-primary font-bold text-xl tracking-widest uppercase">Tahan</span>
      </div>
      <div className="flex gap-8">
        {[
          ['Langkah 1', '4 Detik Tarik'],
          ['Langkah 2', '4 Detik Tahan'],
          ['Langkah 3', '4 Detik Buang'],
        ].map(([step, label]) => (
          <div key={step} className="flex flex-col items-center gap-1">
            <span className="text-[11px] font-bold text-dash-linkMuted uppercase">{step}</span>
            <span className="text-[13px] font-bold text-dash-text">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function GroundingExercise({ steps }) {
  if (!steps?.length) return null;
  return (
    <div className="bg-white border border-dash-border rounded-xl p-6 flex flex-col gap-6">
      <p className="flex items-center gap-3 text-sm font-semibold text-dash-text">
        <Heart size={18} /> Metode Grounding 5-4-3-2-1
      </p>
      <div className="flex gap-4">
        {steps.map((s) => (
          <div key={s.label} className="flex-1 border border-dash-border rounded-lg p-4 flex flex-col gap-1 text-center">
            <span className="text-[22px] font-extrabold tracking-tight text-dash-primary">{s.count}</span>
            <span className="text-[11px] font-bold uppercase text-dash-linkMuted">{s.label}</span>
            <span className="text-xs text-dash-text">{s.description}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SafetyTipsCard({ tips }) {
  if (!tips?.length) return null;
  return (
    <div className="bg-white border border-dash-border rounded-xl p-6 flex flex-col gap-3">
      <p className="flex items-center gap-2 text-sm font-semibold text-dash-text">
        <ShieldCheck size={16} /> Langkah Keselamatan
      </p>
      <ul className="flex flex-col gap-2">
        {tips.map((tip) => (
          <li key={tip} className="flex gap-2 text-[13px] text-dash-muted">
            <span className="text-dash-muted">•</span> {tip}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AffirmationsCard({ affirmations }) {
  if (!affirmations?.length) return null;
  return (
    <div className="bg-white border border-dash-border rounded-xl p-6 flex flex-col gap-3">
      <p className="flex items-center gap-2 text-sm font-semibold text-dash-text">
        <MessageSquareHeart size={16} /> Afirmasi Menenangkan
      </p>
      <ul className="flex flex-col gap-2">
        {affirmations.map((a) => (
          <li key={a} className="text-[13px] italic text-dash-muted">&ldquo;{a}&rdquo;</li>
        ))}
      </ul>
    </div>
  );
}

export function ProfessionalHelpCard() {
  return (
    <div className="rounded-xl p-6 flex flex-col gap-3 border border-dash-primary/20 bg-gradient-to-br from-dash-primary/5 to-white">
      <p className="flex items-center gap-2 text-sm font-semibold text-dash-primary">
        <MessageSquareHeart size={16} /> Bantuan Profesional
      </p>
      <p className="text-[13px] text-dash-muted">
        Butuh teman bicara non-darurat? Konselor kami tersedia untuk janji temu segera.
      </p>
      <a
        href="/schedule-session"
        className="rounded-lg bg-dash-primary text-white text-[11px] font-bold uppercase tracking-wide text-center py-2"
      >
        Jadwalkan Konsultasi
      </a>
    </div>
  );
}

export function NearestHospitalCard({ hospital }) {
  if (!hospital) return null;
  return (
    <div className="bg-white border border-dash-border rounded-xl overflow-hidden">
      <div className="bg-[#eceef0] border-b border-dash-border px-4 py-4 flex items-center justify-between">
        <p className="flex items-center gap-2 text-sm font-semibold text-dash-text">
          <MapPin size={18} /> Rumah Sakit Terdekat (IGD)
        </p>
        <span className="rounded-full bg-dash-success/10 px-2 py-0.5 text-[11px] font-bold text-dash-success">
          {hospital.distance}
        </span>
      </div>
      <div className="h-48 bg-gradient-to-br from-dash-primary/15 to-dash-moodBlue/15" />
      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-base font-bold text-dash-text">{hospital.name}</p>
            <p className="text-xs text-dash-linkMuted">{hospital.address}</p>
          </div>
          <span className="size-10 rounded-full bg-dash-primary flex items-center justify-center shrink-0">
            <Navigation size={18} className="text-white" />
          </span>
        </div>
        <div className="border-t border-dash-border pt-3 flex items-center gap-3">
          <Phone size={13.5} className="text-dash-muted" />
          <span className="text-[13px] text-dash-text">{hospital.phone}</span>
        </div>
      </div>
    </div>
  );
}
