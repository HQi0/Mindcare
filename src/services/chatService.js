const mockDelay = (data, ms = 300) =>
  new Promise((resolve) => setTimeout(() => resolve({ data }), ms));

const DUMMY_CONVERSATIONS = [
  {
    id: 'siti-aminah',
    name: 'Siti Aminah, M.Psi',
    role: 'Spesialis Kecemasan Akademik',
    online: true,
    lastMessage: 'Bagaimana perasaanmu hari ini?',
    lastTime: '10:42',
  },
  {
    id: 'budi-santoso',
    name: 'Dr. Budi Santoso',
    role: 'Psikolog Klinis',
    online: false,
    lastMessage: 'Terima kasih atas sesinya kemarin.',
    lastTime: 'Kemarin',
  },
  {
    id: 'larasati-putri',
    name: 'Larasati Putri, M.Psi',
    role: 'Konselor Akademik',
    online: true,
    lastMessage: 'Saya sudah membaca jurnalmu.',
    lastTime: 'Senin',
    read: true,
  },
];

const DUMMY_MESSAGES = {
  'siti-aminah': [
    { id: 'm1', from: 'counselor', time: '10:40', text: 'Halo! Saya sudah membaca catatan mood kamu pagi ini. Sepertinya kamu merasa cukup kewalahan dengan tugas akhir ya?' },
    { id: 'm2', from: 'me', time: '10:42', text: 'Iya benar Bu. Saya merasa buntu dan mulai meragukan kemampuan saya sendiri. Rasanya ingin menyerah saja.' },
    { id: 'm3', from: 'counselor', time: '10:42', text: 'Wajar sekali merasa seperti itu saat berada di bawah tekanan besar. Ingat, perasaan ini bersifat sementara.' },
    { id: 'm4', from: 'counselor', time: '10:43', text: 'Mari kita coba teknik "Grounding" sebentar. Bisakah kamu sebutkan 3 hal yang bisa kamu sentuh saat ini?' },
  ],
};

export async function getConversations() {
  const res = await mockDelay(DUMMY_CONVERSATIONS);
  return res.data;
}

export async function getMessages(conversationId) {
  // const res = await api.get(`/chat/${conversationId}/messages`);
  const res = await mockDelay(DUMMY_MESSAGES[conversationId] || []);
  return res.data;
}

export async function sendMessage(_conversationId, text) {
  // const res = await api.post(`/chat/${conversationId}/messages`, { text });
  const res = await mockDelay({
    id: `m${Date.now()}`,
    from: 'me',
    time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    text,
  });
  return res.data;
}
