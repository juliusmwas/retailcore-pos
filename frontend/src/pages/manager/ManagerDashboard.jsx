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
  LogOut // Added logout icon
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
          { headers: { Authorization: `Bearer ${token}` } }
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
      value: `KES ${dashboardData?.todaySales?.toLocaleString() || '0'}`, 
      icon: <ShoppingCart className="text-blue-600" />, 
      change: dashboardData?.salesGrowth || "0%" 
    },
    { 
      title: "Active Cashiers", 
      value: dashboardData?.activeCashiers || "0", 
      icon: <Users className="text-green-600" />, 
      change: "On Shift" 
    },
    { 
      title: "Low Stock Items", 
      value: dashboardData?.lowStockCount || "0", 
      icon: <AlertTriangle className="text-amber-600" />, 
      change: "Action Needed" 
    },
    { 
      title: "Avg. Transaction", 
      value: `KES ${dashboardData?.avgTicket?.toLocaleString() || '0'}`, 
      icon: <TrendingUp className="text-purple-600" />, 
      change: "+0%" 
    },
  ];

  if (isLoading) return <div className="p-10 text-center font-bold">Initializing Command Center...</div>;


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
          {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
        </p>
      </div>
      <span className="text-gray-300 text-xs">|</span>
      <p className="text-sm text-gray-500 font-medium">
        Daily Overview: <span className="text-gray-800 font-bold capitalize">{user?.branchName || "Main Station"}</span>
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
          <div key={index} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-gray-50 rounded-lg">{stat.icon}</div>
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                {stat.change}
              </span>
            </div>
            <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
            <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Main Content: Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue Velocity Section (Large) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
          <div className="flex justify-between items-center mb-6 text-left">
            <h3 className="font-bold text-gray-800 text-lg uppercase tracking-wider">Revenue Velocity</h3>
            <div className="flex gap-4 text-xs font-bold">
              <span className="flex items-center gap-1 text-blue-600">● Current Week</span>
              <span className="flex items-center gap-1 text-gray-300">● Previous Week</span>
            </div>
          </div>
          <div className="h-64 bg-slate-50 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-200 text-gray-400 font-medium">
            [ Line Chart Area ]
          </div>
        </div>

        {/* Category Share Section (Small) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 text-lg uppercase tracking-wider mb-6">Category Share</h3>
          <div className="h-64 flex items-center justify-center relative">
            <div className="w-40 h-40 rounded-full border-[16px] border-blue-500 border-t-amber-500 border-l-green-500 border-r-purple-500"></div>
            <div className="absolute flex flex-col items-center">
               <span className="text-xs text-gray-400 font-bold">TOTAL</span>
               <span className="text-xl font-black text-gray-800">100%</span>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-2">
            {["CLOTHING", "ELECTRONICS", "GROCERIES", "HOME DECOR"].map((cat) => (
              <div key={cat} className="flex items-center gap-2 text-[10px] font-black text-gray-600">
                <span className={`w-2 h-2 rounded-full ${cat === 'CLOTHING' ? 'bg-amber-500' : 'bg-blue-500'}`}></span>
                {cat}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ManagerDashboard;