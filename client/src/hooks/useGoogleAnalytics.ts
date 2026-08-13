import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

export const useGoogleAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
    const adsId = import.meta.env.VITE_GOOGLE_ADS_ID;
    
    // We need at least one tracking ID to load gtag
    if (!measurementId && !adsId) return;

    if (!window.gtag) {
      const script = document.createElement('script');
      script.id = 'ga-script';
      // Load gtag using either GA4 ID or Google Ads ID
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId || adsId}`;
      script.async = true;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag() {
        // eslint-disable-next-line prefer-rest-params
        window.dataLayer.push(arguments);
      };
      
      window.gtag('js', new Date());
    }

    // Configure GA4
    if (measurementId) {
      window.gtag('config', measurementId, {
        page_path: location.pathname + location.search,
      });
    }

    // Configure Google Ads Base Tag
    if (adsId) {
      window.gtag('config', adsId);
    }
  }, [location.pathname, location.search]);
};
