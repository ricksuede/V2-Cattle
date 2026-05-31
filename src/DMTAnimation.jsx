import React, { useEffect, useRef, useState } from "react";

// Frequency colors matching the image's vibrational key
const FREQ_COLORS = [
  "#ff2200", // 174 Hz - Red (Earth)
  "#ff6600", // 285 Hz - Orange (Water)
  "#ffee00", // 396 Hz - Yellow (Fire)
  "#44ff44", // 417 Hz - Green (Air)
  "#00ffee", // 528 Hz - Cyan (Ether)
  "#0088ff", // 639 Hz - Blue (Ether)
  "#6600ff", // 741 Hz - Indigo (Ether)
  "#aa00ff", // 852 Hz - Violet (Ether)
  "#ffffff", // 963 Hz - White (All)
  "#ffcc00", // 1111 Hz - Gold (All)
];

// Draws the Metatron's Cube / Flower of Life geometry
function drawMetatron(ctx, cx, cy, r, rotation, alpha) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(cx, cy);
  ctx.rotate(rotation);

  // Outer ring of 6 circles
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI * 2) / 6;
    const x = Math.cos(angle) * r;
    const y = Math.sin(angle) * r;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Center circle
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.stroke();

  // Inner hexagon connecting points
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI * 2) / 6;
    const x = Math.cos(angle) * r;
    const y = Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.stroke();

  // Star of David lines
  for (let i = 0; i < 6; i++) {
    const a1 = (i * Math.PI * 2) / 6;
    const a2 = ((i + 3) * Math.PI * 2) / 6;
    ctx.beginPath();
    ctx.moveTo(Math.cos(a1) * r, Math.sin(a1) * r);
    ctx.lineTo(Math.cos(a2) * r, Math.sin(a2) * r);
    ctx.stroke();
  }

  // Spokes to each outer point from center
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI * 2) / 6;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(angle) * r * 1.9, Math.sin(angle) * r * 1.9);
    ctx.stroke();
  }

  ctx.restore();
}

// Particle class for the floating light system
class Particle {
  constructor(cx, cy, r) {
    this.reset(cx, cy, r);
  }
  reset(cx, cy, r) {
    const angle = Math.random() * Math.PI * 2;
    const orbitR = r * (0.3 + Math.random() * 1.8);
    this.cx = cx;
    this.cy = cy;
    this.orbitR = orbitR;
    this.angle = angle;
    this.speed = (Math.random() > 0.5 ? 1 : -1) * (0.003 + Math.random() * 0.012);
    this.colorIdx = Math.floor(Math.random() * FREQ_COLORS.length);
    this.size = 1.5 + Math.random() * 3;
    this.life = 1;
    this.decay = 0.003 + Math.random() * 0.005;
    this.drift = (Math.random() - 0.5) * 0.001;
  }
  update() {
    this.angle += this.speed;
    this.orbitR += this.drift;
    this.life -= this.decay;
  }
  draw(ctx) {
    const x = this.cx + Math.cos(this.angle) * this.orbitR;
    const y = this.cy + Math.sin(this.angle) * this.orbitR;
    const color = FREQ_COLORS[this.colorIdx];
    ctx.save();
    ctx.globalAlpha = this.life * 0.9;
    // Glow halo
    const grd = ctx.createRadialGradient(x, y, 0, x, y, this.size * 4);
    grd.addColorStop(0, color);
    grd.addColorStop(1, "transparent");
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(x, y, this.size * 4, 0, Math.PI * 2);
    ctx.fill();
    // Core dot
    ctx.globalAlpha = this.life;
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(x, y, this.size * 0.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// Draws animated sine waves mimicking the frequency visualization
function drawWaves(ctx, width, height, t) {
  const waveY = height * 0.82;
  const waveH = height * 0.04;
  FREQ_COLORS.forEach((color, i) => {
    const freq = 0.5 + i * 0.15;
    const speed = 0.8 + i * 0.12;
    const offset = (i / FREQ_COLORS.length) * width;
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = 0.5;
    for (let x = 0; x < width; x += 2) {
      const y = waveY + Math.sin((x / width) * Math.PI * 2 * freq * 3 + t * speed + offset * 0.01) * waveH;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  });
  ctx.globalAlpha = 1;
}

// Main canvas animation loop
function runCanvas(canvas, img) {
  const ctx = canvas.getContext("2d");
  let rotation = 0;
  let t = 0;
  let animId;

  const W = canvas.width;
  const H = canvas.height;

  // Center of Metatron's cube in the image (roughly section 3, center-top area)
  const cx = W * 0.5;
  const cy = H * 0.27;
  const baseR = Math.min(W, H) * 0.065;

  // Spawn particles centered on the geometry
  const particles = Array.from({ length: 140 }, () => new Particle(cx, cy, baseR));

  function frame() {
    ctx.clearRect(0, 0, W, H);

    t += 0.016;
    rotation += 0.004;

    // ── Metatron rings at 3 scales ──
    const colorIdx = Math.floor(t * 0.7) % FREQ_COLORS.length;
    const glowColor = FREQ_COLORS[colorIdx];
    const glowPulse = 0.55 + 0.45 * Math.sin(t * 1.5);

    for (let ring = 0; ring < 3; ring++) {
      const scale = 1 + ring * 0.72;
      const rotDir = ring % 2 === 0 ? 1 : -1;
      const rotSpeed = rotation * (1 - ring * 0.25) * rotDir;
      ctx.strokeStyle = glowColor;
      ctx.lineWidth = 1.2 - ring * 0.3;
      ctx.globalAlpha = (0.5 - ring * 0.12) * glowPulse;
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = 18 - ring * 4;
      drawMetatron(ctx, cx, cy, baseR * scale, rotSpeed, 1);
    }
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;

    // ── Particles ──
    particles.forEach((p, i) => {
      p.update();
      if (p.life <= 0) p.reset(cx, cy, baseR);
      p.draw(ctx);
    });

    // ── Central bloom ──
    const bloom = ctx.createRadialGradient(cx, cy, 0, cx, cy, baseR * 2.5);
    bloom.addColorStop(0, `${glowColor}33`);
    bloom.addColorStop(0.5, `${glowColor}11`);
    bloom.addColorStop(1, "transparent");
    ctx.fillStyle = bloom;
    ctx.globalAlpha = glowPulse * 0.7;
    ctx.beginPath();
    ctx.arc(cx, cy, baseR * 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    // ── Frequency waves ──
    drawWaves(ctx, W, H, t);

    // ── Hyperdimensional map glow pulses (section 9 - bottom left area) ──
    const mapCx = W * 0.28;
    const mapCy = H * 0.77;
    FREQ_COLORS.forEach((color, i) => {
      const layerY = mapCy + (i - 4.5) * (H * 0.018);
      const pulse = 0.3 + 0.3 * Math.sin(t * 1.2 + i * 0.7);
      const grd = ctx.createLinearGradient(mapCx - W * 0.08, layerY, mapCx + W * 0.08, layerY);
      grd.addColorStop(0, "transparent");
      grd.addColorStop(0.3, `${color}55`);
      grd.addColorStop(0.7, `${color}55`);
      grd.addColorStop(1, "transparent");
      ctx.fillStyle = grd;
      ctx.globalAlpha = pulse;
      ctx.fillRect(mapCx - W * 0.1, layerY - H * 0.008, W * 0.2, H * 0.016);
    });
    ctx.globalAlpha = 1;

    animId = requestAnimationFrame(frame);
  }

  animId = requestAnimationFrame(frame);
  return () => cancelAnimationFrame(animId);
}

export default function DMTAnimation({ imageSrc }) {
  const imgRef = useRef(null);
  const canvasRef = useRef(null);
  const stopRef = useRef(null);
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const [hue, setHue] = useState(0);
  const [brightness, setBrightness] = useState(1);

  // CSS filter animation: hue-rotate + brightness pulse
  useEffect(() => {
    let frame;
    let t = 0;
    const tick = () => {
      t += 0.012;
      setHue(h => (h + 0.4) % 360);
      setBrightness(1 + 0.25 * Math.sin(t * 1.8));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  // Canvas setup: wait for image to load and measure
  const handleImgLoad = () => {
    const img = imgRef.current;
    if (!img) return;
    const w = img.offsetWidth;
    const h = img.offsetHeight;
    setDims({ w, h });
  };

  useEffect(() => {
    if (!dims.w || !dims.h) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = dims.w;
    canvas.height = dims.h;
    if (stopRef.current) stopRef.current();
    stopRef.current = runCanvas(canvas);
    return () => { if (stopRef.current) stopRef.current(); };
  }, [dims]);

  return (
    <div style={{
      position: "relative",
      display: "inline-block",
      background: "#000",
      borderRadius: 8,
      overflow: "hidden",
    }}>
      {/* Base image with CSS filter animation */}
      <img
        ref={imgRef}
        src={imageSrc}
        onLoad={handleImgLoad}
        style={{
          display: "block",
          maxWidth: "100%",
          filter: `hue-rotate(${hue}deg) brightness(${brightness}) saturate(1.4) contrast(1.1)`,
          transition: "filter 0.05s linear",
        }}
        alt="Laser DMT Trip Code"
      />

      {/* Canvas overlay: geometry + particles + waves */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          pointerEvents: "none",
          mixBlendMode: "screen",
        }}
      />

      {/* Outer chromatic bloom vignette */}
      <div style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,30,0.6) 100%)",
        mixBlendMode: "multiply",
      }} />
    </div>
  );
}
