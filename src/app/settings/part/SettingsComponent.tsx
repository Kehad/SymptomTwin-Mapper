"use client";

import { useState, useEffect } from "react";
import { useRequireAuth } from "@/lib/use-auth";
import { getHealthProfileAction, saveHealthProfileAction } from "@/app/actions/health-profile";
import { getDrugInteractionAction } from "@/app/actions/symptoms";
import { HealthProfile } from "@/lib/health-profile-store";
import { User, Activity, Pill, Dna, Key } from "lucide-react";
import { SettingsHeader } from "./SettingsHeader";
import { SettingsProfileTab } from "./SettingsProfileTab";
import { SettingsTwinTab } from "./SettingsTwinTab";
import { SettingsMedicationsTab } from "./SettingsMedicationsTab";

export function SettingsComponent() {
  const { user, loading } = useRequireAuth();
  const [profile, setProfile] = useState<HealthProfile | null>(null);
  const [activeTab, setActiveTab] = useState<"profile" | "twin" | "medications" | "api">("profile");
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Profile state
  const [age, setAge] = useState("");
  const [sex, setSex] = useState<"male" | "female" | "other">("male");
  const [heightCm, setHeightCm] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [smokingStatus, setSmokingStatus] = useState<"never" | "former" | "current">("never");
  const [activityLevel, setActivityLevel] = useState<"sedentary" | "light" | "moderate" | "active" | "very_active">("moderate");
  const [conditions, setConditions] = useState<string[]>([]);

  // Medications & Drug Interactions
  const [medications, setMedications] = useState<string[]>([]);
  const [medInput, setMedInput] = useState("");
  const [interactionResult, setInteractionResult] = useState<any>(null);
  const [interactionLoading, setInteractionLoading] = useState(false);

  useEffect(() => {
    if (user) {
      getHealthProfileAction().then((res) => {
        if (res.success && res.profile) {
          const p = res.profile;
          setProfile(p);
          setAge(String(p.age));
          setSex(p.sex);
          setHeightCm(String(p.heightCm));
          setWeightKg(String(p.weightKg));
          setSmokingStatus(p.smokingStatus);
          setActivityLevel(p.activityLevel);
          setConditions(p.conditions);
          setMedications(p.medications);
        }
      });
    }
  }, [user]);

  const handleSaveProfile = async () => {
    setSaving(true);
    setSaveSuccess(false);
    const result = await saveHealthProfileAction({
      age: parseInt(age),
      sex,
      heightCm: parseFloat(heightCm),
      weightKg: parseFloat(weightKg),
      conditions,
      medications,
      smokingStatus,
      activityLevel,
    });

    if (result.success) {
      setProfile(result.profile ?? null);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
    setSaving(false);
  };

  const checkDrugInteractions = async () => {
    if (medications.length < 2) return;
    setInteractionLoading(true);
    const res = await getDrugInteractionAction(medications);
    setInteractionResult(res);
    setInteractionLoading(false);
  };

  const bmiPreview =
    heightCm && weightKg
      ? Math.round((parseFloat(weightKg) / Math.pow(parseFloat(heightCm) / 100, 2)) * 10) / 10
      : profile?.bmi ?? null;

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Activity className="w-7 h-7 text-cyan-600 animate-spin" />
      </div>
    );
  }

  const TABS = [
    { id: "profile", label: "Health Profile", icon: User },
    { id: "twin", label: "Digital Twin", icon: Dna },
    { id: "medications", label: "Medications & Interactions", icon: Pill },
  ] as const;

  return (
    <div className="space-y-6 p-4 md:p-6">
      <SettingsHeader />

      {/* Tabs */}
      <div className="flex flex-wrap gap-1.5 bg-slate-100/70 p-1.5 rounded-2xl border border-slate-200/80">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
              activeTab === id
                ? "bg-white text-cyan-700 shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>

      {activeTab === "profile" && (
        <SettingsProfileTab
          age={age}
          setAge={setAge}
          sex={sex}
          setSex={setSex}
          heightCm={heightCm}
          setHeightCm={setHeightCm}
          weightKg={weightKg}
          setWeightKg={setWeightKg}
          smokingStatus={smokingStatus}
          setSmokingStatus={setSmokingStatus}
          activityLevel={activityLevel}
          setActivityLevel={setActivityLevel}
          bmiPreview={bmiPreview}
          saving={saving}
          saveSuccess={saveSuccess}
          onSave={handleSaveProfile}
        />
      )}

      {activeTab === "twin" && (
        <SettingsTwinTab grantToken={user.grantToken} />
      )}

      {activeTab === "medications" && (
        <SettingsMedicationsTab
          medInput={medInput}
          setMedInput={setMedInput}
          medications={medications}
          setMedications={setMedications}
          saving={saving}
          onSaveProfile={handleSaveProfile}
          interactionLoading={interactionLoading}
          onCheckInteractions={checkDrugInteractions}
          interactionResult={interactionResult}
        />
      )}

      
    </div>
  );
}
