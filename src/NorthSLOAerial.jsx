import React, { useState, useEffect, useRef } from 'react';

// ── Tokens ────────────────────────────────────────────────────
const C = {
  green:    '#2ea84d',
  greenD:   '#208a3c',
  greenL:   '#3fc962',
  greenBg:  '#eaf7ed',
  greenBg2: '#d8efdc',
  ink:      '#0c1410',
  text:     '#1a1f1c',
  body:     '#3a4540',
  muted:    '#6b7570',
  faint:    '#9aa19c',
  border:   '#e5e9e6',
  white:    '#ffffff',
  cream:    '#fafaf7',
  cream2:   '#f4f5f1',
};
const F = "'Plus Jakarta Sans', 'Inter', system-ui, -apple-system, sans-serif";
const WRAP = { maxWidth: 1280, margin: '0 auto', padding: '0 32px' };

// ── Photos (Unsplash + gradient fallbacks) ────────────────────
const PHOTOS = {
  hero:     'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1600&q=85&auto=format&fit=crop',
  side:     'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600&q=80&auto=format&fit=crop',
  vineyard: 'https://images.unsplash.com/photo-1504279577054-acfeccf8fc52?w=900&q=80&auto=format&fit=crop',
  ranch:    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=900&q=80&auto=format&fit=crop',
  listing:  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=80&auto=format&fit=crop',
  bluff:    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=80&auto=format&fit=crop',
  cta:      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&q=80&auto=format&fit=crop',
  team:     'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=900&q=80&auto=format&fit=crop',
};
const FB = {
  hero:     'linear-gradient(135deg, #7fb3d5 0%, #88c999 50%, #5fa56c 100%)',
  side:     'linear-gradient(135deg, #a8d5ba 0%, #5fa56c 100%)',
  vineyard: 'linear-gradient(135deg, #88c999 0%, #4d7a5c 100%)',
  ranch:    'linear-gradient(135deg, #c9b888 0%, #8a6e3c 100%)',
  listing:  'linear-gradient(135deg, #a3c2d2 0%, #4d7a8c 100%)',
  bluff:    'linear-gradient(135deg, #88a8c9 0%, #3c5a7a 100%)',
  cta:      'linear-gradient(135deg, #2ea84d 0%, #1c8a3d 100%)',
  team:     'linear-gradient(135deg, #a8d5ba 0%, #6b9c7c 100%)',
};
const imgErr = e => { e.currentTarget.style.opacity = '0'; };

// ── Global CSS ────────────────────────────────────────────────
const CSS = `
  *{box-sizing:border-box;margin:0;padding:0;}
  html{scroll-behavior:smooth;}
  body{background:${C.white};-webkit-font-smoothing:antialiased;color:${C.text};font-family:${F};}
  ::selection{background:${C.green};color:${C.white};}
  img{display:block;width:100%;height:100%;object-fit:cover;}
  button{font-family:inherit;}
  input,textarea{font-family:inherit;}

  @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes pulseDot{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.4);opacity:0.5}}
  @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
  @keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}

  .hover-lift{transition:transform 0.35s cubic-bezier(0.16,1,0.3,1),box-shadow 0.35s ease;}
  .hover-lift:hover{transform:translateY(-6px);box-shadow:0 22px 50px -18px rgba(46,168,77,0.30);}

  .arrow-card{transition:all 0.3s ease;}
  .arrow-card:hover .arrow-icon{transform:translate(4px,-4px);}

  @media(max-width:980px){
    .hero-grid{grid-template-columns:1fr!important;gap:20px!important;}
    .hero-side-card{position:static!important;width:100%!important;margin-top:0!important;}
    .hero-title{font-size:clamp(40px,7vw,68px)!important;}
    .nav-wrap{padding:12px 16px!important;}
    .nav-links{display:none!important;}
    .nav-cta-group{gap:8px!important;}
    .services-grid{grid-template-columns:1fr!important;}
    .about-grid{grid-template-columns:1fr!important;gap:20px!important;}
    .stats-grid{grid-template-columns:1fr 1fr!important;gap:20px!important;}
    .testimonials-grid{grid-template-columns:1fr!important;}
    .footer-grid{grid-template-columns:1fr 1fr!important;gap:32px!important;}
    .wrap-mobile{padding:0 20px!important;}
    .cta-section{padding:60px 28px!important;}
    .cta-title{font-size:clamp(36px,7vw,56px)!important;}
    .faq-question{font-size:15px!important;}
  }
  @media(max-width:560px){
    .stats-grid{grid-template-columns:1fr!important;}
    .footer-grid{grid-template-columns:1fr!important;}
    .hero-photo{height:380px!important;}
    .nav-logo-text{display:none!important;}
  }
`;

// ── Hooks ─────────────────────────────────────────────────────
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
  }, [threshold]);
  return [ref, vis];
}

function useCountUp(target, duration = 1800, start = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    let s = null;
    const step = ts => {
      if (!s) s = ts;
      const p = Math.min((ts - s) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(eased * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return val;
}

function Reveal({ children, delay = 0, y = 24 }) {
  const [ref, vis] = useReveal();
  return (
    <div ref={ref} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? 'none' : `translateY(${y}px)`,
      transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
    }}>{children}</div>
  );
}

// ── Pill button ───────────────────────────────────────────────
function PillBtn({ children, onClick, variant = 'primary', size = 'md', icon = null }) {
  const [hov, setHov] = useState(false);
  const sizes = {
    sm: { padding: '10px 22px', fontSize: 13 },
    md: { padding: '14px 28px', fontSize: 14 },
    lg: { padding: '17px 34px', fontSize: 15 },
  };
  const variants = {
    primary: {
      background: hov ? C.greenD : C.green,
      color: C.white,
      border: 'none',
      boxShadow: hov ? '0 8px 24px -8px rgba(46,168,77,0.55)' : '0 4px 14px -6px rgba(46,168,77,0.40)',
    },
    white: {
      background: C.white,
      color: hov ? C.greenD : C.green,
      border: 'none',
      boxShadow: hov ? '0 8px 22px -8px rgba(0,0,0,0.18)' : '0 4px 14px -6px rgba(0,0,0,0.10)',
    },
    ghost: {
      background: 'transparent',
      color: hov ? C.green : C.text,
      border: `1.5px solid ${hov ? C.green : C.border}`,
    },
  };
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        ...sizes[size], ...variants[variant],
        borderRadius: 999, fontWeight: 600, cursor: 'pointer',
        display: 'inline-flex', alignItems: 'center', gap: 8,
        transition: 'all 0.25s ease',
        letterSpacing: '-0.005em',
        whiteSpace: 'nowrap',
      }}>
      {children}
      {icon}
    </button>
  );
}

// ── Tag pill (small label) ────────────────────────────────────
function Tag({ children, color = C.green }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '6px 14px', borderRadius: 999,
      border: `1.5px solid ${color}`, background: 'transparent',
      fontFamily: F, fontSize: 12, fontWeight: 600, color,
      letterSpacing: '-0.005em',
    }}>{children}</span>
  );
}

// ── Nav ───────────────────────────────────────────────────────
function Nav() {
  const go = id => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  return (
    <nav style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 50, padding: '20px 0' }}>
      <div className="nav-wrap" style={{ ...WRAP, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>

        {/* Logo pill */}
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{
            background: C.white, border: 'none', cursor: 'pointer',
            padding: '12px 22px', borderRadius: 999,
            display: 'flex', alignItems: 'center', gap: 10,
            boxShadow: '0 2px 12px -4px rgba(0,0,0,0.10)',
          }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="2" fill={C.green} />
            <path d="M12 10V4M12 14v6M10 12H4M14 12h6M5 5l3 3M16 16l3 3M5 19l3-3M16 8l3-3" />
          </svg>
          <span className="nav-logo-text" style={{ fontWeight: 700, color: C.green, fontSize: 15, letterSpacing: '-0.01em' }}>North SLO Aerial</span>
        </button>

        {/* Center nav pill */}
        <div className="nav-links" style={{
          background: C.white, borderRadius: 999,
          padding: '8px 12px', display: 'flex', alignItems: 'center',
          boxShadow: '0 2px 12px -4px rgba(0,0,0,0.10)',
        }}>
          {[
            { label: 'Home', id: 'home' },
            { label: 'About', id: 'about' },
            { label: 'Services', id: 'services' },
            { label: 'Pricing', id: 'pricing' },
            { label: 'Contact', id: 'contact' },
          ].map(({ label, id }) => (
            <NavLink key={id} label={label} onClick={() => go(id)} />
          ))}
        </div>

        {/* Right CTA group */}
        <div className="nav-cta-group" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <PillBtn variant="white" size="sm" onClick={() => go('contact')}>Sign up</PillBtn>
          <PillBtn variant="primary" size="sm" onClick={() => go('contact')}>Get Started</PillBtn>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ label, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? C.greenBg : 'transparent',
        color: hov ? C.green : C.text,
        border: 'none', cursor: 'pointer',
        padding: '8px 18px', borderRadius: 999,
        fontFamily: F, fontSize: 14, fontWeight: 500,
        transition: 'all 0.2s ease',
        letterSpacing: '-0.005em',
      }}>{label}</button>
  );
}

// ── Hero ──────────────────────────────────────────────────────
function Hero() {
  const go = id => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  return (
    <section id="home" style={{ background: C.white, padding: '110px 0 60px' }}>
      <div style={{ ...WRAP }}>
        <div style={{ position: 'relative' }}>

          {/* Rounded photo container */}
          <div className="hero-photo" style={{
            position: 'relative',
            height: 620,
            borderRadius: 28,
            overflow: 'hidden',
            background: FB.hero,
            boxShadow: '0 30px 60px -30px rgba(0,0,0,0.20)',
          }}>
            <img src={PHOTOS.hero} alt="" onError={imgErr} style={{ objectPosition: 'center 40%' }} />

            {/* Light gradient overlay for text legibility */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(12,20,16,0.45) 0%, rgba(12,20,16,0.10) 40%, transparent 70%)' }} />

            {/* Headline — bottom left */}
            <div className="hero-overlay" style={{
              position: 'absolute', left: 48, bottom: 56, right: '38%',
              animation: 'fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.2s both',
            }}>
              <h1 className="hero-title" style={{
                fontFamily: F, fontWeight: 700,
                fontSize: 'clamp(40px,5.5vw,76px)',
                lineHeight: 1.02, letterSpacing: '-0.03em',
                color: C.white, margin: '0 0 22px',
                textShadow: '0 2px 24px rgba(0,0,0,0.25)',
              }}>
                Smarter Eyes on<br />
                Your North County Land
              </h1>
              <p style={{
                fontFamily: F, fontSize: 16, lineHeight: 1.6,
                color: 'rgba(255,255,255,0.92)', maxWidth: 500,
                margin: '0 0 32px',
                textShadow: '0 1px 12px rgba(0,0,0,0.30)',
              }}>
                Transform your vineyards and ranches with precision drone solutions. From canopy mapping
                to absentee property monitoring — we bring clarity, speed, and accountability to every acre.
              </p>
              <PillBtn variant="primary" size="lg" onClick={() => go('contact')}>
                Book a Free Consultation
              </PillBtn>
            </div>
          </div>

          {/* Floating service card — right side */}
          <div className="hero-side-card" style={{
            position: 'absolute',
            right: 32, bottom: 32, width: 280,
            background: C.white, borderRadius: 22,
            padding: 16,
            boxShadow: '0 20px 50px -20px rgba(0,0,0,0.25)',
            animation: 'fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.5s both',
          }}>
            <div style={{
              height: 170, borderRadius: 14, overflow: 'hidden',
              background: FB.side, marginBottom: 14,
            }}>
              <img src={PHOTOS.side} alt="" onError={imgErr} />
            </div>
            <h4 style={{ fontFamily: F, fontSize: 17, fontWeight: 700, color: C.green, margin: '0 0 6px', letterSpacing: '-0.01em' }}>
              North SLO Aerial
            </h4>
            <p style={{ fontFamily: F, fontSize: 13, lineHeight: 1.5, color: C.muted, margin: 0 }}>
              Monitor acres of vineyard and ranch land in minutes with FAA Part 107 pilots.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}

// ── About ─────────────────────────────────────────────────────
function About() {
  return (
    <section id="about" style={{ background: C.white, padding: '90px 0' }}>
      <div style={{ ...WRAP }}>
        <Reveal>
          <Tag color={C.green}>About Us</Tag>
        </Reveal>
        <div className="about-grid" style={{
          marginTop: 24,
          display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 80, alignItems: 'start',
        }}>
          <Reveal delay={0.05}>
            <h2 style={{
              fontFamily: F, fontWeight: 700,
              fontSize: 'clamp(32px,3.4vw,46px)',
              lineHeight: 1.05, letterSpacing: '-0.025em',
              color: C.text, margin: 0,
            }}>
              Smarter Vineyard & Ranch Drones
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p style={{
              fontFamily: F, fontSize: 19, lineHeight: 1.55,
              color: C.muted, margin: 0, letterSpacing: '-0.005em',
            }}>
              North SLO Aerial combines FAA Part 107 certified pilots with precision drone mapping,
              helping small wineries and rural property owners{' '}
              <span style={{ color: C.green, fontWeight: 600 }}>monitor frost zones, optimize yields,</span>{' '}
              and keep eyes on land they can't visit every week — without the
              <span style={{ color: C.green, fontWeight: 600 }}> 500-acre minimums of commercial ag-tech firms.</span>
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ── Services data ─────────────────────────────────────────────
const SERVICES = [
  {
    id: 'vineyard',
    photo: PHOTOS.vineyard, fb: FB.vineyard,
    tag: 'Phase 1', tagColor: C.green,
    title: 'Vineyard Canopy & Frost Mapping',
    desc: 'Stitched orthomosaic of your vineyard with frost pockets, canopy gaps, and vigor variation clearly flagged.',
    price: '$300',
    stat: '95%',
    statLabel: 'Crop health detection accuracy',
  },
  {
    id: 'ranch',
    photo: PHOTOS.ranch, fb: FB.ranch,
    tag: 'Phase 2', tagColor: C.green,
    title: 'Absentee Ranch Monitoring',
    desc: 'Monthly eyes on fence lines, water troughs, livestock counts, and trespass evidence — delivered within 24 hours.',
    price: '$150',
    stat: '6x',
    statLabel: 'Faster than weekly site visits',
  },
  {
    id: 'listing',
    photo: PHOTOS.listing, fb: FB.listing,
    tag: 'Phase 3', tagColor: C.green,
    title: 'Pre-Listing Property Maps',
    desc: '4K video walkthrough, orthomosaic with annotated water sources and structures, plus drone stills for MLS.',
    price: '$750',
    stat: '24h',
    statLabel: 'From flight to delivered media',
  },
  {
    id: 'bluff',
    photo: PHOTOS.bluff, fb: FB.bluff,
    tag: 'Phase 3', tagColor: C.green,
    title: 'Coastal Bluff Documentation',
    desc: 'Quarterly aerial documentation of bluff edge position, face erosion, and structural change for legal and insurance use.',
    price: '$400',
    stat: '1cm',
    statLabel: 'GPS-tagged accuracy per frame',
  },
];

// ── Services ──────────────────────────────────────────────────
function Services() {
  return (
    <section id="services" style={{ background: C.cream, padding: '90px 0' }}>
      <div style={{ ...WRAP }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 24, marginBottom: 48 }}>
          <Reveal>
            <div>
              <Tag>Our Services</Tag>
              <h2 style={{
                fontFamily: F, fontWeight: 700, marginTop: 16,
                fontSize: 'clamp(32px,3.4vw,46px)',
                lineHeight: 1.05, letterSpacing: '-0.025em',
                color: C.text,
              }}>
                Four service lines.<br />One trusted operator.
              </h2>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <p style={{ fontFamily: F, fontSize: 15, lineHeight: 1.6, color: C.muted, maxWidth: 320 }}>
              Sequenced by speed-to-first-dollar and relationship leverage — built for the operations bigger firms ignore.
            </p>
          </Reveal>
        </div>

        <div className="services-grid" style={{
          display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 24,
        }}>
          {SERVICES.map((svc, i) => (
            <Reveal key={svc.id} delay={i * 0.06}>
              <ServiceCard svc={svc} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ svc }) {
  return (
    <div className="hover-lift arrow-card" style={{
      background: C.white, borderRadius: 24, padding: 16,
      border: `1px solid ${C.border}`,
    }}>
      {/* Photo */}
      <div style={{
        position: 'relative',
        height: 220, borderRadius: 16, overflow: 'hidden',
        background: svc.fb, marginBottom: 18,
      }}>
        <img src={svc.photo} alt="" onError={imgErr} />
        {/* Phase chip on photo */}
        <div style={{
          position: 'absolute', top: 14, left: 14,
          background: C.white, padding: '6px 12px', borderRadius: 999,
          fontFamily: F, fontSize: 11, fontWeight: 700, color: C.green,
          letterSpacing: '0.04em', textTransform: 'uppercase',
        }}>{svc.tag}</div>
        {/* Stat chip top-right */}
        <div style={{
          position: 'absolute', top: 14, right: 14,
          background: 'rgba(255,255,255,0.96)', padding: '8px 14px', borderRadius: 999,
          display: 'flex', alignItems: 'baseline', gap: 6,
          backdropFilter: 'blur(8px)',
        }}>
          <span style={{ fontFamily: F, fontSize: 18, fontWeight: 800, color: C.green, letterSpacing: '-0.02em' }}>{svc.stat}</span>
          <span style={{ fontFamily: F, fontSize: 10, color: C.muted, fontWeight: 500 }}>{svc.statLabel.split(' ').slice(0, 2).join(' ')}</span>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '4px 10px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 10 }}>
          <h3 style={{
            fontFamily: F, fontSize: 22, fontWeight: 700,
            lineHeight: 1.15, letterSpacing: '-0.02em',
            color: C.text, flex: 1, margin: 0,
          }}>{svc.title}</h3>
          <div className="arrow-icon" style={{
            width: 38, height: 38, borderRadius: '50%',
            background: C.greenBg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'transform 0.3s ease',
            flexShrink: 0,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17 L17 7 M9 7 H17 V15" />
            </svg>
          </div>
        </div>
        <p style={{
          fontFamily: F, fontSize: 14.5, lineHeight: 1.6,
          color: C.muted, margin: '0 0 18px',
        }}>{svc.desc}</p>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, paddingTop: 14, borderTop: `1px solid ${C.border}` }}>
          <span style={{ fontFamily: F, fontSize: 12, color: C.muted }}>From</span>
          <span style={{ fontFamily: F, fontSize: 24, fontWeight: 700, color: C.green, letterSpacing: '-0.02em' }}>{svc.price}</span>
          <span style={{ fontFamily: F, fontSize: 12, color: C.muted }}>per flight</span>
        </div>
      </div>
    </div>
  );
}

// ── Stats Strip ───────────────────────────────────────────────
function StatsStrip() {
  const [ref, vis] = useReveal(0.2);
  const acres = useCountUp(200, 1600, vis);
  const days = useCountUp(7, 1200, vis);
  const ins = useCountUp(1, 1000, vis);
  return (
    <section ref={ref} style={{ background: C.white, padding: '70px 0' }}>
      <div style={{ ...WRAP }}>
        <div className="stats-grid" style={{
          display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 0,
          background: C.greenBg, borderRadius: 28, padding: '48px 32px',
        }}>
          {[
            { val: 'Part 107', label: 'FAA Certified & Insured' },
            { val: `${acres}ac`, label: 'Max property coverage' },
            { val: `${days} days`, label: 'Report turnaround' },
            { val: `$${ins}M`, label: 'Liability insurance' },
          ].map((s, i) => (
            <div key={s.label} style={{
              paddingLeft: i === 0 ? 0 : 32,
              borderLeft: i > 0 ? `1px solid rgba(46,168,77,0.20)` : 'none',
            }}>
              <div style={{ fontFamily: F, fontSize: 38, fontWeight: 800, color: C.green, letterSpacing: '-0.025em', lineHeight: 1 }}>{s.val}</div>
              <div style={{ fontFamily: F, fontSize: 13, color: C.body, marginTop: 10, fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Pricing ───────────────────────────────────────────────────
function Pricing() {
  const tiers = [
    {
      name: 'Single Flight',
      price: '$300',
      sub: 'Per visit',
      features: ['Orthomosaic stitched map', 'Plain-language PDF report', 'Up to 50 acres covered', '7-day delivery', 'GPS-tagged imagery'],
      cta: 'Book a flight',
      featured: false,
    },
    {
      name: 'Seasonal',
      price: '$750',
      sub: '3 flights per season',
      features: ['Everything in Single', 'Save $150 vs single bookings', 'Same-day priority slots', 'Comparison overlays', 'Direct text/email support'],
      cta: 'Most Popular',
      featured: true,
    },
    {
      name: 'Annual Monitoring',
      price: '$1,500',
      sub: '12 monthly visits',
      features: ['Everything in Seasonal', 'Onboarding flight included', 'Dedicated property archive', 'Weather-event flights included', '24-hour turnaround'],
      cta: 'Get a quote',
      featured: false,
    },
  ];
  return (
    <section id="pricing" style={{ background: C.cream, padding: '90px 0' }}>
      <div style={{ ...WRAP }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <Tag>Pricing</Tag>
            <h2 style={{
              fontFamily: F, fontWeight: 700, marginTop: 16,
              fontSize: 'clamp(32px,3.4vw,46px)',
              lineHeight: 1.05, letterSpacing: '-0.025em', color: C.text,
            }}>
              Simple pricing. No retainers.
            </h2>
            <p style={{ fontFamily: F, fontSize: 16, color: C.muted, marginTop: 14, maxWidth: 520, marginLeft: 'auto', marginRight: 'auto' }}>
              Every flight is quoted up-front. No subscriptions, no per-acre surprises, no portal fees.
            </p>
          </div>
        </Reveal>

        <div className="services-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
          {tiers.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08}>
              <div style={{
                background: t.featured ? C.green : C.white,
                color: t.featured ? C.white : C.text,
                borderRadius: 24, padding: 32,
                border: t.featured ? 'none' : `1px solid ${C.border}`,
                position: 'relative',
                boxShadow: t.featured ? '0 24px 50px -20px rgba(46,168,77,0.40)' : 'none',
                transform: t.featured ? 'translateY(-12px)' : 'none',
              }}>
                {t.featured && (
                  <div style={{
                    position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
                    background: C.white, color: C.green, padding: '6px 18px', borderRadius: 999,
                    fontFamily: F, fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase',
                    boxShadow: '0 4px 14px -4px rgba(0,0,0,0.18)',
                  }}>Most Popular</div>
                )}
                <h3 style={{ fontFamily: F, fontSize: 18, fontWeight: 700, marginBottom: 10, color: t.featured ? C.white : C.text }}>{t.name}</h3>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontFamily: F, fontSize: 48, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1, color: t.featured ? C.white : C.green }}>{t.price}</span>
                </div>
                <div style={{ fontFamily: F, fontSize: 13, color: t.featured ? 'rgba(255,255,255,0.85)' : C.muted, marginBottom: 26 }}>{t.sub}</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px' }}>
                  {t.features.map(f => (
                    <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '9px 0', fontFamily: F, fontSize: 14, color: t.featured ? 'rgba(255,255,255,0.92)' : C.body, lineHeight: 1.5 }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={t.featured ? C.white : C.green} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <PillBtn variant={t.featured ? 'white' : 'primary'} size="md"
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
                  {t.cta} →
                </PillBtn>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Testimonials ──────────────────────────────────────────────
const TESTIMONIALS = [
  {
    name: 'Sonya Patel', role: 'Vineyard Owner · Adelaida',
    quote: "The frost map saved us a full block of Syrah. We got the report on a Tuesday and triaged the heaters by Friday.",
    initial: 'SP', tint: '#88c999',
  },
  {
    name: 'Marcus Reid', role: 'Ranch Owner · Creston',
    quote: "I live in San Francisco. Knowing someone walks my fence lines every month — even by drone — means I sleep better.",
    initial: 'MR', tint: '#c9a888',
  },
  {
    name: 'Diana Lopez', role: 'Ag Realtor · Paso Robles',
    quote: "MLS photos can't tell the story of 80 acres. The drone package closed a $2.3M deal that was sitting for 9 months.",
    initial: 'DL', tint: '#a8c2d5',
  },
];

function Testimonials() {
  return (
    <section style={{ background: C.white, padding: '90px 0' }}>
      <div style={{ ...WRAP }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <Tag>What Clients Say</Tag>
            <h2 style={{
              fontFamily: F, fontWeight: 700, marginTop: 16,
              fontSize: 'clamp(32px,3.4vw,46px)',
              lineHeight: 1.05, letterSpacing: '-0.025em', color: C.text,
            }}>
              Vineyards and ranches across<br />North County trust us.
            </h2>
          </div>
        </Reveal>

        <div className="testimonials-grid" style={{
          display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20,
        }}>
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08}>
              <div className="hover-lift" style={{
                background: C.cream, borderRadius: 24, padding: 28,
                height: '100%', display: 'flex', flexDirection: 'column',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: '50%',
                    background: t.tint, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: F, fontWeight: 700, color: C.white, fontSize: 16,
                  }}>{t.initial}</div>
                  <div>
                    <div style={{ fontFamily: F, fontSize: 15, fontWeight: 700, color: C.text }}>{t.name}</div>
                    <div style={{ fontFamily: F, fontSize: 12, color: C.muted, marginTop: 2 }}>{t.role}</div>
                  </div>
                </div>
                <p style={{ fontFamily: F, fontSize: 15, lineHeight: 1.6, color: C.body, margin: 0, flex: 1 }}>
                  "{t.quote}"
                </p>
                <div style={{ display: 'flex', gap: 2, marginTop: 18 }}>
                  {[1, 2, 3, 4, 5].map(n => (
                    <svg key={n} width="16" height="16" viewBox="0 0 24 24" fill={C.green}>
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── FAQ ───────────────────────────────────────────────────────
const FAQS = [
  {
    q: 'What is precision drone mapping, and how can it help me?',
    a: 'Precision drone mapping uses advanced sensors and GPS to capture detailed, georeferenced imagery of your property. By stitching dozens of high-resolution photos into a single orthomosaic, we provide insights about canopy health, frost zones, water flow, and structural changes — helping you make smarter decisions, reduce waste, and increase yields.',
  },
  {
    q: 'Do I need prior drone experience to work with North SLO Aerial?',
    a: 'Not at all. You stay on the ground while our FAA Part 107 certified pilot handles the flight, the data capture, and the post-processing. You receive a finished map and a written report — no technical knowledge or apps required.',
  },
  {
    q: 'How accurate is the AI crop detection system?',
    a: 'Our processing pipeline detects canopy stress, dead vines, and frost damage with up to 95% accuracy on vineyards in the 15–200 acre range. Each flight is reviewed by a human before delivery, so you receive verified findings, not raw machine output.',
  },
  {
    q: "What's the average flight time per property?",
    a: 'Most vineyard or ranch flights take 30–90 minutes on-site. A 12-acre Adelaida block can be mapped in under an hour. A 200-acre ranch typically takes a full morning. We send you a delivery estimate before booking.',
  },
  {
    q: 'Can the drone operate in windy or rainy conditions?',
    a: 'Our drones handle steady winds up to 22 mph and light overcast conditions. We reschedule flights at no cost if wind, rain, or fire-season smoke would compromise data quality. You always get usable imagery — never half-finished maps.',
  },
  {
    q: 'Can the drone operate in challenging weather?',
    a: 'We monitor the Cal Fire and NWS feeds before every flight and reschedule proactively. For coastal bluff clients, we also include post-storm emergency flights in the annual subscription so you have immediate documentation after Pacific weather events.',
  },
];

function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <section style={{ background: C.green, padding: '90px 0', borderRadius: '0 0 40px 40px' }}>
      <div style={{ ...WRAP }}>
        <div className="about-grid" style={{
          display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 60, alignItems: 'start',
        }}>
          <Reveal>
            <div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '6px 14px', borderRadius: 999,
                border: `1.5px solid rgba(255,255,255,0.45)`, background: 'transparent',
                fontFamily: F, fontSize: 12, fontWeight: 600, color: C.white,
                marginBottom: 20,
              }}>FAQ</div>
              <h2 style={{
                fontFamily: F, fontWeight: 700,
                fontSize: 'clamp(32px,3.4vw,46px)',
                lineHeight: 1.05, letterSpacing: '-0.025em', color: C.white,
                margin: '0 0 24px',
              }}>
                Frequently asked<br />questions
              </h2>
              <p style={{ fontFamily: F, fontSize: 16, lineHeight: 1.6, color: 'rgba(255,255,255,0.85)' }}>
                Common questions from vineyard and ranch owners — answered before you ever pick up the phone.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {FAQS.map((f, i) => (
                <FaqItem key={i} faq={f} isOpen={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function FaqItem({ faq, isOpen, onToggle }) {
  return (
    <div style={{
      background: isOpen ? C.white : 'transparent',
      border: `1.5px solid ${isOpen ? C.white : 'rgba(255,255,255,0.30)'}`,
      borderRadius: 18, overflow: 'hidden',
      transition: 'all 0.3s ease',
    }}>
      <button onClick={onToggle}
        style={{
          width: '100%', background: 'transparent', border: 'none', cursor: 'pointer',
          padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 16, textAlign: 'left',
          color: isOpen ? C.text : C.white,
          fontFamily: F, fontSize: 16, fontWeight: 600, letterSpacing: '-0.005em',
        }} className="faq-question">
        <span>{faq.q}</span>
        <span style={{
          flexShrink: 0, width: 28, height: 28, borderRadius: '50%',
          background: isOpen ? C.greenBg : 'rgba(255,255,255,0.18)',
          color: isOpen ? C.green : C.white,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, fontWeight: 600,
          transition: 'all 0.3s ease',
          transform: isOpen ? 'rotate(45deg)' : 'none',
        }}>+</span>
      </button>
      {isOpen && (
        <div style={{
          padding: '0 24px 22px',
          fontFamily: F, fontSize: 14.5, lineHeight: 1.65, color: C.body,
          animation: 'fadeIn 0.3s ease',
        }}>{faq.a}</div>
      )}
    </div>
  );
}

// ── CTA ───────────────────────────────────────────────────────
function CTA() {
  const go = id => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  return (
    <section style={{ background: C.white, padding: '90px 0' }}>
      <div style={{ ...WRAP }}>
        <div className="cta-section" style={{
          position: 'relative', borderRadius: 32, overflow: 'hidden',
          background: FB.cta, padding: '90px 60px',
          textAlign: 'center',
        }}>
          <img src={PHOTOS.cta} alt="" onError={imgErr}
            style={{ position: 'absolute', inset: 0, opacity: 0.18, objectPosition: 'center' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(46,168,77,0.85) 0%, rgba(28,138,61,0.92) 100%)' }} />
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '6px 14px', borderRadius: 999,
              border: `1.5px solid rgba(255,255,255,0.45)`,
              fontFamily: F, fontSize: 12, fontWeight: 600, color: C.white,
              marginBottom: 24,
            }}>First flight is on us</div>
            <h2 className="cta-title" style={{
              fontFamily: F, fontWeight: 700,
              fontSize: 'clamp(36px,5vw,64px)',
              lineHeight: 1.02, letterSpacing: '-0.03em', color: C.white,
              margin: '0 auto 24px', maxWidth: 760,
            }}>
              Start with a free map.<br />See the gap for yourself.
            </h2>
            <p style={{ fontFamily: F, fontSize: 17, lineHeight: 1.55, color: 'rgba(255,255,255,0.92)', maxWidth: 540, margin: '0 auto 36px' }}>
              An hour on your property. A finished map in your inbox within a week. No commitment.
              If you want it again for pay, we'll talk then.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <PillBtn variant="white" size="lg" onClick={() => go('contact')}>
                Book your free flight →
              </PillBtn>
              <PillBtn variant="ghost" size="lg" onClick={() => go('pricing')}>
                See pricing
              </PillBtn>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Contact ───────────────────────────────────────────────────
function Contact() {
  return (
    <section id="contact" style={{ background: C.cream, padding: '90px 0' }}>
      <div style={{ ...WRAP }}>
        <div className="about-grid" style={{
          display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 60, alignItems: 'start',
        }}>
          <Reveal>
            <div>
              <Tag>Get in Touch</Tag>
              <h2 style={{
                fontFamily: F, fontWeight: 700, marginTop: 16,
                fontSize: 'clamp(32px,3.4vw,46px)',
                lineHeight: 1.05, letterSpacing: '-0.025em', color: C.text,
              }}>
                Let's talk about your property.
              </h2>
              <p style={{ fontFamily: F, fontSize: 16, lineHeight: 1.65, color: C.muted, marginTop: 18, marginBottom: 32 }}>
                Tell us what you'd like to map and we'll respond within one business day. We serve
                Paso Robles, Templeton, Adelaida, Creston, and Cambria.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                {[
                  { icon: '✦', label: 'FAA Part 107 Certified', val: 'Pilot License #4187420' },
                  { icon: '◆', label: '$1M Liability Insurance', val: 'Verus Aviation underwritten' },
                  { icon: '◉', label: 'Local to North County', val: 'Based in Paso Robles' },
                ].map(c => (
                  <div key={c.label} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                    <div style={{
                      width: 42, height: 42, borderRadius: 12, background: C.greenBg,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      color: C.green, fontSize: 16,
                    }}>{c.icon}</div>
                    <div>
                      <div style={{ fontFamily: F, fontSize: 14, fontWeight: 700, color: C.text }}>{c.label}</div>
                      <div style={{ fontFamily: F, fontSize: 13, color: C.muted, marginTop: 2 }}>{c.val}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <form onSubmit={e => e.preventDefault()} style={{
              background: C.white, borderRadius: 24, padding: 32,
              border: `1px solid ${C.border}`,
            }}>
              {[
                { id: 'name', label: 'Your name', type: 'text', placeholder: 'Sonya Patel' },
                { id: 'email', label: 'Email address', type: 'email', placeholder: 'you@example.com' },
                { id: 'property', label: 'Property type', type: 'select', placeholder: 'Choose one', opts: ['Vineyard', 'Ranch', 'Real estate listing', 'Coastal bluff', 'Other'] },
              ].map((f, i) => (
                <FormField key={f.id} {...f} />
              ))}
              <FormField id="msg" label="What would you like to map?" type="textarea" placeholder="Approximate acres, location, and what you're hoping to learn." />
              <PillBtn variant="primary" size="lg">Send message →</PillBtn>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function FormField({ id, label, type, placeholder, opts }) {
  const [focus, setFocus] = useState(false);
  const base = {
    width: '100%', padding: '14px 18px', borderRadius: 14,
    fontFamily: F, fontSize: 14, color: C.text,
    background: focus ? C.white : C.cream2,
    border: `1.5px solid ${focus ? C.green : 'transparent'}`,
    outline: 'none', transition: 'all 0.2s ease',
  };
  return (
    <div style={{ marginBottom: 16 }}>
      <label htmlFor={id} style={{
        display: 'block', fontFamily: F, fontSize: 12, fontWeight: 600,
        color: C.body, marginBottom: 8, letterSpacing: '-0.005em',
      }}>{label}</label>
      {type === 'textarea' ? (
        <textarea id={id} placeholder={placeholder}
          onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          style={{ ...base, minHeight: 100, resize: 'vertical' }} />
      ) : type === 'select' ? (
        <select id={id} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} style={base} defaultValue="">
          <option value="" disabled>{placeholder}</option>
          {opts.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input id={id} type={type} placeholder={placeholder}
          onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          style={base} />
      )}
    </div>
  );
}

// ── Footer ────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background: C.ink, color: C.white, padding: '60px 0 36px' }}>
      <div style={{ ...WRAP }}>
        <div className="footer-grid" style={{
          display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: 60, marginBottom: 48,
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="2" fill={C.green} />
                <path d="M12 10V4M12 14v6M10 12H4M14 12h6M5 5l3 3M16 16l3 3M5 19l3-3M16 8l3-3" />
              </svg>
              <span style={{ fontFamily: F, fontWeight: 700, color: C.white, fontSize: 16 }}>North SLO Aerial</span>
            </div>
            <p style={{ fontFamily: F, fontSize: 14, lineHeight: 1.65, color: 'rgba(255,255,255,0.60)', maxWidth: 320 }}>
              Precision drone mapping for the vineyards and ranches that commercial ag-tech firms
              cannot profitably service.
            </p>
          </div>
          {[
            { title: 'Services', links: ['Vineyard Mapping', 'Ranch Monitoring', 'Listing Maps', 'Coastal Bluff Docs'] },
            { title: 'Company', links: ['About', 'Coverage Area', 'Insurance', 'Contact'] },
            { title: 'Legal', links: ['FAA Part 107', 'Insurance Cert', 'Privacy', 'Terms'] },
          ].map(col => (
            <div key={col.title}>
              <div style={{ fontFamily: F, fontSize: 13, fontWeight: 700, color: C.white, marginBottom: 14, letterSpacing: '-0.005em' }}>{col.title}</div>
              {col.links.map(l => (
                <a key={l} href="#" style={{ display: 'block', fontFamily: F, fontSize: 14, color: 'rgba(255,255,255,0.60)', textDecoration: 'none', padding: '5px 0', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = C.green}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.60)'}>{l}</a>
              ))}
            </div>
          ))}
        </div>
        <div style={{
          paddingTop: 28, borderTop: '1px solid rgba(255,255,255,0.10)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16,
          fontFamily: F, fontSize: 13, color: 'rgba(255,255,255,0.45)',
        }}>
          <div>© {new Date().getFullYear()} North SLO Aerial. Paso Robles, California.</div>
          <div>FAA Part 107 · $1M Insured · Local</div>
        </div>
      </div>
    </footer>
  );
}

// ── Main ──────────────────────────────────────────────────────
export default function NorthSLOAerial() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <Nav />
      <Hero />
      <About />
      <Services />
      <StatsStrip />
      <Pricing />
      <Testimonials />
      <FAQ />
      <CTA />
      <Contact />
      <Footer />
    </>
  );
}
