// src/lib/use-auth.ts
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUserAction } from "@/app/actions/auth";
import { UserProfile } from "@/lib/auth-store";

export function useRequireAuth() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await getCurrentUserAction();
        if (res.success && res.user) {
          setUser(res.user);
        } else {
          // Unauthenticated: redirect to landing page with auth trigger query
          router.push("/?auth=required");
        }
      } catch (err) {
        router.push("/?auth=required");
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [router]);

  return { user, loading };
}
