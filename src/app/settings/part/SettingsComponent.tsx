"use client";

import { useState, useEffect } from "react";
import { useRequireAuth } from "@/lib/use-auth";
import { getHealthProfileAction, saveHealthProfileAction } from "@/app/actions/health-profile";
import { getDrugInteractionAction } from "@/app/actions/symptoms";
import { HealthProfile } from "@/lib/health-profile-store";
import {
  Settings,
  User,
  Activity,
  Pill,
  ShieldCheck,
  Save,
  AlertTriangle,
  RefreshCw,
  Dna,
  Key,
  Heart,
  CheckCircle2,
  X,
  Zap,
  ChevronRight,
} from "lucide-react";

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
      : profile?.bmi;

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
    { id: "api", label: "API & Grant Keys", icon: Key },
  ] as const;

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
          <Settings className="w-7 h-7 text-cyan-600" /> Settings
        </h1>
        <p className="text-slate-500 text-sm mt-1">Manage your health profile, digital twin grant, medications, and API access.</p>
      </div>

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

      {/* === TAB: Health Profile === */}
      {activeTab === "profile" && (
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
              onClick={handleSaveProfile}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm rounded-xl transition disabled:opacity-50"
            >
              {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : saveSuccess ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {saving ? "Saving to Supabase..." : saveSuccess ? "Saved!" : "Save Health Profile"}
            </button>
          </div>
        </div>
      )}

      {/* === TAB: Digital Twin === */}
      {activeTab === "twin" && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 space-y-6">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Dna className="w-5 h-5 text-cyan-600" /> Digital Twin Connection & Systems
            </h2>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="text-sm font-bold text-emerald-800">Twin Grant Active</p>
                  <p className="text-xs text-emerald-700 font-mono mt-0.5">{user.grantToken}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {["cardiovascular", "nervous", "pulmonary", "digestive", "musculoskeletal"].map((sys) => (
                  <div key={sys} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Heart className="w-5 h-5 text-cyan-600" />
                      <div>
                        <span className="text-sm font-bold text-slate-900 capitalize">{sys}</span>
                        <p className="text-[11px] text-slate-500 font-mono">twin.systems.get("{sys}")</p>
                      </div>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                ))}
              </div>

              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">SDK Usage Pattern</h3>
                <pre className="text-[11px] font-mono text-slate-600 bg-slate-900 text-slate-100 p-4 rounded-xl overflow-x-auto">{`import { DTP } from "@ontomorph/dtp-sdk";

const dtp = new DTP({ apiKey: DTP_API_KEY, holonApiKey: HOLON_KEY });
const twin = await dtp.twins.connect(grantToken);

// Stream live events from any body system
twin.events.stream({ system: "cardiovascular" }, (e) => {
  if (Number(e.data.value) > 130) twin.flag("cardiovascular", e);
});

// Query system events
const system = await twin.systems.get("nervous");
console.log(system.events);`}</pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* === TAB: Medications & Interactions === */}
      {activeTab === "medications" && (
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
                onClick={handleSaveProfile}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition"
              >
                <Save className="w-4 h-4" /> Save Medications
              </button>

              <button
                onClick={checkDrugInteractions}
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
      )}

      {/* === TAB: API Keys === */}
      {activeTab === "api" && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 space-y-5">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Key className="w-5 h-5 text-cyan-600" /> API Keys & Ontomorph Platform
            </h2>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <p className="text-xs font-bold text-slate-700">DTP API Key</p>
                <p className="text-xs font-mono text-slate-500">
                  {process.env.NEXT_PUBLIC_DTP_API_KEY
                    ? `${process.env.NEXT_PUBLIC_DTP_API_KEY.slice(0, 16)}...`
                    : "dtp_test_persona...****  (from .env)"}
                </p>
                <p className="text-[11px] text-slate-400">Server-to-server DTP platform authentication</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <p className="text-xs font-bold text-slate-700">HOLON Clinical Knowledge API Key</p>
                <p className="text-xs font-mono text-slate-500">holon_117ff6e390f0...****  (from .env)</p>
                <p className="text-[11px] text-slate-400">
                  19 vocabularies — SNOMED CT, HPO, RxNorm, LOINC, DrugBank, HGNC, ClinVar and more
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <p className="text-xs font-bold text-slate-700">Digital Twin Grant Token</p>
                <p className="text-xs font-mono text-slate-500">{user.grantToken.slice(0, 24)}...</p>
                <p className="text-[11px] text-slate-400">Patient-issued scoped access token for twin operations</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <p className="text-xs font-bold text-slate-700">Supabase Project</p>
                <p className="text-xs font-mono text-slate-500">
                  {process.env.NEXT_PUBLIC_SUPABASE_URL || "https://demo-symptomtwin.supabase.co"}
                </p>
                <p className="text-[11px] text-slate-400">User data, symptom events, health profiles, and pattern clusters</p>
              </div>
            </div>

            <a
              href="https://developer.ontomorph.com/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs font-semibold text-cyan-600 hover:text-cyan-800 transition"
            >
              <ChevronRight className="w-4 h-4" /> View full Ontomorph Developer Documentation
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
