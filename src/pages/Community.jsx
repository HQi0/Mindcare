import { useEffect, useState } from 'react';
import useFetch from '../hooks/useFetch.js';
import { getCategories, getPosts, getTrendingTopics, getCommunityRules, createPost } from '../services/communityService.js';
import {
  CategoryChips,
  PostComposer,
  PostCard,
  CommunityRulesCard,
  TrendingTopicsCard,
} from '../components/community/CommunitySections.jsx';

export default function Community() {
  const { data: categories } = useFetch(getCategories, []);
  const { data: initialPosts } = useFetch(getPosts, []);
  const { data: trending } = useFetch(getTrendingTopics, []);
  const { data: rules } = useFetch(getCommunityRules, []);

  const [activeCategory, setActiveCategory] = useState('Semua');
  const [posts, setPosts] = useState([]);
  const [draft, setDraft] = useState('');

  useEffect(() => {
    if (initialPosts) setPosts(initialPosts);
  }, [initialPosts]);

  const filteredPosts =
    activeCategory === 'Semua' ? posts : posts.filter((p) => p.category === activeCategory);

  const handleSubmit = async () => {
    if (!draft.trim()) return;
    const newPost = await createPost(draft.trim());
    setPosts((prev) => [newPost, ...prev]);
    setDraft('');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
      <div className="md:col-span-2 flex flex-col gap-6">
        <div>
          <h2 className="text-[22px] leading-8 font-semibold tracking-[-0.22px] text-dash-text">Komunitas Anonim</h2>
          <p className="text-[13.5px] text-dash-linkMuted">Ruang aman untuk berbagi cerita tanpa identitas.</p>
        </div>
        <CategoryChips categories={categories} active={activeCategory} onSelect={setActiveCategory} />
        <PostComposer value={draft} onChange={setDraft} onSubmit={handleSubmit} />
        <div className="flex flex-col gap-4">
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-6">
        <CommunityRulesCard rules={rules} />
        <TrendingTopicsCard topics={trending} />
      </div>
    </div>
  );
}
