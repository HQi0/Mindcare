import { Link } from 'react-router-dom';

export function ResourceGrid({ articles }) {
  if (!articles || articles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white border border-auth-card rounded-xl">
        <p className="text-dash-muted">Belum ada artikel di kategori ini.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full pt-4">
      {articles.map((card) => (
        <Link 
          to={`/resources/artikel/${card.id}`}
          key={card.id} 
          className="bg-white border border-auth-card rounded-xl p-6 flex flex-col justify-between hover:shadow-sm transition-shadow group"
        >
          <div className="flex flex-col gap-2">
            {card.cover_image_url ? (
              <img 
                src={card.cover_image_url} 
                alt={card.title} 
                className="h-48 w-full object-cover rounded-lg border border-auth-card group-hover:opacity-90 transition-opacity"
              />
            ) : (
              <div className="h-48 rounded-lg bg-gradient-to-br from-dash-primary/15 to-dash-moodBlue/15" />
            )}
            
            <h4 className="text-[20px] leading-7 font-semibold tracking-[-0.22px] text-dash-text pt-2 group-hover:text-dash-primary transition-colors">
              {card.title}
            </h4>
            <p className="text-[13.5px] text-dash-muted">{card.description}</p>
          </div>
          <div className="border-t border-auth-card flex items-center justify-between pt-4 mt-6">
            <span className="text-xs font-bold text-dash-text">{card.created_at}</span>
            <span className="text-[11px] uppercase text-dash-primary font-bold bg-dash-primary/10 px-2 py-1 rounded">{card.type}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}

export function RecommendationBanner() {
  return (
    <div className="bg-dash-primary rounded-2xl px-8 pt-12 pb-8 flex flex-col gap-2 w-full mt-6">
      <h3 className="text-[22px] leading-8 font-semibold tracking-[-0.22px] text-white">Ingin rekomendasi personal?</h3>
      <p className="text-[15px] text-white/90 max-w-xl">
        Ambil kuis penilaian diri singkat (2 menit) untuk menemukan sumber daya yang paling sesuai dengan kondisi mental
        Anda saat ini.
      </p>
      <div className="flex gap-4 pt-4">
        <Link to="/self-assessment" className="rounded-lg bg-white px-8 py-3 text-dash-primary text-sm shadow-lg font-bold">
          Mulai Penilaian
        </Link>
      </div>
    </div>
  );
}
