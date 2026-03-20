import React, { useState, useEffect } from "react";
import { useAuth } from "../../auth/AuthContext";
import { fetchDashboardStats } from "../../services/dashboardService";
import * as Icons from "react-icons/fi";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Cell
} from "recharts";
import { 
  FiTrendingUp, FiUsers, FiBox, FiDollarSign, 
  FiAlertCircle, FiPlus, FiDownload, FiActivity,
  FiPieChart, FiShoppingBag, FiArrowUpRight, FiArrowDownRight
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";


export default function Dashboard() {
  const { activeBranch, business, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [timeRange, setTimeRange] = useState("Last 7 Days");
  const navigate = useNavigate();

  useEffect(() => {
    const getRealData = async () => {
      setLoading(true);
      try {
        const response = await fetchDashboardStats(activeBranch?.id);
        setStats(response.data);
      } catch (error) {
        console.error("Error loading dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    getRealData();
  }, [activeBranch]);

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-black text-blue-600 text-[10px]">RC</div>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-10 bg-[#f8fafc] min-h-screen space-y-10">
      
      {/* --- PREMIUM HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-[10px] font-black rounded-full uppercase tracking-tighter">
              Admin Console
            </span>
            <span className="text-gray-300">•</span>
            <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">
               {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">
            {activeBranch ? activeBranch.name : business?.name || "Corporate"} Overview
          </h1>
          <p className="text-gray-500 font-medium mt-1">Welcome back, <span className="text-blue-600 font-bold">{user?.fullName?.split(' ')[0]}</span>. Here's what's happening across RetailCore.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 rounded-2xl font-bold text-gray-600 hover:shadow-xl hover:-translate-y-0.5 transition-all">
            <FiDownload size={18} /> Export Reports
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:shadow-blue-200 hover:shadow-2xl hover:-translate-y-0.5 transition-all">
            <FiPlus size={18} /> New Transaction
          </button>
        </div>
      </div>

      {/* --- SMART KPI GRID --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats?.kpis.map((kpi, idx) => {
          const IconComponent = Icons[kpi.icon] || FiActivity;
          const isPositive = kpi.trend.includes('+');

          return (
            <div key={idx} className="bg-white p-7 rounded-[2.5rem] shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-2xl hover:shadow-blue-50 transition-all duration-500">
              <div className="relative z-10 flex justify-between items-start">
                <div className={`${kpi.bg} ${kpi.color} p-4 rounded-2xl shadow-inner group-hover:scale-110 transition-transform duration-500`}>
                  <IconComponent size={24} />
                </div>
                <div className={`flex items-center gap-1 text-[10px] font-black px-3 py-1 rounded-full ${isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {isPositive ? <FiArrowUpRight /> : <FiArrowDownRight />} {kpi.trend}
                </div>
              </div>
              <div className="mt-6 relative z-10">
                <p className="text-gray-400 text-xs font-black uppercase tracking-widest">{kpi.title}</p>
                <h3 className="text-3xl font-black text-gray-900 mt-1">{kpi.value}</h3>
              </div>
              {/* Abstract decorative shape */}
              <div className={`absolute -bottom-6 -right-6 w-24 h-24 rounded-full opacity-[0.03] group-hover:scale-150 transition-transform duration-700 ${kpi.bg}`}></div>
            </div>
          );
        })}
      </div>

      {/* --- ANALYTICS HUB --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Sales Chart Card */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                Revenue Velocity
              </h2>
              <p className="text-xs text-gray-400 font-bold uppercase mt-1">Gross sales over time</p>
            </div>
            <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
              {['7D', '1M', '1Y'].map(t => (
                <button 
                  key={t}
                  onClick={() => setTimeRange(t)}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${timeRange.includes(t) ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.chartData}>
                <defs>
                  <linearGradient id="premiumGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="10 10" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 800}} dy={15}/>
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 800}} />
                <Tooltip 
                  cursor={{ stroke: '#3b82f6', strokeWidth: 2 }}
                  contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)', padding: '15px'}}
                />
                <Area 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#3b82f6" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#premiumGradient)" 
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Operational Inventory / Quick Actions */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
            <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
               Inventory Risk
            </h2>
            <div className="space-y-3">
              {stats?.lowStock?.length > 0 ? stats.lowStock.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-red-50/50 rounded-2xl border border-red-100 group hover:bg-red-50 transition-colors">
                  <div>
                    <p className="text-sm font-black text-red-900">{item.name}</p>
                    <p className="text-[10px] text-red-600 font-bold uppercase tracking-widest">{item.stock} Units left</p>
                  </div>
                  <button className="p-2 bg-white text-red-600 rounded-xl border border-red-200 opacity-0 group-hover:opacity-100 transition-opacity">
                    <FiPlus />
                  </button>
                </div>
              )) : (
                <div className="text-center py-6 opacity-40">
                  <FiBox size={40} className="mx-auto mb-2" />
                  <p className="text-xs font-bold uppercase">All stock levels healthy</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-blue-600 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-blue-200 relative overflow-hidden">
            <h2 className="text-xl font-black mb-4 relative z-10">Admin Shortcuts</h2>
            <div className="grid grid-cols-2 gap-3 relative z-10">
              <button onClick={() => navigate("/admin/staff")} className="p-4 bg-white/10 hover:bg-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest backdrop-blur-md border border-white/10 transition-all">Add Staff</button>
              <button onClick={() => navigate("/admin/settings")} className="p-4 bg-white/10 hover:bg-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest backdrop-blur-md border border-white/10 transition-all">Settings</button>   
              <button onClick={() => alert("🚧 Branch Audit module is currently underway. Stay tuned for advanced reconciliation features!")} className="p-4 bg-white/10 hover:bg-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest backdrop-blur-md border border-white/10 transition-all">Branch Audit</button>           
            </div>
            <FiPieChart size={150} className="absolute -bottom-10 -right-10 opacity-10 rotate-12" />
          </div>
        </div>
      </div>

      {/* --- RECENT ACTIVITY --- */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-black text-gray-900 tracking-tight">Recent Activity</h2>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Latest transactions across system</p>
          </div>
          <button className="text-blue-600 font-black text-xs uppercase tracking-widest hover:underline">View All Activity</button>
        </div>
        <div className="overflow-x-auto p-4">
          <table className="w-full text-left border-separate border-spacing-y-2">
            <thead>
              <tr className="text-gray-400 text-[10px] font-black uppercase tracking-widest px-6">
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4 text-center">Amount</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Time</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentOrders.map((order, idx) => (
                <tr key={idx} className="group hover:bg-blue-50/50 transition-all duration-300 shadow-sm">
                  <td className="px-6 py-5 rounded-l-2xl bg-white group-hover:bg-blue-50/50">
                    <span className="font-mono text-xs font-black text-blue-600 tracking-tighter uppercase">{order.id}</span>
                  </td>
                  <td className="px-6 py-5 bg-white group-hover:bg-blue-50/50">
                    <p className="text-sm font-bold text-gray-900">{order.customer}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase italic">Retail Sale</p>
                  </td>
                  <td className="px-6 py-5 bg-white group-hover:bg-blue-50/50 text-center">
                    <p className="text-sm font-black text-gray-900">KES {order.amount.toLocaleString()}</p>
                  </td>
                  <td className="px-6 py-5 bg-white group-hover:bg-blue-50/50 text-center">
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tighter border ${
                      order.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-orange-50 text-orange-700 border-orange-100'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 rounded-r-2xl bg-white group-hover:bg-blue-50/50 text-right">
                    <p className="text-xs font-black text-gray-400 uppercase tracking-tighter">{order.time}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}