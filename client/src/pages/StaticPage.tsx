import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

interface StaticPageProps {
  lang: 'en' | 'ar';
}

export default function StaticPage({ lang }: StaticPageProps) {
  const { slug } = useParams();
  const [page, setPage] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real environment, fetch from API
    setTimeout(() => {
      setPage({
        slug,
        title: lang === 'ar' ? 'ØµÙØ­Ø© ' + slug : 'Page ' + slug,
        content: 'Content based on extracted Elementor HTML...'
      });
      setLoading(false);
    }, 500);
  }, [slug, lang]);

  if (loading) {
    return <div className="min-h-screen pt-32 flex justify-center"><div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full" /></div>;
  }

  if (!page) {
    return <div className="min-h-screen pt-32 text-center text-2xl font-bold">Page Not Found</div>;
  }

  return (
    <div className="pt-20">
      <section className="bg-secondary text-white py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold">{page.title}</h1>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl prose prose-lg" dangerouslySetInnerHTML={{ __html: page.content }} />
      </section>
    </div>
  );
}
