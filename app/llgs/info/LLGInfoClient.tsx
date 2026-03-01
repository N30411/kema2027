"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase";

export default function LLGInfoClient() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [llg, setLlg] = useState<any>(null);
  const [president, setPresident] = useState<any>(null);
  // Removed unused councilors state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLLGAndProfiles = async () => {
      if (!id) {
        setError("No LLG id provided");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      const supabase = getSupabaseClient();
      if (!supabase) {
        setError("Supabase client not initialized");
        setLoading(false);
        return;
      }
      // Fetch LLG
      const { data: llgData, error: llgError } = await supabase.from("llgs").select("*").eq("id", id).single();
      if (llgError) {
        setError(llgError.message);
        setLoading(false);
        return;
      }
      setLlg(llgData);

      // Fetch President/Mayor
      const { data: presidentData } = await supabase
        .from("supporters")
        .select("*")
        .eq("llg_id", id)
        .or("occupation.ilike.President,occupation.ilike.Mayor")
        .limit(1)
        .maybeSingle();
      setPresident(presidentData);

      // Removed councilors fetch and set

      setLoading(false);
    };
    fetchLLGAndProfiles();
  }, [id]);

  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-[60vh]">
        <div className="rounded-2xl bg-white/10 backdrop-blur-lg shadow-2xl border border-gold-400/20 px-10 py-12 animate-pulse text-lg text-gray-300">
          Loading...
        </div>
      </main>
    );
  }
  if (error) {
    return (
      <main className="flex items-center justify-center min-h-[60vh]">
        <div className="rounded-2xl bg-white/10 backdrop-blur-lg shadow-2xl border border-red-400/30 px-10 py-12 text-lg text-red-400">
          {error}
        </div>
      </main>
    );
  }
  if (!llg) {
    return (
      <main className="flex items-center justify-center min-h-[60vh]">
        <div className="rounded-2xl bg-white/10 backdrop-blur-lg shadow-2xl border border-gold-400/20 px-10 py-12 text-lg text-gray-300">
          No LLG found.
        </div>
      </main>
    );
  }

  return (
    <main className="flex items-center justify-center min-h-[60vh] bg-gradient-to-br from-navy-900 via-navy-800 to-gold-100/10">
      <div className="max-w-4xl w-full rounded-3xl bg-white/10 backdrop-blur-2xl shadow-2xl border border-gold-400/30 px-0 py-0 overflow-hidden">
        {/* President/Mayor Profile Card */}
        <div className="flex flex-col md:flex-row items-center gap-8 bg-gradient-to-r from-navy-800/80 via-navy-700/80 to-gold-100/10 px-10 py-10 border-b border-gold-400/20">
          {llg.name && llg.name.toLowerCase().includes("lae urban") ? (
            <>
              <div className="flex-shrink-0 w-32 h-32 rounded-full overflow-hidden border-4 border-gold-400/40 bg-gradient-to-br from-gold-400/70 to-navy-700/70 flex items-center justify-center">
                <img src="/profile/jacob-maragau.jpg" alt="Jacob Maragau" className="object-cover w-full h-full" onError={(e) => { e.currentTarget.src = 'https://ui-avatars.com/api/?name=Jacob+Maragau&background=FFD700&color=22223b'; }} />
              </div>
              <div className="flex-1">
                <h1 className="text-5xl font-extrabold bg-gradient-to-r from-gold-400 via-gold-500 to-yellow-300 bg-clip-text text-transparent drop-shadow-lg mb-2 tracking-tight">Jacob Maragau</h1>
                <div className="text-lg text-gray-200 mb-1">Mayor</div>
                <div className="flex flex-wrap gap-6 mb-2">
                  <div className="text-base text-gold-100">Phone: <a href="tel:+67571234567" className="underline hover:text-gold-300">+675 7123 4567</a></div>
                  <div className="text-base text-gold-100">Email: <a href="mailto:jacob.maragau@laeurban.gov.pg" className="underline hover:text-gold-300">jacob.maragau@laeurban.gov.pg</a></div>
                </div>
              </div>
            </>
          ) : president ? (
            <>
              <div className="flex-shrink-0 w-32 h-32 rounded-full bg-gradient-to-br from-gold-400/70 to-navy-700/70 flex items-center justify-center text-6xl font-extrabold text-gold-200 border-4 border-gold-400/40">
                {president.full_name?.split(" ").map((n: string) => n[0]).join("")}
              </div>
              <div className="flex-1">
                <h1 className="text-5xl font-extrabold bg-gradient-to-r from-gold-400 via-gold-500 to-yellow-300 bg-clip-text text-transparent drop-shadow-lg mb-2 tracking-tight">{president.full_name}</h1>
                <div className="text-lg text-gray-200 mb-1">{president.occupation || "President/Mayor"}</div>
                <div className="flex flex-wrap gap-6 mb-2">
                  <div className="text-base text-gold-100">Phone: {president.phone}</div>
                  {president.gender && <div className="text-base text-gold-100">Gender: {president.gender}</div>}
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center w-full">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gray-400/30 to-navy-700/30 flex items-center justify-center text-6xl font-extrabold text-gray-400 border-4 border-gold-400/10 mb-4">
                <span>?</span>
              </div>
              <div className="flex-1 text-center">
                <h1 className="text-4xl font-bold text-gray-400 mb-2">No President/Mayor Found</h1>
                <div className="text-lg text-gray-300">No profile available for this LLG.</div>
              </div>
            </div>
          )}
        </div>
        {/* ...existing code... */}
      </div>
    </main>
  );
}
