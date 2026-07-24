"use client";

import { useState, useEffect, useCallback } from "react";
import { checkMedicationSafety, flagTwinInteraction, DrugInteractionResult } from "@/app/actions/pharma";
import { getCurrentUserAction, updateUserPrescriptionsAction } from "@/app/actions/auth";
import { UserProfile, UserMedication } from "@/lib/auth-store";
import { Pill } from "lucide-react";
import { PrescriptionListCard } from "./PrescriptionListCard";
import { SafetyScreeningCard } from "./SafetyScreeningCard";

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
        {/* Left Column: Prescriptions Management */}
        <div className="lg:col-span-6 space-y-6">
          <PrescriptionListCard
            meds={meds}
            newDrug={newDrug}
            setNewDrug={setNewDrug}
            onAddDrug={handleAddDrug}
            onRemoveDrug={handleRemoveDrug}
            suggestedDrugs={SUGGESTED_DRUGS}
          />
        </div>

        {/* Right Column: HOLON Safety Screening */}
        <div className="lg:col-span-6 space-y-6">
          <SafetyScreeningCard
            isLoadingSafety={isLoadingSafety}
            interactions={interactions}
            medCount={meds.length}
          />
        </div>
      </div>
    </div>
  );
}
