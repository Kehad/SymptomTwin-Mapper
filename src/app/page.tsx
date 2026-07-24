"use client";

import { useState, useEffect } from "react";
import { getSymptomHistoryAction } from "@/app/actions/symptoms";
import { SymptomEvent, PatternCluster } from "@/lib/symptom-store";
import { BodyMapCanvas } from "@/components/BodyMapCanvas";
import { SymptomLogModal } from "@/components/SymptomLogModal";
import {
  MapPin,
  Activity,
  ShieldAlert,
  Dna,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Plus,
} from "lucide-react";

export default function SymptomBodyMapPage() {
  const [events, setEvents] = useState<SymptomEvent[]>([]);
  const [clusters, setClusters] = useState<PatternCluster[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<{
    id: "head" | "chest" | "lungs" | "abdomen" | "joints";
    name: string;
    system: "nervous" | "cardiovascular" | "pulmonary" | "digestive" | "musculoskeletal";
  } | null>(null);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  const loadData = async () => {
    const data = await getSymptomHistoryAction();
    setEvents(data.events);
    setClusters(data.clusters);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSelectRegion = (region: {
    id: "head" | "chest" | "lungs" | "abdomen" | "joints";
    name: string;
    system: "nervous" | "cardiovascular" | "pulmonary" | "digestive" | "musculoskeletal";
  }) => {
    setSelectedRegion(region);
    setIsLogModalOpen(true);
  };

  const criticalClusters = clusters.filter((c) => c.clusterSeverity === "critical");

  return (
    <div className="space-y-8">
      {/* Symptom Log Modal */}
      <SymptomLogModal
        isOpen={isLogModalOpen}
        region={selectedRegion}
        onClose={() => setIsLogModalOpen(false)}
        onSuccess={loadData}
      />

      {/* Header Banner */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
          <MapPin className="w-8 h-8 text-cyan-600" /> SymptomTwin Mapper
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Interactive Anatomical Body Mapping, HOLON HPO Phenotype Resolution & Digital Twin Event Pinning.
        </p>
      </div>

      {/* 4 Stat Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="card-clean p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-cyan-50 flex items-center justify-center text-cyan-600 shrink-0">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">Total Symptoms Logged</span>
            <span className="text-sm font-bold text-slate-900">{events.length} Twin Events</span>
          </div>
        </div>

        <div className="card-clean p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
            <Dna className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">HOLON HPO Concepts</span>
            <span className="text-sm font-bold text-emerald-600">100% Mapped</span>
          </div>
        </div>

        <div className="card-clean p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">Pattern Clusters</span>
            <span className="text-sm font-bold text-amber-600">{clusters.length} Detected</span>
          </div>
        </div>

        <div className="card-clean p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-600 shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">Automated Twin Alerts</span>
            <span className="text-sm font-bold text-rose-600">
              {criticalClusters.length > 0 ? `${criticalClusters.length} Active twin.flag()` : "Normal"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Interactive Body Map Canvas */}
      <BodyMapCanvas events={events} onSelectRegion={handleSelectRegion} />

      {/* Recent Logged Twin Events Section */}
      <div className="card-clean p-6 rounded-2xl space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-600" /> Recent Anatomical Twin Health Events
          </h2>
          <span className="text-xs text-slate-500 font-mono">Pinned to DTP Systems</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.slice(0, 4).map((ev) => (
            <div key={ev.id} className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-bold text-slate-900 text-sm block">{ev.symptomName}</span>
                  <span className="text-xs text-slate-500">
                    Region: <strong>{ev.regionName}</strong> • System: <strong className="capitalize">{ev.system}</strong>
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-100 text-cyan-800">
                  Sev: {ev.severity}/10
                </span>
              </div>

              <div className="pt-1 border-t border-slate-200/60 flex justify-between items-center text-xs font-mono">
                <span className="text-cyan-700 font-bold">{ev.hpo.hpoCode} — {ev.hpo.hpoName}</span>
                <span className="text-slate-400">{new Date(ev.timestamp).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}