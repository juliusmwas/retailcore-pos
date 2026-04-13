import { useState, useEffect } from "react";
import axios from "axios";
import {
  User,
  Lock,
  Home,
  Settings as SettingsIcon,
  Save,
  Globe,
  Bell,
  ShieldCheck,
  CreditCard,
  Database,
} from "lucide-react";

export default function Settings() {
  const [activeSection, setActiveSection] = useState("profile");

  // State Groups
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    const authData = JSON.parse(localStorage.getItem("auth") || "{}");

    if (authData.user) {
      setProfile({
        // Look for business name specifically, fall back to empty string if missing
        fullName: authData.user.business?.name || authData.businessName || "",
        email: authData.user.email || "",
        role: authData.user.role || "OWNER",
      });
    }
  }, []);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateProfile = async () => {
    try {
      const authData = JSON.parse(localStorage.getItem("auth") || "{}");
      const token = authData.token;

      if (!token) {
        alert("Session expired. Please log in again.");
        return;
      }

      const response = await axios.put(
        "http://localhost:5000/api/staff/profile/update",
        {
          fullName: profile.fullName,
          email: profile.email,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.data.success) {
        alert("Admin profile updated!");

        // Clone the current auth data
        const updatedAuth = { ...authData };

        // Update the USER properties specifically
        updatedAuth.user.fullName = profile.fullName;
        updatedAuth.user.email = profile.email;

        // Note: We do NOT touch updatedAuth.user.business.name here
        // because that is handled in the Store Settings section.

        // Save the cleaned-up object back to storage
        localStorage.setItem("auth", JSON.stringify(updatedAuth));

        // Optional: Update the state to reflect the sync
        setProfile((prev) => ({
          ...prev,
          fullName: profile.fullName,
          email: profile.email,
        }));
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert(error.response?.data?.message || "Failed to update profile.");
    }
  };

  // State for the Store Settings section
  const [business, setBusiness] = useState({
    name: "",
    address: "",
    phone: "",
    taxPercent: 16,
    currency: "KES",
  });

  // Add this handler for business fields
  const handleBusinessChange = (e) => {
    const { name, value } = e.target;
    setBusiness((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    const authData = JSON.parse(localStorage.getItem("auth") || "{}");

    if (authData.user) {
      // 1. Set the Person's Profile (Admin details)
      setProfile({
        // We look for fullName on the user object, not the business object
        fullName: authData.user.fullName || "",
        email: authData.user.email || "",
        role: authData.user.role || "OWNER",
      });

      // 2. Set the Business Profile (Store details)
      if (authData.user.business) {
        setBusiness({
          name: authData.user.business.name || "",
          address: authData.user.business.address || "",
          phone: authData.user.business.phone || "",
          taxPercent: authData.user.business.taxPercent || 16,
          currency: authData.user.business.currency || "KES",
        });
      }
    }
  }, []);

  const handleSyncStoreConfig = async () => {
    try {
      const authData = JSON.parse(localStorage.getItem("auth") || "{}");
      const token = authData.token;

      if (!token) {
        alert("Your session has expired. Please log in again.");
        return;
      }

      const response = await axios.put(
        "http://localhost:5000/api/business/settings",
        {
          name: business.name,
          address: business.address,
          phone: business.phone,
          taxPercent: business.taxPercent,
          currency: business.currency,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.data.success) {
        alert("Store Identity Updated!");

        // Update local storage so "Prime Supermarket" stays after refresh
        const updatedAuth = { ...authData };
        updatedAuth.user.business = response.data.business;
        localStorage.setItem("auth", JSON.stringify(updatedAuth));
      }
    } catch (error) {
      console.error("Sync Error:", error);
      alert(
        error.response?.data?.message ||
          "Internal Server Error - Check Backend Console",
      );
    }
  };

  const sidebarItems = [
    {
      id: "profile",
      label: "Admin Profile",
      icon: User,
      color: "text-blue-600",
    },
    {
      id: "business",
      label: "Store Settings",
      icon: Home,
      color: "text-purple-600",
    },
    {
      id: "security",
      label: "Security & Access",
      icon: Lock,
      color: "text-red-600",
    },
    {
      id: "system",
      label: "System Config",
      icon: Database,
      color: "text-emerald-600",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-4">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            System Settings
          </h1>
          <p className="text-gray-500 text-sm font-medium uppercase tracking-widest mt-1">
            Manage your RetailCore ecosystem
          </p>
        </div>
        <div className="flex items-center gap-3 bg-indigo-50 px-4 py-2 rounded-2xl border border-indigo-100">
          <ShieldCheck className="text-indigo-600 w-5 h-5" />
          <span className="text-indigo-700 font-bold text-xs uppercase tracking-tighter">
            Authorized Admin Access
          </span>
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
              <item.icon
                className={`w-5 h-5 ${activeSection === item.id ? item.color : "group-hover:text-gray-600"}`}
              />
              <span
                className={`font-bold text-xs uppercase tracking-widest ${activeSection === item.id ? "text-gray-900" : ""}`}
              >
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
                <h2 className="text-xl font-bold text-gray-900 uppercase tracking-tighter">
                  Admin Profile
                </h2>
                <div className="px-3 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full uppercase tracking-widest">
                  {profile.role}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">
                    Full Name
                  </label>
                  <input
                    name="fullName" // Crucial: must match the state key
                    type="text"
                    value={profile.fullName}
                    onChange={handleProfileChange}
                    className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-700 focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">
                    Email Address
                  </label>
                  <input
                    name="email" // Crucial: must match the state key
                    type="email"
                    value={profile.email}
                    onChange={handleProfileChange}
                    className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-700 focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>
              <button
                onClick={handleUpdateProfile}
                className="flex items-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-200 active:scale-95 transition-all"
              >
                <Save size={18} /> Update Profile
              </button>
            </div>
          )}

          {/* BUSINESS SECTION */}
          {activeSection === "business" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-xl font-bold text-gray-900 uppercase tracking-tighter">
                Store Identity & Finance
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 lg:col-span-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">
                    Registered Business Name
                  </label>
                  <input
                    name="name"
                    type="text"
                    value={business.name}
                    onChange={handleBusinessChange}
                    className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-700 focus:ring-2 focus:ring-purple-500 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">
                    Physical Address
                  </label>
                  <input
                    name="address"
                    type="text"
                    value={business.address}
                    onChange={handleBusinessChange}
                    className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-700 focus:ring-2 focus:ring-purple-500 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">
                    Contact Number
                  </label>
                  <input
                    name="phone"
                    type="text"
                    value={business.phone}
                    onChange={handleBusinessChange}
                    className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-700 focus:ring-2 focus:ring-purple-500 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">
                    VAT/Tax Percentage (%)
                  </label>
                  <input
                    name="taxPercent"
                    type="number"
                    value={business.taxPercent}
                    onChange={handleBusinessChange}
                    className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-700 focus:ring-2 focus:ring-purple-500 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">
                    Default Currency
                  </label>
                  <select
                    name="currency"
                    value={business.currency}
                    onChange={handleBusinessChange}
                    className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-700 appearance-none focus:ring-2 focus:ring-purple-500 transition-all"
                  >
                    <option value="KES">KES - Kenyan Shilling</option>
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                  </select>
                </div>
              </div>
              <button
                onClick={handleSyncStoreConfig}
                className="flex items-center gap-3 bg-purple-600 text-white px-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-purple-700 shadow-lg shadow-purple-200 active:scale-95 transition-all"
              >
                <Save size={18} /> Sync Store Config
              </button>
            </div>
          )}

          {/* SECURITY SECTION */}
          {activeSection === "security" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-xl font-bold text-gray-900 uppercase tracking-tighter">
                Access Control
              </h2>
              <div className="p-6 bg-red-50 rounded-3xl border border-red-100 flex items-start gap-4">
                <ShieldCheck className="text-red-600 mt-1" />
                <div>
                  <h4 className="font-bold text-red-900 text-xs uppercase tracking-widest">
                    Two-Factor Authentication
                  </h4>
                  <p className="text-red-700 text-[11px] font-medium">
                    Add an extra layer of security to your admin account. Highly
                    recommended.
                  </p>
                  <button className="mt-3 text-red-600 font-bold text-[10px] uppercase underline">
                    Enable 2FA Now
                  </button>
                </div>
              </div>
              <div className="space-y-6">
                <input
                  type="password"
                  placeholder="Current Password"
                  className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-700"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="password"
                    placeholder="New Password"
                    className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-700"
                  />
                  <input
                    type="password"
                    placeholder="Verify Password"
                    className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-700"
                  />
                </div>
              </div>
              <button className="flex items-center gap-3 bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-bold transition-all">
                <Lock size={18} /> Update Security
              </button>
            </div>
          )}

          {/* SYSTEM SECTION */}
          {activeSection === "system" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-center py-10">
              <Database size={48} className="mx-auto text-emerald-600" />
              <div>
                <h2 className="text-xl font-bold text-gray-900 uppercase tracking-tighter">
                  Maintenance Mode
                </h2>
                <p className="text-gray-500 max-w-xs mx-auto text-sm mt-2">
                  Backup your database or toggle the system status across all
                  branches.
                </p>
              </div>
              <div className="flex justify-center gap-4">
                <button className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold text-xs uppercase">
                  Download Backup
                </button>
                <button className="bg-gray-100 text-gray-600 px-6 py-3 rounded-xl font-bold text-xs uppercase">
                  Clear System Cache
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
