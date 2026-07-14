import { Star, Video } from 'lucide-react';

function getInitials(name) {
  if (!name) return 'KC';

  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

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
  const isAvailable = counselor.available !== false;
  return (
    <button
      type="button"
      disabled={!isAvailable}
      onClick={() => onSelect(counselor.id)}
      className={`flex-1 text-left rounded-xl p-4 flex flex-col gap-4 transition-colors ${
        isSelected ? 'bg-white border border-auth-card ring-2 ring-dash-primary shadow-sm' : 'bg-white border border-auth-card'
      } ${!isAvailable ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <div className="flex gap-4">
        <span className="size-16 rounded-full overflow-hidden bg-dash-primary/10 border border-auth-card shrink-0 flex items-center justify-center">
          {counselor.avatarUrl ? (
            <img
              src={counselor.avatarUrl}
              alt={counselor.name}
              className="size-full object-cover"
              onError={(event) => {
                event.currentTarget.style.display = 'none';
                const fallback = event.currentTarget.parentElement?.querySelector('[data-fallback]');
                if (fallback) fallback.style.display = 'flex';
              }}
            />
          ) : null}
          <span
            data-fallback
            className={`size-full items-center justify-center text-sm font-semibold text-dash-primary ${counselor.avatarUrl ? 'hidden' : 'flex'}`}
          >
            {getInitials(counselor.name)}
          </span>
        </span>
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-dash-primary">{counselor.name}</p>
            {isSelected && isAvailable && (
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
          <Video size={12} />
          {isAvailable ? counselor.mode || 'Online Saja' : 'Tidak Tersedia'}
        </span>
        <span className={`rounded-lg px-4 py-1.5 text-sm font-semibold text-center ${!isAvailable ? 'bg-[#eceef0] text-dash-linkMuted' : isSelected ? 'bg-[#2563eb] text-[#eeefff]' : 'bg-dash-primary text-white'}`}>
          {!isAvailable ? 'Penuh' : isSelected ? 'Terpilih' : 'Pilih'}
        </span>
      </div>
    </button>
  );
}
