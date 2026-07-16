import { supabase } from '../lib/supabaseClient';

const DUMMY_CATEGORIES = ['Semua', 'Stres Kuliah', 'Motivasi', 'Hubungan', 'Kesehatan Mental'];

const ADJECTIVES = [
  'Pahlawan', 'Bintang', 'Awan', 'Rembulan', 'Angin', 'Mentari', 'Embun', 'Samudra', 
  'Lentera', 'Kucing', 'Panda', 'Koala', 'Kelinci', 'Kancil', 'Merpati', 'Cendrawasih',
  'Penjelajah', 'Penjaga', 'Petualang', 'Sahabat', 'Pelindung', 'Ksatria', 'Pendongeng'
];

const NOUNS = [
  'Sunyi', 'Malam', 'Tenang', 'Syahdu', 'Hangat', 'Bebas', 'Damai', 'Ceria',
  'Bijak', 'Sabar', 'Kreatif', 'Lembut', 'Tegar', 'Berani', 'Setia', 'Indah',
  'Misterius', 'Gembira', 'Tulus', 'Jujur', 'Sederhana', 'Optimis', 'Penyayang'
];

export function generateAlias(userId) {
  if (!userId) return 'Tamu Anonim';
  
  // Simple deterministic hash
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const adjIndex = Math.abs(hash) % ADJECTIVES.length;
  const nounIndex = Math.abs((hash >> 8)) % NOUNS.length;
  
  return `${ADJECTIVES[adjIndex]} ${NOUNS[nounIndex]}`;
}

export function formatRelativeTime(dateString) {
  if (!dateString) return 'Baru saja';
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now - date;
  
  if (diffMs < 0) return 'Baru saja';
  
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Baru saja';
  if (diffMins < 60) return `${diffMins} menit lalu`;
  if (diffHours < 24) return `${diffHours} jam lalu`;
  if (diffDays < 7) return `${diffDays} hari lalu`;
  
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

export async function getCategories() {
  return DUMMY_CATEGORIES;
}

export async function getPosts() {
  const { data: { user } } = await supabase.auth.getUser();
  const currentUserId = user?.id || null;

  let postsData = [];
  
  try {
    const { data, error } = await supabase
      .from('community_posts')
      .select(`
        id,
        topic,
        content,
        created_at,
        user_id,
        alias,
        community_replies (id)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    postsData = data || [];
  } catch (err) {
    if (err.message?.includes('alias') || err.message?.includes('column "alias" does not exist') || err.message?.includes('schema cache')) {
      console.warn("alias column does not exist in community_posts, falling back...");
      const { data, error } = await supabase
        .from('community_posts')
        .select(`
          id,
          topic,
          content,
          created_at,
          user_id,
          community_replies (id)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      postsData = (data || []).map(p => ({
        ...p,
        alias: null
      }));
    } else {
      throw err;
    }
  }

  return postsData.map((post) => {
    const commentsCount = post.community_replies ? post.community_replies.length : 0;
    
    return {
      id: post.id,
      alias: post.alias || generateAlias(post.user_id),
      category: post.topic || 'Umum',
      time: formatRelativeTime(post.created_at),
      text: post.content,
      comments: commentsCount,
      userId: post.user_id
    };
  });
}

export async function createPost(content, topic = 'Umum', alias = null) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Anda harus masuk log untuk mengirim postingan.');

  const insertData = {
    user_id: user.id,
    topic: topic,
    content: content
  };

  if (alias && alias.trim()) {
    insertData.alias = alias.trim();
  }

  const res = await supabase
    .from('community_posts')
    .insert(insertData)
    .select()
    .single();

  if (res.error) {
    if (
      res.error.message?.includes('alias') || 
      res.error.message?.includes('column "alias" does not exist') ||
      res.error.message?.includes('schema cache')
    ) {
      delete insertData.alias;
      const fallbackRes = await supabase
        .from('community_posts')
        .insert(insertData)
        .select()
        .single();
        
      if (fallbackRes.error) throw fallbackRes.error;
      
      return {
        id: fallbackRes.data.id,
        alias: generateAlias(fallbackRes.data.user_id),
        category: fallbackRes.data.topic || 'Umum',
        time: 'Baru saja',
        text: fallbackRes.data.content,
        comments: 0,
        userId: fallbackRes.data.user_id
      };
    } else {
      throw res.error;
    }
  }

  return {
    id: res.data.id,
    alias: res.data.alias || alias || generateAlias(res.data.user_id),
    category: res.data.topic || 'Umum',
    time: 'Baru saja',
    text: res.data.content,
    comments: 0,
    userId: res.data.user_id
  };
}

export async function getReplies(postId) {
  let repliesData = [];
  
  try {
    const { data, error } = await supabase
      .from('community_replies')
      .select('id, content, created_at, user_id, alias')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    repliesData = data || [];
  } catch (err) {
    if (err.message?.includes('alias') || err.message?.includes('column "alias" does not exist') || err.message?.includes('schema cache')) {
      console.warn("alias column does not exist in community_replies, falling back...");
      const { data, error } = await supabase
        .from('community_replies')
        .select('id, content, created_at, user_id')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      repliesData = (data || []).map(r => ({
        ...r,
        alias: null
      }));
    } else {
      throw err;
    }
  }

  return repliesData.map(reply => ({
    id: reply.id,
    alias: reply.alias || generateAlias(reply.user_id),
    time: formatRelativeTime(reply.created_at),
    text: reply.content,
    userId: reply.user_id
  }));
}

export async function createReply(postId, content, alias = null) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Anda harus masuk log untuk membalas.');

  const insertData = {
    post_id: postId,
    user_id: user.id,
    content: content
  };

  if (alias && alias.trim()) {
    insertData.alias = alias.trim();
  }

  const res = await supabase
    .from('community_replies')
    .insert(insertData)
    .select()
    .single();

  if (res.error) {
    if (
      res.error.message?.includes('alias') || 
      res.error.message?.includes('column "alias" does not exist') ||
      res.error.message?.includes('schema cache')
    ) {
      delete insertData.alias;
      const fallbackRes = await supabase
        .from('community_replies')
        .insert(insertData)
        .select()
        .single();
        
      if (fallbackRes.error) throw fallbackRes.error;
      
      return {
        id: fallbackRes.data.id,
        alias: generateAlias(fallbackRes.data.user_id),
        time: 'Baru saja',
        text: fallbackRes.data.content,
        userId: fallbackRes.data.user_id
      };
    } else {
      throw res.error;
    }
  }

  return {
    id: res.data.id,
    alias: res.data.alias || alias || generateAlias(res.data.user_id),
    time: 'Baru saja',
    text: res.data.content,
    userId: res.data.user_id
  };
}

export async function updateUserAlias(newAlias) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !newAlias || !newAlias.trim()) return;

  const cleanAlias = newAlias.trim();

  // 1. Update user's past posts alias
  const { error: postError } = await supabase
    .from('community_posts')
    .update({ alias: cleanAlias })
    .eq('user_id', user.id);
    
  if (postError) {
    console.error("Failed to update past posts alias:", postError.message);
    throw new Error(postError.message);
  }

  // 2. Update user's past replies alias
  const { error: replyError } = await supabase
    .from('community_replies')
    .update({ alias: cleanAlias })
    .eq('user_id', user.id);
    
  if (replyError) {
    console.error("Failed to update past replies alias:", replyError.message);
    throw new Error(replyError.message);
  }
}

export async function getTrendingTopics() {
  try {
    const posts = await getPosts();
    const topicsList = ['Stres Kuliah', 'Motivasi', 'Hubungan', 'Kesehatan Mental'];
    const trending = [];

    topicsList.forEach(category => {
      // Find posts belonging to this category
      const categoryPosts = posts.filter(post => post.category === category);
      if (categoryPosts.length === 0) return;

      // Find the post with the highest comment (reply) count
      const mostActivePost = categoryPosts.reduce((max, post) => 
        post.comments > max.comments ? post : max
      , categoryPosts[0]);

      trending.push({
        id: mostActivePost.id, // ID of the most active post in this category
        categoryName: category,
        tag: `#${category.replace(/\s+/g, '')}`,
        context: `Terpopuler di ${category}`,
        posts: `${mostActivePost.comments} komentar`,
        author: mostActivePost.alias,
        snippet: mostActivePost.text.length > 50 ? `${mostActivePost.text.slice(0, 50)}...` : mostActivePost.text
      });
    });

    // Sort the categories based on the comment count of their representative post
    trending.sort((a, b) => {
      const countA = parseInt(a.posts) || 0;
      const countB = parseInt(b.posts) || 0;
      return countB - countA;
    });

    return trending;
  } catch (err) {
    console.error('Error fetching trending topics:', err);
    return [];
  }
}

export async function getCommunityRules() {
  return [
    'Jaga identitas anonim sesama anggota — jangan doxxing.',
    'Saling menghormati, tidak ada ujaran kebencian atau bullying.',
    'Ini bukan pengganti bantuan profesional untuk krisis mendesak.',
  ];
}

export async function deletePost(postId) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Anda harus masuk log untuk menghapus postingan.');

  // Delete replies for this post first to prevent foreign key constraint issues
  await supabase
    .from('community_replies')
    .delete()
    .eq('post_id', postId);

  // Delete the post
  const { error } = await supabase
    .from('community_posts')
    .delete()
    .eq('id', postId)
    .eq('user_id', user.id);

  if (error) {
    console.error("Gagal menghapus postingan:", error.message);
    throw new Error(error.message);
  }
}
