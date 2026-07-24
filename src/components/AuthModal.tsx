"use client";

import { useState } from "react";
import { signInAction, signUpAction, AuthActionResult } from "@/app/actions/auth";
import { UserProfile } from "@/lib/auth-store";
import {
  Lock,
  User,
  UserPlus,
  LogIn,
  ShieldCheck,
  X,
  Stethoscope,
  UserCheck,
  Sparkles,
  HeartPulse,
} from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserProfile) => void;
}

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<"doctor" | "patient" | "researcher">("doctor");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      let result: AuthActionResult;
      if (tab === "signin") {
        result = await signInAction({ username, password });
      } else {
        result = await signUpAction({
          username,
          password,
          fullName: fullName || username,
          role,
        });
      }

      if (result.success && result.user) {
        onSuccess(result.user);
        onClose();
        setUsername("");
        setPassword("");
        setFullName("");
      } else {
        setError(result.error || "Authentication failed. Please check your credentials.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const fillQuickAccount = (demoUsername: string) => {
    setUsername(demoUsername);
    setPassword("password123");
    setTab("signin");
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden relative glass-panel">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 transition p-2 rounded-full hover:bg-slate-800/80"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Banner */}
        <div className="bg-gradient-to-br from-cyan-950/80 via-slate-900 to-slate-950 p-6 border-b border-slate-800/80 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center gap-2 text-cyan-400 font-extrabold text-xl tracking-tight mb-1">
            <HeartPulse className="w-6 h-6 text-cyan-400 animate-pulse" />
            <span>PharmaTwin Portal</span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">
            Sign in to access your human digital twin profile, personalized organ simulations, and Ontomorph DTP clinical grants.
          </p>

          {/* Quick Demo Selector */}
          <div className="mt-4 pt-3 border-t border-slate-800/80">
            <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider block mb-2 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-400" /> Demo Clinical Accounts:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => fillQuickAccount("dr_smith")}
                className="text-xs px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-cyan-950 hover:border-cyan-500/50 border border-slate-800 text-cyan-300 font-medium transition flex items-center gap-1.5 shadow-sm"
              >
                <Stethoscope className="w-3.5 h-3.5 text-cyan-400" /> Dr. Smith (Cardiologist)
              </button>
              <button
                type="button"
                onClick={() => fillQuickAccount("patient_jane")}
                className="text-xs px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-cyan-950 hover:border-cyan-500/50 border border-slate-800 text-cyan-300 font-medium transition flex items-center gap-1.5 shadow-sm"
              >
                <UserCheck className="w-3.5 h-3.5 text-cyan-400" /> Jane Doe (Patient Twin)
              </button>
            </div>
          </div>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex border-b border-slate-800/80 bg-slate-950/40 p-1 gap-1">
          <button
            onClick={() => {
              setTab("signin");
              setError(null);
            }}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition ${
              tab === "signin"
                ? "bg-cyan-600 text-white shadow-md shadow-cyan-950"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <LogIn className="w-3.5 h-3.5" /> Sign In
          </button>
          <button
            onClick={() => {
              setTab("signup");
              setError(null);
            }}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition ${
              tab === "signup"
                ? "bg-cyan-600 text-white shadow-md shadow-cyan-950"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" /> Register Account
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium leading-relaxed">
              {error}
            </div>
          )}

          {tab === "signup" && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Sarah Smith"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Username</label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
              <input
                type="text"
                required
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
              <input
                type="password"
                required
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
              />
            </div>
          </div>

          {tab === "signup" && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Clinical Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-cyan-500 transition"
              >
                <option value="doctor">Cardiologist / Physician</option>
                <option value="patient">Patient Digital Twin</option>
                <option value="researcher">Clinical Pharmacologist</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-3 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white font-bold py-3 rounded-xl text-sm transition shadow-lg shadow-cyan-950/50 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : tab === "signin" ? (
              <>
                <LogIn className="w-4 h-4" /> Sign In to PharmaTwin Guard
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" /> Create Profile & Provision Twin
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
