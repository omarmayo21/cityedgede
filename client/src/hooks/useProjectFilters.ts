import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { triggerPageTransition } from '../components/PageTransition';

/**
 * Intercepts clicks on .filter-link elements in project pages
 * and shows/hides the corresponding .unit-type-section elements.
 *
 * Original behavior: full-page reload with ?unit_type=xxx query param.
 * React behavior: instant client-side show/hide with active class toggling.
 */
export function useProjectFilters() {
  const location = useLocation();

  useEffect(() => {
    const initFilters = () => {
      // Ensure the listener attaches globally regardless of current DOM state.
      // Helper: extract unit_type from an href like /project/xxx/?unit_type=apartment-en&do_scroll=1
      const getUnitType = (href: string): string | null => {
        try {
          const sanitizedHref = href.replace(/&amp;/g, '&');
          const url = new URL(sanitizedHref, window.location.origin);
          return url.searchParams.get('unit_type');
        } catch {
          return null;
        }
      };

      // Show the first section by default if none is marked active in DOM
      // We still need to do this initialization step, so we'll poll briefly or rely on MutationObserver
      // But for the click handler, event delegation is foolproof:
      
      const handleFilterClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const clickedLink = target.closest('.unit-type-links .filter-link') as HTMLElement;
        if (!clickedLink) return;

        e.preventDefault();
        triggerPageTransition();
        const href = clickedLink.getAttribute('href') || '';
        const unitType = getUnitType(href);

        // Update active class on all filter links
        const unitTypeLinks = document.querySelectorAll('.unit-type-links .filter-link');
        unitTypeLinks.forEach((link) => link.classList.remove('active'));
        clickedLink.classList.add('active');

        // Show/hide sections
        const allSections = Array.from(document.querySelectorAll<HTMLElement>('.unit-type-section'));
        // Some original WordPress project pages expose filter links for future
        // unit types but only have a single scraped unit section. The server
        // used to return that available content after the navigation. Preserve
        // the content instead of hiding every section in the SPA copy.
        const matchingSections = unitType
          ? allSections.filter((section) => section.getAttribute('data-unit-type') === unitType)
          : allSections;
        const sectionsToShow = matchingSections.length ? matchingSections : allSections;

        allSections.forEach((section) => {
          section.style.display = sectionsToShow.includes(section) ? '' : 'none';
        });

        // Update URL with unit_type param (preserving pathname) without triggering page reload
        try {
          const sanitized = href.replace(/&amp;/g, '&');
          const newUrl = new URL(sanitized, window.location.origin);
          window.history.pushState({}, '', newUrl.pathname + newUrl.search);
        } catch {
          // If URL parsing fails, skip URL update
        }

        // Smooth scroll to sections if ?do_scroll=1 is in original href
        if (href.includes('do_scroll=1')) {
          const firstVisible = document.querySelector<HTMLElement>('.unit-type-section:not([style*="display: none"])');
          if (firstVisible) {
            firstVisible.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      };

      document.addEventListener('click', handleFilterClick);
      
      // Initialize visibility (poll briefly to catch lazy load)
      let attempts = 0;
      const initVisibility = () => {
        const sections = document.querySelectorAll<HTMLElement>('.unit-type-section');
        const activeLink = document.querySelector<HTMLElement>('.unit-type-links .filter-link.active');
        
        if (sections.length > 0) {
          if (activeLink) {
            const activeType = getUnitType(activeLink.getAttribute('href') || '');
            sections.forEach((section) => {
              const sectionType = section.getAttribute('data-unit-type');
              if (activeType && sectionType !== activeType) {
                section.style.display = 'none';
              } else {
                section.style.display = '';
              }
            });
          } else {
            sections.forEach((section) => { section.style.display = ''; });
          }
        } else if (attempts < 10) {
           attempts++;
           setTimeout(initVisibility, 200);
        }
      };
      
      initVisibility();

      return () => {
        document.removeEventListener('click', handleFilterClick);
      };
    };

    const cleanup = initFilters();
    return cleanup;
  }, [location.pathname]);
}
