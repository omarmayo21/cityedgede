import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Swiper from 'swiper';
import { Autoplay, Navigation, Pagination, EffectFade } from 'swiper/modules';

export function useElementorSliders() {
  const location = useLocation();

  useEffect(() => {
    const cleanups: Array<() => void> = [];

    const initOwlCarousels = () => {
      document.querySelectorAll<HTMLElement>('.owl-carousel').forEach((carousel) => {
        if (carousel.dataset.reactCarouselInitialized === 'true') return;
        const stage = carousel.querySelector<HTMLElement>('.owl-stage');
        const outer = carousel.querySelector<HTMLElement>('.owl-stage-outer');
        if (!stage || !outer) return;

        carousel.dataset.reactCarouselInitialized = 'true';
        let index = 0;
        let timer: number | undefined;
        const getVisibleItems = () => [...stage.querySelectorAll<HTMLElement>(':scope > .owl-item')]
          .filter((item) => item.style.display !== 'none');
        const perView = () => window.innerWidth >= 980 ? 2 : 1;
        const render = () => {
          const items = getVisibleItems();
          const visible = perView();
          const max = Math.max(0, items.length - visible);
          index = Math.min(index, max);
          outer.style.overflow = 'hidden';
          stage.style.display = 'flex';
          stage.style.gap = '50px';
          stage.style.width = '100%';
          stage.style.transition = 'transform 3000ms ease';
          items.forEach((item) => {
            item.style.flex = `0 0 calc((100% - ${(visible - 1) * 50}px) / ${visible})`;
            item.style.width = '';
            item.style.marginRight = '0';
          });
          stage.style.transform = `translate3d(-${index * ((outer.clientWidth + 50) / visible)}px, 0, 0)`;
          carousel.querySelectorAll('.owl-dot').forEach((dot, dotIndex) => dot.classList.toggle('active', dotIndex === index));
          const prev = carousel.querySelector<HTMLButtonElement>('.owl-prev');
          const next = carousel.querySelector<HTMLButtonElement>('.owl-next');
          prev?.classList.toggle('disabled', index === 0);
          next?.classList.toggle('disabled', index === max);
        };
        const move = (direction: number) => {
          const max = Math.max(0, getVisibleItems().length - perView());
          index = direction > 0 ? (index >= max ? 0 : index + 1) : (index <= 0 ? max : index - 1);
          render();
        };
        const prev = carousel.querySelector<HTMLButtonElement>('.owl-prev');
        const next = carousel.querySelector<HTMLButtonElement>('.owl-next');
        const onPrev = () => move(-1);
        const onNext = () => move(1);
        const onResize = () => render();
        const onUpdate = () => { index = 0; render(); };
        prev?.addEventListener('click', onPrev);
        next?.addEventListener('click', onNext);
        carousel.querySelectorAll<HTMLButtonElement>('.owl-dot').forEach((dot, dotIndex) => dot.addEventListener('click', () => { index = dotIndex; render(); }));
        window.addEventListener('resize', onResize);
        carousel.addEventListener('cityedge:carousel-update', onUpdate);
        timer = window.setInterval(() => move(1), 4000);
        render();
        cleanups.push(() => {
          if (timer) window.clearInterval(timer);
          prev?.removeEventListener('click', onPrev);
          next?.removeEventListener('click', onNext);
          window.removeEventListener('resize', onResize);
          carousel.removeEventListener('cityedge:carousel-update', onUpdate);
          delete carousel.dataset.reactCarouselInitialized;
        });
      });
    };

    const initSliders = () => {
      const swipers = document.querySelectorAll('.swiper, .swiper-container');
      
      swipers.forEach((container) => {
        if ((container as any).swiper) return;

        container.classList.remove('swiper-initialized');
        
        const duplicates = container.querySelectorAll('.swiper-slide-duplicate');
        duplicates.forEach(dup => dup.remove());

        const widgetContainer = container.closest('[data-settings]');
        let settings: any = {};
        if (widgetContainer) {
            try {
                settings = JSON.parse(widgetContainer.getAttribute('data-settings') || '{}');
            } catch (e) {}
        }

        const getSpacing = (customObj: any, fallback: number) => {
            if (customObj && customObj.size !== undefined && customObj.size !== "") return parseInt(customObj.size);
            return fallback;
        };

        const defaultSpacing = getSpacing(settings.image_spacing_custom, parseInt(settings.spaceBetween) || 15);
        const tabletSpacing = getSpacing(settings.image_spacing_custom_tablet, defaultSpacing);
        const mobileSpacing = getSpacing(settings.image_spacing_custom_mobile, defaultSpacing);

        const config: any = {
            modules: [Autoplay, Navigation, Pagination, EffectFade],
            loop: settings.infinite === 'yes',
            speed: parseInt(settings.speed) || 500,
            
            // Mobile First (Base)
            slidesPerView: parseInt(settings.slides_to_show_mobile) || parseInt(settings.slides_to_show) || 1,
            slidesPerGroup: parseInt(settings.slides_to_scroll_mobile) || parseInt(settings.slides_to_scroll) || 1,
            spaceBetween: mobileSpacing,
            
            breakpoints: {
                768: {
                    slidesPerView: parseInt(settings.slides_to_show_tablet) || parseInt(settings.slides_to_show) || 1,
                    slidesPerGroup: parseInt(settings.slides_to_scroll_tablet) || parseInt(settings.slides_to_scroll) || 1,
                    spaceBetween: tabletSpacing,
                },
                1024: {
                    slidesPerView: parseInt(settings.slides_to_show) || 1,
                    slidesPerGroup: parseInt(settings.slides_to_scroll) || 1,
                    spaceBetween: defaultSpacing,
                }
            }
        };

        if (settings.autoplay === 'yes') {
            config.autoplay = {
                delay: parseInt(settings.autoplay_speed) || 5000,
                disableOnInteraction: settings.pause_on_interaction === 'yes',
                pauseOnMouseEnter: settings.pause_on_hover === 'yes'
            };
        }

        // Fix: Navigation arrows can be siblings in parent
        const nextButton = container.parentElement?.querySelector('.elementor-swiper-button-next, .swiper-button-next, .swiper-button-next-pro') || container.querySelector('.elementor-swiper-button-next, .swiper-button-next, .swiper-button-next-pro');
        const prevButton = container.parentElement?.querySelector('.elementor-swiper-button-prev, .swiper-button-prev, .swiper-button-prev-pro') || container.querySelector('.elementor-swiper-button-prev, .swiper-button-prev, .swiper-button-prev-pro');
        if (settings.arrows === 'yes' || nextButton || prevButton) {
            config.navigation = {
                nextEl: nextButton as HTMLElement,
                prevEl: prevButton as HTMLElement,
            };
        }

        const pagination = container.parentElement?.querySelector('.swiper-pagination') || container.querySelector('.swiper-pagination');
        if ((settings.pagination && settings.pagination !== 'none') || pagination) {
            config.pagination = {
                el: pagination as HTMLElement,
                type: settings.pagination === 'fraction' ? 'fraction' : 'bullets',
                clickable: true
            };
        }

        if (settings.effect) {
            config.effect = settings.effect;
        }

        // These configurations are present in the scraped project-page scripts.
        // React renders the script markup but does not execute those script tags.
        if (container.classList.contains('gallery-carousel')) {
          Object.assign(config, { loop: true, slidesPerView: 1, centeredSlides: true, spaceBetween: 10, autoplay: { delay: 5000 }, breakpoints: { 768: { slidesPerView: 2, centeredSlides: false, spaceBetween: 20 }, 1024: { slidesPerView: 3, centeredSlides: false, spaceBetween: 30 } } });
        } else if (container.classList.contains('process-gallery-swiper')) {
          Object.assign(config, { loop: true, slidesPerView: 1, spaceBetween: 10, breakpoints: { 768: { slidesPerView: 2, spaceBetween: 15 }, 1024: { slidesPerView: 3, spaceBetween: 20 } } });
        }

        new Swiper(container as HTMLElement, config);
      });
      initOwlCarousels();
    };

    const timer = setTimeout(initSliders, 100);
    return () => {
      clearTimeout(timer);
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [location.pathname]);
}
