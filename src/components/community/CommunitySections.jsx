import { Heart, MessageCircle, Flag, ShieldCheck, TrendingUp } from 'lucide-react';

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
            className={`rounded-full px-4 py-2 text-sm transition-colors ${
              isActive ? 'bg-dash-primary text-white' : 'bg-white border border-auth-card text-dash-muted'
            }`}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}

export function PostComposer({ value, onChange, onSubmit }) {
  return (
    <div className="bg-white border border-auth-card rounded-xl p-4 flex gap-3 items-center">
      <span className="size-10 rounded-full bg-dash-primary/20 shrink-0" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
        placeholder="Bagikan apa yang kamu rasakan secara anonim..."
        className="flex-1 bg-[#f2f4f6] border border-auth-card rounded-lg px-4 py-2.5 text-sm text-dash-text placeholder:text-dash-muted focus:outline-none"
      />
      <button type="button" onClick={onSubmit} className="rounded-lg bg-dash-primary text-white text-sm px-4 py-2.5 shrink-0">
        Kirim
      </button>
    </div>
  );
}

export function PostCard({ post }) {
  return (
    <article className="bg-white border border-auth-card rounded-xl p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="size-8 rounded-full bg-dash-primary/25" />
          <div>
            <p className="text-sm font-semibold text-dash-text">{post.alias}</p>
            <p className="text-[11px] text-dash-linkMuted">{post.category} • {post.time}</p>
          </div>
        </div>
        <button type="button" className="text-dash-muted"><Flag size={14} /></button>
      </div>
      <p className="text-[14px] leading-relaxed text-dash-muted">{post.text}</p>
      <div className="border-t border-auth-card pt-3 flex items-center gap-6">
        <button type="button" className="flex items-center gap-1.5 text-sm text-dash-muted hover:text-dash-primary">
          <Heart size={16} /> {post.likes} Dukung
        </button>
        <button type="button" className="flex items-center gap-1.5 text-sm text-dash-muted hover:text-dash-primary">
          <MessageCircle size={16} /> {post.comments} Komentar
        </button>
      </div>
    </article>
  );
}

export function CommunityRulesCard({ rules }) {
  if (!rules?.length) return null;
  return (
    <div className="bg-white border border-auth-card rounded-xl p-6 flex flex-col gap-3">
      <p className="flex items-center gap-2 text-sm font-semibold text-dash-text">
        <ShieldCheck size={16} /> Aturan Komunitas
      </p>
      <ul className="flex flex-col gap-2">
        {rules.map((rule) => (
          <li key={rule} className="flex gap-2 text-[13px] text-dash-muted">
            <span className="mt-1.5 size-1.5 rounded-full bg-dash-primary shrink-0" />
            {rule}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function TrendingTopicsCard({ topics }) {
  if (!topics?.length) return null;
  return (
    <div className="bg-white border border-auth-card rounded-xl p-6 flex flex-col gap-4">
      <p className="flex items-center gap-2 text-sm font-semibold text-dash-text">
        <TrendingUp size={16} /> Topik Hangat
      </p>
      <div className="flex flex-col divide-y divide-auth-card">
        {topics.map((topic) => (
          <a key={topic.tag} href="#" className="py-3 first:pt-0 last:pb-0 flex flex-col gap-1">
            <span className="text-[11px] text-dash-linkMuted">{topic.context}</span>
            <span className="text-sm font-semibold text-dash-primary">{topic.tag}</span>
            <span className="text-[11px] text-dash-linkMuted">{topic.posts}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
