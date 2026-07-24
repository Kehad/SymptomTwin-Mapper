"use client";

import { useState, useEffect } from "react";
import { getSymptomHistoryAction } from "@/app/actions/symptoms";
import { PatternCluster } from "@/lib/symptom-store";
import {
  TrendingUp,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Activity,
  Clock,
  Zap,
} from "lucide-react";

export default function PatternSpottingPage() {
  const [clusters, setClusters] = useState<PatternCluster[]>([]);

  useEffect(() => {
    async function loadData() {
      const res = await getSymptomHistoryAction();
      setClusters(res.clusters);
    }
    loadData();
  }, []);

  const criticalClusters = clusters.filter((c) => c.clusterSeverity === "critical");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
          <TrendingUp className="w-8 h-8 text-cyan-600" /> Longitudinal Pattern Spotting & Alerts
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Stream past twin events over time to reveal recurring symptom clusters and trigger automated <code className="bg-slate-100 px-1.5 py-0.5 rounded text-cyan-700 font-mono">twin.flag()</code> alerts.
        </p>
      </div>

      {/* Cluster Status Summary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-clean p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-cyan-50 flex items-center justify-center text-cyan-600 shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">Total Symptom Clusters</span>
            <span className="text-base font-bold text-slate-900">{clusters.length} Pattern Clusters</span>
          </div>
        </div>

        <div className="card-clean p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-600 shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">Critical Twin Flags</span>
            <span className="text-base font-bold text-rose-600">{criticalClusters.length} Active Alerts</span>
          </div>
        </div>

        <div className="card-clean p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">Analysis Window</span>
            <span className="text-base font-bold text-emerald-600">Past 7 Days Rolling</span>
          </div>
        </div>
      </div>

      {/* Detected Clusters List */}
      <div className="card-clean p-6 rounded-2xl space-y-5">
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-600" /> Longitudinal System Clusters & Automated Twin Flags
          </h2>
          <span className="text-xs font-mono text-cyan-700 bg-cyan-50 px-3 py-1 rounded-full border border-cyan-100">
            Pattern Engine Active
          </span>
        </div>

        <div className="space-y-4">
          {clusters.map((cluster) => {
            const isCritical = cluster.clusterSeverity === "critical";

            return (
              <div
                key={cluster.id}
                className={`p-5 rounded-2xl border transition ${
                  isCritical
                    ? "bg-rose-50/60 border-rose-200"
                    : "bg-slate-50/50 border-slate-200/80"
                }`}
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                        {cluster.regionName}
                        <span className="capitalize text-xs px-2.5 py-0.5 rounded-full font-mono bg-cyan-100 text-cyan-800 font-semibold">
                          {cluster.system} system
                        </span>
                      </h3>

                      <span
                        className={`px-3 py-0.5 rounded-full text-xs font-mono font-bold ${
                          isCritical
                            ? "bg-rose-600 text-white"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {cluster.clusterSeverity.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {cluster.recommendation}
                    </p>
                  </div>

                  {/* Twin Alert Trigger Status Pill */}
                  <div className="shrink-0 text-right space-y-1">
                    {cluster.flaggedToTwin ? (
                      <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-800 font-mono text-xs font-bold border border-rose-200 flex items-center gap-1.5 shadow-sm">
                        <Zap className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
                        twin.flag() Triggered
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 font-mono text-xs font-semibold">
                        Monitoring Cluster
                      </span>
                    )}
                    <span className="text-[11px] font-mono text-slate-400 block">
                      {cluster.eventCount} events • Avg Severity {cluster.avgSeverity}/10
                    </span>
                  </div>
                </div>

                {/* HPO Codes Breakdown */}
                <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center gap-2 text-xs font-mono text-slate-500">
                  <span className="font-bold text-slate-700">Cluster HPO Codes:</span>
                  {cluster.hpoCodes.map((code) => (
                    <span key={code} className="bg-white px-2 py-0.5 rounded border border-slate-200 text-cyan-700">
                      {code}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}

          {clusters.length === 0 && (
            <p className="text-xs text-slate-500 italic text-center py-8">
              No longitudinal symptom clusters detected yet. Log more symptoms on the Body Map to observe patterns.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
