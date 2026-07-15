import { supabase } from '../lib/supabaseClient';

/**
 * Mendapatkan daftar unik para konselor yang pernah melakukan chat dengan user saat ini
 */
export async function getConversations() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  // Ambil semua pesan milik user saat ini
  const { data, error } = await supabase
    .from('chat_messages')
    .select('counselor_id, message, created_at, counselor:counselors(id, full_name, specialization, avatar_url)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);

  // Grouping pesan terakhir berdasarkan konselor (Unik)
  const uniqueCounselors = {};
  (data || []).forEach((msg) => {
    if (!msg.counselor_id || uniqueCounselors[msg.counselor_id]) return;
    
    const scheduledTime = new Date(msg.created_at);
    uniqueCounselors[msg.counselor_id] = {
      id: msg.counselor.id,
      name: msg.counselor.full_name,
      role: msg.counselor.specialization || 'Konselor Psikologi',
      online: true, // Statis atau bisa dikembangkan kemudian
      lastMessage: msg.message,
      lastTime: scheduledTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };
  });

  return Object.values(uniqueCounselors);
}

/**
 * Mengambil history obrolan spesifik dengan satu konselor
 */
export async function getMessages(counselorId) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('chat_messages')
    .select('id, sender, message, created_at')
    .eq('user_id', user.id)
    .eq('counselor_id', counselorId)
    .order('created_at', { ascending: true });

  if (error) throw new Error(error.message);

  return (data || []).map((msg) => ({
    id: msg.id,
    from: msg.sender === 'user' ? 'me' : 'counselor',
    time: new Date(msg.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    text: msg.message,
  }));
}

/**
 * Mengirim pesan baru ke database Supabase
 */
export async function sendMessage(counselorId, text) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Akses ditolak. Silakan login terlebih dahulu.');

  const { data, error } = await supabase
    .from('chat_messages')
    .insert({
      user_id: user.id,
      counselor_id: counselorId,
      sender: 'user',
      message: text
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}