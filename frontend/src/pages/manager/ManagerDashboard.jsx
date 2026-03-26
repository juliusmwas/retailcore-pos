import React from "react";
import { useNavigate } from "react-router-dom"; // Added for redirection
import { useAuth } from "../../auth/AuthContext"; // Import your auth hook
import { 
  Users, 
  ShoppingCart, 
  AlertTriangle, 
  TrendingUp, 
  Clock,
  LogOut // Added logout icon
} from "lucide-react";

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth(); // Destructure logout function

  const handleLogout = () => {
    logout(); // Clears the auth state and localStorage
    navigate("/login", { replace: true }); // Sends user back to login
  };

  // Mock data for the UI layout
  const stats = [
    { title: "Today's Sales", value: "KES 45,200", icon: <ShoppingCart className="text-blue-600" />, change: "+12%" },
    { title: "Active Cashiers", value: "4", icon: <Users className="text-green-600" />, change: "Full Staff" },
    { title: "Low Stock Items", value: "12", icon: <AlertTriangle className="text-amber-600" />, change: "Action Needed" },
    { title: "Avg. Transaction", value: "KES 1,250", icon: <TrendingUp className="text-purple-600" />, change: "+5.4%" },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manager Command Center</h1>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            <Clock size={14} /> Daily Overview: Chuka Branch
          </p>
        </div>
        
        <div className="flex gap-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition shadow-sm text-sm">
            Generate Daily Report
          </button>
          
          {/* Working Logout Button */}
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 border border-red-200 text-red-600 px-4 py-2 rounded-lg font-semibold hover:bg-red-50 transition text-sm"
          >
            <LogOut size={16} />
            Log Out
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