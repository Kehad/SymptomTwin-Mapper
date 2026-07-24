"use client";

import { useState, useEffect } from "react";
import { getSymptomHistoryAction } from "@/app/actions/symptoms";
import { SymptomEvent } from "@/lib/symptom-store";
import {
  Pin,
  Clock,
  Filter,
  ShieldCheck,
  Heart,
  Brain,
  Wind,
  Flame,
  Activity,
} from "lucide-react";

export default function EventsPage() {
  const [events, setEvents] = useState<SymptomEvent[]>([]);
  const [selectedSystem, setSelectedSystem] = useState<string>("all");

  useEffect(() => {
    async function loadData() {
      const res = await getSymptomHistoryAction();
      setEvents(res.events);
    }
    loadData();
  }, []);

  const filteredEvents =
    selectedSystem === "all" ? events : events.filter((ev) => ev.system === selectedSystem);

  const getSystemIcon = (system: string) => {
    switch (system) {
      case "cardiovascular":
        return Heart;
      case "nervous":
        return Brain;
      case "pulmonary":
        return Wind;
      case "digestive":
        return Flame;
      default:
        return Activity;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
          <Pin className="w-8 h-8 text-cyan-600" /> Twin System Pinned Health Events
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Timestamped symptom events pinned directly to patient body systems via the Ontomorph DTP SDK.
        </p>
      </div>

      {/* System Filter Tabs Banner */}
      <div className="card-clean p-4 rounded-2xl flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
          <Filter className="w-4 h-4 text-cyan-600" /> Filter by Target System:
        </div>

        <div className="flex flex-wrap gap-2">
          {["all", "cardiovascular", "nervous", "musculoskeletal", "pulmonary", "digestive"].map((sys) => (
            <button
              key={sys}
              onClick={() => setSelectedSystem(sys)}
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

      {/* Events List */}
      <div className="card-clean p-6 rounded-2xl space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-600" /> Pinned Event Stream Log
          </h2>
          <span className="text-xs font-mono text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-full border border-cyan-100">
            {filteredEvents.length} Pinned Events
          </span>
        </div>

        <div className="space-y-4">
          {filteredEvents.map((ev) => {
            const Icon = getSystemIcon(ev.system);
            return (
              <div
                key={ev.id}
                className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition hover:border-slate-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-600 shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-base">{ev.symptomName}</h3>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-100 text-cyan-800">
                        Severity: {ev.severity}/10
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Pinned to <strong>{ev.regionName}</strong> • Target System:{" "}
                      <strong className="capitalize">{ev.system}</strong>
                    </p>
                    {ev.notes && (
                      <p className="text-xs text-slate-600 mt-1 italic">"{ev.notes}"</p>
                    )}
                  </div>
                </div>

                <div className="text-right text-xs font-mono space-y-1">
                  <span className="text-cyan-700 font-bold block">{ev.hpo.hpoCode} — {ev.hpo.hpoName}</span>
                  <span className="text-slate-400 block">{new Date(ev.timestamp).toLocaleString()}</span>
                </div>
              </div>
            );
          })}

          {filteredEvents.length === 0 && (
            <p className="text-xs text-slate-500 italic text-center py-8">No pinned events match the selected system filter.</p>
          )}
        </div>
      </div>
    </div>
  );
}
