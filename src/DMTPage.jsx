import React, { useState, useRef } from "react";
import DMTAnimation from "./DMTAnimation.jsx";

export default function DMTPage({ onBack }) {
  const [imgSrc, setImgSrc] = useState(null);
  const fileRef = useRef(null);

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setImgSrc(url);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#000010",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      fontFamily: "Georgia, serif",
    }}>
      {/* Header */}
      <div style={{
        width: "100%",
        background: "rgba(0,0,20,0.9)",
        borderBottom: "1px solid #330044",
        padding: "14px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxSizing: "border-box",
      }}>
        <div>
          <div style={{ fontSize: 10, letterSpacing: 3, color: "#6633aa", textTransform: "uppercase" }}>Hyperdimensional Language Protocol</div>
          <div style={{ fontSize: 18, color: "#cc99ff", fontWeight: "bold", letterSpacing: 1 }}>Laser DMT Trip Code — Animated</div>
        </div>
        {onBack && (
          <button onClick={onBack} style={{
            background: "none", border: "1px solid #6633aa", borderRadius: 6,
            color: "#cc99ff", padding: "6px 16px", cursor: "pointer", fontSize: 12,
            fontFamily: "Georgia, serif",
          }}>← Back</button>
        )}
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "32px 16px", gap: 24, width: "100%", maxWidth: 900, boxSizing: "border-box" }}>
        {!imgSrc ? (
          <div style={{
            border: "2px dashed #440066",
            borderRadius: 16,
            padding: "60px 40px",
            textAlign: "center",
            cursor: "pointer",
            background: "rgba(30,0,50,0.5)",
            width: "100%",
            boxSizing: "border-box",
          }} onClick={() => fileRef.current?.click()}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✦</div>
            <div style={{ fontSize: 18, color: "#cc99ff", marginBottom: 8 }}>Drop in the Laser DMT image</div>
            <div style={{ fontSize: 13, color: "#6633aa" }}>Click to select the image file from your device</div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
          </div>
        ) : (
          <>
            <DMTAnimation imageSrc={imgSrc} />
            <button
              onClick={() => { setImgSrc(null); }}
              style={{
                background: "none", border: "1px solid #440066", borderRadius: 8,
                color: "#9966cc", padding: "8px 20px", cursor: "pointer",
                fontSize: 12, fontFamily: "Georgia, serif",
              }}
            >
              Load different image
            </button>
          </>
        )}

        {/* Animation legend */}
        <div style={{
          width: "100%",
          background: "rgba(20,0,40,0.7)",
          border: "1px solid #330044",
          borderRadius: 12,
          padding: "20px 24px",
          boxSizing: "border-box",
        }}>
          <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#6633aa", marginBottom: 12 }}>Animation Layers</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
            {[
              ["Hue Rotation", "Full spectrum cycle on the base image every ~15s"],
              ["Brightness Pulse", "Breathing glow at 1.8 Hz mimicking 528 Hz"],
              ["Metatron's Cube", "3 concentric rotating wireframe rings w/ glow"],
              ["Particle System", "140 light orbs orbiting sacred geometry paths"],
              ["Frequency Waves", "10 sine waves cycling all vibrational colors"],
              ["Chakra Layer Glow", "Hyperdimensional map layers pulse independently"],
            ].map(([title, desc]) => (
              <div key={title}>
                <div style={{ fontSize: 12, color: "#cc99ff", fontWeight: "bold", marginBottom: 3 }}>{title}</div>
                <div style={{ fontSize: 11, color: "#664488", lineHeight: 1.5 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
