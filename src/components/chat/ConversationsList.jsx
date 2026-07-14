import { Search } from 'lucide-react';

export default function ConversationsList({ conversations, activeId, onSelect }) {
  return (
    <div className="w-80 shrink-0 border-r border-auth-card bg-dash-sidebar flex flex-col h-full">
      <div className="p-4 border-b border-auth-card bg-[#f2f4f6]">
        <div className="relative">
          <Search size={13.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-dash-muted" />
          <input
            type="text"
            placeholder="Cari konselor..."
            className="w-full bg-white border border-auth-card rounded-lg pl-9 pr-3 py-2.5 text-[13px] text-dash-muted placeholder:text-dash-muted focus:outline-none"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {conversations.map((conv) => {
          const isActive = conv.id === activeId;
          return (
            <button
              key={conv.id}
              type="button"
              onClick={() => onSelect(conv.id)}
              className={`w-full text-left flex gap-3 px-4 py-4 border-b border-auth-card transition-colors ${
                isActive ? 'bg-[#0053db] border-l-4 border-l-dash-primary pl-[13px]' : 'hover:bg-white'
              }`}
            >
              <div className="relative shrink-0">
                <span className="size-12 rounded-full bg-dash-primary/25 block" />
                <span
                  className={`absolute bottom-0 right-0 size-3 rounded-full border-2 border-dash-sidebar ${
                    conv.online ? 'bg-dash-success' : 'bg-[#737686]'
                  }`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className={`text-sm font-semibold truncate ${isActive ? 'text-white' : 'text-dash-text'}`}>{conv.name}</p>
                  <span className={`text-[11px] shrink-0 ${isActive ? 'text-white/80' : 'text-[#737686]'}`}>{conv.lastTime}</span>
                </div>
                <p className={`text-[13px] truncate ${isActive ? 'text-white/90' : 'text-dash-muted'}`}>{conv.lastMessage}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
