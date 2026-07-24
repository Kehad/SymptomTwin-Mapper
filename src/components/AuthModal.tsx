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

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition p-2 rounded-full hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Banner */}
        <div className="bg-slate-50 p-6 border-b border-slate-200/80">
          <div className="flex items-center gap-2 text-cyan-600 font-extrabold text-xl tracking-tight mb-1">
            <HeartPulse className="w-6 h-6 text-cyan-600 animate-heartbeat" />
            <span>SymptomTwin Portal</span>
          </div>
          <p className="text-slate-500 text-xs leading-relaxed">
            Sign in or register your account. Powered by Firebase Authentication & Firestore Database.
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex border-b border-slate-200/80 bg-slate-100/60 p-1.5 gap-1">
          <button
            onClick={() => {
              setTab("signin");
              setError(null);
            }}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition ${
              tab === "signin"
                ? "bg-white text-cyan-700 shadow-sm"
                : "text-slate-500 hover:text-slate-900"
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
                ? "bg-white text-cyan-700 shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" /> Register Account
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium leading-relaxed">
              {error}
            </div>
          )}

          {tab === "signup" && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Sarah Smith"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition shadow-sm"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Username</label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                required
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition shadow-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="password"
                required
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition shadow-sm"
              />
            </div>
          </div>

          {tab === "signup" && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Clinical Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-cyan-500 transition shadow-sm"
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
            className="w-full mt-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-xl text-sm transition shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <span>Authenticating</span>
            ) : tab === "signin" ? (
              <>
                <LogIn className="w-4 h-4" /> Sign In to SymptomTwin Portal
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" /> Register & Provision Digital Twin
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
