import React, { useState } from "react";
import { 
  User, 
  Lock, 
  Store, 
  Bell, 
  Save, 
  Smartphone,
  ChevronRight
} from "lucide-react";

const ManagerSettings = () => {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Settings</h1>
        <p className="text-sm text-gray-500 font-medium">Manage your account and Chuka Branch preferences</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 space-y-1">
          {[
            { id: "profile", label: "Profile Info", icon: <User size={18} /> },
            { id: "security", label: "Security", icon: <Lock size={18} /> },
            { id: "branch", label: "Branch Details", icon: <Store size={18} /> },
            { id: "notifications", label: "Notifications", icon: <Bell size={18} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab.id 
                ? "bg-blue-600 text-white shadow-md" 
                : "bg-white text-gray-500 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center gap-3">
                {tab.icon}
                {tab.label}
              </div>
              <ChevronRight size={14} opacity={activeTab === tab.id ? 1 : 0} />
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {activeTab === "profile" && (
            <div className="p-6 space-y-6">
              <h3 className="text-lg font-bold text-gray-800 border-b pb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Full Name</label>
                  <input type="text" defaultValue="John Doe" className="w-full p-2.5 bg-gray-50 border-none rounded-lg text-sm font-bold focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Address</label>
                  <input type="email" defaultValue="johndoe@gmail.com" className="w-full p-2.5 bg-gray-50 border-none rounded-lg text-sm font-bold opacity-70 cursor-not-allowed" disabled />
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="p-6 space-y-6">
              <h3 className="text-lg font-bold text-gray-800 border-b pb-4">Security Settings</h3>
              <div className="space-y-4 max-w-sm">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Current Password</label>
                  <input type="password" placeholder="••••••••" className="w-full p-2.5 bg-gray-50 border-none rounded-lg text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">New Password</label>
                  <input type="password" placeholder="••••••••" className="w-full p-2.5 bg-gray-50 border-none rounded-lg text-sm" />
                </div>
              </div>
            </div>
          )}

          {activeTab === "branch" && (
            <div className="p-6 space-y-6">
              <h3 className="text-lg font-bold text-gray-800 border-b pb-4">Local Branch Config</h3>
              <div className="space-y-4">
                 <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <div className="flex items-center gap-3">
                      <Smartphone className="text-blue-600" />
                      <div>
                        <p className="text-sm font-bold text-blue-900">Branch Phone Number</p>
                        <p className="text-xs text-blue-700">Shown on receipts for customers</p>
                      </div>
                    </div>
                    <input type="text" defaultValue="+254 700 000 000" className="bg-white border-none rounded-lg text-sm font-bold p-2 w-40 text-right" />
                 </div>
                 <div className="space-y-1 pt-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Receipt Footer Message</label>
                    <textarea defaultValue="Thank you for shopping at RetailCore Chuka! Please come again." rows="3" className="w-full p-3 bg-gray-50 border-none rounded-xl text-sm font-medium" />
                 </div>
              </div>
            </div>
          )}

          {/* Save Footer */}
          <div className="p-4 bg-gray-50 flex justify-end">
            <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-blue-700 transition shadow-md">
              <Save size={16} /> SAVE CHANGES
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerSettings;