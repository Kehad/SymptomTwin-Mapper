"use client";

import { Flame, Activity, CheckCircle2 } from "lucide-react";

export function InsightsPathwayGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="card-clean p-6 rounded-2xl space-y-3 bg-white border border-slate-200">
        <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
          <Flame className="w-5 h-5" />
        </div>
        <h3 className="text-base font-bold text-slate-900">CYP2C19 Metabolic Pathway</h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          Clopidogrel requires biotransformation by CYP2C19 into its active thiol metabolite. Co-administration of CYP2C19 inhibitors (e.g. Omeprazole) reduces antiplatelet efficacy.
        </p>
      </div>

      <div className="card-clean p-6 rounded-2xl space-y-3 bg-white border border-slate-200">
        <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-600">
          <Activity className="w-5 h-5" />
        </div>
        <h3 className="text-base font-bold text-slate-900">Hemodynamic Strain Index</h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          Beta-blockers (e.g. Metoprolol) attenuate sympathetic cardiac strain. Monitoring baseline heart rate prevents bradycardia when combining with digoxin or non-dihydropyridine CCBs.
        </p>
      </div>

      <div className="card-clean p-6 rounded-2xl space-y-3 bg-white border border-slate-200">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <h3 className="text-base font-bold text-slate-900">Renal Clearance & eGFR</h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          Renal organ digital twins monitor glomerular filtration rate (eGFR) and drug elimination kinetics to prevent nephrotoxicity in polypharmacy regimens.
        </p>
      </div>
    </div>
  );
}
