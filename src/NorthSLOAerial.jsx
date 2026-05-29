import React, { useState, useEffect, useRef } from 'react';

// ── Tokens ────────────────────────────────────────────────────
const C = {
  ink:    '#06090f',
  night:  '#0b1520',
  deep:   '#101c2c',
  slate:  '#182840',
  gold:   '#c9a84c',
  goldD:  '#a88030',
  goldBg: 'rgba(201,168,76,0.09)',
  goldBd: 'rgba(201,168,76,0.20)',
  sage:   '#4d7a5c',
  cream:  '#f0e8d4',
  sand:   '#ddd4bb',
  body:   '#2a3545',
  text:   '#e6ddc8',
  muted:  '#8a9eb5',
  faint:  '#465a6e',
  terra:  '#b84e28',
  steel:  '#6a9ab0',
};
const D = "'Cormorant Garamond', Georgia, serif";
const U = "'Inter', system-ui, -apple-system, sans-serif";
const WRAP = { maxWidth: 1200, margin: '0 auto', padding: '0 52px' };

// ── Aerial photos (Unsplash, free hotlink) ────────────────────
// Replace with actual client drone footage for production
const PHOTOS = {
  hero:     'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=1920&q=85&auto=format&fit=crop',
  vineyard: 'https://images.unsplash.com/photo-1504279577054-acfeccf8fc52?w=1200&q=80&auto=format&fit=crop',
  ranch:    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80&auto=format&fit=crop',
  listing:  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80&auto=format&fit=crop',
  bluff:    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80&auto=format&fit=crop',
  quote:    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&q=80&auto=format&fit=crop',
  gallery1: 'https://images.unsplash.com/photo-1625722252849-f0f1fb8f5d1f?w=800&q=75&auto=format&fit=crop',
  gallery2: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=75&auto=format&fit=crop',
  gallery3: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=75&auto=format&fit=crop',
  gallery4: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=800&q=75&auto=format&fit=crop',
};

// Gradient fallbacks per photo (show when Unsplash is unavailable)
const FALLBACKS = {
  hero:     'linear-gradient(160deg, #0a1f10 0%, #162e1a 35%, #1e4028 65%, #0d1e2a 100%)',
  vineyard: 'linear-gradient(160deg, #0d2016 0%, #183a20 45%, #2a5530 75%, #101c12 100%)',
  ranch:    'linear-gradient(160deg, #1a1005 0%, #2e1e0a 40%, #3d2e14 70%, #1a160a 100%)',
  listing:  'linear-gradient(160deg, #0a1520 0%, #162035 45%, #1e3050 75%, #0b1522 100%)',
  bluff:    'linear-gradient(160deg, #051830 0%, #0a2540 40%, #124060 70%, #061020 100%)',
  quote:    'linear-gradient(160deg, #060c1a 0%, #0d1c35 40%, #142845 70%, #080f20 100%)',
  gallery1: 'linear-gradient(160deg, #0f2210 0%, #1c3a1e 60%, #0e1a10 100%)',
  gallery2: 'linear-gradient(160deg, #1a1208 0%, #2e2214 60%, #1c1810 100%)',
  gallery3: 'linear-gradient(160deg, #0c1e10 0%, #183022 60%, #0e2018 100%)',
  gallery4: 'linear-gradient(160deg, #081020 0%, #10203a 60%, #0a1828 100%)',
};
const imgErr = e => { e.currentTarget.style.opacity = '0'; };

// ── Global CSS ────────────────────────────────────────────────
const CSS = `
  *{box-sizing:border-box;margin:0;padding:0;}
  html{scroll-behavior:smooth;}
  body{background:${C.ink};-webkit-font-smoothing:antialiased;}
  ::selection{background:${C.gold};color:${C.ink};}
  img{display:block;width:100%;height:100%;object-fit:cover;}

  @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-33.334%)}}
  @keyframes fadeUp{from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:none}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes blinkDot{0%,100%{opacity:1}50%{opacity:0.15}}
  @keyframes imgReveal{from{clip-path:inset(0 100% 0 0)}to{clip-path:inset(0 0% 0 0)}}
  @keyframes scaleIn{from{transform:scale(1.06)}to{transform:scale(1)}}

  .img-reveal{animation:imgReveal 1.1s cubic-bezier(0.76,0,0.24,1) forwards,scaleIn 1.4s cubic-bezier(0.16,1,0.3,1) forwards;}

  @media(max-width:960px){
    .hero-overlay-content{padding:52px 28px 80px!important;}
    .sticky-services{display:block!important;}
    .sticky-left{display:none!important;}
    .sticky-right{padding:0!important;}
    .svc-row-inner{grid-template-columns:52px 1fr!important;gap:0 20px!important;}
    .svc-price-col{display:none!important;}
    .svc-expand{padding-left:72px!important;}
    .why-cols{grid-template-columns:1fr!important;}
    .proc-row{flex-direction:column!important;gap:40px!important;}
    .proc-line{display:none!important;}
    .pricing-grid{grid-template-columns:1fr 1fr!important;}
    .trust-grid{grid-template-columns:1fr 1fr!important;}
    .cov-grid{grid-template-columns:1fr!important;}
    .contact-grid{grid-template-columns:1fr!important;}
    .proj-cards{grid-template-columns:1fr!important;}
    .gallery-strip{grid-template-columns:1fr 1fr!important;}
    .wrap-pad{padding:0 24px!important;}
  }
  @media(max-width:560px){
    .pricing-grid{grid-template-columns:1fr!important;}
    .trust-grid{grid-template-columns:1fr!important;}
    .gallery-strip{grid-template-columns:1fr!important;}
  }
`;

// ── Scroll reveal ─────────────────────────────────────────────
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
      transform: vis ? 'none' : 'translateY(28px)',
      transition: `opacity 0.85s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.85s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
    }}>{children}</div>
  );
}

// ── Eyebrow ───────────────────────────────────────────────────
function Eyebrow({ children, color = C.gold }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
      <span style={{ width: 28, height: 1, background: color, flexShrink: 0, display: 'block' }} />
      <span style={{ fontFamily: U, fontSize: 10, fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color }}>{children}</span>
    </div>
  );
}

// ── Marquee ───────────────────────────────────────────────────
const TICK = 'PART 107 CERTIFIED  ·  PASO ROBLES  ·  ADELAIDA DISTRICT  ·  TEMPLETON  ·  ABSENTEE RANCH MONITORING  ·  VINEYARD CANOPY MAPPING  ·  COASTAL BLUFF DOCUMENTATION  ·  NORTH SLO COUNTY  ·  ';
function Marquee() {
  return (
    <div style={{ background: C.gold, overflow: 'hidden', padding: '13px 0', userSelect: 'none', position: 'relative', zIndex: 10 }}>
      <div style={{ display: 'inline-block', whiteSpace: 'nowrap', animation: 'marquee 36s linear infinite' }}>
        {[TICK, TICK, TICK].map((t, i) => (
          <span key={i} style={{ fontFamily: U, fontSize: 10.5, fontWeight: 700, letterSpacing: '0.18em', color: C.ink }}>{t}</span>
        ))}
      </div>
    </div>
  );
}

// ── Services data ─────────────────────────────────────────────
const SERVICES = [
  {
    id: 'vineyard', photo: PHOTOS.vineyard,
    phase: 'Phase 1 — Launch Now', phaseColor: C.gold,
    title: 'Vineyard Canopy & Frost Mapping',
    tagline: 'Know which blocks are under stress before the season turns.',
    desc: "A stitched orthomosaic of your vineyard with frost pockets, canopy gaps, vigor variation, and dead spots clearly flagged. Delivered as a georeferenced TIFF plus a plain-language PDF report. No portal, no app — the map and the findings in your inbox within 7 days.",
    deliverable: 'Orthomosaic + annotated PDF report',
    priceFrom: '$300', priceSub: 'starting per flight',
    pricing: [['Under 20 acres', '$300'], ['20–50 acres', '$450'], ['Repeat visit, same season', '$250']],
  },
  {
    id: 'ranch', photo: PHOTOS.ranch,
    phase: 'Phase 2 — Month 4+', phaseColor: C.sage,
    title: 'Absentee Ranch Monitoring',
    tagline: 'Monthly eyes on property you cannot visit every week.',
    desc: "Regular flights covering fence lines, water troughs, livestock counts, outbuildings, and trespasser or dumping evidence. Each visit produces a dated PDF with GPS-tagged photos delivered within 24 hours. The onboarding flight includes a full-property orthomosaic and 4K perimeter video.",
    deliverable: 'PDF report + GPS-tagged photos within 24 hours',
    priceFrom: '$150', priceSub: 'per monthly visit',
    pricing: [['Onboarding flight (one-time)', '$600'], ['Monthly visits', '$150 / mo'], ['Weekly visits', '$400 / mo']],
  },
  {
    id: 'listing', photo: PHOTOS.listing,
    phase: 'Phase 3 — Month 7+', phaseColor: C.terra,
    title: 'Pre-Listing Rural Property Maps',
    tagline: 'Ag and ranch listings deserve better than a cell phone photo.',
    desc: "A complete aerial documentation package: 4K video walkthrough, orthomosaic with annotated water sources, structures, and oak coverage, drone stills for MLS, optional 3D parcel model. Targeted at the handful of North County agents who specialize in ag and ranch — not the residential herd.",
    deliverable: '4K video + orthomosaic + MLS stills + annotated parcel map',
    priceFrom: '$750', priceSub: 'per listing',
    pricing: [['Under 50 acres', '$750'], ['50–200 acres', '$1,100'], ['200+ acres', '$1,500+']],
  },
  {
    id: 'bluff', photo: PHOTOS.bluff,
    phase: 'Phase 3 — Month 7+', phaseColor: C.steel,
    title: 'Coastal Bluff Erosion Documentation',
    tagline: 'Baseline data before the next storm season.',
    desc: "Quarterly aerial documentation of bluff edge position, face erosion, drainage cuts, and structural changes. Time-stamped and GPS-accurate for insurance claims, legal disputes, or HOA maintenance planning. Annual subscriptions include post-storm emergency flights after Pacific storm events.",
    deliverable: 'Quarterly report + elevation profile + archived comparison imagery',
    priceFrom: '$400', priceSub: 'per quarter',
    pricing: [['Individual homeowner', '$400 / quarter'], ['HOA (5+ properties)', '$1,200 / quarter'], ['Annual archive sub', '$1,500 / year']],
  },
];

// ── Nav ───────────────────────────────────────────────────────
function Nav({ scrolled }) {
  const go = id => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200, height: 68,
      background: scrolled ? 'rgba(6,9,15,0.9)' : 'transparent',
      backdropFilter: scrolled ? 'blur(16px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
      transition: 'all 0.35s ease',
      display: 'flex', alignItems: 'center', padding: '0 52px',
    }}>
      <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 6, border: '1px solid rgba(201,168,76,0.25)', background: 'rgba(201,168,76,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="2.5" />
              <path d="M12 9.5V7M12 14.5v2.5M9.5 12H7M14.5 12h2.5M5.5 5.5l2 2M16.5 16.5l2 2M5.5 18.5l2-2M16.5 7.5l2-2" />
              <circle cx="4" cy="4" r="1.5" /><circle cx="20" cy="4" r="1.5" />
              <circle cx="4" cy="20" r="1.5" /><circle cx="20" cy="20" r="1.5" />
            </svg>
          </div>
          <span style={{ fontFamily: D, fontSize: 15, fontWeight: 400, color: C.cream, letterSpacing: '0.02em' }}>North SLO Aerial</span>
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
          {['Services', 'Pricing', 'Coverage', 'Contact'].map(l => (
            <button key={l} onClick={() => go(l.toLowerCase())}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: U, fontSize: 12, fontWeight: 500, letterSpacing: '0.06em', color: 'rgba(230,221,200,0.55)', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = C.cream}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(230,221,200,0.55)'}>
              {l}
            </button>
          ))}
          <button onClick={() => go('contact')}
            style={{ background: C.gold, color: C.ink, border: 'none', cursor: 'pointer', padding: '9px 20px', borderRadius: 4, fontFamily: U, fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', transition: 'background 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = C.goldD}
            onMouseLeave={e => e.currentTarget.style.background = C.gold}>
            Free Map
          </button>
        </div>
      </div>
    </nav>
  );
}

// ── Hero — full-bleed aerial photo ────────────────────────────
function Hero() {
  const go = id => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  return (
    <section id="home" style={{ position: 'relative', minHeight: '100svh', overflow: 'hidden' }}>
      {/* Full-bleed aerial photo */}
      <div style={{ position: 'absolute', inset: 0, background: FALLBACKS.hero }}>
        <img src={PHOTOS.hero} alt="" style={{ objectPosition: 'center 40%' }} onError={imgErr} />
      </div>
      {/* Gradient overlays */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(6,9,15,0.88) 0%, rgba(6,9,15,0.55) 50%, rgba(6,9,15,0.25) 100%)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(6,9,15,0.75) 0%, transparent 50%)' }} />

      {/* Content */}
      <div className="hero-overlay-content" style={{ position: 'relative', zIndex: 2, ...WRAP, minHeight: '100svh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingTop: 120, paddingBottom: 100 }}>

        {/* Floating coord badge — top right */}
        <div style={{ position: 'absolute', top: 100, right: 52, fontFamily: 'monospace', fontSize: 10, color: 'rgba(201,168,76,0.55)', letterSpacing: '0.10em', textAlign: 'right', lineHeight: 1.9, animation: 'fadeIn 1.5s ease 0.8s both' }}>
          35.6269° N<br />120.6910° W<br />
          <span style={{ color: 'rgba(255,255,255,0.25)' }}>ALT 118m</span>
        </div>

        <div style={{ maxWidth: 680, animation: 'fadeUp 1s cubic-bezier(0.16,1,0.3,1) 0.15s both' }}>
          <Eyebrow>North SLO County · Part 107 Certified</Eyebrow>

          <h1 style={{
            fontFamily: D, fontWeight: 400, lineHeight: 0.95,
            fontSize: 'clamp(64px,8vw,104px)',
            color: C.cream, letterSpacing: '-0.03em', margin: '0 0 28px',
          }}>
            Eyes on<br />
            <em style={{ color: C.gold, fontStyle: 'italic', fontWeight: 300 }}>your land.</em>
          </h1>

          <p style={{ fontFamily: U, fontSize: 17, lineHeight: 1.76, maxWidth: 500, color: 'rgba(230,221,200,0.70)', margin: '0 0 44px' }}>
            Precision drone mapping for small wineries and rural properties in North SLO County —
            the operations commercial ag-tech firms cannot profitably service.
          </p>

          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 64 }}>
            <button onClick={() => go('services')}
              style={{ background: C.gold, color: C.ink, border: 'none', cursor: 'pointer', padding: '15px 34px', borderRadius: 4, fontFamily: U, fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 10, transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = C.goldD; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = C.gold; e.currentTarget.style.transform = 'none'; }}>
              View Services <span style={{ fontSize: 16 }}>→</span>
            </button>
            <button onClick={() => go('contact')}
              style={{ background: 'rgba(255,255,255,0.08)', color: C.cream, border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', cursor: 'pointer', padding: '15px 34px', borderRadius: 4, fontFamily: U, fontSize: 12, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.color = C.gold; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = C.cream; }}>
              Get a Free Map
            </button>
          </div>

          {/* Stat strip */}
          <div style={{ display: 'flex', gap: 0, borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: 32, flexWrap: 'wrap', backdropFilter: 'blur(4px)' }}>
            {[['FAA Part 107', 'Certified & insured'], ['15–200 ac', 'Service sweet spot'], ['7 days', 'Report turnaround'], ['$0', 'First portfolio flight']].map(([n, l], i) => (
              <div key={n} style={{ paddingRight: 36, marginRight: i < 3 ? 36 : 0, borderRight: i < 3 ? '1px solid rgba(255,255,255,0.10)' : 'none', marginBottom: 12 }}>
                <div style={{ fontFamily: D, fontSize: 24, color: C.cream, fontWeight: 400, letterSpacing: '-0.01em' }}>{n}</div>
                <div style={{ fontFamily: U, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(138,158,181,0.8)', marginTop: 4 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{ position: 'absolute', bottom: 36, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, animation: 'fadeIn 1s ease 1.4s both', zIndex: 2 }}>
        <span style={{ fontFamily: U, fontSize: 9, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(138,158,181,0.6)' }}>Scroll</span>
        <div style={{ width: 1, height: 42, background: 'linear-gradient(rgba(138,158,181,0.5), transparent)' }} />
      </div>
    </section>
  );
}

// ── Gallery strip ─────────────────────────────────────────────
function Gallery() {
  return (
    <section style={{ background: C.ink, padding: '0' }}>
      <div className="gallery-strip" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 3 }}>
        {[
          [PHOTOS.gallery1, FALLBACKS.gallery1],
          [PHOTOS.gallery2, FALLBACKS.gallery2],
          [PHOTOS.gallery3, FALLBACKS.gallery3],
          [PHOTOS.gallery4, FALLBACKS.gallery4],
        ].map(([src, fb], i) => {
          const [ref, vis] = useReveal(0.1);
          return (
            <div key={i} ref={ref} style={{ height: 220, overflow: 'hidden', position: 'relative', background: fb }}>
              <img src={src} alt="" style={{
                transform: vis ? 'scale(1)' : 'scale(1.08)',
                transition: 'transform 1.4s cubic-bezier(0.16,1,0.3,1)',
                transitionDelay: `${i * 0.1}s`,
                opacity: vis ? 1 : 0,
              }} onError={imgErr} />
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(6,9,15,0.28)' }} />
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ── Services — sticky split layout ───────────────────────────
function ServiceRow({ svc, isActive, isLast, onEnter }) {
  const [open, setOpen] = useState(false);
  const [hov, setHov] = useState(false);
  const rowRef = useRef(null);
  const go = id => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) onEnter(); },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [onEnter]);

  return (
    <div ref={rowRef} style={{ borderBottom: isLast ? 'none' : '1px solid rgba(255,255,255,0.07)' }}>
      <div className="svc-row-inner"
        onClick={() => setOpen(v => !v)}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          display: 'grid', gridTemplateColumns: '76px 1fr 200px', gap: '0 32px',
          padding: '44px 0', cursor: 'pointer',
          background: hov ? 'rgba(255,255,255,0.016)' : 'transparent',
          transition: 'background 0.25s', alignItems: 'start',
        }}>

        <div style={{ fontFamily: D, fontSize: 56, fontWeight: 300, lineHeight: 1, color: isActive ? 'rgba(201,168,76,0.32)' : 'rgba(201,168,76,0.10)', paddingTop: 6, userSelect: 'none', letterSpacing: '-0.03em', transition: 'color 0.4s' }}>
          {String(SERVICES.indexOf(svc) + 1).padStart(2, '0')}
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: svc.phaseColor, flexShrink: 0, display: 'inline-block' }} />
            <span style={{ fontFamily: U, fontSize: 10, fontWeight: 600, letterSpacing: '0.20em', textTransform: 'uppercase', color: svc.phaseColor }}>{svc.phase}</span>
          </div>
          <h3 style={{ fontFamily: D, fontSize: 'clamp(26px,2.4vw,38px)', fontWeight: 400, color: C.text, lineHeight: 1.1, letterSpacing: '-0.01em' }}>{svc.title}</h3>
          <p style={{ fontFamily: U, fontSize: 13.5, color: C.muted, lineHeight: 1.65, marginTop: 9 }}>{svc.tagline}</p>
        </div>

        <div className="svc-price-col" style={{ textAlign: 'right', paddingTop: 24 }}>
          <div style={{ fontFamily: D, fontSize: 28, color: C.gold, fontWeight: 400, letterSpacing: '-0.01em', lineHeight: 1 }}>{svc.priceFrom}</div>
          <div style={{ fontFamily: U, fontSize: 11, color: C.faint, marginTop: 4 }}>{svc.priceSub}</div>
          <div style={{ marginTop: 16, fontFamily: U, fontSize: 10.5, fontWeight: 500, letterSpacing: '0.10em', textTransform: 'uppercase', color: open ? C.gold : C.faint, transition: 'color 0.2s' }}>
            {open ? '— close' : '+ details'}
          </div>
        </div>
      </div>

      {open && (
        <div className="svc-expand" style={{ paddingLeft: 76 + 32, paddingBottom: 48, display: 'grid', gridTemplateColumns: '1fr 280px', gap: '0 56px', alignItems: 'start', animation: 'fadeIn 0.3s ease' }}>
          <div>
            <p style={{ fontFamily: U, fontSize: 14.5, lineHeight: 1.85, color: 'rgba(230,221,200,0.60)', marginBottom: 20 }}>{svc.desc}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 16px', background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.14)', borderRadius: 4 }}>
              <span style={{ fontFamily: U, fontSize: 9.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.60)', whiteSpace: 'nowrap' }}>Deliverable</span>
              <span style={{ width: 1, height: 14, background: 'rgba(201,168,76,0.20)', flexShrink: 0 }} />
              <span style={{ fontFamily: U, fontSize: 12.5, color: C.muted, lineHeight: 1.5 }}>{svc.deliverable}</span>
            </div>
          </div>
          <div>
            {svc.pricing.map(([label, price]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontFamily: U, fontSize: 12.5, color: C.faint }}>{label}</span>
                <span style={{ fontFamily: D, fontSize: 21, color: C.gold, fontWeight: 400 }}>{price}</span>
              </div>
            ))}
            <button onClick={e => { e.stopPropagation(); go('contact'); }}
              style={{ marginTop: 24, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: U, fontSize: 11, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.text, display: 'flex', alignItems: 'center', gap: 8, borderBottom: `1px solid ${C.gold}`, paddingBottom: 4, transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = C.gold}
              onMouseLeave={e => e.currentTarget.style.color = C.text}>
              Schedule a flight <span style={{ fontSize: 14 }}>→</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Services() {
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <section id="services" style={{ background: C.deep }}>
      <div style={{ ...WRAP, paddingTop: 100, paddingBottom: 24 }}>
        <Reveal>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 60, flexWrap: 'wrap', gap: 20 }}>
            <div>
              <Eyebrow>Service Lines</Eyebrow>
              <h2 style={{ fontFamily: D, fontSize: 'clamp(38px,4vw,58px)', fontWeight: 400, color: C.cream, lineHeight: 1.05, letterSpacing: '-0.02em' }}>
                Four services.<br />One network.
              </h2>
            </div>
            <p style={{ fontFamily: U, fontSize: 14.5, lineHeight: 1.75, color: C.muted, maxWidth: 360 }}>
              Sequenced by speed-to-first-dollar and relationship leverage — not by what the drone can do.
            </p>
          </div>
        </Reveal>
      </div>

      {/* Sticky split */}
      <div className="sticky-services" style={{ display: 'flex', alignItems: 'flex-start' }}>

        {/* Sticky left — aerial photo panel */}
        <div className="sticky-left" style={{ position: 'sticky', top: 0, width: '44%', height: '100vh', flexShrink: 0, overflow: 'hidden' }}>
          {SERVICES.map((svc, i) => (
            <div key={svc.id} style={{
              position: 'absolute', inset: 0,
              opacity: activeIdx === i ? 1 : 0,
              transition: 'opacity 0.7s cubic-bezier(0.4,0,0.2,1)',
              pointerEvents: 'none',
            }}>
              <div style={{ position: 'absolute', inset: 0, background: FALLBACKS[svc.id] }} />
              <img src={svc.photo} alt="" style={{ objectPosition: 'center center' }} onError={imgErr} />
              {/* Dark overlay */}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(16,28,44,0.20) 0%, rgba(6,9,15,0.60) 100%)' }} />
              {/* Service label on image */}
              <div style={{ position: 'absolute', bottom: 48, left: 44, right: 44 }}>
                <div style={{ fontFamily: U, fontSize: 9.5, letterSpacing: '0.22em', textTransform: 'uppercase', color: svc.phaseColor, marginBottom: 8 }}>{svc.phase}</div>
                <div style={{ fontFamily: D, fontSize: 28, color: C.cream, fontWeight: 400, lineHeight: 1.15 }}>{svc.title}</div>
              </div>
              {/* Scan line decoration */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(to right, transparent, ${svc.phaseColor}55, transparent)` }} />
            </div>
          ))}
          {/* Grid overlay on image */}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(201,168,76,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.04) 1px, transparent 1px)', backgroundSize: '52px 52px', pointerEvents: 'none' }} />
        </div>

        {/* Right — scrolling service rows */}
        <div className="sticky-right" style={{ flex: 1, paddingLeft: 64, paddingRight: 52, paddingBottom: 100, paddingTop: 8 }}>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            {SERVICES.map((svc, i) => (
              <Reveal key={svc.id} delay={i * 0.04}>
                <ServiceRow
                  svc={svc}
                  isActive={activeIdx === i}
                  isLast={i === SERVICES.length - 1}
                  onEnter={() => setActiveIdx(i)}
                />
              </Reveal>
            ))}
          </div>

          {/* Year-2 teaser */}
          <Reveal delay={0.15}>
            <div style={{ marginTop: 44, borderRadius: 6, padding: '24px 28px', border: '1px dashed rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
              <div style={{ fontFamily: D, fontSize: 44, fontWeight: 300, color: 'rgba(201,168,76,0.09)', lineHeight: 1, flexShrink: 0 }}>05</div>
              <div>
                <div style={{ fontFamily: U, fontSize: 9.5, letterSpacing: '0.20em', textTransform: 'uppercase', color: C.faint, marginBottom: 6 }}>Year 2+ — Content & Legacy</div>
                <div style={{ fontFamily: D, fontSize: 22, color: 'rgba(230,221,200,0.35)' }}>Historic Site & Abandoned-Place Documentation</div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ── Quote on photo ─────────────────────────────────────────────
function QuoteSection() {
  const [ref, vis] = useReveal(0.1);
  return (
    <section ref={ref} style={{ position: 'relative', height: 520, overflow: 'hidden', background: FALLBACKS.quote }}>
      <img src={PHOTOS.quote} alt="" style={{ position: 'absolute', inset: 0, objectPosition: 'center 35%', transform: vis ? 'scale(1)' : 'scale(1.06)', transition: 'transform 1.8s cubic-bezier(0.16,1,0.3,1)' }} onError={imgErr} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(6,9,15,0.88) 0%, rgba(6,9,15,0.60) 60%, rgba(6,9,15,0.35) 100%)' }} />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center' }}>
        <div style={{ ...WRAP, width: '100%' }}>
          <div style={{ maxWidth: 780, opacity: vis ? 1 : 0, transform: vis ? 'none' : 'translateY(24px)', transition: 'all 0.9s cubic-bezier(0.16,1,0.3,1) 0.2s' }}>
            <div style={{ width: 40, height: 1, background: C.gold, marginBottom: 32 }} />
            <p style={{ fontFamily: D, fontStyle: 'italic', fontWeight: 300, fontSize: 'clamp(26px,3vw,42px)', lineHeight: 1.38, color: C.cream, letterSpacing: '-0.01em', marginBottom: 32 }}>
              "The big ag-tech firms need 500 acres to justify a flight.
              A 12-acre Adelaida block doesn't pencil for them.
              The wedding drone crowd doesn't speak winery.
              That gap is the business."
            </p>
            <div style={{ width: 40, height: 1, background: 'rgba(201,168,76,0.40)' }} />
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Why ───────────────────────────────────────────────────────
function Why() {
  const pillars = [
    { label: 'The Gap', color: C.gold, title: 'The clients nobody else serves', body: "Commercial ag-tech needs 500+ acres. A 12-acre Adelaida block doesn't pencil for them. The wedding drone crowd doesn't speak winery. That gap is the business." },
    { label: 'The Data', color: C.sage, title: 'Data products, not footage', body: "A vineyard owner needs to know which blocks are under stress before veraison, where frost pockets formed in February, whether the trellis damage they heard about is their problem or a neighbor's. Not a cinematic reel." },
    { label: 'The Market', color: C.terra, title: 'North County runs on introductions', body: "Paso Robles, Templeton, Adelaida — this market does not crack with Facebook ads. You get in through warm introductions and stay in through reliable, consistent work. That relationship layer is the moat." },
  ];
  return (
    <section id="why" style={{ background: C.cream, padding: '120px 0' }}>
      <div style={WRAP}>
        <div className="why-cols" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0 64px' }}>
          {pillars.map((p, i) => (
            <Reveal key={p.label} delay={i * 0.10}>
              <div>
                <Eyebrow color={p.color}>{p.label}</Eyebrow>
                <h3 style={{ fontFamily: D, fontSize: 28, fontWeight: 400, color: C.body, marginBottom: 14, lineHeight: 1.2 }}>{p.title}</h3>
                <p style={{ fontFamily: U, fontSize: 15, lineHeight: 1.78, color: '#5a6e82' }}>{p.body}</p>
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
    { n: '01', title: 'Schedule a flight', body: "Reach out by email or phone. Confirm your property, the season's priority, and schedule a site visit. First-time clients in the portfolio phase fly for free — no catch and no upsell buried in it." },
    { n: '02', title: 'One to two hours on-site', body: "A single visit covers most vineyards under 50 acres and most ranch monitoring flights. Preflight, mission, data quality check before leaving. You don't need to be there." },
    { n: '03', title: 'Report in your inbox', body: "A georeferenced map file plus a plain-language PDF — no portals, no dashboards, no accounts to manage. Frost pockets, canopy gaps, fence damage: flagged directly, within 7 days." },
  ];
  return (
    <section id="process" style={{ background: C.slate, padding: '110px 0' }}>
      <div style={WRAP}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 72 }}>
            <Eyebrow>Process</Eyebrow>
            <h2 style={{ fontFamily: D, fontSize: 'clamp(36px,4vw,54px)', fontWeight: 400, color: C.cream, lineHeight: 1.05, letterSpacing: '-0.02em' }}>Simple by design.</h2>
            <p style={{ fontFamily: U, fontSize: 15.5, color: C.muted, maxWidth: 420, margin: '18px auto 0', lineHeight: 1.72 }}>No app to download. No portal to log into. A flight, a report, and a relationship.</p>
          </div>
        </Reveal>
        <div className="proc-row" style={{ display: 'flex', alignItems: 'flex-start', gap: 0 }}>
          {steps.map((s, i) => (
            <React.Fragment key={s.n}>
              <Reveal delay={i * 0.1} style={{ flex: 1 }}>
                <div style={{ flex: 1, padding: '0 20px', textAlign: 'center' }}>
                  <div style={{ width: 56, height: 56, borderRadius: '50%', margin: '0 auto 28px', border: '1px solid rgba(201,168,76,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(201,168,76,0.06)' }}>
                    <span style={{ fontFamily: D, fontSize: 20, fontWeight: 400, color: C.gold }}>{s.n}</span>
                  </div>
                  <h3 style={{ fontFamily: D, fontSize: 24, fontWeight: 400, color: C.cream, marginBottom: 12, lineHeight: 1.2 }}>{s.title}</h3>
                  <p style={{ fontFamily: U, fontSize: 14, lineHeight: 1.78, color: 'rgba(138,158,181,0.75)' }}>{s.body}</p>
                </div>
              </Reveal>
              {i < steps.length - 1 && (
                <div className="proc-line" style={{ flexShrink: 0, paddingTop: 26 }}>
                  <div style={{ width: 72, height: 1, background: 'rgba(201,168,76,0.15)' }} />
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
    { label: 'Vineyard Mapping', color: C.gold, rows: [['Under 20 acres','$300'],['20–50 acres','$450'],['Repeat visit','$250'],['Turnaround','7 days'],['Deliverable','Orthomosaic + PDF']] },
    { label: 'Ranch Monitoring', color: C.sage, rows: [['Onboarding (one-time)','$600'],['Monthly','$150/mo'],['Weekly','$400/mo'],['Turnaround','24 hours'],['Deliverable','GPS report + photos']] },
    { label: 'Pre-Listing Maps', color: C.terra, rows: [['Under 50 acres','$750'],['50–200 acres','$1,100'],['200+ acres','$1,500+'],['Turnaround','7–10 days'],['Deliverable','Video + ortho + MLS']] },
    { label: 'Bluff Documentation', color: C.steel, rows: [['Individual homeowner','$400/qtr'],['HOA (5+ props)','$1,200/qtr'],['Annual archive','$1,500/yr'],['Includes','Storm flights'],['Deliverable','Report + archive']] },
  ];
  return (
    <section id="pricing" style={{ background: C.cream, padding: '110px 0' }}>
      <div style={WRAP}>
        <Reveal>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 52, flexWrap: 'wrap', gap: 20 }}>
            <div>
              <Eyebrow color={C.terra}>Pricing</Eyebrow>
              <h2 style={{ fontFamily: D, fontSize: 'clamp(36px,4vw,52px)', fontWeight: 400, color: C.body, lineHeight: 1.05, letterSpacing: '-0.02em' }}>No hidden fees.</h2>
            </div>
            <p style={{ fontFamily: U, fontSize: 14, lineHeight: 1.75, color: '#5a6e82', maxWidth: 340 }}>Published because it builds trust and saves everyone a negotiation nobody enjoys.</p>
          </div>
        </Reveal>
        <div className="pricing-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
          {cols.map((col, ci) => (
            <Reveal key={col.label} delay={ci * 0.07}>
              <div style={{ background: '#fff', borderRadius: 6, overflow: 'hidden', boxShadow: '0 1px 12px rgba(0,0,0,0.07)' }}>
                <div style={{ background: C.ink, padding: '16px 20px', borderBottom: `2.5px solid ${col.color}` }}>
                  <span style={{ fontFamily: U, fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', color: C.cream }}>{col.label}</span>
                </div>
                {col.rows.map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '12px 20px', borderBottom: `1px solid ${C.sand}`, gap: 8 }}>
                    <span style={{ fontFamily: U, fontSize: 11.5, color: '#7a8e9e', lineHeight: 1.4 }}>{k}</span>
                    <span style={{ fontFamily: D, fontSize: 17, fontWeight: 400, color: C.body, textAlign: 'right', flexShrink: 0 }}>{v}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.2}>
          <div style={{ marginTop: 28, background: C.ink, borderRadius: 6, padding: '26px 32px', display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: C.gold, flexShrink: 0, display: 'block' }} />
            <div>
              <span style={{ fontFamily: U, fontSize: 13, fontWeight: 700, color: C.cream }}>First map is free. </span>
              <span style={{ fontFamily: U, fontSize: 13, color: 'rgba(230,221,200,0.52)', lineHeight: 1.7 }}>While the portfolio is being built, the first vineyard or ranch flight is complimentary for network introductions. Job four onward charges at the rates above.</span>
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
    { color: C.sage, title: '$1M Liability Coverage', body: 'Annual policy through a drone-specialist carrier. Certificate of insurance available on request before any flight.' },
    { color: C.steel, title: 'DJI Mini 4 Pro', body: '4K/60fps, 48MP stills, obstacle avoidance, 3-axis gimbal. The right tool for properties under 200 acres.' },
    { color: C.terra, title: 'Local Knowledge', body: 'Paso, Templeton, Adelaida, Creston, Shandon, San Miguel, Cambria, Cayucos. The roads, the owners, the seasons.' },
  ];
  return (
    <section style={{ background: C.night, padding: '72px 0' }}>
      <div style={WRAP}>
        <div className="trust-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 1, borderRadius: 6, overflow: 'hidden' }}>
          {items.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.06}>
              <div style={{ background: i % 2 === 0 ? C.deep : C.slate, padding: '34px 26px', height: '100%' }}>
                <div style={{ width: 32, height: 2, background: item.color, marginBottom: 18, borderRadius: 1 }} />
                <h3 style={{ fontFamily: U, fontSize: 13, fontWeight: 700, color: C.cream, marginBottom: 10, letterSpacing: '0.02em' }}>{item.title}</h3>
                <p style={{ fontFamily: U, fontSize: 13, lineHeight: 1.70, color: 'rgba(138,158,181,0.72)' }}>{item.body}</p>
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
    { zone: 'East Paso & Range', places: ['Creston', 'Shandon', 'San Miguel', 'Cholame Valley', 'Cypress Mountain Rd'] },
    { zone: 'Coastal', places: ['Cambria', 'Cayucos', 'Morro Bay vicinity', 'Hwy 1 corridor'] },
    { zone: 'South County', places: ['Atascadero', 'Santa Margarita', 'Pozo Valley'] },
  ];
  return (
    <section id="coverage" style={{ background: C.cream, padding: '110px 0' }}>
      <div style={WRAP}>
        <div className="cov-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 96px', alignItems: 'start' }}>
          <Reveal>
            <div>
              <Eyebrow color={C.sage}>Coverage Area</Eyebrow>
              <h2 style={{ fontFamily: D, fontSize: 'clamp(34px,3.8vw,52px)', fontWeight: 400, color: C.body, lineHeight: 1.06, letterSpacing: '-0.02em', marginBottom: 22 }}>
                North SLO County.<br /><em style={{ fontWeight: 300, fontStyle: 'italic' }}>All of it.</em>
              </h2>
              <p style={{ fontFamily: U, fontSize: 15, lineHeight: 1.78, color: '#5a6e82', marginBottom: 18 }}>From the Adelaida ridgeline to the coastal bluffs at Cambria. Local knowledge — which gates, which roads, which neighbors to watch — is part of the product.</p>
              <p style={{ fontFamily: U, fontSize: 14, lineHeight: 1.78, color: '#7a8e9e' }}>Properties outside this territory quoted on request. Travel to Monterey or Santa Barbara counties carries a mileage surcharge.</p>
            </div>
          </Reveal>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {zones.map((z, i) => (
              <Reveal key={z.zone} delay={i * 0.07}>
                <div style={{ background: '#fff', borderRadius: 6, padding: '18px 22px', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
                  <div style={{ fontFamily: U, fontSize: 9.5, letterSpacing: '0.20em', textTransform: 'uppercase', color: C.terra, marginBottom: 10 }}>{z.zone}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {z.places.map(p => <span key={p} style={{ fontFamily: U, fontSize: 12, background: C.sand, borderRadius: 3, padding: '4px 10px', color: '#5a6e82' }}>{p}</span>)}
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
    ['Ranch monitoring — monthly contracts', '2 × $1,800/yr', '$3,600'],
    ['Ranch monitoring — onboarding flights', '2 × $600', '$1,200'],
    ['Pre-listing property maps', '2 × $1,000', '$2,000'],
  ];
  return (
    <section style={{ background: C.slate, padding: '110px 0' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 52px' }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <Eyebrow>Year One Projection</Eyebrow>
            <h2 style={{ fontFamily: D, fontSize: 'clamp(32px,3.5vw,50px)', fontWeight: 400, color: C.cream, lineHeight: 1.06, letterSpacing: '-0.02em', marginBottom: 14 }}>Conservative. Built on warm intros.</h2>
            <p style={{ fontFamily: U, fontSize: 15, color: C.muted, maxWidth: 460, margin: '0 auto', lineHeight: 1.72 }}>No paid advertising. No cold outreach. Just the relationship network doing what relationship networks do.</p>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <div style={{ background: C.deep, borderRadius: 6, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: C.ink }}>
                  {['Service Line', 'Basis', 'Annual'].map(h => (
                    <th key={h} style={{ fontFamily: U, fontSize: 9.5, letterSpacing: '0.20em', textTransform: 'uppercase', color: C.faint, padding: '13px 24px', textAlign: 'left' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map(([s, b, t]) => (
                  <tr key={s} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ fontFamily: U, fontSize: 13, color: C.text, padding: '13px 24px' }}>{s}</td>
                    <td style={{ fontFamily: U, fontSize: 12, color: C.faint, padding: '13px 24px' }}>{b}</td>
                    <td style={{ fontFamily: D, fontSize: 20, color: C.gold, padding: '13px 24px', fontWeight: 400 }}>{t}</td>
                  </tr>
                ))}
                <tr style={{ background: 'rgba(201,168,76,0.06)' }}>
                  <td colSpan={2} style={{ fontFamily: U, fontSize: 12, fontWeight: 700, color: C.cream, padding: '17px 24px', letterSpacing: '0.06em' }}>Year-one gross (conservative)</td>
                  <td style={{ fontFamily: D, fontSize: 28, color: C.gold, padding: '17px 24px', fontWeight: 400, letterSpacing: '-0.01em' }}>~$10,350</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Reveal>
        <div className="proj-cards" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10 }}>
          {[{ label: 'Year-one net', val: '$6,500–$8,500', sub: 'After setup costs and $800 CA franchise tax if applicable', color: C.sage }, { label: 'Year-two target', val: '$25K–$40K', sub: 'Ranch book at 8–12 contracts, vineyard work compounding as repeats', color: C.gold }].map(card => (
            <Reveal key={card.label} delay={0.12}>
              <div style={{ background: C.deep, borderRadius: 6, padding: '26px 26px', borderLeft: `2.5px solid ${card.color}` }}>
                <div style={{ fontFamily: U, fontSize: 10.5, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.faint, marginBottom: 10 }}>{card.label}</div>
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
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const inp = { width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(230,221,200,0.14)', padding: '14px 0', fontFamily: U, fontSize: 16, color: C.cream, outline: 'none', transition: 'border-color 0.25s' };

  const submit = e => {
    e.preventDefault();
    const sub = encodeURIComponent(`North SLO Aerial inquiry from ${form.name}`);
    const bod = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`);
    window.location.href = `mailto:hello@northsloaerial.com?subject=${sub}&body=${bod}`;
    setSent(true);
  };

  return (
    <section id="contact" style={{ background: C.ink, padding: '110px 0' }}>
      <div style={WRAP}>
        <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 100px', alignItems: 'start' }}>
          <Reveal>
            <div>
              <Eyebrow>Get In Touch</Eyebrow>
              <h2 style={{ fontFamily: D, fontSize: 'clamp(40px,4.5vw,62px)', fontWeight: 400, color: C.cream, lineHeight: 1.04, letterSpacing: '-0.02em', marginBottom: 26 }}>
                Start with<br /><em style={{ fontWeight: 300, fontStyle: 'italic', color: C.gold }}>a free map.</em>
              </h2>
              <p style={{ fontFamily: U, fontSize: 15, lineHeight: 1.78, color: 'rgba(138,158,181,0.78)', marginBottom: 44 }}>
                While the portfolio is being built, the first vineyard or ranch flight is complimentary. About an hour on your property. The map and report arrive within a week. If you want it again for pay, we talk then. That is the whole pitch.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 32 }}>
                {['North SLO County, California', 'FAA Part 107  ·  $1M Insured  ·  Local', 'Paso Robles · Templeton · Adelaida · Creston · Cambria'].map(t => (
                  <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: C.gold, flexShrink: 0, display: 'block' }} />
                    <span style={{ fontFamily: U, fontSize: 13, color: C.faint }}>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            {sent ? (
              <div style={{ paddingTop: 56, textAlign: 'center' }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', border: `1px solid ${C.gold}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                </div>
                <div style={{ fontFamily: D, fontSize: 30, fontWeight: 400, color: C.cream, marginBottom: 12 }}>Your mail app is open.</div>
                <p style={{ fontFamily: U, fontSize: 14, color: C.muted, lineHeight: 1.7 }}>Send the message when ready. We follow up within 48 hours.</p>
              </div>
            ) : (
              <form onSubmit={submit} style={{ paddingTop: 56 }}>
                {[{ label: 'Name', key: 'name', type: 'text', ph: 'Your name' }, { label: 'Email', key: 'email', type: 'email', ph: 'your@email.com' }].map(f => (
                  <div key={f.key} style={{ marginBottom: 34 }}>
                    <label style={{ display: 'block', fontFamily: U, fontSize: 9.5, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.faint, marginBottom: 10 }}>{f.label}</label>
                    <input type={f.type} value={form[f.key]} onChange={set(f.key)} required placeholder={f.ph} style={inp}
                      onFocus={e => e.target.style.borderBottomColor = 'rgba(201,168,76,0.55)'}
                      onBlur={e => e.target.style.borderBottomColor = 'rgba(230,221,200,0.14)'} />
                  </div>
                ))}
                <div style={{ marginBottom: 40 }}>
                  <label style={{ display: 'block', fontFamily: U, fontSize: 9.5, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.faint, marginBottom: 10 }}>What can we map?</label>
                  <textarea value={form.message} onChange={set('message')} required rows={4}
                    placeholder="Property location, approximate acreage, and what you're hoping to learn."
                    style={{ ...inp, resize: 'vertical', lineHeight: 1.6 }}
                    onFocus={e => e.target.style.borderBottomColor = 'rgba(201,168,76,0.55)'}
                    onBlur={e => e.target.style.borderBottomColor = 'rgba(230,221,200,0.14)'} />
                </div>
                <button type="submit" style={{ width: '100%', background: C.gold, color: C.ink, border: 'none', borderRadius: 4, padding: '16px', fontFamily: U, fontSize: 12, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s' }}
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
    <footer style={{ background: '#040710', padding: '38px 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ ...WRAP, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 26, height: 26, borderRadius: 5, border: '1px solid rgba(201,168,76,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(201,168,76,0.06)' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="2.5" /><path d="M12 9.5V7M12 14.5v2.5M9.5 12H7M14.5 12h2.5M5.5 5.5l2 2M16.5 16.5l2 2M5.5 18.5l2-2M16.5 7.5l2-2" />
              <circle cx="4" cy="4" r="1.5" /><circle cx="20" cy="4" r="1.5" /><circle cx="4" cy="20" r="1.5" /><circle cx="20" cy="20" r="1.5" />
            </svg>
          </div>
          <span style={{ fontFamily: D, fontSize: 13, color: 'rgba(230,221,200,0.35)', fontWeight: 400 }}>North SLO Aerial</span>
        </div>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center' }}>
          {['FAA Part 107 Certified', '$1M Liability Insurance', 'North SLO County, CA'].map(t => (
            <span key={t} style={{ fontFamily: U, fontSize: 9.5, letterSpacing: '0.10em', color: 'rgba(255,255,255,0.16)', textTransform: 'uppercase' }}>{t}</span>
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
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <Nav scrolled={scrolled} />
      <Hero />
      <Marquee />
      <Gallery />
      <Services />
      <QuoteSection />
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
