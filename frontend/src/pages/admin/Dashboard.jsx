import React, { useState, useEffect } from "react";
import { useAuth } from "../../auth/AuthContext";
import { fetchDashboardStats } from "../../services/dashboardService";

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, AreaChart, Area
} from "recharts";
import { 
  FiTrendingUp, FiUsers, FiBox, FiDollarSign, 
  FiAlertCircle, FiPlus, FiDownload, FiActivity 
} from "react-icons/fi";

export default function Dashboard() {
  const { activeBranch, business } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  // 🔄 Fetch real data based on activeBranch
  useEffect(() => {
  const getRealData = async () => {
    setLoading(true);
    try {
      const response = await fetchDashboardStats(activeBranch?.id);
      setStats(response.data); // This now sets the real KPIs from your DB
    } catch (error) {
      console.error("Error loading real dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  getRealData();
}, [activeBranch]);

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen space-y-6">
      {/* 🚀 DASHBOARD HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {activeBranch ? `${activeBranch.name} Dashboard` : `${business?.name} Overview`}
          </h1>
          <p className="text-gray-500 text-sm">Real-time performance analytics and insights.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all">
            <FiDownload /> Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-md transition-all">
            <FiPlus /> New Sale
          </button>
        </div>
      </div>

      {/* 📊 KPI GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats?.kpis.map((kpi, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div className={`${kpi.bg} ${kpi.color} p-3 rounded-xl text-xl`}>
                {kpi.icon}
              </div>
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                {kpi.trend}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">{kpi.title}</p>
              <h3 className="text-2xl font-bold text-gray-800">{kpi.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* 📈 MAIN CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
              <FiActivity className="text-blue-500" /> Sales Performance
            </h2>
            <select className="text-sm border-none bg-gray-50 rounded-lg focus:ring-0">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.chartData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                />
                <Area type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 🚨 ATTENTION / INVENTORY ALERTS */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FiAlertCircle className="text-red-500" /> Inventory Alerts
          </h2>
          <div className="space-y-4">
            {['Sugar (2kg)', 'Milk (1L)', 'Bread'].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-100">
                <div>
                  <p className="text-sm font-bold text-red-800">{item}</p>
                  <p className="text-xs text-red-600">Stock level below 5 units</p>
                </div>
                <button className="text-xs bg-white text-red-600 px-3 py-1 rounded-lg border border-red-200 font-bold">
                  Restock
                </button>
              </div>
            ))}
          </div>
          <div className="mt-8">
             <h2 className="font-bold text-gray-800 mb-4">Quick Actions</h2>
             <div className="grid grid-cols-2 gap-2">
                <button className="p-3 bg-gray-50 rounded-xl text-xs font-semibold hover:bg-blue-50 hover:text-blue-600 transition-all text-center">Add Staff</button>
                <button className="p-3 bg-gray-50 rounded-xl text-xs font-semibold hover:bg-blue-50 hover:text-blue-600 transition-all text-center">Inventory</button>
                <button className="p-3 bg-gray-50 rounded-xl text-xs font-semibold hover:bg-blue-50 hover:text-blue-600 transition-all text-center">Reports</button>
                <button className="p-3 bg-gray-50 rounded-xl text-xs font-semibold hover:bg-blue-50 hover:text-blue-600 transition-all text-center">Settings</button>
             </div>
          </div>
        </div>
      </div>

      {/* 📋 RECENT TRANSACTIONS TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50">
          <h2 className="font-bold text-gray-800">Recent Transactions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-6 py-4 font-semibold">Order ID</th>
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold">Amount</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {stats?.recentOrders.map((order, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-blue-600">{order.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{order.customer}</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">${order.amount.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                      order.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{order.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}