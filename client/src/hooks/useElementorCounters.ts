import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useElementorCounters() {
  const location = useLocation();

  useEffect(() => {
    const initCounters = () => {
      const counters = document.querySelectorAll('.elementor-counter-number');
      if (counters.length === 0) return;

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            // Prevent re-running if already animated
            if (el.dataset.animated === 'true') return;
            el.dataset.animated = 'true';

            const toValueStr = el.getAttribute('data-to-value') || el.innerText;
            const fromValue = parseFloat(el.getAttribute('data-from-value') || '0');
            const toValue = parseFloat(toValueStr.replace(/,/g, ''));
            const duration = parseInt(el.getAttribute('data-duration') || '2000');
            const delimiter = el.getAttribute('data-delimiter') || ',';

            if (isNaN(toValue)) return;

            const startTime = performance.now();
            
            const updateCounter = (currentTime: number) => {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              
              // Easing function (easeOutQuad)
              const easeOut = progress * (2 - progress);
              const currentVal = fromValue + (toValue - fromValue) * easeOut;
              
              const isInteger = toValueStr.indexOf('.') === -1;
              let displayVal = isInteger ? Math.round(currentVal).toString() : currentVal.toFixed(1);

              // Add delimiter
              if (delimiter) {
                displayVal = displayVal.replace(/\B(?=(\d{3})+(?!\d))/g, delimiter);
              }

              el.innerText = displayVal;

              if (progress < 1) {
                requestAnimationFrame(updateCounter);
              } else {
                // Ensure exact final value
                let finalStr = toValue.toString();
                if (delimiter) finalStr = finalStr.replace(/\B(?=(\d{3})+(?!\d))/g, delimiter);
                el.innerText = finalStr;
              }
            };

            requestAnimationFrame(updateCounter);
            // Optionally stop observing once animated
            observer.unobserve(el);
          }
        });
      }, { rootMargin: '0px 0px -50px 0px', threshold: 0 });

      counters.forEach(counter => observer.observe(counter));
    };

    const timer = setTimeout(initCounters, 100);
    return () => clearTimeout(timer);
  }, [location.pathname]);
}
