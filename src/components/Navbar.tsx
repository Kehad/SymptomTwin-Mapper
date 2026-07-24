"use client";

import { useState, useEffect } from "react";
import { getCurrentUserAction, signOutAction } from "@/app/actions/auth";
import { UserProfile } from "@/lib/auth-store";
import { AuthModal } from "@/components/AuthModal";
import { User, LogIn, LogOut } from "lucide-react";

export function Navbar() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    async function loadUserSession() {
      const res = await getCurrentUserAction();
      if (res.success && res.user) {
        setUser(res.user);
      }
    }
    loadUserSession();
  }, []);

  const handleSignOut = async () => {
    await signOutAction();
    setUser(null);
    window.location.reload();
  };

  return (
    <>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(authenticatedUser) => {
          setUser(authenticatedUser);
          window.location.reload();
        }}
      />

      <header className="w-full bg-slate-50 border-b border-slate-200/60 px-6 py-4 flex justify-end items-center">
        {user ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-cyan-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                <User className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="text-sm font-bold text-slate-900 block leading-tight">
                  {user.fullName}
                </span>
                <span className="text-xs text-slate-500 font-medium capitalize">
                  {user.role}
                </span>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              className="ml-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl transition shadow-sm"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl transition shadow-sm flex items-center gap-2"
          >
            <LogIn className="w-4 h-4" /> Sign In
          </button>
        )}
      </header>
    </>
  );
}
