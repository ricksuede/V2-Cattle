import React, { useState, useEffect, useRef } from 'react';

// ── Design tokens ─────────────────────────────────────────────
const tk = {
  dark:    '#0d1b2a',
  slate:   '#16273a',
  slateL:  '#1e3248',
  gold:    '#c4a94a',
  goldD:   '#a8902e',
  goldT:   'rgba(196,169,74,0.12)',
  sage:    '#4a7c5f',
  sageL:   '#5e9275',
  cream:   '#f8f4ed',
  parch:   '#ede7db',
  terra:   '#c4623a',
  mist:    '#7a95aa',
  body:    '#2a3545',
  muted:   '#5a6e82',
  border:  'rgba(255,255,255,0.08)',
  borderD: 'rgba(0,0,0,0.10)',
};

const sans  = "system-ui,-apple-system,'Segoe UI',Helvetica,Arial,sans-serif";
const serif = "Georgia,'Times New Roman',serif";

const wrap = { maxWidth: 1100, margin: '0 auto', padding: '0 24px' };
const wrapN = { maxWidth: 860, margin: '0 auto', padding: '0 24px' };

// ── SVG Icons ─────────────────────────────────────────────────
const Icon = ({ d, size = 22, color = 'currentColor', strokeWidth = 1.5 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    {d.map((p, i) => p.circle
      ? <circle key={i} cx={p.circle[0]} cy={p.circle[1]} r={p.circle[2]} />
      : <path key={i} d={p} />)}
  </svg>
);

const icons = {
  drone: [
    { circle: [12, 12, 2.5] },
    'M12 9.5V7M12 14.5v2.5',
    'M9.5 12H7M14.5 12h2.5',
    'M5.5 5.5l2 2M16.5 16.5l2 2M5.5 18.5l2-2M16.5 7.5l2-2',
    { circle: [4, 4, 1.5] }, { circle: [20, 4, 1.5] },
    { circle: [4, 20, 1.5] }, { circle: [20, 20, 1.5] },
  ],
  map: [
    'M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z',
    'M8 2v16M16 6v16',
  ],
  grid: [
    'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z',
  ],
  eye: [
    'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z',
    { circle: [12, 12, 3] },
  ],
  calendar: [
    'M19 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z',
    'M16 2v4M8 2v4M3 10h18',
  ],
  fence: [
    'M3 3v18M9 3v18M15 3v18M21 3v18',
    'M3 8h18M3 16h18',
  ],
  layers: [
    'M12 2L2 7l10 5 10-5-10-5z',
    'M2 17l10 5 10-5',
    'M2 12l10 5 10-5',
  ],
  wave: [
    'M2 12c1.5-3 3-4.5 4.5-4.5S9 9 10.5 9s3-1.5 4.5-1.5S18 9 19.5 9 21 7.5 22 6',
    'M2 18c1.5-3 3-4.5 4.5-4.5S9 15 10.5 15s3-1.5 4.5-1.5S18 15 19.5 15 21 13.5 22 12',
  ],
  camera: [
    'M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z',
    { circle: [12, 13, 4] },
  ],
  check: ['M20 6L9 17l-5-5'],
  arrow: ['M5 12h14M12 5l7 7-7 7'],
  menu: ['M3 12h18M3 6h18M3 18h18'],
  x: ['M18 6L6 18M6 6l12 12'],
  mail: [
    'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z',
    'M22 6l-10 7L2 6',
  ],
  cert: [
    { circle: [12, 8, 6] },
    'M15.477 12.89L17 22l-5-3-5 3 1.523-9.11',
  ],
  shield: ['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'],
  pin: [
    'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z',
    { circle: [12, 10, 3] },
  ],
};

// ── Hero Section ──────────────────────────────────────────────
function Hero() {
  return (
    <section id="home" style={{
      background: `linear-gradient(160deg, ${tk.dark} 0%, ${tk.slate} 60%, #0e2235 100%)`,
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Grid overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `linear-gradient(rgba(196,169,74,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(196,169,74,0.05) 1px, transparent 1px)`,
        backgroundSize: '52px 52px',
      }} />
      {/* Radial glow */}
      <div style={{
        position: 'absolute', top: '30%', right: '10%',
        width: 600, height: 600,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(196,169,74,0.07) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      {/* Decorative corner coords */}
      <div style={{
        position: 'absolute', top: 100, right: 32,
        fontFamily: sans, fontSize: 11, letterSpacing: 2,
        color: 'rgba(196,169,74,0.35)',
        lineHeight: 1.8,
      }}>
        35.6269° N<br/>120.6910° W<br/>PASO ROBLES, CA
      </div>
      <div style={{ ...wrap, position: 'relative', zIndex: 1, padding: '120px 24px 80px' }}>
        <div style={{ maxWidth: 700 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            background: tk.goldT,
            border: `1px solid rgba(196,169,74,0.25)`,
            borderRadius: 4,
            padding: '6px 14px',
            marginBottom: 32,
          }}>
            <Icon d={icons.drone} size={14} color={tk.gold} />
            <span style={{ fontFamily: sans, fontSize: 11, letterSpacing: 2.5, textTransform: 'uppercase', color: tk.gold }}>
              North SLO County · Part 107 Certified
            </span>
          </div>

          <h1 style={{
            fontFamily: serif, fontSize: 'clamp(48px, 7vw, 82px)',
            fontWeight: 400, lineHeight: 1.05, color: tk.cream,
            margin: '0 0 28px',
            letterSpacing: '-0.5px',
          }}>
            Eyes on<br />
            <span style={{ color: tk.gold }}>your land.</span>
          </h1>

          <p style={{
            fontFamily: sans, fontSize: 'clamp(16px, 2vw, 19px)',
            lineHeight: 1.7, color: 'rgba(248,244,237,0.72)',
            maxWidth: 580, margin: '0 0 44px',
          }}>
            Precision drone mapping for small wineries and rural properties
            in North SLO County — the operations the big ag-tech firms
            won't bother with because the acreage isn't big enough for them.
          </p>

          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <a href="#services" onClick={e => { e.preventDefault(); document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' }); }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: tk.gold, color: tk.dark,
                padding: '14px 28px', borderRadius: 6,
                fontFamily: sans, fontSize: 14, fontWeight: 700,
                letterSpacing: 0.5, textDecoration: 'none',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = tk.goldD}
              onMouseLeave={e => e.currentTarget.style.background = tk.gold}>
              View Services
              <Icon d={icons.arrow} size={16} color={tk.dark} />
            </a>
            <a href="#contact" onClick={e => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'transparent',
                border: `1.5px solid rgba(248,244,237,0.3)`,
                color: tk.cream,
                padding: '14px 28px', borderRadius: 6,
                fontFamily: sans, fontSize: 14, fontWeight: 600,
                letterSpacing: 0.5, textDecoration: 'none',
                transition: 'border-color 0.2s, background 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = tk.gold; e.currentTarget.style.background = tk.goldT; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(248,244,237,0.3)'; e.currentTarget.style.background = 'transparent'; }}>
              Get a Free Map
            </a>
          </div>

          {/* Stats strip */}
          <div style={{
            display: 'flex', gap: 40, marginTop: 72,
            flexWrap: 'wrap', borderTop: `1px solid rgba(255,255,255,0.08)`,
            paddingTop: 32,
          }}>
            {[
              ['FAA Part 107', 'Certified & insured'],
              ['15–200 acres', 'Sweet spot coverage'],
              ['7 days', 'Report turnaround'],
              ['$0', 'First portfolio flight'],
            ].map(([num, label]) => (
              <div key={num}>
                <div style={{ fontFamily: serif, fontSize: 26, color: tk.cream, fontWeight: 400 }}>{num}</div>
                <div style={{ fontFamily: sans, fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: tk.mist, marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Service data ──────────────────────────────────────────────
const SERVICES = [
  {
    id: 'vineyard',
    phase: 'Phase 1 — Launch Now',
    phaseColor: tk.gold,
    icon: icons.grid,
    title: 'Vineyard Canopy & Frost Mapping',
    tagline: 'Know your blocks before the season turns.',
    desc: 'A stitched orthomosaic (top-down aerial map) of your vineyard with frost pockets, canopy gaps, vigor variation, and dead spots clearly flagged. Delivered as a georeferenced TIFF plus a 1–2 page PDF report. No portal login, no app to learn — just the map and the findings in your inbox.',
    deliverable: 'Orthomosaic + annotated PDF report',
    pricing: [
      ['Under 20 acres', '$300'],
      ['20–50 acres', '$450'],
      ['Repeat visit, same season', '$250'],
    ],
    why: "Frost season starts before April. Harvest stress mapping runs August–September. Seasonal urgency is built in — it's the natural reason to call.",
  },
  {
    id: 'ranch',
    phase: 'Phase 2 — Month 4+',
    phaseColor: tk.sage,
    icon: icons.fence,
    title: 'Absentee Ranch Monitoring',
    tagline: 'Monthly eyes on property you can\'t visit every week.',
    desc: 'Regular flights over your rural property — fence lines, water troughs, livestock counts, outbuildings, trespasser or dumping evidence. Each visit produces a dated PDF with GPS-tagged photos delivered within 24 hours. The baseline onboarding flight includes a full-property orthomosaic and 4K perimeter video for your records.',
    deliverable: 'Monthly/weekly PDF report + GPS-tagged photos',
    pricing: [
      ['Monthly visit', '$150/mo'],
      ['Weekly visits', '$400/mo'],
      ['Onboarding flight (one-time)', '$600'],
    ],
    why: 'Designed for absentee owners in LA, the Bay Area, or the Central Valley who own 20–200 acres in Adelaida, Creston, Shandon, or San Miguel.',
  },
  {
    id: 'listing',
    phase: 'Phase 3 — Month 7+',
    phaseColor: tk.terra,
    icon: icons.layers,
    title: 'Pre-Listing Rural Property Maps',
    tagline: 'Ag and ranch listings deserve better than a cell phone photo.',
    desc: 'A complete aerial documentation package for rural listings: 4K video walkthrough (perimeter and key features), orthomosaic with annotated water sources, structures, and oak coverage, drone stills for MLS use, and an optional 3D parcel model. Built to the specs that the four to six North County ag-and-ranch agents actually want.',
    deliverable: '4K video + orthomosaic + MLS-ready stills + annotated parcel map',
    pricing: [
      ['Under 50 acres', '$750'],
      ['50–200 acres', '$1,100'],
      ['200+ acres', '$1,500+'],
    ],
    why: 'Targeted at the small group of agents who specialize in ag/ranch in North County — not the general residential herd.',
  },
  {
    id: 'bluff',
    phase: 'Phase 3 — Month 7+',
    phaseColor: tk.mist,
    icon: icons.wave,
    title: 'Coastal Bluff Erosion Documentation',
    tagline: 'Baseline data before the next storm season.',
    desc: 'Quarterly aerial documentation of bluff edge position, face erosion, drainage cuts, and structural changes. Time-stamped and GPS-accurate for insurance claims, legal disputes, or HOA maintenance planning. Annual archive subscriptions include post-storm emergency flights following Pacific storm events.',
    deliverable: 'Quarterly report + elevation profile + archived comparison imagery',
    pricing: [
      ['Individual homeowner', '$400/quarter'],
      ['HOA (5+ properties)', '$1,200/quarter'],
      ['Annual archive sub', '$1,500/yr (includes storm flights)'],
    ],
    why: 'Once one Cayucos or Cambria HOA signs, they talk. The whole block is a referral pool.',
  },
];

// ── Services Section ──────────────────────────────────────────
function ServiceCard({ svc, index }) {
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? tk.slateL : tk.slate,
        border: `1px solid ${hovered ? 'rgba(196,169,74,0.25)' : tk.border}`,
        borderRadius: 10,
        padding: '32px',
        transition: 'background 0.2s, border-color 0.2s',
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
      }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          <div style={{
            width: 44, height: 44, borderRadius: 8, flexShrink: 0,
            background: `${svc.phaseColor}18`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon d={svc.icon} size={20} color={svc.phaseColor} />
          </div>
          <div>
            <div style={{
              fontFamily: sans, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase',
              color: svc.phaseColor, marginBottom: 6,
            }}>{svc.phase}</div>
            <h3 style={{
              fontFamily: serif, fontSize: 22, fontWeight: 400,
              color: tk.cream, margin: 0, lineHeight: 1.25,
            }}>{svc.title}</h3>
          </div>
        </div>
        <span style={{
          fontFamily: sans, fontSize: 11, color: tk.mist,
          whiteSpace: 'nowrap', marginTop: 6,
        }}>0{index + 1} / 04</span>
      </div>

      <p style={{ fontFamily: sans, fontSize: 15, lineHeight: 1.65, color: 'rgba(248,244,237,0.65)', margin: 0 }}>
        {svc.tagline}
      </p>

      {/* Pricing quick-view */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {svc.pricing.map(([label, price]) => (
          <div key={label} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '8px 14px',
            background: 'rgba(0,0,0,0.2)', borderRadius: 6,
          }}>
            <span style={{ fontFamily: sans, fontSize: 13, color: 'rgba(248,244,237,0.6)' }}>{label}</span>
            <span style={{ fontFamily: sans, fontSize: 14, fontWeight: 700, color: tk.gold }}>{price}</span>
          </div>
        ))}
      </div>

      {/* Expand / collapse */}
      <button
        onClick={() => setExpanded(v => !v)}
        style={{
          background: 'none', border: 'none', cursor: 'pointer', padding: 0,
          textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8,
          fontFamily: sans, fontSize: 13, color: tk.mist, letterSpacing: 0.5,
          transition: 'color 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.color = tk.cream}
        onMouseLeave={e => e.currentTarget.style.color = tk.mist}>
        {expanded ? 'Less detail' : 'Full details'}
        <span style={{ transform: expanded ? 'rotate(90deg)' : 'rotate(0)', display: 'inline-block', transition: 'transform 0.2s' }}>›</span>
      </button>

      {expanded && (
        <div style={{
          borderTop: `1px solid ${tk.border}`,
          paddingTop: 20, display: 'flex', flexDirection: 'column', gap: 14,
          animation: 'fadeIn 0.2s ease',
        }}>
          <p style={{ fontFamily: sans, fontSize: 14, lineHeight: 1.7, color: 'rgba(248,244,237,0.70)', margin: 0 }}>
            {svc.desc}
          </p>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <Icon d={icons.check} size={15} color={svc.phaseColor} strokeWidth={2.5} />
            <span style={{ fontFamily: sans, fontSize: 13, color: 'rgba(248,244,237,0.55)' }}>
              Deliverable: {svc.deliverable}
            </span>
          </div>
          <div style={{
            background: `${svc.phaseColor}0e`, border: `1px solid ${svc.phaseColor}20`,
            borderRadius: 6, padding: '12px 14px',
          }}>
            <span style={{ fontFamily: sans, fontSize: 12, lineHeight: 1.6, color: `${svc.phaseColor}cc` }}>
              {svc.why}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function Services() {
  return (
    <section id="services" style={{ background: tk.dark, padding: '100px 0' }}>
      <div style={wrap}>
        <div style={{ marginBottom: 60 }}>
          <div style={{ fontFamily: sans, fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: tk.gold, marginBottom: 16 }}>
            Service Lines
          </div>
          <h2 style={{ fontFamily: serif, fontSize: 'clamp(34px, 4vw, 52px)', fontWeight: 400, color: tk.cream, margin: '0 0 20px', lineHeight: 1.1 }}>
            Four services.<br />One network.
          </h2>
          <p style={{ fontFamily: sans, fontSize: 16, lineHeight: 1.7, color: tk.mist, maxWidth: 600, margin: 0 }}>
            Sequenced by speed-to-first-dollar and relationship leverage — not by what the drone can do.
            Phase 1 launches first because it has the warmest leads and the highest per-job margin.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))',
          gap: 20,
        }}>
          {SERVICES.map((svc, i) => (
            <ServiceCard key={svc.id} svc={svc} index={i} />
          ))}
        </div>

        {/* Year 2 teaser */}
        <div style={{
          marginTop: 20, borderRadius: 10, padding: '28px 32px',
          background: 'rgba(255,255,255,0.03)',
          border: `1px dashed rgba(255,255,255,0.10)`,
          display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap',
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 8, flexShrink: 0,
            background: 'rgba(122,149,170,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon d={icons.camera} size={20} color={tk.mist} />
          </div>
          <div>
            <div style={{ fontFamily: sans, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: tk.mist, marginBottom: 4 }}>
              Year 2+ — Passion Play
            </div>
            <div style={{ fontFamily: serif, fontSize: 18, color: 'rgba(248,244,237,0.55)', fontWeight: 400 }}>
              Historic Site & Abandoned-Place Documentation
            </div>
          </div>
          <p style={{ fontFamily: sans, fontSize: 13, color: 'rgba(122,149,170,0.7)', lineHeight: 1.6, margin: 0, flex: 1, minWidth: 200 }}>
            Every historic-site flight is portfolio content. The YouTube, the songs, the eventual coffee-table book —
            this is the creative layer that builds inbound for the four revenue lines above. Not a day-one priority. A decade-long asset.
          </p>
        </div>
      </div>
    </section>
  );
}

// ── Why NSA Section ───────────────────────────────────────────
function Why() {
  const pillars = [
    {
      icon: icons.map,
      color: tk.gold,
      title: 'The access no one else has',
      body: 'The big ag-tech firms — Ceres Imaging, TerrAvion — need 500-plus acres to justify a flight. A 12-acre Adelaida block doesn\'t pencil for them. The wedding and real-estate drone crowd doesn\'t speak winery or ranch. That gap is the business.',
    },
    {
      icon: icons.eye,
      color: tk.sage,
      title: 'Data, not footage',
      body: 'A vineyard owner doesn\'t need a cinematic reel. They need to know which blocks are under stress before veraison, where the frost pockets formed in February, and whether the trellis damage they heard about from the neighbor is actually their problem or someone else\'s.',
    },
    {
      icon: icons.pin,
      color: tk.terra,
      title: 'North County is a relationship market',
      body: 'Paso Robles, Templeton, Adelaida — this is not a market you crack with Facebook ads. It\'s a market where you get in through warm introductions and stay in through reliable work. That\'s the moat. Cold calls don\'t get you past the gate here.',
    },
  ];

  return (
    <section id="why" style={{ background: tk.cream, padding: '100px 0' }}>
      <div style={wrap}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '60px 80px', alignItems: 'start' }}>
          <div>
            <div style={{ fontFamily: sans, fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: tk.sage, marginBottom: 16 }}>
              Positioning
            </div>
            <h2 style={{ fontFamily: serif, fontSize: 'clamp(34px, 3.5vw, 48px)', fontWeight: 400, color: tk.body, margin: '0 0 28px', lineHeight: 1.1 }}>
              Why North<br />SLO Aerial.
            </h2>
            <div style={{
              background: tk.dark, borderRadius: 8,
              padding: '24px 28px',
              borderLeft: `3px solid ${tk.gold}`,
            }}>
              <p style={{
                fontFamily: serif, fontSize: 17, fontStyle: 'italic',
                lineHeight: 1.7, color: tk.cream, margin: 0,
              }}>
                "I fly a drone for small wineries and rural property owners in North SLO County
                who need eyes on their land but can't justify a commercial ag-tech contract."
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {pillars.map(p => (
              <div key={p.title} style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 10, flexShrink: 0,
                  background: `${p.color}15`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon d={p.icon} size={22} color={p.color} />
                </div>
                <div>
                  <h3 style={{ fontFamily: sans, fontSize: 15, fontWeight: 700, color: tk.body, margin: '0 0 8px', letterSpacing: 0.2 }}>
                    {p.title}
                  </h3>
                  <p style={{ fontFamily: sans, fontSize: 15, lineHeight: 1.7, color: tk.muted, margin: 0 }}>
                    {p.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Process Section ───────────────────────────────────────────
function Process() {
  const steps = [
    {
      n: '01',
      title: 'Schedule a flight',
      body: 'Reach out by email or phone. We\'ll talk through your property, confirm the season\'s priority (frost mapping before April, canopy stress mapping before harvest), and schedule a site visit. First-time clients in the portfolio period fly for free.',
    },
    {
      n: '02',
      title: 'One to two hours on-site',
      body: 'A single visit covers most vineyards under 50 acres and most ranch monitoring flights. We do the preflight plan, fly the mission, and confirm data quality before leaving the property. You don\'t need to be there, though you\'re welcome to be.',
    },
    {
      n: '03',
      title: 'Report in your inbox within 7 days',
      body: 'You receive a georeferenced map file plus a clear PDF report — no portals, no dashboards, no subscriptions to manage. Findings are written in plain language. Frost pockets, canopy gaps, fence damage, structural concerns — flagged directly, without jargon.',
    },
  ];

  return (
    <section id="process" style={{ background: tk.slate, padding: '100px 0' }}>
      <div style={wrap}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div style={{ fontFamily: sans, fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: tk.gold, marginBottom: 16 }}>
            How It Works
          </div>
          <h2 style={{ fontFamily: serif, fontSize: 'clamp(32px, 3.5vw, 48px)', fontWeight: 400, color: tk.cream, margin: '0 0 18px', lineHeight: 1.1 }}>
            Simple by design.
          </h2>
          <p style={{ fontFamily: sans, fontSize: 16, color: tk.mist, maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
            No app to download, no portal to log into, no account to manage. A flight, a report, and a relationship.
          </p>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 2,
          borderRadius: 12,
          overflow: 'hidden',
        }}>
          {steps.map((s, i) => (
            <div key={s.n} style={{
              background: tk.slateL,
              padding: '44px 36px',
              position: 'relative',
            }}>
              <div style={{
                fontFamily: serif, fontSize: 64, fontWeight: 400,
                color: 'rgba(196,169,74,0.15)',
                lineHeight: 1, marginBottom: 24,
                letterSpacing: -2,
              }}>{s.n}</div>
              <h3 style={{ fontFamily: sans, fontSize: 17, fontWeight: 700, color: tk.cream, margin: '0 0 14px', letterSpacing: 0.2 }}>
                {s.title}
              </h3>
              <p style={{ fontFamily: sans, fontSize: 14, lineHeight: 1.75, color: 'rgba(248,244,237,0.58)', margin: 0 }}>
                {s.body}
              </p>
              {i < steps.length - 1 && (
                <div style={{
                  position: 'absolute', top: '50%', right: -12,
                  width: 24, height: 2,
                  background: 'rgba(196,169,74,0.3)',
                  display: 'none', // hide on mobile; on wider screens this would show
                }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Pricing Section ───────────────────────────────────────────
function Pricing() {
  return (
    <section id="pricing" style={{ background: tk.parch, padding: '100px 0' }}>
      <div style={wrap}>
        <div style={{ marginBottom: 60 }}>
          <div style={{ fontFamily: sans, fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: tk.terra, marginBottom: 16 }}>
            Pricing
          </div>
          <h2 style={{ fontFamily: serif, fontSize: 'clamp(32px, 3.5vw, 48px)', fontWeight: 400, color: tk.body, margin: '0 0 18px', lineHeight: 1.1 }}>
            No hidden fees.<br />No surprise invoices.
          </h2>
          <p style={{ fontFamily: sans, fontSize: 16, lineHeight: 1.7, color: tk.muted, maxWidth: 560, margin: 0 }}>
            Pricing is published because it builds trust and saves everyone a negotiation that neither party enjoys.
            All rates are for North SLO County. Complex terrain and coastal work may carry a surcharge.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
          {[
            {
              label: 'Vineyard Mapping',
              color: tk.gold,
              rows: [
                ['Under 20 acres', '$300'],
                ['20–50 acres', '$450'],
                ['Repeat visit (same season)', '$250'],
                ['Deliverable', 'Orthomosaic + PDF report'],
                ['Turnaround', '7 days'],
              ],
            },
            {
              label: 'Ranch Monitoring',
              color: tk.sage,
              rows: [
                ['Onboarding flight', '$600 one-time'],
                ['Monthly visits', '$150 / month'],
                ['Weekly visits', '$400 / month'],
                ['Deliverable', 'PDF report + GPS photos'],
                ['Turnaround', 'Within 24 hours'],
              ],
            },
            {
              label: 'Pre-Listing Maps',
              color: tk.terra,
              rows: [
                ['Under 50 acres', '$750'],
                ['50–200 acres', '$1,100'],
                ['200+ acres', '$1,500+'],
                ['Deliverable', '4K video + ortho + MLS stills'],
                ['Turnaround', '7–10 days'],
              ],
            },
            {
              label: 'Bluff Erosion Doc',
              color: tk.mist,
              rows: [
                ['Individual homeowner', '$400 / quarter'],
                ['HOA (5+ properties)', '$1,200 / quarter'],
                ['Annual archive sub', '$1,500 / year'],
                ['Includes', 'Storm-event flights'],
                ['Deliverable', 'Quarterly report + archive'],
              ],
            },
          ].map(({ label, color, rows }) => (
            <div key={label} style={{
              background: '#fff',
              borderRadius: 10,
              overflow: 'hidden',
              boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
            }}>
              <div style={{
                background: tk.dark,
                padding: '18px 24px',
                borderBottom: `3px solid ${color}`,
              }}>
                <span style={{ fontFamily: sans, fontSize: 13, fontWeight: 700, letterSpacing: 0.5, color: tk.cream }}>
                  {label}
                </span>
              </div>
              <div style={{ padding: '8px 0' }}>
                {rows.map(([k, v]) => (
                  <div key={k} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '11px 24px',
                    borderBottom: `1px solid ${tk.parch}`,
                  }}>
                    <span style={{ fontFamily: sans, fontSize: 12, color: tk.muted }}>{k}</span>
                    <span style={{ fontFamily: sans, fontSize: 13, fontWeight: 600, color: tk.body, textAlign: 'right', maxWidth: '55%' }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: 40,
          background: tk.dark, borderRadius: 10, padding: '28px 36px',
          display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap',
        }}>
          <Icon d={icons.eye} size={28} color={tk.gold} />
          <div>
            <div style={{ fontFamily: sans, fontSize: 14, fontWeight: 700, color: tk.cream, marginBottom: 4 }}>
              First map is free.
            </div>
            <div style={{ fontFamily: sans, fontSize: 14, color: 'rgba(248,244,237,0.6)', lineHeight: 1.6 }}>
              While we build the portfolio, the first vineyard or ranch flight is complimentary for introductions through the Riley network.
              Job #4 onward charges at the rates above. There is no catch and no upsell buried in the free visit.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Trust / Credentials Section ───────────────────────────────
function Trust() {
  const creds = [
    {
      icon: icons.cert,
      color: tk.gold,
      title: 'FAA Part 107 Certified',
      body: 'The commercial UAS certificate required by federal law for any compensated drone operation. Renewed every 24 months.',
    },
    {
      icon: icons.shield,
      color: tk.sage,
      title: '$1M Liability Coverage',
      body: 'Annual hull and liability policy through a drone-specialist carrier. Certificate of insurance available on request before any flight.',
    },
    {
      icon: icons.drone,
      color: tk.mist,
      title: 'DJI Mini 4 Pro',
      body: '4K/60fps video, 48MP stills, obstacle avoidance, 3-axis gimbal stabilization. The right tool for vineyards under 200 acres.',
    },
    {
      icon: icons.map,
      color: tk.terra,
      title: 'Local knowledge',
      body: 'Paso Robles, Templeton, Adelaida, Creston, Shandon, San Miguel, Cambria, Cayucos. Know the roads, the landowners, the growing seasons.',
    },
  ];

  return (
    <section style={{ background: tk.dark, padding: '80px 0' }}>
      <div style={wrap}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 1,
          borderRadius: 10,
          overflow: 'hidden',
          border: `1px solid ${tk.border}`,
        }}>
          {creds.map((c, i) => (
            <div key={c.title} style={{
              background: i % 2 === 0 ? tk.slate : tk.slateL,
              padding: '36px 28px',
              borderRight: i < creds.length - 1 ? `1px solid ${tk.border}` : 'none',
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: 10, marginBottom: 20,
                background: `${c.color}18`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon d={c.icon} size={22} color={c.color} />
              </div>
              <h3 style={{ fontFamily: sans, fontSize: 14, fontWeight: 700, color: tk.cream, margin: '0 0 10px', letterSpacing: 0.3 }}>
                {c.title}
              </h3>
              <p style={{ fontFamily: sans, fontSize: 13, lineHeight: 1.7, color: 'rgba(248,244,237,0.5)', margin: 0 }}>
                {c.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Coverage Section ──────────────────────────────────────────
function Coverage() {
  const zones = [
    { zone: 'Wine Country Core', places: ['Paso Robles', 'Templeton', 'Adelaida District', 'Willow Creek District', 'York Mountain'] },
    { zone: 'East Paso & Range', places: ['Creston', 'Shandon', 'San Miguel', 'Cholame Valley', 'Cypress Mountain Rd corridor'] },
    { zone: 'Coastal', places: ['Cambria', 'Cayucos', 'Morro Bay vicinity', 'Highway 1 corridor'] },
    { zone: 'South County', places: ['Atascadero', 'Santa Margarita', 'Pozo Valley'] },
  ];

  return (
    <section id="coverage" style={{ background: tk.cream, padding: '100px 0' }}>
      <div style={wrap}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px 80px', alignItems: 'start' }}>
          <div>
            <div style={{ fontFamily: sans, fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: tk.sage, marginBottom: 16 }}>
              Coverage Area
            </div>
            <h2 style={{ fontFamily: serif, fontSize: 'clamp(32px, 3.5vw, 48px)', fontWeight: 400, color: tk.body, margin: '0 0 24px', lineHeight: 1.1 }}>
              North SLO County.<br />
              All of it.
            </h2>
            <p style={{ fontFamily: sans, fontSize: 15, lineHeight: 1.75, color: tk.muted, margin: '0 0 24px' }}>
              From the Adelaida ridgeline to the coastal bluffs at Cambria, from San Miguel in the north to the oak savanna of Santa Margarita in the south.
              This is the territory. Flying it requires knowing which properties are off which roads, which gates have which locks,
              and who to call when something looks wrong. That local knowledge is part of the product.
            </p>
            <p style={{ fontFamily: sans, fontSize: 15, lineHeight: 1.75, color: tk.muted, margin: 0 }}>
              Properties outside this territory can be quoted on request.
              Travel days to Monterey County or Santa Barbara County carry a mileage surcharge.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {zones.map(z => (
              <div key={z.zone} style={{
                background: '#fff', borderRadius: 8,
                padding: '20px 24px',
                boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
              }}>
                <div style={{ fontFamily: sans, fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: tk.terra, marginBottom: 10 }}>
                  {z.zone}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {z.places.map(p => (
                    <span key={p} style={{
                      fontFamily: sans, fontSize: 12,
                      background: tk.parch, borderRadius: 4,
                      padding: '4px 10px', color: tk.muted,
                    }}>{p}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Year-One Projection Section ───────────────────────────────
function Projection() {
  const rows = [
    ['Vineyard mapping — single visit', '8 clients × $350', '$2,800'],
    ['Vineyard mapping — repeat visit', '3 clients × $250', '$750'],
    ['Ranch monitoring — monthly contracts', '2 × $150/mo × 12', '$3,600'],
    ['Ranch monitoring — onboarding flights', '2 × $600', '$1,200'],
    ['Pre-listing property maps', '2 × $1,000', '$2,000'],
  ];

  return (
    <section style={{ background: tk.slate, padding: '100px 0' }}>
      <div style={wrapN}>
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <div style={{ fontFamily: sans, fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: tk.gold, marginBottom: 16 }}>
            Year One Projection
          </div>
          <h2 style={{ fontFamily: serif, fontSize: 'clamp(30px, 3.5vw, 44px)', fontWeight: 400, color: tk.cream, margin: '0 0 18px', lineHeight: 1.1 }}>
            Conservative. Built on warm intros, not cold leads.
          </h2>
          <p style={{ fontFamily: sans, fontSize: 15, color: tk.mist, maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
            This is the model if nothing goes wrong and nothing goes spectacularly right.
            No paid advertising. No cold outreach. Just the relationship network doing what relationship networks do.
          </p>
        </div>

        <div style={{ background: tk.slateL, borderRadius: 10, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: tk.dark }}>
                {['Service Line', 'Basis', 'Annual'].map(h => (
                  <th key={h} style={{
                    fontFamily: sans, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase',
                    color: tk.mist, padding: '14px 24px', textAlign: 'left',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(([service, basis, total], i) => (
                <tr key={service} style={{ borderBottom: `1px solid ${tk.border}` }}>
                  <td style={{ fontFamily: sans, fontSize: 13, color: tk.cream, padding: '14px 24px' }}>{service}</td>
                  <td style={{ fontFamily: sans, fontSize: 12, color: tk.mist, padding: '14px 24px' }}>{basis}</td>
                  <td style={{ fontFamily: sans, fontSize: 14, fontWeight: 700, color: tk.gold, padding: '14px 24px' }}>{total}</td>
                </tr>
              ))}
              <tr style={{ background: 'rgba(196,169,74,0.08)' }}>
                <td colSpan={2} style={{ fontFamily: sans, fontSize: 13, fontWeight: 700, color: tk.cream, padding: '18px 24px', letterSpacing: 0.5 }}>
                  Year-one gross (conservative)
                </td>
                <td style={{ fontFamily: serif, fontSize: 22, fontWeight: 400, color: tk.gold, padding: '18px 24px' }}>
                  ~$10,350
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 20 }}>
          <div style={{ background: tk.slateL, borderRadius: 8, padding: '24px 28px', borderLeft: `3px solid ${tk.sage}` }}>
            <div style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, color: tk.cream, marginBottom: 8 }}>Year-one net</div>
            <div style={{ fontFamily: serif, fontSize: 26, color: tk.sage }}>$6,500–$8,500</div>
            <div style={{ fontFamily: sans, fontSize: 12, color: tk.mist, marginTop: 6, lineHeight: 1.5 }}>
              After $1,000–$2,000 setup costs and $800 CA franchise tax (if applicable).
            </div>
          </div>
          <div style={{ background: tk.slateL, borderRadius: 8, padding: '24px 28px', borderLeft: `3px solid ${tk.gold}` }}>
            <div style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, color: tk.cream, marginBottom: 8 }}>Year-two target</div>
            <div style={{ fontFamily: serif, fontSize: 26, color: tk.gold }}>$25,000–$40,000</div>
            <div style={{ fontFamily: sans, fontSize: 12, color: tk.mist, marginTop: 6, lineHeight: 1.5 }}>
              Ranch monitoring book grows to 8–12 contracts. Vineyard work compounds as repeat clients.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Contact Section ───────────────────────────────────────────
function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`North SLO Aerial inquiry from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    window.location.href = `mailto:hello@northsloaerial.com?subject=${subject}&body=${body}`;
    setSent(true);
  };

  const inp = {
    width: '100%', boxSizing: 'border-box',
    background: tk.slateL,
    border: `1px solid rgba(255,255,255,0.1)`,
    borderRadius: 6, padding: '12px 16px',
    fontFamily: sans, fontSize: 15, color: tk.cream,
    outline: 'none', transition: 'border-color 0.2s',
  };

  return (
    <section id="contact" style={{ background: tk.dark, padding: '100px 0' }}>
      <div style={wrapN}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px 80px', alignItems: 'start' }}>
          <div>
            <div style={{ fontFamily: sans, fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: tk.gold, marginBottom: 16 }}>
              Get In Touch
            </div>
            <h2 style={{ fontFamily: serif, fontSize: 'clamp(32px, 3.5vw, 48px)', fontWeight: 400, color: tk.cream, margin: '0 0 24px', lineHeight: 1.1 }}>
              Start with<br />a free map.
            </h2>
            <p style={{ fontFamily: sans, fontSize: 15, lineHeight: 1.75, color: tk.mist, margin: '0 0 36px' }}>
              While the portfolio is being built, the first vineyard or ranch flight is complimentary.
              It takes about an hour on your property. You get the map and the report back within a week.
              If you like it, we talk about doing it again for pay. That's the whole pitch.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {[
                ['North SLO County, California'],
                ['FAA Part 107 · Insured · Local'],
                ['Paso Robles · Templeton · Adelaida · Creston · Cambria'],
              ].map(([txt]) => (
                <div key={txt} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: tk.gold, flexShrink: 0 }} />
                  <span style={{ fontFamily: sans, fontSize: 13, color: tk.mist }}>{txt}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            {sent ? (
              <div style={{
                background: tk.slateL, borderRadius: 10,
                padding: '40px 36px', textAlign: 'center',
                border: `1px solid rgba(196,169,74,0.2)`,
              }}>
                <Icon d={icons.check} size={40} color={tk.gold} strokeWidth={2} />
                <div style={{ fontFamily: serif, fontSize: 24, color: tk.cream, margin: '20px 0 12px' }}>
                  Your email app is open.
                </div>
                <p style={{ fontFamily: sans, fontSize: 14, color: tk.mist, lineHeight: 1.7, margin: 0 }}>
                  Send the message when you're ready. We'll follow up within 48 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontFamily: sans, fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: tk.mist, marginBottom: 8 }}>Name</label>
                  <input value={name} onChange={e => setName(e.target.value)} required placeholder="Your name"
                    style={inp}
                    onFocus={e => e.target.style.borderColor = 'rgba(196,169,74,0.5)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                </div>
                <div>
                  <label style={{ display: 'block', fontFamily: sans, fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: tk.mist, marginBottom: 8 }}>Email</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="your@email.com"
                    style={inp}
                    onFocus={e => e.target.style.borderColor = 'rgba(196,169,74,0.5)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                </div>
                <div>
                  <label style={{ display: 'block', fontFamily: sans, fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: tk.mist, marginBottom: 8 }}>What can we map?</label>
                  <textarea value={message} onChange={e => setMessage(e.target.value)} required rows={5}
                    placeholder="Tell us about your property — approximate acreage, location, what you're hoping to learn."
                    style={{ ...inp, resize: 'vertical', lineHeight: 1.6 }}
                    onFocus={e => e.target.style.borderColor = 'rgba(196,169,74,0.5)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                </div>
                <button type="submit" style={{
                  background: tk.gold, color: tk.dark,
                  border: 'none', borderRadius: 6, padding: '14px 28px',
                  fontFamily: sans, fontSize: 14, fontWeight: 700,
                  letterSpacing: 0.5, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  transition: 'background 0.2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = tk.goldD}
                  onMouseLeave={e => e.currentTarget.style.background = tk.gold}>
                  <Icon d={icons.mail} size={16} color={tk.dark} />
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Nav ───────────────────────────────────────────────────────
function Nav({ scrolled }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = ['Services', 'Why', 'Process', 'Pricing', 'Coverage', 'Contact'];

  const scrollTo = (id) => {
    setMenuOpen(false);
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? `${tk.dark}f0` : 'transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: scrolled ? `1px solid ${tk.border}` : 'none',
      transition: 'all 0.3s ease',
      padding: '0 24px',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div style={{
            width: 32, height: 32, borderRadius: 6,
            background: tk.goldT, border: `1px solid rgba(196,169,74,0.25)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon d={icons.drone} size={16} color={tk.gold} />
          </div>
          <span style={{ fontFamily: serif, fontSize: 15, color: tk.cream, letterSpacing: 0.5, fontWeight: 400 }}>
            North SLO Aerial
          </span>
        </div>

        {/* Desktop links */}
        <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
          {links.map(l => (
            <button key={l} onClick={() => scrollTo(l)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: sans, fontSize: 13, color: 'rgba(248,244,237,0.65)',
                letterSpacing: 0.5, padding: 0, transition: 'color 0.2s',
                display: window.innerWidth < 768 ? 'none' : 'block',
              }}
              onMouseEnter={e => e.currentTarget.style.color = tk.cream}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(248,244,237,0.65)'}>
              {l}
            </button>
          ))}
          <button onClick={() => scrollTo('Contact')}
            style={{
              background: tk.gold, color: tk.dark,
              border: 'none', borderRadius: 5, padding: '8px 18px',
              fontFamily: sans, fontSize: 12, fontWeight: 700, letterSpacing: 0.5,
              cursor: 'pointer', whiteSpace: 'nowrap',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = tk.goldD}
            onMouseLeave={e => e.currentTarget.style.background = tk.gold}>
            Get a Free Map
          </button>
        </div>
      </div>
    </nav>
  );
}

// ── Footer ────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background: '#080f17', padding: '48px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 5,
            background: tk.goldT, border: `1px solid rgba(196,169,74,0.2)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon d={icons.drone} size={14} color={tk.gold} />
          </div>
          <span style={{ fontFamily: serif, fontSize: 14, color: 'rgba(248,244,237,0.5)' }}>North SLO Aerial</span>
        </div>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center' }}>
          {['FAA Part 107 Certified', '$1M Liability Insurance', 'North SLO County, California'].map(t => (
            <span key={t} style={{ fontFamily: sans, fontSize: 11, letterSpacing: 1, color: 'rgba(248,244,237,0.3)', textTransform: 'uppercase' }}>{t}</span>
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
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div style={{ fontFamily: sans, color: tk.body, overflowX: 'hidden' }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: ${tk.dark}; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        @media (max-width: 700px) {
          .two-col { grid-template-columns: 1fr !important; }
          .service-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <Nav scrolled={scrolled} />
      <Hero />
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
