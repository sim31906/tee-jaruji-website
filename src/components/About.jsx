import { colors, fonts } from '../styles/theme';
import { socials } from '../data/siteData';
import { useLang } from '../context/LanguageContext';
import { translations } from '../data/translations';
import SectionHeader from './SectionHeader';
import { FaFacebook, FaInstagram, FaWeibo, FaLine } from 'react-icons/fa';
import { FaXTwitter, FaTiktok } from 'react-icons/fa6';
import { SiXiaohongshu } from 'react-icons/si';

const ICONS = {
  Facebook: FaFacebook,
  Instagram: FaInstagram,
  X: FaXTwitter,
  TikTok: FaTiktok,
  Line: FaLine,
  Weibo: FaWeibo,
  RedNote: SiXiaohongshu,
};

export default function About() {
  const { lang } = useLang();
  const t = translations[lang].about;

  return (
    <>
      <style>{`
        .social-card-tj {
          position: relative;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .social-card-tj:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.12);
        }
        .social-card-tj .social-icon-tj {
          transition: transform 0.3s ease, color 0.3s ease;
        }
        .social-card-tj:hover .social-icon-tj {
          transform: scale(1.15);
        }
        .social-card-tj .social-bg-tj {
          position: absolute;
          inset: 0;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .social-card-tj:hover .social-bg-tj {
          opacity: 1;
        }
        .social-card-tj:hover .social-text-tj {
          color: #fff !important;
        }
        @media (max-width: 968px) {
          .about-grid-tj { grid-template-columns: 1fr !important; gap: 3rem !important; }
          .about-section-tj { padding: 5rem 1.5rem !important; }
          .social-grid-tj { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>

      <section
        id="about"
        className="about-section-tj"
        style={{
          padding: '8rem 3rem',
          background: `linear-gradient(135deg, ${colors.pinkSoft}, ${colors.blueSoft})`,
          position: 'relative',
          zIndex: 2,
        }}
      >
        <SectionHeader num={t.sectionNum} title={t.sectionTitle} italic={t.sectionItalic} />

        <div className="about-grid-tj" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.4fr',
          gap: '5rem',
          alignItems: 'start',
        }}>
          <div style={{
            fontFamily: fonts.display,
            fontSize: '1.8rem',
            fontStyle: 'italic',
            fontWeight: 300,
            lineHeight: 1.5,
            color: colors.ink,
            position: 'relative',
            paddingLeft: '3rem',
          }}>
            <span style={{
              position: 'absolute',
              left: 0,
              top: '-1.5rem',
              fontSize: '6rem',
              color: colors.accent,
              fontFamily: fonts.display,
              lineHeight: 1,
            }}>"</span>
            {t.quote}
            <span style={{
              display: 'block',
              fontSize: '0.85rem',
              fontStyle: 'normal',
              fontFamily: fonts.mono,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: colors.accent,
              marginTop: '2rem',
            }}>
              {t.signature}
            </span>
          </div>

          <div className="social-grid-tj" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem',
          }}>
            {socials.map((s, i) => {
              const Icon = ICONS[s.platform];
              return (
                <a
                  key={i}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-card-tj"
                  style={{
                    background: colors.cream,
                    borderRadius: '16px',
                    padding: '1.75rem 1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.75rem',
                    textAlign: 'center',
                    gridColumn: i === 6 ? 'span 3' : 'auto',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                  }}
                >
                  <div className="social-bg-tj" style={{ background: s.color, borderRadius: '16px' }} />
                  {Icon && (
                    <Icon
                      className="social-icon-tj social-text-tj"
                      style={{ fontSize: '2.2rem', color: s.color, position: 'relative', zIndex: 1 }}
                    />
                  )}
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <div className="social-text-tj" style={{
                      fontFamily: fonts.mono,
                      fontSize: '0.6rem',
                      letterSpacing: '0.25em',
                      textTransform: 'uppercase',
                      color: colors.inkSoft,
                      marginBottom: '0.25rem',
                    }}>
                      {s.platform}
                    </div>
                    <div className="social-text-tj" style={{
                      fontFamily: fonts.body,
                      fontSize: '0.85rem',
                      fontWeight: 500,
                      color: colors.ink,
                    }}>
                      {s.handle}
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
