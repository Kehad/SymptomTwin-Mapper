"use client";

import { Activity, Zap } from "lucide-react";
import { PatternCluster } from "@/lib/symptom-store";

interface PatternClusterListProps {
  clusters: PatternCluster[];
}

export function PatternClusterList({ clusters }: PatternClusterListProps) {
  return (
    <div className="card-clean p-6 rounded-2xl space-y-5 bg-white border border-slate-200">
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
  );
}
