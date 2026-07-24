"use client";

import { useState } from "react";
import { SymptomEvent } from "@/lib/symptom-store";
import {
  Brain,
  Heart,
  Wind,
  Flame,
  Activity,
  Plus,
  MapPin,
  AlertCircle,
} from "lucide-react";

interface BodyMapCanvasProps {
  events: SymptomEvent[];
  onSelectRegion: (region: {
    id: "head" | "chest" | "lungs" | "abdomen" | "joints";
    name: string;
    system: "nervous" | "cardiovascular" | "pulmonary" | "digestive" | "musculoskeletal";
  }) => void;
}

export function BodyMapCanvas({ events, onSelectRegion }: BodyMapCanvasProps) {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  const regions = [
    {
      id: "head" as const,
      name: "Head / Brain Region",
      system: "nervous" as const,
      icon: Brain,
      coords: "top-8 left-1/2 -translate-x-1/2",
      description: "Headaches, Vertigo, Dizziness, Cognitive Fog",
      color: "from-cyan-500 to-blue-500",
    },
    {
      id: "chest" as const,
      name: "Chest / Heart Region",
      system: "cardiovascular" as const,
      icon: Heart,
      coords: "top-28 left-1/2 -translate-x-1/2",
      description: "Chest Pain, Tightness, Palpitations, Angina",
      color: "from-rose-500 to-red-500",
    },
    {
      id: "lungs" as const,
      name: "Lungs & Thorax",
      system: "pulmonary" as const,
      icon: Wind,
      coords: "top-44 left-1/2 -translate-x-1/2",
      description: "Cough, Shortness of Breath, Wheezing, Dyspnea",
      color: "from-sky-500 to-indigo-500",
    },
    {
      id: "abdomen" as const,
      name: "Abdomen & Digestive",
      system: "digestive" as const,
      icon: Flame,
      coords: "top-60 left-1/2 -translate-x-1/2",
      description: "Nausea, Abdominal Cramping, Heartburn, Dyspepsia",
      color: "from-amber-500 to-orange-500",
    },
    {
      id: "joints" as const,
      name: "Joints & Musculoskeletal",
      system: "musculoskeletal" as const,
      icon: Activity,
      coords: "top-80 left-1/2 -translate-x-1/2",
      description: "Joint Pain, Stiffness, Arthralgia, Swelling",
      color: "from-emerald-500 to-teal-500",
    },
  ];

  const getSeverityBadge = (sev: number) => {
    if (sev >= 7) return "bg-rose-500 text-white";
    if (sev >= 4) return "bg-amber-500 text-white";
    return "bg-emerald-500 text-white";
  };

  return (
    <div className="card-clean p-6 rounded-3xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center pb-3 border-b border-slate-100 gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-cyan-600" /> Interactive Anatomical Body Map
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Click directly on any anatomical body region to log symptoms and pin timestamped twin events.
          </p>
        </div>

        <span className="px-3 py-1 bg-cyan-50 text-cyan-700 text-xs font-semibold rounded-full border border-cyan-100 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
          Click Region to Log
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Anatomical Model Viewport */}
        <div className="lg:col-span-5 relative w-full h-[460px] bg-slate-50/70 rounded-2xl border border-slate-200/80 flex items-center justify-center p-4 overflow-hidden">
          {/* Anatomical Body Silhouette Vector Graphics */}
          <div className="relative w-48 h-full flex flex-col items-center">
            {/* Body Silhouette SVG */}
            <svg
              viewBox="0 0 100 240"
              className="w-full h-full text-slate-300 opacity-60 stroke-slate-400 stroke-1 fill-slate-200/50"
            >
              {/* Head */}
              <circle cx="50" cy="22" r="14" />
              {/* Neck */}
              <rect x="46" y="36" width="8" height="8" rx="2" />
              {/* Torso & Chest */}
              <path d="M 30 44 L 70 44 L 66 120 L 34 120 Z" rx="4" />
              {/* Arms */}
              <path d="M 28 44 L 18 110 L 24 112 L 32 50 Z" />
              <path d="M 72 44 L 82 110 L 76 112 L 68 50 Z" />
              {/* Legs */}
              <path d="M 35 120 L 38 220 L 47 220 L 49 120 Z" />
              <path d="M 51 120 L 53 220 L 62 220 L 65 120 Z" />
            </svg>

            {/* Clickable Region Overlay Buttons */}
            {regions.map((reg) => {
              const regionEvents = events.filter((ev) => ev.bodyRegion === reg.id);
              const maxSeverity = regionEvents.length > 0 ? Math.max(...regionEvents.map((e) => e.severity)) : 0;
              const Icon = reg.icon;

              return (
                <button
                  key={reg.id}
                  onClick={() => onSelectRegion(reg)}
                  onMouseEnter={() => setHoveredRegion(reg.id)}
                  onMouseLeave={() => setHoveredRegion(null)}
                  className={`absolute ${reg.coords} group transition-transform duration-200 hover:scale-110 flex items-center justify-center`}
                  title={`Log symptom for ${reg.name}`}
                >
                  <div className="relative">
                    {/* Pulsing Target Ring */}
                    <div
                      className={`w-11 h-11 rounded-full bg-gradient-to-tr ${reg.color} p-0.5 shadow-lg flex items-center justify-center text-white cursor-pointer transition ${
                        hoveredRegion === reg.id ? "ring-4 ring-cyan-300 ring-offset-2 scale-110" : ""
                      }`}
                    >
                      <div className="w-full h-full bg-white/90 rounded-full flex items-center justify-center text-slate-800">
                        <Icon className="w-5 h-5 text-slate-800 group-hover:text-cyan-600 transition" />
                      </div>
                    </div>

                    {/* Active Event Count Pill Badge */}
                    {regionEvents.length > 0 && (
                      <span
                        className={`absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold shadow-md ${getSeverityBadge(
                          maxSeverity
                        )}`}
                      >
                        {regionEvents.length}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Anatomical Region Selector Cards Grid */}
        <div className="lg:col-span-7 space-y-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Anatomical Body Regions:
          </span>

          {regions.map((reg) => {
            const Icon = reg.icon;
            const regionEvents = events.filter((ev) => ev.bodyRegion === reg.id);
            const isHovered = hoveredRegion === reg.id;

            return (
              <div
                key={reg.id}
                onClick={() => onSelectRegion(reg)}
                onMouseEnter={() => setHoveredRegion(reg.id)}
                onMouseLeave={() => setHoveredRegion(null)}
                className={`p-4 rounded-2xl border transition cursor-pointer flex justify-between items-center ${
                  isHovered
                    ? "bg-cyan-50/70 border-cyan-300 shadow-sm"
                    : "bg-slate-50/50 border-slate-200/80 hover:bg-slate-100/60"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${reg.color} flex items-center justify-center text-white shadow-sm`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      {reg.name}
                      {regionEvents.length > 0 && (
                        <span className="text-[11px] font-mono font-semibold text-cyan-700 bg-cyan-100 px-2 py-0.5 rounded-full">
                          {regionEvents.length} Logged
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">{reg.description}</p>
                  </div>
                </div>

                <button className="px-3 py-1.5 bg-white border border-slate-200 hover:border-cyan-500 text-cyan-600 font-bold text-xs rounded-xl transition flex items-center gap-1 shadow-sm shrink-0">
                  <Plus className="w-4 h-4" /> Log Symptom
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
