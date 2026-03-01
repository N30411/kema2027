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
  const [showProfile, setShowProfile] = useState(false)

  useEffect(() => {
    const fetchLlgData = async () => {
      const supabase = getSupabaseClient()
      if (!supabase) return;
      const { data, error } = await supabase.from('llgs').select('*, wards')
      if (!error && data) {
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
      {/* Header with avatar and notifications */}
      <div className="flex items-center justify-between mb-8 px-2">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent drop-shadow-lg">Dashboard</h1>
          <span className="ml-2 px-3 py-1 rounded-full bg-navy-800/60 text-xs text-gold-400 font-semibold shadow animate-pulse">LIVE</span>
        </div>
        <div className="flex items-center gap-4">
          <button title="Notifications" className="relative p-2 rounded-full bg-navy-700 hover:bg-navy-600 transition shadow-lg">
            <svg className="w-6 h-6 text-gold-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
          </button>
          <div className="relative">
            <button onClick={() => setShowProfile((v) => !v)} className="flex items-center gap-2 p-2 rounded-full bg-navy-700 hover:bg-navy-600 transition shadow-lg">
              <img src="/profile/avatar.png" alt="Profile" className="w-8 h-8 rounded-full border-2 border-gold-400 shadow" />
              <span className="hidden sm:block text-gold-400 font-semibold">Admin</span>
            </button>
            {showProfile && (
              <div className="absolute right-0 mt-2 w-48 bg-navy-800/90 rounded-lg shadow-xl p-4 z-50 border border-navy-600">
                <div className="flex items-center gap-2 mb-2">
                  <img src="/profile/avatar.png" alt="Profile" className="w-10 h-10 rounded-full border-2 border-gold-400" />
                  <div>
                    <div className="font-bold text-gold-400">Admin</div>
                    <div className="text-xs text-gray-400">admin@morobe2027.com</div>
                  </div>
                </div>
                <hr className="border-navy-600 my-2" />
                <button className="w-full text-left text-sm text-red-400 hover:text-red-300 font-semibold py-1">Logout</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Real-time Status Bar */}
      <div className="mb-6 flex items-center gap-4 animate-pulse">
        <span className="bg-green-500 rounded-full w-3 h-3 mr-2"></span>
        <span className="text-green-400 font-semibold">LIVE</span>
        <span className="text-gray-400">Last update: just now</span>
        <a href="/info/population" className="ml-auto btn-primary shadow-lg">Morobe Population & Stats</a>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard
          label="Total Supporters"
          value={stats.total_supporters}
          icon={<MapPin size={24} className="animate-bounce" />}
        />
        <StatCard
          label="Strong Supporters"
          value={stats.strong_supporters}
          icon={<MapPin size={24} className="animate-pulse" />}
          trend={stats.strong_supporters.toString()}
          trendUp={true}
        />
        <StatCard
          label="Campaign Agents"
          value={stats.total_agents}
          icon={<Users size={24} className="animate-spin" />}
        />
        <StatCard
          label="Total Wards"
          value={stats.total_wards}
          icon={<MapPin size={24} className="animate-bounce" />}
        />
        <StatCard
          label="Weekly Growth"
          value={`${stats.weekly_growth_percentage}%`}
          icon={<TrendingUp size={24} className="animate-pulse" />}
          trend="vs last week"
          trendUp={true}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {/* Support Level Distribution */}
        <Card className="glass-card">
          <h3 className="mb-4 text-lg font-semibold text-white flex items-center">
            <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a4 4 0 014-4h2a4 4 0 014 4v2" /></svg>
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
                label={({ name, value }) => `${name}: ${value}`}
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
        <Card className="glass-card">
          <h3 className="mb-4 text-lg font-semibold text-white flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-4-4h-1" /></svg>
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
                label={({ name, value }) => `${name}: ${value}`}
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
        <Card className="glass-card lg:col-span-2">
          <h3 className="mb-4 text-lg font-semibold text-white flex items-center">
            <svg className="w-5 h-5 mr-2 text-gold-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18" /></svg>
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
              <Tooltip contentStyle={{ backgroundColor: "#1a3a52", border: "1px solid #0f2438" }} />
              <Legend />
              <Bar dataKey="Strong" stackId="a" fill="#10b981" radius={[8, 8, 8, 8]} />
              <Bar dataKey="Leaning" stackId="a" fill="#f59e0b" radius={[8, 8, 8, 8]} />
              <Bar dataKey="Undecided" stackId="a" fill="#6b7280" radius={[8, 8, 8, 8]} />
              <Bar dataKey="Opposition" stackId="a" fill="#ef4444" radius={[8, 8, 8, 8]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Real-time Supporter Growth */}
        <Card className="glass-card lg:col-span-2">
          <h3 className="mb-4 text-lg font-semibold text-white flex items-center">
            <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 17l6-6 4 4 8-8" /></svg>
            Real-time Supporter Growth
            <span className="ml-2 text-xs bg-green-700 px-2 py-1 rounded animate-pulse">Updating</span>
          </h3>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={supporterGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="week" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ backgroundColor: "#1a3a52", border: "1px solid #0f2438" }} />
              <Legend />
              <Line type="monotone" dataKey="supporters" stroke="#10b981" strokeWidth={3} dot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Supporter Map */}
        <Card className="glass-card w-full mt-6 overflow-x-auto lg:col-span-2">
          <h3 className="mb-4 text-lg font-semibold text-white flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-4-4h-1" /></svg>
            Supporter Distribution Map
            <span className="ml-2 text-xs bg-green-700 px-2 py-1 rounded animate-pulse">Updating</span>
          </h3>
          <SupporterMap />
        </Card>

        {/* Quick Actions Panel */}
        <Card className="glass-card mt-6 w-full">
          <h3 className="mb-4 text-lg font-semibold text-white flex items-center">
            <svg className="w-5 h-5 mr-2 text-gold-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            Quick Actions
            <span className="ml-2 text-xs bg-green-700 px-2 py-1 rounded animate-pulse">Active</span>
          </h3>
          <div className="flex flex-wrap gap-4 w-full">
            <button className="btn-primary flex items-center gap-2 animate-pulse w-full sm:w-auto" title="Send SMS Blast">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              Send SMS Blast
            </button>
            <button className="btn-secondary flex items-center gap-2 animate-pulse w-full sm:w-auto" title="Schedule Event">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              Schedule Event
            </button>
            <button className="bg-green-600 text-white font-bold px-6 py-3 rounded-lg shadow hover:bg-green-500 transition animate-pulse w-full sm:w-auto flex items-center gap-2" title="Assign Agent">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              Assign Agent
            </button>
          </div>
        </Card>
      </div>

      {/* AI Insights Section */}
      <Card className="glass-card mt-6">
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
      <Card className="glass-card mt-6">
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
