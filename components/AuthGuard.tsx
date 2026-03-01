"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    const checkAuth = async () => {
      if (pathname === "/login") return;
      const supabase = getSupabaseClient();
      const session = supabase.auth.getSession ? (await supabase.auth.getSession()).data.session : null;
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user || !session) {
        router.replace("/login");
      }
    };
    checkAuth();
  }, [pathname, router]);
  return <>{children}</>;
}
