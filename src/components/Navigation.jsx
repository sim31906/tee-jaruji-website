import { useState, useEffect } from 'react';
import { colors, fonts } from '../styles/theme';
import { navItems } from '../data/siteData';
import { useLang } from '../context/LanguageContext';
import { translations } from '../data/translations';

const LANGS = ['th', 'en', 'zh'];

export default function Navigation() {
  const [activeSection, setActiveSection] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const { lang, setLang } = useLang();
  const t = translations[lang].nav;

  useEffect(() => {
    const handleScroll = () => {
      const current = navItems.find(id => {
        const el = document.getElementById(id);
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return rect.top <= 100 && rect.bottom >= 100;
      });
      if (current) setActiveSection(current);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <>
      <style>{`
        .nav-link-tj:hover { opacity: 0.5; }
        .nav-link-tj.active { color: ${colors.accent} !important; }
        .lang-btn-tj {
          background: none;
          border: none;
          fontFamily: ${fonts.mono};
          font-size: 0.65rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          cursor: pointer;
          padding: 0.25rem 0.4rem;
          border-radius: 4px;
          transition: all 0.2s;
          color: ${colors.inkSoft};
        }
        .lang-btn-tj:hover { color: ${colors.ink}; }
        .lang-btn-tj.active-lang { color: ${colors.ink}; background: ${colors.pinkSoft}; font-weight: 600; }
        @media (max-width: 968px) {
          .nav-links-tj { display: none !important; }
          .menu-toggle-tj { display: block !important; }
          .nav-tj { padding: 1rem 1.5rem !important; }
        }
      `}</style>

      <nav className="nav-tj" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: '1.5rem 3rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(253, 246, 236, 0.85)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderBottom: `1px solid ${colors.creamDark}`,
      }}>
        <div
          onClick={() => scrollTo('home')}
          style={{
            fontFamily: fonts.display,
            fontSize: '1.5rem',
            fontWeight: 500,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: colors.ink,
            cursor: 'pointer',
          }}
        >
          Tee · Jaruji
        </div>

        <ul className="nav-links-tj" style={{
          display: 'flex',
          gap: '2rem',
          fontFamily: fonts.mono,
          fontSize: '0.7rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
        }}>
          {navItems.map(id => (
            <li key={id}>
              <a
                onClick={() => scrollTo(id)}
                className={`nav-link-tj ${activeSection === id ? 'active' : ''}`}
                style={{
                  color: colors.ink,
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                }}
              >
                {t[id]}
              </a>
            </li>
          ))}
        </ul>

        {/* Language switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.1rem' }}>
          {LANGS.map((l, i) => (
            <span key={l} style={{ display: 'flex', alignItems: 'center' }}>
              <button
                className={`lang-btn-tj${lang === l ? ' active-lang' : ''}`}
                onClick={() => setLang(l)}
                style={{ fontFamily: fonts.mono }}
              >
                {l.toUpperCase()}
              </button>
              {i < LANGS.length - 1 && (
                <span style={{ color: colors.creamDark, fontSize: '0.6rem' }}>|</span>
              )}
            </span>
          ))}
        </div>

        <button
          className="menu-toggle-tj"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            color: colors.ink,
            fontSize: '1.5rem',
          }}
        >
          {menuOpen ? '✕' : '☰'}
        </button>

        {menuOpen && (
          <div style={{
            position: 'fixed',
            top: '60px',
            right: '1rem',
            background: colors.cream,
            border: `1px solid ${colors.ink}`,
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            fontFamily: fonts.mono,
            fontSize: '0.75rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            boxShadow: `4px 4px 0 ${colors.pink}`,
          }}>
            {navItems.map(id => (
              <a
                key={id}
                onClick={() => scrollTo(id)}
                style={{ color: colors.ink, cursor: 'pointer' }}
              >
                {t[id]}
              </a>
            ))}
          </div>
        )}
      </nav>
    </>
  );
}
