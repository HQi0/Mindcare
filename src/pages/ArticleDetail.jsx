import { useParams } from 'react-router-dom';
import useFetch from '../hooks/useFetch.js';
import { getArticleDetail } from '../services/resourcesService.js';
import { ArticleHero, ArticleContent, ArticleSidebar, RelatedArticles } from '../components/article/ArticleSections.jsx';

export default function ArticleDetail() {
  const { articleId } = useParams();
  const { data: article, loading } = useFetch(getArticleDetail, [articleId]);

  if (loading || !article) {
    return <div className="text-dash-muted text-sm">Memuat artikel...</div>;
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
