"use client";

import { Clock } from "lucide-react";
import { SymptomEvent } from "@/lib/symptom-store";

interface DashboardRecentEventsProps {
  events: SymptomEvent[];
}

export function DashboardRecentEvents({ events }: DashboardRecentEventsProps) {
  if (events.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
      <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
        <Clock className="w-5 h-5 text-cyan-600" /> Recent Health Events from Database
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {events.slice(0, 4).map((ev) => (
          <div key={ev.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
            <div className="flex justify-between items-start">
              <span className="font-bold text-slate-900 text-sm">{ev.symptomName}</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-100 text-cyan-800">
                Sev {ev.severity}/10
              </span>
            </div>
            <p className="text-xs text-slate-500">
              <strong>{ev.regionName}</strong> • <span className="capitalize">{ev.system}</span>
            </p>
            <p className="text-xs font-mono text-cyan-700 font-bold">{ev.hpo.hpoCode} — {ev.hpo.hpoName}</p>
            <p className="text-[11px] text-slate-400">{new Date(ev.timestamp).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
