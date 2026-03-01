"use client"

import { AppLayout } from "@/components/layout"
import { Card, Button } from "@/components/ui"
import Link from "next/link"
import { Plus } from "lucide-react"

export default function AgentsPage() {
  const agents = [
    {
      id: "1",
      name: "Samuel Wangi",
      email: "samuel@campaign.local",
      ward: "Ward 8",
      supporters_count: 45,
    },
    {
      id: "2",
      name: "Grace Mama",
      email: "grace@campaign.local",
      ward: "Ward 3",
      supporters_count: 38,
    },
    {
      id: "3",
      name: "Peter Kele",
      email: "peter@campaign.local",
      ward: "Ward 5",
      supporters_count: 52,
    },
  ]

  return (
    <AppLayout title="Campaign Agents">
      <div className="mb-6 flex justify-end">
        <Link href="/agents/new">
          <Button variant="primary">
            <Plus size={18} className="mr-2 inline" />
            Add Agent
          </Button>
        </Link>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-navy-600">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
                  Ward
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
                  Supporters
                </th>
              </tr>
            </thead>
            <tbody>
              {agents.map((agent) => (
                <tr
                  key={agent.id}
                  className="border-b border-navy-600 hover:bg-navy-600 transition-colors"
                >
                  <td className="px-4 py-3 text-white">{agent.name}</td>
                  <td className="px-4 py-3 text-gray-400">{agent.email}</td>
                  <td className="px-4 py-3 text-gray-400">{agent.ward}</td>
                  <td className="px-4 py-3 font-semibold text-gold-500">
                    {agent.supporters_count}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </AppLayout>
  )
}
