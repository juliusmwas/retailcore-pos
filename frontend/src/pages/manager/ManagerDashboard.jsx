import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // Import the function directly
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import {
  Users,
  ShoppingCart,
  AlertTriangle,
  TrendingUp,
  Clock,
  LogOut,
  FileText,
} from "lucide-react";

const ManagerDashboard = () => {
  // 1. Hooks & Auth
  const { user, token, logout } = useAuth(); // Ensure logout is destructured here
  const navigate = useNavigate();

  // 2. State
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 3. Handlers (Moved INSIDE so they can see state/hooks)
  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const handleGenerateReport = () => {
    if (!dashboardData) {
      alert("No data available to generate report yet.");
      return;
    }

    const doc = new jsPDF();
    const date = new Date().toLocaleDateString();
    const branchName = user?.branchName || "Chuka Branch";

    // Header
    doc.setFontSize(20);
    doc.setTextColor(40);
    doc.text("RETAILCORE POS - DAILY SUMMARY", 14, 22);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Branch: ${branchName} | Date: ${date}`, 14, 30);

    // ✅ CORRECT WAY: Call autoTable directly and pass the 'doc' instance
    autoTable(doc, {
      startY: 40,
      head: [["Metric", "Value"]],
      body: [
        [
          "Total Sales (Today)",
          `KES ${dashboardData.todaySales?.toLocaleString() || 0}`,
        ],
        [
          "Average Ticket",
          `KES ${dashboardData.avgTicket?.toLocaleString() || 0}`,
        ],
        ["Active Cashiers", dashboardData.activeCashiers || 0],
        ["Low Stock Alerts", dashboardData.lowStockCount || 0],
      ],
      theme: "striped",
      headStyles: { fillColor: [37, 99, 235] },
    });

    // Category Table
    if (dashboardData.categoryShare?.length > 0) {
      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 10, // Accessing previous table position
        head: [["Category Share", "Item Count"]],
        body: dashboardData.categoryShare.map((cat) => [cat.name, cat.value]),
        headStyles: { fillColor: [245, 158, 11] },
      });
    }

    doc.save(`Daily_Report_${branchName.replace(/\s+/g, "_")}_${date}.pdf`);
  };
  // 4. Data Fetching
  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.branchId) return;

      try {
        setIsLoading(true);
        const response = await axios.get(
          `http://localhost:5000/api/reports/manager-summary?branchId=${user.branchId}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setDashboardData(response.data);
      } catch (err) {
        console.error("Dashboard Load Error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [user?.branchId, token]);

  // 5. Derived UI Data
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
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="font-black text-gray-400 uppercase tracking-widest text-xs">
            Initializing Command Center...
          </p>
        </div>
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
          <button
            onClick={handleGenerateReport}
            className="flex-1 md:flex-none bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-100 text-sm active:scale-95 flex items-center justify-center gap-2"
          >
            <FileText size={16} />
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
        {/* Revenue Velocity Section */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="font-black text-gray-900 text-sm uppercase tracking-widest">
                Revenue Velocity
              </h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">
                7-Day Sales Trend
              </p>
            </div>
            <div className="flex gap-4 text-[10px] font-black uppercase tracking-tighter">
              <span className="flex items-center gap-1.5 text-blue-600">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>{" "}
                Current Week
              </span>
              <span className="flex items-center gap-1.5 text-gray-400">
                <span className="w-2 h-2 rounded-full bg-gray-300"></span>{" "}
                Previous Week
              </span>
            </div>
          </div>

          <div className="h-72 w-full">
            {dashboardData?.revenueVelocity?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dashboardData.revenueVelocity}>
                  <defs>
                    {/* Gradient for Current Week */}
                    <linearGradient
                      id="colorCurrent"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f8fafc"
                  />

                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 900 }}
                    dy={10}
                  />

                  <YAxis hide />

                  <Tooltip
                    cursor={{ stroke: "#e2e8f0", strokeWidth: 2 }}
                    contentStyle={{
                      borderRadius: "16px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                      padding: "12px",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  />

                  {/* Previous Week Line (Dashed Grey) */}
                  <Area
                    type="monotone"
                    dataKey="prevAmount" // Matches the key from backend
                    name="Previous Week"
                    stroke="#d1d5db"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    fill="transparent"
                    dot={false}
                    activeDot={{ r: 4, fill: "#94a3b8" }}
                  />

                  {/* Current Week Line (Solid Blue) */}
                  <Area
                    type="monotone"
                    dataKey="amount" // Matches the key from backend
                    name="Current Week"
                    stroke="#2563eb"
                    strokeWidth={4}
                    fillOpacity={1}
                    fill="url(#colorCurrent)"
                    dot={{
                      r: 4,
                      fill: "#2563eb",
                      strokeWidth: 2,
                      stroke: "#fff",
                    }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full bg-gray-50 rounded-3xl flex flex-col items-center justify-center border-2 border-dashed border-gray-100 group">
                <div className="p-3 bg-white rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                  <TrendingUp className="text-gray-300" size={24} />
                </div>
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">
                  Awaiting Sales Data
                </p>
              </div>
            )}
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
