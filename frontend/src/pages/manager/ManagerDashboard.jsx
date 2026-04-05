import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Added for redirection
import { useAuth } from "../../auth/AuthContext"; // Import your auth hook
import axios from "axios";
import {
  Users,
  ShoppingCart,
  AlertTriangle,
  TrendingUp,
  Clock,
  LogOut, // Added logout icon
} from "lucide-react";

const handleLogout = () => {
  logout(); // Clears the auth state and localStorage
  navigate("/login", { replace: true }); // Sends user back to login
};

const ManagerDashboard = () => {
  const { user, token } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 🔄 The "Trigger"
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        // We pass the branchId so the backend knows WHICH branch to calculate for
        const response = await axios.get(
          `http://localhost:5000/api/reports/manager-summary?branchId=${user?.branchId}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setDashboardData(response.data);
      } catch (err) {
        console.error("Dashboard Load Error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.branchId) {
      fetchStats();
    }
  }, [user?.branchId, token]);

  // Map the Real Data to your existing UI stats array
  const stats = [
    {
      title: "Today's Sales",
      value: dashboardData?.todaySales
        ? `KES ${dashboardData.todaySales.toLocaleString()}`
        : "KES 0",
      icon: <ShoppingCart className="text-blue-600" />,
      change: dashboardData?.salesGrowth || "+0%",
      isPositive: true,
    },
    {
      title: "Active Cashiers",
      value: dashboardData?.activeCashiers || "0",
      icon: <Users className="text-green-600" />,
      change: "Live Now",
      isPositive: true,
    },
    {
      title: "Low Stock Items",
      value: dashboardData?.lowStockCount || "0",
      icon: <AlertTriangle className="text-amber-600" />,
      change: dashboardData?.lowStockCount > 0 ? "Action Needed" : "All Clear",
      isWarning: dashboardData?.lowStockCount > 0,
    },
    {
      title: "Avg. Transaction",
      value: dashboardData?.avgTicket
        ? `KES ${dashboardData.avgTicket.toLocaleString()}`
        : "KES 0",
      icon: <TrendingUp className="text-purple-600" />,
      change: dashboardData?.ticketGrowth || "+0%",
      isPositive: true,
    },
  ];

  if (isLoading)
    return (
      <div className="p-10 text-center font-bold">
        Initializing Command Center...
      </div>
    );

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Manager Command Center
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center gap-1.5 bg-blue-50 px-2 py-1 rounded-md border border-blue-100">
              <Clock size={12} className="text-blue-600" />
              <p className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">
                {new Date().toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
            <span className="text-gray-300 text-xs">|</span>
            <p className="text-sm text-gray-500 font-medium">
              Daily Overview:{" "}
              <span className="text-gray-800 font-bold capitalize">
                {user?.branchName || "Main Station"}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-100 text-sm active:scale-95">
            Generate Daily Report
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 border border-red-100 text-red-500 px-4 py-2.5 rounded-xl font-bold hover:bg-red-50 hover:border-red-200 transition-all text-sm active:scale-95"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Log Out</span>
          </button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-gray-50 rounded-2xl group-hover:bg-blue-50 transition-colors">
                {React.cloneElement(stat.icon, { size: 24 })}
              </div>
              <span
                className={`text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider ${
                  stat.isWarning
                    ? "bg-red-50 text-red-600 border border-red-100"
                    : "bg-green-50 text-green-600 border border-green-100"
                }`}
              >
                {stat.change}
              </span>
            </div>
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">
                {stat.title}
              </p>
              <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
                {isLoading ? (
                  <div className="h-8 w-24 bg-gray-100 animate-pulse rounded-md" />
                ) : (
                  stat.value
                )}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content: Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Velocity Section (Large) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
          <div className="flex justify-between items-center mb-6 text-left">
            <h3 className="font-bold text-gray-800 text-lg uppercase tracking-wider">
              Revenue Velocity
            </h3>
            <div className="flex gap-4 text-xs font-bold">
              <span className="flex items-center gap-1 text-blue-600">
                ● Current Week
              </span>
              <span className="flex items-center gap-1 text-gray-300">
                ● Previous Week
              </span>
            </div>
          </div>
          <div className="h-64 bg-slate-50 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-200 text-gray-400 font-medium">
            [ Line Chart Area ]
          </div>
        </div>

        {/* Category Share Section */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col h-full">
          <h3 className="font-black text-gray-800 text-sm uppercase tracking-widest mb-6">
            Category Share
          </h3>

          <div className="flex-1 flex flex-col justify-center">
            <div className="h-48 flex items-center justify-center relative">
              {/* Dynamic Donut Chart using CSS Gradients */}
              <div
                className="w-36 h-36 rounded-full border-[12px] border-gray-50 flex items-center justify-center transition-all duration-700"
                style={{
                  background:
                    dashboardData?.categoryShare?.length > 0
                      ? `conic-gradient(#3b82f6 0% 30%, #f59e0b 30% 55%, #10b981 55% 80%, #8b5cf6 80% 100%)`
                      : "#f3f4f6",
                }}
              >
                {/* The "Hole" in the donut */}
                <div className="w-24 h-24 bg-white rounded-full shadow-inner flex flex-col items-center justify-center">
                  <span className="text-[10px] text-gray-400 font-bold tracking-tighter">
                    TOTAL
                  </span>
                  <span className="text-lg font-black text-gray-900">
                    {dashboardData?.categoryShare?.reduce(
                      (acc, curr) => acc + curr.value,
                      0,
                    ) || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-3">
              {dashboardData?.categoryShare?.length > 0 ? (
                dashboardData.categoryShare.slice(0, 4).map((cat, i) => {
                  const colors = [
                    "bg-blue-500",
                    "bg-amber-500",
                    "bg-green-500",
                    "bg-purple-500",
                  ];
                  return (
                    <div key={cat.name} className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${colors[i % colors.length]}`}
                      ></span>
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-tight truncate w-20">
                          {cat.name}
                        </span>
                        <span className="text-xs font-bold text-gray-700">
                          {cat.value} items
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="col-span-2 text-center text-xs text-gray-400 italic">
                  No inventory data found
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
