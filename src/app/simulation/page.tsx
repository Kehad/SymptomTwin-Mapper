"use client";

import { useState, useEffect } from "react";
import { DTP } from "@ontomorph/dtp-sdk";
import { SimulationCanvas } from "@/components/SimulationCanvas";
import { getCurrentUserAction } from "@/app/actions/auth";
import { UserProfile, UserMedication } from "@/lib/auth-store";
import { Activity, Zap, Pill, ShieldCheck } from "lucide-react";

const DEFAULT_MEDS: UserMedication[] = [
  { name: "Atorvastatin", rxNormId: 83367, system: "cardiovascular" },
  { name: "Clopidogrel", rxNormId: 32968, system: "cardiovascular" },
  { name: "Omeprazole", rxNormId: 7646, system: "hepatic" },
];

export default function SimulationPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [twin, setTwin] = useState<any>(null);
  const [meds, setMeds] = useState<UserMedication[]>(DEFAULT_MEDS);
  const [selectedDrug, setSelectedDrug] = useState<string>("Clopidogrel");

  useEffect(() => {
    async function loadUserSession() {
      const res = await getCurrentUserAction();
      if (res.success && res.user) {
        setUser(res.user);
        if (res.user.medications && res.user.medications.length > 0) {
          setMeds(res.user.medications);
          setSelectedDrug(res.user.medications[0].name);
        }
      }
    }
    loadUserSession();
  }, []);

  useEffect(() => {
    const dtpClient = new DTP({
      apiKey: process.env.NEXT_PUBLIC_DTP_KEY || "dtp_live_demo_key",
    });

    async function initTwin() {
      try {
        const targetToken = user?.grantToken || "dtp_grant_dr_smith_cardio_twin_9921";
        const connectedTwin = await dtpClient.twins.connect(targetToken);
        setTwin(connectedTwin);
      } catch (e) {
        console.log("Running twin in sandbox mode:", e);
      }
    }

    initTwin();
  }, [user]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
          <Activity className="w-7 h-7 text-cyan-600" /> 3D Organ Impact Simulation
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Explore 3D Digital Twin organ telemetry across Cardiovascular, Renal, and Hepatic systems.
        </p>
      </div>

      {/* Target Drug Banner */}
      <div className="card-clean p-5 rounded-2xl flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <Pill className="w-5 h-5 text-cyan-600" />
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
            Select Prescription Target:
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {meds.map((med) => (
            <button
              key={med.name}
              onClick={() => setSelectedDrug(med.name)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                selectedDrug === med.name
                  ? "bg-cyan-600 text-white shadow-sm"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{med.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Simulation Viewport */}
      <div className="card-clean p-6 rounded-2xl">
        <SimulationCanvas twinInstance={twin} selectedDrug={selectedDrug} />
      </div>
    </div>
  );
}
