import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { colors, fonts } from '../styles/theme';
import { contacts } from '../data/siteData';
import { useLang } from '../context/LanguageContext';
import { translations } from '../data/translations';
import SectionHeader from './SectionHeader';
import { FaLine } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';

const ICONS = [FaLine, MdEmail];
const CARD_COLORS = ['#00B900', '#f0c878'];
const EMAIL = 'Tnp.jaruji@gmail.com';

const SUBJECT = encodeURIComponent('ติดต่องาน — Tee Jaruji');

const GMAIL_APP = `googlegmail://co?to=${EMAIL}&subject=${SUBJECT}`;
const GMAIL_WEB = `https://mail.google.com/mail/?view=cm&fs=1&to=${EMAIL}&su=${SUBJECT}`;

function openGmail() {
  window.location.href = GMAIL_APP;
  setTimeout(() => {
    if (!document.hidden) window.open(GMAIL_WEB, '_blank');
  }, 600);
}

const EMAIL_CLIENTS = [
  {
    label: 'Gmail',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M2 6l10 7L22 6" stroke="#EA4335" strokeWidth="2" strokeLinecap="round"/>
        <rect x="2" y="4" width="20" height="16" rx="2" stroke="#4285F4" strokeWidth="1.5" fill="none"/>
        <path d="M2 4l10 9 10-9" fill="#EA4335" opacity="0.15"/>
      </svg>
    ),
    color: '#EA4335',
    handleClick: openGmail,
  },
  {
    label: 'Outlook',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="3" width="13" height="18" rx="2" fill="#0072C6"/>
        <rect x="9" y="7" width="13" height="13" rx="2" fill="#28A8E8"/>
        <circle cx="8.5" cy="13" r="3" fill="white"/>
      </svg>
    ),
    color: '#0072C6',
    url: `ms-outlook://compose?to=${EMAIL}&subject=${SUBJECT}`,
    newTab: false,
  },
  {
    label: 'Mail App',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="4" width="20" height="16" rx="3" fill="#555"/>
        <path d="M2 7l10 7 10-7" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    color: '#555555',
    url: `mailto:${EMAIL}?subject=${SUBJECT}`,
    newTab: false,
  },
  {
    label: 'คัดลอก Email',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="8" y="2" width="13" height="16" rx="2" stroke="#6c757d" strokeWidth="1.5" fill="none"/>
        <rect x="3" y="6" width="13" height="16" rx="2" fill="#e9ecef" stroke="#6c757d" strokeWidth="1.5"/>
      </svg>
    ),
    color: '#6c757d',
    handleClick: () => navigator.clipboard.writeText(EMAIL),
  },
];

function EmailPicker({ onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    function handleKey(e) { if (e.key === 'Escape') onClose(); }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return createPortal(
    <>
      <style>{`
        @keyframes epBgIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes epIn {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.88); }
          to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
      `}</style>
      <div
        onClick={onClose}
        onTouchEnd={e => { e.preventDefault(); onClose(); }}
        style={{
          position: 'fixed', inset: 0, zIndex: 9998,
          background: 'rgba(0,0,0,0.3)',
          backdropFilter: 'blur(3px)',
          animation: 'epBgIn 0.2s ease',
          cursor: 'pointer',
        }}
      />
      <div ref={ref} style={{
        position: 'fixed',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        background: colors.cream,
        border: `1px solid ${colors.creamDark}`,
        borderRadius: '18px',
        boxShadow: '0 24px 60px rgba(0,0,0,0.25)',
        padding: '0.75rem',
        zIndex: 9999,
        minWidth: '240px',
        animation: 'epIn 0.25s cubic-bezier(0.34,1.2,0.64,1)',
      }}>
        <div style={{
          fontFamily: fonts.mono,
          fontSize: '0.58rem',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: colors.inkSoft,
          padding: '0.3rem 0.5rem 0.6rem',
        }}>
          เปิดด้วย
        </div>
        {EMAIL_CLIENTS.map((client) => (
          <a
            key={client.label}
            href={client.url || '#'}
            target={client.newTab ? '_blank' : '_self'}
            rel={client.newTab ? 'noopener noreferrer' : undefined}
            onClick={e => {
              if (client.handleClick) { e.preventDefault(); client.handleClick(); }
              onClose();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.6rem 0.75rem',
              borderRadius: '10px',
              textDecoration: 'none',
              color: colors.ink,
              fontFamily: fonts.body,
              fontSize: '0.92rem',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = colors.creamDark}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            {client.icon}
            <span>{client.label}</span>
            <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: colors.inkSoft }}>↗</span>
          </a>
        ))}
      </div>
    </>,
    document.body
  );
}

export default function Contact() {
  const { lang } = useLang();
  const t = translations[lang].contact;
  const [showPicker, setShowPicker] = useState(false);
  const closedAt = useRef(0);
  const handleClose = () => { closedAt.current = Date.now(); setShowPicker(false); };
  const handleToggle = () => { if (Date.now() - closedAt.current < 200) return; setShowPicker(p => !p); };

  return (
    <>
      <style>{`
        .contact-card-tj {
          position: relative;
          overflow: visible;
          display: flex;
          flex-direction: column;
          text-decoration: none;
          color: ${colors.ink};
          border-radius: 20px;
          transition: transform 0.35s cubic-bezier(0.4,0,0.2,1), box-shadow 0.35s;
        }
        .contact-card-tj:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.12);
        }
        .contact-card-tj .cc-inner {
          border-radius: 20px;
          overflow: hidden;
          position: relative;
        }
        .contact-card-tj .cc-fill {
          position: absolute;
          inset: 0;
          opacity: 0;
          transition: opacity 0.35s ease;
          border-radius: 20px;
          pointer-events: none;
        }
        .contact-card-tj:hover .cc-fill { opacity: 1; }
        .contact-card-tj .cc-icon-wrap {
          transition: transform 0.35s cubic-bezier(0.4,0,0.2,1);
        }
        .contact-card-tj:hover .cc-icon-wrap { transform: scale(1.12) rotate(-6deg); }
        .contact-card-tj .cc-label,
        .contact-card-tj .cc-value,
        .contact-card-tj .cc-action { transition: color 0.35s; position: relative; z-index: 1; }
        .contact-card-tj:hover .cc-label { color: rgba(255,255,255,0.75) !important; }
        .contact-card-tj:hover .cc-value { color: #fff !important; }
        .contact-card-tj:hover .cc-action { color: #fff !important; border-color: rgba(255,255,255,0.3) !important; }

        @media (max-width: 968px) {
          .contact-cards-tj { grid-template-columns: 1fr !important; }
          .contact-section-tj { padding: 5rem 1.5rem !important; }
        }
      `}</style>

      <section
        id="contact"
        className="contact-section-tj"
        style={{ padding: '8rem 3rem', position: 'relative', zIndex: 2, background: colors.cream }}
      >
        <SectionHeader num={t.sectionNum} title={t.sectionTitle} italic={t.sectionItalic} />

        <div className="contact-cards-tj" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1.5rem',
          maxWidth: '800px',
        }}>
          {t.items.map((c, i) => {
            const Icon = ICONS[i];
            const cardColor = CARD_COLORS[i];
            const isEmail = i === 1;

            const cardInner = (
              <div className="cc-inner" style={{ background: colors.creamDark, padding: '3rem 2.5rem 2.5rem', boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}>
                <div className="cc-fill" style={{ background: cardColor }} />
                <div className="cc-icon-wrap" style={{ position: 'relative', zIndex: 1, marginBottom: '2.5rem' }}>
                  <div style={{
                    width: '60px', height: '60px', borderRadius: '14px',
                    background: cardColor, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '1.6rem', color: '#fff',
                  }}>
                    <Icon />
                  </div>
                </div>
                <div className="cc-label" style={{
                  fontFamily: fonts.mono, fontSize: '0.8rem', letterSpacing: '0.3em',
                  textTransform: 'uppercase', color: colors.inkSoft, marginBottom: '0.6rem',
                }}>
                  {c.label}
                </div>
                <div className="cc-value" style={{
                  fontFamily: fonts.display, fontSize: '1.35rem', fontWeight: 500,
                  color: colors.ink, lineHeight: 1.2, flex: 1, paddingBottom: '2rem', wordBreak: 'break-all',
                }}>
                  {c.value}
                </div>
                <div className="cc-action" style={{
                  fontFamily: fonts.mono, fontSize: '0.8rem', letterSpacing: '0.2em',
                  textTransform: 'uppercase', color: colors.inkSoft,
                  borderTop: `1px solid ${colors.creamDark}`, paddingTop: '1.25rem',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  {c.action}
                  <span style={{ fontSize: '1rem' }}>↗</span>
                </div>
              </div>
            );

            if (isEmail) {
              return (
                <div
                  key={i}
                  className="contact-card-tj"
                  style={{ cursor: 'pointer' }}
                  onClick={handleToggle}
                >
                  {cardInner}
                  {showPicker && <EmailPicker onClose={handleClose} />}
                </div>
              );
            }

            return (
              <a
                key={i}
                href={contacts[i].href}
                target={contacts[i].href.startsWith('http') ? '_blank' : undefined}
                rel={contacts[i].href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="contact-card-tj"
                style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}
              >
                {cardInner}
              </a>
            );
          })}
        </div>
      </section>
    </>
  );
}
