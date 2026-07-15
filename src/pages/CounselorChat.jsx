import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { getConversations, getMessages, sendMessage } from '../services/chatService.js';
import ConversationsList from '../components/chat/ConversationsList.jsx';
import ChatWindow from '../components/chat/ChatWindow.jsx';

export default function CounselorChat() {
  const location = useLocation();
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSessionLocked, setIsSessionLocked] = useState(true);

  useEffect(() => {
    const initChat = async () => {
      setLoading(true);
      try {
        let historyConversations = await getConversations();
        
        if (!Array.isArray(historyConversations)) {
          historyConversations = [];
        }

        const targetCounselorId = localStorage.getItem('active_counselor_redirect');

        if (targetCounselorId) {
          localStorage.removeItem('active_counselor_redirect');
          const isExist = historyConversations.some(c => c && c.id === targetCounselorId);

          if (!isExist) {
            const { data: counselorData } = await supabase
              .from('counselors')
              .select('id, full_name, specialization')
              .eq('id', targetCounselorId)
              .maybeSingle();

            if (counselorData) {
              const newChatRoom = {
                id: counselorData.id,
                name: counselorData.full_name,
                role: counselorData.specialization || 'Konselor Akademik',
                online: true,
                lastMessage: 'Sesi konseling baru dimulai...',
                lastTime: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
              };
              historyConversations = [newChatRoom, ...historyConversations];
            }
          }
          
          setConversations(historyConversations);
          setActiveId(targetCounselorId);
        } else {
          setConversations(historyConversations);
          if (historyConversations.length > 0 && historyConversations[0]) {
            setActiveId(historyConversations[0].id);
          }
        }
      } catch (err) {
        console.error("Gagal menginisialisasi chat room:", err.message);
      } finally {
        setLoading(false);
      }
    };

    initChat();
  }, [location.key]);

  // Mengambil data pesan & validasi jam laptop secara instan
  useEffect(() => {
    if (!activeId) return;

    setIsSessionLocked(true);

    getMessages(activeId)
      .then((data) => {
        setMessages(Array.isArray(data) ? data : []);

        // ============================================================
        // EVALUASI INSTAN BERDASARKAN JAM LAPTOP
        // ============================================================
        const expiryTimeStr = localStorage.getItem(`session_expiry_${activeId}`);
        
        if (expiryTimeStr) {
          const expiryTimestamp = parseInt(expiryTimeStr, 10);
          
          // Jika jam laptop sekarang sudah melewati batas jadwal seharusnya
          if (Date.now() > expiryTimestamp) {
            setIsSessionLocked(true);
            return;
          } else {
            setIsSessionLocked(false);
            return;
          }
        }

        // Jika tidak ada data booking aktif di localStorage (sesi lama), otomatis kunci
        setIsSessionLocked(true);
      })
      .catch((err) => {
        console.error("Gagal memuat pesan:", err.message);
        setMessages([]);
        setIsSessionLocked(true);
      });

    const chatChannel = supabase
      .channel(`room-${activeId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `counselor_id=eq.${activeId}` },
        (payload) => {
          if (payload.new && payload.new.counselor_id === activeId) {
            const isTrigger = payload.new.message?.toLowerCase().includes('memasuki ruang konsultasi online');
            
            setMessages((prev) => {
              if (prev.some(m => m.id === payload.new.id)) return prev;
              return [
                ...prev,
                {
                  id: payload.new.id,
                  from: payload.new.sender === 'user' ? 'me' : 'counselor',
                  time: new Date(payload.new.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
                  text: payload.new.message,
                  created_at: payload.new.created_at,
                  isSystemTriggered: isTrigger
                },
              ];
            });

            if (isTrigger) {
              setIsSessionLocked(false);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(chatChannel);
    };
  }, [activeId]);

  // Pengecekan latar belakang berkala (Tiap 1 detik) mencocokkan Jam Laptop
  useEffect(() => {
    if (!activeId) return;

    const interval = setInterval(() => {
      const expiryTimeStr = localStorage.getItem(`session_expiry_${activeId}`);
      
      if (expiryTimeStr) {
        const expiryTimestamp = parseInt(expiryTimeStr, 10);
        
        // Cek secara real-time detik demi detik dengan jam internal laptop
        if (Date.now() > expiryTimestamp) {
          setIsSessionLocked(true);
        } else {
          setIsSessionLocked(false);
        }
      } else {
        setIsSessionLocked(true);
      }
    }, 1000); // 1 detik agar super sensitif mengikuti pergeseran jarum jam laptop

    return () => clearInterval(interval);
  }, [activeId]);

  const activeConversation = Array.isArray(conversations) 
    ? conversations.find((c) => c && c.id === activeId) 
    : null;

  const handleSend = async (text) => {
    if (!activeId || isSessionLocked) return;

    const optimistic = { 
      id: `tmp-${Date.now()}`, 
      from: 'me', 
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }), 
      text,
      created_at: new Date().toISOString(),
      isSystemTriggered: false
    };
    setMessages((prev) => [...prev, optimistic]);
    
    try {
      await sendMessage(activeId, text);
      setConversations(prev => 
        Array.isArray(prev) 
          ? prev.map(c => c && c.id === activeId ? { ...c, lastMessage: text } : c) 
          : []
      );
    } catch (err) {
      console.error('Gagal mengirim pesan:', err.message);
    }
  };

  return (
    <div className="flex flex-col gap-4 -m-6 relative">
      <div className="flex items-center justify-between px-6 pt-4">
        <h2 className="text-[22px] leading-8 font-semibold tracking-[-0.22px] text-dash-text">Chat Konselor</h2>
        <span className="flex items-center gap-1.5 text-xs text-dash-linkMuted">
          <ShieldCheck size={13} /> Identitas Anda dilindungi & percakapan bersifat rahasia.
        </span>
      </div>
      <div className="flex border-t border-auth-card h-[720px]">
        {!loading ? (
          <>
            <ConversationsList conversations={conversations || []} activeId={activeId} onSelect={setActiveId} />
            <ChatWindow 
              conversation={activeConversation} 
              messages={messages || []} 
              onSend={handleSend} 
              isLocked={isSessionLocked}
              onCallClick={() => {
                if (!isSessionLocked) window.open("https://zoom.us/j/your-meeting-room", '_blank');
              }}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-dash-muted text-sm bg-white">Memuat percakapan...</div>
        )}
      </div>
    </div>
  );
}