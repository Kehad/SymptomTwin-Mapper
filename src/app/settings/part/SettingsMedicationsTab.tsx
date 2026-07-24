"use client";

import { Pill, X, Save, Zap, RefreshCw, AlertTriangle, CheckCircle2 } from "lucide-react";

interface SettingsMedicationsTabProps {
  medInput: string;
  setMedInput: (val: string) => void;
  medications: string[];
  setMedications: React.Dispatch<React.SetStateAction<string[]>>;
  saving: boolean;
  onSaveProfile: () => void;
  interactionLoading: boolean;
  onCheckInteractions: () => void;
  interactionResult: any;
}

export function SettingsMedicationsTab({
  medInput,
  setMedInput,
  medications,
  setMedications,
  saving,
  onSaveProfile,
  interactionLoading,
  onCheckInteractions,
  interactionResult,
}: SettingsMedicationsTabProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 space-y-6">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Pill className="w-5 h-5 text-cyan-600" /> Active Medications & HOLON Drug Interaction Check
        </h2>

        <p className="text-xs text-slate-500">
          Powered by the HOLON clinical knowledge API — 1.7M known drug interactions across 19 medical vocabularies including RxNorm, DrugBank, and SNOMED CT.
        </p>

        <div>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              placeholder="Add a medication (e.g. Atorvastatin)..."
              value={medInput}
              onChange={(e) => setMedInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && medInput.trim()) {
                  setMedications((prev) => [...prev, medInput.trim()]);
                  setMedInput("");
                }
              }}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500 transition"
            />
            <button
              onClick={() => {
                if (medInput.trim()) {
                  setMedications((prev) => [...prev, medInput.trim()]);
                  setMedInput("");
                }
              }}
              className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl transition"
            >
              Add
            </button>
          </div>

          {medications.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {medications.map((med) => (
                <span key={med} className="flex items-center gap-2 bg-slate-100 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-full text-xs font-medium">
                  <Pill className="w-3 h-3 text-cyan-600" /> {med}
                  <button
                    onClick={() => setMedications((prev) => prev.filter((m) => m !== med))}
                    className="text-slate-400 hover:text-rose-500 transition"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onSaveProfile}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition"
          >
            <Save className="w-4 h-4" /> Save Medications
          </button>

          <button
            onClick={onCheckInteractions}
            disabled={medications.length < 2 || interactionLoading}
            className="flex items-center gap-2 px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl transition disabled:opacity-50"
          >
            {interactionLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            {interactionLoading ? "Checking HOLON..." : "Check Drug Interactions"}
          </button>
        </div>

        {/* Drug Interaction Results */}
        {interactionResult && (
          <div className={`p-5 rounded-2xl border space-y-3 ${
            interactionResult.hasInteractions
              ? "bg-rose-50 border-rose-200"
              : "bg-emerald-50 border-emerald-200"
          }`}>
            <h3 className={`font-bold text-sm flex items-center gap-2 ${
              interactionResult.hasInteractions ? "text-rose-800" : "text-emerald-800"
            }`}>
              {interactionResult.hasInteractions ? (
                <><AlertTriangle className="w-4 h-4" /> Drug Interactions Detected</>
              ) : (
                <><CheckCircle2 className="w-4 h-4" /> No Known Interactions Found</>
              )}
            </h3>

            {interactionResult.interactions?.map((interaction: any, i: number) => (
              <div key={i} className="p-3.5 bg-white/70 rounded-xl border border-rose-200/60 space-y-1">
                <p className="text-xs font-bold text-slate-900">{interaction.drug1} ↔ {interaction.drug2}</p>
                <p className="text-xs text-slate-700">{interaction.description}</p>
                <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full ${
                  interaction.severity === "major"
                    ? "bg-rose-100 text-rose-700"
                    : interaction.severity === "moderate"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-slate-100 text-slate-600"
                }`}>
                  {interaction.severity?.toUpperCase()} severity
                </span>
              </div>
            ))}

            <p className="text-[11px] text-slate-500 font-mono">
              Powered by HOLON · dtp.holon.interactions.check()
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
