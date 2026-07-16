import { Search, ShieldAlert } from 'lucide-react';

export default function ConversationsList({ conversations, activeId, onSelect }) {
  return (
    <div className="w-full md:w-80 shrink-0 md:border-r border-auth-card bg-dash-sidebar flex flex-col h-full">
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
          if (!conv) return null;
          const isActive = conv.id === activeId;
          const isEmergency = conv.id === 'counselor-emergency-siaga';

          return (
            <button
              key={conv.id}
              type="button"
              onClick={() => onSelect(conv.id)}
              className={`w-full text-left flex gap-3 px-4 py-4 border-b border-auth-card transition-colors ${
                isActive 
                  ? (isEmergency ? 'bg-red-650 border-l-4 border-l-red-600 pl-[13px]' : 'bg-[#0053db] border-l-4 border-l-dash-primary pl-[13px]') 
                  : 'hover:bg-white'
              } ${isEmergency && !isActive ? 'bg-red-50/30' : ''}`}
            >
              <div className="relative shrink-0">
                <span className={`size-12 rounded-full block flex items-center justify-center ${
                  isEmergency 
                    ? (isActive ? 'bg-white text-red-600' : 'bg-red-100 text-red-600') 
                    : (isActive ? 'bg-white/20 text-white' : 'bg-dash-primary/25 text-dash-primary')
                }`}>
                  {isEmergency ? <ShieldAlert size={20} /> : <span className="font-bold text-sm">{conv.name.charAt(0)}</span>}
                </span>
                <span
                  className={`absolute bottom-0 right-0 size-3 rounded-full border-2 border-dash-sidebar ${
                    conv.online ? 'bg-dash-success' : 'bg-[#737686]'
                  }`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className={`text-sm font-semibold truncate ${isActive ? 'text-white' : 'text-dash-text'}`}>{conv.name}</p>
                  {isEmergency && !isActive && (
                    <span className="rounded bg-red-100 px-1.5 py-0.5 text-[9px] font-bold text-red-600 uppercase animate-pulse">
                      DARURAT
                    </span>
                  )}
                  {!isEmergency && (
                    <span className={`text-[11px] shrink-0 ${isActive ? 'text-white/80' : 'text-[#737686]'}`}>{conv.lastTime}</span>
                  )}
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
