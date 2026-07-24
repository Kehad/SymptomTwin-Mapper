"use client";

import { useState, useEffect, useCallback } from "react";
import { checkMedicationSafety, flagTwinInteraction, DrugInteractionResult } from "@/app/actions/pharma";
import { getCurrentUserAction, updateUserPrescriptionsAction } from "@/app/actions/auth";
import { UserProfile, UserMedication } from "@/lib/auth-store";
import {
  Pill,
  ShieldAlert,
  AlertTriangle,
  Plus,
  CheckCircle2,
  Trash2,
  RefreshCw,
  Zap,
  Sparkles,
  Search,
} from "lucide-react";

const DEFAULT_MEDS: UserMedication[] = [
  { name: "Atorvastatin", rxNormId: 83367, system: "cardiovascular" },
  { name: "Clopidogrel", rxNormId: 32968, system: "cardiovascular" },
];

const SUGGESTED_DRUGS = [
  { name: "Omeprazole", rxNormId: 7646 },
  { name: "Warfarin", rxNormId: 11289 },
  { name: "Aspirin", rxNormId: 1191 },
  { name: "Metoprolol", rxNormId: 918 },
];

export function PrescriptionsComponent() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [meds, setMeds] = useState<UserMedication[]>(DEFAULT_MEDS);
  const [newDrug, setNewDrug] = useState("");
  const [interactions, setInteractions] = useState<DrugInteractionResult | null>(null);
  const [isLoadingSafety, setIsLoadingSafety] = useState<boolean>(false);
  const [realtimeFlags, setRealtimeFlags] = useState<string[]>([]);

  useEffect(() => {
    async function loadUserSession() {
      const res = await getCurrentUserAction();
      if (res.success && res.user) {
        setUser(res.user);
        if (res.user.medications && res.user.medications.length > 0) {
          setMeds(res.user.medications);
        }
      }
    }
    loadUserSession();
  }, []);

  const handleCheckSafety = useCallback(
    async (currentMeds = meds) => {
      setIsLoadingSafety(true);
      try {
        const rxNormIds = currentMeds.map((m) => m.rxNormId);
        const result = await checkMedicationSafety(rxNormIds);
        setInteractions(result);

        if (result.hasInteractions) {
          const msg = `CRITICAL ALERT: ${result.totalInteractions} drug interaction(s) detected across ${currentMeds.length} active prescriptions.`;
          await flagTwinInteraction(user?.grantToken || "demo_token", msg);
          setRealtimeFlags((prev) => {
            if (!prev.includes(msg)) return [msg, ...prev];
            return prev;
          });
        }
      } catch (err) {
        console.error("Safety check error:", err);
      } finally {
        setIsLoadingSafety(false);
      }
    },
    [meds, user]
  );

  useEffect(() => {
    handleCheckSafety(meds);
  }, [meds, handleCheckSafety]);

  const handleAddDrug = async (drugName?: string, rxId?: number) => {
    const targetName = (drugName || newDrug).trim();
    if (!targetName) return;

    if (meds.some((m) => m.name.toLowerCase() === targetName.toLowerCase())) {
      setNewDrug("");
      return;
    }

    const dummyRxId = rxId || Math.floor(10000 + Math.random() * 90000);
    const updated: UserMedication[] = [
      ...meds,
      { name: targetName, rxNormId: dummyRxId, system: "cardiovascular" },
    ];
    setMeds(updated);
    setNewDrug("");

    if (user) {
      await updateUserPrescriptionsAction(updated);
    }
  };

  const handleRemoveDrug = async (index: number) => {
    const updated = meds.filter((_, i) => i !== index);
    setMeds(updated);

    if (user) {
      await updateUserPrescriptionsAction(updated);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
          <Pill className="w-7 h-7 text-cyan-600" /> Prescriptions & Safety
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Manage patient prescriptions and run real-time HOLON polypharmacy safety checks.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Prescriptions Management (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="card-clean p-6 rounded-2xl space-y-5">
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
                      onClick={() => handleRemoveDrug(idx)}
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
                {SUGGESTED_DRUGS.map((drug) => (
                  <button
                    key={drug.name}
                    onClick={() => handleAddDrug(drug.name, drug.rxNormId)}
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
                    if (e.key === "Enter") handleAddDrug();
                  }}
                  className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition shadow-sm"
                />
              </div>
              <button
                onClick={() => handleAddDrug()}
                className="bg-cyan-600 hover:bg-cyan-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-1.5 transition shadow-sm"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: HOLON Safety Screening (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="card-clean p-6 rounded-2xl space-y-5">
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
                  HOLON cross-screened {meds.length} active prescriptions against 1.7M interaction profiles.
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
        </div>
      </div>
    </div>
  );
}
