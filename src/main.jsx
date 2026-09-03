import React, { useState } from "react";

// ── Data ─────────────────────────────────────────────────────
const INITIAL_CATTLE = [
  { id: "ishi", tag: "#Ishii", dob: "2024-06-27", sex: "Heifer", generation: "F2", bloodline: "75% Wagyu / 25% Angus", awaReg: "", sire: "Musashi", dam: "Otsu #209", grandSire: "", grandDam: "", weights: [], vaccinations: [{ date: "2024-10-30", product: "First Round Vaccines", mfg: "" }, { date: "2024-12-03", product: "Second Round Vaccines", mfg: "" }], brandCert: "", notes: "4 months old on 10/27/2024. Weaning started 12/18/2024." },
  { id: "taki", tag: "#Taki", dob: "2025-06-21", sex: "Steer", generation: "F2", bloodline: "75% Wagyu / 25% Angus", awaReg: "", sire: "Musashi", dam: "Otsu #209", grandSire: "", grandDam: "", weights: [], vaccinations: [{ date: "2025-07-08", product: "Tetanus Shot", mfg: "" }, { date: "2025-07-24", product: "Tetanus Booster", mfg: "" }], brandCert: "", notes: "Banded 7/11/2025. Vaccines due November 2025. Weaning & 2nd round shots mid-December 2025. Fully weaned end of January 2026." },
  { id: "203", tag: "Musashi #203", dob: "2022-03-08", sex: "Bull", generation: "F2", bloodline: "75% Wagyu / 25% Angus", awaReg: "Unknown", sire: "BarR Shigeshigetani 9B (AWA FB22453)", dam: "NR#16 (F1 Wagyu-Angus Cross Heifer)", grandSire: "BarR Full Blood Wagyu Bull", grandDam: "Commercial Angus Cow", weights: [{ date: "2022-09-22", weight: 492, event: "Weaning" }, { date: "2022-10-07", weight: 524, event: "Booster/Inspection" }], vaccinations: [{ date: "2022-09-22", product: "ViraShield 6+L5 (VS6)", mfg: "Elanco" }, { date: "2022-09-22", product: "Ultrabac 8 (UB8)", mfg: "Zoetis" }, { date: "2022-09-22", product: "Cydectin Pour On (CDTN)", mfg: "Bayer HealthCare" }, { date: "2022-10-07", product: "ViraShield 6+L5 (VS6)", mfg: "Elanco" }, { date: "2022-10-07", product: "Ultrabac 8 (UB8)", mfg: "Zoetis" }], brandCert: "204-IS-01970", notes: "Musashi. Original bull. Sire of Ishii and Taki." },
  { id: "209", tag: "Otsu #209", dob: "2022-03-22", sex: "Cow", generation: "F2", bloodline: "75% Wagyu / 25% Angus", awaReg: "Unknown", sire: "BarR F77 (AWA FB37719)", dam: "NR#49 (F1)", grandSire: "BarR Full Blood Wagyu Bull", grandDam: "Commercial Angus Cow", weights: [{ date: "2022-09-22", weight: 451, event: "Weaning" }, { date: "2022-10-07", weight: 487, event: "Booster/Inspection" }], vaccinations: [{ date: "2022-09-22", product: "ViraShield 6+L5 (VS6)", mfg: "Elanco" }, { date: "2022-09-22", product: "Ultrabac 8 (UB8)", mfg: "Zoetis" }, { date: "2022-09-22", product: "Cydectin Pour On (CDTN)", mfg: "Bayer HealthCare" }, { date: "2022-10-07", product: "ViraShield 6+L5 (VS6)", mfg: "Elanco" }, { date: "2022-10-07", product: "Ultrabac 8 (UB8)", mfg: "Zoetis" }], brandCert: "204-IS-01970", notes: "Otsu. Original cow. Conceived 9/1/2024. Preg check ~10/30/2024 (confirmed 2 months pregnant). Due date 6/14/2025. Dam of Ishii and Taki." },
];

const EMPTY_ANIMAL = { tag: "", dob: "", sex: "Heifer", generation: "F1", bloodline: "", awaReg: "", sire: "", dam: "", grandSire: "", grandDam: "", weights: [], vaccinations: [], brandCert: "", notes: "" };
const EMPTY_WEIGHT = { date: "", weight: "", event: "" };
const EMPTY_VAX = { date: "", product: "", mfg: "" };

// ── Theme ─────────────────────────────────────────────────────
const T = {
  bg: "#0f0d0a",
  surface: "#1a1612",
  card: "#221e18",
  border: "#3d3428",
  gold: "#c9a84c",
  goldLight: "#e8c97a",
  cream: "#f0e8d8",
  muted: "#8a7a62",
  male: "#b84a2a",
  female: "#5a8a6a",
  danger: "#a83228",
  green: "#3d7a52",
};

const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@300;400;500;600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${T.bg}; color: ${T.cream}; font-family: 'Inter', sans-serif; }
  ::-webkit-scrollbar { width: 6px; } 
  ::-webkit-scrollbar-track { background: ${T.surface}; }
  ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 3px; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  .fade-in { animation: fadeIn 0.3s ease forwards; }
  @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
  @media print {
    .no-print { display: none !important; }
    body { background: white !important; color: black !important; }
  }
`;

// ── Helpers ───────────────────────────────────────────────────
const isMale = (sex) => sex === "Bull" || sex === "Steer";
const sexColor = (sex) => isMale(sex) ? T.male : T.female;
const sexIcon = (sex) => isMale(sex) ? "♂" : "♀";

const formatDate = (d) => {
  if (!d) return "—";
  const p = d.split("-");
  return p.length === 3 ? `${p[1]}/${p[2]}/${p[0]}` : d;
};

const ageStr = (dob) => {
  if (!dob) return "—";
  const now = new Date(), birth = new Date(dob);
  const m = (now.getFullYear() - birth.getFullYear()) * 12 + now.getMonth() - birth.getMonth();
  return m < 24 ? `${m} mo` : `${Math.floor(m / 12)} yr ${m % 12} mo`;
};

const latestWeight = (a) => {
  if (!a.weights.length) return "—";
  return [...a.weights].sort((x, y) => new Date(y.date) - new Date(x.date))[0].weight + " lbs";
};

// ── UI Primitives ─────────────────────────────────────────────
const Btn = ({ onClick, children, variant = "gold", small = false, disabled = false }) => {
  const variants = {
    gold: { background: `linear-gradient(135deg, ${T.gold}, ${T.goldLight})`, color: T.bg, border: "none" },
    ghost: { background: "transparent", color: T.gold, border: `1px solid ${T.border}` },
    danger: { background: T.danger, color: T.cream, border: "none" },
    dark: { background: T.card, color: T.cream, border: `1px solid ${T.border}` },
    green: { background: T.green, color: T.cream, border: "none" },
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{
      ...variants[variant], borderRadius: 8, cursor: disabled ? "not-allowed" : "pointer",
      padding: small ? "6px 14px" : "10px 20px", fontSize: small ? 12 : 13,
      fontFamily: "'Inter', sans-serif", fontWeight: 600, letterSpacing: 0.5,
      whiteSpace: "nowrap", opacity: disabled ? 0.5 : 1, transition: "all 0.2s",
    }}>{children}</button>
  );
};

const Label = ({ children }) => (
  <div style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: T.gold, marginBottom: 6, fontWeight: 600 }}>{children}</div>
);

const Input = ({ label, value, onChange, type = "text", placeholder }) => (
  <div>
    <Label>{label}</Label>
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder || ""}
      style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.surface, color: T.cream, fontSize: 13, fontFamily: "'Inter', sans-serif", outline: "none" }} />
  </div>
);

const Divider = ({ title, action }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${T.border}`, paddingBottom: 10, marginBottom: 16, marginTop: 8 }}>
    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: T.gold }}>{title}</div>
    {action}
  </div>
);

const Field = ({ label, value }) => (
  <div style={{ marginBottom: 4 }}>
    <div style={{ fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: T.muted, marginBottom: 3 }}>{label}</div>
    <div style={{ fontSize: 13, color: T.cream, fontWeight: 400 }}>{value || "—"}</div>
  </div>
);

// ── Header ────────────────────────────────────────────────────
const Header = ({ actions, subtitle }) => (
  <div style={{ background: T.surface, borderBottom: `1px solid ${T.border}`, padding: "0 20px" }}>
    <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: `linear-gradient(135deg, ${T.gold}, ${T.goldLight})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🐄</div>
        <div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: T.cream, letterSpacing: 0.5 }}>V2 Ranch</div>
          {subtitle && <div style={{ fontSize: 10, color: T.muted, letterSpacing: 2, textTransform: "uppercase" }}>{subtitle}</div>}
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>{actions}</div>
    </div>
  </div>
);

// ── Password Gate ─────────────────────────────────────────────
function PasswordGate({ onUnlock }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const attempt = () => {
    if (input === "Vaquera") { onUnlock(); }
    else { setError(true); setShake(true); setInput(""); setTimeout(() => { setError(false); setShake(false); }, 2000); }
  };
  return (
    <div style={{ minHeight: "100vh", background: T.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', sans-serif", position: "relative", overflow: "hidden" }}>
      <style>{GLOBAL_STYLES}</style>
      {/* Background texture */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(ellipse at 30% 20%, rgba(201,168,76,0.06) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(201,168,76,0.04) 0%, transparent 60%)`, pointerEvents: "none" }} />
      
      <div className="fade-in" style={{ textAlign: "center", marginBottom: 40 }}>
        <div style={{ fontSize: 56, marginBottom: 16, filter: "drop-shadow(0 4px 12px rgba(201,168,76,0.3))" }}>🐄</div>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 700, color: T.cream, letterSpacing: 1, marginBottom: 6 }}>V2 Ranch</div>
        <div style={{ fontSize: 11, letterSpacing: 4, color: T.gold, textTransform: "uppercase" }}>Cattle Records</div>
      </div>

      <div className="fade-in" style={{ background: T.surface, borderRadius: 16, padding: "36px 40px", width: 320, border: `1px solid ${T.border}`, boxShadow: `0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(201,168,76,0.1)`, animation: shake ? "none" : undefined, transform: shake ? "translateX(0)" : undefined }}>
        <Label>Password</Label>
        <input type="password" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && attempt()} autoFocus
          style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: `1px solid ${error ? T.danger : T.border}`, background: T.bg, color: T.cream, fontSize: 16, fontFamily: "'Inter', sans-serif", outline: "none", marginBottom: error ? 8 : 16, transition: "border-color 0.2s" }} />
        {error && <div style={{ color: "#e06060", fontSize: 12, marginBottom: 14, textAlign: "center" }}>Incorrect password</div>}
        <button onClick={attempt} style={{ width: "100%", padding: "13px", background: `linear-gradient(135deg, ${T.gold}, ${T.goldLight})`, color: T.bg, border: "none", borderRadius: 10, fontSize: 14, fontFamily: "'Inter', sans-serif", fontWeight: 700, cursor: "pointer", letterSpacing: 1 }}>
          ENTER
        </button>
      </div>

      <div style={{ marginTop: 32, fontSize: 11, color: T.muted, letterSpacing: 1 }}>© V2 Ranch — Private Records</div>
    </div>
  );
}

// ── Animal Card ───────────────────────────────────────────────
function AnimalCard({ a, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      className="fade-in"
      style={{ background: hovered ? "#2a2318" : T.card, border: `1px solid ${hovered ? T.gold + "60" : T.border}`, borderRadius: 14, padding: "18px 20px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all 0.2s", boxShadow: hovered ? `0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px ${T.gold}30` : "0 2px 8px rgba(0,0,0,0.3)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 52, height: 52, borderRadius: 12, background: `linear-gradient(135deg, ${sexColor(a.sex)}40, ${sexColor(a.sex)}20)`, border: `1.5px solid ${sexColor(a.sex)}60`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
          <span style={{ color: sexColor(a.sex) }}>{sexIcon(a.sex)}</span>
        </div>
        <div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 20, color: T.cream, marginBottom: 4 }}>{a.tag}</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, color: T.gold, background: T.gold + "15", border: `1px solid ${T.gold}30`, borderRadius: 4, padding: "2px 8px" }}>{a.generation}</span>
            <span style={{ fontSize: 11, color: T.muted }}>{a.bloodline || "—"}</span>
            <span style={{ fontSize: 11, color: T.muted }}>DOB {formatDate(a.dob)}</span>
          </div>
        </div>
      </div>
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 18, color: T.gold }}>{latestWeight(a)}</div>
        <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>{ageStr(a.dob)}</div>
      </div>
    </div>
  );
}

// ── Print Preview ─────────────────────────────────────────────
function PrintPreview({ cattle, onClose }) {
  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: "'Inter', sans-serif", color: "#1a1a1a" }}>
      <style>{GLOBAL_STYLES + `@media print { body { background: white !important; } }`}</style>
      <div className="no-print" style={{ background: T.surface, padding: "14px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${T.border}` }}>
        <div style={{ fontFamily: "'Playfair Display', serif", color: T.cream, fontWeight: 700, fontSize: 18 }}>🐄 Print Preview</div>
        <div style={{ display: "flex", gap: 10 }}>
          <Btn onClick={() => window.print()} variant="gold">🖨 Print</Btn>
          <Btn onClick={onClose} variant="ghost">← Back</Btn>
        </div>
      </div>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 32px" }}>
        <div style={{ textAlign: "center", borderBottom: "3px solid #1a1a1a", paddingBottom: 20, marginBottom: 32 }}>
          <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: 1, fontFamily: "serif" }}>V2 Ranch</div>
          <div style={{ fontSize: 12, color: "#666", letterSpacing: 3, textTransform: "uppercase", marginTop: 4 }}>Cattle Records — {new Date().toLocaleDateString()}</div>
        </div>
        <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 3, textTransform: "uppercase", borderBottom: "2px solid #1a1a1a", paddingBottom: 8, marginBottom: 16 }}>Herd Summary</div>
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 40, fontSize: 12 }}>
          <thead>
            <tr style={{ background: "#1a1a1a", color: "#fff" }}>
              {["Tag", "DOB", "Age", "Sex", "Gen", "Bloodline", "Sire", "Dam", "Latest Wt", "Brand Cert"].map(h => (
                <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontSize: 10, letterSpacing: 1.5, fontWeight: 700 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cattle.map((a, i) => (
              <tr key={a.id} style={{ background: i % 2 === 0 ? "#fff" : "#f7f5f0" }}>
                {[a.tag, formatDate(a.dob), ageStr(a.dob), a.sex, a.generation, a.bloodline, a.sire || "—", a.dam || "—", latestWeight(a), a.brandCert || "—"].map((v, j) => (
                  <td key={j} style={{ padding: "8px 12px", borderBottom: "1px solid #e0d8cc", fontSize: 11 }}>{v}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {cattle.map(a => (
          <div key={a.id} style={{ marginBottom: 40, pageBreakInside: "avoid", borderLeft: "4px solid #1a1a1a", paddingLeft: 20 }}>
            <div style={{ fontSize: 18, fontWeight: 800, fontFamily: "serif", marginBottom: 12 }}>{a.tag} <span style={{ color: "#666", fontSize: 13, fontFamily: "sans-serif", fontWeight: 400 }}>{a.sex} · {a.generation} · {a.bloodline}</span></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px 24px", marginBottom: 16 }}>
              {[["DOB", formatDate(a.dob)], ["Age", ageStr(a.dob)], ["Sex", a.sex], ["Sire", a.sire || "—"], ["Dam", a.dam || "—"], ["AWA Reg #", a.awaReg || "—"], ["Grand Sire", a.grandSire || "—"], ["Grand Dam", a.grandDam || "—"], ["Brand Cert", a.brandCert || "—"]].map(([l, v]) => (
                <div key={l}><div style={{ fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: "#888", marginBottom: 2 }}>{l}</div><div style={{ fontSize: 12, fontWeight: 500 }}>{v}</div></div>
              ))}
            </div>
            {a.notes && <div style={{ fontSize: 11, color: "#555", marginBottom: 16, fontStyle: "italic", borderTop: "1px solid #e0d8cc", paddingTop: 8 }}>Notes: {a.notes}</div>}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#444", marginBottom: 8, borderBottom: "1px solid #ddd", paddingBottom: 4 }}>Weight History</div>
                {a.weights.length === 0 ? <div style={{ fontSize: 11, color: "#999" }}>No records</div> :
                  [...a.weights].sort((x, y) => new Date(y.date) - new Date(x.date)).map((w, i) => (
                    <div key={i} style={{ fontSize: 11, padding: "4px 0", borderBottom: "1px solid #f0ebe0" }}>{formatDate(w.date)} — <strong>{w.weight} lbs</strong> {w.event && `(${w.event})`}</div>
                  ))}
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#444", marginBottom: 8, borderBottom: "1px solid #ddd", paddingBottom: 4 }}>Vaccinations</div>
                {a.vaccinations.length === 0 ? <div style={{ fontSize: 11, color: "#999" }}>No records</div> :
                  [...a.vaccinations].sort((x, y) => new Date(y.date) - new Date(x.date)).map((v, i) => (
                    <div key={i} style={{ fontSize: 11, padding: "4px 0", borderBottom: "1px solid #f0ebe0" }}>{formatDate(v.date)} — <strong>{v.product}</strong> {v.mfg && `(${v.mfg})`}</div>
                  ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Spreadsheet View ──────────────────────────────────────────
function SpreadsheetView({ cattle, onBack, onPrint }) {
  const [sortKey, setSortKey] = useState("tag");
  const [sortDir, setSortDir] = useState(1);
  const cols = [
    { key: "tag", label: "Tag" }, { key: "dob", label: "DOB" }, { key: "age", label: "Age" },
    { key: "sex", label: "Sex" }, { key: "generation", label: "Gen" }, { key: "bloodline", label: "Bloodline" },
    { key: "sire", label: "Sire" }, { key: "dam", label: "Dam" }, { key: "weight", label: "Latest Wt" },
    { key: "vax", label: "Vax #" }, { key: "brandCert", label: "Brand Cert" },
  ];
  const getVal = (a, key) => {
    if (key === "age") return ageStr(a.dob);
    if (key === "weight") return latestWeight(a);
    if (key === "vax") return a.vaccinations.length;
    if (key === "dob") return formatDate(a.dob);
    return a[key] || "—";
  };
  const sorted = [...cattle].sort((a, b) => String(getVal(a, sortKey)).localeCompare(String(getVal(b, sortKey))) * sortDir);
  const toggle = (key) => { if (sortKey === key) setSortDir(d => d * -1); else { setSortKey(key); setSortDir(1); } };

  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: "'Inter', sans-serif" }}>
      <style>{GLOBAL_STYLES}</style>
      <Header subtitle="Spreadsheet View" actions={<>
        <Btn onClick={onPrint} variant="ghost" small>🖨 Print</Btn>
        <Btn onClick={onBack} variant="ghost" small>← Herd</Btn>
      </>} />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 16px", overflowX: "auto" }}>
        <div style={{ fontSize: 12, color: T.muted, marginBottom: 16, letterSpacing: 1 }}>{cattle.length} ANIMALS — CLICK HEADERS TO SORT</div>
        <div style={{ borderRadius: 14, overflow: "hidden", border: `1px solid ${T.border}`, boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: T.surface }}>
                {cols.map(c => (
                  <th key={c.key} onClick={() => toggle(c.key)}
                    style={{ padding: "14px 16px", textAlign: "left", color: sortKey === c.key ? T.gold : T.muted, fontSize: 10, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", userSelect: "none", fontWeight: 700, whiteSpace: "nowrap", borderBottom: `1px solid ${T.border}` }}>
                    {c.label}{sortKey === c.key ? (sortDir === 1 ? " ↑" : " ↓") : ""}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((a, i) => (
                <tr key={a.id} style={{ background: i % 2 === 0 ? T.card : T.surface, borderBottom: `1px solid ${T.border}`, transition: "background 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#2a2318"}
                  onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? T.card : T.surface}>
                  <td style={{ padding: "12px 16px", fontWeight: 700, color: T.cream, fontSize: 13 }}>{a.tag}</td>
                  <td style={{ padding: "12px 16px", color: T.muted, fontSize: 12 }}>{formatDate(a.dob)}</td>
                  <td style={{ padding: "12px 16px", color: T.muted, fontSize: 12 }}>{ageStr(a.dob)}</td>
                  <td style={{ padding: "12px 16px", fontSize: 12 }}><span style={{ color: sexColor(a.sex), fontWeight: 600 }}>{a.sex}</span></td>
                  <td style={{ padding: "12px 16px", fontSize: 12 }}><span style={{ color: T.gold, background: T.gold + "15", border: `1px solid ${T.gold}30`, borderRadius: 4, padding: "2px 8px", fontSize: 11 }}>{a.generation}</span></td>
                  <td style={{ padding: "12px 16px", color: T.muted, fontSize: 12 }}>{a.bloodline || "—"}</td>
                  <td style={{ padding: "12px 16px", color: T.muted, fontSize: 12 }}>{a.sire || "—"}</td>
                  <td style={{ padding: "12px 16px", color: T.muted, fontSize: 12 }}>{a.dam || "—"}</td>
                  <td style={{ padding: "12px 16px", fontWeight: 700, color: T.gold, fontSize: 13 }}>{latestWeight(a)}</td>
                  <td style={{ padding: "12px 16px", color: T.muted, fontSize: 12, textAlign: "center" }}>{a.vaccinations.length}</td>
                  <td style={{ padding: "12px 16px", color: T.muted, fontSize: 12 }}>{a.brandCert || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Herd App ──────────────────────────────────────────────────
function HerdApp() {
  const [cattle, setCattle] = useState(() => {
    try { const s = localStorage.getItem("v2_cattle"); return s ? JSON.parse(s) : INITIAL_CATTLE; } catch { return INITIAL_CATTLE; }
  });
  const saveCattle = (v) => { setCattle(v); try { localStorage.setItem("v2_cattle", JSON.stringify(v)); } catch {} };

  const [selected, setSelected] = useState(null);
  const [view, setView] = useState("herd");
  const [addForm, setAddForm] = useState({ ...EMPTY_ANIMAL });
  const [newWeight, setNewWeight] = useState({ ...EMPTY_WEIGHT });
  const [newVax, setNewVax] = useState({ ...EMPTY_VAX });
  const [addWeightOpen, setAddWeightOpen] = useState(false);
  const [addVaxOpen, setAddVaxOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const selectedAnimal = cattle.find(c => c.id === selected);
  const goHerd = () => { setView("herd"); setSelected(null); setConfirmDelete(false); };

  if (view === "print") return <PrintPreview cattle={cattle} onClose={goHerd} />;
  if (view === "sheet") return <SpreadsheetView cattle={cattle} onBack={goHerd} onPrint={() => setView("print")} />;
  if (view === "health" && selectedAnimal) return <HealthAdvisor animal={selectedAnimal} onClose={() => setView("detail")} />;
  if (view === "scan" && selectedAnimal) return <ScanNotes animal={selectedAnimal} onClose={() => setView("detail")} onSave={(data) => {
    const updated = cattle.map(c => {
      if (c.id !== selected) return c;
      const newVax = data.vaccinations.filter(v => v.date && v.product).map(v => ({ ...v }));
      const newWt = data.weights.filter(w => w.date && w.weight).map(w => ({ ...w, weight: Number(w.weight) }));
      const newNotes = data.notes.trim() ? (c.notes ? c.notes + "\n\n" + data.notes.trim() : data.notes.trim()) : c.notes;
      return { ...c, vaccinations: [...c.vaccinations, ...newVax], weights: [...c.weights, ...newWt], notes: newNotes };
    });
    saveCattle(updated);
    setView("detail");
  }} />;

  const addAnimal = () => {
    const id = Date.now().toString();
    const tag = addForm.tag.startsWith("#") ? addForm.tag : `#${addForm.tag}`;
    saveCattle([...cattle, { ...addForm, tag, id, weights: [], vaccinations: [] }]);
    setAddForm({ ...EMPTY_ANIMAL });
    setView("herd");
  };

  const addWeight = () => {
    if (!newWeight.date || !newWeight.weight) return;
    saveCattle(cattle.map(c => c.id === selected ? { ...c, weights: [...c.weights, { ...newWeight, weight: Number(newWeight.weight) }] } : c));
    setNewWeight({ ...EMPTY_WEIGHT });
    setAddWeightOpen(false);
  };

  const addVax = () => {
    if (!newVax.date || !newVax.product) return;
    saveCattle(cattle.map(c => c.id === selected ? { ...c, vaccinations: [...c.vaccinations, { ...newVax }] } : c));
    setNewVax({ ...EMPTY_VAX });
    setAddVaxOpen(false);
  };

  const deleteAnimal = () => { saveCattle(cattle.filter(c => c.id !== selected)); goHerd(); };

  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: "'Inter', sans-serif" }}>
      <style>{GLOBAL_STYLES}</style>

      {view === "herd" && <>
        <Header subtitle="Cattle Records" actions={<>
          <Btn onClick={() => setView("sheet")} variant="ghost" small>📊 Table</Btn>
          <Btn onClick={() => setView("print")} variant="ghost" small>🖨 Print</Btn>
          <Btn onClick={() => setView("add")} variant="gold" small>+ Add Animal</Btn>
        </>} />
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "28px 16px" }}>
          <div style={{ fontSize: 11, color: T.muted, letterSpacing: 2, textTransform: "uppercase", marginBottom: 20 }}>{cattle.length} Animals on Record</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {cattle.map(a => <AnimalCard key={a.id} a={a} onClick={() => { setSelected(a.id); setView("detail"); setConfirmDelete(false); }} />)}
          </div>
        </div>
      </>}

      {view === "detail" && selectedAnimal && <>
        <Header subtitle={selectedAnimal.tag} actions={<>
          <Btn onClick={() => setView("scan")} variant="gold" small>📷 Scan Notes</Btn>
          <Btn onClick={() => setView("health")} variant="ghost" small>🩺 Health Advisor</Btn>
          <Btn onClick={() => setView("print")} variant="ghost" small>🖨 Print</Btn>
          <Btn onClick={goHerd} variant="ghost" small>← Herd</Btn>
        </>} />
        <div className="fade-in" style={{ maxWidth: 760, margin: "0 auto", padding: "28px 16px" }}>
          {/* Hero */}
          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: "24px 28px", marginBottom: 20, display: "flex", alignItems: "center", gap: 20, boxShadow: "0 4px 24px rgba(0,0,0,0.3)" }}>
            <div style={{ width: 64, height: 64, borderRadius: 14, background: `linear-gradient(135deg, ${sexColor(selectedAnimal.sex)}40, ${sexColor(selectedAnimal.sex)}15)`, border: `2px solid ${sexColor(selectedAnimal.sex)}50`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, flexShrink: 0 }}>
              <span style={{ color: sexColor(selectedAnimal.sex) }}>{sexIcon(selectedAnimal.sex)}</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: T.cream, marginBottom: 6 }}>{selectedAnimal.tag}</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <span style={{ fontSize: 11, color: T.gold, background: T.gold + "15", border: `1px solid ${T.gold}30`, borderRadius: 4, padding: "3px 10px" }}>{selectedAnimal.generation}</span>
                <span style={{ fontSize: 11, color: T.muted }}>{selectedAnimal.bloodline}</span>
                <span style={{ fontSize: 11, color: T.muted }}>DOB {formatDate(selectedAnimal.dob)}</span>
                <span style={{ fontSize: 11, color: T.muted }}>Age {ageStr(selectedAnimal.dob)}</span>
              </div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: T.gold }}>{latestWeight(selectedAnimal)}</div>
              <div style={{ fontSize: 10, color: T.muted, letterSpacing: 1, textTransform: "uppercase" }}>Latest Weight</div>
            </div>
          </div>

          {/* Info */}
          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: "20px 24px", marginBottom: 16 }}>
            <Divider title="Identification" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 24px" }}>
              <Field label="Sex" value={selectedAnimal.sex} />
              <Field label="Generation" value={selectedAnimal.generation} />
              <Field label="Bloodline" value={selectedAnimal.bloodline} />
              <Field label="AWA Reg #" value={selectedAnimal.awaReg} />
              <Field label="Brand Cert #" value={selectedAnimal.brandCert} />
            </div>
          </div>

          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: "20px 24px", marginBottom: 16 }}>
            <Divider title="Lineage" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 24px" }}>
              <Field label="Sire" value={selectedAnimal.sire} />
              <Field label="Dam" value={selectedAnimal.dam} />
              <Field label="Grand Sire" value={selectedAnimal.grandSire} />
              <Field label="Grand Dam" value={selectedAnimal.grandDam} />
            </div>
          </div>

          {/* Weights */}
          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: "20px 24px", marginBottom: 16 }}>
            <Divider title="Weight History" action={<Btn onClick={() => setAddWeightOpen(!addWeightOpen)} variant="green" small>+ Weight</Btn>} />
            {addWeightOpen && (
              <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: 16, marginBottom: 16, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
                <Input label="Date" type="date" value={newWeight.date} onChange={v => setNewWeight(p => ({ ...p, date: v }))} />
                <Input label="Weight (lbs)" type="number" value={newWeight.weight} onChange={v => setNewWeight(p => ({ ...p, weight: v }))} />
                <Input label="Event / Note" value={newWeight.event} onChange={v => setNewWeight(p => ({ ...p, event: v }))} />
                <Btn onClick={addWeight} variant="green">Save</Btn>
              </div>
            )}
            {selectedAnimal.weights.length === 0
              ? <div style={{ color: T.muted, fontSize: 13, padding: "8px 0" }}>No weight records yet.</div>
              : [...selectedAnimal.weights].sort((a, b) => new Date(b.date) - new Date(a.date)).map((w, i) => (
                <div key={i} style={{ display: "flex", gap: 16, alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${T.border}` }}>
                  <span style={{ fontWeight: 700, color: T.gold, fontSize: 15 }}>{w.weight} lbs</span>
                  <span style={{ color: T.muted, fontSize: 12 }}>{formatDate(w.date)}</span>
                  <span style={{ color: T.muted, fontSize: 12 }}>{w.event}</span>
                </div>
              ))}
          </div>

          {/* Vaccinations */}
          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: "20px 24px", marginBottom: 16 }}>
            <Divider title="Vaccinations" action={<Btn onClick={() => setAddVaxOpen(!addVaxOpen)} variant="green" small>+ Vaccination</Btn>} />
            {addVaxOpen && (
              <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: 16, marginBottom: 16, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
                <Input label="Date" type="date" value={newVax.date} onChange={v => setNewVax(p => ({ ...p, date: v }))} />
                <Input label="Product" value={newVax.product} onChange={v => setNewVax(p => ({ ...p, product: v }))} />
                <Input label="Manufacturer" value={newVax.mfg} onChange={v => setNewVax(p => ({ ...p, mfg: v }))} />
                <Btn onClick={addVax} variant="green">Save</Btn>
              </div>
            )}
            {selectedAnimal.vaccinations.length === 0
              ? <div style={{ color: T.muted, fontSize: 13, padding: "8px 0" }}>No vaccination records yet.</div>
              : [...selectedAnimal.vaccinations].sort((a, b) => new Date(b.date) - new Date(a.date)).map((v, i) => (
                <div key={i} style={{ display: "flex", gap: 16, alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${T.border}` }}>
                  <span style={{ fontWeight: 600, color: T.cream, fontSize: 13 }}>{v.product}</span>
                  <span style={{ color: T.muted, fontSize: 12 }}>{formatDate(v.date)}</span>
                  <span style={{ color: T.muted, fontSize: 12 }}>{v.mfg}</span>
                </div>
              ))}
          </div>

          {/* Notes */}
          {selectedAnimal.notes && (
            <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: "20px 24px", marginBottom: 16 }}>
              <Divider title="Notes" />
              <div style={{ color: T.muted, fontSize: 14, lineHeight: 1.7, fontStyle: "italic" }}>{selectedAnimal.notes}</div>
            </div>
          )}

          {/* Delete */}
          <div style={{ marginTop: 24, paddingTop: 20, borderTop: `1px solid ${T.border}` }}>
            {!confirmDelete
              ? <Btn onClick={() => setConfirmDelete(true)} variant="danger">Remove Animal</Btn>
              : <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <span style={{ color: "#e06060", fontSize: 13 }}>Are you sure?</span>
                <Btn onClick={deleteAnimal} variant="danger">Yes, Remove</Btn>
                <Btn onClick={() => setConfirmDelete(false)} variant="ghost">Cancel</Btn>
              </div>}
          </div>
        </div>
      </>}

      {view === "add" && <>
        <Header subtitle="Add New Animal" actions={<Btn onClick={() => { setView("herd"); setAddForm({ ...EMPTY_ANIMAL }); }} variant="ghost" small>← Cancel</Btn>} />
        <div className="fade-in" style={{ maxWidth: 760, margin: "0 auto", padding: "28px 16px" }}>
          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: "24px 28px", marginBottom: 16 }}>
            <Divider title="Identification" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Input label="Tag #" value={addForm.tag} onChange={v => setAddForm(p => ({ ...p, tag: v }))} placeholder="e.g. 210" />
              <Input label="Date of Birth" type="date" value={addForm.dob} onChange={v => setAddForm(p => ({ ...p, dob: v }))} />
              <div>
                <Label>Sex</Label>
                <select value={addForm.sex} onChange={e => setAddForm(p => ({ ...p, sex: e.target.value }))} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.surface, color: T.cream, fontSize: 13, fontFamily: "'Inter', sans-serif" }}>
                  <option>Heifer</option><option>Bull</option><option>Steer</option><option>Cow</option>
                </select>
              </div>
              <div>
                <Label>Generation</Label>
                <select value={addForm.generation} onChange={e => setAddForm(p => ({ ...p, generation: e.target.value }))} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.surface, color: T.cream, fontSize: 13, fontFamily: "'Inter', sans-serif" }}>
                  <option>F1</option><option>F2</option><option>F3</option><option>Full Blood</option><option>Commercial</option>
                </select>
              </div>
              <Input label="Bloodline %" value={addForm.bloodline} onChange={v => setAddForm(p => ({ ...p, bloodline: v }))} placeholder="e.g. 75% Wagyu / 25% Angus" />
              <Input label="AWA Reg #" value={addForm.awaReg} onChange={v => setAddForm(p => ({ ...p, awaReg: v }))} />
              <Input label="Brand Cert #" value={addForm.brandCert} onChange={v => setAddForm(p => ({ ...p, brandCert: v }))} />
            </div>
          </div>

          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: "24px 28px", marginBottom: 16 }}>
            <Divider title="Lineage" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Input label="Sire" value={addForm.sire} onChange={v => setAddForm(p => ({ ...p, sire: v }))} />
              <Input label="Dam" value={addForm.dam} onChange={v => setAddForm(p => ({ ...p, dam: v }))} />
              <Input label="Grand Sire" value={addForm.grandSire} onChange={v => setAddForm(p => ({ ...p, grandSire: v }))} />
              <Input label="Grand Dam" value={addForm.grandDam} onChange={v => setAddForm(p => ({ ...p, grandDam: v }))} />
            </div>
          </div>

          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: "24px 28px", marginBottom: 20 }}>
            <Divider title="Notes" />
            <textarea value={addForm.notes} onChange={e => setAddForm(p => ({ ...p, notes: e.target.value }))} rows={3}
              style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.surface, color: T.cream, fontSize: 13, fontFamily: "'Inter', sans-serif", resize: "vertical" }}
              placeholder="Any notes about this animal..." />
          </div>

          <Btn onClick={addAnimal} disabled={!addForm.tag} variant="gold">Save Animal</Btn>
        </div>
      </>}
    </div>
  );
}



// ── Scan Notes (Vision) ───────────────────────────────────────
function ScanNotes({ animal, onClose, onSave }) {
  const [imageData, setImageData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [extracted, setExtracted] = useState(null);
  const [error, setError] = useState("");

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setError("");
    setExtracted(null);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImageData({ url: ev.target.result, base64: ev.target.result.split(",")[1], mediaType: file.type });
      processImage(ev.target.result.split(",")[1], file.type);
    };
    reader.readAsDataURL(file);
  };

  const processImage = async (base64, mediaType) => {
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1500,
          system: "You read photos of handwritten or printed cattle vet notes and extract structured data. Return ONLY valid JSON with no markdown, no backticks, no explanation. The JSON must have this exact shape: {\"vaccinations\": [{\"date\": \"YYYY-MM-DD\", \"product\": \"name\", \"mfg\": \"manufacturer or empty string\"}], \"weights\": [{\"date\": \"YYYY-MM-DD\", \"weight\": number_in_pounds, \"event\": \"context or empty string\"}], \"notes\": \"any other relevant observations as a single string\"}. If a section has no data, use empty array or empty string. Always use YYYY-MM-DD date format. If only month/year given, use first day of month. If a year is missing, assume the current year.",
          messages: [{
            role: "user",
            content: [
              { type: "image", source: { type: "base64", media_type: mediaType, data: base64 } },
              { type: "text", text: `Read this veterinary note for animal ${animal.tag} (${animal.sex}, born ${animal.dob || "unknown"}). Extract any vaccinations, weights, and other notes. Return JSON only.` }
            ]
          }]
        })
      });
      const data = await res.json();
      const text = data.content?.find(b => b.type === "text")?.text || "{}";
      const cleaned = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      setExtracted({
        vaccinations: parsed.vaccinations || [],
        weights: parsed.weights || [],
        notes: parsed.notes || "",
      });
    } catch (e) {
      setError("Could not read the image. Try again with a clearer photo or better lighting.");
    }
    setLoading(false);
  };

  const updateVax = (i, field, val) => {
    const v = [...extracted.vaccinations];
    v[i] = { ...v[i], [field]: val };
    setExtracted({ ...extracted, vaccinations: v });
  };
  const removeVax = (i) => setExtracted({ ...extracted, vaccinations: extracted.vaccinations.filter((_, idx) => idx !== i) });

  const updateWt = (i, field, val) => {
    const w = [...extracted.weights];
    w[i] = { ...w[i], [field]: field === "weight" ? Number(val) : val };
    setExtracted({ ...extracted, weights: w });
  };
  const removeWt = (i) => setExtracted({ ...extracted, weights: extracted.weights.filter((_, idx) => idx !== i) });

  const reset = () => { setImageData(null); setExtracted(null); setError(""); };

  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: "'Inter', sans-serif" }}>
      <style>{GLOBAL_STYLES}</style>
      <Header subtitle={"Scan Notes — " + animal.tag} actions={<Btn onClick={onClose} variant="ghost" small>← Back</Btn>} />

      <div className="fade-in" style={{ maxWidth: 760, margin: "0 auto", padding: "28px 16px" }}>

        {/* Animal context */}
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: "16px 20px", marginBottom: 20, display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: `linear-gradient(135deg, ${sexColor(animal.sex)}40, ${sexColor(animal.sex)}15)`, border: `1.5px solid ${sexColor(animal.sex)}60`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
            <span style={{ color: sexColor(animal.sex) }}>{sexIcon(animal.sex)}</span>
          </div>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 18, color: T.cream }}>{animal.tag}</div>
            <div style={{ fontSize: 12, color: T.muted }}>{animal.generation} · {animal.bloodline}</div>
          </div>
        </div>

        {/* Upload area */}
        {!imageData && !loading && (
          <div style={{ background: T.card, border: `2px dashed ${T.border}`, borderRadius: 14, padding: "48px 24px", textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📸</div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: T.cream, marginBottom: 8 }}>Scan Vet Notes</div>
            <div style={{ fontSize: 13, color: T.muted, marginBottom: 24, maxWidth: 400, margin: "0 auto 24px" }}>
              Take a photo of vaccination receipts, weight tickets, or handwritten notes. Claude will read them and add to {animal.tag}'s record.
            </div>
            <label style={{ display: "inline-block", padding: "12px 24px", background: `linear-gradient(135deg, ${T.gold}, ${T.goldLight})`, color: T.bg, borderRadius: 10, fontSize: 13, fontWeight: 700, letterSpacing: 0.5, cursor: "pointer", border: "none" }}>
              📷 Take Photo or Choose File
              <input type="file" accept="image/*" capture="environment" onChange={handleFileSelect} style={{ display: "none" }} />
            </label>
            <div style={{ fontSize: 11, color: T.muted, marginTop: 14 }}>On iPhone: choose "Take Photo" from the menu</div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: "40px 24px", textAlign: "center" }}>
            {imageData && <img src={imageData.url} alt="Vet notes" style={{ maxWidth: 240, maxHeight: 240, borderRadius: 10, marginBottom: 20, opacity: 0.6 }} />}
            <div style={{ fontSize: 28, marginBottom: 10 }}>🔍</div>
            <div style={{ color: T.gold, fontSize: 14, letterSpacing: 1, marginBottom: 4 }}>Reading the photo...</div>
            <div style={{ color: T.muted, fontSize: 12 }}>Extracting vaccinations, weights, and notes</div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ background: T.card, border: `1px solid ${T.danger}50`, borderRadius: 14, padding: "20px 24px", marginBottom: 16 }}>
            <div style={{ color: "#e06060", fontSize: 13, marginBottom: 12 }}>{error}</div>
            <Btn onClick={reset} variant="ghost" small>Try Again</Btn>
          </div>
        )}

        {/* Review / Edit */}
        {extracted && !loading && (
          <div className="fade-in">
            {imageData && (
              <details style={{ marginBottom: 20 }}>
                <summary style={{ fontSize: 11, color: T.muted, letterSpacing: 1, cursor: "pointer", padding: "8px 0" }}>📷 View photo</summary>
                <img src={imageData.url} alt="Vet notes" style={{ maxWidth: "100%", borderRadius: 10, marginTop: 8 }} />
              </details>
            )}

            {/* Vaccinations */}
            <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: "20px 24px", marginBottom: 16 }}>
              <Divider title={"Vaccinations Found — " + extracted.vaccinations.length} />
              {extracted.vaccinations.length === 0 ? (
                <div style={{ color: T.muted, fontSize: 13 }}>No vaccinations detected in this photo.</div>
              ) : (
                extracted.vaccinations.map((v, i) => (
                  <div key={i} style={{ background: T.surface, borderRadius: 10, padding: 14, marginBottom: 10, border: `1px solid ${T.border}` }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 10, alignItems: "end" }}>
                      <div>
                        <Label>Date</Label>
                        <input type="date" value={v.date} onChange={e => updateVax(i, "date", e.target.value)}
                          style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: `1px solid ${T.border}`, background: T.bg, color: T.cream, fontSize: 12 }} />
                      </div>
                      <div>
                        <Label>Product</Label>
                        <input value={v.product} onChange={e => updateVax(i, "product", e.target.value)}
                          style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: `1px solid ${T.border}`, background: T.bg, color: T.cream, fontSize: 12 }} />
                      </div>
                      <div>
                        <Label>Manufacturer</Label>
                        <input value={v.mfg} onChange={e => updateVax(i, "mfg", e.target.value)}
                          style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: `1px solid ${T.border}`, background: T.bg, color: T.cream, fontSize: 12 }} />
                      </div>
                      <button onClick={() => removeVax(i)} style={{ background: "transparent", border: `1px solid ${T.danger}50`, color: "#e06060", borderRadius: 6, padding: "8px 10px", cursor: "pointer", fontSize: 11 }}>✕</button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Weights */}
            <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: "20px 24px", marginBottom: 16 }}>
              <Divider title={"Weights Found — " + extracted.weights.length} />
              {extracted.weights.length === 0 ? (
                <div style={{ color: T.muted, fontSize: 13 }}>No weights detected in this photo.</div>
              ) : (
                extracted.weights.map((w, i) => (
                  <div key={i} style={{ background: T.surface, borderRadius: 10, padding: 14, marginBottom: 10, border: `1px solid ${T.border}` }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 10, alignItems: "end" }}>
                      <div>
                        <Label>Date</Label>
                        <input type="date" value={w.date} onChange={e => updateWt(i, "date", e.target.value)}
                          style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: `1px solid ${T.border}`, background: T.bg, color: T.cream, fontSize: 12 }} />
                      </div>
                      <div>
                        <Label>Weight (lbs)</Label>
                        <input type="number" value={w.weight} onChange={e => updateWt(i, "weight", e.target.value)}
                          style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: `1px solid ${T.border}`, background: T.bg, color: T.cream, fontSize: 12 }} />
                      </div>
                      <div>
                        <Label>Event / Note</Label>
                        <input value={w.event} onChange={e => updateWt(i, "event", e.target.value)}
                          style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: `1px solid ${T.border}`, background: T.bg, color: T.cream, fontSize: 12 }} />
                      </div>
                      <button onClick={() => removeWt(i)} style={{ background: "transparent", border: `1px solid ${T.danger}50`, color: "#e06060", borderRadius: 6, padding: "8px 10px", cursor: "pointer", fontSize: 11 }}>✕</button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Notes */}
            <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: "20px 24px", marginBottom: 20 }}>
              <Divider title="Additional Notes" />
              <textarea value={extracted.notes} onChange={e => setExtracted({ ...extracted, notes: e.target.value })} rows={3}
                placeholder="Any other observations Claude noticed in the photo will appear here. Edit as needed."
                style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.surface, color: T.cream, fontSize: 13, fontFamily: "'Inter', sans-serif", resize: "vertical" }} />
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Btn onClick={() => onSave(extracted)} variant="gold"
                disabled={extracted.vaccinations.length === 0 && extracted.weights.length === 0 && !extracted.notes.trim()}>
                ✓ Save to {animal.tag}'s Record
              </Btn>
              <Btn onClick={reset} variant="ghost">📷 Scan Another Photo</Btn>
              <Btn onClick={onClose} variant="ghost">Cancel</Btn>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Health Advisor ────────────────────────────────────────────
function HealthAdvisor({ animal, onClose }) {
  const [symptom, setSymptom] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState(null);

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPhoto({ url: ev.target.result, base64: ev.target.result.split(",")[1], mediaType: file.type });
    };
    reader.readAsDataURL(file);
  };

  const ask = async () => {
    if (!symptom.trim() && !photo) return;
    setLoading(true);
    setResponse("");
    try {
      const animalContext = `
Animal: ${animal.tag}
Sex: ${animal.sex}
Age: ${animal.dob ? ageStr(animal.dob) : "Unknown"}
Generation/Breed: ${animal.generation} ${animal.bloodline}
Vaccination history: ${animal.vaccinations.length === 0 ? "None recorded" : animal.vaccinations.map(v => v.product + " on " + formatDate(v.date)).join(", ")}
Recent weights: ${animal.weights.length === 0 ? "None recorded" : [...animal.weights].sort((a,b) => new Date(b.date)-new Date(a.date)).slice(0,2).map(w => w.weight + "lbs on " + formatDate(w.date)).join(", ")}
Notes: ${animal.notes || "None"}
      `.trim();

      const userContent = [];
      if (photo) {
        userContent.push({ type: "image", source: { type: "base64", media_type: photo.mediaType, data: photo.base64 } });
      }
      userContent.push({
        type: "text",
        text: `Animal details:\n${animalContext}\n\nSymptoms/Observations:\n${symptom || "(No written description provided — please assess based on the photo)"}\n\n${photo ? "Please analyze the attached photo and any described symptoms together." : ""}`
      });

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: "You are a practical cattle health advisor helping a rancher on a small Wagyu-Angus crossbreeding operation. When a photo is provided, carefully observe visible signs such as eye discharge, nasal discharge, posture, body condition, skin lesions, swelling, lameness, or behavior. Combine visual observations with any written symptoms. Provide: 1) Most likely causes, 2) Urgency level (Monitor / Call vet soon / Emergency), 3) Immediate steps to take, 4) What to watch for. Be concise, practical, and clear. Always recommend consulting a licensed veterinarian for diagnosis and treatment. If a photo was provided, briefly mention what you observed visually in the LIKELY CAUSES section. Format your response with clear sections using these exact headers: LIKELY CAUSES, URGENCY, IMMEDIATE STEPS, WATCH FOR.",
          messages: [{ role: "user", content: userContent }]
        })
      });
      const data = await res.json();
      const text = data.content?.find(b => b.type === "text")?.text || "Unable to get a response. Please try again.";
      setResponse(text);
    } catch (e) {
      setResponse("Connection error. Please check your internet and try again.");
    }
    setLoading(false);
  };

  const sections = response ? response.split(/(?=LIKELY CAUSES|URGENCY|IMMEDIATE STEPS|WATCH FOR)/).filter(s => s.trim()) : [];
  const urgencyColor = (text) => {
    if (text?.includes("Emergency")) return "#e06060";
    if (text?.includes("Call vet")) return T.gold;
    return T.green;
  };

  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: "'Inter', sans-serif" }}>
      <style>{GLOBAL_STYLES}</style>
      <Header subtitle={"Health Advisor — " + animal.tag} actions={<>
        <Btn onClick={onClose} variant="ghost" small>← Back</Btn>
      </>} />
      <div className="fade-in" style={{ maxWidth: 760, margin: "0 auto", padding: "28px 16px" }}>

        {/* Animal summary */}
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: "16px 20px", marginBottom: 20, display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: `linear-gradient(135deg, ${sexColor(animal.sex)}40, ${sexColor(animal.sex)}15)`, border: `1.5px solid ${sexColor(animal.sex)}60`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
            <span style={{ color: sexColor(animal.sex) }}>{sexIcon(animal.sex)}</span>
          </div>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 18, color: T.cream }}>{animal.tag}</div>
            <div style={{ fontSize: 12, color: T.muted }}>{animal.generation} · {animal.bloodline} · Age {ageStr(animal.dob)} · {animal.vaccinations.length} vaccinations on record</div>
          </div>
        </div>

        {/* Input */}
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: "20px 24px", marginBottom: 16 }}>
          <Divider title="Describe What You're Seeing" />
          <textarea
            value={symptom}
            onChange={e => setSymptom(e.target.value)}
            placeholder="e.g. Not eating since this morning, standing apart from herd, nose is runny, seems lethargic. No fever checked yet."
            rows={4}
            style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: `1px solid ${T.border}`, background: T.surface, color: T.cream, fontSize: 14, fontFamily: "'Inter', sans-serif", resize: "vertical", lineHeight: 1.6 }}
          />

          {/* Photo upload */}
          <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${T.border}` }}>
            <Label>Add a Photo (Optional)</Label>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 10, lineHeight: 1.5 }}>
              Visible symptoms — eye/nose discharge, posture, swelling, lameness, lesions — help Claude give better guidance.
            </div>
            {!photo ? (
              <label style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 16px", background: T.surface, border: `1px dashed ${T.border}`, color: T.cream, borderRadius: 10, fontSize: 12, cursor: "pointer", fontFamily: "'Inter', sans-serif" }}>
                📷 Take Photo or Choose File
                <input type="file" accept="image/*" capture="environment" onChange={handlePhoto} style={{ display: "none" }} />
              </label>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 12, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: 10 }}>
                <img src={photo.url} alt="Symptom photo" style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 6 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: T.cream, marginBottom: 4 }}>Photo attached</div>
                  <div style={{ fontSize: 11, color: T.muted }}>Will be analyzed with your description</div>
                </div>
                <button onClick={() => setPhoto(null)} style={{ background: "transparent", border: `1px solid ${T.danger}50`, color: "#e06060", borderRadius: 6, padding: "6px 10px", cursor: "pointer", fontSize: 11 }}>Remove</button>
              </div>
            )}
          </div>

          <div style={{ marginTop: 14 }}>
            <Btn onClick={ask} variant="gold" disabled={loading || (!symptom.trim() && !photo)}>
              {loading ? "Analyzing..." : "🩺 Get Guidance"}
            </Btn>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: "32px 24px", textAlign: "center" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
            <div style={{ color: T.gold, fontSize: 14, letterSpacing: 1 }}>Analyzing symptoms...</div>
            <div style={{ color: T.muted, fontSize: 12, marginTop: 6 }}>Reviewing {animal.tag}'s health history</div>
          </div>
        )}

        {/* Response */}
        {!loading && sections.length > 0 && (
          <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {sections.map((section, i) => {
              const isUrgency = section.startsWith("URGENCY");
              const header = section.split("\n")[0];
              const body = section.split("\n").slice(1).join("\n").trim();
              const icons = { "LIKELY CAUSES": "🔎", "URGENCY": "⚠️", "IMMEDIATE STEPS": "✅", "WATCH FOR": "👁" };
              const icon = Object.entries(icons).find(([k]) => header.includes(k))?.[1] || "•";
              return (
                <div key={i} style={{ background: T.card, border: `1px solid ${isUrgency ? urgencyColor(body) + "50" : T.border}`, borderRadius: 14, padding: "18px 22px" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: isUrgency ? urgencyColor(body) : T.gold, marginBottom: 10 }}>{icon} {header}</div>
                  <div style={{ fontSize: 14, color: T.cream, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{body}</div>
                </div>
              );
            })}
            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: "12px 16px" }}>
              <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.6 }}>⚕️ <strong style={{ color: T.muted }}>Disclaimer:</strong> This is AI-generated guidance for informational purposes only. Always consult a licensed veterinarian for diagnosis and treatment decisions.</div>
            </div>
            <Btn onClick={() => { setSymptom(""); setResponse(""); setPhoto(null); }} variant="ghost">Ask Another Question</Btn>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Root ──────────────────────────────────────────────────────
export default function App() {
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem("v2_auth") === "1");
  if (!unlocked) return <PasswordGate onUnlock={() => { sessionStorage.setItem("v2_auth", "1"); setUnlocked(true); }} />;
  return <HerdApp />;
}
