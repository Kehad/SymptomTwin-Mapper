"use client";

import { Filter } from "lucide-react";

interface EventsFilterBarProps {
  selectedSystem: string;
  onSelectSystem: (sys: string) => void;
}

export function EventsFilterBar({ selectedSystem, onSelectSystem }: EventsFilterBarProps) {
  return (
    <div className="card-clean p-4 rounded-2xl flex flex-wrap justify-between items-center gap-4 bg-white border border-slate-200">
      <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
        <Filter className="w-4 h-4 text-cyan-600" /> Filter by Target System:
      </div>

      <div className="flex flex-wrap gap-2">
        {["all", "cardiovascular", "nervous", "musculoskeletal", "pulmonary", "digestive"].map((sys) => (
          <button
            key={sys}
            onClick={() => onSelectSystem(sys)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition capitalize ${
              selectedSystem === sys
                ? "bg-cyan-600 text-white shadow-sm"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {sys}
          </button>
        ))}
      </div>
    </div>
  );
}
