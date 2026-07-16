import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { getConversations, getMessages, sendMessage } from '../services/chatService.js';
import ConversationsList from '../components/chat/ConversationsList.jsx';
import ChatWindow from '../components/chat/ChatWindow.jsx';

const EMERGENCY_ROOM = {
  id: 'counselor-emergency-siaga',
  name: 'Konselor Siaga 24/7 (Darurat)',
  role: 'UGD Mental Health',
  online: true,
  lastMessage: 'Halo, saya konselor siaga yang sedang bertugas. Ceritakan masalah Anda, kami siap mendengarkan...',
  lastTime: '24/7'
};

export default function CounselorChat() {
  const location = useLocation();
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSessionLocked, setIsSessionLocked] = useState(true);
  const [showChatOnMobile, setShowChatOnMobile] = useState(false);

  useEffect(() => {
    const initChat = async () => {
      setLoading(true);
      try {
        let historyConversations = await getConversations();
        
        if (!Array.isArray(historyConversations)) {
          historyConversations = [];
        }

        // Exclude dummy if fetched, and insert at the top
        historyConversations = historyConversations.filter(c => c && c.id !== 'counselor-emergency-siaga');
        historyConversations = [EMERGENCY_ROOM, ...historyConversations];

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
          setShowChatOnMobile(true);
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

    if (activeId === 'counselor-emergency-siaga') {
      setIsSessionLocked(false);

      const stored = localStorage.getItem('mindcare_chat_emergency');
      if (stored) {
        setMessages(JSON.parse(stored));
      } else {
        const initialMsg = [
          {
            id: 'welcome-emerg',
            from: 'counselor',
            time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
            text: 'Halo, saya konselor siaga yang sedang bertugas. Ceritakan apa yang sedang Anda rasakan atau hadapi saat ini. Ruang obrolan darurat ini selalu aktif 24 jam untuk mendukung Anda.',
            created_at: new Date().toISOString(),
            isSystemTriggered: false
          }
        ];
        localStorage.setItem('mindcare_chat_emergency', JSON.stringify(initialMsg));
        setMessages(initialMsg);
      }
      return;
    }

    setIsSessionLocked(true);

    getMessages(activeId)
      .then((data) => {
        setMessages(Array.isArray(data) ? data : []);

        // EVALUASI INSTAN BERDASARKAN JAM LAPTOP
        const expiryTimeStr = localStorage.getItem(`session_expiry_${activeId}`);
        
        if (expiryTimeStr) {
          const expiryTimestamp = parseInt(expiryTimeStr, 10);
          
          if (Date.now() > expiryTimestamp) {
            setIsSessionLocked(true);
            return;
          } else {
            setIsSessionLocked(false);
            return;
          }
        }

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
    if (!activeId || activeId === 'counselor-emergency-siaga') return;

    const interval = setInterval(() => {
      const expiryTimeStr = localStorage.getItem(`session_expiry_${activeId}`);
      
      if (expiryTimeStr) {
        const expiryTimestamp = parseInt(expiryTimeStr, 10);
        
        if (Date.now() > expiryTimestamp) {
          setIsSessionLocked(true);
        } else {
          setIsSessionLocked(false);
        }
      } else {
        setIsSessionLocked(true);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeId]);

  const activeConversation = Array.isArray(conversations) 
    ? conversations.find((c) => c && c.id === activeId) 
    : null;

  const handleSend = async (text) => {
    if (!activeId) return;

    const optimistic = { 
      id: `tmp-${Date.now()}`, 
      from: 'me', 
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }), 
      text,
      created_at: new Date().toISOString(),
      isSystemTriggered: false
    };

    if (activeId === 'counselor-emergency-siaga') {
      const updatedMessages = [...messages, optimistic];
      setMessages(updatedMessages);
      localStorage.setItem('mindcare_chat_emergency', JSON.stringify(updatedMessages));
      
      setConversations(prev => 
          prev.map(c => c && c.id === 'counselor-emergency-siaga' ? { ...c, lastMessage: text } : c)
      );

      // Simulate a therapist response after 1.5 seconds
      setTimeout(() => {
        const SIMULATED_RESPONSES = [
          "Tarik napas perlahan terlebih dahulu. Saya ada di sini mendengarkanmu. Bisakah ceritakan apa yang sedang terjadi?",
          "Terima kasih telah berani bercerita. Ingatlah bahwa Anda tidak sendirian di sini. Mari kita lalui ini bersama-sama.",
          "Keadaan ini pasti sangat berat bagimu, namun kamu sangat kuat karena telah bertahan sejauh ini. Apakah ada orang terdekat yang bisa kamu hubungi saat ini?",
          "Fokuslah pada pernapasanmu terlebih dahulu. Hirup udara dalam 4 detik, tahan 4 detik, lalu hembuskan perlahan. Saya akan terus menemanimu di sini.",
        ];

        const replyIndex = Math.floor(Math.random() * SIMULATED_RESPONSES.length);
        const replyText = SIMULATED_RESPONSES[replyIndex];

        const responseMsg = {
          id: `emerg-reply-${Date.now()}`,
          from: 'counselor',
          time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          text: replyText,
          created_at: new Date().toISOString(),
          isSystemTriggered: false
        };

        setMessages((prev) => {
          const newMsgs = [...prev, responseMsg];
          localStorage.setItem('mindcare_chat_emergency', JSON.stringify(newMsgs));
          return newMsgs;
        });

        setConversations(prev =>
          prev.map(c => c && c.id === 'counselor-emergency-siaga' ? { ...c, lastMessage: replyText } : c)
        );
      }, 1500);

      return;
    }

    if (isSessionLocked) return;
    
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
    <div className="flex flex-col gap-4 -m-4 md:-m-6 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-6 pt-4">
        <h2 className="text-[22px] leading-8 font-semibold tracking-[-0.22px] text-dash-text">Chat Konselor</h2>
        <span className="flex items-center gap-1.5 text-xs text-dash-linkMuted">
          <ShieldCheck size={13} /> Identitas Anda dilindungi & percakapan bersifat rahasia.
        </span>
      </div>
      <div className="flex border-t border-auth-card h-[600px] md:h-[720px] bg-white rounded-xl overflow-hidden shadow-sm">
        {!loading ? (
          <>
            <div className={`${showChatOnMobile ? 'hidden md:flex' : 'flex w-full md:w-auto md:shrink-0'}`}>
              <ConversationsList 
                conversations={conversations || []} 
                activeId={activeId} 
                onSelect={(id) => {
                  setActiveId(id);
                  setShowChatOnMobile(true);
                }} 
              />
            </div>
            <div className={`${showChatOnMobile ? 'flex flex-1' : 'hidden md:flex flex-1'}`}>
              <ChatWindow 
                conversation={activeConversation} 
                messages={messages || []} 
                onSend={handleSend} 
                isLocked={isSessionLocked}
                onBack={() => setShowChatOnMobile(false)}
                onCallClick={() => {
                  if (!isSessionLocked) window.open("https://zoom.us/j/your-meeting-room", '_blank');
                }}
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-dash-muted text-sm bg-white">Memuat percakapan...</div>
        )}
      </div>
    </div>
  );
}