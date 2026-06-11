import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { colors, fonts } from '../styles/theme';
import { useLang } from '../context/LanguageContext';
import { translations } from '../data/translations';
import CursorSparkle from '../components/CursorSparkle';
import { SiNetflix, SiYoutube, SiSpotify, SiApplemusic } from 'react-icons/si';
import { eventsData, EVENT_TYPES } from '../data/eventsData';
import { SHOWS } from '../data/performanceData';
import { allSongs } from '../data/musicData';

/* ── Category constants ──────────────────────────────────── */
const CAT_COLORS = { event: '#d4607a', acting: '#4a8fb5', music: '#b07d3a' };
const CAT_BG     = { event: '#fce4ea', acting: '#dceaf4', music: '#f5ead8' };
const CAT_GRAD   = {
  event:  ['#f4b8c8', '#fce4ea'],
  acting: ['#aecde0', '#dceaf4'],
  music:  ['#e8c896', '#f5ead8'],
};
const CAT_LETTER = { event: 'E', acting: 'P', music: 'M' };

const PLATFORM_CONFIG = {
  Netflix:              { bg: '#E50914' },
  'Ch3+':              { bg: '#000000' },
  'AIS Play':          { bg: '#000000' },
  YouTube:             { bg: '#FF0000' },
  'YouTube (ENG SUB)': { bg: '#FF0000' },
};

/* ── Music year mapping (Thai Buddhist) ─────────────────── */
const SONG_YEARS = {
  'ts-1': 2568, 'ts-2': 2568, 'ts-3': 2562,
  'ts-4': 2568, 'ts-5': 2562, 'ts-6': 2562,
  'mv-1': 2568, 'mv-2': 2568, 'mv-3': 2563,
  'mv-4': 2562, 'mv-5': 2560,
};

/* ── Unified items (sorted ascending by year) ───────────── */
const allItems = [
  ...eventsData.map(e => ({ ...e, category: 'event' })),
  ...SHOWS.map(s => ({ ...s, category: 'acting' })),
  ...allSongs.map(s => ({ ...s, category: 'music', year: SONG_YEARS[s.id] || 2568 })),
].sort((a, b) => a.year !== b.year ? a.year - b.year : (a.category === 'event' ? -1 : 1));

/* ── Helpers ─────────────────────────────────────────────── */
function displayYear(year, lang) {
  return lang === 'th' ? year : year - 543;
}

function ev(event, field, lang) {
  if (lang === 'en') return event[field + 'En'] || event[field];
  if (lang === 'zh') return event[field + 'Zh'] || event[field + 'En'] || event[field];
  return event[field];
}

function cardImage(item) {
  if (item.category === 'music') return item.coverImage;
  return item.image || null;
}

function cardTitle(item, lang) {
  if (item.category === 'acting') return lang === 'th' ? item.titleTh : item.titleEn;
  if (item.category === 'music') return lang === 'th' ? item.title : (item.titleEn || item.title);
  return ev(item, 'title', lang);
}

function cardSub(item, lang) {
  if (item.category === 'acting') {
    const labels = {
      series:  { th: 'ซีรีส์',     en: 'Series',  zh: '剧集' },
      movie:   { th: 'ภาพยนตร์',   en: 'Movie',   zh: '电影' },
      variety: { th: 'วาไรตี้/ทราเวล', en: 'Travel', zh: '旅行' },
    };
    return labels[item.type]?.[lang] || item.type;
  }
  if (item.category === 'music') return item.artist;
  return lang === 'th' ? item.date : (item.dateEn || item.date || '');
}

/* ── Vinyl record ────────────────────────────────────────── */
function VinylRecord({ gradient, isPlaying, size = 72 }) {
  const [c1, c2] = gradient || ['#f4b8c8', '#fce4ea'];
  return (
    <div
      className={isPlaying ? 'vinyl-spin' : ''}
      style={{
        width: size, height: size, borderRadius: '50%', flexShrink: 0,
        background: `radial-gradient(circle at center,
          #1a1a1a 0%,#1a1a1a 20%,
          rgba(255,255,255,0.07) 21%,rgba(255,255,255,0.07) 22%,
          #111 23%,#111 26%,rgba(255,255,255,0.05) 27%,rgba(255,255,255,0.05) 28%,
          #111 29%,#111 32%,rgba(255,255,255,0.05) 33%,rgba(255,255,255,0.05) 34%,
          #111 35%,#111 38%,rgba(255,255,255,0.05) 39%,rgba(255,255,255,0.05) 40%,
          #111 41%,#111 44%,rgba(255,255,255,0.05) 45%,rgba(255,255,255,0.05) 46%,
          #111 47%,#111 50%)`,
        position: 'relative',
        boxShadow: isPlaying
          ? `0 0 28px ${c1}70, 0 8px 32px rgba(0,0,0,0.4)`
          : '0 4px 16px rgba(0,0,0,0.28)',
        transition: 'box-shadow 0.6s ease',
      }}
    >
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%,-50%)',
        width: '40%', height: '40%', borderRadius: '50%',
        background: `radial-gradient(circle at 38% 38%,${c1},${c2})`,
        border: '2px solid rgba(255,255,255,0.18)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.3)',
      }}>
        <div style={{ width: size * 0.055, height: size * 0.055, borderRadius: '50%', background: 'rgba(255,255,255,0.75)' }} />
      </div>
    </div>
  );
}

/* ── Platform icon (for event modal links) ──────────────── */
function EventPlatformIcon({ platform, size = 26 }) {
  const containPlatforms = ['Chula', 'TST'];
  const imgStyle = { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: containPlatforms.includes(platform) ? 'contain' : 'cover', borderRadius: 'inherit', padding: containPlatforms.includes(platform) ? '8%' : 0 };
  if (platform === 'YouTube') return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="white">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
  if (platform === 'Facebook') return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="white">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
  if (platform === 'Instagram') return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="white">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
  if (platform === 'X') return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="white">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
  if (platform === 'Netflix') return <SiNetflix size={size} color="white" />;
  if (platform === 'Spotify') return <SiSpotify size={size} color="white" />;
  if (platform === 'Apple Music' || platform === 'iTunes') return <SiApplemusic size={size} color="white" />;
  if (platform === 'LINE Today') return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="white">
      <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
    </svg>
  );
  const imgPlatforms = {
    'TrueID':      '/platforms/trueid.png',
    '3Ch':         '/platforms/ch3plus.png',
    'Workpoint':   '/platforms/workpoint.png',
    'Siam Center': '/platforms/siamcenter.png',
    'Pantip':      '/platforms/pantip.png',
    'AIS PLAY':    '/platforms/ais-play.png',
    'Mangozero':   '/platforms/mangozero.png',
    'Suara':       '/platforms/suara.png',
    'MGR Online':  '/platforms/mgronline.png',
    'Siam Turakij':'/platforms/siamturakij.png',
    'Thaipost':    '/platforms/thaipost.png',
    'Sanook':      '/platforms/sanook.png',
    'Reeborn':     '/platforms/reeborn.png',
    'Dek-D':       '/platforms/dek-d.png',
    'Taokaenoi':   '/platforms/taokaenoi.png',
    'Chula':       '/platforms/chula.png',
    'TST':         '/platforms/tst.png',
  };
  if (imgPlatforms[platform]) return <img src={imgPlatforms[platform]} alt={platform} style={imgStyle} />;
  return (
    <span style={{ fontSize: size * 0.55, fontWeight: 700, color: 'white', lineHeight: 1 }}>
      {platform[0]}
    </span>
  );
}

/* ── Platform icon (for show modals) ────────────────────── */
function getPlatformIcon(name, size = 22) {
  if (name === 'Netflix') return <SiNetflix size={size} />;
  if (name === 'YouTube (ENG SUB)') return (
    <>
      <SiYoutube size={size} />
      <span style={{ fontFamily: fonts.mono, fontSize: '0.38rem', letterSpacing: '0.08em', opacity: 0.9, lineHeight: 1, marginTop: 2 }}>ENG</span>
    </>
  );
  if (name.startsWith('YouTube')) return <SiYoutube size={size} />;
  if (name === 'Ch3+') return (
    <img src="/platforms/ch3plus.png" alt="Ch3+"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }} />
  );
  if (name === 'AIS Play') return (
    <img src="/platforms/ais-play.png" alt="AIS Play"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }} />
  );
  return <span style={{ fontFamily: fonts.mono, fontSize: '0.65rem', fontWeight: 700 }}>{name}</span>;
}

/* ══════════════════════════════════════════════════════════
   EVENT MODAL
═══════════════════════════════════════════════════════════ */
function EventModal({ item, lang, onClose }) {
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const typeInfo  = EVENT_TYPES[item.type];
  const typeLabel = lang === 'zh' ? typeInfo?.label.zh : lang === 'en' ? typeInfo?.label.en : typeInfo?.label.th;
  const hasImage  = !!item.image;

  return (
    <div className="tl-modal-bg" onClick={onClose}>
      <div className="tl-modal" style={{ maxWidth: 620 }} onClick={e => e.stopPropagation()}>
        {/* ── Image / gradient header ── */}
        <div style={{
          position: 'relative', minHeight: hasImage ? 0 : 180,
          background: hasImage ? 'none' : `linear-gradient(135deg, ${typeInfo?.bg || CAT_BG.event}, ${colors.cream})`,
          overflow: 'hidden',
        }}>
          {hasImage ? (
            <img src={item.image} alt={item.title}
              style={{ width: '100%', height: 220, objectFit: 'cover', objectPosition: 'top center', display: 'block' }} />
          ) : (
            <>
              <div style={{ position: 'absolute', width: 260, height: 260, borderRadius: '50%', border: '60px solid rgba(255,255,255,0.12)', top: -90, right: -70, pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', width: 160, height: 160, borderRadius: '50%', border: '40px solid rgba(255,255,255,0.08)', bottom: -55, left: -45, pointerEvents: 'none' }} />
              <div style={{ fontFamily: fonts.display, fontSize: '9rem', fontStyle: 'italic', color: typeInfo?.color || CAT_COLORS.event, opacity: 0.18, lineHeight: 1, userSelect: 'none', padding: '2.5rem', paddingBottom: '1.5rem' }}>
                E
              </div>
            </>
          )}
          {/* Year badge */}
          <div style={{ position: 'absolute', top: '1rem', left: '1rem', fontFamily: fonts.mono, fontSize: '.72rem', letterSpacing: '.2em', background: 'rgba(255,255,255,0.92)', padding: '.3rem .8rem', color: colors.ink }}>
            {displayYear(item.year, lang)}
          </div>
          {/* Type badge */}
          {typeInfo && (
            <div style={{ position: 'absolute', top: '1rem', right: '3rem', fontFamily: fonts.mono, fontSize: '.62rem', letterSpacing: '.18em', textTransform: 'uppercase', background: typeInfo.bg, color: typeInfo.color, padding: '.25rem .65rem' }}>
              {typeLabel}
            </div>
          )}
          <button className="tl-close" onClick={onClose}>×</button>
        </div>

        {/* ── Body ── */}
        <div style={{ padding: '1.75rem 2rem 2.25rem', overflowY: 'auto', maxHeight: 'calc(88vh - 220px)' }}>
          <h2 style={{ fontFamily: fonts.display, fontSize: '1.7rem', fontWeight: 700, color: colors.ink, lineHeight: 1.1, marginBottom: '1rem' }}>
            {ev(item, 'title', lang)}
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '.5rem', fontFamily: fonts.body, fontSize: '.9rem', color: colors.inkSoft }}>
              <span style={{ flexShrink: 0 }}>📅</span>
              <span>{lang === 'th' ? item.date : (item.dateEn || item.date)}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '.5rem', fontFamily: fonts.body, fontSize: '.9rem', color: colors.inkSoft }}>
              <span style={{ flexShrink: 0 }}>📍</span>
              <span>{ev(item, 'location', lang)}</span>
            </div>
          </div>

          <p style={{ fontFamily: fonts.body, fontSize: '.95rem', lineHeight: 1.85, color: colors.ink, marginBottom: '1.5rem' }}>
            {ev(item, 'detail', lang)}
          </p>

          <div style={{ borderTop: `1px solid ${colors.creamDark}`, paddingTop: '1rem' }}>
            <div style={{ fontFamily: fonts.mono, fontSize: '.62rem', letterSpacing: '.2em', textTransform: 'uppercase', color: colors.inkSoft, marginBottom: '.75rem' }}>
              Links
            </div>
            {item.links?.length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.75rem' }}>
                {item.links.map((link, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.3rem' }}>
                    <a href={link.url} target="_blank" rel="noopener noreferrer"
                      title={link.label}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        width: 56, height: 56, borderRadius: '12px',
                        background: link.platform === 'Instagram'
                          ? 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)'
                          : link.color || typeInfo?.color || colors.ink,
                        textDecoration: 'none',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        position: 'relative', overflow: 'hidden',
                        flexShrink: 0,
                        transition: 'transform 0.15s, box-shadow 0.15s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)'; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)'; }}
                    >
                      <EventPlatformIcon platform={link.platform} size={26} />
                    </a>
                    <span style={{ fontFamily: fonts.mono, fontSize: '.5rem', letterSpacing: '.1em', textTransform: 'uppercase', color: colors.inkSoft, maxWidth: 56, textAlign: 'center', lineHeight: 1.2 }}>
                      {link.label}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ fontFamily: fonts.body, fontSize: '.85rem', color: colors.inkSoft, fontStyle: 'italic' }}>—</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SHOW MODAL
═══════════════════════════════════════════════════════════ */
function ShowModal({ item, lang, tPerf, onClose }) {
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const primaryTitle   = lang === 'th' ? item.titleTh : item.titleEn;
  const secondaryTitle = lang === 'th' ? item.titleEn : item.titleTh;
  const secondaryIsThai = lang !== 'th';
  const typeLabel = item.type === 'movie' ? tPerf.typeMovie : item.type === 'variety' ? tPerf.typeVariety : tPerf.typeSeries;
  const summary   = lang === 'zh' ? (item.summaryZh || item.summaryEn) : lang === 'en' ? item.summaryEn : item.summaryTh;

  return (
    <div className="tl-modal-bg" onClick={onClose}>
      <div className="tl-modal show-modal-tl" style={{ maxWidth: 900 }} onClick={e => e.stopPropagation()}>
        <div style={{ overflowY: 'auto', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
          {/* ── Sticky header ── */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem',
            padding: '1.6rem 1.75rem',
            borderBottom: `1px solid ${colors.creamDark}`,
            position: 'sticky', top: 0,
            background: `linear-gradient(135deg, ${item.gradient[0]}, ${item.gradient[1]}, ${colors.cream} 70%)`,
            zIndex: 10,
          }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: fonts.mono, fontSize: '.65rem', letterSpacing: '.3em', color: colors.accent, marginBottom: '.4rem' }}>
                {typeLabel} · {displayYear(item.year, lang)}
              </div>
              <h2 style={{ fontFamily: secondaryIsThai ? fonts.body : fonts.display, fontSize: 'clamp(1.4rem,3vw,1.9rem)', fontWeight: 700, color: colors.ink, lineHeight: 1.1, marginBottom: '.3rem' }}>
                {primaryTitle}
              </h2>
              <p style={{ fontFamily: secondaryIsThai ? fonts.body : fonts.display, fontSize: '1rem', fontStyle: secondaryIsThai ? 'normal' : 'italic', color: colors.inkSoft }}>
                {secondaryTitle}
              </p>
            </div>
            <button onClick={onClose}
              style={{ flexShrink: 0, width: 36, height: 36, borderRadius: '50%', border: `1px solid ${colors.creamDark}`, background: 'transparent', cursor: 'pointer', fontSize: '1.2rem', color: colors.inkSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
          </div>

          {/* ── Two-column body ── */}
          <div className="show-modal-body-tl">
            {/* Left: poster + platforms */}
            <div className="show-modal-left-tl">
              {/* Poster */}
              <div style={{ width: '100%', aspectRatio: '2/3', background: `linear-gradient(160deg,${item.gradient[0]},${item.gradient[1]})`, borderRadius: 4, overflow: 'hidden', position: 'relative', boxShadow: '0 4px 20px rgba(0,0,0,0.12)' }}>
                {(item.posterImage || item.image) && (
                  <img src={item.posterImage || item.image} alt={item.titleTh}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }} />
                )}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, background: item.accentColor }} />
              </div>
              {/* Platforms */}
              <div>
                <div style={{ fontFamily: fonts.mono, fontSize: '.62rem', letterSpacing: '.25em', textTransform: 'uppercase', color: colors.inkSoft, marginBottom: '.65rem' }}>
                  {tPerf.watchOn}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.4rem' }}>
                  {item.platforms.map((p, i) => (
                    <a key={i} href={p.url} target="_blank" rel="noopener noreferrer" title={p.name}
                      className="platform-tile-tl"
                      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1, width: 54, height: 54, background: PLATFORM_CONFIG[p.name]?.bg ?? p.color, color: '#fff', borderRadius: 8, textDecoration: 'none', position: 'relative', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                      {getPlatformIcon(p.name, 26)}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: trailer + summary */}
            <div style={{ flex: 1, minWidth: 0, padding: '1.5rem 1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Trailer */}
              <div>
                <div style={{ fontFamily: fonts.mono, fontSize: '.62rem', letterSpacing: '.25em', textTransform: 'uppercase', color: colors.accent, marginBottom: '.65rem' }}>
                  {tPerf.trailerLabel}
                </div>
                {item.trailerUrl ? (
                  <div style={{ position: 'relative', paddingTop: '56.25%', borderRadius: 4, overflow: 'hidden', background: '#000' }}>
                    <iframe src={item.trailerUrl} title={`${item.titleEn} trailer`}
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                  </div>
                ) : (
                  <div style={{ aspectRatio: '16/9', background: `linear-gradient(135deg,${item.gradient[0]}44,${item.gradient[1]}44)`, border: `1px dashed ${item.accentColor}`, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontFamily: fonts.mono, fontSize: '.65rem', letterSpacing: '.2em', color: colors.inkSoft, textTransform: 'uppercase' }}>{tPerf.noTrailer}</span>
                  </div>
                )}
              </div>
              {/* Synopsis */}
              {lang === 'th' ? (
                <>
                  <div>
                    <div style={{ fontFamily: fonts.mono, fontSize: '.62rem', letterSpacing: '.25em', textTransform: 'uppercase', color: colors.accent, marginBottom: '.6rem' }}>
                      {tPerf.summaryLabel}
                    </div>
                    <p style={{ fontFamily: fonts.body, fontSize: '.95rem', lineHeight: 1.85, color: colors.ink }}>
                      {item.summaryTh}
                    </p>
                  </div>
                  <div>
                    <div style={{ fontFamily: fonts.mono, fontSize: '.62rem', letterSpacing: '.25em', textTransform: 'uppercase', color: colors.accent, marginBottom: '.6rem' }}>
                      {tPerf.synopsisLabel}
                    </div>
                    <p style={{ fontFamily: fonts.body, fontSize: '.95rem', lineHeight: 1.85, color: colors.ink, fontStyle: 'italic' }}>
                      {item.summaryEn}
                    </p>
                  </div>
                </>
              ) : (
                <div>
                  <div style={{ fontFamily: fonts.mono, fontSize: '.62rem', letterSpacing: '.25em', textTransform: 'uppercase', color: colors.accent, marginBottom: '.6rem' }}>
                    {tPerf.synopsisLabel}
                  </div>
                  <p style={{ fontFamily: fonts.body, fontSize: '.95rem', lineHeight: 1.85, color: colors.ink }}>
                    {summary}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MUSIC MODAL
═══════════════════════════════════════════════════════════ */
function MusicModal({ item, lang, onClose }) {
  const audioRef   = useRef(null);
  const [isPlaying,    setIsPlaying]    = useState(false);
  const [currentTime,  setCurrentTime]  = useState(0);
  const [duration,     setDuration]     = useState(0);

  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    return () => { if (audioRef.current) audioRef.current.pause(); };
  }, []);

  function togglePlay() {
    if (!audioRef.current) return;
    if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); }
    else { audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {}); }
  }

  function handleSeek(e) {
    if (!audioRef.current || !duration) return;
    const rect  = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audioRef.current.currentTime = ratio * duration;
  }

  function fmt(s) {
    if (!s || isNaN(s)) return '0:00';
    return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  }

  const title = lang === 'th' ? item.title : (item.titleEn || item.title);
  const lyric       = item.lyric;
  const lyricTrans  = lang === 'zh' ? (item.lyricZh || item.lyricEn)
                    : lang === 'en' ? item.lyricEn
                    : null;

  return (
    <div className="tl-modal-bg" onClick={onClose}>
      <div className="tl-modal" style={{ maxWidth: 560 }} onClick={e => e.stopPropagation()}>
        <audio ref={audioRef} src={item.audioFile}
          onTimeUpdate={() => audioRef.current && setCurrentTime(audioRef.current.currentTime)}
          onLoadedMetadata={() => audioRef.current && setDuration(audioRef.current.duration)}
          onEnded={() => { setIsPlaying(false); setCurrentTime(0); }} />

        <div style={{ overflowY: 'auto', maxHeight: '90vh' }}>
          {/* ── Cover header ── */}
          <div style={{ position: 'relative', height: 220, background: `linear-gradient(135deg,${item.gradient?.[0] || '#f4b8c8'},${item.gradient?.[1] || '#fce4ea'})`, overflow: 'hidden' }}>
            {item.coverImage && (
              <img src={item.coverImage} alt={item.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            )}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(61,44,46,0.72) 0%, transparent 58%)' }} />
            <div style={{ position: 'absolute', top: '1rem', left: '1rem', fontFamily: fonts.mono, fontSize: '.72rem', letterSpacing: '.2em', background: 'rgba(255,255,255,0.92)', padding: '.3rem .8rem', color: colors.ink }}>
              {displayYear(item.year, lang)}
            </div>
            <button className="tl-close" onClick={onClose}>×</button>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.25rem 1.5rem' }}>
              <h2 style={{ fontFamily: fonts.display, fontSize: '1.65rem', fontWeight: 700, color: '#fff', lineHeight: 1.1, marginBottom: '.25rem' }}>{title}</h2>
              <p style={{ fontFamily: fonts.body, fontSize: '.85rem', color: 'rgba(255,255,255,0.82)' }}>{item.artist}</p>
            </div>
          </div>

          {/* ── Audio player ── */}
          <div style={{ padding: '1.25rem 1.75rem', borderBottom: `1px solid ${colors.creamDark}`, display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <VinylRecord gradient={item.gradient} isPlaying={isPlaying} size={72} />
            <div style={{ flex: 1, minWidth: 0 }}>
              {/* Progress bar */}
              <div onClick={handleSeek}
                style={{ height: 6, background: colors.creamDark, borderRadius: 3, cursor: 'pointer', marginBottom: '.75rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, borderRadius: 3, width: duration ? `${(currentTime / duration) * 100}%` : '0%', background: `linear-gradient(to right,${colors.pink},${colors.accent})`, transition: 'width .1s linear' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
                <button onClick={togglePlay}
                  style={{ width: 40, height: 40, borderRadius: '50%', background: colors.ink, color: colors.cream, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>
                  {isPlaying ? '⏸' : '▶'}
                </button>
                <span style={{ fontFamily: fonts.mono, fontSize: '.72rem', letterSpacing: '.06em', color: colors.inkSoft }}>
                  {fmt(currentTime)} / {fmt(duration)}
                </span>
              </div>
            </div>
          </div>

          {/* ── Links ── */}
          {item.links?.length > 0 && (
            <div style={{ padding: '1rem 1.75rem', borderBottom: `1px solid ${colors.creamDark}` }}>
              <div style={{ fontFamily: fonts.mono, fontSize: '.62rem', letterSpacing: '.2em', textTransform: 'uppercase', color: colors.inkSoft, marginBottom: '.75rem' }}>
                Links
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.75rem' }}>
                {item.links.map((link, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.3rem' }}>
                    <a href={link.url} target="_blank" rel="noopener noreferrer"
                      title={link.label}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        width: 56, height: 56, borderRadius: '12px',
                        background: link.platform === 'Instagram'
                          ? 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)'
                          : link.color,
                        textDecoration: 'none',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        position: 'relative', overflow: 'hidden',
                        flexShrink: 0,
                        transition: 'transform 0.15s, box-shadow 0.15s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)'; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)'; }}
                    >
                      <EventPlatformIcon platform={link.platform} size={26} />
                    </a>
                    <span style={{ fontFamily: fonts.mono, fontSize: '.5rem', letterSpacing: '.1em', textTransform: 'uppercase', color: colors.inkSoft, maxWidth: 56, textAlign: 'center', lineHeight: 1.2 }}>
                      {link.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Lyrics ── */}
          {lyric && (
            <div style={{ padding: '1.5rem 1.75rem 2rem' }}>
              <div style={{ fontFamily: fonts.mono, fontSize: '.62rem', letterSpacing: '.25em', textTransform: 'uppercase', color: colors.accent, marginBottom: '1rem' }}>
                เนื้อเพลง
              </div>
              <pre style={{ fontFamily: fonts.body, fontSize: '.9rem', lineHeight: 1.92, color: colors.ink, whiteSpace: 'pre-wrap', margin: 0 }}>
                {lyric}
              </pre>
              {lyricTrans && (
                <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: `1px solid ${colors.creamDark}` }}>
                  <div style={{ fontFamily: fonts.mono, fontSize: '.58rem', letterSpacing: '.28em', textTransform: 'uppercase', color: colors.inkSoft, marginBottom: '1rem' }}>
                    {lang === 'en' ? 'English Translation' : '中文翻译'}
                  </div>
                  <pre style={{ fontFamily: fonts.body, fontSize: '.9rem', lineHeight: 1.92, color: colors.inkSoft, whiteSpace: 'pre-wrap', margin: 0 }}>
                    {lyricTrans}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════ */
export default function TimelinePage() {
  const [searchParams] = useSearchParams();
  const navigate       = useNavigate();
  const { lang }       = useLang();
  const t  = translations[lang].timeline;
  const tp = translations[lang].profile;
  const tPerf = translations[lang].performance;

  useLayoutEffect(() => { window.scrollTo(0, 0); }, []);

  const [filter,   setFilter]   = useState(searchParams.get('type') || 'all');
  const [selected, setSelected] = useState(null);
  const [progress, setProgress] = useState(0);
  const [showTop,  setShowTop]  = useState(false);
  const [heroIn,   setHeroIn]   = useState(false);
  const [visited,  setVisited]  = useState(new Set());

  const timelineRef    = useRef(null);
  const cardRefs       = useRef([]);
  const yearRefs       = useRef([]);
  const yearGroupRefs  = useRef([]);

  /* ── hero entrance ── */
  useEffect(() => { const id = setTimeout(() => setHeroIn(true), 80); return () => clearTimeout(id); }, []);

  /* ── scroll progress ── */
  useEffect(() => {
    const onScroll = () => {
      const el = timelineRef.current;
      if (!el) return;
      const rect       = el.getBoundingClientRect();
      const navH       = 72;
      const scrolledIn = Math.max(0, navH - rect.top);
      const totalScroll = Math.max(1, el.offsetHeight - window.innerHeight + navH);
      setProgress(Math.min(1, scrolledIn / totalScroll));
      setShowTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [filter]);

  /* ── auto-checkpoint ── */
  useEffect(() => {
    const tl = timelineRef.current;
    if (!tl) return;
    setVisited(prev => {
      const next    = new Set(prev);
      let changed   = false;
      yearGroupRefs.current.forEach((el, yi) => {
        if (!el) return;
        const year = years[yi];
        if (year && el.offsetTop <= progress * tl.offsetHeight && !next.has(year)) {
          next.add(year); changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [progress]);

  /* ── card & year entrance (IntersectionObserver) ── */
  useEffect(() => {
    const cards = cardRefs.current.filter(Boolean);
    const yrs   = yearRefs.current.filter(Boolean);

    cards.forEach((el, i) => {
      const isRight = i % 2 === 1;
      el.style.opacity    = '0';
      el.style.transform  = `translateX(${isRight ? 28 : -28}px) translateY(16px) scale(0.96)`;
      el.style.transition = `opacity .6s cubic-bezier(.22,.68,0,1.2) ${i * 30}ms, transform .65s cubic-bezier(.22,.68,0,1.2) ${i * 30}ms`;
    });
    yrs.forEach(el => { el.style.opacity = '0'; el.style.animation = 'none'; });

    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          if (e.target.classList.contains('tl-year-row')) {
            e.target.style.animation = 'tl-year-pop .65s cubic-bezier(.22,.68,0,1.2) both';
            const line = e.target.querySelector('.tl-year-line');
            if (line) line.style.transform = 'scaleX(1)';
          } else {
            e.target.style.opacity   = '1';
            e.target.style.transform = 'translateX(0) translateY(0) scale(1)';
          }
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

    [...cards, ...yrs].forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [filter]);

  /* ── modal scroll lock ── */
  useEffect(() => {
    document.body.style.overflow = selected ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [selected]);

  /* ── data ── */
  const filtered   = filter === 'all' ? allItems : allItems.filter(e => e.category === filter);
  const years      = [...new Set(filtered.map(e => e.year))].sort((a, b) => a - b);
  const filterList = [
    { key: 'all',    label: t.filterAll },
    { key: 'event',  label: tp.journeyLegend.event },
    { key: 'acting', label: tp.journeyLegend.acting },
    { key: 'music',  label: tp.journeyLegend.music },
  ];

  function goBack()        { navigate('/', { state: { scrollTo: 'selected-works' } }); }
  function scrollToTop()   { window.scrollTo({ top: 0, behavior: 'smooth' }); }
  function changeFilter(k) { cardRefs.current = []; yearRefs.current = []; yearGroupRefs.current = []; setVisited(new Set()); setFilter(k); }

  function isYearPassed(yi) {
    const el = yearGroupRefs.current[yi];
    const tl = timelineRef.current;
    if (!el || !tl) return false;
    return el.offsetTop <= progress * tl.offsetHeight;
  }

  /* ── modal render ── */
  function renderModal() {
    if (!selected) return null;
    if (selected.category === 'event')  return <EventModal  item={selected} lang={lang} onClose={() => setSelected(null)} />;
    if (selected.category === 'acting') return <ShowModal   item={selected} lang={lang} tPerf={tPerf} onClose={() => setSelected(null)} />;
    if (selected.category === 'music')  return <MusicModal  item={selected} lang={lang} onClose={() => setSelected(null)} />;
    return null;
  }

  let cardIdx = 0;
  let yearIdx = 0;

  /* ──────────────────────────────────────────────────────── */
  return (
    <>
      <style>{`
        * { box-sizing:border-box; margin:0; padding:0; }
        body { background:${colors.cream}; }

        @keyframes tl-pulse {
          0%,100% { box-shadow:0 0 0 3px ${colors.cream},0 0 0 5px ${colors.ink}; }
          50%      { box-shadow:0 0 0 3px ${colors.cream},0 0 0 5px ${colors.ink},0 0 22px rgba(20,18,16,0.22); }
        }
        @keyframes tl-bounce   { from{transform:translateY(0)} to{transform:translateY(6px)} }
        @keyframes tl-fade-in  { from{opacity:0} to{opacity:1} }
        @keyframes tl-slide-up { from{transform:translateY(30px);opacity:0} to{transform:translateY(0);opacity:1} }
        @keyframes tl-spring   {
          0%{transform:translateY(28px) scale(.88);opacity:0}
          70%{transform:translateY(-4px) scale(1.01)}
          100%{transform:translateY(0) scale(1);opacity:1}
        }
        @keyframes tl-btn-in   { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes tl-year-pop {
          0%  { opacity:0; transform:translateX(-30px) scale(0.84); }
          62% { transform:translateX(3px) scale(1.018); opacity:1; }
          100%{ opacity:1; transform:translateX(0) scale(1); }
        }
        .tl-year-line {
          transform:scaleX(0); transform-origin:left center;
          transition:background .3s, transform .85s cubic-bezier(.22,.68,0,1.2) .3s;
        }

        .tl-back { font-family:${fonts.mono}; font-size:.75rem; letter-spacing:.2em; text-transform:uppercase;
          color:${colors.inkSoft}; background:none; border:none; cursor:pointer; transition:color .2s; padding:0; }
        .tl-back:hover { color:${colors.ink}; }

        .tl-filter { font-family:${fonts.mono}; font-size:.72rem; letter-spacing:.2em; text-transform:uppercase;
          padding:.55rem 1.25rem; background:none; border:1px solid ${colors.creamDark};
          cursor:pointer; transition:all .25s; color:${colors.inkSoft}; }
        .tl-filter:hover { border-color:${colors.ink}; color:${colors.ink}; transform:translateY(-1px); }
        .tl-filter.on { background:${colors.ink}; border-color:${colors.ink}; color:${colors.cream}; }

        .tl-card-wrap { cursor:pointer; }
        .tl-card-wrap:hover { transform:translateY(-8px) !important; box-shadow:0 24px 56px rgba(0,0,0,0.13) !important; }
        .tl-card-wrap { transition:transform .35s cubic-bezier(.22,.68,0,1.2), box-shadow .35s ease, opacity .6s ease; }
        .tl-card-img { transition:transform .45s ease; overflow:hidden; }
        .tl-card-wrap:hover .tl-card-img img { transform:scale(1.06); }

        .tl-year-row { display:flex; align-items:center; gap:.65rem; margin-bottom:1.5rem; }

        .tl-modal-bg { position:fixed; inset:0; background:rgba(18,16,14,.62);
          backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px);
          z-index:200; display:flex; align-items:center; justify-content:center; padding:1.5rem;
          animation:tl-fade-in .22s ease; }
        .tl-modal { background:${colors.cream}; width:100%; max-height:min(90vh,90svh);
          overflow:hidden; border-radius:6px; box-shadow:0 32px 80px rgba(0,0,0,0.35);
          animation:tl-spring .4s cubic-bezier(.22,.68,0,1.2); }
        .tl-close { position:absolute; top:.9rem; right:.9rem; width:34px; height:34px;
          border-radius:50%; background:rgba(255,255,255,.9); border:none; cursor:pointer;
          font-size:1.2rem; color:${colors.ink}; display:flex; align-items:center; justify-content:center;
          transition:background .2s, transform .2s; z-index:5; }
        .tl-close:hover { background:#fff; transform:rotate(90deg); }
        @media (max-width: 640px) {
          .tl-close { width:44px !important; height:44px !important; top:.6rem !important; right:.6rem !important; }
        }

        .show-modal-body-tl { display:flex; flex:1; }
        .show-modal-left-tl { width:190px; flex-shrink:0; border-right:1px solid ${colors.creamDark};
          padding:1.5rem 1.25rem; display:flex; flex-direction:column; gap:1.1rem; }

        @keyframes vinylSpin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        .vinyl-spin { animation:vinylSpin 4s linear infinite; }

        .platform-tile-tl { animation:platform-out-tl .25s ease forwards; }
        .platform-tile-tl:hover { animation:platform-in-tl .45s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        @keyframes platform-in-tl  { 0%{transform:scale(1)} 30%{transform:scale(1.22) rotate(-4deg)} 100%{transform:scale(1.12) rotate(0deg)} }
        @keyframes platform-out-tl { 0%{transform:scale(1.12)} 100%{transform:scale(1)} }

        .tl-goto { position:fixed; bottom:2rem; right:2rem; z-index:90;
          background:${colors.ink}; color:${colors.cream}; border:none;
          padding:.85rem 1.5rem; font-family:${fonts.mono}; font-size:.7rem;
          letter-spacing:.15em; text-transform:uppercase; cursor:pointer; }
        .tl-goto.in  { animation:tl-btn-in .4s cubic-bezier(.22,.68,0,1.2) both; }
        .tl-goto.out { opacity:0; transform:translateY(12px); pointer-events:none; transition:opacity .3s,transform .3s; }
        .tl-goto:hover { opacity:.82; }

        .tl-progress-strip { display:flex; }

        @media(max-width:1024px){
          .tl-grid { grid-template-columns:repeat(2,1fr) !important; }
        }
        @media(max-width:768px){
          .tl-hero  { padding:7rem 1.5rem 3rem !important; }
          .tl-body  { padding:3rem 1.5rem !important; }
          .tl-grid  { grid-template-columns:1fr !important; }
          .tl-filter{ padding:.4rem .85rem; font-size:.65rem; }
          .tl-modal-bg { padding:.75rem; align-items:flex-end; }
          .tl-modal    { max-height:94vh; }
          .tl-nav-inner{ padding:1.1rem 1.5rem !important; }
          .tl-progress-strip { display:none !important; }
          .tl-goto { bottom:1.25rem; right:1.25rem; padding:.75rem 1.1rem; font-size:.65rem; }
          .show-modal-body-tl { flex-direction:column !important; }
          .show-modal-left-tl { width:100% !important; border-right:none !important; border-bottom:1px solid ${colors.creamDark}; }
        }
      `}</style>

      <CursorSparkle />

      {/* ── Modals ── */}
      {renderModal()}

      {/* ── Nav ── */}
      <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:100,
        background:`${colors.cream}ee`, backdropFilter:'blur(14px)',
        borderBottom:`1px solid ${colors.creamDark}` }}>
        <div className="tl-nav-inner" style={{ display:'flex', alignItems:'center',
          justifyContent:'space-between', padding:'1.4rem 3rem', gap:'1.5rem' }}>
          <button onClick={goBack} className="tl-back">{t.backNav}</button>

          {/* Progress strip */}
          <div className="tl-progress-strip" style={{ alignItems:'center', gap:'.65rem',
            flex:1, maxWidth:340, margin:'0 auto' }}>
            <span style={{ fontFamily:fonts.mono, fontSize:'.6rem', letterSpacing:'.12em',
              color:colors.inkSoft, whiteSpace:'nowrap' }}>{lang === 'th' ? '2555' : '2012'}</span>
            <div style={{ flex:1, height:3, background:colors.creamDark, position:'relative', borderRadius:2 }}>
              <div style={{ position:'absolute', left:0, top:0, bottom:0, borderRadius:2,
                width:`${progress * 100}%`,
                background:`linear-gradient(to right,${colors.pink},${colors.ink})`,
                transition:'width .12s linear' }} />
              <div style={{ position:'absolute', top:'50%', left:`${progress * 100}%`,
                transform:'translate(-50%,-50%)', width:11, height:11, borderRadius:'50%',
                background:colors.ink, border:`2px solid ${colors.cream}`,
                boxShadow:`0 0 0 2px ${colors.ink}`,
                transition:'left .08s ease-out' }} />
            </div>
            <span style={{ fontFamily:fonts.mono, fontSize:'.6rem', letterSpacing:'.12em',
              color:colors.inkSoft, whiteSpace:'nowrap' }}>{t.progressEnd}</span>
          </div>

          <span style={{ fontFamily:fonts.display, fontSize:'1.05rem',
            letterSpacing:'.15em', color:colors.ink }}>Tee · Jaruji</span>
        </div>
      </nav>

      {/* ── Hero ── */}
      <div className="tl-hero" style={{ padding:'10rem 4rem 4.5rem',
        background:`linear-gradient(135deg,${colors.pinkSoft},${colors.blueSoft})`,
        position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', right:'-1rem', bottom:'-4rem',
          fontFamily:fonts.display, fontSize:'clamp(8rem,22vw,20rem)', fontStyle:'italic',
          color:colors.pink, opacity:.09, lineHeight:1, userSelect:'none', pointerEvents:'none' }}>J</div>

        <div style={{ opacity:heroIn?1:0, transform:heroIn?'none':'translateY(20px)',
          transition:'opacity .7s ease, transform .7s ease' }}>
          <div style={{ fontFamily:fonts.mono, fontSize:'.85rem', letterSpacing:'.3em',
            textTransform:'uppercase', color:colors.accent, marginBottom:'1rem' }}>
            {t.sectionNum}
          </div>
        </div>
        <div style={{ opacity:heroIn?1:0, transform:heroIn?'none':'translateY(24px)',
          transition:'opacity .7s ease .1s, transform .7s ease .1s' }}>
          <h1 style={{ fontFamily:fonts.display, fontSize:'clamp(2.5rem,5vw,5rem)',
            fontWeight:500, lineHeight:1, color:colors.ink, maxWidth:700, marginBottom:'1rem' }}>
            {t.heading}{' '}
            <span style={{ fontStyle:'italic', color:colors.accent }}>{t.headingItalic}</span>
          </h1>
        </div>
        <div style={{ opacity:heroIn?1:0, transform:heroIn?'none':'translateY(20px)',
          transition:'opacity .7s ease .2s, transform .7s ease .2s' }}>
          <p style={{ fontFamily:fonts.display, fontSize:'1.05rem', fontStyle:'italic',
            color:colors.inkSoft, marginBottom:'2.5rem' }}>{t.sub}</p>
        </div>

        {/* Filters */}
        <div style={{ display:'flex', gap:'.75rem', flexWrap:'wrap', marginBottom:'2rem',
          opacity:heroIn?1:0, transition:'opacity .7s ease .32s' }}>
          {filterList.map(f => (
            <button key={f.key}
              className={`tl-filter${filter === f.key ? ' on' : ''}`}
              style={f.key !== 'all' ? {
                background:   filter === f.key ? CAT_COLORS[f.key] : CAT_BG[f.key],
                borderColor:  CAT_COLORS[f.key],
                color:        filter === f.key ? '#fff' : CAT_COLORS[f.key],
              } : {}}
              onClick={() => changeFilter(f.key)}>
              {f.key !== 'all' && (
                <span style={{ display:'inline-block', width:7, height:7, borderRadius:'50%',
                  background: filter === f.key ? 'rgba(255,255,255,0.8)' : CAT_COLORS[f.key],
                  marginRight:'.45rem', verticalAlign:'middle', transition:'background .25s' }} />
              )}
              {f.label}
            </button>
          ))}
        </div>


        {/* Scroll hint */}
        <div style={{ display:'flex', alignItems:'center', gap:'.5rem', fontFamily:fonts.mono,
          fontSize:'.65rem', letterSpacing:'.2em', color:colors.inkSoft,
          opacity:heroIn?1:0, transition:'opacity .7s ease .5s' }}>
          <span style={{ display:'inline-block', animation:'tl-bounce .85s ease infinite alternate' }}>↓</span>
          <span>{t.scrollHint}</span>
        </div>
      </div>

      {/* ── Timeline body ── */}
      <div className="tl-body" style={{ padding:'5rem 4rem', maxWidth:1100, margin:'0 auto' }}>
        <div ref={timelineRef} style={{ position:'relative', paddingLeft:'3.5rem' }}>

          {/* Background line */}
          <div style={{ position:'absolute', left:0, top:0, bottom:0, width:2,
            background:colors.creamDark, borderRadius:1 }} />

          {/* Filled journey line */}
          <div style={{ position:'absolute', left:0, top:0, width:2, borderRadius:1,
            height:`${progress * 100}%`,
            background:`linear-gradient(to bottom,${colors.pink},${colors.ink})`,
            transition:'height .12s linear' }} />

          {/* Traveler dot */}
          <div style={{ position:'absolute', left:-7, top:`${progress * 100}%`,
            width:16, height:16, borderRadius:'50%',
            background:colors.ink, border:`2px solid ${colors.cream}`,
            zIndex:3, transform:'translateY(-50%)',
            opacity: progress > 0.02 && progress < 0.98 ? 1 : 0,
            transition:'top .08s ease-out, opacity .3s ease',
            animation:'tl-pulse 2.2s ease infinite',
            willChange:'top', pointerEvents:'none' }} />

          {years.map(year => {
            const items  = filtered.filter(e => e.year === year);
            const yi     = yearIdx++;
            const passed = visited.has(year) || isYearPassed(yi);
            return (
              <div key={year} ref={el => { yearGroupRefs.current[yi] = el; }}
                style={{ marginBottom:'4.5rem', position:'relative' }}>

                {/* Year checkpoint marker */}
                {passed ? (
                  <div style={{ position:'absolute', left:'calc(-3.5rem - 8px)', top:'.25rem',
                    transform:'rotate(45deg)', width:16, height:16, zIndex:3,
                    background:colors.accent,
                    boxShadow:`0 0 0 3px ${colors.cream}, 0 0 0 5px ${colors.accent}`,
                    transition:'all .35s cubic-bezier(.22,.68,0,1.4)' }} />
                ) : (
                  <div style={{ position:'absolute', left:'calc(-3.5rem - 8px)', top:'.3rem',
                    width:16, height:16, borderRadius:'50%', zIndex:2,
                    background:colors.cream, border:`2px solid ${colors.creamDark}`,
                    transition:'background .3s ease, border-color .3s ease',
                    display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <div style={{ width:6, height:6, borderRadius:'50%', background:'transparent' }} />
                  </div>
                )}

                {/* Year label row */}
                <div ref={el => { yearRefs.current[yi] = el; }} className="tl-year-row">
                  <span style={{ fontFamily:fonts.mono, fontSize:'.8rem', letterSpacing:'.25em',
                    color: passed ? colors.accent : colors.inkSoft,
                    fontWeight: passed ? 700 : 400,
                    transition:'color .3s, font-weight .3s' }}>
                    {displayYear(year, lang)}
                  </span>
                  <div className="tl-year-line" style={{ flex:1, height:1,
                    background: passed ? colors.accent : colors.creamDark }} />
                  <span style={{ fontFamily:fonts.mono, fontSize:'.6rem', letterSpacing:'.12em',
                    color:colors.inkSoft }}>{items.length} {t.itemsUnit}</span>
                </div>

                {/* Cards grid */}
                <div className="tl-grid" style={{ display:'grid',
                  gridTemplateColumns:'repeat(3,1fr)', gap:'1rem' }}>
                  {items.map((item) => {
                    const ci  = cardIdx++;
                    const img = cardImage(item);
                    const ttl = cardTitle(item, lang);
                    const sub = cardSub(item, lang);
                    return (
                      <div key={item.id}
                        ref={el => { cardRefs.current[ci] = el; }}
                        className="tl-card-wrap"
                        onClick={() => setSelected(item)}
                        style={{ background:colors.cream,
                          border:`1px solid ${colors.creamDark}`, overflow:'hidden' }}>

                        {/* Image area */}
                        <div className="tl-card-img" style={{ height:130, position:'relative',
                          background:`linear-gradient(135deg,${CAT_GRAD[item.category][0]},${CAT_GRAD[item.category][1]})`,
                          display:'flex', alignItems:'center', justifyContent:'center' }}>
                          <div style={{ position:'absolute', width:180, height:180, borderRadius:'50%',
                            border:'48px solid rgba(255,255,255,0.1)', right:-60, top:-60, pointerEvents:'none' }} />

                          {img ? (
                            <img src={img} alt={ttl}
                              style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', objectPosition:'top center', transition:'transform .45s ease' }} />
                          ) : (
                            <div style={{ fontFamily:fonts.display, fontSize:'5rem', fontStyle:'italic',
                              color:'rgba(255,255,255,0.22)', lineHeight:1, userSelect:'none' }}>
                              {CAT_LETTER[item.category]}
                            </div>
                          )}

                          {/* Category badge */}
                          <div style={{ position:'absolute', top:'.65rem', left:'.65rem',
                            fontFamily:fonts.mono, fontSize:'.55rem', letterSpacing:'.15em',
                            textTransform:'uppercase', background:'rgba(255,255,255,0.88)',
                            padding:'.2rem .55rem', color:CAT_COLORS[item.category] }}>
                            {tp.journeyLegend[item.category]}
                          </div>
                          {/* Year watermark */}
                          <div style={{ position:'absolute', bottom:'.5rem', right:'.7rem',
                            fontFamily:fonts.mono, fontSize:'.55rem', letterSpacing:'.1em',
                            color:'rgba(255,255,255,0.55)' }}>{displayYear(item.year, lang)}</div>
                        </div>

                        {/* Text body */}
                        <div style={{ padding:'.9rem 1rem 1.1rem' }}>
                          <h3 style={{ fontFamily: item.category === 'music' ? fonts.display : (lang === 'th' ? fonts.body : fonts.display),
                            fontSize:'1rem', fontWeight:600, color:colors.ink, lineHeight:1.25,
                            marginBottom:'.35rem',
                            overflow:'hidden', display:'-webkit-box',
                            WebkitLineClamp:2, WebkitBoxOrient:'vertical' }}>
                            {ttl}
                          </h3>
                          <p style={{ fontSize:'.78rem', color:colors.inkSoft, lineHeight:1.45,
                            marginBottom:'.65rem',
                            overflow:'hidden', display:'-webkit-box',
                            WebkitLineClamp:1, WebkitBoxOrient:'vertical' }}>
                            {sub}
                          </p>
                          <div style={{ display:'flex', alignItems:'center', gap:'.35rem',
                            fontFamily:fonts.mono, fontSize:'.58rem', letterSpacing:'.12em',
                            textTransform:'uppercase', color:colors.inkSoft }}>
                            <div style={{ width:5, height:5, borderRadius:'50%',
                              background:CAT_COLORS[item.category] }} />
                            {t.tapToView}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* End marker */}
          <div style={{ display:'flex', alignItems:'center', gap:'.85rem', paddingBottom:'.5rem' }}>
            <div style={{ width:10, height:10, background:colors.accent, flexShrink:0,
              marginLeft:'calc(-3.5rem - 4px)', zIndex:2, transform:'rotate(45deg)' }} />
            <span style={{ fontFamily:fonts.mono, fontSize:'.75rem', letterSpacing:'.25em',
              textTransform:'uppercase', color:colors.accent }}>{t.progressEnd}</span>
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <div style={{ padding:'4rem', textAlign:'center', borderTop:`1px solid ${colors.creamDark}` }}>
        <button onClick={goBack}
          onMouseEnter={e => e.currentTarget.style.opacity='.78'}
          onMouseLeave={e => e.currentTarget.style.opacity='1'}
          style={{ display:'inline-flex', alignItems:'center', background:colors.ink,
            color:colors.cream, padding:'1rem 2.5rem', border:'none', fontFamily:fonts.mono,
            fontSize:'.78rem', letterSpacing:'.2em', textTransform:'uppercase',
            cursor:'pointer', transition:'opacity .2s' }}>
          {t.backNav}
        </button>
      </div>

      {/* ── Floating go-to-start ── */}
      <button className={`tl-goto${showTop ? ' in' : ' out'}`} onClick={scrollToTop}>
        {t.goToStart}
      </button>
    </>
  );
}
