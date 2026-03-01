"use client"

import { AppLayout } from "@/components/layout";
import { Card, StatCard } from "@/components/ui";
import { Users, MapPin, TrendingUp } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function PopulationInfoPage() {
  // Mock population stats
  const populationStats = {
    population: 700000,
    districts: 10,
    llgs: 37,
    wards: 604,
    urbanCenter: "Lae City",
    growthRate: 2.8, // %
  };

  const genderData = [
    { name: "Male", value: 360000, color: "#3b82f6" },
    { name: "Female", value: 340000, color: "#ec4899" },
  ];

  return (
    <AppLayout title="Morobe Province Population & Statistics">
      <div className="mt-6">
        {/* Stat Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
          <StatCard
            label="Population"
            value={populationStats.population.toLocaleString()}
            icon={<Users size={24} className="animate-bounce" />} />
          <StatCard
            label="Districts"
            value={populationStats.districts}
            icon={<MapPin size={24} className="animate-bounce" />} />
          <StatCard
            label="LLGs"
            value={populationStats.llgs}
            icon={<MapPin size={24} className="animate-bounce" />} />
          <StatCard
            label="Wards"
            value={populationStats.wards}
            icon={<MapPin size={24} className="animate-bounce" />} />
          <StatCard
            label="Growth Rate"
            value={`${populationStats.growthRate}%`}
            icon={<TrendingUp size={24} className="animate-pulse" />} />
        </div>

        {/* Population & Demographics Card */}
        <Card>
          <h2 className="mb-4 text-xl font-bold text-white">Morobe Province Population & Statistics</h2>
          <div className="space-y-4 text-white text-base">
            <p>
              <strong>Source:</strong> <a href="https://www.nso.gov.pg/statistics/population/" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">PNG National Statistical Office</a>
            </p>
            <p>
              Morobe Province is the largest and most populous province in Papua New Guinea. According to the PNG National Statistical Office, the population is estimated at over 700,000 (2021 census projection), with rapid growth in urban centers like Lae and significant rural populations across 10 districts and 37 LLGs.
            </p>
            <ul className="list-disc ml-6">
              <li>Estimated population: 700,000+</li>
              <li>Districts: 10</li>
              <li>LLGs: 37</li>
              <li>Wards: ~604</li>
              <li>Urban center: Lae City (largest city outside Port Moresby)</li>
              <li>Major rural population: Huon Gulf, Markham, Menyamya, Kabwum, Finschhafen</li>
              <li>Recent growth: New districts (Wau-Waria), LLG splits for improved service delivery</li>
            </ul>
            <p>
              <strong>Demographic Trends:</strong> Urbanization, youth population growth, migration to Lae, and increased female voter participation.
            </p>
            <p>
              For more detailed statistics, visit the <a href="https://www.nso.gov.pg/statistics/population/" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">PNG NSO Population Statistics</a> page.
            </p>
          </div>
        </Card>

        {/* Gender Distribution Chart */}
        <div className="mt-8">
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
                  label={({ name, value }) => `${name}: ${value.toLocaleString()}`}
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
        </div>
      </div>
    </AppLayout>
  );
}
