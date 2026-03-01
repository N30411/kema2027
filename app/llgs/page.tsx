"use client"


import { useEffect, useState } from "react"
import { AppLayout } from "@/components/layout"
import { Button } from "@/components/ui"
import Link from "next/link"
import { Plus } from "lucide-react"
import { getSupabaseClient } from "@/lib/supabase"
export default function LLGsPage() {
  const [llgs, setLlgs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLLGs = async () => {
      setLoading(true)
      setError(null)
      const supabase = getSupabaseClient()
      if (!supabase) {
        setError("Supabase client not initialized")
        setLoading(false)
        return
      }
      const { data, error } = await supabase.from("llgs").select("id, name, district, wards, president")
      if (error) {
        setError(error.message)
      } else {
        setLlgs(data || [])
      }
      setLoading(false)
    }
    fetchLLGs()
  }, [])

  return (
    <AppLayout title="LLG Management">
      <div className="mb-8 flex justify-between items-center">
        <h2 className="text-4xl font-extrabold bg-gradient-to-r from-gold-400 via-gold-500 to-yellow-300 bg-clip-text text-transparent drop-shadow-lg tracking-tight">LLGs</h2>
        <Link href="/llgs/new">
          <Button variant="primary" className="backdrop-blur-md shadow-xl border-2 border-gold-400/40 hover:scale-105 hover:shadow-2xl transition-transform">
            <Plus size={20} className="mr-2 inline" />
            Add LLG
          </Button>
        </Link>
      </div>

      <div className="rounded-2xl bg-white/10 backdrop-blur-lg shadow-2xl border border-gold-400/20 overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-gray-300 p-8 text-center text-lg animate-pulse">Loading...</div>
          ) : error ? (
            <div className="text-red-400 p-8 text-center text-lg">{error}</div>
          ) : (
            <>
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="bg-gradient-to-r from-navy-800/80 to-navy-700/80">
                    <th className="px-6 py-4 text-left text-base font-bold text-gold-300 tracking-wide">#</th>
                    <th className="px-6 py-4 text-left text-base font-bold text-gold-300 tracking-wide">LLG Name</th>
                    <th className="px-6 py-4 text-left text-base font-bold text-gold-300 tracking-wide">District</th>
                    <th className="px-6 py-4 text-left text-base font-bold text-gold-300 tracking-wide">Wards</th>
                    <th className="px-6 py-4 text-left text-base font-bold text-gold-300 tracking-wide">President</th>
                  </tr>
                </thead>
                <tbody>
                  {llgs.map((llg, idx) => (
                    <tr
                      key={llg.id}
                      className="group border-b border-navy-600/40 hover:bg-gold-400/10 hover:backdrop-blur-md transition-all cursor-pointer"
                    >
                      <td className="px-6 py-4 text-gray-400 group-hover:text-gold-400 font-mono">{idx + 1}</td>
                      <td className="px-6 py-4 text-white font-semibold group-hover:text-gold-300">
                        <Link href={`/llgs/info?id=${llg.id}`} className="hover:underline">
                          {llg.name}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-gray-300 group-hover:text-gold-200">{llg.district}</td>
                      <td className="px-6 py-4 text-gray-300 group-hover:text-gold-200">{llg.wards}</td>
                      <td className="px-6 py-4 text-gray-300 group-hover:text-gold-200">{llg.president}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-6 text-right text-base text-gold-300 font-semibold px-6 pb-4">
                Total LLGs: {llgs.length}
              </div>
            </>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
