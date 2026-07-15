import { useParams } from 'react-router-dom';
import useFetch from '../hooks/useFetch.js';
import { getArticleDetail } from '../services/resourcesService.js';
import { ArticleHero, ArticleContent, ArticleSidebar, RelatedArticles } from '../components/article/ArticleSections.jsx';

export default function ArticleDetail() {
  const { articleId } = useParams();
  const { data: article, loading, error } = useFetch(() => getArticleDetail(articleId), [articleId]);

  if (loading) {
    return <div className="text-dash-muted text-sm text-center py-20">Memuat artikel...</div>;
  }

  if (error || !article) {
    return <div className="text-red-500 text-sm text-center py-20">Gagal memuat artikel: {error?.message || 'Artikel tidak ditemukan'}</div>;
  }

  return (
    <div className="flex flex-col gap-12">
      <ArticleHero article={article} />
      <div className="flex gap-12 items-start">
        <ArticleContent article={article} />
        <ArticleSidebar article={article} />
      </div>
      <RelatedArticles articles={article.related} />
    </div>
  );
}
