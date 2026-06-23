import { useState, useEffect, useRef } from 'react';
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

function htmlToText(html) {
  if (!html) return '';
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<a[^>]*href="([^"]*)"[^>]*>([^<]*)<\/a>/gi, '$2')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ').replace(/&#39;/g, "'").replace(/&quot;/g, '"')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function getStartEnd(ev) {
  if (ev.start?.dateTime) {
    const s = new Date(ev.start.dateTime);
    const e = ev.end?.dateTime ? new Date(ev.end.dateTime) : new Date(s.getTime() + 3600000);
    return { s, e, allDay: false };
  }
  const s = new Date(ev.start.date);
  const e = ev.end?.date ? new Date(ev.end.date) : new Date(s.getTime() + 86400000);
  return { s, e, allDay: true };
}

function makeGoogleUrl(ev) {
  const { s, e, allDay } = getStartEnd(ev);
  const fmt  = d => d.toISOString().replace(/[-:]/g,'').slice(0,15)+'Z';
  const fmtD = d => d.toISOString().slice(0,10).replace(/-/g,'');
  const dates = allDay ? `${fmtD(s)}/${fmtD(e)}` : `${fmt(s)}/${fmt(e)}`;
  const p = new URLSearchParams({
    action: 'TEMPLATE', text: ev.summary || '',
    dates, details: htmlToText(ev.description),
    location: ev.location || '',
  });
  return `https://calendar.google.com/calendar/render?${p}`;
}

function makeOutlookUrl(ev) {
  const { s, e, allDay } = getStartEnd(ev);
  const p = new URLSearchParams({
    path:     '/calendar/action/compose',
    rru:      'addevent',
    subject:  ev.summary || '',
    startdt:  s.toISOString(),
    enddt:    e.toISOString(),
    body:     htmlToText(ev.description),
    location: ev.location || '',
    allday:   allDay ? 'true' : 'false',
  });
  return `https://outlook.live.com/calendar/0/action/compose?${p}`;
}

function makeYahooUrl(ev) {
  const { s, e } = getStartEnd(ev);
  const fmt = d => d.toISOString().replace(/[-:]/g,'').slice(0,15)+'Z';
  const diffH = Math.round((e - s) / 3600000);
  const dur = String(Math.floor(diffH/10)).padStart(1,'0') + String(diffH%10).padStart(1,'0') + '00';
  const p = new URLSearchParams({
    v: '60', view: 'd', type: '20',
    title: ev.summary || '', st: fmt(s),
    dur, desc: htmlToText(ev.description),
    in_loc: ev.location || '',
  });
  return `https://calendar.yahoo.com/?${p}`;
}

function generateICS(ev) {
  const { s, e, allDay } = getStartEnd(ev);
  const fmt  = d => d.toISOString().replace(/[-:]/g,'').slice(0,15)+'Z';
  const fmtD = d => d.toISOString().slice(0,10).replace(/-/g,'');
  const esc  = v => (v||'').replace(/\\/g,'\\\\').replace(/;/g,'\\;').replace(/,/g,'\\,').replace(/\n/g,'\\n');
  const lines = [
    'BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Tee Jaruji//EN','CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${ev.id||Date.now()}@teejaruji.com`,
    allDay ? `DTSTART;VALUE=DATE:${fmtD(s)}` : `DTSTART:${fmt(s)}`,
    allDay ? `DTEND;VALUE=DATE:${fmtD(e)}`   : `DTEND:${fmt(e)}`,
    `SUMMARY:${esc(ev.summary)}`,
    ev.description ? `DESCRIPTION:${esc(htmlToText(ev.description))}` : null,
    ev.location    ? `LOCATION:${esc(ev.location)}` : null,
    'END:VEVENT','END:VCALENDAR',
  ].filter(Boolean);
  return lines.join('\r\n');
}

function downloadICS(ev) {
  const blob = new Blob([generateICS(ev)], { type: 'text/calendar;charset=utf-8' });
  const url  = URL.createObjectURL(blob);
  const a    = Object.assign(document.createElement('a'), {
    href: url, download: `${(ev.summary||'event').replace(/[^\w]/g,'_')}.ics`,
  });
  a.click();
  URL.revokeObjectURL(url);
}

const SAVE_OPTIONS = [
  { id: 'google',  label: 'Google Calendar',     color: '#4285F4', action: ev => window.open(makeGoogleUrl(ev),  '_blank') },
  { id: 'outlook', label: 'Outlook',             color: '#0078D4', action: ev => window.open(makeOutlookUrl(ev), '_blank') },
  { id: 'yahoo',   label: 'Yahoo Calendar',      color: '#6001D2', action: ev => window.open(makeYahooUrl(ev),   '_blank') },
  { id: 'ics',     label: 'iCal / Other (.ics)', color: '#888',    action: ev => downloadICS(ev) },
];

const MONTH_NAMES = {
  th: ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'],
  en: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
  zh: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
};
const DAY_NAMES = {
  th: ['อา','จ','อ','พ','พฤ','ศ','ส'],
  en: ['Su','Mo','Tu','We','Th','Fr','Sa'],
  zh: ['日','一','二','三','四','五','六'],
};

function MiniCalendar({ events, lang, onSelectEvent }) {
  const today = new Date();
  const [viewYear,  setViewYear]  = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selected,  setSelected]  = useState(null);

  const eventDays = new Set(
    events.map(ev => {
      const d = parseDate(ev);
      if (!d) return null;
      if (d.getFullYear() === viewYear && d.getMonth() === viewMonth)
        return d.getDate();
      return null;
    }).filter(Boolean)
  );

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  function prevMonth() {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
    setSelected(null);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
    setSelected(null);
  }

  function handleDay(day) {
    setSelected(day);
    const ev = events.find(ev => {
      const d = parseDate(ev);
      return d && d.getFullYear() === viewYear && d.getMonth() === viewMonth && d.getDate() === day;
    });
    onSelectEvent(ev || null);
  }

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const isToday = (d) => d === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();

  return (
    <div style={{ background: colors.cream, border: `1px solid ${colors.creamDark}`, padding: '1.5rem', userSelect: 'none', maxWidth: 380, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <button onClick={prevMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.ink, fontSize: '1rem', padding: '0 .5rem' }}>‹</button>
        <span style={{ fontFamily: fonts.display, fontSize: '1.1rem', fontWeight: 500, color: colors.ink }}>
          {MONTH_NAMES[lang][viewMonth]} {viewYear}
        </span>
        <button onClick={nextMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.ink, fontSize: '1rem', padding: '0 .5rem' }}>›</button>
      </div>

      {/* Day headers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 6 }}>
        {DAY_NAMES[lang].map(d => (
          <div key={d} style={{ textAlign: 'center', fontFamily: fonts.mono, fontSize: '.6rem', letterSpacing: '.1em', color: colors.inkSoft, padding: '2px 0' }}>
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
        {cells.map((day, i) => (
          <div
            key={i}
            onClick={() => day && handleDay(day)}
            style={{
              height: 36,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: day ? 'pointer' : 'default',
              borderRadius: 4,
              position: 'relative',
              background: day && selected === day ? colors.accent : day && isToday(day) ? colors.pinkSoft : 'transparent',
              transition: 'background .15s',
            }}
          >
            {day && (
              <>
                <span style={{
                  fontFamily: fonts.mono,
                  fontSize: '.75rem',
                  color: selected === day ? '#fff' : isToday(day) ? colors.accent : colors.ink,
                  fontWeight: isToday(day) || selected === day ? 600 : 400,
                }}>
                  {day}
                </span>
                {eventDays.has(day) && (
                  <div style={{
                    width: 4, height: 4, borderRadius: '50%',
                    background: selected === day ? '#fff' : colors.accent,
                    position: 'absolute',
                    bottom: 3,
                  }} />
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Schedule() {
  const { lang } = useLang();
  const t = translations[lang].schedule;

  const [events,       setEvents]       = useState([]);
  const [status,       setStatus]       = useState('loading');
  const [errDetail,    setErrDetail]    = useState('');
  const [openSave,     setOpenSave]     = useState(null);
  const [highlighted,  setHighlighted]  = useState(null);
  const highlightRef = useRef(null);

  useEffect(() => {
    if (!openSave) return;
    const close = () => setOpenSave(null);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [openSave]);

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
        .sc-save-wrap { position: relative; }
        .sc-dropdown {
          position: absolute; top: calc(100% + 6px); left: 0;
          background: ${colors.cream}; border: 1px solid ${colors.creamDark};
          box-shadow: 0 8px 32px rgba(0,0,0,0.12);
          z-index: 100; min-width: 200px;
          animation: sc-drop-in .18s cubic-bezier(.22,.68,0,1.2);
        }
        @keyframes sc-drop-in { from{opacity:0;transform:translateY(-4px)} to{opacity:1;transform:translateY(0)} }
        .sc-drop-item {
          display: flex; align-items: center; gap: .65rem;
          width: 100%; padding: .7rem 1rem; border: none; background: none;
          cursor: pointer; text-align: left; text-decoration: none;
          font-family: ${fonts.mono}; font-size: .7rem; letter-spacing: .12em;
          color: ${colors.ink}; transition: background .15s;
          white-space: nowrap;
        }
        .sc-drop-item:hover { background: ${colors.blueSoft}; }
        .sc-drop-divider { height: 1px; background: ${colors.creamDark}; margin: .2rem 0; }
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
            const isHighlighted = highlighted === (ev.id || i);
            const d     = parseDate(ev);
            const day   = d ? formatDay(d) : '—';
            const month = d ? formatMonth(d, lang) : '—';
            const time  = formatTime(ev, lang);
            const desc  = ev.description
              ? htmlToText(ev.description).slice(0, 200)
              : '';

            return (
              <div
                key={ev.id || i}
                ref={isHighlighted ? highlightRef : null}
                className="sc-card"
                style={{ outline: isHighlighted ? `2px solid ${colors.accent}` : 'none', outlineOffset: 2, transition: 'outline .2s' }}
              >
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
                    whiteSpace: 'normal' }}>
                    {ev.summary || (lang === 'th' ? 'ไม่มีชื่อ' : 'Untitled')}
                  </h4>
                  {desc && (
                    <p style={{ fontSize: '.8rem', color: colors.inkSoft, lineHeight: 1.6,
                      whiteSpace: 'pre-line', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
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

                    {/* Save dropdown */}
                    <div className="sc-save-wrap" onClick={e => e.stopPropagation()}>
                      <button className="sc-save-btn"
                        onClick={() => setOpenSave(openSave === (ev.id||i) ? null : (ev.id||i))}>
                        {label.save[lang] || label.save.en}
                        <span style={{ fontSize: '.55rem', marginLeft: '.2rem' }}>
                          {openSave === (ev.id||i) ? '▲' : '▼'}
                        </span>
                      </button>

                      {openSave === (ev.id||i) && (
                        <div className="sc-dropdown">
                          {SAVE_OPTIONS.map((opt, oi) => (
                            <span key={opt.id}>
                              {oi === SAVE_OPTIONS.length - 1 && <div className="sc-drop-divider" />}
                              <button className="sc-drop-item" onClick={() => { opt.action(ev); setOpenSave(null); }}>
                                <span style={{ width: 8, height: 8, borderRadius: '50%',
                                  background: opt.color, flexShrink: 0, display: 'inline-block' }} />
                                {opt.label}
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
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
            boxShadow: `4px 4px 0 ${colors.pink}`,
            overflow: 'hidden',
            maxWidth: '100%' }}>
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
