import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

interface ProjectProps {
  lang: 'en' | 'ar';
}

export default function ProjectDetails({ lang }: ProjectProps) {
  const { slug } = useParams();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real environment, fetch from API
    // fetch(`/api/projects/${slug}?lang=${lang}`)
    //   .then(res => res.json())
    //   .then(data => setProject(data))
    //   .finally(() => setLoading(false));

    setTimeout(() => {
      setProject({
        slug,
        title: lang === 'ar' ? 'Ù…Ø´Ø±ÙˆØ¹ ' + slug : 'Project ' + slug,
        description: 'Detailed description based on extracted Elementor content...',
        heroImage: '/placeholder.jpg',
        galleries: [],
        amenities: [],
        unitTypes: []
      });
      setLoading(false);
    }, 500);
  }, [slug, lang]);

  if (loading) {
    return <div className="min-h-screen pt-32 flex justify-center"><div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full" /></div>;
  }

  if (!project) {
    return <div className="min-h-screen pt-32 text-center text-2xl font-bold">Project Not Found</div>;
  }

  return (
    <div className="pt-20">
      <section className="relative h-[60vh] bg-gray-900 flex items-center justify-center text-white">
        <div className="absolute inset-0 bg-black/50 z-10" />
        <img 
          src={project.heroImage} 
          className="absolute inset-0 w-full h-full object-cover" 
          alt={project.title} 
          onError={(e) => { e.currentTarget.style.display = 'none' }}
        />
        <div className="relative z-20 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">{project.title}</h1>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-secondary mb-8 text-center">
            {lang === 'ar' ? 'Ù†Ø¸Ø±Ø© Ø¹Ø§Ù…Ø©' : 'Overview'}
          </h2>
          <div className="prose prose-lg mx-auto" dangerouslySetInnerHTML={{ __html: project.description }} />
        </div>
      </section>
      
      {/* Additional sections for galleries, amenities, unit types based on audit structure */}
    </div>
  );
}
