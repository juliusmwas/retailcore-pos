import React, { useState, useEffect } from "react"; // Added useEffect here
import { useAuth } from "../../auth/AuthContext";
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
  const { user } = useAuth(); // This brings the user object into scope
  const [activeTab, setActiveTab] = useState("profile");

  // Add this at the top of your component
  const [formData, setFormData] = useState({
    // Correct
    fullName: user?.fullName || "",
    email: user?.email || "",
    // New password fields
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSaveSettings = async () => {
    try {
      // Basic validation for passwords
      if (
        formData.newPassword &&
        formData.newPassword !== formData.confirmPassword
      ) {
        return alert("New passwords do not match!");
      }

      const response = await axios.put(
        `http://localhost:5000/api/staff/settings/update`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.data.success) {
        alert("Settings updated successfully!");
        // Optional: Update local storage if name changed
        const updatedUser = { ...user, ...response.data.data };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error("Save Error:", error);
      alert(error.response?.data?.message || "Failed to save settings");
    }
  };

  // Update the state if the user object changes (optional but good practice)
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
      });
    }
  }, [user]);

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
            <div className="p-6 space-y-6">
              <h3 className="text-lg font-bold text-gray-800 border-b pb-4">
                Local Branch Config
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-3">
                    <Smartphone className="text-blue-600" />
                    <div>
                      <p className="text-sm font-bold text-blue-900">
                        Branch Phone Number
                      </p>
                      <p className="text-xs text-blue-700">
                        Shown on receipts for customers
                      </p>
                    </div>
                  </div>
                  <input
                    type="text"
                    defaultValue="+254 700 000 000"
                    className="bg-white border-none rounded-lg text-sm font-bold p-2 w-40 text-right"
                  />
                </div>
                <div className="space-y-1 pt-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Receipt Footer Message
                  </label>
                  <textarea
                    defaultValue="Thank you for shopping at RetailCore Chuka! Please come again."
                    rows="3"
                    className="w-full p-3 bg-gray-50 border-none rounded-xl text-sm font-medium"
                  />
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
