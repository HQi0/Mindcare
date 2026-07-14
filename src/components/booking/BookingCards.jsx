import { Star, Video, MapPin } from 'lucide-react';

export function BookingStepper({ step }) {
  const steps = ['Pilih Konselor', 'Pilih Jadwal', 'Konfirmasi'];
  return (
    <div className="flex items-center w-full px-4">
      {steps.map((label, i) => {
        const num = i + 1;
        const isActive = num <= step;
        return (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-2 shrink-0">
              <span
                className={`size-10 rounded-full flex items-center justify-center font-bold text-sm ${
                  isActive ? 'bg-dash-primary text-white shadow-sm' : 'bg-[#eceef0] text-dash-linkMuted'
                }`}
              >
                {num}
              </span>
              <span className={`text-sm ${isActive ? 'text-dash-primary' : 'text-dash-linkMuted'}`}>{label}</span>
            </div>
            {num < steps.length && <div className="flex-1 h-0.5 bg-auth-card mx-4 -mt-6" />}
          </div>
        );
      })}
    </div>
  );
}

export function CounselorCard({ counselor, selected, onSelect }) {
  const isSelected = selected === counselor.id || counselor.selected;
  return (
    <button
      type="button"
      onClick={() => onSelect(counselor.id)}
      className={`flex-1 text-left rounded-xl p-4 flex flex-col gap-4 transition-colors ${
        isSelected ? 'bg-white border-2 border-dash-primary shadow-sm' : 'bg-white border border-auth-card'
      }`}
    >
      <div className="flex gap-4">
        <span className="size-16 rounded-lg bg-dash-primary/20 shrink-0" />
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-dash-primary">{counselor.name}</p>
            {isSelected && (
              <span className="rounded-full bg-dash-success text-white text-[10px] font-bold px-2 py-0.5 uppercase">
                Selected
              </span>
            )}
          </div>
          <p className="text-xs text-dash-linkMuted">{counselor.role}</p>
          <p className="flex items-center gap-1 text-[11px] font-medium text-dash-text pt-1">
            <Star size={11} className="fill-amber-400 text-amber-400" /> {counselor.rating} ({counselor.reviews})
          </p>
        </div>
      </div>
      <div className="flex gap-2 flex-wrap">
        {counselor.tags.map((tag) => (
          <span key={tag} className="rounded bg-[#d8e2ff] text-[#004395] text-[11px] px-2 py-0.5">{tag}</span>
        ))}
      </div>
      <div className="border-t border-auth-card pt-3 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-xs text-dash-muted">
          {counselor.mode ? <MapPin size={13} /> : <Video size={12} />}
          {counselor.mode || 'Online & Tatap Muka'}
        </span>
        <span className={`rounded-lg px-4 py-1.5 text-sm font-semibold text-center ${isSelected ? 'bg-[#2563eb] text-[#eeefff]' : 'bg-dash-primary text-white'}`}>
          {isSelected ? 'Terpilih' : 'Pilih'}
        </span>
      </div>
    </button>
  );
}
