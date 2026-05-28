import { useRef, useState, useEffect, useCallback } from 'react';
import { colors, fonts } from '../styles/theme';
import { collabs } from '../data/siteData';
import { useLang } from '../context/LanguageContext';
import { translations } from '../data/translations';
import SectionHeader from './SectionHeader';
import Reveal from './Reveal';

export default function Collab() {
  const { lang } = useLang();
  const t = translations[lang].collab;
  const videoRef   = useRef(null);
  const hideTimer  = useRef(null);
  const seekBarRef = useRef(null);
  const dragging   = useRef(false);
  const [selectedId, setSelectedId] = useState(collabs[0]?.id);
  const [listOpen, setListOpen]     = useState(false);
  const activeBrand = collabs.find(c => c.id === selectedId);
  const [playing, setPlaying]       = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration]     = useState(0);
  const [hovering, setHovering]     = useState(false);

  function showControlsBriefly() {
    setHovering(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setHovering(false), 3000);
  }

  function togglePlay() {
    if (!videoRef.current) return;
    if (playing) { videoRef.current.pause(); setPlaying(false); }
    else { videoRef.current.play(); setPlaying(true); }
  }

  const applySeek = useCallback((clientX) => {
    if (!videoRef.current || !duration || !seekBarRef.current) return;
    const rect  = seekBarRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    videoRef.current.currentTime = ratio * duration;
    setCurrentTime(ratio * duration);
  }, [duration]);

  useEffect(() => {
    function onMouseMove(e) { if (dragging.current) applySeek(e.clientX); }
    function onMouseUp()    { dragging.current = false; }
    function onTouchMove(e) { if (dragging.current) { e.preventDefault(); applySeek(e.touches[0].clientX); } }
    function onTouchEnd()   { dragging.current = false; }
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup',   onMouseUp);
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend',  onTouchEnd);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup',   onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend',  onTouchEnd);
    };
  }, [applySeek]);

  function fmt(s) {
    if (!s || isNaN(s)) return '0:00';
    return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  }

  function toggleFullscreen() {
    const v = videoRef.current;
    if (!v) return;
    if (document.fullscreenElement) { document.exitFullscreen(); }
    else if (v.requestFullscreen) { v.requestFullscreen(); }
    else if (v.webkitEnterFullscreen) { v.webkitEnterFullscreen(); }
  }

  useEffect(() => {
    if (videoRef.current) { videoRef.current.pause(); videoRef.current.load(); }
    setPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setHovering(false);
  }, [selectedId]);

  const tickerDuration = `${collabs.length * 7}s`;

  return (
    <>
      <style>{`
        @keyframes ticker-left {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .collab-ticker-track {
          display: flex;
          align-items: center;
          gap: clamp(1.5rem, 3vw, 2.5rem);
          animation: ticker-left ${tickerDuration} linear infinite;
          width: max-content;
          will-change: transform;
        }
        .collab-ticker-wrap:hover .collab-ticker-track { animation-play-state: paused; }
        .collab-logo-btn {
          background: none;
          border: 2px solid transparent;
          cursor: pointer;
          padding: 0.4rem 0.75rem;
          border-radius: 8px;
          transition: border-color .2s, background .2s;
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }
        .collab-logo-btn:hover { background: rgba(0,0,0,0.04); }
        .collab-logo-btn.active { border-color: ${colors.accent}; background: rgba(217,122,142,0.07); }
        .collab-logo-img {
          height: clamp(36px, 6vw, 68px);
          width: auto;
          object-fit: contain;
          display: block;
        }
        .collab-list-row {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.9rem 1.25rem;
          cursor: pointer;
          border-bottom: 1px solid ${colors.creamDark};
          transition: background .15s;
        }
        .collab-list-row:hover { background: ${colors.creamDark}; }
        .collab-list-row:last-child { border-bottom: none; }
        .collab-play-btn {
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
          background: rgba(0,0,0,0);
          transition: background .3s;
          cursor: pointer; border: none; padding: 0;
        }
        .collab-play-btn:hover { background: rgba(0,0,0,0.15); }
        .collab-play-icon {
          width: 70px; height: 70px; border-radius: 50%;
          background: ${colors.ink};
          display: flex; align-items: center; justify-content: center;
          color: ${colors.cream};
          box-shadow: 0 4px 24px rgba(0,0,0,0.35);
          transition: transform .2s;
          padding-left: 5px;
        }
        .collab-play-btn:hover .collab-play-icon { transform: scale(1.1); }
        .collab-controls-overlay {
          position: absolute; bottom: 0; left: 0; right: 0;
          padding: 2rem 1rem .8rem;
          background: linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%);
          transition: opacity .3s;
        }
        @media (max-width: 768px) {
          .collab-section-tj { padding: 3rem 1.5rem 2rem !important; }
        }
      `}</style>

      <section
        id="collab"
        className="collab-section-tj"
        style={{ padding: '3rem 3rem 2rem', background: colors.cream, position: 'relative', zIndex: 2 }}
      >
        <SectionHeader num={t.sectionNum} title={t.sectionTitle} italic={t.sectionItalic} mb="2rem" />

        {/* ── TEE × + scrolling ticker ── */}
        <Reveal>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(0.75rem, 2vw, 1.5rem)',
            marginBottom: '1.25rem',
            overflow: 'hidden',
          }}>
            <span style={{
              fontFamily: fonts.display,
              fontSize: 'clamp(2rem, 5vw, 4rem)',
              fontWeight: 700,
              color: colors.ink,
              letterSpacing: '-.02em',
              lineHeight: 1,
              flexShrink: 0,
            }}>TEE</span>
            <span style={{
              fontFamily: fonts.display,
              fontSize: 'clamp(2rem, 5vw, 4rem)',
              fontStyle: 'italic',
              fontWeight: 300,
              color: colors.accent,
              lineHeight: 1,
              flexShrink: 0,
            }}>×</span>

            <div className="collab-ticker-wrap" style={{ overflow: 'hidden', flex: 1, minWidth: 0 }}>
              <div className="collab-ticker-track">
                {[...collabs, ...collabs, ...collabs, ...collabs, ...collabs, ...collabs].map((brand, i) => (
                  <button
                    key={i}
                    className={`collab-logo-btn${brand.id === selectedId ? ' active' : ''}`}
                    onClick={() => setSelectedId(brand.id)}
                    aria-label={brand.name}
                  >
                    {brand.logos
                      ? <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(0.5rem, 1.5vw, 1rem)' }}>
                          {brand.logos.map((l, li) => (
                            <img key={li} src={l.src} alt={l.alt} className="collab-logo-img" style={l.style || {}} />
                          ))}
                        </div>
                      : brand.logo
                        ? <img src={brand.logo} alt={brand.name} className="collab-logo-img" style={brand.logoStyle || {}} />
                        : <span style={{
                            fontFamily: fonts.mono,
                            fontSize: 'clamp(0.9rem, 2vw, 1.3rem)',
                            fontWeight: 700,
                            letterSpacing: '.06em',
                            color: brand.color || colors.ink,
                          }}>{brand.name}</span>
                    }
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        {/* ── ดูทั้งหมด button ── */}
        <Reveal delay={60}>
          <button
            onClick={() => setListOpen(v => !v)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'none',
              border: `1px solid ${colors.ink}`,
              borderRadius: 4,
              padding: '0.45rem 0.9rem',
              fontFamily: fonts.mono,
              fontSize: '0.72rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              color: colors.ink,
              marginBottom: '1.5rem',
            }}
          >
            {listOpen
              ? <><svg viewBox="0 0 24 24" width="10" height="10" fill="currentColor"><path d="M7 14l5-5 5 5z"/></svg> ซ่อน</>
              : <><svg viewBox="0 0 24 24" width="10" height="10" fill="currentColor"><path d="M7 10l5 5 5-5z"/></svg> ดูทั้งหมด</>
            }
          </button>
        </Reveal>

        {/* ── Expanded brand list ── */}
        {listOpen && (
          <div style={{
            border: `1px solid ${colors.ink}`,
            borderRadius: 6,
            overflow: 'hidden',
            marginBottom: '1.5rem',
          }}>
            {collabs.map(brand => (
              <div
                key={brand.id}
                className="collab-list-row"
                onClick={() => { setSelectedId(brand.id); setListOpen(false); }}
                style={{ background: brand.id === selectedId ? colors.creamDark : 'transparent' }}
              >
                {brand.logos
                  ? <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
                      {brand.logos.map((l, li) => (
                        <img key={li} src={l.src} alt={l.alt} style={{ height: 22, maxWidth: 64, width: 'auto', objectFit: 'contain' }} />
                      ))}
                    </div>
                  : brand.logo && (
                      <img src={brand.logo} alt={brand.name} style={{ height: 22, maxWidth: 64, width: 'auto', objectFit: 'contain', flexShrink: 0 }} />
                    )
                }
                <span style={{
                  fontFamily: fonts.mono,
                  fontSize: '0.82rem',
                  letterSpacing: '0.08em',
                  color: colors.ink,
                  flex: 1,
                  minWidth: 0,
                }}>
                  {brand.name}
                </span>
                {brand.id === selectedId && (
                  <span style={{
                    marginLeft: 'auto',
                    fontFamily: fonts.mono,
                    fontSize: '0.68rem',
                    color: colors.accent,
                    letterSpacing: '0.1em',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                  }}>● กำลังแสดง</span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── Video ── */}
        <Reveal delay={120}>
          <div
            style={{ position: 'relative', width: '100%', background: '#000', overflow: 'hidden', borderRadius: 6 }}
            onMouseEnter={() => { clearTimeout(hideTimer.current); setHovering(true); }}
            onMouseLeave={() => setHovering(false)}
            onTouchStart={showControlsBriefly}
          >
            <video
              ref={videoRef}
              src={activeBrand?.video || ''}
              poster={activeBrand?.poster || undefined}
              preload="none"
              style={{ width: '100%', display: 'block', maxHeight: '68vh', objectFit: 'cover' }}
              onTimeUpdate={() => videoRef.current && setCurrentTime(videoRef.current.currentTime)}
              onLoadedMetadata={() => videoRef.current && setDuration(videoRef.current.duration)}
              onEnded={() => { setPlaying(false); setCurrentTime(0); }}
              onClick={togglePlay}
              playsInline
            />

            {!playing && hovering && (
              <button className="collab-play-btn" onClick={togglePlay} aria-label="Play">
                <div className="collab-play-icon">
                  <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </button>
            )}

            <div
              className="collab-controls-overlay"
              style={{ opacity: hovering ? 1 : 0, pointerEvents: hovering ? 'auto' : 'none' }}
            >
              <div
                ref={seekBarRef}
                onClick={(e) => applySeek(e.clientX)}
                onMouseDown={(e) => { dragging.current = true; applySeek(e.clientX); }}
                onTouchStart={(e) => { dragging.current = true; applySeek(e.touches[0].clientX); }}
                style={{
                  height: 8, background: 'rgba(255,255,255,0.25)', borderRadius: 4,
                  cursor: 'pointer', position: 'relative', marginBottom: '.65rem',
                  touchAction: 'none',
                }}
              >
                <div style={{
                  position: 'absolute', left: 0, top: 0, bottom: 0, borderRadius: 2,
                  width: duration ? `${(currentTime / duration) * 100}%` : '0%',
                  background: colors.accent,
                }} />
                <div style={{
                  position: 'absolute', top: '50%', transform: 'translateY(-50%)',
                  left: duration ? `calc(${(currentTime / duration) * 100}% - 7px)` : '-7px',
                  width: 14, height: 14, borderRadius: '50%',
                  background: colors.accent,
                  boxShadow: '0 0 0 3px rgba(217,122,142,0.35)',
                  pointerEvents: 'none',
                }} />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '.65rem' }}>
                <button onClick={togglePlay} style={{
                  width: 30, height: 30, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.4)',
                  color: '#fff', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, backdropFilter: 'blur(4px)',
                }}>
                  {playing
                    ? <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                    : <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                  }
                </button>
                <span style={{ fontFamily: fonts.mono, fontSize: '.6rem', letterSpacing: '.06em', color: 'rgba(255,255,255,0.8)', flex: 1 }}>
                  {fmt(currentTime)} / {fmt(duration)}
                </span>
                <button onClick={toggleFullscreen} style={{
                  width: 30, height: 30, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.4)',
                  color: '#fff', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, backdropFilter: 'blur(4px)',
                }} aria-label="Fullscreen">
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
                    <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
