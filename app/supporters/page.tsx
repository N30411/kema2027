"use client"


import { useState, useEffect } from "react"
import Link from "next/link"
import { AppLayout } from "@/components/layout"
import { Button, Card, FormInput } from "@/components/ui"
import { Plus, Edit2, Trash2 } from "lucide-react"
import { getSupabaseClient } from "@/lib/supabase"

export default function SupportersPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const [supporters, setSupporters] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchSupporters = async () => {
      setIsLoading(true)
      setError("")
      try {
        const supabase = getSupabaseClient();
        if (!supabase) {
          setError("Supabase client not initialized");
          setIsLoading(false);
          return;
        }
        const { data, error } = await supabase
          .from("supporters")
          .select("id, full_name, phone, ward:ward_id, support_level");
        if (error) throw error;
        setSupporters(data || []);
      } catch (err: any) {
        setError("Failed to load supporters.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchSupporters()
  }, [])

  const getSupportLevelColor = (level: string) => {
    switch (level) {
      case "Strong":
        return "text-green-400"
      case "Leaning":
        return "text-yellow-400"
      case "Undecided":
        return "text-gray-400"
      case "Opposition":
        return "text-red-400"
      default:
        return "text-gray-400"
    }
  }

  // Filter supporters by search
  const filteredSupporters = supporters.filter((s) =>
    s.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.phone.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <AppLayout title="Supporters Management">
      {/* Header with search and add button */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <FormInput
          placeholder="Search by name or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="md:max-w-xs"
        />
        <Link href="/supporters/new">
          <Button variant="primary" size="md">
            <Plus size={18} className="mr-2 inline" />
            Add Supporter
          </Button>
        </Link>
      </div>

      {/* Supporters Table or Empty State */}
      <Card>
        {isLoading ? (
          <div className="py-12 text-center text-gray-400">Loading supporters...</div>
        ) : error ? (
          <div className="py-12 text-center text-red-400">{error}</div>
        ) : filteredSupporters.length === 0 ? (
          <div className="py-12 text-center text-gray-400">
            No supporters found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-navy-600">
                  <th className="px-4 py-3 text-left font-semibold text-gray-300">Name</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-300">Phone</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-300">Ward</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-300">Support Level</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSupporters.map((supporter) => (
                  <tr
                    key={supporter.id}
                    className="border-b border-navy-600 hover:bg-navy-600 transition-colors"
                  >
                    <td className="px-4 py-3 text-white">{supporter.full_name}</td>
                    <td className="px-4 py-3 text-gray-400">{supporter.phone}</td>
                    <td className="px-4 py-3 text-gray-400">{supporter.ward}</td>
                    <td className={`px-4 py-3 font-semibold ${getSupportLevelColor(supporter.support_level)}`}>
                      {supporter.support_level}
                    </td>
                    <td className="flex justify-end gap-2 px-4 py-3">
                      <Link href={`/supporters/${supporter.id}`}>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="inline-flex"
                        >
                          <Edit2 size={16} />
                        </Button>
                      </Link>
                      <Button variant="danger" size="sm" disabled>
                        <Trash2 size={16} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </AppLayout>
  )
}
