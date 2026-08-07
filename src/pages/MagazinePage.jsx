import { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { colors, fonts } from '../styles/theme';
import CursorSparkle from '../components/CursorSparkle';
import { useLang } from '../context/LanguageContext';
import { translations } from '../data/translations';
import { magazines } from '../data/magazineData';
import { SiNetflix } from 'react-icons/si';

function PlatformIcon({ platform, size = 26 }) {
  const containPlatforms = ['Chula', 'TST', 'Google Drive'];
  const imgStyle = { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: containPlatforms.includes(platform) ? 'contain' : 'cover', borderRadius: 'inherit', padding: containPlatforms.includes(platform) ? '8%' : 0 };
  if (platform === 'YouTube') return <svg width={size} height={size} viewBox="0 0 24 24" fill="white"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>;
  if (platform === 'Facebook') return <svg width={size} height={size} viewBox="0 0 24 24" fill="white"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>;
  if (platform === 'Instagram') return <svg width={size} height={size} viewBox="0 0 24 24" fill="white"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>;
  if (platform === 'Netflix') return <SiNetflix size={size} color="white" />;
  const imgPlatforms = { 'Google Drive': '/platforms/google-drive.png' };
  if (imgPlatforms[platform]) return <img src={imgPlatforms[platform]} alt={platform} style={imgStyle} />;
  return <span style={{ fontSize: size * 0.55, fontWeight: 700, color: 'white', lineHeight: 1 }}>{platform[0]}</span>;
}

function MagCard({ mag, onClick, t }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={() => onClick(mag)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        background: colors.cream,
        border: `1px solid ${colors.ink}`,
        cursor: 'pointer',
        overflow: 'hidden',
        transition: 'box-shadow 0.3s cubic-bezier(0.4,0,0.2,1)',
        boxShadow: hovered ? `8px 8px 0 ${colors.ink}` : '4px 4px 0 transparent',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* accent bar */}
      <div style={{
        height: '5px',
        background: colors.accent,
        transform: hovered ? 'scaleX(1)' : 'scaleX(0.3)',
        transformOrigin: 'left',
        transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1)',
      }} />

      {/* poster */}
      <div style={{
        width: '100%',
        background: `linear-gradient(135deg, ${colors.pinkSoft}, ${colors.blueSoft})`,
        position: 'relative',
        overflow: 'hidden',
        flexShrink: 0,
      }}>
        {mag.poster ? (
          <img
            src={mag.poster}
            alt={mag.title}
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              transition: 'transform 0.5s cubic-bezier(0.4,0,0.2,1)',
              transform: hovered ? 'scale(1.04)' : 'scale(1)',
            }}
          />
        ) : (
          <div style={{ aspectRatio: '4/5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: fonts.display, fontSize: '4.5rem', fontStyle: 'italic', color: 'rgba(61,44,46,0.12)', userSelect: 'none' }}>N</span>
          </div>
        )}
        <div style={{
          position: 'absolute', inset: 0,
          background: `${colors.accent}cc`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: hovered ? 1 : 0, transition: 'opacity 0.3s',
        }}>
          <span style={{ fontFamily: fonts.mono, fontSize: '0.78rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: colors.cream, fontWeight: 600 }}>
            {t.viewDetail}
          </span>
        </div>
      </div>

      {/* card body */}
      <div style={{ padding: '1.25rem 1.25rem 1.5rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ fontFamily: fonts.mono, fontSize: '0.65rem', letterSpacing: '0.3em', color: colors.accent }}>
          {mag.issue}{mag.year ? ` · ${mag.year}` : ''}
        </div>
        <h3 style={{ fontFamily: fonts.body, fontSize: '1.1rem', fontWeight: 700, lineHeight: 1.25, color: colors.ink }}>
          {mag.title}
        </h3>
      </div>
    </div>
  );
}

function MagModal({ mag, onClose, t }) {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!mag) return null;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(61,44,46,0.65)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem', animation: 'fadeInModal 0.25s ease',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: colors.cream, width: '100%', maxWidth: '420px',
          maxHeight: '90vh', borderRadius: '6px', overflow: 'hidden',
          position: 'relative', boxShadow: '0 32px 80px rgba(0,0,0,0.35)',
          animation: 'modalIn 0.38s cubic-bezier(0.34,1.08,0.64,1)',
          display: 'flex', flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* modal header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: '1.5rem', padding: '1rem 1.5rem',
          borderBottom: `1px solid ${colors.creamDark}`,
          background: `linear-gradient(135deg, ${colors.pinkSoft}, ${colors.blueSoft}55, ${colors.cream} 70%)`,
          position: 'sticky', top: 0, zIndex: 10,
        }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: fonts.mono, fontSize: '0.65rem', letterSpacing: '0.3em', color: colors.accent, marginBottom: '0.4rem' }}>
              {mag.issue}{mag.year ? ` · ${mag.year}` : ''} · Category 05
            </div>
            <h2 style={{ fontFamily: fonts.body, fontSize: 'clamp(1.1rem, 3vw, 1.5rem)', fontWeight: 700, color: colors.ink, lineHeight: 1.1, paddingRight: '2rem' }}>
              {mag.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              flexShrink: 0, width: '36px', height: '36px', borderRadius: '50%',
              border: `1px solid ${colors.creamDark}`, background: 'transparent',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.2rem', color: colors.inkSoft, transition: 'background 0.2s, color 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = colors.ink; e.currentTarget.style.color = colors.cream; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = colors.inkSoft; }}
          >×</button>
        </div>

        {/* modal body */}
        <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem', gap: '1.5rem' }}>
          {/* poster */}
          <div style={{ width: '100%' }}>
            {mag.poster ? (
              <img src={mag.poster} alt={mag.title} style={{ width: '100%', height: 'auto', display: 'block', boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }} />
            ) : (
              <div style={{ aspectRatio: '4/5', background: `linear-gradient(135deg, ${colors.pinkSoft}, ${colors.blueSoft})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: fonts.display, fontSize: '4rem', fontStyle: 'italic', color: 'rgba(61,44,46,0.15)' }}>N</span>
              </div>
            )}
          </div>

          {/* info */}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', textAlign: 'center' }}>
            {mag.issue && (
              <div style={{ fontFamily: fonts.mono, fontSize: '0.7rem', letterSpacing: '0.25em', color: colors.accent }}>
                {mag.issue}{mag.year ? ` · ${mag.year}` : ''}
              </div>
            )}
            {mag.detail && (
              <p style={{ fontFamily: fonts.body, fontSize: '0.9rem', color: colors.inkSoft, lineHeight: 1.6 }}>
                {mag.detail}
              </p>
            )}
          </div>

          {/* read more button */}
          {mag.readLink && (
            <a
              href={mag.readLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                background: colors.ink, color: colors.cream,
                padding: '0.85rem 2rem', borderRadius: '2px',
                fontFamily: fonts.mono, fontSize: '0.75rem', letterSpacing: '0.2em',
                textTransform: 'uppercase', textDecoration: 'none',
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              {t.readMore}
            </a>
          )}

          {/* links as platform icons */}
          {mag.links && mag.links.length > 0 && (
            <div style={{ width: '100%', borderTop: `1px solid ${colors.creamDark}`, paddingTop: '1rem' }}>
              <div style={{ fontFamily: fonts.mono, fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: colors.inkSoft, marginBottom: '0.75rem', textAlign: 'center' }}>
                ลิงก์
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center' }}>
                {mag.links.map((link, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
                    <a
                      href={link.url} target="_blank" rel="noopener noreferrer"
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        width: 56, height: 56, borderRadius: '12px',
                        background: link.platform === 'Instagram'
                          ? 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)'
                          : link.color || colors.accent,
                        textDecoration: 'none',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        position: 'relative', overflow: 'hidden', flexShrink: 0,
                        transition: 'transform 0.15s, box-shadow 0.15s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)'; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)'; }}
                    >
                      <PlatformIcon platform={link.platform} size={26} />
                    </a>
                    <span style={{ fontFamily: fonts.mono, fontSize: '0.5rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: colors.inkSoft, textAlign: 'center' }}>
                      {link.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MagazinePage() {
  const navigate = useNavigate();
  const { lang } = useLang();
  const t = translations[lang].magazine;
  const [selectedMag, setSelectedMag] = useState(null);

  useLayoutEffect(() => { window.scrollTo(0, 0); }, []);

  const handleClose = useCallback(() => setSelectedMag(null), []);

  function goBack() {
    navigate('/', { state: { scrollTo: 'selected-works' } });
  }

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${colors.cream}; }
        .mag-grid-tj { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.75rem; }
        @media (max-width: 1200px) { .mag-grid-tj { grid-template-columns: repeat(3, 1fr) !important; } }
        @media (max-width: 768px)  { .mag-grid-tj { grid-template-columns: repeat(2, 1fr) !important; gap: 1rem; } }
        @media (max-width: 480px)  { .mag-grid-tj { grid-template-columns: 1fr !important; } }
        .back-btn-mag:hover { color: ${colors.ink} !important; }
        .mag-modal-body { flex-direction: row; }
        @media (max-width: 640px) {
          .mag-modal-body { flex-direction: column !important; }
          .mag-modal-left { width: 100% !important; border-right: none !important; border-bottom: 1px solid ${colors.creamDark}; max-width: 280px; margin: 0 auto; }
          .mag-modal-right { padding: 1.5rem !important; }
        }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${colors.creamDark}; border-radius: 3px; }
        @keyframes fadeInModal { from { opacity: 0; } to { opacity: 1; } }
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.92) translateY(16px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>

      <CursorSparkle />

      {/* nav */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1.5rem 3rem',
        background: `${colors.cream}ee`, backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${colors.creamDark}`,
      }}>
        <button onClick={goBack} className="back-btn-mag" style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          fontFamily: fonts.mono, fontSize: '0.75rem', letterSpacing: '0.2em',
          textTransform: 'uppercase', color: colors.inkSoft,
          background: 'none', border: 'none', cursor: 'pointer', padding: 0, transition: 'color 0.2s',
        }}>
          {t.backNav}
        </button>
        <span style={{ fontFamily: fonts.display, fontSize: '1.1rem', letterSpacing: '0.15em', color: colors.ink }}>
          Tee · Jaruji
        </span>
      </nav>

      {/* hero */}
      <div style={{
        padding: '10rem 4rem 5rem',
        backgroundImage: `linear-gradient(135deg, rgba(252,228,234,0.75), rgba(252,246,236,0.85)), url(/bgmagazine.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 30%',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', right: '-1rem', bottom: '-3rem',
          fontFamily: fonts.display, fontSize: 'clamp(10rem, 25vw, 20rem)',
          fontStyle: 'italic', color: colors.pink, opacity: 0.12,
          lineHeight: 1, userSelect: 'none', pointerEvents: 'none',
        }}>N</div>
        <div style={{ fontFamily: fonts.mono, fontSize: '0.68rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: colors.accent, marginBottom: '1rem' }}>
          {t.categoryLabel}
        </div>
        <h1 style={{
          fontFamily: fonts.display, fontSize: 'clamp(2.8rem, 7vw, 5rem)',
          fontWeight: 500, lineHeight: 1.0, letterSpacing: '-0.02em',
          color: colors.ink, maxWidth: '700px', margin: '0 0 1rem',
        }}>
          {t.titleMain}
        </h1>
        <p style={{ fontFamily: fonts.body, fontSize: '1rem', lineHeight: 1.7, color: colors.ink, maxWidth: '500px', margin: 0 }}>
          {t.subtitle}
        </p>
      </div>

      {/* grid */}
      <div style={{ padding: '4rem', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ fontFamily: fonts.mono, fontSize: '0.85rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: colors.accent, marginBottom: '2rem' }}>
          {t.allWorks} · {magazines.length} {t.itemsUnit}
        </div>
        {magazines.length === 0 ? (
          <p style={{ fontFamily: fonts.mono, fontSize: '0.8rem', color: colors.inkSoft, letterSpacing: '0.1em' }}>
            ยังไม่มีข้อมูล
          </p>
        ) : (
          <div className="mag-grid-tj">
            {magazines.map(mag => (
              <MagCard key={mag.id} mag={mag} onClick={setSelectedMag} t={t} />
            ))}
          </div>
        )}
      </div>

      {/* footer */}
      <div style={{ padding: '4rem', textAlign: 'center', borderTop: `1px solid ${colors.creamDark}`, marginTop: '2rem' }}>
        <button onClick={goBack} style={{
          display: 'inline-flex', alignItems: 'center',
          background: colors.ink, color: colors.cream,
          padding: '1rem 2.5rem', borderRadius: '2px',
          fontFamily: fonts.mono, fontSize: '0.78rem', letterSpacing: '0.2em',
          textTransform: 'uppercase', gap: '0.5rem', cursor: 'pointer', border: 'none', transition: 'opacity 0.2s',
        }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          {t.backButton}
        </button>
      </div>

      {selectedMag && <MagModal mag={selectedMag} onClose={handleClose} t={t} />}
    </>
  );
}
