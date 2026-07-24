"use client";

import { HeartPulse, CheckCircle2, User, Heart, Activity } from "lucide-react";

interface OnboardingProgressHeaderProps {
  step: number;
}

export function OnboardingProgressHeader({ step }: OnboardingProgressHeaderProps) {
  const stepIcons = [User, Heart, Activity];

  return (
    <div className="space-y-6">
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
    </div>
  );
}
