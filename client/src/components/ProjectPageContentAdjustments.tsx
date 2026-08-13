import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import ContactForm from './ContactForm';

/**
 * The scraped project pages are individual static JSX documents, but they all
 * expose the same hero followed by an initial project-content section. This
 * component keeps the shared contact form immediately after that first section
 * for every project route.
 */
export default function ProjectPageContentAdjustments({ pathname }: { pathname: string }) {
  const [contactHost, setContactHost] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!pathname.startsWith('/project/')) {
      setContactHost(null);
      return;
    }

    let active = true;
    let host: HTMLElement | null = null;

    const placeContactForm = () => {
      const projectPage = document.querySelector<HTMLElement>('.project-page');
      const hero = projectPage?.querySelector<HTMLElement>(':scope > #hero-section');
      const firstProjectSection = hero?.nextElementSibling as HTMLElement | null;
      if (!projectPage || !hero || !firstProjectSection) return;

      host = projectPage.querySelector<HTMLElement>(':scope > .project-contact-form-slot');
      if (!host) {
        host = document.createElement('div');
        host.className = 'project-contact-form-slot';
        firstProjectSection.insertAdjacentElement('afterend', host);
      }

      if (active) setContactHost(host);
    };

    placeContactForm();
    const observer = new MutationObserver(placeContactForm);
    observer.observe(document.getElementById('root') ?? document.body, { childList: true, subtree: true });

    return () => {
      active = false;
      observer.disconnect();
      setContactHost(null);
    };
  }, [pathname]);

  return contactHost ? createPortal(<ContactForm />, contactHost) : null;
}
