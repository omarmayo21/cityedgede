import { useEffect, useRef } from 'react';
import ContactForm from './ContactForm';

export default function ContactFormModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButton.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="contact-form-modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="contact-form-modal" role="dialog" aria-modal="true" aria-label="Contact us" onMouseDown={event => event.stopPropagation()}>
        <button ref={closeButton} type="button" className="contact-form-modal-close" onClick={onClose} aria-label="Close contact form">×</button>
        <ContactForm />
      </section>
    </div>
  );
}
