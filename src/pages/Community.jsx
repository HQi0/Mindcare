import { useEffect, useState } from 'react';
import useFetch from '../hooks/useFetch.js';
import { supabase } from '../lib/supabaseClient.js';
import { 
  getCategories, 
  getPosts, 
  getTrendingTopics, 
  getCommunityRules, 
  createPost,
  generateAlias,
  updateUserAlias
} from '../services/communityService.js';
import {
  CategoryChips,
  PostComposer,
  PostCard,
  CommunityRulesCard,
  TrendingTopicsCard,
} from '../components/community/CommunitySections.jsx';

export default function Community() {
  const { data: categories } = useFetch(getCategories, []);
  const { data: initialPosts, loading: postsLoading, refetch: refetchPosts } = useFetch(getPosts, []);
  const { data: trending, refetch: refetchTrending } = useFetch(getTrendingTopics, []);
  const { data: rules } = useFetch(getCommunityRules, []);

  const [activeCategory, setActiveCategory] = useState('Semua');
  const [posts, setPosts] = useState([]);
  const [draft, setDraft] = useState('');
  const [userAlias, setUserAlias] = useState('Tamu Anonim');
  
  // Track selected trending post ID to isolate it in the feed
  const [selectedPostId, setSelectedPostId] = useState(null);

  // Load custom alias from localStorage (scoped by user ID) or default to hash alias
  useEffect(() => {
    async function initAlias() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const defaultAlias = generateAlias(user.id);
        const storedAlias = localStorage.getItem(`mindcare_community_alias_${user.id}`);
        setUserAlias(storedAlias || defaultAlias);
      }
    }
    initAlias();
  }, []);

  // Save alias to localStorage, update DB for past items, and update state
  const handleAliasChange = async (newAlias) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      localStorage.setItem(`mindcare_community_alias_${user.id}`, newAlias);
      setUserAlias(newAlias);
      
      // Update database rows retroactively and refetch posts to sync UI names
      try {
        await updateUserAlias(newAlias);
        refetchPosts();
      } catch (err) {
        console.error("Failed to retroactively update user alias:", err);
      }
    }
  };

  useEffect(() => {
    if (initialPosts) setPosts(initialPosts);
  }, [initialPosts]);

  // If a trending post is selected, isolate it in the view. Otherwise, filter by selected category chip.
  const filteredPosts = selectedPostId 
    ? posts.filter((p) => p.id === selectedPostId)
    : (activeCategory === 'Semua' ? posts : posts.filter((p) => p.category === activeCategory));

  const handleSubmit = async (category) => {
    if (!draft.trim()) return;
    try {
      const newPost = await createPost(draft.trim(), category, userAlias);
      setPosts((prev) => [newPost, ...prev]);
      setDraft('');
      refetchTrending(); // refresh the hot topics counts
    } catch (err) {
      console.error('Failed to create post:', err);
      alert(err.message || 'Gagal mengirim postingan.');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
      <div className="md:col-span-2 flex flex-col gap-6">
        <div>
          <h2 className="text-[22px] leading-8 font-semibold tracking-[-0.22px] text-dash-text">Komunitas Anonim</h2>
          <p className="text-[13.5px] text-dash-linkMuted">Ruang aman untuk berbagi cerita tanpa identitas.</p>
        </div>
        
        {selectedPostId ? (
          <button
            type="button"
            onClick={() => setSelectedPostId(null)}
            className="self-start text-xs font-semibold text-dash-primary hover:text-primary-light flex items-center gap-1 bg-[#f0f3ff] px-3.5 py-2 rounded-full border border-auth-card/50 transition-colors shadow-sm select-none"
          >
            ← Kembali ke Semua Postingan
          </button>
        ) : (
          <CategoryChips categories={categories} active={activeCategory} onSelect={setActiveCategory} />
        )}
        
        {!selectedPostId && (
          <PostComposer 
            value={draft} 
            onChange={setDraft} 
            onSubmit={handleSubmit} 
            userAlias={userAlias} 
            onAliasChange={handleAliasChange} 
          />
        )}
        
        <div className="flex flex-col gap-4">
          {postsLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-dash-muted gap-3">
              <span className="animate-spin size-8 border-4 border-dash-primary border-t-transparent rounded-full" />
              <p className="text-sm font-medium">Memuat postingan...</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="bg-white border border-auth-card rounded-xl p-8 text-center flex flex-col items-center gap-2 shadow-sm">
              <p className="text-sm font-semibold text-dash-text">Belum ada postingan</p>
              <p className="text-xs text-dash-muted">Mulai percakapan dengan menulis cerita pertama kamu secara anonim!</p>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <PostCard 
                key={post.id} 
                post={post} 
                currentUserAlias={userAlias} 
                autoOpenComments={post.id === selectedPostId} 
              />
            ))
          )}
        </div>
      </div>
      <div className="flex flex-col gap-6">
        <CommunityRulesCard rules={rules} />
        <TrendingTopicsCard topics={trending} onSelectPost={setSelectedPostId} />
      </div>
    </div>
  );
}
