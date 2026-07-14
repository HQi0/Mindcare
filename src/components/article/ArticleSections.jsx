import { Link } from 'react-router-dom';
import { Clock, Calendar, ThumbsUp, Share2, Bookmark, MessageCircleHeart } from 'lucide-react';

export function ArticleHero({ article }) {
  if (!article) return null;
  return (
    <div className="relative h-96 rounded-xl overflow-hidden bg-gradient-to-br from-dash-primary/25 via-dash-moodBlue/15 to-white flex items-end">
      <div className="p-10 max-w-3xl flex flex-col gap-4">
        <div className="flex gap-2">
          {article.badges.map((badge, i) => (
            <span
              key={badge}
              className={`rounded-full px-3 py-1 text-[11px] font-medium tracking-wide ${
                i === 0 ? 'bg-dash-primary text-white' : 'bg-[#e6e8ea] text-dash-primary'
              }`}
            >
              {badge}
            </span>
          ))}
        </div>
        <h1 className="text-[36px] leading-tight font-bold tracking-[-1px] text-dash-text">{article.title}</h1>
        <div className="flex items-center gap-6 pt-2">
          <div className="flex items-center gap-3">
            <span className="size-12 rounded-full bg-dash-primary/30 border-2 border-white shadow" />
            <div>
              <p className="text-[16px] text-dash-text">{article.author.name}</p>
              <p className="text-[11px] uppercase tracking-wide text-dash-muted">{article.author.role}</p>
            </div>
          </div>
          <div className="border-l border-auth-card pl-6 flex gap-4 text-[13px] text-dash-muted">
            <span className="flex items-center gap-1.5"><Clock size={14} /> {article.readTime}</span>
            <span className="flex items-center gap-1.5"><Calendar size={14} /> {article.date}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ArticleContent({ article }) {
  if (!article) return null;
  return (
    <article className="flex-1 bg-dash-sidebar border border-auth-card rounded-xl p-8 flex flex-col gap-6">
      <p className="text-[16px] leading-[27px] text-dash-muted">{article.intro}</p>

      {article.sections.map((section) => (
        <div key={section.heading} className="flex flex-col gap-2">
          <h2 className="text-xl font-bold text-dash-primary">{section.heading}</h2>
          <p className="text-[16px] leading-[27px] text-dash-muted">{section.body}</p>
        </div>
      ))}

      <blockquote className="bg-[#f2f4f6] border-l-4 border-dash-primary rounded-xl px-7 py-6 italic text-[16px] leading-[27px] text-dash-muted">
        &ldquo;{article.quote}&rdquo;
      </blockquote>

      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-bold text-dash-primary">Tips Praktis Mengelola Stres Ujian</h2>
        <p className="text-[16px] leading-[27px] text-dash-muted">
          Berikut adalah beberapa strategi yang telah teruji secara klinis untuk membantu Anda tetap tenang dan fokus
          selama masa ujian:
        </p>
      </div>
      <ul className="flex flex-col gap-3">
        {article.tips.map((tip) => (
          <li key={tip.title} className="text-[15px] leading-[22px] text-dash-muted">
            <span className="text-dash-primary font-bold mr-1">•</span>
            <span className="font-bold text-dash-muted">{tip.title}</span> {tip.body}
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-bold text-dash-primary">Pentingnya Self-Compassion</h2>
        <p className="text-[16px] leading-[27px] text-dash-muted">{article.compassion}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="h-48 rounded-lg bg-gradient-to-br from-dash-primary/15 to-dash-moodBlue/15 border border-auth-card" />
        <div className="h-48 rounded-lg bg-gradient-to-br from-dash-moodBlue/15 to-dash-primary/15 border border-auth-card" />
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="flex items-center gap-2 text-xl font-bold text-dash-primary">
          <MessageCircleHeart size={20} /> Kesimpulan
        </h2>
        <p className="text-[16px] leading-[27px] text-dash-muted">{article.conclusion}</p>
      </div>

      <div className="border-t border-auth-card flex items-center justify-between pt-6">
        <div className="flex gap-4">
          <button type="button" className="flex items-center gap-2 rounded-full bg-[#0053db] text-dash-primary px-4 py-2 text-sm">
            <ThumbsUp size={15} /> Bermanfaat ({article.helpfulCount})
          </button>
          <button type="button" className="flex items-center gap-2 rounded-full border border-auth-card px-4 py-2 text-sm text-dash-muted">
            <Share2 size={14} /> Bagikan
          </button>
        </div>
        <button type="button" className="size-10 rounded-full border border-auth-card flex items-center justify-center">
          <Bookmark size={16} />
        </button>
      </div>
    </article>
  );
}

export function ArticleSidebar({ article }) {
  if (!article) return null;
  return (
    <aside className="w-80 shrink-0 flex flex-col gap-8">
      <div className="bg-dash-sidebar border border-auth-card rounded-xl p-6 flex flex-col items-center gap-4 text-center">
        <p className="text-[11px] uppercase tracking-wide text-dash-primary self-start">Tentang Penulis</p>
        <span className="size-20 rounded-full bg-dash-primary/20 border-2 border-[#eceef0]" />
        <div>
          <p className="font-bold text-dash-text">{article.author.name}</p>
          <p className="text-[13px] text-dash-muted">{article.author.bio}</p>
        </div>
        <button type="button" className="w-full rounded-lg bg-dash-primary text-white py-2 text-sm">
          Konsultasi Sekarang
        </button>
      </div>

      <div className="bg-white border border-auth-card rounded-xl p-6 flex flex-col gap-3">
        <p className="text-[16px] text-dash-text">Daftar Isi</p>
        <nav className="flex flex-col gap-3">
          {article.toc.map((item, i) => (
            <a key={item} href={`#toc-${i}`} className={`text-[13px] ${i === 0 ? 'text-dash-primary font-medium' : 'text-dash-muted'}`}>
              {i + 1}. {item}
            </a>
          ))}
        </nav>
      </div>

      <div className="rounded-xl p-6 flex flex-col gap-2 bg-gradient-to-br from-dash-primary to-dash-primary/80 text-white">
        <p className="text-lg font-bold">Butuh Teman Bicara?</p>
        <p className="text-xs opacity-90">Konselor kami tersedia 24/7 untuk mendampingi masa-masa sulitmu.</p>
        <Link to="/counselor-chat" className="mt-2 w-fit rounded-lg bg-white text-dash-primary text-xs font-bold px-4 py-2">
          Chat Sekarang →
        </Link>
      </div>
    </aside>
  );
}

export function RelatedArticles({ articles }) {
  if (!articles?.length) return null;
  return (
    <div className="border-t border-auth-card pt-12 flex flex-col gap-8">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold text-dash-text">Artikel Terkait</h2>
          <p className="text-dash-muted">Perdalam pengetahuan Anda tentang kesejahteraan mental.</p>
        </div>
        <Link to="/resources" className="text-dash-primary font-bold text-sm">Lihat Semua</Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map((art) => (
          <Link
            key={art.id}
            to={`/resources/artikel/${art.id}`}
            className="bg-dash-sidebar border border-auth-card rounded-xl overflow-hidden hover:shadow-sm transition-shadow"
          >
            <div className="h-48 bg-gradient-to-br from-dash-primary/15 to-dash-moodBlue/15 relative">
              <span className="absolute left-4 top-4 rounded bg-white/90 px-2 py-1 text-[11px] text-dash-primary backdrop-blur">
                {art.category}
              </span>
            </div>
            <div className="p-6 flex flex-col gap-3">
              <p className="text-lg font-bold text-dash-text leading-snug">{art.title}</p>
              <span className="text-[11px] text-dash-muted">{art.meta}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
