import { useState, useEffect } from 'react';
import { colors, fonts } from '../styles/theme';
import { navItems } from '../data/siteData';

export default function Navigation() {
  const [activeSection, setActiveSection] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);

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
                {id}
              </a>
            </li>
          ))}
        </ul>

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
                {id}
              </a>
            ))}
          </div>
        )}
      </nav>
    </>
  );
}
