"use client"

import { AppLayout } from "@/components/layout"
import { Card, Button } from "@/components/ui"
import Link from "next/link"
import { Plus } from "lucide-react"

export default function EventsPage() {
  const events = [
    {
      id: "1",
      title: "Community Rally - Ward 3",
      location: "Ward 3 Community Center",
      date: "2026-03-15",
      attendance: 128,
    },
    {
      id: "2",
      title: "Youth Engagement Forum",
      location: "LLG 2 Hall",
      date: "2026-03-10",
      attendance: 85,
    },
    {
      id: "3",
      title: "Supporter Appreciation Event",
      location: "Lae City Hall",
      date: "2026-03-05",
      attendance: 200,
    },
  ]

  return (
    <AppLayout title="Campaign Events">
      <div className="mb-6 flex justify-end">
        <Link href="/events/new">
          <Button variant="primary">
            <Plus size={18} className="mr-2 inline" />
            Create Event
          </Button>
        </Link>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-navy-600">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
                  Event Title
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
                  Location
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
                  Attendance
                </th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr
                  key={event.id}
                  className="border-b border-navy-600 hover:bg-navy-600 transition-colors"
                >
                  <td className="px-4 py-3 text-white">{event.title}</td>
                  <td className="px-4 py-3 text-gray-400">{event.location}</td>
                  <td className="px-4 py-3 text-gray-400">
                    {new Date(event.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 font-semibold text-gold-500">
                    {event.attendance}
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
