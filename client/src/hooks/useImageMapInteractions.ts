import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Restores the Image Map Pro hover/focus state that WordPress initialized. */
export function useImageMapInteractions() {
  const location = useLocation();

  useEffect(() => {
    if (!location.pathname.startsWith('/location/')) return;

    const cleanups: Array<() => void> = [];
    const bindObjects = () => document.querySelectorAll<HTMLElement>('[id^="image-map-pro-"] .imp-object:not([data-react-map-bound])').forEach((object) => {
      object.dataset.reactMapBound = 'true';
      if (!object.hasAttribute('tabindex')) object.tabIndex = 0;
      const activate = () => object.classList.add('imp-object-highlighted');
      const deactivate = () => object.classList.remove('imp-object-highlighted');
      object.addEventListener('mouseenter', activate);
      object.addEventListener('mouseleave', deactivate);
      object.addEventListener('focus', activate);
      object.addEventListener('blur', deactivate);
      cleanups.push(() => {
        delete object.dataset.reactMapBound;
        object.removeEventListener('mouseenter', activate);
        object.removeEventListener('mouseleave', deactivate);
        object.removeEventListener('focus', activate);
        object.removeEventListener('blur', deactivate);
      });
    });

    bindObjects();
    const observer = new MutationObserver(bindObjects);
    observer.observe(document.getElementById('root') ?? document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [location.pathname]);
}
