import { useState, useEffect, useLayoutEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { colors, fonts } from "../styles/theme";
import CursorSparkle from "../components/CursorSparkle";
import { useLang } from "../context/LanguageContext";
import { SiNetflix, SiYoutube } from "react-icons/si";
import { translations } from "../data/translations";
import { SHOWS } from "../data/performanceData";

function pad(n) {
  return String(n).padStart(2, "0");
}

const PLATFORM_CONFIG = {
  Netflix: { label: "Netflix", bg: "#E50914" },
  "Ch3+": { label: "Ch3+", bg: "#000000" },
  "AIS Play": { label: "AIS Play", bg: "#000000" },
  YouTube: { label: "YouTube", bg: "#FF0000" },
  "YouTube (ENG SUB)": { label: "YT ENG", bg: "#FF0000" },
};

const IMAGE_PLATFORMS = new Set(["Ch3+", "AIS Play"]);

function getPlatformIcon(name, size = 22) {
  if (name === "Netflix") return <SiNetflix size={size} />;
  if (name === "YouTube (ENG SUB)")
    return (
      <>
        <SiYoutube size={size} />
        <span
          style={{
            fontFamily: fonts.mono,
            fontSize: "0.38rem",
            letterSpacing: "0.08em",
            opacity: 0.9,
            lineHeight: 1,
            marginTop: "2px",
          }}
        >
          ENG
        </span>
      </>
    );
  if (name.startsWith("YouTube")) return <SiYoutube size={size} />;
  if (name === "Ch3+")
    return (
      <img
        src="/platforms/ch3plus.png"
        alt="Ch3+"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: "inherit",
        }}
      />
    );
  if (name === "AIS Play")
    return (
      <img
        src="/platforms/ais-play.png"
        alt="AIS Play"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: "inherit",
        }}
      />
    );
  return (
    <span
      style={{ fontFamily: fonts.mono, fontSize: "0.7rem", fontWeight: 700 }}
    >
      {name}
    </span>
  );
}

function PlatformBadge({ p }) {
  return (
    <a
      href={p.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      style={{
        display: "inline-block",
        padding: "0.35rem 0.85rem",
        borderRadius: "2px",
        background: p.color,
        color: "#fff",
        fontFamily: fonts.mono,
        fontSize: "0.7rem",
        fontWeight: 600,
        letterSpacing: "0.1em",
        textDecoration: "none",
        whiteSpace: "nowrap",
        transition: "opacity 0.2s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
    >
      {p.name}
    </a>
  );
}

function ShowCard({ show, index, onClick, t, lang }) {
  const [hovered, setHovered] = useState(false);
  const typeLabel = show.type === "movie" ? t.typeMovie : show.type === "variety" ? t.typeVariety : t.typeSeries;
  const primaryTitle = lang === "th" ? show.titleTh : show.titleEn;
  const secondaryTitle = lang === "th" ? show.titleEn : show.titleTh;
  const secondaryIsThai = lang !== "th";

  return (
    <div
      onClick={() => onClick(show)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="show-card-tj"
      style={{
        position: "relative",
        background: colors.cream,
        border: `1px solid ${colors.ink}`,
        cursor: "pointer",
        overflow: "hidden",
        transition: "box-shadow 0.3s cubic-bezier(0.4,0,0.2,1)",
        boxShadow: hovered
          ? `8px 8px 0 ${colors.ink}`
          : "4px 4px 0 transparent",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* accent bar */}
      <div
        style={{
          height: "5px",
          background: show.accentColor,
          transform: hovered ? "scaleX(1)" : "scaleX(0.3)",
          transformOrigin: "left",
          transition: "transform 0.4s cubic-bezier(0.4,0,0.2,1)",
        }}
      />

      {/* poster area */}
      <div
        style={{
          width: "100%",
          aspectRatio: "16/9",
          background: `linear-gradient(135deg, ${show.gradient[0]}, ${show.gradient[1]})`,
          position: "relative",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        {show.image ? (
          <img
            src={show.image}
            alt={show.titleTh}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "top center",
            }}
          />
        ) : (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontFamily: fonts.display,
                fontSize: "4.5rem",
                fontStyle: "italic",
                color: "rgba(61,44,46,0.15)",
                userSelect: "none",
                lineHeight: 1,
              }}
            >
              {pad(index + 1)}
            </span>
          </div>
        )}

        {/* type badge */}
        <div
          style={{
            position: "absolute",
            top: "0.75rem",
            right: "0.75rem",
            background:
              show.type === "movie" ? colors.ink : "rgba(61,44,46,0.75)",
            color: colors.cream,
            fontFamily: fonts.mono,
            fontSize: "0.62rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            padding: "0.2rem 0.55rem",
            borderRadius: "2px",
            backdropFilter: "blur(4px)",
          }}
        >
          {typeLabel}
        </div>

        {/* hover overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `${show.accentColor}cc`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.3s",
          }}
        >
          <span
            style={{
              fontFamily: fonts.mono,
              fontSize: "0.78rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: colors.ink,
              fontWeight: 600,
            }}
          >
            {t.viewDetail}
          </span>
        </div>
      </div>

      {/* card body */}
      <div
        style={{
          padding: "1.25rem 1.25rem 1.5rem",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
        }}
      >
        <div
          style={{
            fontFamily: fonts.mono,
            fontSize: "0.65rem",
            letterSpacing: "0.3em",
            color: colors.accent,
          }}
        >
          {pad(index + 1)}
        </div>
        <h3
          style={{
            fontFamily: secondaryIsThai ? fonts.body : fonts.display,
            fontSize: "1.35rem",
            fontWeight: 700,
            lineHeight: 1.15,
            color: colors.ink,
          }}
        >
          {primaryTitle}
        </h3>
        <p
          style={{
            fontFamily: secondaryIsThai ? fonts.body : fonts.display,
            fontSize: "0.92rem",
            fontStyle: secondaryIsThai ? "normal" : "italic",
            color: colors.ink,
            lineHeight: 1.3,
          }}
        >
          {secondaryTitle}
        </p>

        {/* platforms */}
        <div
          style={{
            marginTop: "auto",
            paddingTop: "0.75rem",
            display: "flex",
            flexWrap: "wrap",
            gap: "0.4rem",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {show.platforms.map((p, i) => (
            <a
              key={i}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              title={p.name}
              className="platform-tile"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "1px",
                width: "48px",
                height: "48px",
                background: PLATFORM_CONFIG[p.name]?.bg ?? p.color,
                color: "#fff",
                borderRadius: "8px",
                textDecoration: "none",
                boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {getPlatformIcon(p.name, 24)}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function ShowModal({ show, onClose, t, lang }) {
  const primaryTitle = lang === "th" ? show.titleTh : show.titleEn;
  const secondaryTitle = lang === "th" ? show.titleEn : show.titleTh;
  const secondaryIsThai = lang !== "th";
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(61,44,46,0.65)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        animation: "fadeInModal 0.25s ease",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: colors.cream,
          width: "100%",
          maxWidth: "900px",
          maxHeight: "90vh",
          borderRadius: "6px",
          overflow: "hidden",
          position: "relative",
          boxShadow: "0 32px 80px rgba(0,0,0,0.35)",
          animation: "modalIn 0.38s cubic-bezier(0.34,1.08,0.64,1)",
          display: "flex",
          flexDirection: "column",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ overflowY: "auto", flex: 1 }}>
        {/* modal header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1.5rem",
            padding: "1.75rem 1.75rem",
            borderBottom: `1px solid ${colors.creamDark}`,
            position: "sticky",
            top: 0,
            background: `linear-gradient(135deg, ${show.gradient[0]}, ${show.gradient[1]}, ${colors.cream} 70%)`,
            zIndex: 10,
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontFamily: fonts.mono,
                fontSize: "0.65rem",
                letterSpacing: "0.3em",
                color: colors.accent,
                marginBottom: "0.4rem",
              }}
            >
              {show.type === "movie" ? t.typeMovie : show.type === "variety" ? t.typeVariety : t.typeSeries} ·{" "}
              {t.modalCategory}
            </div>
            <h2
              style={{
                fontFamily: secondaryIsThai ? fonts.body : fonts.display,
                fontSize: "clamp(1.5rem, 3vw, 2rem)",
                fontWeight: 700,
                color: colors.ink,
                lineHeight: 1.1,
                marginBottom: "0.3rem",
              }}
            >
              {primaryTitle}
            </h2>
            <p
              style={{
                fontFamily: secondaryIsThai ? fonts.body : fonts.display,
                fontSize: "1rem",
                fontStyle: secondaryIsThai ? "normal" : "italic",
                color: colors.inkSoft,
              }}
            >
              {secondaryTitle}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="ปิด"
            style={{
              flexShrink: 0,
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              border: `1px solid ${colors.creamDark}`,
              background: "transparent",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.2rem",
              color: colors.inkSoft,
              transition: "background 0.2s, color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = colors.ink;
              e.currentTarget.style.color = colors.cream;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = colors.inkSoft;
            }}
          >
            ×
          </button>
        </div>

        {/* modal body */}
        <div className="modal-body-tj" style={{ display: "flex", gap: 0 }}>
          {/* left col: poster + platforms */}
          <div
            className="modal-left-tj"
            style={{
              width: "220px",
              flexShrink: 0,
              borderRight: `1px solid ${colors.creamDark}`,
              padding: "1.75rem 1.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
            }}
          >
            {/* poster */}
            <div
              className="modal-poster-tj"
              style={{
                width: "100%",
                aspectRatio: "2/3",
                background: `linear-gradient(160deg, ${show.gradient[0]}, ${show.gradient[1]})`,
                borderRadius: "4px",
                overflow: "hidden",
                position: "relative",
                boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
              }}
            >
              {show.posterImage || show.image ? (
                <img
                  src={show.posterImage || show.image}
                  alt={show.titleTh}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "top center",
                  }}
                />
              ) : (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                  }}
                >
                  <span
                    style={{
                      fontFamily: fonts.display,
                      fontSize: "3rem",
                      fontStyle: "italic",
                      color: "rgba(61,44,46,0.25)",
                      lineHeight: 1,
                    }}
                  >
                    {String(show.id).padStart(2, "0")}
                  </span>
                  <span
                    style={{
                      fontFamily: fonts.mono,
                      fontSize: "0.55rem",
                      letterSpacing: "0.2em",
                      color: "rgba(61,44,46,0.35)",
                      textTransform: "uppercase",
                    }}
                  >
                    {t.posterAlt}
                  </span>
                </div>
              )}
              {/* color bar */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: "4px",
                  background: show.accentColor,
                }}
              />
            </div>

            {/* platform links */}
            <div>
              <div
                style={{
                  fontFamily: fonts.mono,
                  fontSize: "0.62rem",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: colors.inkSoft,
                  marginBottom: "0.75rem",
                }}
              >
                {t.watchOn}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {show.platforms.map((p, i) => (
                  <a
                    key={i}
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={p.name}
                    className="platform-tile"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "1px",
                      width: "64px",
                      height: "64px",
                      background: PLATFORM_CONFIG[p.name]?.bg ?? p.color,
                      color: "#fff",
                      borderRadius: "10px",
                      textDecoration: "none",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {getPlatformIcon(p.name, 28)}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* right col: trailer + summary */}
          <div
            className="modal-right-tj"
            style={{
              flex: 1,
              minWidth: 0,
              padding: "1.75rem 2rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
            }}
          >
            {/* trailer */}
            <div>
              <div
                style={{
                  fontFamily: fonts.mono,
                  fontSize: "0.62rem",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: colors.accent,
                  marginBottom: "0.75rem",
                }}
              >
                {t.trailerLabel}
              </div>
              {show.trailerUrl ? (
                <div
                  style={{
                    position: "relative",
                    paddingTop: "56.25%",
                    borderRadius: "4px",
                    overflow: "hidden",
                    background: "#000",
                  }}
                >
                  <iframe
                    src={show.trailerUrl}
                    title={`${show.titleEn} trailer`}
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      border: "none",
                    }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div
                  style={{
                    aspectRatio: "16/9",
                    background: `linear-gradient(135deg, ${show.gradient[0]}55, ${show.gradient[1]}55)`,
                    border: `1px dashed ${show.accentColor}`,
                    borderRadius: "4px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                  }}
                >
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "50%",
                      border: `2px solid ${show.accentColor}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "1rem",
                        marginLeft: "3px",
                        color: show.accentColor,
                      }}
                    >
                      ▶
                    </span>
                  </div>
                  <span
                    style={{
                      fontFamily: fonts.mono,
                      fontSize: "0.65rem",
                      letterSpacing: "0.2em",
                      color: colors.inkSoft,
                      textTransform: "uppercase",
                    }}
                  >
                    {t.noTrailer}
                  </span>
                </div>
              )}
            </div>

            {lang === "th" ? (
              <>
                {/* TH: แสดง summaryTh + summaryEn */}
                <div>
                  <div
                    style={{
                      fontFamily: fonts.mono,
                      fontSize: "0.62rem",
                      letterSpacing: "0.25em",
                      textTransform: "uppercase",
                      color: colors.accent,
                      marginBottom: "0.6rem",
                    }}
                  >
                    {t.summaryLabel}
                  </div>
                  <p
                    style={{
                      fontFamily: fonts.body,
                      fontSize: "0.95rem",
                      lineHeight: 1.85,
                      color: colors.ink,
                    }}
                  >
                    {show.summaryTh}
                  </p>
                </div>
                <div
                  style={{
                    paddingTop: "0.25rem",
                    borderTop: `1px solid ${colors.creamDark}`,
                  }}
                >
                  <div
                    style={{
                      fontFamily: fonts.mono,
                      fontSize: "0.62rem",
                      letterSpacing: "0.25em",
                      textTransform: "uppercase",
                      color: colors.inkSoft,
                      marginBottom: "0.6rem",
                      marginTop: "1rem",
                    }}
                  >
                    {t.synopsisLabel}
                  </div>
                  <p
                    style={{
                      fontFamily: fonts.body,
                      fontSize: "0.92rem",
                      lineHeight: 1.8,
                      color: colors.inkSoft,
                      fontStyle: "italic",
                    }}
                  >
                    {show.summaryEn}
                  </p>
                </div>
              </>
            ) : (
              <div>
                <div
                  style={{
                    fontFamily: fonts.mono,
                    fontSize: "0.62rem",
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                    color: colors.accent,
                    marginBottom: "0.6rem",
                  }}
                >
                  {t.synopsisLabel}
                </div>
                <p
                  style={{
                    fontFamily: fonts.body,
                    fontSize: "0.95rem",
                    lineHeight: 1.85,
                    color: colors.ink,
                  }}
                >
                  {lang === "zh" ? show.summaryZh : show.summaryEn}11
                </p>
              </div>
            )}
          </div>
        </div>
        </div>{/* end scrollable inner */}
      </div>
    </div>
  );
}

export default function PerformancePage() {
  const navigate = useNavigate();
  const { lang } = useLang();
  const t = translations[lang].performance;
  const [selectedShow, setSelectedShow] = useState(null);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleClose = useCallback(() => setSelectedShow(null), []);

  function goBack() {
    navigate("/", { state: { scrollTo: "selected-works" } });
  }

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${colors.cream}; }

        .perf-grid-tj {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.75rem;
        }
        .modal-body-tj {
          display: flex;
        }
        .modal-left-tj {
          width: 220px !important;
        }

        @media (max-width: 1024px) {
          .perf-grid-tj { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .perf-grid-tj { grid-template-columns: 1fr !important; }
          .perf-hero-tj { padding: 6rem 1.5rem 3rem !important; }
          .perf-body-tj { padding: 3rem 1.5rem !important; }
          .modal-body-tj { flex-direction: column !important; }
          .modal-left-tj {
            width: 100% !important;
            overflow: hidden !important;
            border-right: none !important;
            border-bottom: 1px solid ${colors.creamDark} !important;
          }
          .modal-poster-tj {
            max-width: 270px !important;
            max-height: 405px !important;
            margin: 0 auto !important;
          }
          .modal-poster-tj img {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          .modal-right-tj { padding: 1.5rem !important; }
        }

        .back-btn-perf:hover { color: ${colors.ink} !important; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${colors.creamDark}; border-radius: 3px; }

        @keyframes fadeInModal { from { opacity: 0; } to { opacity: 1; } }
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.92) translateY(16px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }

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
        .platform-tile { animation: platform-pop-out 0.25s ease forwards; }
        .platform-tile:hover { animation: platform-pop 0.45s cubic-bezier(0.34,1.56,0.64,1) forwards; }
      `}</style>

      <CursorSparkle />

      {/* nav */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1.5rem 3rem",
          background: `${colors.cream}ee`,
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${colors.creamDark}`,
        }}
      >
        <button
          onClick={goBack}
          className="back-btn-perf"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            fontFamily: fonts.mono,
            fontSize: "0.75rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: colors.inkSoft,
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            transition: "color 0.2s",
          }}
        >
          {t.backNav}
        </button>
        <span
          style={{
            fontFamily: fonts.display,
            fontSize: "1.1rem",
            letterSpacing: "0.15em",
            color: colors.ink,
          }}
        >
          Tee · Jaruji
        </span>
      </nav>

      {/* hero */}
      <div
        className="perf-hero-tj"
        style={{
          padding: "10rem 4rem 5rem",
          background: `linear-gradient(135deg, ${colors.pinkSoft}, ${colors.blueSoft})`,
          backgroundImage: `linear-gradient(135deg, rgba(252,228,234,0.75), rgba(220,234,244,0.75)), url(/perf-hero-bg.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* watermark */}
        <div
          style={{
            position: "absolute",
            right: "-1rem",
            bottom: "-3rem",
            fontFamily: fonts.display,
            fontSize: "clamp(10rem, 25vw, 20rem)",
            fontStyle: "italic",
            color: colors.blue,
            opacity: 0.12,
            lineHeight: 1,
            userSelect: "none",
            pointerEvents: "none",
          }}
        >
          P
        </div>

        <div style={{
            fontFamily: fonts.mono,
            fontSize: "0.68rem",
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            color: colors.accent,
            marginBottom: "1rem",
            textShadow: '0 1px 6px rgba(253,246,236,1)',
          }}
        >
          {t.categoryLabel}
        </div>
        <h1
          style={{
            fontFamily: fonts.display,
            fontSize: "clamp(2.8rem, 7vw, 5rem)",
            fontWeight: 500,
            lineHeight: 1.0,
            letterSpacing: "-0.02em",
            color: colors.ink,
            maxWidth: "700px",
            margin: "0 0 1rem",
            textShadow: '0 1px 4px rgba(253,246,236,1), 0 2px 16px rgba(253,246,236,0.9), 0 4px 30px rgba(253,246,236,0.7)',
          }}
        >
          {t.titleMain}{" "}
          <span style={{ fontStyle: "italic", color: colors.accent }}>
            {t.titleItalic}
          </span>
        </h1>
        <p
          style={{
            fontFamily: fonts.body,
            fontSize: "1rem",
            lineHeight: 1.7,
            color: colors.ink,
            maxWidth: "500px",
            margin: 0,
            textShadow: '0 1px 6px rgba(253,246,236,1), 0 2px 14px rgba(253,246,236,0.8)',
          }}
        >
          {t.subtitle}
        </p>
      </div>

      {/* grid */}
      <div
        className="perf-body-tj"
        style={{ padding: "4rem", maxWidth: "1200px", margin: "0 auto" }}
      >
        <div
          style={{
            fontFamily: fonts.mono,
            fontSize: "0.85rem",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: colors.accent,
            marginBottom: "2rem",
          }}
        >
          {t.allWorks} · {SHOWS.length} {t.itemsUnit}
        </div>

        <div className="perf-grid-tj">
          {SHOWS.map((show, i) => (
            <ShowCard
              key={show.id}
              show={show}
              index={i}
              onClick={setSelectedShow}
              t={t}
              lang={lang}
            />
          ))}
        </div>
      </div>

      {/* footer */}
      <div
        style={{
          padding: "4rem",
          textAlign: "center",
          borderTop: `1px solid ${colors.creamDark}`,
          marginTop: "2rem",
        }}
      >
        <button
          onClick={goBack}
          style={{
            display: "inline-flex",
            alignItems: "center",
            background: colors.ink,
            color: colors.cream,
            padding: "1rem 2.5rem",
            borderRadius: "2px",
            fontFamily: fonts.mono,
            fontSize: "0.78rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            gap: "0.5rem",
            cursor: "pointer",
            border: "none",
            transition: "opacity 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          {t.backButton}
        </button>
      </div>

      {/* modal */}
      {selectedShow && (
        <ShowModal
          show={selectedShow}
          onClose={handleClose}
          t={t}
          lang={lang}
        />
      )}
    </>
  );
}
