import { useEffect, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import useFetch from '../hooks/useFetch.js';
import { getConversations, getMessages, sendMessage } from '../services/chatService.js';
import ConversationsList from '../components/chat/ConversationsList.jsx';
import ChatWindow from '../components/chat/ChatWindow.jsx';

export default function CounselorChat() {
  const { data: conversations } = useFetch(getConversations, []);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (conversations?.length && !activeId) setActiveId(conversations[0].id);
  }, [conversations, activeId]);

  useEffect(() => {
    if (!activeId) return;
    getMessages(activeId).then(setMessages);
  }, [activeId]);

  const activeConversation = conversations?.find((c) => c.id === activeId);

  const handleSend = async (text) => {
    const optimistic = { id: `tmp-${Date.now()}`, from: 'me', time: 'Baru saja', text };
    setMessages((prev) => [...prev, optimistic]);
    await sendMessage(activeId, text);
  };

  return (
    <div className="flex flex-col gap-4 -m-6">
      <div className="flex items-center justify-between px-6 pt-4">
        <h2 className="text-[22px] leading-8 font-semibold tracking-[-0.22px] text-dash-text">Chat Konselor</h2>
        <span className="flex items-center gap-1.5 text-xs text-dash-linkMuted">
          <ShieldCheck size={13} /> Identitas Anda dilindungi & percakapan bersifat rahasia.
        </span>
      </div>
      <div className="flex border-t border-auth-card h-[720px]">
        {conversations ? (
          <>
            <ConversationsList conversations={conversations} activeId={activeId} onSelect={setActiveId} />
            <ChatWindow conversation={activeConversation} messages={messages} onSend={handleSend} />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-dash-muted text-sm">Memuat percakapan...</div>
        )}
      </div>
    </div>
  );
}
