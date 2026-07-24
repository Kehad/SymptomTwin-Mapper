"use client";

import { SymptomEvent } from "@/lib/symptom-store";
import { Brain, Heart, Wind, Flame, Activity } from "lucide-react";

export const REGIONS = [
  {
    id: "head" as const,
    name: "Head / Brain Region",
    system: "nervous" as const,
    icon: Brain,
    color: "from-cyan-500 to-blue-500",
    bgColor: "bg-cyan-50",
    borderColor: "border-cyan-200",
    textColor: "text-cyan-700",
    symptoms: ["Headache", "Migraine", "Vertigo", "Dizziness", "Cognitive Fog", "Memory Loss", "Vision Changes"],
  },
  {
    id: "chest" as const,
    name: "Chest / Heart Region",
    system: "cardiovascular" as const,
    icon: Heart,
    color: "from-rose-500 to-red-500",
    bgColor: "bg-rose-50",
    borderColor: "border-rose-200",
    textColor: "text-rose-700",
    symptoms: ["Chest Pain", "Palpitations", "Chest Tightness", "Angina", "Shortness of Breath", "Racing Heart"],
  },
  {
    id: "lungs" as const,
    name: "Lungs & Thorax",
    system: "pulmonary" as const,
    icon: Wind,
    color: "from-sky-500 to-indigo-500",
    bgColor: "bg-sky-50",
    borderColor: "border-sky-200",
    textColor: "text-sky-700",
    symptoms: ["Cough", "Wheezing", "Breathlessness", "Dyspnea", "Chest Congestion", "Haemoptysis"],
  },
  {
    id: "abdomen" as const,
    name: "Abdomen & Digestive",
    system: "digestive" as const,
    icon: Flame,
    color: "from-amber-500 to-orange-500",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    textColor: "text-amber-700",
    symptoms: ["Nausea", "Abdominal Pain", "Heartburn", "Bloating", "Diarrhoea", "Constipation", "Vomiting"],
  },
  {
    id: "joints" as const,
    name: "Joints & Musculoskeletal",
    system: "musculoskeletal" as const,
    icon: Activity,
    color: "from-emerald-500 to-teal-500",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    textColor: "text-emerald-700",
    symptoms: ["Joint Pain", "Arthralgia", "Muscle Ache", "Stiffness", "Swelling", "Back Pain", "Muscle Weakness"],
  },
];

function getSevColor(sev: number) {
  if (sev >= 7) return "bg-rose-500";
  if (sev >= 4) return "bg-amber-500";
  return "bg-emerald-500";
}

interface BodyMapSilhouetteProps {
  events: SymptomEvent[];
  selectedRegion: (typeof REGIONS)[0] | null;
  hoveredRegion: string | null;
  onSelectRegion: (reg: (typeof REGIONS)[0]) => void;
  onHoverRegion: (id: string | null) => void;
}

export function BodyMapSilhouette({
  events,
  selectedRegion,
  hoveredRegion,
  onSelectRegion,
  onHoverRegion,
}: BodyMapSilhouetteProps) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
      <div className="flex flex-col items-center">
        <div className="relative w-52 h-[440px]">
          {/* Body Silhouette SVG */}
          <svg
            viewBox="0 0 100 240"
            className="absolute inset-0 w-full h-full stroke-slate-300 fill-slate-100/60"
          >
            <circle cx="50" cy="22" r="14" />
            <rect x="46" y="36" width="8" height="8" rx="2" />
            <path d="M 30 44 L 70 44 L 66 120 L 34 120 Z" />
            <path d="M 28 44 L 18 110 L 24 112 L 32 50 Z" />
            <path d="M 72 44 L 82 110 L 76 112 L 68 50 Z" />
            <path d="M 35 120 L 38 220 L 47 220 L 49 120 Z" />
            <path d="M 51 120 L 53 220 L 62 220 L 65 120 Z" />
          </svg>

          {/* Clickable Region Overlay Buttons */}
          {[
            { id: "head", top: "5%", left: "50%", translateX: "-50%" },
            { id: "chest", top: "22%", left: "50%", translateX: "-50%" },
            { id: "lungs", top: "35%", left: "50%", translateX: "-50%" },
            { id: "abdomen", top: "48%", left: "50%", translateX: "-50%" },
            { id: "joints", top: "62%", left: "50%", translateX: "-50%" },
          ].map((pos) => {
            const reg = REGIONS.find((r) => r.id === pos.id)!;
            const Icon = reg.icon;
            const regionEvents = events.filter((e) => e.bodyRegion === reg.id);
            const maxSev = regionEvents.length > 0 ? Math.max(...regionEvents.map((e) => e.severity)) : 0;
            const isSelected = selectedRegion?.id === reg.id;
            const isHovered = hoveredRegion === reg.id;

            return (
              <button
                key={reg.id}
                onClick={() => onSelectRegion(reg)}
                onMouseEnter={() => onHoverRegion(reg.id)}
                onMouseLeave={() => onHoverRegion(null)}
                className="absolute transition-transform duration-200"
                style={{ top: pos.top, left: pos.left, transform: `translateX(${pos.translateX})` }}
              >
                <div
                  className={`relative w-12 h-12 rounded-full bg-gradient-to-tr ${reg.color} p-0.5 shadow-lg transition-all duration-200 ${
                    isSelected ? "ring-4 ring-cyan-400 ring-offset-2 scale-125" : isHovered ? "scale-110" : ""
                  }`}
                >
                  <div className="w-full h-full bg-white/90 rounded-full flex items-center justify-center">
                    <Icon className={`w-5 h-5 ${isSelected ? "text-cyan-600" : "text-slate-700"}`} />
                  </div>
                  {regionEvents.length > 0 && (
                    <span className={`absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-[10px] font-bold text-white flex items-center justify-center shadow ${getSevColor(maxSev)}`}>
                      {regionEvents.length}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Region Legend */}
      <div className="mt-4 space-y-1.5 border-t border-slate-100 pt-4">
        {REGIONS.map((reg) => {
          const Icon = reg.icon;
          const count = events.filter((e) => e.bodyRegion === reg.id).length;
          return (
            <button
              key={reg.id}
              onClick={() => onSelectRegion(reg)}
              onMouseEnter={() => onHoverRegion(reg.id)}
              onMouseLeave={() => onHoverRegion(null)}
              className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition text-left ${
                selectedRegion?.id === reg.id
                  ? `${reg.bgColor} ${reg.borderColor} border`
                  : "hover:bg-slate-50 border border-transparent"
              }`}
            >
              <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${reg.color} flex items-center justify-center text-white shrink-0`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-800 flex-1">{reg.name}</span>
              {count > 0 && (
                <span className={`text-[11px] font-bold font-mono px-2 py-0.5 rounded-full ${reg.bgColor} ${reg.textColor}`}>
                  {count} logged
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
