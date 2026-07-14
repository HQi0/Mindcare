import { useState } from 'react';
import { Phone, Video, MoreVertical, Paperclip, Smile, Mic, Send, Lock } from 'lucide-react';

export default function ChatWindow({ conversation, messages, onSend }) {
  const [draft, setDraft] = useState('');

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center text-dash-muted text-sm">
        Pilih percakapan untuk mulai chat.
      </div>
    );
  }

  const handleSend = () => {
    if (!draft.trim()) return;
    onSend(draft.trim());
    setDraft('');
  };

  return (
    <div className="flex-1 flex flex-col bg-white min-w-0">
      <div className="flex items-center justify-between px-6 py-3 border-b border-auth-card">
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="size-10 rounded-full bg-dash-primary/25 block" />
            <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-dash-success border-2 border-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-dash-text">{conversation.name}</p>
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="text-dash-success font-medium">Online</span>
              <span className="size-1 rounded-full bg-auth-card" />
              <span className="text-[#737686]">{conversation.role}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button type="button" className="p-2 rounded-lg hover:bg-[#f2f4f6]"><Phone size={18} className="text-dash-muted" /></button>
          <button type="button" className="p-2 rounded-lg hover:bg-[#f2f4f6]"><Video size={18} className="text-dash-muted" /></button>
          <button type="button" className="p-2 rounded-lg hover:bg-[#f2f4f6]"><MoreVertical size={18} className="text-dash-muted" /></button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-4">
        <div className="flex justify-center">
          <span className="rounded-full bg-[#f2f4f6] px-3 py-1 text-[11px] font-semibold text-[#737686] uppercase tracking-wide">
            Hari Ini
          </span>
        </div>
        {messages.map((msg) =>
          msg.from === 'me' ? (
            <div key={msg.id} className="self-end flex flex-col items-end gap-1 max-w-[70%]">
              <div className="bg-dash-primary text-white rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl px-4 py-3 text-[13.5px] shadow">
                {msg.text}
              </div>
              <span className="text-[11px] text-[#737686] pr-1">{msg.time}</span>
            </div>
          ) : (
            <div key={msg.id} className="self-start flex gap-3 max-w-[70%]">
              <span className="size-8 rounded-full bg-dash-primary/20 shrink-0" />
              <div className="flex flex-col gap-1">
                <div className="bg-[#f2f4f6] border border-auth-card rounded-tr-2xl rounded-br-2xl rounded-tl-2xl px-4 py-3 text-[13.5px] text-dash-text shadow-sm">
                  {msg.text}
                </div>
                <span className="text-[11px] text-[#737686] pl-1">{msg.time}</span>
              </div>
            </div>
          )
        )}
      </div>

      <div className="border-t border-auth-card px-6 pt-4 pb-6 flex flex-col gap-3">
        <div className="bg-dash-sidebar border border-auth-card rounded-xl p-2 shadow-sm">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Tulis pesan..."
            rows={1}
            className="w-full resize-none bg-transparent px-3 py-2 text-[13.5px] text-dash-text placeholder:text-[#6b7280] focus:outline-none"
          />
          <div className="border-t border-[#eceef0] flex items-center justify-between pt-2 px-1">
            <div className="flex items-center gap-1">
              <button type="button" className="p-2 rounded-lg hover:bg-white"><Paperclip size={16} className="text-dash-muted" /></button>
              <button type="button" className="p-2 rounded-lg hover:bg-white"><Smile size={16} className="text-dash-muted" /></button>
              <button type="button" className="p-2 rounded-lg hover:bg-white"><Mic size={15} className="text-dash-muted" /></button>
            </div>
            <button
              type="button"
              onClick={handleSend}
              className="flex items-center gap-2 rounded-lg bg-dash-primary px-5 py-2 text-white text-sm font-semibold shadow"
            >
              Kirim <Send size={12} />
            </button>
          </div>
        </div>
        <p className="flex items-center justify-center gap-1 text-[11px] text-[#737686]">
          <Lock size={10} /> Pesan dienkripsi secara end-to-end. Privasi Anda prioritas kami.
        </p>
      </div>
    </div>
  );
}
