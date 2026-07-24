"use client";

import { ShieldAlert, RefreshCw, AlertTriangle, CheckCircle2 } from "lucide-react";
import { DrugInteractionResult } from "@/app/actions/pharma";

interface SafetyScreeningCardProps {
  isLoadingSafety: boolean;
  interactions: DrugInteractionResult | null;
  medCount: number;
}

export function SafetyScreeningCard({
  isLoadingSafety,
  interactions,
  medCount,
}: SafetyScreeningCardProps) {
  return (
    <div className="card-clean p-6 rounded-2xl space-y-5 bg-white border border-slate-200">
      <div className="flex justify-between items-center">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-cyan-600" /> HOLON Clinical Safety Screening
        </h2>
        {isLoadingSafety && <RefreshCw className="w-4 h-4 text-cyan-600 animate-spin" />}
      </div>

      {interactions?.hasInteractions ? (
        <div className="p-5 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800 text-xs space-y-4">
          <div className="flex items-center gap-2.5 font-bold text-amber-900 text-sm">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            {interactions.totalInteractions} Interaction Alert(s) Detected
          </div>
          <p className="text-amber-800 leading-relaxed">
            HOLON cross-screened {medCount} active prescriptions against 1.7M interaction profiles.
          </p>

          {/* Details */}
          {interactions.details?.length > 0 && (
            <div className="space-y-3 pt-2 border-t border-amber-200">
              {interactions.details.map((detail, idx) => (
                <div key={idx} className="bg-white p-4 rounded-xl border border-amber-200 text-xs space-y-1">
                  <div className="flex justify-between font-mono text-amber-900 font-bold">
                    <span>Pair RxNorm: [{detail.pair.join(", ")}]</span>
                    <span className="uppercase px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-300">
                      {detail.severity} severity
                    </span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">{detail.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs flex items-center gap-3">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
          <span className="leading-relaxed font-medium">
            No high-risk polypharmacy interactions detected across active prescriptions. Patient metabolic clearance operating normally.
          </span>
        </div>
      )}
    </div>
  );
}
