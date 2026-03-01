"use client"

import { useEffect, useState } from "react"
import { AppLayout } from "@/components/layout"
import { StatCard, Card } from "@/components/ui"
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, LineChart, Line } from "recharts"
import { MapPin, Users, TrendingUp } from "lucide-react"
// Removed unused react-leaflet imports
import dynamic from "next/dynamic"
const SupporterMap = dynamic(() => import("@/components/SupporterMap"), { ssr: false })

import { getSupabaseClient } from "@/lib/supabase"

const initialStats = {
  total_supporters: 0,
  strong_supporters: 0,
  total_agents: 0,
  total_wards: 0,
  weekly_growth_percentage: 0,
}

const supportLevelData = [
  { name: "Strong", value: 480, color: "#10b981" },
  { name: "Leaning", value: 380, color: "#f59e0b" },
  { name: "Undecided", value: 280, color: "#6b7280" },
  { name: "Opposition", value: 110, color: "#ef4444" },
]

// LLG data from Supabase
import { LLG } from "@/types"
type LLGWithWards = LLG & { wards?: number }
const initialLlgData: LLGWithWards[] = []

// Removed unused imports and variables
// const supporterLocations = [
//   { lat: -6.5, lng: 146.5, name: "LLG 1", supporters: 150 },
//   { lat: -6.6, lng: 146.6, name: "LLG 2", supporters: 200 },
//   { lat: -6.7, lng: 146.7, name: "LLG 3", supporters: 180 },
//   { lat: -6.8, lng: 146.8, name: "LLG 4", supporters: 220 },
//   { lat: -6.9, lng: 146.9, name: "LLG 5", supporters: 190 },
//   { lat: -7.0, lng: 147.0, name: "LLG 6", supporters: 310 },
// ]

const genderData = [
  { name: "Male", value: 720, color: "#3b82f6" },
  { name: "Female", value: 500, color: "#ec4899" },
]

const supporterGrowthData = [
  { week: "Week 1", supporters: 800 },
  { week: "Week 2", supporters: 900 },
  { week: "Week 3", supporters: 1100 },
  { week: "Week 4", supporters: 1250 },
]

export default function DashboardPage() {
  const [stats, setStats] = useState(initialStats)
  const [llgData, setLlgData] = useState(initialLlgData)

  useEffect(() => {
    const fetchLlgData = async () => {
      const supabase = getSupabaseClient()
      if (!supabase) return;
      const { data, error } = await supabase.from('llgs').select('*, wards')
      if (!error && data) {
        // Ensure wards property exists
        const llgDataWithWards: LLGWithWards[] = data.map((llg: any) => ({ ...llg, wards: llg.wards ?? 0 }))
        setLlgData(llgDataWithWards)
        setStats((prev) => ({
          ...prev,
          total_wards: llgDataWithWards.reduce((sum, llg) => sum + (llg.wards ?? 0), 0),
        }))
      }
    }
    fetchLlgData()
  }, [])

  return (
    <AppLayout title="Campaign Dashboard - Morobe Regional Election 2027">
      <div className="mb-6 flex justify-end">
        <a
          href="/info/population"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded transition"
        >
          Morobe Population & Stats
        </a>
      </div>
      {/* Real-time Status Bar */}
      <div className="mb-6 flex items-center gap-4 animate-pulse">
        <span className="bg-green-500 rounded-full w-3 h-3 mr-2"></span>
        <span className="text-green-400 font-semibold">LIVE</span>
        <span className="text-gray-400">Last update: just now</span>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard
            label="Total Supporters"
            value={stats.total_supporters}
            icon={<MapPin size={24} className="animate-bounce" />} // animated icon
          />
          <StatCard
            label="Strong Supporters"
            value={stats.strong_supporters}
            icon={<MapPin size={24} className="animate-pulse" />} // animated icon
            trend={stats.strong_supporters.toString()}
            trendUp={true}
          />
        <StatCard
          label="Campaign Agents"
          value={stats.total_agents}
          icon={<Users size={24} className="animate-spin" />} // animated icon
        />
        <StatCard
          label="Total Wards"
          value={stats.total_wards}
          icon={<MapPin size={24} className="animate-bounce" />} // animated icon
        />
        <StatCard
          label="Weekly Growth"
          value={`${stats.weekly_growth_percentage}%`}
          icon={<TrendingUp size={24} className="animate-pulse" />} // animated icon
          trend="vs last week"
          trendUp={true}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {/* Support Level Distribution */}
        <Card>
          <h3 className="mb-4 text-lg font-semibold text-white flex items-center">
            Support Level Distribution
            <span className="ml-2 text-xs bg-green-700 px-2 py-1 rounded animate-pulse">Updating</span>
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={supportLevelData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) =>
                  `${name}: ${value}`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {supportLevelData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Gender Distribution */}
        <Card>
          <h3 className="mb-4 text-lg font-semibold text-white flex items-center">
            Gender Distribution
            <span className="ml-2 text-xs bg-green-700 px-2 py-1 rounded animate-pulse">Updating</span>
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={genderData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) =>
                  `${name}: ${value}`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {genderData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Supporters by LLG */}
        <Card className="lg:col-span-2">
          <h3 className="mb-4 text-lg font-semibold text-white flex items-center">
            Supporters by LLG
            <span className="ml-2 text-xs bg-green-700 px-2 py-1 rounded animate-pulse">Updating</span>
          </h3>
          <ResponsiveContainer width="100%" height={Math.max(350, llgData.length * 18)}>
            <BarChart
              data={llgData}
              layout="horizontal"
              margin={{ top: 40, right: 20, left: 20, bottom: 80 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis type="number" stroke="#9ca3af" />
              <XAxis
                type="category"
                dataKey="name"
                stroke="#9ca3af"
                tick={(props) => {
                  // Remove verticalAnchor and other unknown props
                  const { x, y, payload } = props as { x: number; y: number; payload: { value: string } };
                  return (
                    <text
                      x={x}
                      y={y}
                      fontSize={12}
                      fill="#cbd5e1"
                      transform={`rotate(-45,${x},${y})`}
                      textAnchor="end"
                    >
                      {payload.value}
                    </text>
                  );
                }}
                interval={0}
                height={80}
              />
              <YAxis type="number" stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a3a52",
                  border: "1px solid #0f2438",
                }}
              />
              <Legend />
              <Bar dataKey="Strong" stackId="a" fill="#10b981" radius={[8, 8, 8, 8]} />
              <Bar dataKey="Leaning" stackId="a" fill="#f59e0b" radius={[8, 8, 8, 8]} />
              <Bar dataKey="Undecided" stackId="a" fill="#6b7280" radius={[8, 8, 8, 8]} />
              <Bar dataKey="Opposition" stackId="a" fill="#ef4444" radius={[8, 8, 8, 8]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Real-time Supporter Growth */}
        <Card className="lg:col-span-2">
          <h3 className="mb-4 text-lg font-semibold text-white flex items-center">
            Real-time Supporter Growth
            <span className="ml-2 text-xs bg-green-700 px-2 py-1 rounded animate-pulse">Updating</span>
          </h3>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={supporterGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="week" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a3a52",
                  border: "1px solid #0f2438",
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="supporters" stroke="#10b981" strokeWidth={3} dot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Supporter Map */}
        <Card className="w-full mt-6 overflow-x-auto lg:col-span-2">
          <h3 className="mb-4 text-lg font-semibold text-white flex items-center">
            Supporter Distribution Map
            <span className="ml-2 text-xs bg-green-700 px-2 py-1 rounded animate-pulse">Updating</span>
          </h3>
          <SupporterMap />
        </Card>

        {/* Quick Actions Panel */}
        <Card className="mt-6 w-full">
          <h3 className="mb-4 text-lg font-semibold text-white flex items-center">
            Quick Actions
            <span className="ml-2 text-xs bg-green-700 px-2 py-1 rounded animate-pulse">Active</span>
          </h3>
          <div className="flex flex-wrap gap-4 w-full">
            <button className="bg-gold-500 text-navy-900 font-bold px-6 py-3 rounded-lg shadow hover:bg-gold-400 transition animate-pulse w-full sm:w-auto">
              Send SMS Blast
            </button>
            <button className="bg-navy-700 text-gold-500 font-bold px-6 py-3 rounded-lg shadow hover:bg-navy-600 transition animate-pulse w-full sm:w-auto">
              Schedule Event
            </button>
            <button className="bg-green-600 text-white font-bold px-6 py-3 rounded-lg shadow hover:bg-green-500 transition animate-pulse w-full sm:w-auto">
              Assign Agent
            </button>
          </div>
        </Card>
      </div>

      {/* AI Insights Section */}
      <Card className="mt-6">
        <h3 className="mb-4 text-lg font-semibold text-white">
          AI Insights for 2027 Election
        </h3>
        <div className="space-y-4">
          <div className="text-white text-base">
            <strong>Election Summary:</strong> Supporter momentum is strong ahead of the 2027 Morobe Regional Election. Rural LLGs are showing increased engagement. Female voter participation is rising.
          </div>
          <div className="text-white text-base">
            <strong>Trends:</strong> Highest supporter growth in Huon Gulf, Yalu, and Markham LLGs. Community events and agent outreach are driving new registrations.
          </div>
          <div className="text-white text-base">
            <strong>Recommendations:</strong> Prioritize outreach in underrepresented wards. Mobilize agents for voter education. Use SMS and social media to reach undecided voters. Monitor real-time activity for rapid response.
          </div>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card className="mt-6">
        <h3 className="mb-4 text-lg font-semibold text-white">
          Recent Activity
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-navy-600 pb-3">
            <div>
              <p className="text-white">New supporter registered</p>
              <p className="text-sm text-gray-400">John Mapla - Ward 5</p>
            </div>
            <p className="text-xs text-gray-500">2 hours ago</p>
          </div>
          <div className="flex items-center justify-between border-b border-navy-600 pb-3">
            <div>
              <p className="text-white">Campaign event created</p>
              <p className="text-sm text-gray-400">Community rally - LLG 2</p>
            </div>
            <p className="text-xs text-gray-500">5 hours ago</p>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white">Agent assignment updated</p>
              <p className="text-sm text-gray-400">
                Samuel to Ward 8
              </p>
            </div>
            <p className="text-xs text-gray-500">1 day ago</p>
          </div>
        </div>
      </Card>
    </AppLayout>
  )
}
