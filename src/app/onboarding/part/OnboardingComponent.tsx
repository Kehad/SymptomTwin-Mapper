"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveHealthProfileAction } from "@/app/actions/health-profile";
import {
  User,
  Activity,
  Heart,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Ruler,
  Weight,
  Flame,
  Pill,
  HeartPulse,
  Plus,
  X,
} from "lucide-react";

const CONDITIONS_LIST = [
  { id: "hypertension", label: "Hypertension (High Blood Pressure)" },
  { id: "diabetes", label: "Type 2 Diabetes" },
  { id: "type1_diabetes", label: "Type 1 Diabetes" },
  { id: "heart_disease", label: "Heart Disease / Coronary Artery Disease" },
  { id: "asthma", label: "Asthma" },
  { id: "copd", label: "COPD / Chronic Bronchitis" },
  { id: "arthritis", label: "Arthritis / Joint Disease" },
  { id: "depression", label: "Depression" },
  { id: "anxiety", label: "Anxiety Disorder" },
  { id: "thyroid_disorder", label: "Thyroid Disorder" },
  { id: "chronic_kidney_disease", label: "Chronic Kidney Disease" },
  { id: "migraine", label: "Migraines / Chronic Headaches" },
  { id: "sleep_apnea", label: "Sleep Apnea" },
  { id: "osteoporosis", label: "Osteoporosis" },
  { id: "ibs", label: "IBS / Irritable Bowel Syndrome" },
];

export function OnboardingComponent() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1 fields
  const [age, setAge] = useState("");
  const [sex, setSex] = useState<"male" | "female" | "other">("male");
  const [heightCm, setHeightCm] = useState("");
  const [weightKg, setWeightKg] = useState("");

  // Step 2 fields
  const [conditions, setConditions] = useState<string[]>([]);

  // Step 3 fields
  const [medications, setMedications] = useState<string[]>([]);
  const [medInput, setMedInput] = useState("");
  const [smokingStatus, setSmokingStatus] = useState<"never" | "former" | "current">("never");
  const [activityLevel, setActivityLevel] = useState<"sedentary" | "light" | "moderate" | "active" | "very_active">("moderate");

  const toggleCondition = (id: string) => {
    setConditions((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const addMedication = () => {
    const med = medInput.trim();
    if (med && !medications.includes(med)) {
      setMedications((prev) => [...prev, med]);
      setMedInput("");
    }
  };

  const removeMedication = (med: string) => {
    setMedications((prev) => prev.filter((m) => m !== med));
  };

  const handleSubmit = async () => {
    if (!age || !heightCm || !weightKg) {
      setError("Please complete all fields before submitting.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
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
        router.push("/dashboard");
      } else {
        setError(result.error || "Failed to save profile. Please try again.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setSaving(false);
    }
  };

  // BMI Preview
  const bmiPreview =
    heightCm && weightKg
      ? Math.round((parseFloat(weightKg) / Math.pow(parseFloat(heightCm) / 100, 2)) * 10) / 10
      : null;

  const stepTitles = [
    "Personal Health Basics",
    "Chronic Conditions",
    "Lifestyle & Medications",
  ];

  const stepIcons = [User, Heart, Activity];

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-600 flex items-center justify-center shadow-md">
              <HeartPulse className="w-7 h-7 text-white animate-pulse" />
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            Set Up Your Health Profile
          </h1>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            Answer a few quick questions so your Digital Twin dashboard can show accurate, personalised health metrics — calculated just for you.
          </p>
        </div>

        {/* Step Progress Indicator */}
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((s) => {
            const StepIcon = stepIcons[s - 1];
            return (
              <div key={s} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition font-bold text-sm ${
                    s < step
                      ? "bg-emerald-600 text-white"
                      : s === step
                      ? "bg-cyan-600 text-white shadow-md shadow-cyan-200"
                      : "bg-slate-200 text-slate-400"
                  }`}
                >
                  {s < step ? <CheckCircle2 className="w-5 h-5" /> : <StepIcon className="w-5 h-5" />}
                </div>
                <span className={`text-[11px] font-semibold ${s === step ? "text-cyan-700" : "text-slate-400"}`}>
                  Step {s}
                </span>
              </div>
            );
          })}
        </div>

        {/* Step Content Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 space-y-6">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            {(() => { const Icon = stepIcons[step - 1]; return <Icon className="w-5 h-5 text-cyan-600" />; })()}
            {stepTitles[step - 1]}
          </h2>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {error}
            </div>
          )}

          {/* === STEP 1: Personal Basics === */}
          {step === 1 && (
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
          )}

          {/* === STEP 2: Chronic Conditions === */}
          {step === 2 && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500">Select all that apply to you. Leave unchecked if none.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1">
                {CONDITIONS_LIST.map((cond) => {
                  const isSelected = conditions.includes(cond.id);
                  return (
                    <button
                      key={cond.id}
                      type="button"
                      onClick={() => toggleCondition(cond.id)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-xs font-medium text-left transition ${
                        isSelected
                          ? "bg-cyan-50 border-cyan-300 text-cyan-800"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border ${isSelected ? "bg-cyan-600 border-cyan-600" : "border-slate-300"}`}>
                        {isSelected && <CheckCircle2 className="w-3 h-3 text-white" />}
                      </div>
                      {cond.label}
                    </button>
                  );
                })}
              </div>
              {conditions.length === 0 && (
                <p className="text-xs text-slate-400 italic">No conditions selected — this is fine, click Next to continue.</p>
              )}
            </div>
          )}

          {/* === STEP 3: Lifestyle & Medications === */}
          {step === 3 && (
            <div className="space-y-5">
              {/* Smoking Status */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Smoking Status</label>
                <div className="flex gap-2">
                  {(["never", "former", "current"] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSmokingStatus(s)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold capitalize border transition ${
                        smokingStatus === s
                          ? "bg-cyan-600 text-white border-cyan-600"
                          : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {s === "never" ? "Never Smoked" : s === "former" ? "Former Smoker" : "Current Smoker"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Activity Level */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Physical Activity Level</label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {[
                    { id: "sedentary", label: "Sedentary", desc: "Desk job, no exercise" },
                    { id: "light", label: "Light", desc: "1–3 days/week" },
                    { id: "moderate", label: "Moderate", desc: "3–5 days/week" },
                    { id: "active", label: "Active", desc: "6–7 days/week" },
                    { id: "very_active", label: "Very Active", desc: "Twice daily" },
                  ].map((level) => (
                    <button
                      key={level.id}
                      type="button"
                      onClick={() => setActivityLevel(level.id as any)}
                      className={`flex flex-col items-center text-center py-2.5 px-2 rounded-xl border text-xs font-bold transition gap-0.5 ${
                        activityLevel === level.id
                          ? "bg-cyan-50 border-cyan-300 text-cyan-800"
                          : "bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300"
                      }`}
                    >
                      <Flame className={`w-4 h-4 mb-1 ${activityLevel === level.id ? "text-cyan-600" : "text-slate-400"}`} />
                      <span>{level.label}</span>
                      <span className="text-[10px] font-normal opacity-70">{level.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Current Medications */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Current Medications (optional)</label>
                <div className="flex gap-2 mb-2">
                  <div className="relative flex-1">
                    <Pill className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="e.g. Metformin, Aspirin..."
                      value={medInput}
                      onChange={(e) => setMedInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addMedication())}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={addMedication}
                    className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl transition flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Add
                  </button>
                </div>

                {medications.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {medications.map((med) => (
                      <span key={med} className="flex items-center gap-1.5 bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-medium border border-slate-200">
                        <Pill className="w-3 h-3 text-cyan-600" /> {med}
                        <button onClick={() => removeMedication(med)} className="text-slate-400 hover:text-rose-500 transition">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between gap-3">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="px-6 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-bold rounded-xl transition flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={() => {
                if (step === 1 && (!age || !heightCm || !weightKg)) {
                  setError("Please fill in all personal details before continuing.");
                  return;
                }
                setError(null);
                setStep((s) => s + 1);
              }}
              className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold rounded-xl transition flex items-center gap-2"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving}
              className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold rounded-xl transition flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                "Saving Profile..."
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" /> Complete Setup & Go to Dashboard
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
