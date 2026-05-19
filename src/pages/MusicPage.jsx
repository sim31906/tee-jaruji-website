import { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { colors, fonts } from '../styles/theme';
import { teeSongs, musicVideos, allSongs } from '../data/musicData';
import CursorSparkle from '../components/CursorSparkle';
import { useLang } from '../context/LanguageContext';
import { translations } from '../data/translations';

function formatTime(secs) {
  if (!secs || isNaN(secs)) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function VinylRecord({ gradient, isPlaying, size = 200 }) {
  const [c1, c2] = gradient;
  return (
    <div
      className={isPlaying ? 'vinyl-spin' : ''}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: `
          radial-gradient(circle at center,
            #1a1a1a 0%, #1a1a1a 20%,
            rgba(255,255,255,0.07) 21%, rgba(255,255,255,0.07) 22%,
            #111 23%, #111 26%,
            rgba(255,255,255,0.05) 27%, rgba(255,255,255,0.05) 28%,
            #111 29%, #111 32%,
            rgba(255,255,255,0.05) 33%, rgba(255,255,255,0.05) 34%,
            #111 35%, #111 38%,
            rgba(255,255,255,0.05) 39%, rgba(255,255,255,0.05) 40%,
            #111 41%, #111 44%,
            rgba(255,255,255,0.05) 45%, rgba(255,255,255,0.05) 46%,
            #111 47%, #111 50%
          )
        `,
        position: 'relative',
        flexShrink: 0,
        boxShadow: isPlaying
          ? `0 0 28px ${c1}70, 0 8px 32px rgba(0,0,0,0.4)`
          : '0 6px 24px rgba(0,0,0,0.3)',
        transition: 'box-shadow 0.6s ease',
      }}
    >
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '40%',
        height: '40%',
        borderRadius: '50%',
        background: `radial-gradient(circle at 38% 38%, ${c1}, ${c2})`,
        border: '2px solid rgba(255,255,255,0.18)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.3)',
      }}>
        <div style={{
          width: size * 0.055,
          height: size * 0.055,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.75)',
          boxShadow: '0 0 4px rgba(0,0,0,0.4)',
        }} />
      </div>
    </div>
  );
}

function WaveformBars({ isPlaying, count = 8 }) {
  return (
    <div className="wf-container">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={isPlaying ? `wf-bar wf-${i % 4}` : 'wf-bar-idle'}
        />
      ))}
    </div>
  );
}

function SongCard({ song, index, isActive, onSelect, lang }) {
  const [hovered, setHovered] = useState(false);
  const [c1, c2] = song.gradient;
  const isMV = !!song.youtubeEmbed;
  const accentColor = isMV ? colors.blue : colors.accent;
  const typeLabel = isMV ? 'MV' : 'TEE';
  const primaryTitle = lang !== 'th' ? song.titleEn : song.title;
  const secondaryTitle = lang !== 'th' ? song.title : song.titleEn;

  return (
    <div
      onClick={() => onSelect(song)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        cursor: 'pointer',
        background: colors.cream,
        border: `1px solid ${colors.ink}`,
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
        background: isActive ? accentColor : accentColor,
        transform: hovered || isActive ? 'scaleX(1)' : 'scaleX(0.3)',
        transformOrigin: 'left',
        transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1)',
      }} />

      {/* poster */}
      <div style={{
        width: '100%',
        aspectRatio: '16/9',
        background: `linear-gradient(135deg, ${c1}, ${c2})`,
        position: 'relative',
        overflow: 'hidden',
        flexShrink: 0,
      }}>
        {song.coverImage && (
          <img src={song.coverImage} alt={song.title} style={{
            width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center',
          }} />
        )}
        {/* type badge */}
        <div style={{
          position: 'absolute', top: '0.75rem', right: '0.75rem',
          background: isMV ? `${colors.blue}cc` : `${colors.accent}cc`,
          color: colors.cream,
          fontFamily: fonts.mono, fontSize: '0.62rem',
          letterSpacing: '0.2em', textTransform: 'uppercase',
          padding: '0.2rem 0.55rem', borderRadius: '2px',
          backdropFilter: 'blur(4px)',
        }}>
          {typeLabel}
        </div>
        {/* hover overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `${accentColor}99`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: hovered ? 1 : 0, transition: 'opacity 0.3s',
        }}>
          <span style={{
            fontFamily: fonts.mono, fontSize: '0.78rem',
            letterSpacing: '0.25em', textTransform: 'uppercase',
            color: colors.ink, fontWeight: 600,
          }}>ดูรายละเอียด →</span>
        </div>
      </div>

      {/* card body */}
      <div style={{ padding: '1.25rem 1.25rem 1.5rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        <div style={{ fontFamily: fonts.mono, fontSize: '0.65rem', letterSpacing: '0.3em', color: accentColor }}>
          {String(index + 1).padStart(2, '0')}
        </div>
        <h3 style={{ fontFamily: fonts.display, fontSize: '1.2rem', fontWeight: 700, lineHeight: 1.2, color: colors.ink, margin: 0 }}>
          {primaryTitle}
        </h3>
        <p style={{ fontFamily: fonts.mono, fontSize: '0.65rem', letterSpacing: '0.1em', color: colors.inkSoft, textTransform: 'uppercase', margin: 0 }}>
          {secondaryTitle}
        </p>
        <div style={{ fontFamily: fonts.body, fontSize: '0.78rem', color: colors.inkSoft }}>
          {song.artist}
        </div>
        {song.links && song.links.length > 0 && (
          <div style={{ marginTop: 'auto', paddingTop: '0.75rem', display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}
            onClick={e => e.stopPropagation()}>
            {song.links.map((link, i) => (
              <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="platform-tile-music"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: '8px', background: link.color, flexShrink: 0, position: 'relative', overflow: 'hidden' }}
              >
                <PlatformIcon platform={link.platform} size={20} />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PlatformIcon({ platform, size = 26 }) {
  if (platform === 'YouTube') return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="white">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
  if (platform === 'Spotify') return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="white">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
    </svg>
  );
  if (platform === 'Apple Music' || platform === 'iTunes') return (
    <img
      src="/platforms/apple-music.png"
      alt="Apple Music"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }}
    />
  );
  if (platform === 'Joox') return (
    <img
      src="/platforms/joox.png"
      alt="Joox"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }}
    />
  );
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="white">
      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
    </svg>
  );
}

function PlatformLink({ link }) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      title={link.label || link.platform}
      className="platform-tile-music"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 64,
        height: 64,
        borderRadius: '10px',
        background: link.color,
        color: '#fff',
        textDecoration: 'none',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <PlatformIcon platform={link.platform} size={28} />
    </a>
  );
}

function SongModal({ song, onClose, isActive, isPlaying, progress, onPlay, onSeek, t, lang }) {
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!song) return null;
  const [c1, c2] = song.gradient;
  const pct = isActive && progress.duration ? (progress.current / progress.duration) * 100 : 0;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 300,
        background: 'rgba(61,44,46,0.55)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        padding: 0,
        animation: 'fadeIn 0.25s ease',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="music-modal-sheet"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '2rem 2rem 1.5rem',
          background: `linear-gradient(135deg, ${c1}55, ${c2}55)`,
          position: 'relative',
          flexShrink: 0,
        }}>
          <button
            onClick={onClose}
            aria-label="ปิด"
            style={{
              position: 'absolute',
              top: '1.25rem',
              right: '1.25rem',
              width: 34,
              height: 34,
              borderRadius: '50%',
              border: `1px solid ${colors.creamDark}`,
              background: `${colors.cream}cc`,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1rem',
              color: colors.inkSoft,
              backdropFilter: 'blur(8px)',
            }}
          >
            ×
          </button>

          <div style={{
            fontFamily: fonts.mono,
            fontSize: '0.62rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: colors.accent,
            marginBottom: '0.4rem',
          }}>
            {song.artist}
          </div>
          <h2 style={{
            fontFamily: fonts.display,
            fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
            fontWeight: 600,
            color: colors.ink,
            lineHeight: 1.1,
            marginBottom: '0.25rem',
          }}>
            {lang !== 'th' ? song.titleEn : song.title}
          </h2>
          <div style={{
            fontFamily: fonts.mono,
            fontSize: '0.75rem',
            letterSpacing: '0.1em',
            color: colors.inkSoft,
            fontStyle: 'italic',
          }}>
            {lang !== 'th' ? song.title : song.titleEn}
          </div>
          {song.note && (
            <div style={{
              marginTop: '0.75rem',
              fontFamily: fonts.body,
              fontSize: '0.78rem',
              color: colors.inkSoft,
              background: 'rgba(255,255,255,0.45)',
              backdropFilter: 'blur(4px)',
              display: 'inline-block',
              padding: '0.25rem 0.7rem',
              borderRadius: '2px',
            }}>
              ★ {song.note}
            </div>
          )}
        </div>

        {song.youtubeEmbed ? (
          /* Music Video — single scroll container */
          <div style={{ overflowY: 'auto', flex: 1 }}>
            <div style={{ background: '#000' }}>
              <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%' }}>
                <iframe
                  src={song.youtubeEmbed}
                  title={song.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
                />
              </div>
            </div>

            <div style={{ padding: '1.25rem 2rem', borderBottom: `1px solid ${colors.creamDark}`, display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <VinylRecord gradient={song.gradient} isPlaying={isActive && isPlaying} size={72} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.55rem' }}>
                  <button onClick={() => onPlay(song)} style={{ width: 36, height: 36, borderRadius: '50%', border: 'none', background: isActive && isPlaying ? colors.accent : colors.ink, color: colors.cream, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', flexShrink: 0, transition: 'background 0.2s', paddingLeft: isActive && isPlaying ? 0 : '2px' }}>
                    {isActive && isPlaying ? (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ display: 'block' }}>
                        <line x1="2.5" y1="1" x2="2.5" y2="11" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                        <line x1="9.5" y1="1" x2="9.5" y2="11" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                      </svg>
                    ) : (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ display: 'block', marginLeft: '2px' }}>
                        <polygon points="1,1 11,6 1,11" fill="currentColor"/>
                      </svg>
                    )}
                  </button>
                  <div style={{ flex: 1, height: 4, background: colors.creamDark, borderRadius: 2, cursor: isActive && progress.duration ? 'pointer' : 'default', position: 'relative' }}
                    onClick={(e) => { if (!isActive || !progress.duration) return; const rect = e.currentTarget.getBoundingClientRect(); onSeek(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))); }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: colors.accent, borderRadius: 2, transition: 'width 0.3s linear', pointerEvents: 'none' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: fonts.mono, fontSize: '0.6rem', color: colors.inkSoft }}>{isActive ? formatTime(progress.current) : '0:00'}</span>
                  <span style={{ fontFamily: fonts.mono, fontSize: '0.6rem', color: colors.inkSoft }}>{isActive ? formatTime(progress.duration) : '0:00'}</span>
                </div>
              </div>
            </div>

            <div style={{ padding: '1.25rem 2rem', borderBottom: `1px solid ${colors.creamDark}` }}>
              <div style={{ fontFamily: fonts.mono, fontSize: '0.62rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: colors.inkSoft, marginBottom: '0.75rem' }}>{t.listenOn}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {song.links.map((link, i) => <PlatformLink key={i} link={link} />)}
              </div>
            </div>

            <div style={{ padding: '1.25rem 2rem 2rem' }}>
              <div style={{ fontFamily: fonts.mono, fontSize: '0.62rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: colors.inkSoft, marginBottom: '1rem' }}>{t.lyrics}</div>
              <div style={{ fontFamily: fonts.body, fontSize: '0.96rem', lineHeight: 2.1, color: colors.ink, whiteSpace: 'pre-line' }}>{song.lyric}</div>
              {lang !== 'th' && (lang === 'en' ? song.lyricEn : song.lyricZh) && (
                <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: `1px solid ${colors.creamDark}` }}>
                  <div style={{ fontFamily: fonts.mono, fontSize: '0.58rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: colors.inkSoft, marginBottom: '1rem' }}>
                    {lang === 'en' ? 'English Translation' : '中文翻译'}
                  </div>
                  <div style={{ fontFamily: fonts.body, fontSize: '0.96rem', lineHeight: 2.1, color: colors.inkSoft, whiteSpace: 'pre-line' }}>
                    {lang === 'en' ? song.lyricEn : song.lyricZh}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* TEE SONG — player + links fixed, only lyrics scrolls */
          <>
            <div style={{ padding: '1.25rem 2rem', borderBottom: `1px solid ${colors.creamDark}`, flexShrink: 0, display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <VinylRecord gradient={song.gradient} isPlaying={isActive && isPlaying} size={72} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.55rem' }}>
                  <button onClick={() => onPlay(song)} style={{ width: 36, height: 36, borderRadius: '50%', border: 'none', background: isActive && isPlaying ? colors.accent : colors.ink, color: colors.cream, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', flexShrink: 0, transition: 'background 0.2s', paddingLeft: isActive && isPlaying ? 0 : '2px' }}>
                    {isActive && isPlaying ? (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ display: 'block' }}>
                        <line x1="2.5" y1="1" x2="2.5" y2="11" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                        <line x1="9.5" y1="1" x2="9.5" y2="11" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                      </svg>
                    ) : (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ display: 'block', marginLeft: '2px' }}>
                        <polygon points="1,1 11,6 1,11" fill="currentColor"/>
                      </svg>
                    )}
                  </button>
                  <div style={{ flex: 1, height: 4, background: colors.creamDark, borderRadius: 2, cursor: isActive && progress.duration ? 'pointer' : 'default', position: 'relative' }}
                    onClick={(e) => { if (!isActive || !progress.duration) return; const rect = e.currentTarget.getBoundingClientRect(); onSeek(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))); }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: colors.accent, borderRadius: 2, transition: 'width 0.3s linear', pointerEvents: 'none' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: fonts.mono, fontSize: '0.6rem', color: colors.inkSoft }}>{isActive ? formatTime(progress.current) : '0:00'}</span>
                  <span style={{ fontFamily: fonts.mono, fontSize: '0.6rem', color: colors.inkSoft }}>{isActive ? formatTime(progress.duration) : '0:00'}</span>
                </div>
              </div>
            </div>
            <div style={{ padding: '1.25rem 2rem', borderBottom: `1px solid ${colors.creamDark}`, flexShrink: 0 }}>
              <div style={{ fontFamily: fonts.mono, fontSize: '0.62rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: colors.inkSoft, marginBottom: '0.75rem' }}>{t.listenOn}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {song.links.map((link, i) => <PlatformLink key={i} link={link} />)}
              </div>
            </div>
            <div style={{ padding: '1.25rem 2rem 2rem', overflowY: 'auto', flex: 1 }}>
              <div style={{ fontFamily: fonts.mono, fontSize: '0.62rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: colors.inkSoft, marginBottom: '1rem' }}>{t.lyrics}</div>
              <div style={{ fontFamily: fonts.body, fontSize: '0.96rem', lineHeight: 2.1, color: colors.ink, whiteSpace: 'pre-line' }}>{song.lyric}</div>
              {lang !== 'th' && (lang === 'en' ? song.lyricEn : song.lyricZh) && (
                <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: `1px solid ${colors.creamDark}` }}>
                  <div style={{ fontFamily: fonts.mono, fontSize: '0.58rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: colors.inkSoft, marginBottom: '1rem' }}>
                    {lang === 'en' ? 'English Translation' : '中文翻译'}
                  </div>
                  <div style={{ fontFamily: fonts.body, fontSize: '0.96rem', lineHeight: 2.1, color: colors.inkSoft, whiteSpace: 'pre-line' }}>
                    {lang === 'en' ? song.lyricEn : song.lyricZh}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function MusicPage() {
  const navigate = useNavigate();
  const { lang } = useLang();
  const t = translations[lang].music;
  const audioRef = useRef(null);
  const isPlayingRef = useRef(false);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState({ current: 0, duration: 0 });
  const [selectedSong, setSelectedSong] = useState(null);
  const [showPlaylist, setShowPlaylist] = useState(false);

  useLayoutEffect(() => { window.scrollTo(0, 0); }, []);

  const currentSong = allSongs[currentIdx];

  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);

  // Mount once: attach persistent audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTimeUpdate = () => setProgress(p => ({ ...p, current: audio.currentTime }));
    const onLoadedMetadata = () => setProgress(p => ({ ...p, duration: audio.duration }));
    const onEnded = () => setCurrentIdx(i => (i + 1) % allSongs.length);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
    };
  }, []);

  // Load new track when index changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const song = allSongs[currentIdx];
    audio.src = song?.audioFile || '';
    setProgress({ current: 0, duration: 0 });
    if (isPlayingRef.current && song?.audioFile) {
      audio.play().catch(() => setIsPlaying(false));
    }
  }, [currentIdx]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong?.audioFile) {
      setIsPlaying(p => !p);
      return;
    }
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  }, [isPlaying, currentSong]);

  const handleNext = useCallback(() => {
    setCurrentIdx(i => (i + 1) % allSongs.length);
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentIdx(i => (i - 1 + allSongs.length) % allSongs.length);
  }, []);

  const handleShuffle = useCallback(() => {
    setCurrentIdx(i => {
      let next;
      do { next = Math.floor(Math.random() * allSongs.length); } while (next === i && allSongs.length > 1);
      return next;
    });
    setIsPlaying(true);
  }, []);

  const handleSeek = useCallback((ratio) => {
    const audio = audioRef.current;
    if (!audio || !progress.duration) return;
    audio.currentTime = ratio * progress.duration;
  }, [progress.duration]);

  const selectSong = useCallback((song) => {
    setSelectedSong(song);
  }, []);

  const handleCardPlay = useCallback((song) => {
    const idx = allSongs.findIndex(s => s.id === song.id);
    if (idx === -1) return;
    if (currentIdx === idx) {
      togglePlay();
    } else {
      setCurrentIdx(idx);
      setIsPlaying(true);
    }
  }, [currentIdx, togglePlay]);

  function goBack() {
    navigate('/', { state: { scrollTo: 'selected-works' } });
  }

  const pct = progress.duration ? (progress.current / progress.duration) * 100 : 0;

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${colors.cream}; }

        @keyframes vinylSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .vinyl-spin { animation: vinylSpin 4s linear infinite; }

        @keyframes wf0 { 0%, 100% { height: 4px; } 50% { height: 20px; } }
        @keyframes wf1 { 0%, 100% { height: 7px; } 50% { height: 26px; } }
        @keyframes wf2 { 0%, 100% { height: 5px; } 50% { height: 16px; } }
        @keyframes wf3 { 0%, 100% { height: 10px; } 50% { height: 30px; } }

        .wf-container { display: flex; align-items: center; gap: 3px; height: 34px; flex-shrink: 0; }
        .wf-bar { width: 3px; border-radius: 2px; background: ${colors.accent}; }
        .wf-bar-idle { width: 3px; height: 4px; border-radius: 2px; background: ${colors.creamDark}; }
        .wf-0 { animation: wf0 0.75s ease-in-out infinite; }
        .wf-1 { animation: wf1 0.90s ease-in-out infinite 0.12s; }
        .wf-2 { animation: wf2 0.68s ease-in-out infinite 0.22s; }
        .wf-3 { animation: wf3 1.05s ease-in-out infinite 0.07s; }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(50px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

        .music-modal-sheet {
          background: ${colors.cream};
          width: 100%;
          max-width: 660px;
          max-height: 88vh;
          border-radius: 10px 10px 0 0;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: slideUp 0.38s cubic-bezier(0.34,1.12,0.64,1);
          box-shadow: 0 -8px 48px rgba(61,44,46,0.18);
        }

        .music-player-sticky {
          background: ${colors.cream};
          border-bottom: 1px solid ${colors.creamDark};
          padding: 1.25rem 1.5rem;
        }

        .player-card {
          max-width: 440px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .player-progress-row {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.65rem;
        }

        .player-controls-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.85rem;
        }

        .ctrl-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: ${colors.inkSoft};
          padding: 0.3rem 0.4rem;
          font-size: 1rem;
          transition: color 0.2s;
          line-height: 1;
          -webkit-appearance: none;
          appearance: none;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .ctrl-btn:hover { color: ${colors.ink}; }
        .ctrl-btn-play {
          width: 34px;
          height: 34px;
          background: ${colors.ink};
          color: ${colors.cream} !important;
          border-radius: 50%;
          font-size: 0.85rem;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 0.2s !important;
        }
        .ctrl-btn-play:hover { opacity: 0.82; }

        .progress-bar-wrap {
          flex: 1;
          height: 4px;
          background: ${colors.creamDark};
          border-radius: 2px;
          cursor: pointer;
          position: relative;
        }
        .progress-bar-fill {
          height: 100%;
          background: ${colors.accent};
          border-radius: 2px;
          transition: width 0.3s linear;
          pointer-events: none;
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .playlist-panel {
          max-width: 440px;
          margin: 0.6rem auto 0;
          border-top: 1px solid ${colors.creamDark};
          max-height: 320px;
          overflow-y: auto;
          animation: slideDown 0.25s ease;
        }
        .playlist-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.6rem 0.5rem;
          border-radius: 3px;
          cursor: pointer;
          transition: background 0.15s;
        }
        .playlist-row:hover { background: ${colors.creamDark}; }
        .playlist-row.active { background: ${colors.pinkSoft}; }
        .playlist-section-label {
          font-family: ${fonts.mono};
          font-size: 0.58rem;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: ${colors.inkSoft};
          padding: 0.75rem 0.5rem 0.3rem;
        }
        .ctrl-btn-list {
          width: 30px;
          height: 30px;
          border-radius: 4px;
          font-size: 1rem;
          padding: 0;
          flex-shrink: 0;
        }
        .ctrl-btn-list.active {
          background: ${colors.ink} !important;
          color: ${colors.cream} !important;
        }

        .song-grid-music {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.75rem;
        }

        .section-pad { padding: 4rem; max-width: 1200px; margin: 0 auto; }

        .music-badge {
          display: inline-block;
          fontFamily: ${fonts.mono};
          fontSize: 0.7rem;
          letterSpacing: 0.28em;
          textTransform: uppercase;
          padding: 0.28rem 0.75rem;
          borderRadius: 2px;
          margin-bottom: 0.6rem;
        }

        .back-btn-music {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-family: ${fonts.mono};
          font-size: 0.75rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: ${colors.inkSoft};
          background: none;
          border: none;
          cursor: pointer;
          transition: color 0.2s;
          padding: 0;
        }
        .back-btn-music:hover { color: ${colors.ink}; }

        @keyframes platform-pop {
          0%   { transform: scale(1); }
          30%  { transform: scale(1.22) rotate(-4deg); }
          50%  { transform: scale(1.15) rotate(3deg); }
          70%  { transform: scale(1.18) rotate(-2deg); }
          85%  { transform: scale(1.12) rotate(1deg); }
          100% { transform: scale(1.12) rotate(0deg); }
        }
        @keyframes platform-pop-out {
          0%   { transform: scale(1.12); }
          40%  { transform: scale(0.95); }
          100% { transform: scale(1); }
        }
        .platform-tile-music { animation: platform-pop-out 0.25s ease forwards; }
        .platform-tile-music:hover { animation: platform-pop 0.45s cubic-bezier(0.34,1.56,0.64,1) forwards; }

        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${colors.creamDark}; border-radius: 3px; }

        @media (min-width: 640px) {
          .music-modal-sheet {
            border-radius: 10px;
            margin: 2rem;
            max-height: 85vh;
          }
        }
        @media (max-width: 900px) {
          .song-grid-music { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 580px) {
          .song-grid-music { grid-template-columns: 1fr !important; }
          .section-pad { padding: 2.5rem 1.25rem !important; }
          .music-player-sticky { padding: 0.85rem 1.25rem !important; }
          .music-hero-tj { padding: 7rem 1.5rem 3rem !important; }
        }
      `}</style>

      <audio ref={audioRef} />
      <CursorSparkle />

      {/* Nav */}
      <nav style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.5rem 3rem',
        background: `${colors.cream}ee`,
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${colors.creamDark}`,
      }}>
        <button className="back-btn-music" onClick={goBack}>{t.backNav}</button>
        <span style={{ fontFamily: fonts.display, fontSize: '1.1rem', letterSpacing: '0.15em', color: colors.ink }}>
          Tee · Jaruji
        </span>
      </nav>

      {/* Hero */}
      <div
        className="music-hero-tj"
        style={{
          padding: '10rem 4rem 5rem',
          backgroundImage: `linear-gradient(135deg, rgba(252,228,234,0.75), rgba(220,234,244,0.75)), url(/music-hero-bg.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{
          position: 'absolute',
          right: '-1rem',
          bottom: '-3rem',
          fontFamily: fonts.display,
          fontSize: 'clamp(9rem, 22vw, 19rem)',
          fontStyle: 'italic',
          color: colors.accent,
          opacity: 0.1,
          lineHeight: 1,
          userSelect: 'none',
          pointerEvents: 'none',
        }}>
          M
        </div>

        <div style={{
          fontFamily: fonts.mono,
          fontSize: '0.68rem',
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          color: colors.accent,
          marginBottom: '1rem',
          textShadow: '0 1px 6px rgba(253,246,236,1)',
        }}>
          {t.categoryLabel}
        </div>
        <h1 style={{
          fontFamily: fonts.display,
          fontSize: 'clamp(2.8rem, 7vw, 5rem)',
          fontWeight: 500,
          lineHeight: 1.0,
          letterSpacing: '-0.02em',
          color: colors.ink,
          margin: '0 0 1rem',
          textShadow: '0 1px 4px rgba(253,246,236,1), 0 2px 16px rgba(253,246,236,0.9), 0 4px 30px rgba(253,246,236,0.7)',
        }}>
          {t.titleMain}{' '}
          <span style={{ fontStyle: 'italic', color: colors.accent }}>{t.titleItalic}</span>
        </h1>
        <p style={{
          fontFamily: fonts.body,
          fontSize: '1rem',
          lineHeight: 1.7,
          color: colors.ink,
          maxWidth: '500px',
          margin: 0,
          textShadow: '0 1px 6px rgba(253,246,236,1), 0 2px 14px rgba(253,246,236,0.8)',
        }}>
          {t.subtitle}
        </p>
      </div>

      {/* Sticky Music Player */}
      <div className="music-player-sticky">
        <div className="player-card">
          <div style={{ marginBottom: '1rem' }}>
            <VinylRecord gradient={currentSong.gradient} isPlaying={isPlaying} size={110} />
          </div>

          <div style={{ textAlign: 'center', marginBottom: '0.6rem' }}>
            <div style={{
              fontFamily: fonts.display,
              fontSize: '1.2rem',
              fontWeight: 600,
              color: colors.ink,
            }}>
              {lang !== 'th' ? currentSong.titleEn : currentSong.title}
            </div>
            <div style={{ fontFamily: fonts.body, fontSize: '0.78rem', color: colors.inkSoft, marginTop: '0.2rem' }}>
              {currentSong.artist}
            </div>
          </div>

          <div style={{ marginBottom: '0.6rem' }}>
            <WaveformBars isPlaying={isPlaying} count={12} />
          </div>

          <div className="player-progress-row">
            <span style={{ fontFamily: fonts.mono, fontSize: '0.58rem', color: colors.inkSoft, flexShrink: 0 }}>
              {formatTime(progress.current)}
            </span>
            <div
              className="progress-bar-wrap"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                handleSeek(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)));
              }}
            >
              <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
            </div>
            <span style={{ fontFamily: fonts.mono, fontSize: '0.58rem', color: colors.inkSoft, flexShrink: 0 }}>
              {formatTime(progress.duration)}
            </span>
          </div>

          <div className="player-controls-row">
            <button className="ctrl-btn" onClick={handlePrev} title="ก่อนหน้า">
              <svg width="16" height="14" viewBox="0 0 16 14" fill="none" style={{ display: 'block' }}>
                <line x1="1" y1="1" x2="1" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <polygon points="15,1 4,7 15,13" fill="currentColor"/>
              </svg>
            </button>
            <button
              className="ctrl-btn ctrl-btn-play"
              onClick={togglePlay}
              title={isPlaying ? 'หยุด' : 'เล่น'}
              style={{ width: 44, height: 44 }}
            >
              {isPlaying ? (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ display: 'block' }}>
                  <line x1="3" y1="1" x2="3" y2="13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                  <line x1="11" y1="1" x2="11" y2="13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ display: 'block', marginLeft: '2px' }}>
                  <polygon points="2,1 13,7 2,13" fill="currentColor"/>
                </svg>
              )}
            </button>
            <button className="ctrl-btn" onClick={handleNext} title="ถัดไป">
              <svg width="16" height="14" viewBox="0 0 16 14" fill="none" style={{ display: 'block' }}>
                <polygon points="1,1 12,7 1,13" fill="currentColor"/>
                <line x1="15" y1="1" x2="15" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            {!currentSong.audioFile && (
              <span style={{
                fontFamily: fonts.mono,
                fontSize: '0.52rem',
                letterSpacing: '0.12em',
                color: colors.inkSoft,
                background: colors.creamDark,
                padding: '0.2rem 0.5rem',
                borderRadius: '2px',
                textTransform: 'uppercase',
              }}>
                Demo
              </span>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.75rem', justifyContent: 'center' }}>
            <button
              className="ctrl-btn ctrl-btn-list"
              onClick={handleShuffle}
              title="สุ่มเพลง"
              style={{ flexDirection: 'column', gap: '0.2rem', width: 'auto', height: 'auto', padding: '0.4rem 0.8rem' }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
                <line x1="3" y1="15" x2="16" y2="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <polyline points="12,2 16,2 16,6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                <line x1="3" y1="3" x2="7" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="11" y1="11" x2="16" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <polyline points="16,12 16,16 12,16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
              <span style={{ fontFamily: fonts.mono, fontSize: '0.52rem', letterSpacing: '0.18em', textTransform: 'uppercase' }}>shuffle</span>
            </button>
            <button
              className={`ctrl-btn ctrl-btn-list${showPlaylist ? ' active' : ''}`}
              onClick={() => setShowPlaylist(p => !p)}
              title="รายการเพลง"
              style={{ flexDirection: 'column', gap: '0.2rem', width: 'auto', height: 'auto', padding: '0.4rem 0.8rem' }}
            >
              <svg width="25" height="18" viewBox="0 0 25 18" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
                <line x1="1" y1="2" x2="24" y2="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="1" y1="9" x2="24" y2="9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="1" y1="16" x2="24" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span style={{ fontFamily: fonts.mono, fontSize: '0.52rem', letterSpacing: '0.18em', textTransform: 'uppercase' }}>list</span>
            </button>
          </div>
        </div>

        {/* Playlist panel */}
        {showPlaylist && (
          <div className="playlist-panel">
            <div className="playlist-section-label">TEE SONG</div>
            {teeSongs.map((song, i) => {
              const active = currentSong.id === song.id;
              return (
                <div
                  key={song.id}
                  className={`playlist-row${active ? ' active' : ''}`}
                  onClick={() => {
                    const idx = allSongs.findIndex(s => s.id === song.id);
                    setCurrentIdx(idx);
                    setIsPlaying(true);
                  }}
                >
                  <span style={{
                    fontFamily: fonts.mono,
                    fontSize: '0.62rem',
                    color: active ? colors.accent : colors.inkSoft,
                    width: '1.5rem',
                    textAlign: 'right',
                    flexShrink: 0,
                  }}>
                    {active && isPlaying ? '▶' : String(i + 1).padStart(2, '0')}
                  </span>
                  {song.coverImage && (
                    <img src={song.coverImage} alt="" style={{
                      width: 32, height: 32, borderRadius: '2px',
                      objectFit: 'cover', flexShrink: 0,
                    }} />
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontFamily: fonts.body,
                      fontSize: '0.88rem',
                      fontWeight: active ? 600 : 400,
                      color: active ? colors.ink : colors.ink,
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>
                      {lang !== 'th' ? song.titleEn : song.title}
                    </div>
                    <div style={{
                      fontFamily: fonts.body,
                      fontSize: '0.72rem',
                      color: colors.inkSoft,
                    }}>
                      {song.artist}
                    </div>
                  </div>
                  <span style={{
                    fontFamily: fonts.mono,
                    fontSize: '0.55rem',
                    letterSpacing: '0.15em',
                    color: colors.cream,
                    background: colors.accent,
                    padding: '0.15rem 0.45rem',
                    borderRadius: '2px',
                    flexShrink: 0,
                    textTransform: 'uppercase',
                  }}>
                    TEE
                  </span>
                </div>
              );
            })}

            <div className="playlist-section-label">MUSIC VIDEO</div>
            {musicVideos.map((song, i) => {
              const active = currentSong.id === song.id;
              return (
                <div
                  key={song.id}
                  className={`playlist-row${active ? ' active' : ''}`}
                  onClick={() => {
                    const idx = allSongs.findIndex(s => s.id === song.id);
                    setCurrentIdx(idx);
                    setIsPlaying(true);
                  }}
                >
                  <span style={{
                    fontFamily: fonts.mono,
                    fontSize: '0.62rem',
                    color: active ? colors.accent : colors.inkSoft,
                    width: '1.5rem',
                    textAlign: 'right',
                    flexShrink: 0,
                  }}>
                    {active && isPlaying ? '▶' : String(i + 1).padStart(2, '0')}
                  </span>
                  {song.coverImage && (
                    <img src={song.coverImage} alt="" style={{
                      width: 32, height: 32, borderRadius: '2px',
                      objectFit: 'cover', flexShrink: 0,
                    }} />
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontFamily: fonts.body,
                      fontSize: '0.88rem',
                      fontWeight: active ? 600 : 400,
                      color: colors.ink,
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>
                      {lang !== 'th' ? song.titleEn : song.title}
                    </div>
                    <div style={{
                      fontFamily: fonts.body,
                      fontSize: '0.72rem',
                      color: colors.inkSoft,
                    }}>
                      {song.artist}
                    </div>
                  </div>
                  <span style={{
                    fontFamily: fonts.mono,
                    fontSize: '0.55rem',
                    letterSpacing: '0.15em',
                    color: colors.ink,
                    background: colors.blue,
                    padding: '0.15rem 0.45rem',
                    borderRadius: '2px',
                    flexShrink: 0,
                    textTransform: 'uppercase',
                  }}>
                    MV
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* TEE SONG Section */}
      <div className="section-pad">
        <div style={{ marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-block',
            fontFamily: fonts.mono,
            fontSize: '0.7rem',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: colors.cream,
            background: colors.accent,
            padding: '0.3rem 0.8rem',
            borderRadius: '2px',
            marginBottom: '0.7rem',
          }}>
            TEE SONG
          </div>
          <h2 style={{
            fontFamily: fonts.display,
            fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
            fontWeight: 500,
            color: colors.ink,
            lineHeight: 1.1,
          }}>
            {t.teeSongTitle}
          </h2>
          <p style={{ fontFamily: fonts.body, fontSize: '0.88rem', color: colors.inkSoft, marginTop: '0.35rem' }}>
            {t.teeSongSub}
          </p>
        </div>

        <div className="song-grid-music">
          {teeSongs.map((song, i) => (
            <SongCard
              key={song.id}
              song={song}
              index={i}
              isActive={currentSong.id === song.id}
              onSelect={selectSong}
              lang={lang}
            />
          ))}
        </div>
      </div>

      {/* Divider */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 4rem' }}>
        <div style={{ borderTop: `1px solid ${colors.creamDark}` }} />
      </div>

      {/* Music Video Section */}
      <div className="section-pad">
        <div style={{ marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-block',
            fontFamily: fonts.mono,
            fontSize: '0.7rem',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: colors.ink,
            background: colors.blue,
            padding: '0.3rem 0.8rem',
            borderRadius: '2px',
            marginBottom: '0.7rem',
          }}>
            Music Video
          </div>
          <h2 style={{
            fontFamily: fonts.display,
            fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
            fontWeight: 500,
            color: colors.ink,
            lineHeight: 1.1,
          }}>
            {t.mvTitle}
          </h2>
          <p style={{ fontFamily: fonts.body, fontSize: '0.88rem', color: colors.inkSoft, marginTop: '0.35rem' }}>
            {t.mvSub}
          </p>
        </div>

        <div className="song-grid-music">
          {musicVideos.map((song, i) => (
            <SongCard
              key={song.id}
              song={song}
              index={i}
              isActive={currentSong.id === song.id}
              onSelect={selectSong}
              lang={lang}
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: '4rem', textAlign: 'center', borderTop: `1px solid ${colors.creamDark}`, marginTop: '1rem' }}>
        <button
          onClick={goBack}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            background: colors.ink,
            color: colors.cream,
            padding: '1rem 2.5rem',
            borderRadius: '2px',
            fontFamily: fonts.mono,
            fontSize: '0.78rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            gap: '0.5rem',
            cursor: 'pointer',
            border: 'none',
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          {t.backButton}
        </button>
      </div>

      {/* Song Detail Modal */}
      {selectedSong && (
        <SongModal
          song={selectedSong}
          onClose={() => setSelectedSong(null)}
          isActive={currentSong.id === selectedSong.id}
          isPlaying={isPlaying}
          progress={progress}
          onPlay={handleCardPlay}
          t={t}
          lang={lang}
          onSeek={handleSeek}
        />
      )}
    </>
  );
}
