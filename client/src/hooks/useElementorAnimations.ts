import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useElementorAnimations() {
  const location = useLocation();

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLElement;
          
          let animationName = target.getAttribute('data-custom-animation');
          
          // If no custom attribute, try to parse data-settings (Elementor default behavior)
          if (!animationName && target.hasAttribute('data-settings')) {
            try {
              const settings = JSON.parse(target.getAttribute('data-settings') || '{}');
              animationName = settings.animation || settings._animation || null;
            } catch (e) {
              // ignore parse errors
            }
          }
          
          if (animationName) {
            // Remove the invisible class
            target.classList.remove('elementor-invisible');
            
            // Add the animation classes
            target.classList.add('animated', animationName);
            
            // Stop observing once animated
            observer.unobserve(target);
          } else {
            // If we couldn't find an animation, just make it visible anyway
            target.classList.remove('elementor-invisible');
            observer.unobserve(target);
          }
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -50px 0px', // Trigger slightly before it comes fully into view, but not -100px which caused bugs
      threshold: 0
    });

    const observeAnimations = (root: ParentNode = document) => {
      root.querySelectorAll('.elementor-invisible').forEach((element) => observer.observe(element));
    };

    // Lazy route modules mount after this parent effect during SPA navigation.
    // Observe both the initial tree and subsequently mounted Elementor content.
    observeAnimations();
    const mutations = new MutationObserver((records) => {
      records.forEach((record) => record.addedNodes.forEach((node) => {
        if (!(node instanceof HTMLElement)) return;
        if (node.matches('.elementor-invisible')) observer.observe(node);
        observeAnimations(node);
      }));
    });
    const root = document.getElementById('root');
    if (root) mutations.observe(root, { childList: true, subtree: true });

    return () => {
      mutations.disconnect();
      observer.disconnect();
    };
  }, [location.pathname]); // Re-run when route changes
}
