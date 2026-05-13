import { useState, useEffect } from 'react';
import { colors, fonts } from '../styles/theme';
import { useLang } from '../context/LanguageContext';
import { translations } from '../data/translations';
import SectionHeader from './SectionHeader';

const CALENDAR_ID = import.meta.env.VITE_GOOGLE_CALENDAR_ID || '';
const API_KEY     = import.meta.env.VITE_GOOGLE_CALENDAR_API_KEY || '';

function parseDate(event) {
  const raw = event.start?.dateTime || event.start?.date;
  return raw ? new Date(raw) : null;
}

function formatDay(d)  { return d.getDate().toString().padStart(2, '0'); }
function formatMonth(d, lang) {
  return d.toLocaleDateString(lang === 'th' ? 'th-TH' : 'en', { month: 'short' }).toUpperCase();
}
function formatTime(event, lang) {
  if (!event.start?.dateTime) return lang === 'th' ? 'ทั้งวัน' : 'All Day';
  return new Date(event.start.dateTime).toLocaleTimeString(
    lang === 'th' ? 'th-TH' : 'en',
    { hour: '2-digit', minute: '2-digit' }
  );
}

const label = {
  open:    { th: 'ดูรายละเอียด',          en: 'View Details',             zh: '查看详情' },
  save:    { th: '+ บันทึกในปฏิทินของฉัน', en: '+ Save to My Calendar',    zh: '+ 保存到我的日历' },
  viewAll: { th: 'ดูปฏิทินทั้งหมด',      en: 'View Full Calendar',        zh: '查看完整日历' },
  noEvent: { th: 'ไม่มีกำหนดการที่ใกล้จะถึง', en: 'No upcoming events',   zh: '暂无活动' },
  errLoad: { th: 'ไม่สามารถโหลดกำหนดการได้',  en: 'Could not load events', zh: '无法加载日程' },
};

/* สร้าง URL สำหรับ "Add to my Google Calendar"
   — ใช้ได้ทั้ง desktop (เปิด browser) และ mobile (เปิด app ถ้าติดตั้งอยู่) */
function makeAddUrl(ev) {
  const fmtDT = d => d.toISOString().replace(/[-:]/g,'').slice(0,15)+'Z';
  const fmtD  = s => s.replace(/-/g,'');
  let dates;
  if (ev.start?.dateTime) {
    const s = new Date(ev.start.dateTime);
    const e = ev.end?.dateTime ? new Date(ev.end.dateTime) : new Date(s.getTime()+3600000);
    dates = `${fmtDT(s)}/${fmtDT(e)}`;
  } else {
    const s = fmtD(ev.start.date);
    const e = ev.end?.date ? fmtD(ev.end.date) : s;
    dates = `${s}/${e}`;
  }
  const p = new URLSearchParams({
    action:   'TEMPLATE',
    text:     ev.summary || '',
    dates,
    details:  (ev.description || '').replace(/<[^>]+>/g,''),
    location: ev.location || '',
  });
  return `https://calendar.google.com/calendar/render?${p.toString()}`;
}

export default function Schedule() {
  const { lang } = useLang();
  const t = translations[lang].schedule;

  const [events,   setEvents]   = useState([]);
  const [status,   setStatus]   = useState('loading'); // loading | ok | error | nokey
  const [errDetail, setErrDetail] = useState('');

  useEffect(() => {
    if (!API_KEY || !CALENDAR_ID) { setStatus('nokey'); return; }
    const now = new Date().toISOString();
    const url =
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events` +
      `?key=${API_KEY}&timeMin=${now}&maxResults=3&orderBy=startTime&singleEvents=true`;

    fetch(url)
      .then(async r => {
        const json = await r.json();
        if (!r.ok) {
          const msg = `HTTP ${r.status}: ${json?.error?.message || r.statusText}`;
          console.error('[Calendar]', msg, json);
          throw new Error(msg);
        }
        return json;
      })
      .then(d => { setEvents(d.items || []); setStatus('ok'); })
      .catch(e => { setErrDetail(e.message); setStatus('error'); });
  }, []);

  const calendarUrl = `https://calendar.google.com/calendar/r?cid=${encodeURIComponent(CALENDAR_ID)}`;

  return (
    <>
      <style>{`
        @media (max-width: 968px) {
          .schedule-section-tj { padding: 5rem 1.5rem !important; }
        }
        @keyframes sc-pulse { 0%,100%{opacity:.5} 50%{opacity:.9} }
        .sc-skeleton { animation: sc-pulse 1.5s ease infinite; }
        .sc-card {
          background: ${colors.cream};
          border-left: 4px solid ${colors.accent};
          padding: 1.5rem;
          display: flex;
          gap: 1.5rem;
          align-items: flex-start;
        }
        .sc-arrow { display: inline-block; transition: transform .2s ease; }
        .sc-save-btn {
          display: inline-flex; align-items: center; gap: .3rem;
          font-family: ${fonts.mono}; font-size: .62rem; letter-spacing: .12em;
          text-transform: uppercase; cursor: pointer;
          background: none; border: 1px solid ${colors.accent};
          color: ${colors.accent}; padding: .38rem .85rem;
          transition: background .2s, color .2s;
          white-space: nowrap; flex-shrink: 0;
        }
        .sc-save-btn:hover { background: ${colors.accent}; color: #fff; }
        .sc-actions { display: flex; align-items: center; gap: .75rem; flex-wrap: wrap; margin-top: .65rem; }
        .sc-open-link {
          display: inline-flex; align-items: center; gap: .3rem;
          font-family: ${fonts.mono}; font-size: .62rem; letter-spacing: .12em;
          text-transform: uppercase; color: ${colors.inkSoft}; text-decoration: none;
          transition: color .2s;
        }
        .sc-open-link:hover { color: ${colors.ink}; }
        .sc-open-link:hover .sc-arrow { transform: translateX(4px); }
        .sc-viewall {
          display: inline-block;
          font-family: ${fonts.mono}; font-size: .75rem; letter-spacing: .2em;
          text-transform: uppercase; text-decoration: none;
          background: none; border: 1px solid ${colors.ink};
          color: ${colors.ink}; padding: .75rem 2rem;
          transition: background .2s, color .2s;
        }
        .sc-viewall:hover { background: ${colors.ink}; color: ${colors.cream}; }
      `}</style>

      <section id="schedule" className="schedule-section-tj" style={{
        padding: '8rem 3rem',
        background: colors.blueSoft,
        position: 'relative',
        zIndex: 2,
      }}>
        <SectionHeader num={t.sectionNum} title={t.sectionTitle} italic={t.sectionItalic} />

        {/* ── Live badge ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem',
          fontFamily: fonts.mono, fontSize: '.65rem', letterSpacing: '.18em',
          textTransform: 'uppercase', color: colors.inkSoft, marginBottom: '2rem' }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%',
            background: status === 'ok' ? '#5cb85c' : colors.creamDark,
            transition: 'background .4s' }} />
          {status === 'ok'
            ? (lang === 'th' ? 'อัปเดตอัตโนมัติจาก Google Calendar' : 'Live from Google Calendar')
            : status === 'loading'
            ? (lang === 'th' ? 'กำลังโหลด…' : 'Loading…')
            : (lang === 'th' ? 'Google Calendar' : 'Google Calendar')}
        </div>

        {/* ── Cards grid ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2.5rem',
        }}>

          {/* Loading skeleton */}
          {status === 'loading' && [0,1,2].map(i => (
            <div key={i} className="sc-skeleton" style={{
              background: colors.cream, borderLeft: `4px solid ${colors.creamDark}`,
              padding: '1.5rem', display: 'flex', gap: '1.5rem', alignItems: 'center',
              minHeight: 100,
            }}>
              <div style={{ width: 48, height: 62, background: colors.creamDark,
                borderRadius: 3, flexShrink: 0 }} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 9 }}>
                <div style={{ height: 14, background: colors.creamDark, borderRadius: 3, width: '65%' }} />
                <div style={{ height: 11, background: colors.creamDark, borderRadius: 3, width: '45%' }} />
              </div>
            </div>
          ))}

          {/* No events */}
          {status === 'ok' && events.length === 0 && (
            <div style={{ gridColumn: '1/-1', padding: '2.5rem', textAlign: 'center',
              background: colors.cream, borderLeft: `4px solid ${colors.creamDark}`,
              fontFamily: fonts.mono, fontSize: '.8rem', letterSpacing: '.15em',
              textTransform: 'uppercase', color: colors.inkSoft }}>
              {label.noEvent[lang] || label.noEvent.en}
            </div>
          )}

          {/* Error / no key */}
          {(status === 'error' || status === 'nokey') && (
            <div style={{ gridColumn: '1/-1', padding: '1.5rem',
              background: colors.cream, borderLeft: `4px solid ${colors.creamDark}`,
              fontFamily: fonts.mono, fontSize: '.75rem', letterSpacing: '.12em',
              color: colors.inkSoft }}>
              <div>{label.errLoad[lang] || label.errLoad.en}</div>
              {errDetail && (
                <div style={{ marginTop: '.5rem', fontSize: '.68rem', opacity: .7 }}>
                  {errDetail}
                </div>
              )}
              {status === 'nokey' && (
                <div style={{ marginTop: '.5rem', fontSize: '.68rem', opacity: .7 }}>
                  Missing VITE_GOOGLE_CALENDAR_API_KEY or VITE_GOOGLE_CALENDAR_ID in .env.local
                </div>
              )}
            </div>
          )}

          {/* Event cards */}
          {status === 'ok' && events.map((ev, i) => {
            const d     = parseDate(ev);
            const day   = d ? formatDay(d) : '—';
            const month = d ? formatMonth(d, lang) : '—';
            const time  = formatTime(ev, lang);
            const desc  = ev.description
              ? ev.description.replace(/<[^>]+>/g, '').slice(0, 90)
              : '';

            return (
              <div key={ev.id || i} className="sc-card">
                {/* Date column */}
                <div style={{
                  textAlign: 'center',
                  borderRight: `1px solid ${colors.creamDark}`,
                  paddingRight: '1.5rem',
                  flexShrink: 0,
                  minWidth: 52,
                  alignSelf: 'flex-start',
                  paddingTop: '.2rem',
                }}>
                  <div style={{ fontFamily: fonts.display, fontSize: '2.5rem',
                    fontWeight: 500, lineHeight: 1, color: colors.ink }}>
                    {day}
                  </div>
                  <div style={{ fontFamily: fonts.mono, fontSize: '.72rem', letterSpacing: '.18em',
                    textTransform: 'uppercase', color: colors.accent, marginTop: '.2rem' }}>
                    {month}
                  </div>
                  <div style={{ fontFamily: fonts.mono, fontSize: '.62rem', letterSpacing: '.1em',
                    color: colors.inkSoft, marginTop: '.2rem' }}>
                    {time}
                  </div>
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 style={{ fontFamily: fonts.display, fontSize: '1.2rem', fontWeight: 500,
                    marginBottom: '.3rem', color: colors.ink,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {ev.summary || (lang === 'th' ? 'ไม่มีชื่อ' : 'Untitled')}
                  </h4>
                  {desc && (
                    <p style={{ fontSize: '.8rem', color: colors.inkSoft, lineHeight: 1.5,
                      overflow: 'hidden', display: '-webkit-box',
                      WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {desc}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="sc-actions">
                    <a className="sc-open-link"
                      href={ev.htmlLink} target="_blank" rel="noopener noreferrer">
                      <span className="sc-arrow">→</span>
                      <span>{label.open[lang] || label.open.en}</span>
                    </a>
                    <button className="sc-save-btn"
                      onClick={() => window.open(makeAddUrl(ev), '_blank')}>
                      {label.save[lang] || label.save.en}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Embedded calendar ── */}
        {CALENDAR_ID && (
          <div style={{ marginBottom: '2.5rem',
            border: `1px solid ${colors.creamDark}`,
            boxShadow: `8px 8px 0 ${colors.pink}`,
            overflow: 'hidden' }}>
            <iframe
              src={
                `https://calendar.google.com/calendar/embed` +
                `?src=${encodeURIComponent(CALENDAR_ID)}` +
                `&ctz=Asia%2FBangkok` +
                `&showTitle=0&showNav=1&showDate=1&showPrint=0` +
                `&showTabs=0&showCalendars=0&showTz=0&mode=MONTH` +
                `&bgcolor=%23fdf6ec`
              }
              style={{ width: '100%', height: 520, border: 'none', display: 'block' }}
              loading="lazy"
              title="Tee Jaruji Calendar"
            />
          </div>
        )}

        {/* ── View full calendar ── */}
        <div style={{ textAlign: 'center' }}>
          <a href={calendarUrl} target="_blank" rel="noopener noreferrer" className="sc-viewall">
            {label.viewAll[lang] || label.viewAll.en}
          </a>
        </div>
      </section>
    </>
  );
}
