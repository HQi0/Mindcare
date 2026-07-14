import { ShieldCheck } from 'lucide-react';

export default function PrivacyNotice() {
  return (
    <div className="md:col-span-12 bg-auth-input border border-auth-card rounded-xl2 p-6 flex items-center gap-6 flex-wrap">
      <span className="flex items-center justify-center size-12 rounded-full bg-dash-primary/10 text-dash-primary shrink-0">
        <ShieldCheck size={24} />
      </span>
      <div className="flex-1 min-w-[240px]">
        <h4 className="text-sm font-semibold text-dash-text">Privasi Anda Adalah Prioritas Kami</h4>
        <p className="text-[13px] leading-[18px] text-dash-muted pt-0.5">
          Hasil penilaian Anda hanya dapat diakses oleh Anda. Jika Anda memilih untuk
          membagikannya dengan konselor profesional melalui MindCare, data akan dikirimkan melalui
          jalur aman terenkripsi end-to-end.
        </p>
      </div>
      <button
        type="button"
        className="border border-auth-card rounded-lg px-6 py-2 text-[13.5px] text-dash-muted whitespace-nowrap"
      >
        Pelajari Kebijakan Privasi
      </button>
    </div>
  );
}
