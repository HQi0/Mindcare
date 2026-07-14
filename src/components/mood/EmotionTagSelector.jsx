export default function EmotionTagSelector({ tags, selected, onToggle }) {
  return (
    <div className="flex flex-col gap-4 w-full">
      <p className="text-sm font-semibold text-dash-primary">Kenapa kamu merasa begini?</p>
      <div className="flex flex-wrap gap-2">
        {tags?.map((tag) => {
          const isActive = selected.includes(tag.key);
          return (
            <button
              key={tag.key}
              type="button"
              onClick={() => onToggle(tag.key)}
              className={`px-[17px] py-[7px] rounded-full border text-[13px] transition-colors ${
                isActive
                  ? 'bg-dash-primary/5 border-dash-primary text-dash-primary'
                  : 'bg-white border-auth-card text-dash-text'
              }`}
            >
              {tag.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
