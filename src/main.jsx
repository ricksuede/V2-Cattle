import React, { useState, useEffect } from "react";

const EMPTY_ANIMAL = { tag: "", dob: "", sex: "Heifer", generation: "F1", bloodline: "", awaReg: "", sire: "", dam: "", grandSire: "", grandDam: "", weights: [], vaccinations: [], brandCert: "", notes: "" };
const EMPTY_WEIGHT = { date: "", weight: "", event: "" };
const EMPTY_VAX = { date: "", product: "", mfg: "" };

// ── Helpers ───────────────────────────────────────────────────
const isMale = (sex) => sex === "Bull" || sex === "Steer";
const sexColor = (sex) => isMale(sex) ? "#c1440e" : "#5a7a4e";
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

const btnStyle = (bg, color, small = false) => ({
  background: bg, color, border: "none", borderRadius: 6, cursor: "pointer",
  padding: small ? "5px 12px" : "8px 18px", fontSize: small ? 12 : 13,
  fontFamily: "Georgia, serif", fontWeight: "bold", letterSpacing: 0.5, whiteSpace: "nowrap"
});

const labelStyle = { fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: "#a89070", marginBottom: 4 };
const inputStyle = { border: "1px solid #ddd6c4", borderRadius: 6, padding: "7px 10px", fontSize: 14, background: "#fff", width: "100%", boxSizing: "border-box", fontFamily: "Georgia, serif", color: "#2c2416" };
const tdStyle = { padding: "10px 12px", fontSize: 12 };

// ── Sub-components ────────────────────────────────────────────
function Section({ title, children, action }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid #2c2416", paddingBottom: 6, marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: "bold", letterSpacing: 2, textTransform: "uppercase", color: "#2c2416" }}>{title}</div>
        {action}
      </div>
      {children}
    </div>
  );
}

function Grid2({ children }) {
  return <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 20px" }}>{children}</div>;
}

function Field({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: "#a89070", marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 14, color: "#2c2416" }}>{value}</div>
    </div>
  );
}

function Row({ children }) {
  return <div style={{ display: "flex", gap: 16, alignItems: "center", padding: "8px 0", borderBottom: "1px solid #ede8df" }}>{children}</div>;
}

function Empty({ children }) {
  return <div style={{ color: "#a89070", fontSize: 13, padding: "8px 0" }}>{children}</div>;
}

function LabeledInput({ label, value, onChange, type = "text", placeholder }) {
  return (
    <div>
      <div style={labelStyle}>{label}</div>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder || ""} style={inputStyle} />
    </div>
  );
}

// ── Loading / error screen ────────────────────────────────────
function Notice({ title, detail }) {
  return (
    <div style={{ minHeight: "100vh", background: "#2c2416", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "Georgia, serif", padding: "0 24px", textAlign: "center" }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>🐄</div>
      <div style={{ fontSize: 18, color: "#f5f0e8", fontWeight: "bold", marginBottom: 6 }}>{title}</div>
      {detail && <div style={{ fontSize: 13, color: "#a89070", maxWidth: 320 }}>{detail}</div>}
    </div>
  );
}

// ── Password Gate ─────────────────────────────────────────────
function PasswordGate({ onUnlock }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);
  const attempt = async () => {
    if (busy || !input) return;
    setBusy(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: input }),
      });
      if (res.ok) { onUnlock(); return; }
    } catch { /* fall through to the error state below */ }
    setBusy(false); setError(true); setInput(""); setTimeout(() => setError(false), 2000);
  };
  return (
    <div style={{ minHeight: "100vh", background: "#2c2416", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "Georgia, serif" }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>🐄</div>
      <div style={{ fontSize: 22, color: "#f5f0e8", fontWeight: "bold", letterSpacing: 1, marginBottom: 4 }}>V2 Ranch</div>
      <div style={{ fontSize: 11, letterSpacing: 3, color: "#a89070", textTransform: "uppercase", marginBottom: 36 }}>Cattle Records</div>
      <div style={{ background: "#3d3020", borderRadius: 12, padding: "32px 36px", width: 280, boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}>
        <div style={{ fontSize: 12, color: "#a89070", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10 }}>Password</div>
        <input type="password" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && attempt()} autoFocus
          style={{ width: "100%", padding: "10px 12px", borderRadius: 6, border: error ? "1px solid #c1440e" : "1px solid #5a4a35", background: "#2c2416", color: "#f5f0e8", fontSize: 16, fontFamily: "Georgia, serif", boxSizing: "border-box", outline: "none" }} />
        {error && <div style={{ color: "#c1440e", fontSize: 12, marginTop: 8 }}>Incorrect password</div>}
        <button onClick={attempt} disabled={busy} style={{ marginTop: 16, width: "100%", padding: "10px", background: "#c1440e", color: "#fff", border: "none", borderRadius: 6, fontSize: 13, fontFamily: "Georgia, serif", fontWeight: "bold", cursor: "pointer" }}>{busy ? "Checking…" : "Enter"}</button>
      </div>
    </div>
  );
}

// ── Print Preview ─────────────────────────────────────────────
function PrintPreview({ cattle, onClose }) {
  return (
    <div style={{ minHeight: "100vh", background: "#f5f0e8", fontFamily: "Georgia, serif", color: "#2c2416" }}>
      <style>{`@media print { .no-print { display: none !important; } }`}</style>
      <div className="no-print" style={{ background: "#2c2416", padding: "14px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ color: "#f5f0e8", fontWeight: "bold", fontSize: 16 }}>🐄 Print Preview — V2 Ranch</div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => window.print()} style={btnStyle("#c1440e", "#fff")}>🖨 Print</button>
          <button onClick={onClose} style={btnStyle("#a89070", "#fff")}>← Back</button>
        </div>
      </div>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "30px 24px" }}>
        <div style={{ textAlign: "center", borderBottom: "3px solid #2c2416", paddingBottom: 16, marginBottom: 24 }}>
          <div style={{ fontSize: 28, fontWeight: "bold" }}>V2 Ranch</div>
          <div style={{ fontSize: 13, color: "#7a6a55", letterSpacing: 2, textTransform: "uppercase" }}>Cattle Records — {new Date().toLocaleDateString()}</div>
        </div>
        <div style={{ fontSize: 13, fontWeight: "bold", letterSpacing: 2, textTransform: "uppercase", borderBottom: "2px solid #2c2416", paddingBottom: 6, marginBottom: 12 }}>Herd Summary</div>
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 32, fontSize: 12 }}>
          <thead>
            <tr style={{ background: "#2c2416", color: "#f5f0e8" }}>
              {["Tag", "DOB", "Age", "Sex", "Generation", "Bloodline", "Sire", "Dam", "Latest Wt", "Brand Cert"].map(h => (
                <th key={h} style={{ padding: "8px 10px", textAlign: "left", fontSize: 10, letterSpacing: 1 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cattle.map((a, i) => (
              <tr key={a.id} style={{ background: i % 2 === 0 ? "#fff" : "#f9f6f0" }}>
                {[a.tag, formatDate(a.dob), ageStr(a.dob), a.sex, a.generation, a.bloodline, a.sire || "—", a.dam || "—", latestWeight(a), a.brandCert || "—"].map((v, j) => (
                  <td key={j} style={{ padding: "7px 10px", borderBottom: "1px solid #ddd6c4", fontSize: 11 }}>{v}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {cattle.map(a => (
          <div key={a.id} style={{ marginBottom: 36, pageBreakInside: "avoid" }}>
            <div style={{ fontSize: 13, fontWeight: "bold", letterSpacing: 2, textTransform: "uppercase", borderBottom: "2px solid #2c2416", paddingBottom: 6, marginBottom: 12 }}>
              {a.tag} {sexIcon(a.sex)} — {a.generation} {a.bloodline}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px 20px", marginBottom: 12 }}>
              {[["DOB", formatDate(a.dob)], ["Age", ageStr(a.dob)], ["Sex", a.sex], ["Sire", a.sire || "—"], ["Dam", a.dam || "—"], ["AWA Reg #", a.awaReg || "—"], ["Grand Sire", a.grandSire || "—"], ["Grand Dam", a.grandDam || "—"], ["Brand Cert", a.brandCert || "—"]].map(([l, v]) => (
                <div key={l}><div style={{ fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", color: "#a89070" }}>{l}</div><div style={{ fontSize: 12 }}>{v}</div></div>
              ))}
            </div>
            {a.notes && <div style={{ fontSize: 11, color: "#5a4a35", marginBottom: 12, fontStyle: "italic" }}>Notes: {a.notes}</div>}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: "bold", letterSpacing: 1.5, textTransform: "uppercase", color: "#7a6a55", marginBottom: 6 }}>Weight History</div>
                {a.weights.length === 0 ? <div style={{ fontSize: 11, color: "#a89070" }}>No records</div> :
                  [...a.weights].sort((x, y) => new Date(y.date) - new Date(x.date)).map((w, i) => (
                    <div key={i} style={{ fontSize: 11, padding: "3px 0", borderBottom: "1px solid #ede8df" }}>{formatDate(w.date)} — <strong>{w.weight} lbs</strong> {w.event && `(${w.event})`}</div>
                  ))}
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: "bold", letterSpacing: 1.5, textTransform: "uppercase", color: "#7a6a55", marginBottom: 6 }}>Vaccinations</div>
                {a.vaccinations.length === 0 ? <div style={{ fontSize: 11, color: "#a89070" }}>No records</div> :
                  [...a.vaccinations].sort((x, y) => new Date(y.date) - new Date(x.date)).map((v, i) => (
                    <div key={i} style={{ fontSize: 11, padding: "3px 0", borderBottom: "1px solid #ede8df" }}>{formatDate(v.date)} — <strong>{v.product}</strong> {v.mfg && `(${v.mfg})`}</div>
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
    { key: "vax", label: "# Vax" }, { key: "brandCert", label: "Brand Cert" },
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
    <div style={{ minHeight: "100vh", background: "#f5f0e8", fontFamily: "Georgia, serif", color: "#2c2416" }}>
      <div style={{ background: "#2c2416", padding: "18px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: 3, color: "#a89070", textTransform: "uppercase", marginBottom: 2 }}>V2 Ranch</div>
          <div style={{ fontSize: 22, color: "#f5f0e8", fontWeight: "bold" }}>📊 Spreadsheet View</div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onPrint} style={btnStyle("#5a7a4e", "#fff")}>🖨 Print Preview</button>
          <button onClick={onBack} style={btnStyle("#a89070", "#2c2416")}>← Herd</button>
        </div>
      </div>
      <div style={{ padding: "24px 16px", overflowX: "auto" }}>
        <div style={{ fontSize: 13, color: "#7a6a55", marginBottom: 12 }}>{cattle.length} animals — click headers to sort</div>
        <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: 10, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
          <thead>
            <tr style={{ background: "#2c2416" }}>
              {cols.map(c => (
                <th key={c.key} onClick={() => toggle(c.key)} style={{ padding: "10px 12px", textAlign: "left", color: "#f5f0e8", fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", cursor: "pointer", whiteSpace: "nowrap", userSelect: "none" }}>
                  {c.label}{sortKey === c.key ? (sortDir === 1 ? " ↑" : " ↓") : ""}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((a, i) => (
              <tr key={a.id} style={{ background: i % 2 === 0 ? "#fff" : "#faf7f2", borderBottom: "1px solid #ede8df" }}>
                <td style={{ ...tdStyle, fontWeight: "bold" }}>{a.tag}</td>
                <td style={tdStyle}>{formatDate(a.dob)}</td>
                <td style={tdStyle}>{ageStr(a.dob)}</td>
                <td style={tdStyle}><span style={{ color: sexColor(a.sex), fontWeight: "bold" }}>{a.sex}</span></td>
                <td style={tdStyle}>{a.generation}</td>
                <td style={tdStyle}>{a.bloodline || "—"}</td>
                <td style={tdStyle}>{a.sire || "—"}</td>
                <td style={tdStyle}>{a.dam || "—"}</td>
                <td style={{ ...tdStyle, fontWeight: "bold" }}>{latestWeight(a)}</td>
                <td style={tdStyle}>{a.vaccinations.length}</td>
                <td style={tdStyle}>{a.brandCert || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Herd App (main logic) ─────────────────────────────────────
function HerdApp({ onUnauthorized }) {
  const [cattle, setCattle] = useState(null);
  const [loadError, setLoadError] = useState(false);
  const [saveError, setSaveError] = useState(false);

  const [selected, setSelected] = useState(null);
  const [view, setView] = useState("herd");
  const [addForm, setAddForm] = useState({ ...EMPTY_ANIMAL });
  const [newWeight, setNewWeight] = useState({ ...EMPTY_WEIGHT });
  const [newVax, setNewVax] = useState({ ...EMPTY_VAX });
  const [addWeightOpen, setAddWeightOpen] = useState(false);
  const [addVaxOpen, setAddVaxOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Load the herd once on mount. Every hook above this line runs unconditionally.
  useEffect(() => {
    let alive = true;
    fetch("/api/herd")
      .then(r => {
        if (r.status === 401) { onUnauthorized(); return null; }
        if (!r.ok) throw new Error("load failed");
        return r.json();
      })
      .then(d => { if (alive && d) setCattle(d); })
      .catch(() => { if (alive) setLoadError(true); });
    return () => { alive = false; };
  }, []);

  // Optimistic write, rolled back if the server rejects it. Records tied to real
  // invoices must never look saved when they aren't.
  const saveCattle = (v) => {
    const previous = cattle;
    setCattle(v);
    setSaveError(false);
    fetch("/api/herd", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(v),
    })
      .then(r => {
        if (r.status === 401) { onUnauthorized(); return; }
        if (!r.ok) throw new Error("save failed");
      })
      .catch(() => { setCattle(previous); setSaveError(true); });
  };

  if (loadError) return <Notice title="Couldn't load records" detail="Check your connection, then reload the page." />;
  if (cattle === null) return <Notice title="Loading records…" />;

  const selectedAnimal = cattle.find(c => c.id === selected);
  const goHerd = () => { setView("herd"); setSelected(null); setConfirmDelete(false); };

  if (view === "print") return <PrintPreview cattle={cattle} onClose={goHerd} />;
  if (view === "sheet") return <SpreadsheetView cattle={cattle} onBack={goHerd} onPrint={() => setView("print")} />;

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
    <div style={{ minHeight: "100vh", background: "#f5f0e8", fontFamily: "'Georgia', serif", color: "#2c2416" }}>
      {saveError && (
        <div style={{ background: "#c1440e", color: "#fff", padding: "10px 24px", fontSize: 13, textAlign: "center" }}>
          That change could not be saved and has been undone. Check your connection and try again.
        </div>
      )}
      <div style={{ background: "#2c2416", padding: "18px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: 3, color: "#a89070", textTransform: "uppercase", marginBottom: 2 }}>V2 Ranch</div>
          <div style={{ fontSize: 22, color: "#f5f0e8", fontWeight: "bold", letterSpacing: 1 }}>🐄 Cattle Records</div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          {view !== "herd" && <button onClick={goHerd} style={btnStyle("#a89070", "#2c2416")}>← Herd</button>}
          {view === "herd" && <>
            <button onClick={() => setView("sheet")} style={btnStyle("#5a7a4e", "#fff")}>📊 Table</button>
            <button onClick={() => setView("print")} style={btnStyle("#7a6a55", "#fff")}>🖨 Print</button>
            <button onClick={() => setView("add")} style={btnStyle("#c1440e", "#fff")}>+ Add Animal</button>
          </>}
          {view === "detail" && <button onClick={() => setView("print")} style={btnStyle("#7a6a55", "#fff", true)}>🖨 Print</button>}
        </div>
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "24px 16px" }}>
        {view === "herd" && (
          <div>
            <div style={{ fontSize: 13, color: "#7a6a55", marginBottom: 16 }}>{cattle.length} animal{cattle.length !== 1 ? "s" : ""} on record</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {cattle.map(a => (
                <div key={a.id} onClick={() => { setSelected(a.id); setView("detail"); setConfirmDelete(false); }}
                  style={{ background: "#fff", border: "1px solid #ddd6c4", borderRadius: 10, padding: "16px 20px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,0,0,0.12)"}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.06)"}>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 8, background: sexColor(a.sex), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
                      {sexIcon(a.sex)}
                    </div>
                    <div>
                      <div style={{ fontWeight: "bold", fontSize: 18 }}>{a.tag}</div>
                      <div style={{ fontSize: 12, color: "#7a6a55" }}>{a.generation} · {a.bloodline || "—"} · DOB {formatDate(a.dob)}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: "bold", fontSize: 15 }}>{latestWeight(a)}</div>
                    <div style={{ fontSize: 11, color: "#a89070" }}>Age: {ageStr(a.dob)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === "detail" && selectedAnimal && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
              <div style={{ width: 56, height: 56, borderRadius: 10, background: sexColor(selectedAnimal.sex), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>{sexIcon(selectedAnimal.sex)}</div>
              <div>
                <div style={{ fontSize: 26, fontWeight: "bold" }}>{selectedAnimal.tag}</div>
                <div style={{ fontSize: 13, color: "#7a6a55" }}>{selectedAnimal.generation} · {selectedAnimal.bloodline}</div>
              </div>
            </div>
            <Section title="Identification">
              <Grid2>
                <Field label="Date of Birth" value={formatDate(selectedAnimal.dob)} />
                <Field label="Age" value={ageStr(selectedAnimal.dob)} />
                <Field label="Sex" value={selectedAnimal.sex} />
                <Field label="Generation" value={selectedAnimal.generation} />
                <Field label="Bloodline" value={selectedAnimal.bloodline} />
                <Field label="AWA Reg #" value={selectedAnimal.awaReg || "—"} />
                <Field label="Brand Cert #" value={selectedAnimal.brandCert || "—"} />
              </Grid2>
            </Section>
            <Section title="Lineage">
              <Grid2>
                <Field label="Sire" value={selectedAnimal.sire || "—"} />
                <Field label="Dam" value={selectedAnimal.dam || "—"} />
                <Field label="Grand Sire" value={selectedAnimal.grandSire || "—"} />
                <Field label="Grand Dam" value={selectedAnimal.grandDam || "—"} />
              </Grid2>
            </Section>
            <Section title="Weight History" action={<button onClick={() => setAddWeightOpen(!addWeightOpen)} style={btnStyle("#5a7a4e", "#fff", true)}>+ Weight</button>}>
              {addWeightOpen && (
                <div style={{ background: "#f9f6f0", border: "1px solid #ddd6c4", borderRadius: 8, padding: 14, marginBottom: 12, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-end" }}>
                  <LabeledInput label="Date" type="date" value={newWeight.date} onChange={v => setNewWeight(p => ({ ...p, date: v }))} />
                  <LabeledInput label="Weight (lbs)" type="number" value={newWeight.weight} onChange={v => setNewWeight(p => ({ ...p, weight: v }))} />
                  <LabeledInput label="Event / Note" value={newWeight.event} onChange={v => setNewWeight(p => ({ ...p, event: v }))} />
                  <button onClick={addWeight} style={btnStyle("#5a7a4e", "#fff")}>Save</button>
                </div>
              )}
              {selectedAnimal.weights.length === 0 ? <Empty>No weight records yet.</Empty> :
                [...selectedAnimal.weights].sort((a, b) => new Date(b.date) - new Date(a.date)).map((w, i) => (
                  <Row key={i}><span style={{ fontWeight: 600 }}>{w.weight} lbs</span><span style={{ color: "#7a6a55" }}>{formatDate(w.date)}</span><span style={{ color: "#a89070", fontSize: 12 }}>{w.event}</span></Row>
                ))}
            </Section>
            <Section title="Vaccinations" action={<button onClick={() => setAddVaxOpen(!addVaxOpen)} style={btnStyle("#5a7a4e", "#fff", true)}>+ Vaccination</button>}>
              {addVaxOpen && (
                <div style={{ background: "#f9f6f0", border: "1px solid #ddd6c4", borderRadius: 8, padding: 14, marginBottom: 12, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-end" }}>
                  <LabeledInput label="Date" type="date" value={newVax.date} onChange={v => setNewVax(p => ({ ...p, date: v }))} />
                  <LabeledInput label="Product" value={newVax.product} onChange={v => setNewVax(p => ({ ...p, product: v }))} />
                  <LabeledInput label="Manufacturer" value={newVax.mfg} onChange={v => setNewVax(p => ({ ...p, mfg: v }))} />
                  <button onClick={addVax} style={btnStyle("#5a7a4e", "#fff")}>Save</button>
                </div>
              )}
              {selectedAnimal.vaccinations.length === 0 ? <Empty>No vaccination records yet.</Empty> :
                [...selectedAnimal.vaccinations].sort((a, b) => new Date(b.date) - new Date(a.date)).map((v, i) => (
                  <Row key={i}><span style={{ fontWeight: 600 }}>{v.product}</span><span style={{ color: "#7a6a55" }}>{formatDate(v.date)}</span><span style={{ color: "#a89070", fontSize: 12 }}>{v.mfg}</span></Row>
                ))}
            </Section>
            <Section title="Notes">
              <div style={{ color: "#5a4a35", fontSize: 14, lineHeight: 1.6 }}>{selectedAnimal.notes || "—"}</div>
            </Section>
            <div style={{ marginTop: 32, borderTop: "1px solid #ddd6c4", paddingTop: 20 }}>
              {!confirmDelete
                ? <button onClick={() => setConfirmDelete(true)} style={btnStyle("#c1440e", "#fff")}>Remove Animal</button>
                : <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <span style={{ color: "#c1440e", fontSize: 13 }}>Are you sure?</span>
                  <button onClick={deleteAnimal} style={btnStyle("#c1440e", "#fff")}>Yes, Remove</button>
                  <button onClick={() => setConfirmDelete(false)} style={btnStyle("#a89070", "#fff")}>Cancel</button>
                </div>}
            </div>
          </div>
        )}

        {view === "add" && (
          <div>
            <div style={{ fontSize: 20, fontWeight: "bold", marginBottom: 20 }}>Add New Animal</div>
            <Section title="Identification">
              <Grid2>
                <LabeledInput label="Tag #" value={addForm.tag} onChange={v => setAddForm(p => ({ ...p, tag: v }))} placeholder="e.g. 210" />
                <LabeledInput label="Date of Birth" type="date" value={addForm.dob} onChange={v => setAddForm(p => ({ ...p, dob: v }))} />
                <div>
                  <div style={labelStyle}>Sex</div>
                  <select value={addForm.sex} onChange={e => setAddForm(p => ({ ...p, sex: e.target.value }))} style={inputStyle}>
                    <option>Heifer</option><option>Bull</option><option>Steer</option><option>Cow</option>
                  </select>
                </div>
                <div>
                  <div style={labelStyle}>Generation</div>
                  <select value={addForm.generation} onChange={e => setAddForm(p => ({ ...p, generation: e.target.value }))} style={inputStyle}>
                    <option>F1</option><option>F2</option><option>F3</option><option>Full Blood</option><option>Commercial</option>
                  </select>
                </div>
                <LabeledInput label="Bloodline %" value={addForm.bloodline} onChange={v => setAddForm(p => ({ ...p, bloodline: v }))} placeholder="e.g. 75% Wagyu / 25% Angus" />
                <LabeledInput label="AWA Reg #" value={addForm.awaReg} onChange={v => setAddForm(p => ({ ...p, awaReg: v }))} />
                <LabeledInput label="Brand Cert #" value={addForm.brandCert} onChange={v => setAddForm(p => ({ ...p, brandCert: v }))} />
              </Grid2>
            </Section>
            <Section title="Lineage">
              <Grid2>
                <LabeledInput label="Sire" value={addForm.sire} onChange={v => setAddForm(p => ({ ...p, sire: v }))} />
                <LabeledInput label="Dam" value={addForm.dam} onChange={v => setAddForm(p => ({ ...p, dam: v }))} />
                <LabeledInput label="Grand Sire" value={addForm.grandSire} onChange={v => setAddForm(p => ({ ...p, grandSire: v }))} />
                <LabeledInput label="Grand Dam" value={addForm.grandDam} onChange={v => setAddForm(p => ({ ...p, grandDam: v }))} />
              </Grid2>
            </Section>
            <Section title="Notes">
              <textarea value={addForm.notes} onChange={e => setAddForm(p => ({ ...p, notes: e.target.value }))} rows={3}
                style={{ ...inputStyle, width: "100%", resize: "vertical", fontFamily: "Georgia, serif" }} placeholder="Any notes about this animal..." />
            </Section>
            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
              <button onClick={addAnimal} disabled={!addForm.tag} style={btnStyle("#2c2416", "#f5f0e8")}>Save Animal</button>
              <button onClick={() => { setView("herd"); setAddForm({ ...EMPTY_ANIMAL }); }} style={btnStyle("#a89070", "#fff")}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Root App ──────────────────────────────────────────────────
export default function App() {
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem("v2_auth") === "1");
  // The cookie is the real gate; this flag only remembers which screen to show.
  // If the session expires the API returns 401 and we drop back to the gate.
  const lock = () => { sessionStorage.removeItem("v2_auth"); setUnlocked(false); };
  if (!unlocked) return <PasswordGate onUnlock={() => { sessionStorage.setItem("v2_auth", "1"); setUnlocked(true); }} />;
  return <HerdApp onUnauthorized={lock} />;
}
