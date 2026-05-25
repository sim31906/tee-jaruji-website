import { useRef, useState } from 'react';
import { colors, fonts } from '../styles/theme';
import { collabs, collabVideo } from '../data/siteData';
import { useLang } from '../context/LanguageContext';
import { translations } from '../data/translations';
import SectionHeader from './SectionHeader';
import Reveal from './Reveal';

export default function Collab() {
  const { lang } = useLang();
  const t = translations[lang].collab;
  const videoRef = useRef(null);
  const hideTimer = useRef(null);
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

  function handleSeek(e) {
    if (!videoRef.current || !duration) return;
    const rect  = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    videoRef.current.currentTime = ratio * duration;
    setCurrentTime(ratio * duration);
  }

  function fmt(s) {
    if (!s || isNaN(s)) return '0:00';
    return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  }

  const showControls = hovering;

  return (
    <>
      <style>{`
        .collab-logo-img {
          height: clamp(48px, 8vw, 88px);
          width: auto;
          object-fit: contain;
          display: block;
          filter: none;
          transition: opacity .2s;
        }
        .collab-logo-img:hover { opacity: .8; }
        .collab-x {
          font-family: ${fonts.display};
          font-size: clamp(2rem, 5vw, 4rem);
          font-style: italic;
          font-weight: 300;
          color: ${colors.accent};
          line-height: 1;
          flex-shrink: 0;
          user-select: none;
        }
        .collab-tee {
          font-family: ${fonts.display};
          font-size: clamp(2rem, 5vw, 4rem);
          font-weight: 700;
          color: ${colors.ink};
          letter-spacing: -.02em;
          line-height: 1;
          flex-shrink: 0;
        }
        .collab-play-btn {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0,0,0,0);
          transition: background .3s;
          cursor: pointer;
          border: none;
          padding: 0;
        }
        .collab-play-btn:hover { background: rgba(0,0,0,0.15); }
        .collab-play-icon {
          width: 70px; height: 70px;
          border-radius: 50%;
          background: ${colors.ink};
          display: flex; align-items: center; justify-content: center;
          font-size: 1.4rem;
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
          .collab-banner { flex-wrap: wrap !important; gap: 1.25rem !important; }
          .collab-logo-img { height: clamp(36px, 10vw, 60px) !important; max-width: calc(100vw - 3rem) !important; }
        }
      `}</style>

      <section
        id="collab"
        className="collab-section-tj"
        style={{ padding: '3rem 3rem 2rem', background: colors.cream, position: 'relative', zIndex: 2 }}
      >
        <SectionHeader num={t.sectionNum} title={t.sectionTitle} italic={t.sectionItalic} mb="2rem" />

        {/* ── TEE × logo banner ── */}
        <Reveal>
          <div
            className="collab-banner"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'clamp(1rem, 3vw, 2.5rem)',
              marginBottom: '2.5rem',
              flexWrap: 'nowrap',
              overflow: 'hidden',
            }}
          >
            <span className="collab-tee">TEE</span>

            {collabs.map((brand, i) => (
              <div key={brand.id} style={{ display: 'contents' }}>
                {i === 0 && <span className="collab-x">×</span>}
                {brand.logo
                  ? <img
                      src={brand.logo}
                      alt={brand.name}
                      className="collab-logo-img"
                      style={brand.logoStyle || {}}
                    />
                  : <span style={{
                      fontFamily: fonts.mono,
                      fontSize: 'clamp(1rem, 2.5vw, 1.6rem)',
                      fontWeight: 700,
                      letterSpacing: '.08em',
                      color: brand.color,
                      flexShrink: 0,
                    }}>
                      {brand.name}
                    </span>
                }
              </div>
            ))}
          </div>
        </Reveal>

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
              src={collabVideo.file}
              poster={collabVideo.poster || undefined}
              preload="none"
              style={{ width: '100%', display: 'block', maxHeight: '68vh', objectFit: 'cover' }}
              onTimeUpdate={() => videoRef.current && setCurrentTime(videoRef.current.currentTime)}
              onLoadedMetadata={() => videoRef.current && setDuration(videoRef.current.duration)}
              onEnded={() => { setPlaying(false); setCurrentTime(0); }}
              onClick={togglePlay}
              playsInline
            />

            {/* center play button — show only on hover when paused */}
            {!playing && hovering && (
              <button className="collab-play-btn" onClick={togglePlay} aria-label="Play">
                <div className="collab-play-icon">
                  <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </button>
            )}

            {/* bottom controls — auto-hide when playing and not hovering */}
            <div
              className="collab-controls-overlay"
              style={{ opacity: showControls ? 1 : 0, pointerEvents: showControls ? 'auto' : 'none' }}
            >
              {/* progress bar */}
              <div onClick={handleSeek} style={{
                height: 4, background: 'rgba(255,255,255,0.25)', borderRadius: 2,
                cursor: 'pointer', position: 'relative', marginBottom: '.65rem',
              }}>
                <div style={{
                  position: 'absolute', left: 0, top: 0, bottom: 0, borderRadius: 2,
                  width: duration ? `${(currentTime / duration) * 100}%` : '0%',
                  background: colors.accent,
                  transition: 'width .1s linear',
                }} />
                <div style={{
                  position: 'absolute', top: '50%', transform: 'translateY(-50%)',
                  left: duration ? `calc(${(currentTime / duration) * 100}% - 7px)` : '-7px',
                  width: 14, height: 14, borderRadius: '50%',
                  background: colors.accent,
                  boxShadow: '0 0 0 3px rgba(217,122,142,0.35)',
                  pointerEvents: 'none',
                  transition: 'left .1s linear',
                }} />
              </div>

              {/* play button + time */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '.65rem' }}>
                <button onClick={togglePlay} style={{
                  width: 30, height: 30, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.4)',
                  color: '#fff', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '.75rem', flexShrink: 0, backdropFilter: 'blur(4px)',
                }}>
                  {playing
                    ? <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                    : <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                  }
                </button>
                <span style={{ fontFamily: fonts.mono, fontSize: '.6rem', letterSpacing: '.06em', color: 'rgba(255,255,255,0.8)' }}>
                  {fmt(currentTime)} / {fmt(duration)}
                </span>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
