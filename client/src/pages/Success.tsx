import { useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Success() {
  const location = useLocation();
  const navigate = useNavigate();
  const hasFired = useRef(false);

  useEffect(() => {
    // Only fire conversion if we arrived via a successful form submission
    if (location.state?.fromFormSubmission && !hasFired.current) {
      hasFired.current = true;
      
      if (window.gtag) {
        const adsId = import.meta.env.VITE_GOOGLE_ADS_CONVERSION_ID || import.meta.env.VITE_GOOGLE_ADS_ID;
        const adsLabel = import.meta.env.VITE_GOOGLE_ADS_CONVERSION_LABEL;
        if (adsId && adsLabel) {
          const formattedId = adsId.startsWith('AW-') ? adsId : `AW-${adsId}`;
          window.gtag('event', 'conversion', {
            'send_to': `${formattedId}/${adsLabel}`
          });
        }
      }

      // Clear the state so a page refresh doesn't trigger a duplicate conversion
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);
  return (
    <main id="content" className="site-main" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', padding: '2rem', textAlign: 'center', fontFamily: '"AeonikTRIAL", "Roboto", sans-serif', backgroundColor: '#f9f9f9' }}>
      <div style={{ maxWidth: '600px', backgroundColor: '#fff', padding: '3rem', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
        <svg style={{ width: '80px', height: '80px', color: '#1B3160', margin: '0 auto 1.5rem auto' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h1 style={{ color: '#1B3160', fontSize: '2rem', fontWeight: 600, marginBottom: '1rem' }}>Thank You!</h1>
        <p style={{ color: '#666', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '2rem' }}>
          Your message has been successfully sent. A member of our team will get back to you shortly.
        </p>
        <Link to="/" style={{ display: 'inline-block', backgroundColor: '#1B3160', color: '#fff', padding: '12px 30px', borderRadius: '4px', textDecoration: 'none', fontWeight: 500, transition: 'background-color 0.2s' }}>
          Back to Home
        </Link>
      </div>
    </main>
  );
}
