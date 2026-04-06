import React, { useState, useEffect } from "react"; // Added useEffect here
import { useAuth } from "../../auth/AuthContext";
import axios from "axios";
import {
  User,
  Lock,
  Store,
  Bell,
  Save,
  Smartphone,
  ChevronRight,
} from "lucide-react";

const ManagerSettings = () => {
  const { user, token } = useAuth(); // This brings the user object into scope
  const [activeTab, setActiveTab] = useState("profile");

  // Add this at the top of your component
  const [formData, setFormData] = useState({
    fullName: "", // Start with empty string, never undefined
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    branchPhone: "",
    receiptFooter: "",
  });

  // Update the useEffect in ManagerSettings.jsx
  useEffect(() => {
    if (user) {
      // If your user object has an array of branches, get the first name
      const branchName = user.branches?.[0]?.name || user.branchName || "";
      const bizName = user.businessName || "RetailCore";

      const defaultFooter = `Thank you for shopping at ${bizName} ${branchName}! Please come again.`;

      setFormData((prev) => ({
        ...prev,
        fullName: user.fullName || "",
        email: user.email || "",
        branchPhone: user.branchPhone || "",
        receiptFooter: user.receiptFooter || defaultFooter,
      }));
    }
  }, [user]);

  const handleSaveSettings = async () => {
    // Use the token from useAuth() if available, otherwise fallback to localStorage
    const activeToken =
      token ||
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken");

    if (!activeToken) {
      console.error("No token found in AuthContext or LocalStorage");
      return alert("Session expired. Please log in again.");
    }

    const authHeader = activeToken.startsWith("Bearer ")
      ? activeToken
      : `Bearer ${activeToken}`;

    try {
      const response = await axios.put(
        "http://localhost:5000/api/staff/settings/update",
        formData,
        { headers: { Authorization: authHeader } },
      );

      if (response.data.success) {
        alert("Settings updated successfully!");

        // OPTIONAL: If the user changed their name, update the local storage/context
        // so the header "Chuka Branch" area updates immediately
        if (formData.fullName !== user.fullName) {
          const updatedUser = { ...user, fullName: formData.fullName };
          localStorage.setItem("user", JSON.stringify(updatedUser));
          // window.location.reload(); // Quickest way to refresh all UI components
        }
      }
    } catch (error) {
      console.error("Save Error:", error);
      alert(error.response?.data?.message || "Connection Error");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
          Settings
        </h1>
        <p className="text-sm text-gray-500 font-medium">
          Manage your account and{" "}
          <span className="text-blue-600 font-bold">
            {user?.branchName || "Branch"}
          </span>{" "}
          preferences
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 space-y-1">
          {[
            { id: "profile", label: "Profile Info", icon: <User size={18} /> },
            { id: "security", label: "Security", icon: <Lock size={18} /> },
            {
              id: "branch",
              label: "Branch Details",
              icon: <Store size={18} />,
            },
            {
              id: "notifications",
              label: "Notifications",
              icon: <Bell size={18} />,
            },
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
              <h3 className="text-lg font-bold text-gray-800 border-b pb-4">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name Input */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    placeholder="Enter your full name"
                    className="w-full p-2.5 bg-gray-50 border-none rounded-lg text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>

                {/* Email Input (Disabled as per your design) */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    className="w-full p-2.5 bg-gray-50 border-none rounded-lg text-sm font-bold opacity-70 cursor-not-allowed"
                    disabled
                  />
                  <p className="text-[9px] text-gray-400 font-medium italic mt-1">
                    Email cannot be changed. Contact admin for assistance.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="p-6 space-y-6 animate-in fade-in duration-300">
              <h3 className="text-lg font-bold text-gray-800 border-b pb-4">
                Security Settings
              </h3>
              <div className="space-y-4 max-w-sm">
                {/* Current Password */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Current Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={formData.currentPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        currentPassword: e.target.value,
                      })
                    }
                    className="w-full p-2.5 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-red-200 transition-all"
                  />
                </div>

                <div className="pt-2 border-t border-gray-50 mt-4">
                  {/* New Password */}
                  <div className="space-y-1 mb-4">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      New Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={formData.newPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          newPassword: e.target.value,
                        })
                      }
                      className="w-full p-2.5 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>

                  {/* Confirm New Password */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className={`w-full p-2.5 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 transition-all ${
                        formData.confirmPassword &&
                        formData.newPassword !== formData.confirmPassword
                          ? "focus:ring-red-500 text-red-600"
                          : "focus:ring-blue-500"
                      }`}
                    />
                    {formData.confirmPassword &&
                      formData.newPassword !== formData.confirmPassword && (
                        <p className="text-[9px] text-red-500 font-bold mt-1 uppercase tracking-tighter">
                          Passwords do not match
                        </p>
                      )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "branch" && (
            <div className="p-6 space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between border-b pb-4">
                <h3 className="text-lg font-bold text-gray-800">
                  Local Branch Config
                </h3>
                <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-1 rounded-md font-black uppercase">
                  {user?.branchName || "Active Branch"}
                </span>
              </div>

              <div className="space-y-4">
                {/* Branch Phone Number */}
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <Smartphone className="text-blue-600" size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-blue-900">
                        Branch Phone Number
                      </p>
                      <p className="text-xs text-blue-700">
                        Printed on customer receipts
                      </p>
                    </div>
                  </div>
                  <input
                    type="text"
                    placeholder="+254..."
                    value={formData.branchPhone}
                    onChange={(e) =>
                      setFormData({ ...formData, branchPhone: e.target.value })
                    }
                    className="bg-white border-none rounded-lg text-sm font-bold p-2.5 w-48 text-right shadow-sm focus:ring-2 focus:ring-blue-400 transition-all"
                  />
                </div>

                {/* Receipt Footer Message */}
                <div className="space-y-2 pt-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                    Receipt Footer Message
                  </label>
                  <textarea
                    value={formData.receiptFooter}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        receiptFooter: e.target.value,
                      })
                    }
                    rows="3"
                    placeholder="Enter a custom message for your customers..."
                    className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-500 shadow-inner transition-all"
                  />
                  <p className="text-[10px] text-gray-400 italic px-1">
                    Tip: Mention your return policy or social media handles
                    here.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Save Footer */}
          <div className="p-4 bg-gray-50 flex justify-end">
            <button
              onClick={handleSaveSettings} // Add this line
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-blue-700 transition shadow-md"
            >
              <Save size={16} /> SAVE CHANGES
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerSettings;
