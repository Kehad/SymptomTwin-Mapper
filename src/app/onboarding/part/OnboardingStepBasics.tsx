"use client";

import { User, Ruler, Weight, Activity } from "lucide-react";

interface OnboardingStepBasicsProps {
  age: string;
  setAge: (val: string) => void;
  sex: "male" | "female" | "other";
  setSex: (val: "male" | "female" | "other") => void;
  heightCm: string;
  setHeightCm: (val: string) => void;
  weightKg: string;
  setWeightKg: (val: string) => void;
  bmiPreview: number | null;
}

export function OnboardingStepBasics({
  age,
  setAge,
  sex,
  setSex,
  heightCm,
  setHeightCm,
  weightKg,
  setWeightKg,
  bmiPreview,
}: OnboardingStepBasicsProps) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Age */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Age (years)</label>
          <div className="relative">
            <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="number"
              min={1} max={120}
              placeholder="e.g. 35"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition"
            />
          </div>
        </div>

        {/* Biological Sex */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Biological Sex</label>
          <select
            value={sex}
            onChange={(e) => setSex(e.target.value as any)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-cyan-500 transition"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other / Prefer not to say</option>
          </select>
        </div>

        {/* Height */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Height (cm)</label>
          <div className="relative">
            <Ruler className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="number"
              min={50} max={250}
              placeholder="e.g. 175"
              value={heightCm}
              onChange={(e) => setHeightCm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition"
            />
          </div>
        </div>

        {/* Weight */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Weight (kg)</label>
          <div className="relative">
            <Weight className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="number"
              min={20} max={300}
              placeholder="e.g. 72"
              value={weightKg}
              onChange={(e) => setWeightKg(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition"
            />
          </div>
        </div>
      </div>

      {/* BMI Live Preview */}
      {bmiPreview && (
        <div className="p-4 rounded-2xl bg-cyan-50 border border-cyan-200 text-sm text-cyan-800 font-medium flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-600" />
          Live BMI Preview: <strong>{bmiPreview}</strong>
          <span className="text-cyan-600 text-xs">
            ({bmiPreview < 18.5 ? "Underweight" : bmiPreview < 25 ? "Normal" : bmiPreview < 30 ? "Overweight" : "Obese"})
          </span>
        </div>
      )}
    </div>
  );
}
