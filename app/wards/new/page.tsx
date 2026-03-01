"use client";

import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout";
import { Card, Button } from "@/components/ui";
import { getSupabaseClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AddWardPage() {
  const [llgs, setLlgs] = useState<any[]>([]);
  const [llgId, setLlgId] = useState("");
  const [wardName, setWardName] = useState("");
  const [councilor, setCouncilor] = useState("");
  const [population, setPopulation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchLlgs = async () => {
      const supabase = getSupabaseClient();
      if (!supabase) return;
      const { data, error } = await supabase.from("llgs").select("id, name, district");
      if (!error && data) setLlgs(data);
    };
    fetchLlgs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      if (!wardName || !llgId) throw new Error("Ward name and LLG are required");
      const supabase = getSupabaseClient();
      if (!supabase) throw new Error("Supabase client not initialized");
      const { error } = await supabase
        .from("wards")
        .insert([
          {
            name: wardName,
            llg_id: llgId,
            councilor: councilor || null,
            population: population ? Number(population) : null,
          }
        ].map((w) => ({ ...w })) as any);
      if (error) throw error;
      setSuccess(true);
      setWardName("");
      setLlgId("");
      setCouncilor("");
      setPopulation("");
      setTimeout(() => router.push("/wards"), 1200);
    } catch (err: any) {
      setError(err.message || "Failed to add ward");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout title="Add Ward">
      <Card className="max-w-lg mx-auto mt-10 p-8">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Ward Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 rounded border border-gray-400 text-black"
              value={wardName}
              onChange={e => setWardName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Councilor Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 rounded border border-gray-400 text-black"
              value={councilor}
              onChange={e => setCouncilor(e.target.value)}
              placeholder="Optional"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Total Population</label>
            <input
              type="number"
              className="w-full px-3 py-2 rounded border border-gray-400 text-black"
              value={population}
              onChange={e => setPopulation(e.target.value)}
              placeholder="Optional"
              min={0}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-semibold">LLG</label>
            <select
              className="w-full px-3 py-2 rounded border border-gray-400 text-black"
              value={llgId}
              onChange={e => setLlgId(e.target.value)}
              required
            >
              <option value="">Select LLG</option>
              {llgs.map(llg => (
                <option key={llg.id} value={llg.id}>
                  {llg.name} ({llg.district})
                </option>
              ))}
            </select>
          </div>
          {error && <div className="mb-4 text-red-500">{error}</div>}
          {success && <div className="mb-4 text-green-600">Ward added!</div>}
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? "Adding..." : "Add Ward"}
          </Button>
        </form>
      </Card>
    </AppLayout>
  );
}
