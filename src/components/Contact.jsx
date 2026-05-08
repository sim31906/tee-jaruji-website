import { colors, fonts } from '../styles/theme';
import { contacts } from '../data/siteData';
import { useLang } from '../context/LanguageContext';
import { translations } from '../data/translations';
import SectionHeader from './SectionHeader';
import { FaLine } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';

const ICONS = [FaLine, MdEmail];
const CARD_COLORS = ['#00B900', '#f0c878'];

export default function Contact() {
  const { lang } = useLang();
  const t = translations[lang].contact;

  return (
    <>
      <style>{`
        .contact-card-tj {
          position: relative;
          overflow: hidden;
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
            return (
              <a
                key={i}
                href={contacts[i].href}
                target={contacts[i].href.startsWith('http') ? '_blank' : undefined}
                rel={contacts[i].href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="contact-card-tj"
                style={{
                  background: colors.creamDark,
                  padding: '3rem 2.5rem 2.5rem',
                  boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
                }}
              >
                {/* Colour fill on hover */}
                <div className="cc-fill" style={{ background: cardColor }} />

                {/* Icon box */}
                <div className="cc-icon-wrap" style={{ position: 'relative', zIndex: 1, marginBottom: '2.5rem' }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '14px',
                    background: cardColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.6rem',
                    color: '#fff',
                  }}>
                    <Icon />
                  </div>
                </div>

                {/* Label */}
                <div className="cc-label" style={{
                  fontFamily: fonts.mono,
                  fontSize: '0.8rem',
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  color: colors.inkSoft,
                  marginBottom: '0.6rem',
                }}>
                  {c.label}
                </div>

                {/* Value */}
                <div className="cc-value" style={{
                  fontFamily: fonts.display,
                  fontSize: '1.35rem',
                  fontWeight: 500,
                  color: colors.ink,
                  lineHeight: 1.2,
                  flex: 1,
                  paddingBottom: '2rem',
                  wordBreak: 'break-all',
                }}>
                  {c.value}
                </div>

                {/* Action */}
                <div className="cc-action" style={{
                  fontFamily: fonts.mono,
                  fontSize: '0.8rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: colors.inkSoft,
                  borderTop: `1px solid ${colors.creamDark}`,
                  paddingTop: '1.25rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  {c.action}
                  <span style={{ fontSize: '1rem' }}>↗</span>
                </div>
              </a>
            );
          })}
        </div>
      </section>
    </>
  );
}
