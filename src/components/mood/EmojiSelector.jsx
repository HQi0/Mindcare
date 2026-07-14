export default function EmojiSelector({ emotions, selected, onSelect }) {
  return (
    <div className="flex flex-col gap-4 w-full">
      <p className="text-sm font-semibold text-dash-primary">Pilih suasana hatimu</p>
      <div className="flex gap-3 flex-wrap">
        {emotions?.map((emotion) => {
          const isActive = selected === emotion.key;
          return (
            <button
              key={emotion.key}
              type="button"
              onClick={() => onSelect(emotion.key)}
              className={`flex flex-col items-center gap-2 px-6 py-[17px] rounded-xl2 border transition-colors ${
                isActive
                  ? 'bg-[#f4f9ff] border-dash-primary/20 shadow-[0px_1px_1px_rgba(0,0,0,0.05)]'
                  : 'border-transparent hover:bg-dash-border/10'
              }`}
            >
              <span className="text-4xl leading-10">{emotion.emoji}</span>
              <span
                className={`text-[11px] font-bold whitespace-nowrap ${
                  isActive ? 'text-dash-primary' : 'text-dash-linkMuted'
                }`}
              >
                {emotion.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
