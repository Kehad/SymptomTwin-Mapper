"use client";

import { User, Activity, Save, RefreshCw, CheckCircle2 } from "lucide-react";

interface SettingsProfileTabProps {
  age: string;
  setAge: (val: string) => void;
  sex: "male" | "female" | "other";
  setSex: (val: "male" | "female" | "other") => void;
  heightCm: string;
  setHeightCm: (val: string) => void;
  weightKg: string;
  setWeightKg: (val: string) => void;
  smokingStatus: "never" | "former" | "current";
  setSmokingStatus: (val: "never" | "former" | "current") => void;
  activityLevel: "sedentary" | "light" | "moderate" | "active" | "very_active";
  setActivityLevel: (val: "sedentary" | "light" | "moderate" | "active" | "very_active") => void;
  bmiPreview: number | null;
  saving: boolean;
  saveSuccess: boolean;
  onSave: () => void;
}

export function SettingsProfileTab({
  age,
  setAge,
  sex,
  setSex,
  heightCm,
  setHeightCm,
  weightKg,
  setWeightKg,
  smokingStatus,
  setSmokingStatus,
  activityLevel,
  setActivityLevel,
  bmiPreview,
  saving,
  saveSuccess,
  onSave,
}: SettingsProfileTabProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 space-y-6">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <User className="w-5 h-5 text-cyan-600" /> Personal Health Basics
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Age (years)</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-cyan-500 transition"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Sex</label>
            <select
              value={sex}
              onChange={(e) => setSex(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-cyan-500 transition"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Height (cm)</label>
            <input
              type="number"
              value={heightCm}
              onChange={(e) => setHeightCm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-cyan-500 transition"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Weight (kg)</label>
            <input
              type="number"
              value={weightKg}
              onChange={(e) => setWeightKg(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-cyan-500 transition"
            />
          </div>
        </div>

        {/* BMI Live Preview */}
        {bmiPreview && (
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-cyan-50 border border-cyan-100 text-xs font-medium text-cyan-800">
            <Activity className="w-4 h-4 text-cyan-600" />
            BMI: <strong>{bmiPreview}</strong>
            <span className="text-cyan-600">
              ({bmiPreview < 18.5 ? "Underweight" : bmiPreview < 25 ? "Normal Weight" : bmiPreview < 30 ? "Overweight" : "Obese"})
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-2">Smoking Status</label>
            <div className="flex gap-2">
              {(["never", "former", "current"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSmokingStatus(s)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition border ${
                    smokingStatus === s
                      ? "bg-cyan-600 text-white border-cyan-600"
                      : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {s === "never" ? "Never" : s === "former" ? "Former" : "Current"}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-2">Activity Level</label>
            <select
              value={activityLevel}
              onChange={(e) => setActivityLevel(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-cyan-500 transition"
            >
              <option value="sedentary">Sedentary (no exercise)</option>
              <option value="light">Light (1–3 days/week)</option>
              <option value="moderate">Moderate (3–5 days/week)</option>
              <option value="active">Active (6–7 days/week)</option>
              <option value="very_active">Very Active (2× daily)</option>
            </select>
          </div>
        </div>

        <button
          onClick={onSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm rounded-xl transition disabled:opacity-50"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : saveSuccess ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saving ? "Saving to Supabase..." : saveSuccess ? "Saved!" : "Save Health Profile"}
        </button>
      </div>
    </div>
  );
}
