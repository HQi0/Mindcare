import { useState, useEffect } from 'react';
import { MessageCircle, Flag, ShieldCheck, TrendingUp, Send, Check } from 'lucide-react';
import { getReplies, createReply } from '../../services/communityService.js';

export function CategoryChips({ categories, active, onSelect }) {
  if (!categories?.length) return null;
  return (
    <div className="flex gap-2 flex-wrap">
      {categories.map((cat) => {
        const isActive = active === cat;
        return (
          <button
            key={cat}
            type="button"
            onClick={() => onSelect(cat)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              isActive ? 'bg-dash-primary text-white' : 'bg-white border border-auth-card text-dash-muted hover:bg-surface-tint'
            }`}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}

export function PostComposer({ value, onChange, onSubmit, userAlias = 'Tamu Anonim', onAliasChange }) {
  const [category, setCategory] = useState('Stres Kuliah');
  const [isEditingAlias, setIsEditingAlias] = useState(false);
  const [tempAlias, setTempAlias] = useState(userAlias);
  const categoriesList = ['Stres Kuliah', 'Motivasi', 'Hubungan', 'Kesehatan Mental'];

  const handleSubmit = () => {
    if (!value.trim()) return;
    onSubmit(category);
  };

  const handleSaveAlias = () => {
    if (tempAlias.trim()) {
      onAliasChange(tempAlias.trim());
      setIsEditingAlias(false);
    }
  };

  return (
    <div className="bg-white border border-auth-card rounded-xl p-4 flex flex-col gap-3 shadow-sm">
      <div className="flex gap-3 items-start">
        <div className="flex flex-col items-center gap-1 shrink-0">
          <span className="size-10 rounded-full bg-dash-primary/20 flex items-center justify-center text-dash-primary font-bold text-sm select-none">
            {userAlias.charAt(0)}
          </span>
          {isEditingAlias ? (
            <div className="flex flex-col gap-1 items-center mt-1">
              <input
                type="text"
                value={tempAlias}
                onChange={(e) => setTempAlias(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveAlias()}
                className="text-[10px] text-dash-text border border-auth-card rounded px-1.5 py-0.5 text-center focus:outline-none w-16"
                placeholder="Nama..."
                maxLength={20}
              />
              <button
                type="button"
                onClick={handleSaveAlias}
                className="text-[9px] text-dash-success hover:underline flex items-center gap-0.5"
              >
                <Check size={8} /> Simpan
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center mt-0.5">
              <span className="text-[10px] text-dash-muted font-semibold max-w-[65px] truncate text-center" title={userAlias}>
                {userAlias}
              </span>
              <button
                type="button"
                onClick={() => {
                  setTempAlias(userAlias);
                  setIsEditingAlias(true);
                }}
                className="text-[9px] text-dash-primary hover:underline mt-0.5 font-medium"
              >
                (Ubah)
              </button>
            </div>
          )}
        </div>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Bagikan apa yang kamu rasakan secara anonim..."
          className="flex-1 bg-[#f2f4f6] border border-auth-card rounded-lg px-4 py-2.5 text-sm text-dash-text placeholder:text-dash-muted focus:outline-none resize-none h-20"
        />
      </div>

      <div className="flex justify-between items-center border-t border-auth-card/50 pt-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-dash-muted font-medium">Kategori:</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-white border border-auth-card rounded-lg px-3 py-1.5 text-xs text-dash-muted focus:outline-none focus:ring-1 focus:ring-dash-primary cursor-pointer font-medium"
          >
            {categoriesList.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!value.trim()}
          className="rounded-lg bg-dash-primary hover:bg-primary-light disabled:bg-dash-muted/40 text-white text-xs font-semibold px-5 py-2.5 transition-colors shrink-0"
        >
          Kirim
        </button>
      </div>
    </div>
  );
}

export function PostCard({ post, currentUserAlias, autoOpenComments = false }) {
  const [showComments, setShowComments] = useState(autoOpenComments);
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentsCount, setCommentsCount] = useState(post.comments);
  const [submittingComment, setSubmittingComment] = useState(false);

  // Auto-open comment drawer and fetch replies if prop is set
  useEffect(() => {
    if (autoOpenComments) {
      setShowComments(true);
      setCommentsLoading(true);
      getReplies(post.id)
        .then((res) => setComments(res))
        .catch((err) => console.error('Failed to load replies:', err))
        .finally(() => setCommentsLoading(false));
    }
  }, [autoOpenComments, post.id]);

  const handleToggleComments = async () => {
    const nextShow = !showComments;
    setShowComments(nextShow);
    if (nextShow) {
      setCommentsLoading(true);
      try {
        const res = await getReplies(post.id);
        setComments(res);
      } catch (err) {
        console.error('Failed to load replies:', err);
      } finally {
        setCommentsLoading(false);
      }
    }
  };

  const handleSendComment = async (e) => {
    if (e) e.preventDefault();
    if (!commentText.trim() || submittingComment) return;

    setSubmittingComment(true);
    const draftContent = commentText.trim();
    try {
      const newReply = await createReply(post.id, draftContent, currentUserAlias);
      setComments((prev) => [...prev, newReply]);
      setCommentsCount((prev) => prev + 1);
      setCommentText('');
    } catch (err) {
      console.error('Failed to send reply:', err);
      alert(err.message || 'Gagal mengirim komentar.');
    } finally {
      setSubmittingComment(false);
    }
  };

  return (
    <article className="bg-white border border-auth-card rounded-xl p-6 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="size-8 rounded-full bg-dash-primary/20 flex items-center justify-center text-dash-primary font-bold text-xs select-none shrink-0">
            {post.alias.charAt(0)}
          </span>
          <div>
            <p className="text-sm font-semibold text-dash-text">{post.alias}</p>
            <p className="text-[11px] text-dash-linkMuted">
              {post.category} • {post.time}
            </p>
          </div>
        </div>
        <button
          type="button"
          className="text-dash-muted hover:text-dash-danger transition-colors"
          title="Laporkan Postingan"
        >
          <Flag size={14} />
        </button>
      </div>

      <p className="text-[14px] leading-relaxed text-ink-muted whitespace-pre-wrap">
        {post.text}
      </p>

      <div className="border-t border-auth-card pt-3 flex items-center gap-6">
        <button
          type="button"
          onClick={handleToggleComments}
          className={`flex items-center gap-1.5 text-sm transition-colors ${
            showComments ? 'text-dash-primary font-semibold' : 'text-dash-muted hover:text-dash-primary'
          }`}
        >
          <MessageCircle size={16} />
          <span>{commentsCount} Komentar</span>
        </button>
      </div>

      {/* Comments drawer */}
      {showComments && (
        <div className="border-t border-auth-card/50 pt-4 mt-2 flex flex-col gap-4">
          <p className="text-xs font-semibold text-dash-text">Komentar ({commentsCount})</p>

          {commentsLoading ? (
            <div className="flex items-center justify-center py-4 text-xs text-dash-muted gap-2">
              <span className="animate-spin size-4 border-2 border-dash-primary border-t-transparent rounded-full" />
              Memuat komentar...
            </div>
          ) : comments.length === 0 ? (
            <p className="text-xs text-dash-muted text-center py-2">
              Belum ada komentar. Jadilah yang pertama berbagi dukungan!
            </p>
          ) : (
            <div className="flex flex-col gap-3 max-h-60 overflow-y-auto pr-1">
              {comments.map((reply) => (
                <div
                  key={reply.id}
                  className="bg-surface-soft border border-auth-card/30 rounded-lg p-3 flex gap-2.5 items-start"
                >
                  <span className="size-6 rounded-full bg-dash-primary/10 flex items-center justify-center text-dash-primary font-bold text-[10px] shrink-0 select-none">
                    {reply.alias.charAt(0)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-semibold text-dash-text">{reply.alias}</span>
                      <span className="text-[9px] text-dash-linkMuted">{reply.time}</span>
                    </div>
                    <p className="text-xs text-ink-muted leading-relaxed whitespace-pre-wrap">
                      {reply.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Reply form */}
          <form onSubmit={handleSendComment} className="flex gap-2 items-center mt-1">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Tulis balasan secara anonim..."
              className="flex-1 bg-surface-soft border border-auth-card rounded-lg px-3 py-2 text-xs text-dash-text placeholder:text-dash-muted focus:outline-none focus:ring-1 focus:ring-dash-primary font-medium"
            />
            <button
              type="submit"
              disabled={submittingComment || !commentText.trim()}
              className="size-8 rounded-lg bg-dash-primary hover:bg-primary-light disabled:bg-dash-muted/40 text-white flex items-center justify-center shrink-0 transition-colors"
            >
              {submittingComment ? (
                <span className="animate-spin size-3 border border-white border-t-transparent rounded-full" />
              ) : (
                <Send size={12} />
              )}
            </button>
          </form>
        </div>
      )}
    </article>
  );
}

export function CommunityRulesCard({ rules }) {
  if (!rules?.length) return null;
  return (
    <div className="bg-white border border-auth-card rounded-xl p-6 flex flex-col gap-3 shadow-sm">
      <p className="flex items-center gap-2 text-sm font-semibold text-dash-text">
        <ShieldCheck size={16} className="text-dash-primary" /> Aturan Komunitas
      </p>
      <ul className="flex flex-col gap-2">
        {rules.map((rule) => (
          <li key={rule} className="flex gap-2 text-[13px] text-dash-muted leading-relaxed">
            <span className="mt-2 size-1.5 rounded-full bg-dash-primary shrink-0" />
            {rule}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function TrendingTopicsCard({ topics, onSelectPost }) {
  if (!topics?.length) return null;
  return (
    <div className="bg-white border border-auth-card rounded-xl p-6 flex flex-col gap-4 shadow-sm">
      <p className="flex items-center gap-2 text-sm font-semibold text-dash-text">
        <TrendingUp size={16} className="text-dash-primary" /> Topik Terpopuler
      </p>
      <div className="flex flex-col divide-y divide-auth-card">
        {topics.map((topic) => (
          <button
            key={topic.id}
            type="button"
            onClick={() => onSelectPost(topic.id)}
            className="py-3 first:pt-0 last:pb-0 flex flex-col gap-1 text-left w-full hover:bg-surface-tint transition-colors rounded-lg px-2.5 -mx-2.5 focus:outline-none"
          >
            <span className="text-[11px] text-dash-linkMuted font-semibold select-none">{topic.context}</span>
            <span className="text-sm font-bold text-dash-primary select-none">{topic.tag}</span>
            <span className="text-xs text-dash-muted italic truncate select-none w-full">"{topic.snippet}"</span>
            <div className="flex justify-between items-center mt-1 select-none">
              <span className="text-[10px] text-dash-muted font-medium">Oleh: {topic.author}</span>
              <span className="text-[10px] text-dash-linkMuted font-semibold">{topic.posts}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
