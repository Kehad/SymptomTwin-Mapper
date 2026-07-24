"use client";

import { useEffect, useRef, useState } from "react";
import {
  Activity,
  Heart,
  TrendingUp,
  Sliders,
  Play,
  Pause,
  Loader2,
} from "lucide-react";

interface SimulationCanvasProps {
  twinInstance?: any;
  selectedDrug?: string | null;
}

export function SimulationCanvas({ twinInstance, selectedDrug }: SimulationCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [activeOrgan, setActiveOrgan] = useState<"cardiovascular" | "renal" | "hepatic">("cardiovascular");
  const [isPlaying, setIsPlaying] = useState(true);
  const [isSimulating, setIsSimulating] = useState(false);

  // Canvas 3D rendering for light background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const particles: Array<{
      x: number;
      y: number;
      speed: number;
      radius: number;
      angle: number;
      distance: number;
      color: string;
    }> = [];

    const numParticles = 35;
    const colors = ["#0284c7", "#38bdf8", "#ef4444", "#3b82f6"];

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: 0,
        y: 0,
        speed: 0.008 + Math.random() * 0.015,
        radius: 2.5 + Math.random() * 3,
        angle: Math.random() * Math.PI * 2,
        distance: 40 + Math.random() * 110,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
    };

    resize();
    window.addEventListener("resize", resize);

    const render = () => {
      if (isPlaying) {
        time += 0.03;
      }

      const w = canvas.width;
      const h = canvas.height;
      const cx = w * 0.38; // Position heart slightly left to leave room for right text overlay
      const cy = h / 2;

      ctx.clearRect(0, 0, w, h);

      // 1. Light Grid Lines
      ctx.strokeStyle = "rgba(226, 232, 240, 0.7)";
      ctx.lineWidth = 1;
      const gridSize = 40 * window.devicePixelRatio;
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // 2. Glowing Organ Pulse Target Rings
      const pulse = Math.sin(time * 3) * 6 * window.devicePixelRatio;
      const baseRadius = 60 * window.devicePixelRatio;
      const organRadius = baseRadius + pulse;

      // Subtle Cyan Backdrop Glow
      const gradient = ctx.createRadialGradient(cx, cy, 10, cx, cy, organRadius * 2.2);
      gradient.addColorStop(0, "rgba(56, 189, 248, 0.25)");
      gradient.addColorStop(0.6, "rgba(56, 189, 248, 0.05)");
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(cx, cy, organRadius * 2.2, 0, Math.PI * 2);
      ctx.fill();

      // Target Rings
      ctx.strokeStyle = "rgba(2, 132, 199, 0.4)";
      ctx.lineWidth = 1.5 * window.devicePixelRatio;
      ctx.beginPath();
      ctx.arc(cx, cy, organRadius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = "rgba(56, 189, 248, 0.3)";
      ctx.setLineDash([6 * window.devicePixelRatio, 6 * window.devicePixelRatio]);
      ctx.beginPath();
      ctx.arc(cx, cy, organRadius + 22 * window.devicePixelRatio, time * 0.5, time * 0.5 + Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // 3. Central 3D Wireframe Heart Visualization
      ctx.fillStyle = "#0284c7";
      ctx.beginPath();
      ctx.arc(cx, cy, organRadius * 0.4, 0, Math.PI * 2);
      ctx.fill();

      // 4. Orbiting Telemetry Particles
      particles.forEach((p) => {
        if (isPlaying) {
          p.angle += p.speed;
        }

        const px = cx + Math.cos(p.angle) * (p.distance * window.devicePixelRatio);
        const py = cy + Math.sin(p.angle) * (p.distance * window.devicePixelRatio);

        ctx.strokeStyle = p.color;
        ctx.globalAlpha = 0.35;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(px, py);
        ctx.stroke();

        ctx.globalAlpha = 0.9;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(px, py, p.radius * window.devicePixelRatio, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying]);

  return (
    <div className="space-y-4">
      {/* Organ Tabs Header */}
      <div className="flex flex-wrap justify-between items-center pb-3 border-b border-slate-100 gap-3">
        <div className="flex items-center gap-6 text-sm font-semibold">
          <button
            onClick={() => setActiveOrgan("cardiovascular")}
            className={`pb-3 -mb-3 border-b-2 transition ${
              activeOrgan === "cardiovascular"
                ? "border-cyan-500 text-cyan-600 font-bold"
                : "border-transparent text-slate-400 hover:text-slate-700"
            }`}
          >
            Cardiovascular
          </button>
          <button
            onClick={() => setActiveOrgan("renal")}
            className={`pb-3 -mb-3 border-b-2 transition ${
              activeOrgan === "renal"
                ? "border-cyan-500 text-cyan-600 font-bold"
                : "border-transparent text-slate-400 hover:text-slate-700"
            }`}
          >
            Renal (Kidneys)
          </button>
          <button
            onClick={() => setActiveOrgan("hepatic")}
            className={`pb-3 -mb-3 border-b-2 transition ${
              activeOrgan === "hepatic"
                ? "border-cyan-500 text-cyan-600 font-bold"
                : "border-transparent text-slate-400 hover:text-slate-700"
            }`}
          >
            Hepatic (Liver)
          </button>
        </div>

        <span className="px-3 py-1 rounded-full bg-cyan-50 text-cyan-600 text-xs font-semibold flex items-center gap-1.5 border border-cyan-100">
          <span className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
          Twin Active
        </span>
      </div>

      {/* Telemetry Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-50 flex items-center justify-center text-cyan-600 shrink-0">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-medium block">Organ Strain Index</span>
            <span className="text-sm font-bold text-emerald-600">22% Optimal</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500 shrink-0">
            <Heart className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-medium block">Heart Rhythm</span>
            <span className="text-sm font-bold text-slate-900">72 BPM</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-medium block">Therapeutic Efficacy</span>
            <span className="text-sm font-bold text-emerald-600">94% Score</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-50 flex items-center justify-center text-cyan-600 shrink-0">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-medium block">Metabolic Clearance</span>
            <span className="text-sm font-bold text-slate-900">91% Rate</span>
          </div>
        </div>
      </div>

      {/* Main Canvas Viewport Box */}
      <div className="relative w-full h-[320px] bg-slate-50/50 rounded-2xl border border-slate-200/80 overflow-hidden flex items-center justify-between">
        {/* Render Canvas */}
        <canvas ref={canvasRef} className="w-full h-full object-cover" />

        {/* Right Text Overlay Panel */}
        <div className="absolute right-6 top-12 bottom-12 w-64 p-5 bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-center gap-2">
          <h4 className="text-base font-bold text-slate-900 leading-tight">
            3D Organ Impact <span className="text-cyan-600 block">Canvas Ready</span>
          </h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Click any active prescription or quick-add drug to observe real-time organ strain, metabolic clearance, and long-term 20-year organ survival curves.
          </p>
        </div>
      </div>
    </div>
  );
}