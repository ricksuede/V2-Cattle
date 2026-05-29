import React, { useState, useEffect, useRef } from 'react';

// ── Design tokens ─────────────────────────────────────────────
const C = {
  ink:    '#06090f',
  night:  '#0b1520',
  deep:   '#101c2c',
  slate:  '#182840',
  steel:  '#1e3250',
  gold:   '#c9a84c',
  goldL:  '#dfc07a',
  goldD:  '#a88030',
  goldBg: 'rgba(201,168,76,0.09)',
  goldBd: 'rgba(201,168,76,0.20)',
  sage:   '#4d7a5c',
  sageL:  '#62916f',
  cream:  '#f0e8d4',
  sand:   '#ddd4bb',
  body:   '#2a3545',
  text:   '#e6ddc8',
  muted:  '#8a9eb5',
  faint:  '#465a6e',
  terra:  '#b84e28',
};
const D = "'Cormorant Garamond', Georgia, serif";
const U = "'Inter', system-ui, -apple-system, sans-serif";
const WRAP = { maxWidth: 1160, margin: '0 auto', padding: '0 48px' };
const WRAP_N = { maxWidth: 900, margin: '0 auto', padding: '0 48px' };

// ── Global CSS ────────────────────────────────────────────────
const GLOBAL_CSS = `
  *{box-sizing:border-box;margin:0;padding:0;}
  html{scroll-behavior:smooth;}
  body{background:${C.ink};-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;}
  ::selection{background:${C.gold};color:${C.ink};}
  @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-33.334%)}}
  @keyframes fadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:none}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes blinkDot{0%,100%{opacity:1}50%{opacity:0.15}}
  @media(max-width:900px){
    .hero-inner{flex-direction:column!important;}
    .hero-map{display:none!important;}
    .why-cols{grid-template-columns:1fr!important;}
    .proc-row{flex-direction:column!important;gap:40px!important;}
    .proc-line{display:none!important;}
    .svc-row-grid{grid-template-columns:60px 1fr!important;}
    .svc-price-col{display:none!important;}
    .svc-detail-grid{grid-template-columns:1fr!important;}
    .trust-grid{grid-template-columns:1fr 1fr!important;}
    .pricing-grid{grid-template-columns:1fr 1fr!important;}
    .proj-cards{grid-template-columns:1fr!important;}
    .contact-grid{grid-template-columns:1fr!important;}
    .cov-grid{grid-template-columns:1fr!important;}
  }
  @media(max-width:560px){
    .pricing-grid{grid-template-columns:1fr!important;}
    .trust-grid{grid-template-columns:1fr!important;}
  }
`;

// ── Scroll-reveal hook ────────────────────────────────────────
function useReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); io.disconnect(); } },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, vis];
}

function Reveal({ children, delay = 0 }) {
  const [ref, vis] = useReveal();
  return (
    <div ref={ref} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? 'none' : 'translateY(30px)',
      transition: `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
    }}>{children}</div>
  );
}

// ── Eyebrow ───────────────────────────────────────────────────
function Eyebrow({ children, color = C.gold, dark = false }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22,
    }}>
      <span style={{ display: 'block', width: 28, height: 1, background: color, flexShrink: 0 }} />
      <span style={{
        fontFamily: U, fontSize: 10, fontWeight: 600,
        letterSpacing: '0.22em', textTransform: 'uppercase', color,
      }}>{children}</span>
    </div>
  );
}

// ── Aerial Map SVG ────────────────────────────────────────────
function AerialMap() {
  const W = 560, H = 540, P = 44;
  const iW = W - 2 * P, iH = H - 2 * P;
  const bW = iW / 3, bH = iH / 2;
  const cx = W / 2, cy = H / 2;

  const rows = Array.from({ length: 35 }, (_, i) => {
    const y = P + 4 + i * 13;
    return y < H - P - 4
      ? <line key={i} x1={P + 2} y1={y} x2={W - P - 2} y2={y} stroke="rgba(201,168,76,0.10)" strokeWidth="0.65" />
      : null;
  });

  const passes = Array.from({ length: 9 }, (_, i) => {
    const y = P + 22 + i * 56;
    const right = i % 2 === 0;
    const x1 = right ? P + 14 : W - P - 14;
    const x2 = right ? W - P - 14 : P + 14;
    const nx = right ? W - P - 14 : P + 14;
    const ny = P + 22 + (i + 1) * 56;
    return (
      <g key={i}>
        <line x1={x1} y1={y} x2={x2} y2={y} stroke="rgba(74,150,230,0.32)" strokeWidth="1.1" strokeDasharray="7 5" />
        {i < 8 && <line x1={nx} y1={y} x2={nx} y2={ny} stroke="rgba(74,150,230,0.22)" strokeWidth="1.1" strokeDasharray="3 5" />}
      </g>
    );
  });

  return (
    <svg viewBox={`0 0 ${W} ${H}`} fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', maxWidth: 560, display: 'block' }}>
      <defs>
        <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(74,180,255,0.18)" />
          <stop offset="100%" stopColor="rgba(74,180,255,0)" />
        </linearGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <radialGradient id="vigRad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(0,0,0,0)" />
          <stop offset="100%" stopColor="rgba(6,9,15,0.55)" />
        </radialGradient>
      </defs>

      {/* Background */}
      <rect width={W} height={H} fill={C.ink} rx="6" />

      {/* Analysis fills */}
      <rect x={P+2} y={P+2} width={bW-4} height={bH-4} fill="rgba(77,122,92,0.18)" rx="2" />
      <rect x={P+bW+2} y={P+2} width={bW-4} height={bH-4} fill="rgba(77,122,92,0.11)" rx="2" />
      <rect x={P+2*bW+2} y={P+2} width={bW-4} height={bH-4} fill="rgba(77,122,92,0.14)" rx="2" />
      <rect x={P+2} y={P+bH+2} width={bW-4} height={bH-4} fill="rgba(77,122,92,0.09)" rx="2" />
      <rect x={P+bW+2} y={P+bH+2} width={bW-4} height={bH-4} fill="rgba(184,78,40,0.14)" rx="2" />
      <rect x={P+2*bW+2} y={P+bH+2} width={bW-4} height={bH-4} fill="rgba(77,122,92,0.12)" rx="2" />

      {/* Vine rows */}
      {rows}

      {/* Block grid */}
      <line x1={P+bW} y1={P} x2={P+bW} y2={H-P} stroke="rgba(201,168,76,0.20)" strokeWidth="1" />
      <line x1={P+2*bW} y1={P} x2={P+2*bW} y2={H-P} stroke="rgba(201,168,76,0.20)" strokeWidth="1" />
      <line x1={P} y1={P+bH} x2={W-P} y2={P+bH} stroke="rgba(201,168,76,0.20)" strokeWidth="1" />

      {/* Flight passes */}
      {passes}

      {/* Property boundary */}
      <rect x={P} y={P} width={iW} height={iH}
        stroke="rgba(201,168,76,0.62)" strokeWidth="1.5" strokeDasharray="10 5" fill="none" />

      {/* Corner markers */}
      {[[P,P],[W-P,P],[P,H-P],[W-P,H-P]].map(([x,y], i) => (
        <g key={i} filter="url(#glow)">
          <circle cx={x} cy={y} r={3.5} fill={C.gold} />
          <circle cx={x} cy={y} r={8} stroke="rgba(201,168,76,0.40)" strokeWidth="1" fill="none" />
        </g>
      ))}

      {/* Drone crosshair */}
      <g filter="url(#glow)">
        <circle cx={cx} cy={cy} r={2.5} fill="white" />
        <circle cx={cx} cy={cy} r={12} stroke="rgba(255,255,255,0.52)" strokeWidth="1" fill="none">
          <animate attributeName="r" values="12;17;12" dur="2.8s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.52;0.08;0.52" dur="2.8s" repeatCount="indefinite" />
        </circle>
        <circle cx={cx} cy={cy} r={22} stroke="rgba(255,255,255,0.18)" strokeWidth="0.75" fill="none">
          <animate attributeName="r" values="22;30;22" dur="2.8s" begin="0.7s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.18;0.03;0.18" dur="2.8s" begin="0.7s" repeatCount="indefinite" />
        </circle>
      </g>
      <line x1={cx-34} y1={cy} x2={cx-17} y2={cy} stroke="rgba(255,255,255,0.38)" strokeWidth="1" />
      <line x1={cx+17} y1={cy} x2={cx+34} y2={cy} stroke="rgba(255,255,255,0.38)" strokeWidth="1" />
      <line x1={cx} y1={cy-34} x2={cx} y2={cy-17} stroke="rgba(255,255,255,0.38)" strokeWidth="1" />
      <line x1={cx} y1={cy+17} x2={cx} y2={cy+34} stroke="rgba(255,255,255,0.38)" strokeWidth="1" />

      {/* Scan line */}
      <rect x={P} y={P} width={iW} height={38} fill="url(#sg)">
        <animateTransform attributeName="transform" type="translate"
          values="0 0;0 454" dur="5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="1;1;0" keyTimes="0;0.84;1" dur="5s" repeatCount="indefinite" />
      </rect>

      {/* Vignette */}
      <rect width={W} height={H} fill="url(#vigRad)" rx="6" />

      {/* Legend */}
      <rect x={W-P-76} y={P+8} width={9} height={9} fill="rgba(77,122,92,0.7)" rx="1" />
      <text x={W-P-63} y={P+17} fill="rgba(255,255,255,0.38)" fontSize="7.5" fontFamily="monospace" letterSpacing="0.5">HEALTHY</text>
      <rect x={W-P-76} y={P+25} width={9} height={9} fill="rgba(184,78,40,0.7)" rx="1" />
      <text x={W-P-63} y={P+34} fill="rgba(255,255,255,0.38)" fontSize="7.5" fontFamily="monospace" letterSpacing="0.5">STRESS</text>

      {/* Coord readout */}
      <rect x={P} y={H-P-46} width={154} height={40} fill="rgba(6,9,15,0.88)" rx="3" />
      <text x={P+10} y={H-P-28} fill="rgba(201,168,76,0.72)" fontSize="8" fontFamily="monospace" letterSpacing="0.8">35.6269° N  120.6910° W</text>
      <text x={P+10} y={H-P-13} fill="rgba(255,255,255,0.36)" fontSize="7.5" fontFamily="monospace" letterSpacing="0.5">ALT 118m  ·  SPD 7.2m/s</text>

      {/* Scale bar */}
      <line x1={W-P-84} y1={H-P-14} x2={W-P} y2={H-P-14} stroke="rgba(255,255,255,0.42)" strokeWidth="1" />
      <line x1={W-P-84} y1={H-P-19} x2={W-P-84} y2={H-P-9} stroke="rgba(255,255,255,0.42)" strokeWidth="1" />
      <line x1={W-P} y1={H-P-19} x2={W-P} y2={H-P-9} stroke="rgba(255,255,255,0.42)" strokeWidth="1" />
      <text x={W-P-42} y={H-P-22} fill="rgba(255,255,255,0.36)" fontSize="7.5" fontFamily="monospace" textAnchor="middle" letterSpacing="0.5">100 m</text>

      {/* Status */}
      <rect x={P} y={H-P-70} width={90} height={18} fill="rgba(77,122,92,0.22)" rx="2" />
      <circle cx={P+12} cy={H-P-61} r={3} fill={C.sage}>
        <animate attributeName="opacity" values="1;0.15;1" dur="1.8s" repeatCount="indefinite" />
      </circle>
      <text x={P+21} y={H-P-57} fill="rgba(98,145,111,0.9)" fontSize="8" fontFamily="monospace" letterSpacing="0.5">CAPTURING</text>
    </svg>
  );
}

// ── Marquee ticker ────────────────────────────────────────────
const TICKER_TEXT = 'PART 107 CERTIFIED  ·  PASO ROBLES  ·  ADELAIDA DISTRICT  ·  TEMPLETON  ·  ABSENTEE RANCH MONITORING  ·  VINEYARD CANOPY MAPPING  ·  COASTAL BLUFF DOCUMENTATION  ·  NORTH SLO COUNTY  ·  ';

function Marquee() {
  return (
    <div style={{ background: C.gold, overflow: 'hidden', padding: '13px 0', userSelect: 'none' }}>
      <div style={{
        display: 'inline-block', whiteSpace: 'nowrap',
        animation: 'marquee 36s linear infinite',
      }}>
        {[TICKER_TEXT, TICKER_TEXT, TICKER_TEXT].map((t, i) => (
          <span key={i} style={{
            fontFamily: U, fontSize: 10.5, fontWeight: 700,
            letterSpacing: '0.18em', color: C.ink,
          }}>{t}</span>
        ))}
      </div>
    </div>
  );
}

// ── Services data ─────────────────────────────────────────────
const SERVICES = [
  {
    id: 'vineyard',
    phase: 'Phase 1 — Launch Now',
    phaseColor: C.gold,
    title: 'Vineyard Canopy & Frost Mapping',
    tagline: 'Know which blocks are under stress before the season turns.',
    desc: "A stitched orthomosaic (top-down aerial map) of your vineyard with frost pockets, canopy gaps, vigor variation, and dead spots clearly flagged. Delivered as a georeferenced TIFF plus a 1–2 page PDF report. No portal login, no app — just the map and the findings in your inbox.",
    deliverable: 'Orthomosaic + annotated PDF report, emailed within 7 days',
    priceFrom: '$300',
    priceSub: 'starting per flight',
    pricing: [['Under 20 acres', '$300'], ['20–50 acres', '$450'], ['Repeat visit, same season', '$250']],
  },
  {
    id: 'ranch',
    phase: 'Phase 2 — Month 4+',
    phaseColor: C.sage,
    title: 'Absentee Ranch Monitoring',
    tagline: 'Monthly eyes on property you cannot visit every week.',
    desc: "Regular flights over your rural property — fence lines, water troughs, livestock counts, outbuildings, trespasser or dumping evidence. Each visit produces a dated PDF with GPS-tagged photos delivered within 24 hours. The onboarding flight includes a full-property orthomosaic and 4K perimeter video for your permanent records.",
    deliverable: 'PDF report + GPS-tagged photos within 24 hours of flight',
    priceFrom: '$150',
    priceSub: 'per monthly visit',
    pricing: [['Onboarding flight (one-time)', '$600'], ['Monthly visits', '$150 / mo'], ['Weekly visits', '$400 / mo']],
  },
  {
    id: 'listing',
    phase: 'Phase 3 — Month 7+',
    phaseColor: C.terra,
    title: 'Pre-Listing Rural Property Maps',
    tagline: 'Ag and ranch listings deserve better than a cell phone photo.',
    desc: "A complete aerial documentation package: 4K video walkthrough, orthomosaic with annotated water sources, structures, and oak coverage, drone stills for MLS, optional 3D parcel model. Built to the specs the North County ag-and-ranch agents actually use.",
    deliverable: '4K video + orthomosaic + MLS stills + annotated parcel map',
    priceFrom: '$750',
    priceSub: 'per listing',
    pricing: [['Under 50 acres', '$750'], ['50–200 acres', '$1,100'], ['200+ acres', '$1,500+']],
  },
  {
    id: 'bluff',
    phase: 'Phase 3 — Month 7+',
    phaseColor: '#6a9ab0',
    title: 'Coastal Bluff Erosion Documentation',
    tagline: 'Baseline data before the next storm season.',
    desc: "Quarterly aerial documentation of bluff edge position, face erosion, drainage cuts, and structural changes. Time-stamped and GPS-accurate for insurance claims, legal disputes, or HOA maintenance planning. Annual subscriptions include post-storm emergency flights.",
    deliverable: 'Quarterly report + elevation profile + archived comparison imagery',
    priceFrom: '$400',
    priceSub: 'per quarter',
    pricing: [['Individual homeowner', '$400 / quarter'], ['HOA (5+ properties)', '$1,200 / quarter'], ['Annual archive sub', '$1,500 / year']],
  },
];

// ── Service row ───────────────────────────────────────────────
function ServiceRow({ svc, index, isLast }) {
  const [open, setOpen] = useState(false);
  const [hov, setHov] = useState(false);
  const scrollTo = id => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div style={{ borderBottom: isLast ? 'none' : '1px solid rgba(255,255,255,0.07)' }}>
      <div className="svc-row-grid"
        onClick={() => setOpen(v => !v)}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          display: 'grid',
          gridTemplateColumns: '80px 1fr 210px',
          gap: '0 36px',
          padding: '44px 0',
          cursor: 'pointer',
          background: hov ? 'rgba(255,255,255,0.018)' : 'transparent',
          transition: 'background 0.25s',
          alignItems: 'start',
        }}>

        {/* Number */}
        <div style={{
          fontFamily: D, fontSize: 60, fontWeight: 300, lineHeight: 1,
          color: `rgba(201,168,76,0.16)`,
          paddingTop: 6, userSelect: 'none',
          letterSpacing: '-0.03em',
        }}>
          {String(index + 1).padStart(2, '0')}
        </div>

        {/* Content */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: svc.phaseColor, display: 'inline-block', flexShrink: 0 }} />
            <span style={{ fontFamily: U, fontSize: 10, fontWeight: 600, letterSpacing: '0.20em', textTransform: 'uppercase', color: svc.phaseColor }}>
              {svc.phase}
            </span>
          </div>
          <h3 style={{
            fontFamily: D, fontSize: 'clamp(28px, 3vw, 40px)', fontWeight: 400,
            color: C.text, lineHeight: 1.1, letterSpacing: '-0.01em',
          }}>{svc.title}</h3>
          <p style={{ fontFamily: U, fontSize: 14, color: C.muted, lineHeight: 1.6, marginTop: 10 }}>
            {svc.tagline}
          </p>
        </div>

        {/* Price + toggle */}
        <div className="svc-price-col" style={{ textAlign: 'right', paddingTop: 26 }}>
          <div style={{ fontFamily: D, fontSize: 30, fontWeight: 400, color: C.gold, letterSpacing: '-0.01em', lineHeight: 1 }}>
            {svc.priceFrom}
          </div>
          <div style={{ fontFamily: U, fontSize: 11, color: C.faint, marginTop: 5 }}>{svc.priceSub}</div>
          <div style={{
            marginTop: 18, fontFamily: U, fontSize: 11, fontWeight: 500,
            letterSpacing: '0.10em', textTransform: 'uppercase',
            color: open ? C.gold : C.faint,
            transition: 'color 0.2s',
          }}>
            {open ? '— close' : '+ details'}
          </div>
        </div>
      </div>

      {/* Expanded panel */}
      {open && (
        <div className="svc-detail-grid" style={{
          display: 'grid', gridTemplateColumns: '1fr 300px',
          gap: '0 64px', alignItems: 'start',
          paddingLeft: 80 + 36, paddingBottom: 52, paddingRight: 0,
          animation: 'fadeIn 0.3s ease',
        }}>
          <div>
            <p style={{ fontFamily: U, fontSize: 15, lineHeight: 1.82, color: 'rgba(230,221,200,0.62)', marginBottom: 22 }}>
              {svc.desc}
            </p>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '11px 16px',
              background: 'rgba(201,168,76,0.06)',
              border: `1px solid rgba(201,168,76,0.14)`,
              borderRadius: 4,
            }}>
              <span style={{ fontFamily: U, fontSize: 9.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.65)', whiteSpace: 'nowrap' }}>Deliverable</span>
              <span style={{ width: 1, height: 14, background: 'rgba(201,168,76,0.2)', flexShrink: 0 }} />
              <span style={{ fontFamily: U, fontSize: 13, color: C.muted, lineHeight: 1.5 }}>{svc.deliverable}</span>
            </div>
          </div>
          <div>
            {svc.pricing.map(([label, price]) => (
              <div key={label} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '13px 0', borderBottom: '1px solid rgba(255,255,255,0.06)',
              }}>
                <span style={{ fontFamily: U, fontSize: 13, color: C.faint }}>{label}</span>
                <span style={{ fontFamily: D, fontSize: 22, color: C.gold, fontWeight: 400 }}>{price}</span>
              </div>
            ))}
            <button onClick={e => { e.stopPropagation(); scrollTo('contact'); }}
              style={{
                marginTop: 26, background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                fontFamily: U, fontSize: 11, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase',
                color: C.text, display: 'flex', alignItems: 'center', gap: 10,
                borderBottom: `1px solid ${C.gold}`, paddingBottom: 4,
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = C.gold}
              onMouseLeave={e => e.currentTarget.style.color = C.text}>
              Schedule a flight
              <span style={{ fontSize: 14 }}>→</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Nav ───────────────────────────────────────────────────────
function Nav({ scrolled }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const go = (id) => { setMenuOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); };

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        height: 68,
        background: scrolled ? `rgba(6,9,15,0.92)` : 'transparent',
        backdropFilter: scrolled ? 'blur(14px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
        transition: 'background 0.35s, border-color 0.35s, backdrop-filter 0.35s',
        display: 'flex', alignItems: 'center',
        padding: '0 48px',
      }}>
        <div style={{ maxWidth: 1160, width: '100%', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* Logo */}
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: 11 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 6,
              border: `1px solid rgba(201,168,76,0.25)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(201,168,76,0.08)',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="2.5" />
                <path d="M12 9.5V7M12 14.5v2.5M9.5 12H7M14.5 12h2.5" />
                <path d="M5.5 5.5l2 2M16.5 16.5l2 2M5.5 18.5l2-2M16.5 7.5l2-2" />
                <circle cx="4" cy="4" r="1.5" /><circle cx="20" cy="4" r="1.5" />
                <circle cx="4" cy="20" r="1.5" /><circle cx="20" cy="20" r="1.5" />
              </svg>
            </div>
            <span style={{ fontFamily: D, fontSize: 16, fontWeight: 400, color: C.cream, letterSpacing: '0.02em' }}>
              North SLO Aerial
            </span>
          </button>

          {/* Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
            {['Services', 'Pricing', 'Coverage', 'Contact'].map(l => (
              <button key={l} onClick={() => go(l.toLowerCase())}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                  fontFamily: U, fontSize: 12, fontWeight: 500,
                  letterSpacing: '0.06em', color: 'rgba(230,221,200,0.55)',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.color = C.cream}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(230,221,200,0.55)'}>
                {l}
              </button>
            ))}
            <button onClick={() => go('contact')}
              style={{
                background: C.gold, color: C.ink, border: 'none', cursor: 'pointer',
                padding: '9px 20px', borderRadius: 4,
                fontFamily: U, fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = C.goldD}
              onMouseLeave={e => e.currentTarget.style.background = C.gold}>
              Free Map
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}

// ── Hero ──────────────────────────────────────────────────────
function Hero() {
  const scrollTo = id => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  return (
    <section id="home" style={{
      minHeight: '100svh',
      background: `linear-gradient(145deg, ${C.ink} 0%, ${C.night} 55%, #0e2236 100%)`,
      display: 'flex', alignItems: 'center',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Very subtle grid */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `linear-gradient(rgba(201,168,76,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.04) 1px,transparent 1px)`,
        backgroundSize: '64px 64px',
      }} />
      {/* Radial glow top-right */}
      <div style={{
        position: 'absolute', top: '-10%', right: '-5%', width: 700, height: 700,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(201,168,76,0.05) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      <div className="hero-inner" style={{ ...WRAP, width: '100%', display: 'flex', alignItems: 'center', gap: 72, paddingTop: 100, paddingBottom: 80 }}>

        {/* Left: copy */}
        <div style={{ flex: '0 0 auto', maxWidth: 560 }}>
          <div style={{ animation: 'fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.1s both' }}>
            <Eyebrow>North SLO County · Part 107 Certified</Eyebrow>
          </div>

          <h1 style={{
            fontFamily: D, fontSize: 'clamp(60px, 7vw, 92px)', fontWeight: 400,
            lineHeight: 1.0, color: C.cream,
            letterSpacing: '-0.03em', margin: '0 0 30px',
            animation: 'fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.2s both',
          }}>
            Eyes on<br />
            <em style={{ color: C.gold, fontStyle: 'italic', fontWeight: 300 }}>your land.</em>
          </h1>

          <p style={{
            fontFamily: U, fontSize: 17, lineHeight: 1.78, maxWidth: 480,
            color: 'rgba(230,221,200,0.65)', margin: '0 0 48px',
            animation: 'fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.32s both',
          }}>
            Precision drone mapping for small wineries and rural properties in North SLO County —
            the operations the big ag-tech firms cannot profitably service.
          </p>

          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', animation: 'fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.42s both' }}>
            <button onClick={() => scrollTo('services')}
              style={{
                background: C.gold, color: C.ink, border: 'none', cursor: 'pointer',
                padding: '15px 32px', borderRadius: 4,
                fontFamily: U, fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase',
                display: 'flex', alignItems: 'center', gap: 10,
                transition: 'background 0.2s, transform 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = C.goldD; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = C.gold; e.currentTarget.style.transform = 'none'; }}>
              View Services
              <span style={{ fontSize: 15 }}>→</span>
            </button>
            <button onClick={() => scrollTo('contact')}
              style={{
                background: 'transparent', color: C.cream,
                border: '1px solid rgba(230,221,200,0.22)', cursor: 'pointer',
                padding: '15px 32px', borderRadius: 4,
                fontFamily: U, fontSize: 12, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase',
                transition: 'border-color 0.2s, color 0.2s, transform 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.color = C.gold; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(230,221,200,0.22)'; e.currentTarget.style.color = C.cream; e.currentTarget.style.transform = 'none'; }}>
              Get a Free Map
            </button>
          </div>

          {/* Stat strip */}
          <div style={{
            display: 'flex', gap: 0, marginTop: 72,
            borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 36,
            animation: 'fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.55s both',
            flexWrap: 'wrap',
          }}>
            {[
              ['FAA Part 107', 'Certified & insured'],
              ['15 – 200 ac', 'Service sweet spot'],
              ['7 days', 'Report turnaround'],
              ['$0', 'First portfolio flight'],
            ].map(([num, label], i) => (
              <div key={num} style={{
                paddingRight: 40, marginRight: i < 3 ? 40 : 0,
                borderRight: i < 3 ? '1px solid rgba(255,255,255,0.07)' : 'none',
                marginBottom: 16,
              }}>
                <div style={{ fontFamily: D, fontSize: 26, fontWeight: 400, color: C.cream, letterSpacing: '-0.01em' }}>{num}</div>
                <div style={{ fontFamily: U, fontSize: 10.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.muted, marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: aerial map */}
        <div className="hero-map" style={{ flex: 1, minWidth: 0 }}>
          <div style={{ position: 'relative', animation: 'fadeUp 1.1s cubic-bezier(0.16,1,0.3,1) 0.4s both' }}>
            <AerialMap />
            {/* Floating coord badge */}
            <div style={{
              position: 'absolute', top: -16, right: -16,
              background: 'rgba(6,9,15,0.9)', border: '1px solid rgba(201,168,76,0.2)',
              borderRadius: 4, padding: '8px 12px',
              fontFamily: 'monospace', fontSize: 10,
              color: 'rgba(201,168,76,0.7)', letterSpacing: '0.08em',
              backdropFilter: 'blur(8px)',
            }}>
              35.6269° N · 120.6910° W
            </div>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div style={{
        position: 'absolute', bottom: 36, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
        animation: 'fadeIn 1s ease 1.2s both',
      }}>
        <span style={{ fontFamily: U, fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.faint }}>Scroll</span>
        <div style={{ width: 1, height: 40, background: `linear-gradient(${C.faint}, transparent)` }} />
      </div>
    </section>
  );
}

// ── Services ──────────────────────────────────────────────────
function Services() {
  return (
    <section id="services" style={{ background: C.deep, padding: '110px 0' }}>
      <div style={WRAP}>
        <Reveal>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 64, flexWrap: 'wrap', gap: 20 }}>
            <div>
              <Eyebrow>Service Lines</Eyebrow>
              <h2 style={{ fontFamily: D, fontSize: 'clamp(40px,4vw,58px)', fontWeight: 400, color: C.cream, lineHeight: 1.05, letterSpacing: '-0.02em' }}>
                Four services.<br />One network.
              </h2>
            </div>
            <p style={{ fontFamily: U, fontSize: 14.5, lineHeight: 1.75, color: C.muted, maxWidth: 380 }}>
              Sequenced by speed-to-first-dollar and relationship leverage —
              not by what the drone is capable of.
            </p>
          </div>
        </Reveal>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          {SERVICES.map((svc, i) => (
            <Reveal key={svc.id} delay={i * 0.05}>
              <ServiceRow svc={svc} index={i} isLast={i === SERVICES.length - 1} />
            </Reveal>
          ))}
        </div>

        {/* Year-2 teaser */}
        <Reveal delay={0.2}>
          <div style={{
            marginTop: 48, borderRadius: 6, padding: '28px 36px',
            border: '1px dashed rgba(255,255,255,0.08)',
            display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap',
          }}>
            <div style={{ fontFamily: D, fontSize: 48, fontWeight: 300, color: 'rgba(201,168,76,0.10)', lineHeight: 1 }}>05</div>
            <div>
              <div style={{ fontFamily: U, fontSize: 10, letterSpacing: '0.20em', textTransform: 'uppercase', color: C.faint, marginBottom: 6 }}>Year 2+ — Content & Legacy</div>
              <div style={{ fontFamily: D, fontSize: 24, color: 'rgba(230,221,200,0.38)' }}>Historic Site & Abandoned-Place Documentation</div>
            </div>
            <p style={{ fontFamily: U, fontSize: 13, color: 'rgba(138,158,181,0.55)', lineHeight: 1.65, flex: 1, minWidth: 220, margin: 0 }}>
              The YouTube, the songs, the eventual coffee-table book. Every historic-site flight is portfolio content.
              Not a day-one priority. A decade-long asset.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ── Why ───────────────────────────────────────────────────────
function Why() {
  const pillars = [
    { label: 'The Gap', color: C.gold, title: 'The clients nobody else serves', body: "The big ag-tech firms need 500+ acres to justify a flight. A 12-acre Adelaida block doesn't pencil for them. The wedding drone crowd doesn't speak winery. That gap is the business." },
    { label: 'The Data', color: C.sage, title: 'Data products, not footage', body: 'A vineyard owner does not need a cinematic reel. They need to know which blocks are under stress before veraison, where frost pockets formed in February, and whether the trellis damage they heard about is their problem or a neighbor\'s.' },
    { label: 'The Market', color: C.terra, title: 'North County runs on introductions', body: 'Paso Robles, Templeton, Adelaida — this market does not crack with Facebook ads. You get in through warm introductions and stay in through reliable, consistent work. That relationship layer is the moat.' },
  ];

  return (
    <section id="why" style={{ background: C.cream, padding: '120px 0' }}>
      <div style={WRAP}>
        <Reveal>
          <div style={{ textAlign: 'center', maxWidth: 800, margin: '0 auto 80px' }}>
            <div style={{ height: 1, background: 'rgba(42,53,69,0.14)', marginBottom: 56 }} />
            <p style={{
              fontFamily: D, fontStyle: 'italic', fontWeight: 300,
              fontSize: 'clamp(28px,3.2vw,44px)', lineHeight: 1.38,
              color: C.body, letterSpacing: '-0.01em',
            }}>
              "I fly a drone for small wineries and rural property owners
              in North SLO County who need eyes on their land but cannot
              justify a commercial ag-tech contract."
            </p>
            <div style={{ height: 1, background: 'rgba(42,53,69,0.14)', marginTop: 56 }} />
          </div>
        </Reveal>

        <div className="why-cols" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0 64px' }}>
          {pillars.map((p, i) => (
            <Reveal key={p.label} delay={i * 0.12}>
              <div style={{ paddingTop: 44 }}>
                <Eyebrow color={p.color} dark>{p.label}</Eyebrow>
                <h3 style={{ fontFamily: D, fontSize: 26, fontWeight: 400, color: C.body, marginBottom: 14, lineHeight: 1.2 }}>
                  {p.title}
                </h3>
                <p style={{ fontFamily: U, fontSize: 15, lineHeight: 1.78, color: '#5a6e82' }}>
                  {p.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Process ───────────────────────────────────────────────────
function Process() {
  const steps = [
    { n: '01', title: 'Schedule a flight', body: "Reach out by email or phone. We'll confirm your property, the season's priority, and schedule a site visit. First-time clients in the portfolio phase fly for free — no catch." },
    { n: '02', title: 'One to two hours on-site', body: "A single visit covers most vineyards under 50 acres and most ranch monitoring flights. We preflight, fly the mission, and confirm data quality before leaving. You don't need to be there." },
    { n: '03', title: 'Report in your inbox', body: "A georeferenced map file plus a plain-language PDF report — no portals, no dashboards, no accounts to manage. Frost pockets, canopy gaps, fence damage, structural concerns — flagged directly, within 7 days." },
  ];

  return (
    <section id="process" style={{ background: C.slate, padding: '110px 0' }}>
      <div style={WRAP}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 72 }}>
            <Eyebrow>Process</Eyebrow>
            <h2 style={{ fontFamily: D, fontSize: 'clamp(36px,4vw,54px)', fontWeight: 400, color: C.cream, lineHeight: 1.06, letterSpacing: '-0.02em' }}>
              Simple by design.
            </h2>
            <p style={{ fontFamily: U, fontSize: 15.5, color: C.muted, maxWidth: 440, margin: '18px auto 0', lineHeight: 1.72 }}>
              No app to download. No portal to log into. A flight, a report, and a relationship.
            </p>
          </div>
        </Reveal>

        <div className="proc-row" style={{ display: 'flex', alignItems: 'flex-start', gap: 0 }}>
          {steps.map((s, i) => (
            <React.Fragment key={s.n}>
              <Reveal delay={i * 0.1} style={{ flex: 1 }}>
                <div style={{ flex: 1, padding: '0 20px', textAlign: 'center' }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: '50%', margin: '0 auto 28px',
                    border: `1px solid rgba(201,168,76,0.25)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(201,168,76,0.06)',
                  }}>
                    <span style={{ fontFamily: D, fontSize: 20, fontWeight: 400, color: C.gold }}>{s.n}</span>
                  </div>
                  <h3 style={{ fontFamily: D, fontSize: 24, fontWeight: 400, color: C.cream, marginBottom: 14, lineHeight: 1.2 }}>{s.title}</h3>
                  <p style={{ fontFamily: U, fontSize: 14, lineHeight: 1.78, color: 'rgba(138,158,181,0.75)' }}>{s.body}</p>
                </div>
              </Reveal>
              {i < steps.length - 1 && (
                <div className="proc-line" style={{ flex: '0 0 auto', paddingTop: 26, alignSelf: 'flex-start' }}>
                  <div style={{ width: 80, height: 1, background: 'rgba(201,168,76,0.15)' }} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Pricing ───────────────────────────────────────────────────
function Pricing() {
  const cols = [
    { label: 'Vineyard Mapping', color: C.gold, rows: [['Under 20 acres','$300'],['20–50 acres','$450'],['Repeat visit, same season','$250'],['Turnaround','7 days'],['Deliverable','Orthomosaic + PDF']] },
    { label: 'Ranch Monitoring', color: C.sage, rows: [['Onboarding (one-time)','$600'],['Monthly visits','$150/mo'],['Weekly visits','$400/mo'],['Turnaround','24 hours'],['Deliverable','GPS report + photos']] },
    { label: 'Pre-Listing Maps', color: C.terra, rows: [['Under 50 acres','$750'],['50–200 acres','$1,100'],['200+ acres','$1,500+'],['Turnaround','7–10 days'],['Deliverable','Video + ortho + MLS stills']] },
    { label: 'Bluff Documentation', color: '#6a9ab0', rows: [['Individual homeowner','$400/qtr'],['HOA (5+ properties)','$1,200/qtr'],['Annual archive sub','$1,500/yr'],['Includes','Storm-event flights'],['Deliverable','Report + archive']] },
  ];

  return (
    <section id="pricing" style={{ background: C.cream, padding: '110px 0' }}>
      <div style={WRAP}>
        <Reveal>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 56, flexWrap: 'wrap', gap: 20 }}>
            <div>
              <Eyebrow color={C.terra} dark>Pricing</Eyebrow>
              <h2 style={{ fontFamily: D, fontSize: 'clamp(36px,4vw,54px)', fontWeight: 400, color: C.body, lineHeight: 1.05, letterSpacing: '-0.02em' }}>
                No hidden fees.
              </h2>
            </div>
            <p style={{ fontFamily: U, fontSize: 14, lineHeight: 1.75, color: '#5a6e82', maxWidth: 360 }}>
              Published pricing builds trust and saves everyone a negotiation
              nobody enjoys. Complex terrain may carry a surcharge.
            </p>
          </div>
        </Reveal>

        <div className="pricing-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
          {cols.map((col, ci) => (
            <Reveal key={col.label} delay={ci * 0.08}>
              <div style={{ background: '#fff', borderRadius: 6, overflow: 'hidden', boxShadow: '0 1px 12px rgba(0,0,0,0.07)' }}>
                <div style={{ background: C.ink, padding: '16px 20px', borderBottom: `2.5px solid ${col.color}` }}>
                  <span style={{ fontFamily: U, fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', color: C.cream }}>
                    {col.label}
                  </span>
                </div>
                {col.rows.map(([k, v]) => (
                  <div key={k} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                    padding: '12px 20px', borderBottom: `1px solid ${C.sand}`,
                    gap: 8,
                  }}>
                    <span style={{ fontFamily: U, fontSize: 11.5, color: '#7a8e9e', lineHeight: 1.4 }}>{k}</span>
                    <span style={{ fontFamily: D, fontSize: 17, fontWeight: 400, color: C.body, textAlign: 'right', flexShrink: 0 }}>{v}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.25}>
          <div style={{
            marginTop: 32, background: C.ink, borderRadius: 6,
            padding: '28px 36px', display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap',
          }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: C.gold, flexShrink: 0 }} />
            <div>
              <span style={{ fontFamily: U, fontSize: 13, fontWeight: 700, color: C.cream }}>First map is free. </span>
              <span style={{ fontFamily: U, fontSize: 13, color: 'rgba(230,221,200,0.55)', lineHeight: 1.7 }}>
                While the portfolio is being built, the first vineyard or ranch flight is complimentary
                for introductions through the network. Job four onward charges at the rates above.
                No catch and no upsell buried in the free visit.
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ── Trust ─────────────────────────────────────────────────────
function Trust() {
  const items = [
    { color: C.gold, title: 'FAA Part 107 Certified', body: 'The commercial UAS certificate required by federal law for any compensated drone operation. Renewed every 24 months.' },
    { color: C.sage, title: '$1M Liability Coverage', body: 'Annual hull and liability policy through a drone-specialist carrier. Certificate of insurance on request before any flight.' },
    { color: '#6a9ab0', title: 'DJI Mini 4 Pro', body: '4K/60fps, 48MP stills, obstacle avoidance, 3-axis gimbal stabilization. The right tool for properties under 200 acres.' },
    { color: C.terra, title: 'Local Knowledge', body: 'Paso, Templeton, Adelaida, Creston, Shandon, San Miguel, Cambria, Cayucos. The roads, the landowners, the growing seasons.' },
  ];

  return (
    <section style={{ background: C.night, padding: '80px 0' }}>
      <div style={WRAP}>
        <div className="trust-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 1, borderRadius: 6, overflow: 'hidden' }}>
          {items.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.07}>
              <div style={{
                background: i % 2 === 0 ? C.deep : C.slate,
                padding: '36px 28px', height: '100%',
              }}>
                <div style={{ width: 36, height: 2, background: item.color, marginBottom: 20, borderRadius: 1 }} />
                <h3 style={{ fontFamily: U, fontSize: 13.5, fontWeight: 700, color: C.cream, marginBottom: 12, letterSpacing: '0.02em' }}>{item.title}</h3>
                <p style={{ fontFamily: U, fontSize: 13, lineHeight: 1.72, color: 'rgba(138,158,181,0.75)' }}>{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Coverage ──────────────────────────────────────────────────
function Coverage() {
  const zones = [
    { zone: 'Wine Country Core', places: ['Paso Robles', 'Templeton', 'Adelaida District', 'Willow Creek District', 'York Mountain'] },
    { zone: 'East Paso & Range', places: ['Creston', 'Shandon', 'San Miguel', 'Cholame Valley', 'Cypress Mountain Road'] },
    { zone: 'Coastal', places: ['Cambria', 'Cayucos', 'Morro Bay vicinity', 'Highway 1 corridor'] },
    { zone: 'South County', places: ['Atascadero', 'Santa Margarita', 'Pozo Valley'] },
  ];

  return (
    <section id="coverage" style={{ background: C.cream, padding: '110px 0' }}>
      <div style={WRAP}>
        <div className="cov-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 100px', alignItems: 'start' }}>
          <Reveal>
            <div>
              <Eyebrow color={C.sage} dark>Coverage Area</Eyebrow>
              <h2 style={{ fontFamily: D, fontSize: 'clamp(36px,4vw,52px)', fontWeight: 400, color: C.body, lineHeight: 1.06, letterSpacing: '-0.02em', marginBottom: 24 }}>
                North SLO County.<br /><em style={{ fontWeight: 300, fontStyle: 'italic' }}>All of it.</em>
              </h2>
              <p style={{ fontFamily: U, fontSize: 15, lineHeight: 1.78, color: '#5a6e82', marginBottom: 20 }}>
                From the Adelaida ridgeline to the coastal bluffs at Cambria, from San Miguel
                to the oak savanna of Santa Margarita. That local knowledge — which gates, which roads,
                which properties to watch — is part of the product.
              </p>
              <p style={{ fontFamily: U, fontSize: 15, lineHeight: 1.78, color: '#7a8e9e' }}>
                Properties outside this territory are quoted on request.
                Travel to Monterey County or Santa Barbara County carries a mileage surcharge.
              </p>
            </div>
          </Reveal>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {zones.map((z, i) => (
              <Reveal key={z.zone} delay={i * 0.08}>
                <div style={{ background: '#fff', borderRadius: 6, padding: '20px 24px', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
                  <div style={{ fontFamily: U, fontSize: 9.5, letterSpacing: '0.20em', textTransform: 'uppercase', color: C.terra, marginBottom: 12 }}>{z.zone}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {z.places.map(p => (
                      <span key={p} style={{ fontFamily: U, fontSize: 12, background: C.sand, borderRadius: 3, padding: '4px 10px', color: '#5a6e82' }}>{p}</span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Projection ────────────────────────────────────────────────
function Projection() {
  const rows = [
    ['Vineyard mapping — single visit', '8 × $350', '$2,800'],
    ['Vineyard mapping — repeat visit', '3 × $250', '$750'],
    ['Ranch monitoring — monthly contracts', '2 × $1,800 / yr', '$3,600'],
    ['Ranch monitoring — onboarding flights', '2 × $600', '$1,200'],
    ['Pre-listing property maps', '2 × $1,000', '$2,000'],
  ];

  return (
    <section style={{ background: C.slate, padding: '110px 0' }}>
      <div style={WRAP_N}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <Eyebrow>Year One Projection</Eyebrow>
            <h2 style={{ fontFamily: D, fontSize: 'clamp(34px,3.5vw,50px)', fontWeight: 400, color: C.cream, lineHeight: 1.06, letterSpacing: '-0.02em', marginBottom: 16 }}>
              Conservative. Built on warm intros.
            </h2>
            <p style={{ fontFamily: U, fontSize: 15, color: C.muted, maxWidth: 480, margin: '0 auto', lineHeight: 1.72 }}>
              This is the model if nothing goes wrong and nothing goes spectacularly right.
              No paid advertising. No cold outreach.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div style={{ background: C.deep, borderRadius: 6, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: C.ink }}>
                  {['Service Line', 'Basis', 'Annual'].map(h => (
                    <th key={h} style={{ fontFamily: U, fontSize: 9.5, letterSpacing: '0.20em', textTransform: 'uppercase', color: C.faint, padding: '14px 24px', textAlign: 'left' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map(([svc, basis, total]) => (
                  <tr key={svc} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ fontFamily: U, fontSize: 13, color: C.text, padding: '14px 24px' }}>{svc}</td>
                    <td style={{ fontFamily: U, fontSize: 12, color: C.faint, padding: '14px 24px' }}>{basis}</td>
                    <td style={{ fontFamily: D, fontSize: 20, color: C.gold, padding: '14px 24px', fontWeight: 400 }}>{total}</td>
                  </tr>
                ))}
                <tr style={{ background: 'rgba(201,168,76,0.06)' }}>
                  <td colSpan={2} style={{ fontFamily: U, fontSize: 12, fontWeight: 700, color: C.cream, padding: '18px 24px', letterSpacing: '0.06em' }}>Year-one gross (conservative)</td>
                  <td style={{ fontFamily: D, fontSize: 28, color: C.gold, padding: '18px 24px', fontWeight: 400, letterSpacing: '-0.01em' }}>~$10,350</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Reveal>

        <div className="proj-cards" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
          {[
            { label: 'Year-one net', val: '$6,500 – $8,500', sub: 'After $1–2K setup and $800 CA franchise tax if applicable', color: C.sage },
            { label: 'Year-two target', val: '$25,000 – $40,000', sub: 'Ranch book at 8–12 contracts, vineyard work compounding as repeats', color: C.gold },
          ].map(card => (
            <Reveal key={card.label} delay={0.15}>
              <div style={{
                background: C.deep, borderRadius: 6, padding: '28px 28px',
                borderLeft: `2.5px solid ${card.color}`,
              }}>
                <div style={{ fontFamily: U, fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.faint, marginBottom: 10 }}>{card.label}</div>
                <div style={{ fontFamily: D, fontSize: 30, color: card.color, fontWeight: 400, letterSpacing: '-0.01em', marginBottom: 8 }}>{card.val}</div>
                <div style={{ fontFamily: U, fontSize: 12, color: C.faint, lineHeight: 1.6 }}>{card.sub}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Contact ───────────────────────────────────────────────────
function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const set = k => v => setForm(f => ({ ...f, [k]: v }));

  const submit = e => {
    e.preventDefault();
    const sub = encodeURIComponent(`North SLO Aerial inquiry from ${form.name}`);
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`);
    window.location.href = `mailto:hello@northsloaerial.com?subject=${sub}&body=${body}`;
    setSent(true);
  };

  const fieldStyle = {
    width: '100%', background: 'transparent', border: 'none',
    borderBottom: '1px solid rgba(230,221,200,0.15)',
    padding: '14px 0', fontFamily: U, fontSize: 16,
    color: C.cream, outline: 'none',
    transition: 'border-color 0.25s',
  };

  return (
    <section id="contact" style={{ background: C.ink, padding: '110px 0' }}>
      <div style={WRAP}>
        <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 100px', alignItems: 'start' }}>

          {/* Left */}
          <Reveal>
            <div>
              <Eyebrow>Get In Touch</Eyebrow>
              <h2 style={{ fontFamily: D, fontSize: 'clamp(40px,4.5vw,62px)', fontWeight: 400, color: C.cream, lineHeight: 1.04, letterSpacing: '-0.02em', marginBottom: 28 }}>
                Start with<br />
                <em style={{ fontWeight: 300, fontStyle: 'italic', color: C.gold }}>a free map.</em>
              </h2>
              <p style={{ fontFamily: U, fontSize: 15, lineHeight: 1.78, color: 'rgba(138,158,181,0.8)', marginBottom: 48 }}>
                While the portfolio is being built, the first vineyard or ranch flight is complimentary.
                About an hour on your property. The map and report arrive within a week.
                If you want it done again for pay, we talk then. That is the whole pitch.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18, borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 36 }}>
                {['North SLO County, California', 'FAA Part 107  ·  $1M Insured  ·  Local', 'Paso Robles · Templeton · Adelaida · Creston · Cambria'].map(t => (
                  <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: C.gold, flexShrink: 0 }} />
                    <span style={{ fontFamily: U, fontSize: 13, color: C.faint }}>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Right: form */}
          <Reveal delay={0.15}>
            {sent ? (
              <div style={{ paddingTop: 60, textAlign: 'center' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', border: `1px solid ${C.gold}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                </div>
                <div style={{ fontFamily: D, fontSize: 32, fontWeight: 400, color: C.cream, marginBottom: 14 }}>Your mail app is open.</div>
                <p style={{ fontFamily: U, fontSize: 14, color: C.muted, lineHeight: 1.7 }}>Send the message when you're ready. We'll follow up within 48 hours.</p>
              </div>
            ) : (
              <form onSubmit={submit} style={{ paddingTop: 60 }}>
                {[
                  { label: 'Name', key: 'name', type: 'text', placeholder: 'Your name' },
                  { label: 'Email', key: 'email', type: 'email', placeholder: 'your@email.com' },
                ].map(f => (
                  <div key={f.key} style={{ marginBottom: 36 }}>
                    <label style={{ display: 'block', fontFamily: U, fontSize: 9.5, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.faint, marginBottom: 10 }}>{f.label}</label>
                    <input type={f.type} value={form[f.key]} onChange={e => set(f.key)(e.target.value)}
                      required placeholder={f.placeholder}
                      style={fieldStyle}
                      onFocus={e => e.target.style.borderBottomColor = 'rgba(201,168,76,0.6)'}
                      onBlur={e => e.target.style.borderBottomColor = 'rgba(230,221,200,0.15)'} />
                  </div>
                ))}
                <div style={{ marginBottom: 44 }}>
                  <label style={{ display: 'block', fontFamily: U, fontSize: 9.5, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.faint, marginBottom: 10 }}>What can we map?</label>
                  <textarea value={form.message} onChange={e => set('message')(e.target.value)} required rows={4}
                    placeholder="Property location, approximate acreage, and what you're hoping to learn."
                    style={{ ...fieldStyle, resize: 'vertical', lineHeight: 1.6 }}
                    onFocus={e => e.target.style.borderBottomColor = 'rgba(201,168,76,0.6)'}
                    onBlur={e => e.target.style.borderBottomColor = 'rgba(230,221,200,0.15)'} />
                </div>
                <button type="submit" style={{
                  width: '100%', background: C.gold, color: C.ink,
                  border: 'none', borderRadius: 4, padding: '16px',
                  fontFamily: U, fontSize: 12, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase',
                  cursor: 'pointer', transition: 'background 0.2s, transform 0.15s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = C.goldD; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = C.gold; e.currentTarget.style.transform = 'none'; }}>
                  Send Message
                </button>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background: '#040710', padding: '40px 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ ...WRAP, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 26, height: 26, borderRadius: 5, border: '1px solid rgba(201,168,76,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(201,168,76,0.06)' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="2.5" /><path d="M12 9.5V7M12 14.5v2.5M9.5 12H7M14.5 12h2.5" />
              <path d="M5.5 5.5l2 2M16.5 16.5l2 2M5.5 18.5l2-2M16.5 7.5l2-2" />
              <circle cx="4" cy="4" r="1.5" /><circle cx="20" cy="4" r="1.5" /><circle cx="4" cy="20" r="1.5" /><circle cx="20" cy="20" r="1.5" />
            </svg>
          </div>
          <span style={{ fontFamily: D, fontSize: 14, color: 'rgba(230,221,200,0.40)', fontWeight: 400 }}>North SLO Aerial</span>
        </div>
        <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap', alignItems: 'center' }}>
          {['FAA Part 107 Certified', '$1M Liability Insurance', 'North SLO County, California'].map(t => (
            <span key={t} style={{ fontFamily: U, fontSize: 10, letterSpacing: '0.10em', color: 'rgba(255,255,255,0.18)', textTransform: 'uppercase' }}>{t}</span>
          ))}
        </div>
      </div>
    </footer>
  );
}

// ── Root ──────────────────────────────────────────────────────
export default function NorthSLOAerial() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 72);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <div style={{ fontFamily: U, color: C.text }}>
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />
      <Nav scrolled={scrolled} />
      <Hero />
      <Marquee />
      <Services />
      <Why />
      <Process />
      <Pricing />
      <Trust />
      <Coverage />
      <Projection />
      <Contact />
      <Footer />
    </div>
  );
}
