import { useState } from "react";
import { 
  User, Lock, Home, Settings as SettingsIcon, Save, 
  Globe, Bell, ShieldCheck, CreditCard, Database 
} from "lucide-react";

export default function Settings() {
  const [activeSection, setActiveSection] = useState("profile");

  // State Groups
  const [profile, setProfile] = useState({ fullName: "John Doe", email: "admin@retailcore.com", role: "Super Admin" });
  const [business, setBusiness] = useState({ 
    name: "RetailCore Nairobi", 
    address: "Westlands, Nairobi", 
    phone: "+254 700 000 000", 
    taxPercent: 16, 
    currency: "KES" 
  });

  const sidebarItems = [
    { id: "profile", label: "Admin Profile", icon: User, color: "text-blue-600" },
    { id: "business", label: "Store Settings", icon: Home, color: "text-purple-600" },
    { id: "security", label: "Security & Access", icon: Lock, color: "text-red-600" },
    { id: "system", label: "System Config", icon: Database, color: "text-emerald-600" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-4">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">SYSTEM SETTINGS</h1>
          <p className="text-gray-500 text-sm font-medium uppercase tracking-widest mt-1">Manage your RetailCore ecosystem</p>
        </div>
        <div className="flex items-center gap-3 bg-indigo-50 px-4 py-2 rounded-2xl border border-indigo-100">
          <ShieldCheck className="text-indigo-600 w-5 h-5" />
          <span className="text-indigo-700 font-bold text-xs uppercase tracking-tighter">Authorized Admin Access</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-2">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-[1.5rem] transition-all duration-200 group ${
                activeSection === item.id 
                ? "bg-white shadow-xl shadow-gray-100 scale-105" 
                : "hover:bg-gray-50 text-gray-400"
              }`}
            >
              <item.icon className={`w-5 h-5 ${activeSection === item.id ? item.color : "group-hover:text-gray-600"}`} />
              <span className={`font-black text-xs uppercase tracking-widest ${activeSection === item.id ? "text-gray-900" : ""}`}>
                {item.label}
              </span>
            </button>
          ))}
        </div>

        {/* Content Panel */}
        <div className="lg:col-span-9 bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-gray-100/50 p-10">
          
          {/* PROFILE SECTION */}
          {activeSection === "profile" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Admin Profile</h2>
                <div className="px-3 py-1 bg-blue-100 text-blue-700 text-[10px] font-black rounded-full uppercase tracking-widest">
                  {profile.role}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Full Name</label>
                  <input 
                    type="text" value={profile.fullName} 
                    className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-700 focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Email Address</label>
                  <input 
                    type="email" value={profile.email} 
                    className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-700 focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>
              <button className="flex items-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-200 active:scale-95 transition-all">
                <Save size={18} /> Update Profile
              </button>
            </div>
          )}

          {/* BUSINESS SECTION */}
          {activeSection === "business" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Store Identity & Finance</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 lg:col-span-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Registered Business Name</label>
                  <input type="text" value={business.name} className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-700" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Physical Address</label>
                  <input type="text" value={business.address} className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-700" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Contact Number</label>
                  <input type="text" value={business.phone} className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-700" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-2">VAT/Tax Percentage (%)</label>
                  <input type="number" value={business.taxPercent} className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-700" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Default Currency</label>
                  <select className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-700 appearance-none">
                    <option>KES - Kenyan Shilling</option>
                    <option>USD - US Dollar</option>
                    <option>EUR - Euro</option>
                  </select>
                </div>
              </div>
              <button className="flex items-center gap-3 bg-purple-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-purple-700 shadow-lg shadow-purple-200 active:scale-95 transition-all">
                <Save size={18} /> Sync Store Config
              </button>
            </div>
          )}

          {/* SECURITY SECTION */}
          {activeSection === "security" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Access Control</h2>
              <div className="p-6 bg-red-50 rounded-3xl border border-red-100 flex items-start gap-4">
                <ShieldCheck className="text-red-600 mt-1" />
                <div>
                  <h4 className="font-black text-red-900 text-xs uppercase tracking-widest">Two-Factor Authentication</h4>
                  <p className="text-red-700 text-[11px] font-medium">Add an extra layer of security to your admin account. Highly recommended.</p>
                  <button className="mt-3 text-red-600 font-black text-[10px] uppercase underline">Enable 2FA Now</button>
                </div>
              </div>
              <div className="space-y-6">
                 <input type="password" placeholder="Current Password" className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-700" />
                 <div className="grid grid-cols-2 gap-4">
                    <input type="password" placeholder="New Password" className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-700" />
                    <input type="password" placeholder="Verify Password" className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-700" />
                 </div>
              </div>
              <button className="flex items-center gap-3 bg-gray-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all">
                <Lock size={18} /> Update Security
              </button>
            </div>
          )}

          {/* SYSTEM SECTION */}
          {activeSection === "system" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-center py-10">
              <Database size={48} className="mx-auto text-emerald-600" />
              <div>
                <h2 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Maintenance Mode</h2>
                <p className="text-gray-500 max-w-xs mx-auto text-sm mt-2">Backup your database or toggle the system status across all branches.</p>
              </div>
              <div className="flex justify-center gap-4">
                 <button className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold text-xs uppercase">Download Backup</button>
                 <button className="bg-gray-100 text-gray-600 px-6 py-3 rounded-xl font-bold text-xs uppercase">Clear System Cache</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}