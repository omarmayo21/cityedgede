import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const TRANSITION_EVENT = 'cityedge:page-transition';
let transitionTimer: ReturnType<typeof setTimeout> | null = null;

/**
 * The original site briefly washes to white while it swaps page/filter content.
 * This is deliberately separate from the old preloader so `body.complete` keeps
 * doing its job and no route can become permanently hidden.
 */
export function triggerPageTransition() {
  document.documentElement.classList.add('cityedge-is-transitioning');
  if (transitionTimer) clearTimeout(transitionTimer);
  transitionTimer = setTimeout(() => {
    document.documentElement.classList.remove('cityedge-is-transitioning');
    transitionTimer = null;
  }, 280);
  window.dispatchEvent(new Event(TRANSITION_EVENT));
}

/**
 * Marks a destination-tab navigation so the destination page can flash only
 * its project area once it has mounted.  Keeping this state on the document
 * avoids coupling the tab markup to a particular location-page component.
 */
export function markDestinationContentTransition() {
  document.documentElement.dataset.cityedgeDestinationTransition = 'true';
}

export function consumeDestinationContentTransition() {
  const shouldFlash = document.documentElement.dataset.cityedgeDestinationTransition === 'true';
  delete document.documentElement.dataset.cityedgeDestinationTransition;
  return shouldFlash;
}

export default function PageTransition() {
  const location = useLocation();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initialPath = useRef(location.key);

  const play = () => {
    document.documentElement.classList.add('cityedge-is-transitioning');
    if (hideTimer.current) clearTimeout(hideTimer.current);
    setVisible(true);
    hideTimer.current = setTimeout(() => {
      document.documentElement.classList.remove('cityedge-is-transitioning');
      setVisible(false);
    }, 280);
  };

  useEffect(() => {
    const onTransition = () => play();
    window.addEventListener(TRANSITION_EVENT, onTransition);
    return () => {
      window.removeEventListener(TRANSITION_EVENT, onTransition);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);

  // Scraped Elementor content uses ordinary anchors. Keep those links in the
  // React router so project-to-project and project-to-location clicks retain
  // the short transition instead of performing a document reload.
  useEffect(() => {
    const onDocumentClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as HTMLElement | null)?.closest('a[href]') as HTMLAnchorElement | null;
      if (!anchor || anchor.target || anchor.hasAttribute('download')) return;
      // Destination tabs replace a location's project content.  Do not cover
      // the header or hero with the route transition; useLocationFilter plays
      // a local flash on the new page's project container instead.
      if (anchor.closest('.destination-tabs')) {
        markDestinationContentTransition();
        return;
      }
      // Project unit links are handled by their existing filter hook below this
      // capture listener; only provide the visual wash here.
      if (anchor.classList.contains('filter-link')) {
        play();
        return;
      }

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin || url.hash || !/^\/(?:project|location|about-us|virtual-tour|ar)(?:\/|$)/.test(url.pathname)) return;

      let pathname = url.pathname.replace(/\/$/, '');
      pathname = pathname.replace(/^\/location\/(.+)-en$/, '/location/$1');
      if (!pathname || pathname === location.pathname) return;

      event.preventDefault();
      play();
      navigate(`${pathname}${url.search}`);
    };

    document.addEventListener('click', onDocumentClick, true);
    return () => document.removeEventListener('click', onDocumentClick, true);
  }, [location.pathname, navigate]);

  // Covers Link navigation plus browser back/forward without touching routing.
  useEffect(() => {
    if (initialPath.current === location.key) return;
    play();
  }, [location.key]);

  return <div className={`cityedge-page-transition${visible ? ' is-visible' : ''}`} aria-hidden="true" />;
}
