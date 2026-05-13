import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { careerTimeline } from '../data/siteData';
import { colors, fonts } from '../styles/theme';
import { useLang } from '../context/LanguageContext';
import { translations } from '../data/translations';
import CursorSparkle from '../components/CursorSparkle';

const TYPE_COLORS = { event: '#d4607a', acting: '#4a8fb5', music: '#b07d3a' };
const TYPE_BG    = { event: '#fce4ea', acting: '#dceaf4', music: '#f5ead8' };
const TYPE_GRAD  = {
  event:  ['#f4b8c8', '#fce4ea'],
  acting: ['#aecde0', '#dceaf4'],
  music:  ['#e8c896', '#f5ead8'],
};
const TYPE_LETTER = { event: 'E', acting: 'P', music: 'M' };

export default function TimelinePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { lang } = useLang();
  const t  = translations[lang].timeline;
  const tp = translations[lang].profile;

  useLayoutEffect(() => { window.scrollTo(0, 0); }, []);

  const [filter,      setFilter]      = useState(searchParams.get('type') || 'all');
  const [selected,    setSelected]    = useState(null);
  const [progress,    setProgress]    = useState(0);
  const [showTop,     setShowTop]     = useState(false);
  const [heroIn,      setHeroIn]      = useState(false);
  const [visited,     setVisited]     = useState(new Set());

  const timelineRef    = useRef(null);
  const cardRefs       = useRef([]);
  const yearRefs       = useRef([]);
  const yearGroupRefs  = useRef([]);

  /* ── hero entrance ───────────────────────────────────── */
  useEffect(() => { const id = setTimeout(() => setHeroIn(true), 80); return () => clearTimeout(id); }, []);

  /* ── scroll progress ─────────────────────────────────── */
  useEffect(() => {
    const onScroll = () => {
      const el = timelineRef.current;
      if (!el) return;
      const rect   = el.getBoundingClientRect();
      const navH   = 72;
      // 0 when timeline top aligns with nav, 1 when timeline bottom aligns with viewport bottom
      const scrolledIn = Math.max(0, navH - rect.top);
      const totalScroll = Math.max(1, el.offsetHeight - window.innerHeight + navH);
      setProgress(Math.min(1, scrolledIn / totalScroll));
      setShowTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [filter]);

  /* ── auto-checkpoint: mark years as visited when scroll passes them ── */
  useEffect(() => {
    const tl = timelineRef.current;
    if (!tl) return;
    setVisited(prev => {
      const next = new Set(prev);
      let changed = false;
      yearGroupRefs.current.forEach((el, yi) => {
        if (!el) return;
        const year = years[yi];
        if (year && el.offsetTop <= progress * tl.offsetHeight && !next.has(year)) {
          next.add(year);
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [progress]);

  /* ── card & year-label entrance (IntersectionObserver) ── */
  useEffect(() => {
    const cards = cardRefs.current.filter(Boolean);
    const years = yearRefs.current.filter(Boolean);

    /* initial state */
    cards.forEach((el, i) => {
      const isRight = i % 2 === 1;
      el.style.opacity   = '0';
      el.style.transform = `translateX(${isRight ? 28 : -28}px) translateY(16px) scale(0.96)`;
      el.style.transition = `opacity .6s cubic-bezier(.22,.68,0,1.2) ${i * 35}ms,
                             transform .65s cubic-bezier(.22,.68,0,1.2) ${i * 35}ms`;
    });
    years.forEach(el => {
      el.style.opacity  = '0';
      el.style.animation = 'none';
    });

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

    [...cards, ...years].forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [filter]);

  /* ── modal scroll-lock ───────────────────────────────── */
  useEffect(() => {
    document.body.style.overflow = selected ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [selected]);

  /* ── data ────────────────────────────────────────────── */
  const filtered   = filter === 'all' ? careerTimeline : careerTimeline.filter(e => e.type === filter);
  const years      = [...new Set(filtered.map(e => e.year))].sort((a, b) => a - b);
  const filterList = [
    { key: 'all',    label: t.filterAll },
    { key: 'event',  label: tp.journeyLegend.event },
    { key: 'acting', label: tp.journeyLegend.acting },
    { key: 'music',  label: tp.journeyLegend.music },
  ];

  function goBack() { navigate('/', { state: { scrollTo: 'selected-works' } }); }
  function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }
  function changeFilter(k) { cardRefs.current = []; yearRefs.current = []; yearGroupRefs.current = []; setVisited(new Set()); setFilter(k); }

  /* ── helper: is this year's checkpoint already passed by the traveler ── */
  function isYearPassed(yi) {
    const el = yearGroupRefs.current[yi];
    const tl = timelineRef.current;
    if (!el || !tl) return false;
    return el.offsetTop <= progress * tl.offsetHeight;
  }

  let cardIdx = 0;
  let yearIdx = 0;

  /* ─────────────────────────────────────────────────────── */
  return (
    <>
      <style>{`
        * { box-sizing:border-box; margin:0; padding:0; }
        body { background:${colors.cream}; }

        /* ── keyframes ── */
        @keyframes tl-pulse {
          0%,100% { box-shadow:0 0 0 3px ${colors.cream},0 0 0 5px ${colors.ink},0 0 0 rgba(20,18,16,0); }
          50%      { box-shadow:0 0 0 3px ${colors.cream},0 0 0 5px ${colors.ink},0 0 22px rgba(20,18,16,0.22); }
        }
        @keyframes tl-bounce   { from{transform:translateY(0)} to{transform:translateY(6px)} }
        @keyframes tl-fade-in  { from{opacity:0} to{opacity:1} }
        @keyframes tl-slide-up { from{transform:translateY(30px);opacity:0} to{transform:translateY(0);opacity:1} }
        @keyframes tl-spring   { 0%{transform:translateY(28px) scale(.88);opacity:0}
                                  70%{transform:translateY(-4px) scale(1.01)}
                                  100%{transform:translateY(0) scale(1);opacity:1} }
        @keyframes tl-line-glow {
          0%,100% { opacity:1 }
          50%     { opacity:.7 }
        }
        @keyframes tl-dot-appear { from{transform:translateX(-50%) scale(0)} to{transform:translateX(-50%) scale(1)} }
        @keyframes tl-btn-in { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes tl-year-pop {
          0%   { opacity:0; transform:translateX(-30px) scale(0.84); }
          62%  { transform:translateX(3px) scale(1.018); opacity:1; }
          100% { opacity:1; transform:translateX(0) scale(1); }
        }
        .tl-year-line {
          transform: scaleX(0);
          transform-origin: left center;
          transition: background .3s, transform .85s cubic-bezier(.22,.68,0,1.2) .3s;
        }

        /* ── nav ── */
        .tl-back { font-family:${fonts.mono}; font-size:.75rem; letter-spacing:.2em;
          text-transform:uppercase; color:${colors.inkSoft}; background:none; border:none;
          cursor:pointer; transition:color .2s; padding:0; }
        .tl-back:hover { color:${colors.ink}; }

        /* ── filters ── */
        .tl-filter { font-family:${fonts.mono}; font-size:.72rem; letter-spacing:.2em;
          text-transform:uppercase; padding:.55rem 1.25rem; background:none;
          border:1px solid ${colors.creamDark}; cursor:pointer; transition:all .25s; color:${colors.inkSoft}; }
        .tl-filter:hover { border-color:${colors.ink}; color:${colors.ink}; transform:translateY(-1px); }
        .tl-filter.on { background:${colors.ink}; border-color:${colors.ink}; color:${colors.cream}; }

        /* ── card ── */
        .tl-card-wrap { cursor:pointer; }
        .tl-card-wrap:hover { transform:translateY(-8px) !important;
          box-shadow:0 24px 56px rgba(0,0,0,0.13) !important; }
        .tl-card-wrap { transition:transform .35s cubic-bezier(.22,.68,0,1.2),
                                   box-shadow .35s ease,
                                   opacity .6s ease; }
        .tl-card-img { transition:transform .45s ease; overflow:hidden; }
        .tl-card-wrap:hover .tl-card-img { transform:scale(1.06); }

        /* ── checkpoint button ── */
        .tl-cp-btn {
          background:none; border:none; cursor:pointer; padding:0;
          display:flex; align-items:center; justify-content:center;
          width:28px; height:28px; border-radius:50%;
          transition:background .2s, transform .2s;
          flex-shrink:0;
        }
        .tl-cp-btn:hover { background:${colors.creamDark}; transform:scale(1.15); }
        .tl-cp-btn .cp-icon {
          font-size:.85rem; transition:transform .3s cubic-bezier(.22,.68,0,1.4), color .2s;
        }
        .tl-cp-btn:hover .cp-icon { transform:scale(1.25); }

        /* ── year row ── */
        .tl-year-row { display:flex; align-items:center; gap:.65rem; margin-bottom:1.5rem; }
        .tl-year-row .cp-hint {
          font-family:${fonts.mono}; font-size:.58rem; letter-spacing:.12em;
          text-transform:uppercase; color:${colors.inkSoft};
          opacity:0; transition:opacity .2s;
        }
        .tl-year-row:hover .cp-hint { opacity:1; }

        /* ── modal ── */
        .tl-modal-bg { position:fixed; inset:0; background:rgba(18,16,14,.6);
          backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px);
          z-index:200; display:flex; align-items:center; justify-content:center; padding:1.5rem;
          animation:tl-fade-in .22s ease; }
        .tl-modal { background:${colors.cream}; max-width:520px; width:100%;
          max-height:88vh; overflow-y:auto; animation:tl-spring .4s cubic-bezier(.22,.68,0,1.2); }
        .tl-close { position:absolute; top:.9rem; right:.9rem; width:34px; height:34px;
          border-radius:50%; background:rgba(255,255,255,.9); border:none; cursor:pointer;
          font-size:1.2rem; color:${colors.ink}; display:flex; align-items:center; justify-content:center;
          transition:background .2s, transform .2s; }
        .tl-close:hover { background:#fff; transform:rotate(90deg); }

        /* ── floating button ── */
        .tl-goto { position:fixed; bottom:2rem; right:2rem; z-index:90;
          background:${colors.ink}; color:${colors.cream}; border:none;
          padding:.85rem 1.5rem; font-family:${fonts.mono}; font-size:.7rem;
          letter-spacing:.15em; text-transform:uppercase; cursor:pointer; }
        .tl-goto.in  { animation:tl-btn-in .4s cubic-bezier(.22,.68,0,1.2) both; }
        .tl-goto.out { opacity:0; transform:translateY(12px); pointer-events:none; transition:opacity .3s, transform .3s; }
        .tl-goto:hover { opacity:.82; }

        /* ── progress strip ── */
        .tl-progress-strip { display:flex; }

        /* ── responsive ── */
        @media(max-width:768px){
          .tl-hero  { padding:7rem 1.5rem 3rem !important; }
          .tl-body  { padding:3rem 1.5rem !important; }
          .tl-grid  { grid-template-columns:1fr !important; }
          .tl-filter { padding:.4rem .85rem; font-size:.65rem; }
          .tl-modal-bg { padding:.75rem; align-items:flex-end; }
          .tl-modal { max-height:92vh; }
          .tl-nav-inner { padding:1.1rem 1.5rem !important; }
          .tl-progress-strip { display:none !important; }
          .tl-goto { bottom:1.25rem; right:1.25rem; padding:.75rem 1.1rem; font-size:.65rem; }
        }
      `}</style>

      <CursorSparkle />

      {/* ── Modal ─────────────────────────────────────────── */}
      {selected && (
        <div className="tl-modal-bg" onClick={() => setSelected(null)}>
          <div className="tl-modal" onClick={e => e.stopPropagation()}>
            {/* Image header */}
            <div style={{ height:220, position:'relative', overflow:'hidden',
              background:`linear-gradient(145deg,${TYPE_GRAD[selected.type][0]},${TYPE_GRAD[selected.type][1]})`,
              display:'flex', alignItems:'center', justifyContent:'center' }}>
              {/* rings */}
              <div style={{ position:'absolute', width:260, height:260, borderRadius:'50%',
                border:'60px solid rgba(255,255,255,0.1)', top:-90, right:-70, pointerEvents:'none' }} />
              <div style={{ position:'absolute', width:160, height:160, borderRadius:'50%',
                border:'40px solid rgba(255,255,255,0.07)', bottom:-55, left:-45, pointerEvents:'none' }} />
              {/* letter */}
              <div style={{ fontFamily:fonts.display, fontSize:'9rem', fontStyle:'italic',
                color:'rgba(255,255,255,0.2)', lineHeight:1, userSelect:'none',
                animation:'tl-slide-up .5s ease .1s both' }}>
                {TYPE_LETTER[selected.type]}
              </div>
              {/* year */}
              <div style={{ position:'absolute', top:'1rem', left:'1rem', fontFamily:fonts.mono,
                fontSize:'.72rem', letterSpacing:'.2em', background:'rgba(255,255,255,0.92)',
                padding:'.3rem .8rem', color:colors.ink }}>
                {selected.year}
              </div>
              <button className="tl-close" onClick={() => setSelected(null)}>×</button>
            </div>

            {/* Content */}
            <div style={{ padding:'2rem 2rem 2.5rem' }}>
              <div style={{ display:'inline-block', fontFamily:fonts.mono, fontSize:'.62rem',
                letterSpacing:'.2em', textTransform:'uppercase',
                background:TYPE_BG[selected.type], color:TYPE_COLORS[selected.type],
                padding:'.28rem .75rem', marginBottom:'1.1rem' }}>
                {tp.journeyLegend[selected.type]}
              </div>
              <h2 style={{ fontFamily:fonts.display, fontSize:'1.9rem', fontWeight:500,
                color:colors.ink, lineHeight:1.1, marginBottom:'1.1rem' }}>
                {selected.title}
              </h2>
              <p style={{ fontSize:'1rem', lineHeight:1.78, color:colors.inkSoft,
                marginBottom:'1.5rem' }}>
                {selected.desc}
              </p>
              {/* source strip */}
              <div style={{ borderTop:`1px solid ${colors.creamDark}`, paddingTop:'1rem',
                display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div style={{ fontFamily:fonts.mono, fontSize:'.68rem', letterSpacing:'.2em',
                  textTransform:'uppercase', color:colors.inkSoft }}>
                  {t.yearPrefix} {selected.year}
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:'.4rem' }}>
                  <div style={{ width:8, height:8, borderRadius:'50%',
                    background:TYPE_COLORS[selected.type] }} />
                  <span style={{ fontFamily:fonts.mono, fontSize:'.65rem', letterSpacing:'.15em',
                    textTransform:'uppercase', color:TYPE_COLORS[selected.type] }}>
                    {tp.journeyLegend[selected.type]}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Nav ───────────────────────────────────────────── */}
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
              color:colors.inkSoft, whiteSpace:'nowrap' }}>{t.progressStart}</span>
            <div style={{ flex:1, height:3, background:colors.creamDark,
              position:'relative', borderRadius:2 }}>
              {/* filled */}
              <div style={{ position:'absolute', left:0, top:0, bottom:0, borderRadius:2,
                width:`${progress * 100}%`,
                background:`linear-gradient(to right, ${colors.pink}, ${colors.ink})`,
                transition:'width .12s linear' }} />
              {/* traveler */}
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

      {/* ── Hero ──────────────────────────────────────────── */}
      <div className="tl-hero" style={{ padding:'10rem 4rem 4.5rem',
        background:`linear-gradient(135deg,${colors.pinkSoft},${colors.blueSoft})`,
        position:'relative', overflow:'hidden' }}>
        {/* big watermark */}
        <div style={{ position:'absolute', right:'-1rem', bottom:'-4rem',
          fontFamily:fonts.display, fontSize:'clamp(8rem,22vw,20rem)', fontStyle:'italic',
          color:colors.pink, opacity:.09, lineHeight:1, userSelect:'none', pointerEvents:'none',
          transition:'opacity 1s' }}>J</div>

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
            <button key={f.key} className={`tl-filter${filter === f.key ? ' on' : ''}`}
              onClick={() => changeFilter(f.key)}>
              {f.key !== 'all' && (
                <span style={{ display:'inline-block', width:7, height:7, borderRadius:'50%',
                  background:filter===f.key ? colors.cream : TYPE_COLORS[f.key],
                  marginRight:'.45rem', verticalAlign:'middle',
                  transition:'background .25s' }} />
              )}
              {f.label}
            </button>
          ))}
        </div>

        {/* Legend */}
        <div style={{ display:'flex', gap:'1.25rem', flexWrap:'wrap', marginBottom:'1.5rem',
          opacity:heroIn?1:0, transition:'opacity .7s ease .4s' }}>
          {Object.entries(tp.journeyLegend).map(([k, l]) => (
            <div key={k} style={{ display:'flex', alignItems:'center', gap:'.4rem' }}>
              <div style={{ width:8, height:8, borderRadius:'50%', background:TYPE_COLORS[k],
                flexShrink:0 }} />
              <span style={{ fontFamily:fonts.mono, fontSize:'.65rem', letterSpacing:'.18em',
                textTransform:'uppercase', color:colors.inkSoft }}>{l}</span>
            </div>
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

      {/* ── Timeline body ─────────────────────────────────── */}
      <div className="tl-body" style={{ padding:'5rem 4rem', maxWidth:1060, margin:'0 auto' }}>
        <div ref={timelineRef} style={{ position:'relative', paddingLeft:'3.5rem' }}>

          {/* Background line */}
          <div style={{ position:'absolute', left:0, top:0, bottom:0, width:2,
            background:colors.creamDark, borderRadius:1 }} />

          {/* Filled journey line — gradient */}
          <div style={{ position:'absolute', left:0, top:0, width:2, borderRadius:1,
            height:`${progress * 100}%`,
            background:`linear-gradient(to bottom, ${colors.pink}, ${colors.ink})`,
            transition:'height .12s linear' }} />

          {/* Traveler dot on line */}
          <div style={{ position:'absolute', left:-7, top:`${progress * 100}%`,
            width:16, height:16, borderRadius:'50%',
            background:colors.ink, border:`2px solid ${colors.cream}`,
            zIndex:3, transform:'translateY(-50%)',
            opacity: progress > 0.02 && progress < 0.98 ? 1 : 0,
            transition:'top .08s ease-out, opacity .3s ease',
            animation:'tl-pulse 2.2s ease infinite',
            willChange:'top',
            pointerEvents:'none' }} />

          {years.map(year => {
            const items  = filtered.filter(e => e.year === year);
            const yi     = yearIdx++;
            const passed = visited.has(year) || isYearPassed(yi);
            return (
              <div key={year} ref={el => { yearGroupRefs.current[yi] = el; }}
                style={{ marginBottom:'4.5rem', position:'relative' }}>

                {/* ── Line marker: ◆ diamond when passed, ○ circle when not ── */}
                {passed ? (
                  <div style={{ position:'absolute', left:'calc(-3.5rem - 8px)', top:'.25rem',
                    transform:'rotate(45deg)',
                    width:16, height:16, zIndex:3,
                    background:colors.accent,
                    boxShadow:`0 0 0 3px ${colors.cream}, 0 0 0 5px ${colors.accent}`,
                    transition:'all .35s cubic-bezier(.22,.68,0,1.4)' }} />
                ) : (
                  <div style={{ position:'absolute', left:'calc(-3.5rem - 8px)', top:'.3rem',
                    width:16, height:16, borderRadius:'50%', zIndex:2,
                    background: colors.cream,
                    border: `2px solid ${colors.creamDark}`,
                    transition:'background .3s ease, border-color .3s ease',
                    display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <div style={{ width:6, height:6, borderRadius:'50%',
                      background: 'transparent', transition:'background .3s ease' }} />
                  </div>
                )}

                {/* Year label row */}
                <div ref={el => { yearRefs.current[yi] = el; }}
                  className="tl-year-row">

                  <span style={{ fontFamily:fonts.mono, fontSize:'.8rem', letterSpacing:'.25em',
                    color: passed ? colors.accent : colors.inkSoft,
                    fontWeight: passed ? 700 : 400,
                    transition:'color .3s, font-weight .3s' }}>{year}</span>

                  <div className="tl-year-line" style={{ flex:1, height:1,
                    background: passed ? colors.accent : colors.creamDark }} />

                  <span style={{ fontFamily:fonts.mono, fontSize:'.6rem', letterSpacing:'.12em',
                    color:colors.inkSoft }}>{items.length} {t.itemsUnit}</span>
                </div>

                {/* Cards grid */}
                <div className="tl-grid" style={{ display:'grid',
                  gridTemplateColumns:'repeat(2,1fr)', gap:'1rem' }}>
                  {items.map((item, ii) => {
                    const ci = cardIdx++;
                    return (
                      <div key={ii}
                        ref={el => { cardRefs.current[ci] = el; }}
                        className="tl-card-wrap"
                        onClick={() => setSelected(item)}
                        style={{ background:colors.cream,
                          border:`1px solid ${colors.creamDark}`, overflow:'hidden' }}>

                        {/* Image */}
                        <div className="tl-card-img" style={{ height:130, position:'relative',
                          background:`linear-gradient(135deg,${TYPE_GRAD[item.type][0]},${TYPE_GRAD[item.type][1]})`,
                          display:'flex', alignItems:'center', justifyContent:'center' }}>
                          {/* ring deco */}
                          <div style={{ position:'absolute', width:180, height:180, borderRadius:'50%',
                            border:'48px solid rgba(255,255,255,0.1)', right:-60, top:-60, pointerEvents:'none' }} />
                          {/* letter */}
                          <div style={{ fontFamily:fonts.display, fontSize:'5.5rem', fontStyle:'italic',
                            color:'rgba(255,255,255,0.22)', lineHeight:1, userSelect:'none' }}>
                            {TYPE_LETTER[item.type]}
                          </div>
                          {/* type badge */}
                          <div style={{ position:'absolute', top:'.65rem', left:'.65rem',
                            fontFamily:fonts.mono, fontSize:'.58rem', letterSpacing:'.15em',
                            textTransform:'uppercase', background:'rgba(255,255,255,0.88)',
                            padding:'.22rem .6rem', color:TYPE_COLORS[item.type] }}>
                            {tp.journeyLegend[item.type]}
                          </div>
                          {/* year watermark */}
                          <div style={{ position:'absolute', bottom:'.5rem', right:'.7rem',
                            fontFamily:fonts.mono, fontSize:'.58rem', letterSpacing:'.1em',
                            color:'rgba(255,255,255,0.55)' }}>{item.year}</div>
                        </div>

                        {/* Text */}
                        <div style={{ padding:'1rem 1.15rem 1.25rem' }}>
                          <h3 style={{ fontFamily:fonts.display, fontSize:'1rem', fontWeight:500,
                            color:colors.ink, lineHeight:1.2, marginBottom:'.4rem' }}>
                            {item.title}
                          </h3>
                          <p style={{ fontSize:'.8rem', color:colors.inkSoft, lineHeight:1.55,
                            overflow:'hidden', display:'-webkit-box',
                            WebkitLineClamp:2, WebkitBoxOrient:'vertical',
                            marginBottom:'.75rem' }}>
                            {item.desc}
                          </p>
                          <div style={{ display:'flex', alignItems:'center', gap:'.35rem',
                            fontFamily:fonts.mono, fontSize:'.6rem', letterSpacing:'.12em',
                            textTransform:'uppercase', color:colors.inkSoft }}>
                            <div style={{ width:5, height:5, borderRadius:'50%',
                              background:TYPE_COLORS[item.type] }} />
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

          {/* End marker — small static diamond, distinct from traveler */}
          <div style={{ display:'flex', alignItems:'center', gap:'.85rem', paddingBottom:'.5rem' }}>
            <div style={{ width:10, height:10, background:colors.accent,
              flexShrink:0, marginLeft:'calc(-3.5rem - 4px)', zIndex:2,
              transform:'rotate(45deg)' }} />
            <span style={{ fontFamily:fonts.mono, fontSize:'.75rem', letterSpacing:'.25em',
              textTransform:'uppercase', color:colors.accent }}>{t.progressEnd}</span>
          </div>
        </div>
      </div>

      {/* ── Footer ────────────────────────────────────────── */}
      <div style={{ padding:'4rem', textAlign:'center',
        borderTop:`1px solid ${colors.creamDark}` }}>
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

      {/* ── Floating go-to-start ───────────────────────────── */}
      <button className={`tl-goto${showTop ? ' in' : ' out'}`} onClick={scrollToTop}>
        {t.goToStart}
      </button>
    </>
  );
}
