"use client";

import { UserMedication } from "@/lib/auth-store";
import { Zap, Trash2, Sparkles, Search, Plus } from "lucide-react";

interface PrescriptionListCardProps {
  meds: UserMedication[];
  newDrug: string;
  setNewDrug: (val: string) => void;
  onAddDrug: (drugName?: string, rxId?: number) => void;
  onRemoveDrug: (index: number) => void;
  suggestedDrugs: Array<{ name: string; rxNormId: number }>;
}

export function PrescriptionListCard({
  meds,
  newDrug,
  setNewDrug,
  onAddDrug,
  onRemoveDrug,
  suggestedDrugs,
}: PrescriptionListCardProps) {
  return (
    <div className="card-clean p-6 rounded-2xl space-y-5 bg-white border border-slate-200">
      <div className="flex justify-between items-center">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          Active Prescription List
          <span className="w-5 h-5 rounded-full bg-cyan-50 text-cyan-600 text-xs font-bold flex items-center justify-center font-mono">
            {meds.length}
          </span>
        </h2>
      </div>

      {/* Medication List */}
      <div className="space-y-3">
        {meds.map((med, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 flex justify-between items-center"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-600">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-slate-900 text-sm block">{med.name}</span>
                <span className="text-xs text-slate-400">System: Cardiovascular</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-slate-400">RxNorm: {med.rxNormId}</span>
              <button
                onClick={() => onRemoveDrug(idx)}
                className="text-slate-400 hover:text-rose-600 transition p-1.5 rounded-lg hover:bg-rose-50"
                title="Remove prescription"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Add Pills */}
      <div className="pt-2">
        <span className="text-xs font-semibold text-slate-500 block mb-2 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-cyan-600" /> Quick Add Trial Pill:
        </span>
        <div className="flex flex-wrap gap-2">
          {suggestedDrugs.map((drug) => (
            <button
              key={drug.name}
              onClick={() => onAddDrug(drug.name, drug.rxNormId)}
              className="text-xs px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-cyan-50 hover:border-cyan-300 text-cyan-700 font-medium transition shadow-sm"
            >
              + {drug.name}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <div className="flex gap-2 pt-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Enter drug name (e.g. Omeprazole)..."
            value={newDrug}
            onChange={(e) => setNewDrug(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onAddDrug();
            }}
            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition shadow-sm"
          />
        </div>
        <button
          onClick={() => onAddDrug()}
          className="bg-cyan-600 hover:bg-cyan-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-1.5 transition shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>
    </div>
  );
}
