import { useState, useEffect, useRef } from 'react';
import { 
  Phone, 
  Video, 
  MoreVertical, 
  Paperclip, 
  Smile, 
  Send, 
  Lock, 
  Download, 
  AlertCircle, 
  CalendarDays,
  X,
  FileText
} from 'lucide-react';

function getInitials(name) {
  if (!name) return 'KC';
  return name.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
}

export default function ChatWindow({ conversation, messages = [], onSend, onCallClick, isLocked = false }) {
  const [draft, setDraft] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [attachedFile, setAttachedFile] = useState(null);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const quickEmojis = ['😀', '😊', '😇', '👍', '🙏', '❤️', '😂', '😭', '🙌', '✨', '🔥', '💡'];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center text-dash-muted text-sm bg-white">
        Pilih percakapan untuk mulai chat.
      </div>
    );
  }

  const handleSend = () => {
    if (isLocked) return;

    // Jika ada lampiran file
    if (attachedFile) {
      const textToSend = `📁 Mengirim berkas: ${attachedFile.name}${draft.trim() ? ` \n\nKeterangan: ${draft.trim()}` : ''}`;
      onSend(textToSend);
      setAttachedFile(null);
      setDraft('');
      return;
    }

    if (!draft.trim()) return;
    onSend(draft.trim());
    setDraft('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAttachedFile(file);
    }
  };

  const handleSelectEmoji = (emoji) => {
    setDraft((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleDownloadTranscript = () => {
    if (messages.length === 0) {
      alert('Belum ada pesan obrolan untuk diunduh.');
      setShowDropdown(false);
      return;
    }

    let textContent = `=== TRANSKRIP SESI KONSELING MINDCARE ===\n`;
    textContent += `Konselor: ${conversation.name}\n`;
    textContent += `Spesialisasi: ${conversation.role}\n`;
    textContent += `Tanggal Unduh: ${new Date().toLocaleDateString('id-ID')}\n`;
    textContent += `=========================================\n\n`;

    messages.forEach((msg) => {
      if (msg.text?.includes('memasuki ruang konsultasi online')) {
        textContent += `\n--- PEMBATAS: SESI BARU DIMULAI ---\n\n`;
      } else {
        const senderName = msg.from === 'me' ? 'Anda' : conversation.name;
        textContent += `[${msg.time || '-'}] ${senderName}: ${msg.text}\n`;
      }
    });

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const element = document.createElement('a');
    element.href = URL.createObjectURL(blob);
    element.download = `Transkrip_Chat_${conversation.name.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    setShowDropdown(false);
  };

  return (
    <div className="flex-1 flex flex-col bg-white min-w-0">
      {/* Header Chat */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-auth-card">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="size-10 rounded-full bg-dash-primary/10 border border-auth-card flex items-center justify-center text-xs font-bold text-dash-primary shrink-0">
              {conversation.avatarUrl ? (
                <img src={conversation.avatarUrl} alt={conversation.name} className="size-full rounded-full object-cover" />
              ) : (
                getInitials(conversation.name)
              )}
            </div>
            <span className={`absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-white ${isLocked ? 'bg-gray-400' : 'bg-dash-success'}`} />
          </div>
          <div>
            <p className="text-sm font-semibold text-dash-text">{conversation.name}</p>
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className={isLocked ? 'text-dash-muted font-medium' : 'text-dash-success font-medium'}>
                {isLocked ? 'Sesi Selesai' : 'Online'}
              </span>
              <span className="size-1 rounded-full bg-auth-card" />
              <span className="text-[#737686]">{conversation.role}</span>
            </div>
          </div>
        </div>
        
        {/* Bagian Tombol Call & Video Call - Dinonaktifkan Sementara Tanpa Dihapus */}
        <div className="flex items-center gap-1 relative">
          <button 
            type="button" 
            disabled={true} 
            className="p-2 rounded-lg opacity-30 cursor-not-allowed" 
            title="Fitur panggilan suara dinonaktifkan sementara"
          >
            <Phone size={18} className="text-dash-muted" />
          </button>
          
          <button 
            type="button" 
            disabled={true} 
            className="p-2 rounded-lg opacity-30 cursor-not-allowed" 
            title="Fitur panggilan video dinonaktifkan sementara"
          >
            <Video size={18} className="text-dash-muted" />
          </button>
          
          <button 
            type="button" 
            onClick={() => setShowDropdown(prev => !prev)} 
            className={`p-2 rounded-lg hover:bg-[#f2f4f6] ${showDropdown ? 'bg-[#f2f4f6]' : ''}`}
          >
            <MoreVertical size={18} className="text-dash-muted" />
          </button>

          {showDropdown && (
            <div className="absolute right-0 top-10 w-44 bg-white border border-auth-card rounded-xl shadow-xl z-50 p-1.5 duration-150">
              <button
                type="button"
                onClick={handleDownloadTranscript}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-dash-text hover:bg-slate-50 rounded-lg text-left transition-colors"
              >
                <Download size={14} className="text-dash-primary" /> Unduh Transkrip (.txt)
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Banner Notifikasi Peringatan Jika Sesi Berakhir */}
      {isLocked && (
        <div className="bg-amber-50 border-b border-amber-100 px-6 py-2.5 flex items-center gap-2 text-xs font-medium text-amber-700">
          <AlertCircle size={14} className="shrink-0 text-amber-500" />
          <span>Sesi konsultasi online telah selesai. Input chat dikunci secara permanen.</span>
        </div>
      )}

      {/* Area Isi Pesan */}
      <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-4">
        {messages.map((msg, index) => {
          const isSystemMessage = msg.text?.includes('memasuki ruang konsultasi online');

          if (isSystemMessage) {
            return (
              <div key={msg.id || index} className="my-4 flex items-center gap-4 w-full">
                <div className="h-[1px] bg-slate-200 flex-1" />
                <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-100 text-blue-700 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase">
                  <CalendarDays size={12} /> Sesi Konseling Baru Dimulai
                </div>
                <div className="h-[1px] bg-slate-200 flex-1" />
              </div>
            );
          }

          return msg.from === 'me' ? (
            <div key={msg.id || index} className="self-end flex flex-col items-end gap-1 max-w-[70%]">
              <div className="bg-dash-primary text-white rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl px-4 py-3 text-[13.5px] shadow whitespace-pre-wrap">
                {msg.text}
              </div>
              <span className="text-[11px] text-[#737686] pr-1">{msg.time}</span>
            </div>
          ) : (
            <div key={msg.id || index} className="self-start flex gap-3 max-w-[70%]">
              <div className="size-8 rounded-full bg-dash-primary/10 flex items-center justify-center text-[10px] font-bold text-dash-primary shrink-0 border border-auth-card">
                {conversation.avatarUrl ? (
                  <img src={conversation.avatarUrl} alt={conversation.name} className="size-full rounded-full object-cover" />
                ) : (
                  getInitials(conversation.name)
                )}
              </div>
              <div className="flex flex-col gap-1">
                <div className="bg-[#f2f4f6] border border-auth-card rounded-tr-2xl rounded-br-2xl rounded-tl-2xl px-4 py-3 text-[13.5px] text-dash-text shadow-sm whitespace-pre-wrap">
                  {msg.text}
                </div>
                <span className="text-[11px] text-[#737686] pl-1">{msg.time}</span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Form Input Pesan */}
      <div className="border-t border-auth-card px-6 pt-4 pb-6 flex flex-col gap-3">
        
        {/* Preview Pratonton Lampiran File */}
        {attachedFile && (
          <div className="flex items-center justify-between bg-slate-100 border border-auth-card rounded-xl p-2.5 text-xs text-dash-text max-w-sm self-start">
            <div className="flex items-center gap-2">
              <FileText size={16} className="text-dash-primary animate-pulse" />
              <span className="font-semibold truncate max-w-[150px]">{attachedFile.name}</span>
              <span className="text-[10px] text-dash-muted">({(attachedFile.size / 1024).toFixed(1)} KB)</span>
            </div>
            <button 
              type="button" 
              onClick={() => setAttachedFile(null)} 
              className="p-1 hover:bg-slate-200 rounded-full text-red-500 transition-colors ml-4"
            >
              <X size={14} />
            </button>
          </div>
        )}

        <div className={`border rounded-xl p-2 shadow-sm transition-all relative ${isLocked ? 'bg-slate-50 border-slate-200 opacity-60' : 'bg-dash-sidebar border-auth-card'}`}>
          <textarea
            value={draft}
            disabled={isLocked}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={isLocked ? "Sesi telah selesai..." : "Tulis pesan..."}
            rows={1}
            className="w-full resize-none bg-transparent px-3 py-2 text-[13.5px] text-dash-text placeholder:text-[#6b7280] focus:outline-none disabled:cursor-not-allowed"
          />
          
          <div className="border-t border-[#eceef0] flex items-center justify-between pt-2 px-1">
            <div className="flex items-center gap-1 relative">
              
              {/* Input File Tersembunyi */}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
              />
              <button 
                type="button" 
                disabled={isLocked} 
                onClick={() => fileInputRef.current?.click()}
                className="p-2 rounded-lg hover:bg-white disabled:opacity-30 transition-colors"
                title="Lampirkan berkas"
              >
                <Paperclip size={16} className="text-dash-muted" />
              </button>

              {/* Pemicu Emoji Picker */}
              <button 
                type="button" 
                disabled={isLocked} 
                onClick={() => setShowEmojiPicker(prev => !prev)}
                className="p-2 rounded-lg hover:bg-white disabled:opacity-30 transition-colors"
                title="Pilih emoji"
              >
                <Smile size={16} className="text-dash-muted" />
              </button>

              {/* Popup Mini Emoji Picker */}
              {showEmojiPicker && !isLocked && (
                <div className="absolute bottom-12 left-0 bg-white border border-auth-card shadow-2xl rounded-2xl p-2.5 z-50 grid grid-cols-4 gap-1.5 w-44 duration-150">
                  {quickEmojis.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => handleSelectEmoji(emoji)}
                      className="text-lg p-1 hover:bg-slate-50 rounded-lg transition-transform hover:scale-110 text-center"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              disabled={isLocked || (!draft.trim() && !attachedFile)}
              onClick={handleSend}
              className="flex items-center gap-2 rounded-lg bg-dash-primary px-5 py-2 text-white text-sm font-semibold shadow disabled:bg-slate-300 disabled:shadow-none disabled:cursor-not-allowed transition-colors"
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