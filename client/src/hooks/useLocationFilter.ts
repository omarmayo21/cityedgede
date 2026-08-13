import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { consumeDestinationContentTransition } from '../components/PageTransition';

const FLASH_DURATION = 260;

function flashProjectContent(container: HTMLElement) {
  container.style.position = container.style.position || 'relative';
  let overlay = container.querySelector<HTMLElement>(':scope > .cityedge-content-flash');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'cityedge-content-flash';
    overlay.setAttribute('aria-hidden', 'true');
    container.appendChild(overlay);
  }

  overlay.classList.remove('is-visible');
  // Force a style flush so rapid changes replay the short transition.
  void overlay.offsetWidth;
  overlay.classList.add('is-visible');
  window.setTimeout(() => overlay?.classList.remove('is-visible'), FLASH_DURATION);
}

export function useLocationFilter() {
  const location = useLocation();

  useEffect(() => {
    // Only run on location pages
    if (!location.pathname.startsWith('/location/')) return;

    let cleanup = () => {};

    const initFilter = () => {
      const selectElement = document.querySelector('.uc-select-filter__select') as HTMLSelectElement;
      const itemsWrapper = document.querySelector('.uc-items-wrapper') as HTMLElement;
      
      if (!selectElement || !itemsWrapper) {
        const t = setTimeout(initFilter, 200);
        cleanup = () => clearTimeout(t);
        return;
      }

      const handleChange = () => {
        const selectedOption = selectElement.options[selectElement.selectedIndex];
        const targetSlug = selectedOption?.getAttribute('data-slug');

        flashProjectContent(itemsWrapper);

        setTimeout(() => {
          // Apply filter
          const items = itemsWrapper.querySelectorAll('.e-loop-item');
          items.forEach((item) => {
            const htmlItem = item as HTMLElement;
            const carouselItem = htmlItem.closest('.owl-item') as HTMLElement | null;
            // Original display is usually block or flex. Elementor loop items are usually block.
            if (!targetSlug) {
              // Show all
              htmlItem.style.display = '';
              if (carouselItem) carouselItem.style.display = '';
            } else {
              // Check if item has the slug class (e.g. project-type-residential-en)
              // Note: Elementor classes are prefixed with project-type-
              if (htmlItem.classList.contains(`project-type-${targetSlug}`)) {
                htmlItem.style.display = '';
                if (carouselItem) carouselItem.style.display = '';
              } else {
                htmlItem.style.display = 'none';
                if (carouselItem) carouselItem.style.display = 'none';
              }
            }
          });

          // The original filter refreshes Owl after it changes visible items.
          // Our SPA carousel keeps its instance and recalculates without recreation.
          itemsWrapper.dispatchEvent(new Event('cityedge:carousel-update'));

        }, 90);
      };

      selectElement.addEventListener('change', handleChange);
      cleanup = () => selectElement.removeEventListener('change', handleChange);

      if (consumeDestinationContentTransition()) flashProjectContent(itemsWrapper);
    };

    initFilter();

    return () => cleanup();
  }, [location.pathname]);
}
