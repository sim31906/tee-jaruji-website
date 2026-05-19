import { useState, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { colors, fonts } from '../styles/theme';
import { eventsData, EVENT_TYPES } from '../data/eventsData';
import CursorSparkle from '../components/CursorSparkle';
import { useLang } from '../context/LanguageContext';

function groupByYear(events) {
  const map = {};
  events.forEach(ev => {
    if (!map[ev.year]) map[ev.year] = [];
    map[ev.year].push(ev);
  });
  return Object.entries(map)
    .sort((a, b) => Number(b[0]) - Number(a[0]))
    .map(([year, items]) => ({ year: Number(year), items }));
}

function EventModal({ event, onClose, t }) {
  const meta = EVENT_TYPES[event.type] || { label: event.type, color: '#666', bg: '#f5f5f5' };
  const [vis, setVis] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const id = requestAnimationFrame(() => setVis(true));
    return () => {
      document.body.style.overflow = '';
      cancelAnimationFrame(id);
    };
  }, []);

  return createPortal(
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{
        position:'fixed',inset:0,zIndex:9998,
        background:'rgba(0,0,0,0.45)',backdropFilter:'blur(4px)',
        cursor:'pointer',
        opacity: vis ? 1 : 0,
        transition:'opacity 0.2s ease',
      }}/>
      {/* Modal — top:80px, centered with margin auto (no transform) */}
      <div onClick={e => e.stopPropagation()} style={{
        position:'fixed',
        top:'80px',
        left:0,right:0,
        margin:'0 auto',
        width:'min(580px, 92vw)',
        maxHeight:'calc(100vh - 96px)',
        zIndex:9999,
        background:colors.cream,
        borderRadius:'20px',
        overflow:'hidden',
        boxShadow:'0 32px 80px rgba(0,0,0,0.28)',
        display:'flex',flexDirection:'column',
        cursor:'default',
        opacity: vis ? 1 : 0,
        transform: vis ? 'translateY(0)' : 'translateY(-10px)',
        transition:'opacity 0.3s ease, transform 0.3s ease',
      }}>
        {/* Header */}
        <div style={{
          background:`linear-gradient(135deg, ${meta.color}18, ${meta.color}08)`,
          borderBottom:`3px solid ${meta.color}55`,
          padding:'1.75rem 2rem 1.5rem',
          position:'relative',flexShrink:0,
        }}>
          <button onClick={onClose} style={{
            position:'absolute',top:'1rem',right:'1rem',
            width:'34px',height:'34px',borderRadius:'50%',
            border:'none',background:'rgba(0,0,0,0.07)',
            cursor:'pointer',fontSize:'1.1rem',color:colors.ink,
            display:'flex',alignItems:'center',justifyContent:'center',
          }}>×</button>

          <div style={{
            display:'inline-block',
            background:meta.color,color:'#fff',
            fontFamily:fonts.mono,fontSize:'0.6rem',letterSpacing:'0.2em',
            textTransform:'uppercase',padding:'0.2rem 0.7rem',
            borderRadius:'4px',marginBottom:'0.75rem',
          }}>{meta.label}</div>

          <h2 style={{
            fontFamily:fonts.display,
            fontSize:'clamp(1.2rem, 3vw, 1.65rem)',
            fontWeight:500,color:colors.ink,
            lineHeight:1.25,margin:0,paddingRight:'2.5rem',
          }}>{event.title}</h2>
        </div>

        {/* Body */}
        <div style={{padding:'1.5rem 2rem',overflowY:'auto',flex:1}}>
          {/* Date + Location */}
          <div style={{display:'flex',gap:'2rem',flexWrap:'wrap',marginBottom:'1.25rem'}}>
            <div>
              <div style={{fontFamily:fonts.mono,fontSize:'0.62rem',letterSpacing:'0.2em',textTransform:'uppercase',color:colors.inkSoft,marginBottom:'0.3rem'}}>{t.detailDate}</div>
              <div style={{fontFamily:fonts.display,fontSize:'1.05rem',color:colors.ink}}>{event.date}</div>
            </div>
            <div>
              <div style={{fontFamily:fonts.mono,fontSize:'0.62rem',letterSpacing:'0.2em',textTransform:'uppercase',color:colors.inkSoft,marginBottom:'0.3rem'}}>{t.detailLocation}</div>
              <div style={{fontFamily:fonts.display,fontSize:'1.05rem',color:colors.ink,lineHeight:1.4}}>{event.location}</div>
            </div>
          </div>

          <div style={{height:'1px',background:colors.creamDark,marginBottom:'1.25rem'}}/>

          {/* Image */}
          <div style={{
            width:'100%',aspectRatio:'16/9',
            borderRadius:'12px',overflow:'hidden',
            marginBottom:'1.25rem',
            background:`linear-gradient(135deg, ${meta.color}22, ${meta.color}0a)`,
            display:'flex',alignItems:'center',justifyContent:'center',
            position:'relative',
          }}>
            {event.image
              ? <img src={event.image} alt={event.title} style={{width:'100%',height:'100%',objectFit:'cover',position:'absolute',inset:0}}/>
              : <div style={{fontFamily:fonts.mono,fontSize:'0.65rem',letterSpacing:'0.2em',textTransform:'uppercase',color:meta.color,opacity:0.5}}>
                  {t.imagePlaceholder}
                </div>
            }
          </div>

          {/* Detail */}
          <p style={{
            fontFamily:fonts.body,fontSize:'0.98rem',
            lineHeight:1.8,color:colors.ink,margin:'0 0 1.5rem',
          }}>{event.detail}</p>

          {/* Links */}
          <div style={{
            borderTop:`1px solid ${colors.creamDark}`,
            paddingTop:'1rem',
          }}>
            <div style={{fontFamily:fonts.mono,fontSize:'0.62rem',letterSpacing:'0.2em',textTransform:'uppercase',color:colors.inkSoft,marginBottom:'0.75rem'}}>
              {t.detailLinks}
            </div>
            {event.links && event.links.length > 0
              ? <div style={{display:'flex',flexWrap:'wrap',gap:'0.75rem'}}>
                  {event.links.map((link, i) => (
                    <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" style={{
                      fontFamily:fonts.mono,fontSize:'0.72rem',letterSpacing:'0.15em',
                      textTransform:'uppercase',color:meta.color,
                      border:`1px solid ${meta.color}`,
                      padding:'0.4rem 1rem',borderRadius:'6px',
                      textDecoration:'none',
                    }}>
                      {link.label} ↗
                    </a>
                  ))}
                </div>
              : <div style={{fontFamily:fonts.body,fontSize:'0.85rem',color:colors.inkSoft,fontStyle:'italic'}}>
                  {t.noLinks}
                </div>
            }
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}

const EVENTS_T = {
  th: {
    backNav: '← กลับหน้าหลัก',
    categoryLabel: 'งานอีเวนต์และกิจกรรม',
    titleMain: 'งาน',
    titleItalic: 'อีเวนต์',
    subtitle: 'งานเปิดตัว · แฟนมีต · คอนเสิร์ต · Brand Events · กิจกรรมพิเศษ ตั้งแต่ปี 2555 ถึงปัจจุบัน',
    filterAll: 'ทั้งหมด', filterAllType: 'ทุกประเภท',
    noEvents: 'ไม่พบ event ในหมวดนี้',
    detailDate: 'วันที่', detailLocation: 'สถานที่', detailLinks: 'ลิงก์',
    noLinks: '— ยังไม่มีลิงก์ —', imagePlaceholder: '— รูปภาพ —',
    viewDetail: 'ดูรายละเอียด →', showing: 'แสดง', from: 'จาก',
  },
  en: {
    backNav: '← Back to Home',
    categoryLabel: 'Events & Activities',
    titleMain: 'Event',
    titleItalic: 'Appearances',
    subtitle: 'Launches · Fan Meets · Concerts · Brand Events · Special Activities since 2012',
    filterAll: 'All', filterAllType: 'All Types',
    noEvents: 'No events found',
    detailDate: 'Date', detailLocation: 'Location', detailLinks: 'Links',
    noLinks: '— No links yet —', imagePlaceholder: '— Photo —',
    viewDetail: 'View Details →', showing: 'Showing', from: 'of',
  },
  zh: {
    backNav: '← 返回主页',
    categoryLabel: '活动与演出',
    titleMain: '活动',
    titleItalic: '展示',
    subtitle: '发布会 · 见面会 · 演唱会 · 品牌活动 · 特别活动（2012年至今）',
    filterAll: '全部', filterAllType: '全部类型',
    noEvents: '未找到活动',
    detailDate: '日期', detailLocation: '地点', detailLinks: '链接',
    noLinks: '— 暂无链接 —', imagePlaceholder: '— 图片 —',
    viewDetail: '查看详情 →', showing: '显示', from: '共',
  },
};

export default function EventsPage() {
  const navigate = useNavigate();
  const { lang } = useLang();
  const t = EVENTS_T[lang] || EVENTS_T.th;
  const [selected, setSelected] = useState(null);
  const [activeYear, setActiveYear] = useState(null);
  const [activeType, setActiveType] = useState(null);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const grouped = groupByYear(eventsData);
  const years = grouped.map(g => g.year);

  const filteredGroups = grouped
    .map(g => ({
      ...g,
      items: g.items.filter(ev => !activeType || ev.type === activeType),
    }))
    .filter(g => (!activeYear || g.year === activeYear) && g.items.length > 0);

  const totalCount = filteredGroups.reduce((sum, g) => sum + g.items.length, 0);

  return (
    <>
      <CursorSparkle />
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; }

        .ev-back-btn {
          display: inline-flex; align-items: center; gap: 0.5rem;
          font-family: ${fonts.mono}; font-size: 0.7rem;
          letter-spacing: 0.25em; text-transform: uppercase;
          color: ${colors.inkSoft}; cursor: pointer;
          background: none; border: none; padding: 0;
          transition: color 0.2s;
        }
        .ev-back-btn:hover { color: ${colors.ink}; }

        .ev-filter-btn {
          font-family: ${fonts.mono}; font-size: 0.68rem;
          letter-spacing: 0.15em; text-transform: uppercase;
          padding: 0.35rem 0.9rem; border-radius: 20px;
          border: 1px solid ${colors.creamDark};
          background: transparent; cursor: pointer;
          transition: all 0.18s; color: ${colors.inkSoft};
          white-space: nowrap; flex-shrink: 0;
        }
        .ev-filter-btn:hover { border-color: ${colors.ink}; color: ${colors.ink}; }
        .ev-filter-btn.active { background: ${colors.ink}; color: ${colors.cream}; border-color: ${colors.ink}; }

        .ev-card {
          background: ${colors.cream};
          border: 1px solid ${colors.creamDark};
          border-radius: 14px;
          padding: 1.4rem 1.25rem 1.25rem;
          cursor: pointer;
          transition: transform 0.22s, box-shadow 0.22s, border-color 0.22s;
          position: relative;
          display: flex; flex-direction: column;
        }
        .ev-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 18px 44px rgba(0,0,0,0.1);
          border-color: transparent;
        }

        .ev-type-filter-btn {
          font-family: ${fonts.mono}; font-size: 0.62rem;
          letter-spacing: 0.15em; text-transform: uppercase;
          padding: 0.3rem 0.75rem; border-radius: 20px;
          border: 1px solid; cursor: pointer;
          transition: all 0.18s; white-space: nowrap; flex-shrink: 0;
          background: transparent;
        }

        @keyframes emBgIn { from{opacity:0}to{opacity:1} }
        @keyframes emIn { from{opacity:0;transform:scale(0.96) translateY(12px)}to{opacity:1;transform:scale(1) translateY(0)} }

        @media (max-width: 900px) {
          .ev-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 580px) {
          .ev-grid { grid-template-columns: 1fr !important; }
          .ev-section { padding: 4rem 1.25rem !important; }
          .ev-hero-tj { padding: 6rem 1.5rem 3rem !important; background-position: center 50% !important; }
        }
      `}</style>

      {/* Top nav */}
      <nav style={{
        position:'fixed',top:0,left:0,right:0,zIndex:200,
        display:'flex',alignItems:'center',justifyContent:'space-between',
        padding:'1.5rem 3rem',
        background:`${colors.cream}ee`,
        backdropFilter:'blur(12px)',
        borderBottom:`1px solid ${colors.creamDark}`,
      }}>
        <button className="ev-back-btn" onClick={() => navigate('/', { state: { scrollTo: 'selected-works' } })}>
          {t.backNav}
        </button>
        <span style={{
          fontFamily:fonts.display,fontSize:'1.1rem',
          letterSpacing:'0.15em',color:colors.ink,
        }}>Tee · Jaruji</span>
      </nav>

      {/* Hero */}
      <div className="ev-hero-tj" style={{
        padding:'10rem 4rem 5rem',
        background:`linear-gradient(135deg, ${colors.pinkSoft}, ${colors.blueSoft})`,
        backgroundImage:`linear-gradient(135deg, rgba(252,228,234,0.75), rgba(220,234,244,0.75)), url(/events-hero-bg.jpg)`,
        backgroundSize:'cover',
        backgroundPosition:'center 2%',
        position:'relative',overflow:'hidden',
      }}>
        {/* watermark */}
        <div style={{
          position:'absolute',right:'-1rem',bottom:'-3rem',
          fontFamily:fonts.display,fontSize:'clamp(10rem,25vw,20rem)',
          fontStyle:'italic',color:colors.pink,opacity:0.12,
          lineHeight:1,userSelect:'none',pointerEvents:'none',
        }}>E</div>

        <div style={{
          fontFamily:fonts.mono,fontSize:'0.68rem',letterSpacing:'0.35em',
          textTransform:'uppercase',color:colors.accent,marginBottom:'1rem',
          textShadow:'0 1px 6px rgba(253,246,236,1)',
        }}>
          {t.categoryLabel}
        </div>
        <h1 style={{
          fontFamily:fonts.display,
          fontSize:'clamp(2.8rem, 7vw, 5rem)',
          fontWeight:500,color:colors.ink,
          lineHeight:1.0,letterSpacing:'-0.02em',
          maxWidth:'700px',margin:'0 0 1rem',
          textShadow:'0 1px 4px rgba(253,246,236,1), 0 2px 16px rgba(253,246,236,0.9), 0 4px 30px rgba(253,246,236,0.7)',
        }}>
          {t.titleMain}{' '}
          <span style={{fontStyle:'italic',color:colors.accent}}>{t.titleItalic}</span>
        </h1>
        <p style={{
          fontFamily:fonts.body,fontSize:'1rem',color:colors.ink,
          maxWidth:'500px',lineHeight:1.7,margin:0,
          textShadow:'0 1px 6px rgba(253,246,236,1), 0 2px 14px rgba(253,246,236,0.8)',
        }}>
          {t.subtitle}
        </p>
      </div>

      {/* Filters */}
      <div style={{
        background:colors.cream,
        borderBottom:`1px solid ${colors.creamDark}`,
        padding:'0.75rem 3rem',
      }}>
        <div style={{maxWidth:'960px',margin:'0 auto',display:'flex',flexDirection:'column',gap:'0.6rem'}}>
          {/* Year filter */}
          <div style={{display:'flex',flexWrap:'wrap',gap:'0.5rem'}}>
            <button className={`ev-filter-btn${!activeYear?' active':''}`} onClick={() => setActiveYear(null)}>{t.filterAll}</button>
            {years.map(y => (
              <button key={y} className={`ev-filter-btn${activeYear===y?' active':''}`}
                onClick={() => setActiveYear(activeYear===y ? null : y)}>
                {y}
              </button>
            ))}
          </div>
          {/* Type filter */}
          <div style={{display:'flex',flexWrap:'wrap',gap:'0.5rem'}}>
            <button className={`ev-filter-btn${!activeType?' active':''}`} onClick={() => setActiveType(null)}>{t.filterAllType}</button>
            {Object.entries(EVENT_TYPES).map(([key, meta]) => (
              <button key={key}
                className="ev-type-filter-btn"
                onClick={() => setActiveType(activeType===key ? null : key)}
                style={{
                  borderColor: meta.color,
                  color: activeType===key ? '#fff' : meta.color,
                  background: activeType===key ? meta.color : 'transparent',
                }}>
                {meta.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="ev-section" style={{maxWidth:'960px',margin:'0 auto',padding:'4rem 3rem'}}>
        {filteredGroups.length === 0 && (
          <div style={{textAlign:'center',padding:'4rem',fontFamily:fonts.body,color:colors.inkSoft}}>
            ไม่พบ event ในหมวดนี้
          </div>
        )}

        {filteredGroups.map(({ year, items }) => (
          <div key={year} style={{marginBottom:'4rem'}}>
            {/* Year header */}
            <div style={{
              display:'flex',alignItems:'baseline',gap:'1.25rem',
              marginBottom:'1.5rem',paddingBottom:'0.75rem',
              borderBottom:`2px solid ${colors.ink}`,
            }}>
              <span style={{
                fontFamily:fonts.display,fontWeight:500,fontStyle:'italic',
                fontSize:'clamp(2rem,5vw,3rem)',color:colors.ink,lineHeight:1,
              }}>{year}</span>
              <span style={{
                fontFamily:fonts.mono,fontSize:'0.65rem',
                letterSpacing:'0.2em',textTransform:'uppercase',color:colors.inkSoft,
              }}>{items.length} event{items.length > 1 ? 's' : ''}</span>
            </div>

            {/* Cards */}
            <div className="ev-grid" style={{
              display:'grid',
              gridTemplateColumns:'repeat(3, 1fr)',
              gap:'1rem',
            }}>
              {items.map(event => {
                const meta = EVENT_TYPES[event.type] || { label: event.type, color:'#666', bg:'#f5f5f5' };
                return (
                  <div key={event.id} className="ev-card"
                    style={{borderTop:`3px solid ${meta.color}`}}
                    onClick={() => setSelected(event)}>

                    {/* Image */}
                    <div style={{
                      width:'100%',aspectRatio:'4/3',
                      borderRadius:'8px',overflow:'hidden',
                      marginBottom:'1rem',
                      background:`linear-gradient(135deg, ${meta.color}22, ${meta.color}08)`,
                      position:'relative',
                      display:'flex',alignItems:'center',justifyContent:'center',
                    }}>
                      {event.image
                        ? <img src={event.image} alt={event.title} style={{width:'100%',height:'100%',objectFit:'cover',position:'absolute',inset:0}}/>
                        : <div style={{fontFamily:fonts.mono,fontSize:'0.55rem',letterSpacing:'0.2em',textTransform:'uppercase',color:meta.color,opacity:0.4}}>
                            photo
                          </div>
                      }
                    </div>

                    {/* Type */}
                    <div style={{
                      fontFamily:fonts.mono,fontSize:'0.58rem',
                      letterSpacing:'0.2em',textTransform:'uppercase',
                      color:meta.color,marginBottom:'0.5rem',
                    }}>{meta.label}</div>

                    {/* Title */}
                    <h3 style={{
                      fontFamily:fonts.display,fontSize:'1.05rem',
                      fontWeight:500,color:colors.ink,
                      lineHeight:1.3,margin:'0 0 0.75rem',flex:1,
                    }}>{event.title}</h3>

                    {/* Date */}
                    <div style={{fontFamily:fonts.mono,fontSize:'0.65rem',letterSpacing:'0.08em',color:colors.inkSoft,marginBottom:'0.2rem'}}>
                      {event.date}
                    </div>
                    {/* Location */}
                    <div style={{fontFamily:fonts.mono,fontSize:'0.63rem',letterSpacing:'0.06em',color:colors.inkSoft,lineHeight:1.4,marginBottom:'1rem'}}>
                      {event.location}
                    </div>

                    {/* CTA */}
                    <div style={{
                      fontFamily:fonts.mono,fontSize:'0.65rem',letterSpacing:'0.12em',
                      color:meta.color,marginTop:'auto',
                    }}>{t.viewDetail}</div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Count */}
        {filteredGroups.length > 0 && (
          <div style={{
            textAlign:'center',
            fontFamily:fonts.mono,fontSize:'0.68rem',
            letterSpacing:'0.2em',color:colors.inkSoft,
            paddingTop:'2rem',borderTop:`1px solid ${colors.creamDark}`,
          }}>
            แสดง {totalCount} จาก {eventsData.length} events
          </div>
        )}
      </div>

      {selected && <EventModal event={selected} onClose={() => setSelected(null)} t={t} />}
    </>
  );
}
