import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

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
  void overlay.offsetWidth;
  overlay.classList.add('is-visible');
  window.setTimeout(() => overlay?.classList.remove('is-visible'), FLASH_DURATION);
}

const PARENT_TO_CHILD_MAP: Record<string, { id: string; name: string }[]> = {
  '19': [
    { id: 'project-type-apartments-en', name: 'Apartments' },
    { id: 'project-type-chalets-en', name: 'Chalets' },
    { id: 'project-type-duplexes-en', name: 'Duplexes' },
    { id: 'project-type-loft', name: 'Loft' },
    { id: 'project-type-mansio', name: 'Mansio' },
    { id: 'project-type-penthouse-duplex-en', name: 'Penthouse Duplex' },
    { id: 'project-type-studios-en', name: 'Studios' },
    { id: 'project-type-townhouses-en', name: 'Townhouses' },
    { id: 'project-type-twin-villas-en', name: 'Twin Villas' },
    { id: 'project-type-villas-en', name: 'Villas' },
  ],
  '45': [
    { id: 'project-type-clinics-en', name: 'Clinics' },
    { id: 'project-type-retail-en', name: 'Retail' },
  ],
  '83': [
    { id: 'project-type-offices-en', name: 'Offices' },
  ],
};

const LOCATION_MAP: Record<string, string> = {
  '7': 'location-new-cairo-city-en',
  '15': 'location-sheikh-zayed-city-en',
  '13': 'location-new-alamein-city-en',
  '14': 'location-new-capital-city-en',
  '16': 'location-new-mansoura-city-en',
  '17': 'location-maspero-triangle-en',
};

const PARENT_MAP: Record<string, string> = {
  '83': 'project-type-administrative-en',
  '45': 'project-type-commercial-en',
  '19': 'project-type-residential-en',
};

const FILTER_GRID_ID = 'adv-filter-results-grid';

function injectGridStyles() {
  if (document.getElementById('adv-filter-grid-styles')) return;
  const style = document.createElement('style');
  style.id = 'adv-filter-grid-styles';
  style.textContent = `
    #${FILTER_GRID_ID} {
      display: none;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
      width: 100%;
      margin-top: 20px;
    }
    #${FILTER_GRID_ID}.active {
      display: grid;
    }
    #${FILTER_GRID_ID} .filter-grid-item {
      position: relative;
      min-height: 45vh;
      overflow: hidden;
      background: var(--e-global-color-ee227db, #1a1a2e);
      cursor: pointer;
    }
    #${FILTER_GRID_ID} .filter-grid-item .filter-grid-bg {
      position: absolute;
      inset: 0;
      background-size: cover;
      background-position: center;
      transition: transform 0.5s ease;
    }
    #${FILTER_GRID_ID} .filter-grid-item:hover .filter-grid-bg {
      transform: scale(1.04);
    }
    #${FILTER_GRID_ID} .filter-grid-item .filter-grid-info {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: var(--e-global-color-ee227db, rgba(26,26,46,0.95));
      padding: 10px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      z-index: 9999;
    }
    #${FILTER_GRID_ID} .filter-grid-item .filter-grid-info h2 {
      font-family: "AeonikTRIAL", Sans-serif;
      font-size: 22px;
      font-weight: 400;
      color: var(--e-global-color-primary, #ffffff);
      margin: 0;
    }
    #${FILTER_GRID_ID} .filter-grid-item .filter-grid-info h2 a {
      color: inherit;
      text-decoration: none;
    }
    #${FILTER_GRID_ID} .filter-grid-item .filter-grid-info h2 a:hover {
      text-decoration: underline;
    }
    #${FILTER_GRID_ID} .filter-grid-item .filter-grid-info .filter-grid-location {
      font-family: "AeonikTRIAL", Sans-serif;
      font-size: 14px;
      color: rgba(48, 46, 45, 0.71);
    }
    #${FILTER_GRID_ID} .filter-grid-item .filter-grid-hover {
      position: absolute;
      bottom: 60px;
      left: 0;
      right: 0;
      display: flex;
      justify-content: center;
      opacity: 0;
      transform: translateY(60px);
      transition: all 0.5s;
      z-index: 9999;
    }
    #${FILTER_GRID_ID} .filter-grid-item:hover .filter-grid-hover {
      opacity: 1;
      transform: translateY(0);
    }
    #${FILTER_GRID_ID} .filter-grid-item .filter-grid-hover a {
      background: transparent;
      border: none;
      font-family: "AeonikTRIAL", Sans-serif;
      font-size: 18px;
      font-weight: 500;
      color: #313131;
      text-decoration: none;
      padding: 8px 16px;
      background: rgba(217,217,217,0.8);
      border-radius: 3px;
    }
    #${FILTER_GRID_ID} .filter-grid-empty {
      grid-column: 1 / -1;
      text-align: center;
      padding: 40px;
      font-family: "AeonikTRIAL", Sans-serif;
      font-size: 20px;
      color: #313131;
    }
    #adv-project-carousel-wrapper.filter-hidden {
      display: none !important;
    }
    @media (max-width: 767px) {
      #${FILTER_GRID_ID} {
        grid-template-columns: 1fr;
      }
    }
  `;
  document.head.appendChild(style);
}

interface SlideData {
  classNames: string;
  bgImage: string;
  projectTitle: string;
  projectHref: string;
  locationLabel: string;
  locationHref: string;
}

function extractSlideData(slide: Element): SlideData {
  const bgEl = slide.querySelector('[style*="background-image"]') as HTMLElement | null;
  let bgImage = '';
  if (bgEl) {
    const match = bgEl.style.backgroundImage?.match(/url\(["']?([^"')]+)["']?\)/);
    if (match) bgImage = match[1];
  }
  if (!bgImage) {
    // fallback: check inline style on the slide or its children
    const styleEl = slide.previousElementSibling;
    if (styleEl && styleEl.tagName === 'STYLE') {
      const itemId = [...slide.classList].find(c => c.startsWith('e-loop-item-'))?.replace('e-loop-item-', '');
      if (itemId) {
        const match = styleEl.textContent?.match(new RegExp(`e-loop-item-${itemId}[^{]*\\{[^}]*background-image:url\\(([^)]+)\\)`));
        if (match) bgImage = match[1].replace(/['"]/g, '');
      }
    }
  }

  const titleEl = slide.querySelector('.elementor-heading-title a') as HTMLAnchorElement | null;
  const projectTitle = titleEl?.textContent?.trim() || '';
  const projectHref = titleEl?.getAttribute('href') || '#';

  const locationEl = slide.querySelector('.project-location-home a') as HTMLAnchorElement | null;
  const locationLabel = locationEl?.textContent?.trim() || '';
  const locationHref = locationEl?.getAttribute('href') || '#';

  return {
    classNames: slide.className,
    bgImage,
    projectTitle,
    projectHref,
    locationLabel,
    locationHref,
  };
}

function buildGridItem(data: SlideData): HTMLElement {
  const item = document.createElement('div');
  item.className = 'filter-grid-item';
  item.dataset.classes = data.classNames;

  if (data.bgImage) {
    const bg = document.createElement('div');
    bg.className = 'filter-grid-bg';
    bg.style.backgroundImage = `url("${data.bgImage}")`;
    item.appendChild(bg);
  }

  const hover = document.createElement('div');
  hover.className = 'filter-grid-hover';
  const hoverLink = document.createElement('a');
  hoverLink.href = data.projectHref;
  hoverLink.textContent = 'See Project Details';
  hover.appendChild(hoverLink);
  item.appendChild(hover);

  const info = document.createElement('div');
  info.className = 'filter-grid-info';

  const left = document.createElement('div');
  const h2 = document.createElement('h2');
  const titleLink = document.createElement('a');
  titleLink.href = data.projectHref;
  titleLink.textContent = data.projectTitle;
  h2.appendChild(titleLink);
  left.appendChild(h2);
  info.appendChild(left);

  if (data.locationLabel) {
    const right = document.createElement('div');
    right.className = 'filter-grid-location';
    right.textContent = data.locationLabel;
    info.appendChild(right);
  }

  item.appendChild(info);
  return item;
}

export function useMainProjectFilter() {
  const location = useLocation();

  useEffect(() => {
    // Only run on the home page where the filter form exists
    if (location.pathname !== '/' && location.pathname !== '') return;

    injectGridStyles();

    let allSlideData: SlideData[] = [];
    let grid: HTMLElement | null = null;

    const cleanup: (() => void)[] = [];

    const init = () => {
      const form = document.getElementById('adv-project-filters-form');
      if (!form) {
        // Form not mounted yet — retry
        const t = setTimeout(init, 200);
        cleanup.push(() => clearTimeout(t));
        return;
      }

      const carouselWrapper = document.getElementById('adv-project-carousel-wrapper');
      if (!carouselWrapper) {
        const t = setTimeout(init, 200);
        cleanup.push(() => clearTimeout(t));
        return;
      }

      // Extract data from all existing swiper slides (non-duplicate)
      if (allSlideData.length === 0) {
        const slides = carouselWrapper.querySelectorAll('.swiper-slide:not(.swiper-slide-duplicate)');
        slides.forEach(slide => {
          // Skip style elements that might be siblings
          if (slide.classList.contains('swiper-slide')) {
            allSlideData.push(extractSlideData(slide));
          }
        });
      }

      // Create or find the grid
      grid = document.getElementById(FILTER_GRID_ID) as HTMLElement | null;
      if (!grid) {
        grid = document.createElement('div');
        grid.id = FILTER_GRID_ID;
        carouselWrapper.parentNode?.insertBefore(grid, carouselWrapper.nextSibling);
      }

      const locSelect = document.getElementById('filter-location') as HTMLSelectElement;
      const parentSelect = document.getElementById('filter-parent-type') as HTMLSelectElement;
      const childSelect = document.getElementById('filter-child-type') as HTMLSelectElement;

      if (!locSelect || !parentSelect || !childSelect) return;

      const updateFilter = () => {
        flashProjectContent(carouselWrapper.parentElement as HTMLElement);
        const locVal = locSelect.value;
        const parentVal = parentSelect.value;
        const childVal = childSelect.value;

        const hasFilter = locVal || parentVal || childVal;

        if (!hasFilter) {
          // No filter — show carousel, hide grid
          carouselWrapper.classList.remove('filter-hidden');
          grid!.classList.remove('active');
          grid!.innerHTML = '';
          return;
        }

        const reqLocationClass = locVal ? LOCATION_MAP[locVal] : null;
        const reqParentClass = parentVal ? PARENT_MAP[parentVal] : null;
        const reqChildClass = childVal || null;

        const filtered = allSlideData.filter(data => {
          let match = true;
          if (reqLocationClass && !data.classNames.includes(reqLocationClass)) match = false;
          if (reqParentClass && !data.classNames.includes(reqParentClass)) match = false;
          if (reqChildClass && !data.classNames.includes(reqChildClass)) match = false;
          return match;
        });

        // Build grid
        grid!.innerHTML = '';
        if (filtered.length === 0) {
          const empty = document.createElement('div');
          empty.className = 'filter-grid-empty';
          empty.textContent = 'No projects found for the selected filters.';
          grid!.appendChild(empty);
        } else {
          filtered.forEach(data => {
            grid!.appendChild(buildGridItem(data));
          });
        }

        // Hide carousel, show grid
        carouselWrapper.classList.add('filter-hidden');
        grid!.classList.add('active');
      };

      const handleLocChange = () => updateFilter();

      const handleParentChange = () => {
        const parentVal = parentSelect.value;
        childSelect.innerHTML = '<option value="">Types</option>';

        if (parentVal && PARENT_TO_CHILD_MAP[parentVal]) {
          PARENT_TO_CHILD_MAP[parentVal].forEach(child => {
            const opt = document.createElement('option');
            opt.value = child.id;
            opt.textContent = child.name;
            childSelect.appendChild(opt);
          });
          childSelect.disabled = false;
        } else {
          childSelect.disabled = true;
        }

        updateFilter();
      };

      const handleChildChange = () => updateFilter();

      locSelect.addEventListener('change', handleLocChange);
      parentSelect.addEventListener('change', handleParentChange);
      childSelect.addEventListener('change', handleChildChange);

      cleanup.push(() => {
        locSelect.removeEventListener('change', handleLocChange);
        parentSelect.removeEventListener('change', handleParentChange);
        childSelect.removeEventListener('change', handleChildChange);
        // Restore carousel if grid was active
        carouselWrapper.classList.remove('filter-hidden');
        if (grid) {
          grid.classList.remove('active');
          grid.innerHTML = '';
        }
        // Reset select states
        if (locSelect) locSelect.value = '';
        if (parentSelect) { parentSelect.value = ''; }
        if (childSelect) { childSelect.innerHTML = '<option value="">Types</option>'; childSelect.disabled = true; }
      });

    };

    const t = setTimeout(init, 300);
    cleanup.push(() => clearTimeout(t));

    return () => {
      cleanup.forEach(fn => fn());
    };
  }, [location.pathname]);
}
