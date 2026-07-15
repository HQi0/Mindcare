import { supabase } from '../lib/supabaseClient';

export async function getCategories() {
  const { data, error } = await supabase
    .from('articles')
    .select('category');

  if (error || !data) return [{ id: 'semua', label: 'Semua' }];

  // Extract unique categories
  const uniqueCategories = [...new Set(data.map(item => item.category?.toUpperCase() || 'UMUM'))];
  
  const categories = [
    { id: 'semua', label: 'Semua' },
    ...uniqueCategories.map(cat => ({ id: cat.toLowerCase(), label: cat }))
  ];

  return categories;
}

export async function getHero() {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    return {
      badge: 'TOPIK UTAMA',
      title: 'Selamat Datang di Pustaka MindCare',
      description: 'Jelajahi berbagai artikel dan sumber daya untuk membantu menjaga kesehatan mental Anda.',
      cta: 'Mulai Membaca',
    };
  }

  return {
    id: data.id,
    badge: 'ARTIKEL TERBARU',
    title: data.title,
    description: data.content.substring(0, 120) + '...',
    cta: 'Baca Sekarang',
    cover_image_url: data.cover_image_url
  };
}

export async function getArticles(activeCategory) {
  let query = supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false });

  if (activeCategory && activeCategory !== 'semua') {
    // In database they are stored in uppercase (EDUKASI) or title case, so we do ilike or we can just fetch all and filter in JS if it's small, 
    // but better to use ilike for case insensitivity.
    query = query.ilike('category', activeCategory);
  }

  const { data, error } = await query;
  
  if (error) return [];
  
  return data.map(article => ({
    id: article.id,
    type: (article.category || 'UMUM').toUpperCase(),
    title: article.title,
    description: article.content.substring(0, 100) + '...',
    cover_image_url: article.cover_image_url,
    created_at: new Date(article.created_at).toLocaleDateString('id-ID', {
      year: 'numeric', month: 'long', day: 'numeric'
    })
  }));
}

export async function getArticleDetail(articleId) {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('id', articleId)
    .single();

  if (error || !data) throw new Error("Artikel tidak ditemukan");

  // Format to match the structure expected by the UI
  return {
    id: data.id,
    badges: [data.category?.toUpperCase() || 'UMUM'],
    title: data.title,
    author: { name: 'MindCare Team', role: 'REDAKSI', bio: 'Tim penyusun konten kesehatan mental MindCare.' },
    readTime: '5 menit baca',
    date: new Date(data.created_at).toLocaleDateString('id-ID', {
      year: 'numeric', month: 'long', day: 'numeric'
    }),
    content: data.content,
    cover_image_url: data.cover_image_url,
    related: [] 
  };
}
