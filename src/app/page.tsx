"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getCurrentUserAction } from "@/app/actions/auth";
import { getSymptomHistoryAction } from "@/app/actions/symptoms";
import { UserProfile } from "@/lib/auth-store";
import { SymptomEvent, PatternCluster } from "@/lib/symptom-store";
import { BodyMapCanvas } from "@/components/BodyMapCanvas";
import { SymptomLogModal } from "@/components/SymptomLogModal";
import { AuthModal } from "@/components/AuthModal";
import {
  MapPin,
  Dna,
  TrendingUp,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  UserPlus,
  LogIn,
  HeartPulse,
  Lock,
  Activity,
  CheckCircle2,
  Clock,
  ShieldAlert,
} from "lucide-react";

export default function HomePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [events, setEvents] = useState<SymptomEvent[]>([]);
  const [clusters, setClusters] = useState<PatternCluster[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<{
    id: "head" | "chest" | "lungs" | "abdomen" | "joints";
    name: string;
    system: "nervous" | "cardiovascular" | "pulmonary" | "digestive" | "musculoskeletal";
  } | null>(null);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  const loadSymptomData = async () => {
    const data = await getSymptomHistoryAction();
    setEvents(data.events);
    setClusters(data.clusters);
  };

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await getCurrentUserAction();
        if (res.success && res.user) {
          setUser(res.user);
          await loadSymptomData();
        }
      } catch (err) {
        console.warn("Unauthenticated visitor on landing page");
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  const handleSelectRegion = (region: {
    id: "head" | "chest" | "lungs" | "abdomen" | "joints";
    name: string;
    system: "nervous" | "cardiovascular" | "pulmonary" | "digestive" | "musculoskeletal";
  }) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    setSelectedRegion(region);
    setIsLogModalOpen(true);
  };

  // If user IS authenticated, render the full Body Map Overview Workspace
  if (user) {
    const criticalClusters = clusters.filter((c) => c.clusterSeverity === "critical");

    return (
      <div className="space-y-8">
        <SymptomLogModal
          isOpen={isLogModalOpen}
          region={selectedRegion}
          onClose={() => setIsLogModalOpen(false)}
          onSuccess={loadSymptomData}
        />

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200/80 pb-5">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
              <MapPin className="w-8 h-8 text-cyan-600" /> SymptomTwin Body Mapper
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Click any anatomical region to log physical symptoms and pin health events to your Digital Twin.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl transition shadow-sm flex items-center gap-2"
          >
            <Activity className="w-4 h-4" /> Go to Full Patient Dashboard
          </Link>
        </div>

        {/* Stat Summary Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="card-clean p-5 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-cyan-50 flex items-center justify-center text-cyan-600 shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium block">Total Symptoms Logged</span>
              <span className="text-base font-bold text-slate-900">{events.length} Twin Events</span>
            </div>
          </div>

          <div className="card-clean p-5 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
              <Dna className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium block">HOLON HPO Concepts</span>
              <span className="text-base font-bold text-emerald-600">100% Mapped</span>
            </div>
          </div>

          <div className="card-clean p-5 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium block">Pattern Clusters</span>
              <span className="text-base font-bold text-amber-600">{clusters.length} Detected</span>
            </div>
          </div>

          <div className="card-clean p-5 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-600 shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium block">Automated Twin Alerts</span>
              <span className="text-base font-bold text-rose-600">
                {criticalClusters.length > 0 ? `${criticalClusters.length} Active Alerts` : "Normal"}
              </span>
            </div>
          </div>
        </div>

        {/* Interactive Body Map Canvas */}
        <BodyMapCanvas events={events} onSelectRegion={handleSelectRegion} />
      </div>
    );
  }

  // If user IS NOT authenticated, render the Small Landing Page
  return (
    <div className="space-y-16 py-6">
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(authenticatedUser) => {
          setUser(authenticatedUser);
          window.location.href = "/dashboard";
        }}
      />

      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto space-y-6 pt-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-bold shadow-sm">
          <Sparkles className="w-4 h-4 text-cyan-600" />
          <span>Powered by Ontomorph DTP & HOLON Phenotype Engine</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Map Your Symptoms Directly onto Your <span className="text-cyan-600">Digital Twin</span>
        </h1>

        <p className="text-slate-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          Log anatomical symptoms with severity ratings, automatically resolve free-text inputs to official **HPO** and **SNOMED CT** codes, and spot longitudinal health patterns over time.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="px-8 py-3.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm rounded-2xl transition shadow-lg shadow-cyan-600/20 flex items-center gap-2"
          >
            <UserPlus className="w-5 h-5" /> Get Started / Register Account
          </button>

          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="px-7 py-3.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-sm rounded-2xl transition shadow-sm flex items-center gap-2"
          >
            <LogIn className="w-5 h-5 text-cyan-600" /> Sign In to Portal
          </button>
        </div>
      </section>

      {/* 3 Key Feature Showcase Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Card 1 */}
        <div className="card-clean p-8 rounded-3xl space-y-4 hover:border-cyan-300 transition">
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 flex items-center justify-center text-cyan-600 shadow-sm">
            <MapPin className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">1. Interactive Body Mapping</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Click directly on 3D anatomical regions (Head, Chest, Lungs, Abdomen, Joints) to record physical symptoms with 1-10 severity heatmaps.
          </p>
        </div>

        {/* Card 2 */}
        <div className="card-clean p-8 rounded-3xl space-y-4 hover:border-cyan-300 transition">
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 flex items-center justify-center text-cyan-600 shadow-sm">
            <Dna className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">2. HOLON Phenotype Resolution</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Automatically translates free-text symptom notes into standardized HPO codes (e.g. <code className="bg-slate-100 px-1 py-0.5 rounded text-cyan-700 font-mono">HP:0001658</code>) and SNOMED CT terms.
          </p>
        </div>

        {/* Card 3 */}
        <div className="card-clean p-8 rounded-3xl space-y-4 hover:border-cyan-300 transition">
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 flex items-center justify-center text-cyan-600 shadow-sm">
            <TrendingUp className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">3. Pattern Spotting & Alerts</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Stream past twin events over time to spot recurring symptom clusters and automatically trigger digital twin risk alerts (<code className="bg-slate-100 px-1 py-0.5 rounded text-cyan-700 font-mono">twin.flag()</code>).
          </p>
        </div>
      </section>

      {/* Security & Access Callout Banner */}
      <section className="card-clean p-8 rounded-3xl border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6 bg-slate-50/60">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-600 text-white flex items-center justify-center shrink-0 shadow-md">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Secure Patient Twin Portal Access</h3>
            <p className="text-xs text-slate-500 mt-1">
              Sign in to unlock full patient dashboard, twin health event stream, HPO resolution engine, and pattern spotting tools.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl transition shadow-sm shrink-0 flex items-center gap-2"
        >
          <span>Sign In / Register</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>
    </div>
  );
}