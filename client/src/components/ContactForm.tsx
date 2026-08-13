import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { codes as callingCodes, type ICountryCodeItem } from 'country-calling-code';

const DESTINATIONS = [
  "New Cairo City", 
  "New Alamein City", 
  "New Capital City",
  "Sheikh Zayed City", 
  "New Mansoura City", 
  "Maspero Triangle"
];
const COUNTRIES = (callingCodes as readonly ICountryCodeItem[]).map(({ country, countryCodes, isoCode2 }) => ({
  name: country, code: `+${countryCodes[0]}`,
  flag: String.fromCodePoint(...isoCode2.split('').map(letter => 127397 + letter.charCodeAt(0))),
}));

const PROJECTS_BY_DESTINATION: Record<string, string[]> = {
  "New Capital City": [
    "Almaqsad Villas", "AlMaqsad Residences", "Mamsha Almaqsad", "Arjan", 
    "Mamsha Views", "Mamsha District", "Mamsha Avenue", "Garden City Heights", 
    "AlMaqsad Park", "Centria", "Verandas", "Jade Park", "V40", "V40 District"
  ],
  "New Alamein City": [
    "Beachfront Towers", "Downtown", "Downtown Commercial", "Latin City",
    "Mazarine Apartments", "Mazarine Boulevard", "Mazarine Hub", "Mazarine Islands",
    "Mazarine Ria Chalets", "Mazarine Ria Villas", "Mazarine The Chalets", 
    "Mazarine Townhouses", "Mazarine Villas", "North Edge", "North Edge Cabanas",
    "North Square Mall", "The Gate Towers"
  ],
  "Sheikh Zayed City": ["Etapa", "Etapa Square"],
  "New Mansoura City": ["Zahya"],
  "Maspero Triangle": [
    "Maspero Nile Heights", "Maspero Business Towers", "Maspero Mall", "Maspero Metropolis"
  ],
  "New Cairo City": [
    "Capital Residence", "Lush Valley", "Riseville", "Mamsha - D2", "Mamsha Central", "Mamsha Gardens", "Mamsha Vista", "Marjan"
  ]
};

export default function ContactForm({ onSuccess }: { onSuccess?: () => void }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    inquiryType: '',
    country: 'Egypt',
    destination: '',
    project: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVisible] = useState(true);
  const [countryOpen, setCountryOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const selectedCountry = COUNTRIES.find(country => country.name === formData.country) ?? COUNTRIES[0];
  const filteredCountries = useMemo(() => {
    const query = countrySearch.trim().toLowerCase();
    return query ? COUNTRIES.filter(country => country.name.toLowerCase().includes(query) || country.code.includes(query)) : COUNTRIES;
  }, [countrySearch]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const payload = {
        ...formData,
        sourcePage: window.location.href,
      };

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok && res.status !== 404) throw new Error('Submission failed');

      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', message: '', inquiryType: '', country: 'Egypt', destination: '', project: '' });
      onSuccess?.();
      navigate('/success', { state: { fromFormSubmission: true } });
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className="contact-form-outer"
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        padding: '40px 20px',
        boxSizing: 'border-box',
        fontFamily: '"AeonikTRIAL", "Roboto", sans-serif',
      }}
    >
      {/* The card — position relative so the X stays anchored to it */}
      <div
        className="contact-form-card"
        style={{
          position: 'relative',
          backgroundColor: '#fff',
          padding: '50px 60px 50px 60px',
          boxShadow: '0px 0px 40px 0px rgba(0,0,0,0.12)',
          width: '100%',
          maxWidth: '900px',
          boxSizing: 'border-box',
        }}
      >
        {/* Heading */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <h2
            style={{
              color: '#A68543',
              fontSize: '32px',
              fontWeight: '400',
              margin: '0 0 6px 0',
              fontFamily: '"AeonikTRIAL", sans-serif',
              letterSpacing: '0.01em',
            }}
          >
            Contact Us
          </h2>
          <p style={{ color: '#333', fontSize: '16px', margin: 0 }}>
            and let's stay in Touch
          </p>
        </div>

        {success && (
          <div style={{ backgroundColor: '#f0fdf4', color: '#166534', padding: '15px', marginBottom: '20px', border: '1px solid #bbf7d0' }}>
            Thank you for your message. It has been sent.
          </div>
        )}
        
        {error && (
          <div style={{ backgroundColor: '#fef2f2', color: '#991b1b', padding: '15px', marginBottom: '20px', border: '1px solid #fecaca' }}>
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '24px 40px',
          }}
        >
          {/* Full Name */}
          <div style={{ gridColumn: '1 / 2' }}>
            <input
              type="text"
              required
              placeholder="Full Name"
              style={fieldStyle}
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>

          {/* Email */}
          <div style={{ gridColumn: '2 / 3' }}>
            <input
              type="email"
              required
              placeholder="Email"
              style={fieldStyle}
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>

          {/* Phone */}
          <div style={{ gridColumn: '1 / 2', display: 'flex', borderBottom: '1px solid #A68543' }}>
            <div className="phone-country-prefix" style={{ display: 'flex', alignItems: 'center', paddingRight: '10px', borderRight: '1px solid #ddd', flexShrink: 0 }}>
              <button type="button" className="phone-country-selector" aria-label="Select country and dialing code" aria-expanded={countryOpen} onClick={() => setCountryOpen(open => !open)}>
                <span>{selectedCountry.flag} {selectedCountry.code}</span>
                <span className="phone-country-chevron" aria-hidden="true">⌄</span>
              </button>
              {countryOpen && <div className="phone-country-dropdown">
                <input autoFocus type="search" value={countrySearch} onChange={event => setCountrySearch(event.target.value)} placeholder="Search country" aria-label="Search country" />
                <div className="phone-country-options">
                  {filteredCountries.map(country => <button type="button" key={country.name} onClick={() => { setFormData({ ...formData, country: country.name }); setCountrySearch(''); setCountryOpen(false); }}>{country.flag} <span>{country.name}</span> <small>{country.code}</small></button>)}
                </div>
              </div>}
              <span style={{ fontSize: '18px', marginRight: '4px' }}>🇪🇬</span>
              <span style={{ fontSize: '14px', color: '#666', whiteSpace: 'nowrap' }}>+20</span>
            </div>
            <input
              type="tel"
              required
              placeholder="Phone Number"
              style={{ ...fieldStyle, borderBottom: 'none', paddingLeft: '10px' }}
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
            />
          </div>

          {/* Inquiry Type */}
          <div style={{ gridColumn: '2 / 3' }}>
            <select
              style={{ ...fieldStyle, appearance: 'none', color: formData.inquiryType ? '#000' : '#757575' }}
              value={formData.inquiryType}
              onChange={e => setFormData({...formData, inquiryType: e.target.value})}
            >
              <option value="" disabled>Inquiry type</option>
              <option value="General Inquiries">General Inquiries</option>
              <option value="Owners Inquiries">Owners Inquiries</option>
            </select>
          </div>

          {/* Destination */}
          <div style={{ gridColumn: '1 / 2' }}>
            <select
              style={{ ...fieldStyle, appearance: 'none', color: formData.destination ? '#000' : '#757575' }}
              value={formData.destination}
              onChange={e => setFormData({...formData, destination: e.target.value, project: ''})}
            >
              <option value="" disabled>Destination</option>
              {DESTINATIONS.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Project */}
          <div style={{ gridColumn: '2 / 3' }}>
            <select
              style={{ ...fieldStyle, appearance: 'none', color: formData.project ? '#000' : '#757575' }}
              value={formData.project}
              onChange={e => setFormData({...formData, project: e.target.value})}
              disabled={!formData.destination}
            >
              <option value="" disabled>Project</option>
              {formData.destination && PROJECTS_BY_DESTINATION[formData.destination]?.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Message — full width */}
          <div style={{ gridColumn: '1 / 3' }}>
            <textarea
              rows={3}
              placeholder="Message"
              style={{ ...fieldStyle, resize: 'vertical' }}
              value={formData.message}
              onChange={e => setFormData({...formData, message: e.target.value})}
            />
          </div>

          {/* Submit — full width */}
          <div style={{ gridColumn: '1 / 3' }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                backgroundColor: '#A68543',
                color: '#fff',
                border: 'none',
                padding: '16px 0',
                fontSize: '15px',
                fontWeight: '400',
                cursor: loading ? 'default' : 'pointer',
                opacity: loading ? 0.7 : 1,
                fontFamily: '"AeonikTRIAL", sans-serif',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                transition: 'background-color 0.2s',
              }}
            >
              {loading ? 'SENDING...' : 'SEND MESSAGE'}
            </button>
          </div>
        </form>
      </div>

      {/* Responsive overrides */}
      <style>{`
        @media (max-width: 768px) {
          .contact-form-card {
            padding: 40px 24px 40px 24px !important;
          }
          .contact-form-card form {
            grid-template-columns: 1fr !important;
          }
          .contact-form-card form > div {
            grid-column: 1 / 2 !important;
          }
        }
      `}</style>
    </div>
  );
}

const fieldStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 0',
  border: 'none',
  borderBottom: '1px solid #A68543',
  outline: 'none',
  fontSize: '15px',
  backgroundColor: 'transparent',
  fontFamily: '"AeonikTRIAL", sans-serif',
  boxSizing: 'border-box',
};
