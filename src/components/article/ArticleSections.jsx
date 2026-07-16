import { Link } from 'react-router-dom';
import { Clock, Calendar, ThumbsUp, Share2, Bookmark } from 'lucide-react';

export function ArticleHero({ article }) {
  if (!article) return null;
  return (
    <div className="relative min-h-[350px] md:h-96 rounded-xl2 overflow-hidden bg-gradient-to-br from-dash-primary/25 via-dash-moodBlue/15 to-white flex items-end">
      {article.cover_image_url && (
        <img 
          src={article.cover_image_url} 
          alt={article.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      <div className="relative z-10 p-6 md:p-10 max-w-4xl flex flex-col gap-3 md:gap-4 w-full">
        <div className="flex gap-2">
          {article.badges.map((badge, i) => (
            <span
              key={badge}
              className={`rounded-full px-4 py-1.5 text-[11px] font-bold tracking-wide uppercase ${
                i === 0 ? 'bg-dash-primary text-white' : 'bg-[#e6e8ea] text-dash-primary'
              }`}
            >
              {badge}
            </span>
          ))}
        </div>
        <h1 className="text-[24px] md:text-[36px] lg:text-[42px] leading-snug md:leading-tight font-bold tracking-tight text-white drop-shadow-md">
          {article.title}
        </h1>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 pt-2 md:pt-4">
          <div className="flex items-center gap-3">
            <span className="size-10 md:size-12 rounded-full bg-dash-primary/30 border-2 border-white/20 shadow backdrop-blur-sm" />
            <div>
              <p className="text-sm md:text-[16px] font-medium text-white">{article.author.name}</p>
              <p className="text-[10px] md:text-[11px] font-bold uppercase tracking-wide text-white/70">{article.author.role}</p>
            </div>
          </div>
          <div className="border-t sm:border-t-0 sm:border-l border-white/10 sm:border-white/20 pt-3 sm:pt-0 sm:pl-6 flex gap-4 text-xs md:text-[13px] text-white/90">
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
  
  // Format content (assuming plain text with newlines from Supabase)
  const paragraphs = article.content.split('\n').filter(p => p.trim() !== '');

  return (
    <article className="flex-1 bg-white border border-auth-card rounded-xl2 p-5 md:p-12 flex flex-col gap-6 shadow-sm">
      {paragraphs.map((para, idx) => (
        <p key={idx} className="text-[16px] md:text-[17px] leading-relaxed text-dash-text whitespace-pre-wrap">
          {para}
        </p>
      ))}
    </article>
  );
}

export function ArticleSidebar({ article }) {
  if (!article) return null;
  return (
    <aside className="w-full lg:w-[340px] shrink-0 flex flex-col gap-6">
      <div className="bg-white border border-auth-card rounded-xl2 p-6 flex flex-col items-center gap-4 text-center shadow-sm">
        <p className="text-[11px] font-bold uppercase tracking-wide text-dash-primary self-start">Ditulis Oleh</p>
        <span className="size-20 rounded-full bg-gradient-to-br from-dash-primary/20 to-dash-moodBlue/20 border-4 border-white shadow-sm" />
        <div>
          <p className="font-bold text-dash-text text-lg">{article.author.name}</p>
          <p className="text-[14px] text-dash-muted leading-relaxed mt-2">{article.author.bio}</p>
        </div>
      </div>

      <div className="rounded-xl2 p-8 flex flex-col gap-3 bg-gradient-to-br from-dash-primary to-[#003896] text-white shadow-md relative overflow-hidden">
        <div className="absolute -top-10 -right-10 size-40 bg-white/10 rounded-full blur-2xl" />
        <p className="text-[22px] leading-tight font-bold relative z-10">Booking Sesi</p>
        <p className="text-[14px] leading-relaxed text-white/90 relative z-10">Jadwalkan sesi konseling privat dengan konselor profesional kami untuk mendampingi masa-masa sulitmu.</p>
        <Link to="/schedule-session" className="mt-4 w-full text-center rounded-xl bg-white text-dash-primary text-sm font-bold px-4 py-3 hover:bg-gray-50 transition-colors relative z-10 shadow-sm">
          Booking Sesi Sekarang
        </Link>
      </div>
    </aside>
  );
}

export function RelatedArticles({ articles }) {
  if (!articles?.length) return null;
  return (
    <div className="border-t border-auth-card pt-12 flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-dash-text">Artikel Terkait</h2>
          <p className="text-dash-muted mt-1">Perdalam pengetahuan Anda tentang kesejahteraan mental.</p>
        </div>
        <Link to="/resources" className="text-dash-primary font-bold text-sm hover:underline w-fit">Lihat Semua</Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map((art) => (
          <Link
            key={art.id}
            to={`/resources/artikel/${art.id}`}
            className="bg-white border border-auth-card rounded-xl2 overflow-hidden hover:shadow-md transition-shadow group flex flex-col h-full"
          >
            <div className="h-48 bg-gradient-to-br from-dash-primary/15 to-dash-moodBlue/15 relative">
              <span className="absolute left-4 top-4 rounded bg-white/90 px-3 py-1.5 text-[11px] font-bold text-dash-primary backdrop-blur uppercase tracking-wide">
                {art.category}
              </span>
            </div>
            <div className="p-6 flex flex-col gap-3 flex-1">
              <p className="text-[18px] font-semibold text-dash-text leading-snug group-hover:text-dash-primary transition-colors">{art.title}</p>
              <span className="text-[12px] text-dash-muted mt-auto">{art.meta}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
