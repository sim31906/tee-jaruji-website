import { colors, fonts } from '../styles/theme';
import { services, reportFormUrl } from '../data/siteData';
import SectionHeader from './SectionHeader';
import TiltCard from './TiltCard';
import Reveal from './Reveal';

export default function Fanclub() {
  return (
    <>
      <style>{`
        .service-card-tj {
          position: relative;
          overflow: hidden;
          transition: color 0.4s;
        }
        .service-card-tj::before {
          content: '';
          position: absolute;
          inset: 0;
          background: ${colors.pink};
          transform: translateX(-100%);
          transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .service-card-tj:hover::before { transform: translateX(0); }
        .service-card-tj:hover { color: ${colors.ink} !important; }
        .service-card-tj > * { position: relative; z-index: 1; }

        .report-button-tj:hover {
          background: ${colors.cream} !important;
          color: ${colors.ink} !important;
        }

        @media (max-width: 968px) {
          .service-grid-tj { grid-template-columns: 1fr !important; }
          .report-banner-tj { grid-template-columns: 1fr !important; }
          .fanclub-section-tj { padding: 5rem 1.5rem !important; }
        }
      `}</style>

      <section
        id="fanclub"
        className="fanclub-section-tj"
        style={{
          padding: '8rem 3rem',
          background: `linear-gradient(135deg, ${colors.ink}, #5a4143)`,
          color: colors.cream,
          position: 'relative',
          zIndex: 2,
        }}
      >
        <SectionHeader num="06 / Fanclub Services" title="บริการ" italic="เเฟนคลับ" dark />

        <p style={{
          maxWidth: '600px',
          fontSize: '1rem',
          lineHeight: 1.7,
          opacity: 0.8,
          marginBottom: '3rem',
        }}>
          ช่องทางสำหรับเเฟนคลับที่ต้องการสนับสนุน · จัดกิจกรรม · หรือเเจ้งปัญหาต่าง ๆ ทีมงานยินดีดูเเลทุกท่านอย่างใกล้ชิด
        </p>

        <div className="service-grid-tj" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '2rem',
          marginBottom: '4rem',
        }}>
          {services.map((s, i) => (
            <Reveal key={i} delay={i * 150}>
            <TiltCard style={{ height: '100%' }}>
            <div
              className="service-card-tj"
              style={{
                border: `1px solid rgba(253, 246, 236, 0.2)`,
                padding: '3rem 2.5rem',
                color: colors.cream,
                cursor: 'pointer',
              }}
            >
              <span style={{
                fontFamily: fonts.display,
                fontStyle: 'italic',
                fontSize: '1rem',
                color: colors.pink,
                marginBottom: '1rem',
                display: 'block',
              }}>
                {s.num}
              </span>
              <h3 style={{
                fontFamily: fonts.display,
                fontSize: '2rem',
                fontWeight: 500,
                marginBottom: '1rem',
                lineHeight: 1.1,
                whiteSpace: 'pre-line',
              }}>
                {s.title}
              </h3>
              <p style={{
                fontSize: '0.95rem',
                lineHeight: 1.7,
                opacity: 0.8,
                marginBottom: '2rem',
              }}>
                {s.desc}
              </p>
              <div style={{
                fontFamily: fonts.mono,
                fontSize: '0.75rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
              }}>
                {s.arrow}
              </div>
            </div>
            </TiltCard>
            </Reveal>
          ))}
        </div>

        <div className="report-banner-tj" style={{
          background: colors.pink,
          color: colors.ink,
          padding: '3rem',
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '2rem',
          alignItems: 'center',
          borderRadius: '4px',
        }}>
          <div>
            <h3 style={{
              fontFamily: fonts.display,
              fontSize: '2.2rem',
              fontWeight: 500,
              lineHeight: 1.1,
              marginBottom: '0.75rem',
            }}>
              เเจ้งปัญหา / รายงาน
            </h3>
            <p style={{
              fontSize: '0.95rem',
              lineHeight: 1.6,
              opacity: 0.85,
            }}>
              พบเห็นบัญชีปลอม ภาพ/วิดีโอที่ใช้โดยไม่ได้รับอนุญาต ข้อมูลเท็จ หรือต้องการรายงานเรื่องอื่น ๆ สามารถส่งเรื่องผ่านเเบบฟอร์มได้ตลอด 24 ชั่วโมง
            </p>
          </div>
          <a
            href={reportFormUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="report-button-tj"
            style={{
              display: 'inline-block',
              background: colors.ink,
              color: colors.cream,
              padding: '1.25rem 2.5rem',
              fontFamily: fonts.mono,
              fontSize: '0.75rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              textAlign: 'center',
              transition: 'all 0.3s',
            }}
          >
            Open Report Form ↗
          </a>
        </div>

        <p style={{
          fontFamily: fonts.mono,
          fontSize: '0.7rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'rgba(253, 246, 236, 0.4)',
          marginTop: '1.5rem',
          textAlign: 'center',
        }}>
          * เปลี่ยน Google Form URL ใน src/data/siteData.js
        </p>
      </section>
    </>
  );
}
