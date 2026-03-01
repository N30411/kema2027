"use client"

import { useEffect, useState } from "react"
import { AppLayout } from "@/components/layout"
import { Card, Button } from "@/components/ui"
import Link from "next/link"
import { Plus } from "lucide-react"
import { getSupabaseClient } from "@/lib/supabase"
export default function WardsPage() {
  const [wards, setWards] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWards = async () => {
      setLoading(true)
      setError(null)
      try {
        const supabase = getSupabaseClient()
        if (!supabase) throw new Error('Supabase client not initialized')
        // Join with llgs to get llg name
        const { data, error } = await supabase
          .from('wards')
          .select('id, name, llg:llg_id(name, district)')
        if (error) throw error
        setWards(data || [])
      } catch (err: any) {
        setError(err.message || 'Failed to fetch wards')
      } finally {
        setLoading(false)
      }
    }
    fetchWards()
  }, [])
  return (
    <AppLayout title="Ward Management">
      <div className="mb-6 flex justify-end">
        <Link href="/wards/new">
          <Button variant="primary">
            <Plus size={18} className="mr-2 inline" />
            Add Ward
          </Button>
        </Link>
      </div>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-navy-600">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Ward Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">LLG</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={2} className="px-4 py-3 text-center">Loading...</td></tr>
              ) : error ? (
                <tr><td colSpan={2} className="px-4 py-3 text-center text-red-500">{error}</td></tr>
              ) : wards.length === 0 ? (
                <tr><td colSpan={2} className="px-4 py-3 text-center">No wards found.</td></tr>
              ) : (
                wards.map((ward) => (
                  <tr
                    key={ward.id}
                    className="border-b border-navy-600 hover:bg-navy-600 transition-colors"
                  >
                    <td className="px-4 py-3 text-white">{ward.name}</td>
                    <td className="px-4 py-3 text-gray-400">{ward.llg?.name || ''}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </AppLayout>
  )
}
