/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState, useEffect, useCallback } from "react";

// Our custom component for the top stat cards
import StatCard from "@/components/admin/dashboard/StatCard";

// All the chart and list components for the main grid
import AdsPieChart from "@/components/admin/dashboard/AdsPieChart";
import AdsBarChart from "@/components/admin/dashboard/AdsBarChart";
import ActivityList from "@/components/admin/dashboard/ActivityList";
import UserGrowthChart from "@/components/admin/dashboard/UserGrowthChart";

// Icons for the stat cards
import { Users, Newspaper, DollarSign, CheckCircle } from "lucide-react";

// Update the type to include the new `...Change` properties from the API
type DashboardStats = {
  totalUsers: number;
  usersChange: number;
  totalAds: number;
  adsChange: number;
  availableAds: number;
  soldAds: number;
  totalRevenue: number;
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/stats');

      if (res.status === 403) {
        throw new Error('You do not have permission to view this page.');
      }
      if (!res.ok) {
        throw new Error('Failed to fetch dashboard data.');
      }

      const data: DashboardStats = await res.json();
      setStats(data);
    } catch (err: any) {
      console.error("Failed to fetch dashboard stats:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  if (isLoading) {
    return <p className="text-center p-10 text-slate-400">Loading Dashboard...</p>;
  }

  if (error) {
    return <p className="text-center p-10 text-red-400">{error}</p>;
  }

  if (!stats) {
    return <p className="text-center p-10 text-slate-400">Could not load dashboard data.</p>;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
      </div>

      {/* --- STAT CARDS SECTION (UPDATED WITH DYNAMIC DATA) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Users" 
          value={stats.totalUsers} 
          icon={Users}
          // Pass the new dynamic `usersChange` value
          changeValue={stats.usersChange}
          gradient="bg-gradient-to-br from-pink-500 via-red-400 to-orange-400"
        />
        <StatCard 
          title="Total Ads Posted" 
          value={stats.totalAds} 
          icon={Newspaper}
          // Pass the new dynamic `adsChange` value
          changeValue={stats.adsChange}
          gradient="bg-gradient-to-br from-blue-500 to-cyan-400"
        />
        <StatCard 
          title="Items Sold" 
          value={`${stats.soldAds.toLocaleString()} sold`}
          icon={CheckCircle}
          // We display a string here, so no changeValue is needed
          gradient="bg-gradient-to-br from-emerald-500 to-teal-400"
        />
        <StatCard 
          title="Total Revenue" 
          value={stats.totalRevenue} 
          icon={DollarSign}
          // No change value for this one
          gradient="bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500"
        />
      </div>
      {/* --- END OF STAT CARDS SECTION --- */}

      {/* The existing charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AdsBarChart />
        </div>
        <div className="lg:col-span-1">
          <AdsPieChart />
        </div>
        <div className="lg:col-span-1">
          <ActivityList title="Recent Sales" />
        </div>
        <div className="lg:col-span-1">
          <ActivityList title="Top Ads by Members" />
        </div>
        <div className="lg:col-span-1">
          <UserGrowthChart />
        </div>
      </div>
    </div>
  );
}