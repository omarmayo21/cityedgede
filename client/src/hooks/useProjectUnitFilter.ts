import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useProjectUnitFilter() {
  const location = useLocation();

  useEffect(() => {
    if (!location.pathname.startsWith('/project/')) return;

    const handleFilterClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a.filter-link') as HTMLAnchorElement;
      
      if (!link) return;

      e.preventDefault(); // Stop full page reload

      // Update active tab styling
      const allLinks = document.querySelectorAll('.filter-link');
      allLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      // Extract unit_type from href
      const url = new URL(link.href, window.location.origin);
      const unitType = url.searchParams.get('unit_type');

      // Update URL without reload to preserve state
      window.history.pushState({}, '', url.pathname + url.search);

      if (!unitType) return;

      // Find the corresponding unit section
      const sections = document.querySelectorAll('.unit-type-section');

      sections.forEach((section) => {
        const htmlSection = section as HTMLElement;
        if (htmlSection.getAttribute('data-unit-type') === unitType) {
          htmlSection.style.display = 'block';
        } else {
          htmlSection.style.display = 'none';
        }
      });

      // Trigger a window resize event so that any hidden Swiper instances recalculate their dimensions
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 50);
    };

    document.addEventListener('click', handleFilterClick);

    return () => {
      document.removeEventListener('click', handleFilterClick);
    };
  }, [location.pathname]);
}
