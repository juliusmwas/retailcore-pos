import { useState } from "react";
import { User, Lock, Home, Settings as SettingsIcon, Save } from "lucide-react";

export default function Settings() {
  // Mock state
  const [profile, setProfile] = useState({
    fullName: "John Doe",
    email: "admin@example.com",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [business, setBusiness] = useState({
    name: "My Business",
    address: "123 Nairobi St",
    phone: "+254 700 000 000",
    taxPercent: 16,
    currency: "KES",
  });

  const handleProfileSave = () => alert("Profile saved (mock)!");
  const handlePasswordChange = () => alert("Password changed (mock)!");
  const handleBusinessSave = () => alert("Business settings saved (mock)!");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <SettingsIcon className="w-6 h-6 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
      </div>

      {/* Profile Info */}
      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
          <User className="w-5 h-5 text-blue-500" /> Profile Info
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            value={profile.fullName}
            onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
            placeholder="Full Name"
            className="p-3 border rounded-lg w-full"
          />
          <input
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            placeholder="Email"
            className="p-3 border rounded-lg w-full"
          />
        </div>
        <button
          onClick={handleProfileSave}
          className="mt-2 bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
        >
          <Save className="w-4 h-4" /> Save Profile
        </button>
      </div>

      {/* Change Password */}
      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
          <Lock className="w-5 h-5 text-green-500" /> Change Password
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="password"
            value={passwords.current}
            onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
            placeholder="Current Password"
            className="p-3 border rounded-lg w-full"
          />
          <input
            type="password"
            value={passwords.new}
            onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
            placeholder="New Password"
            className="p-3 border rounded-lg w-full"
          />
          <input
            type="password"
            value={passwords.confirm}
            onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
            placeholder="Confirm Password"
            className="p-3 border rounded-lg w-full"
          />
        </div>
        <button
          onClick={handlePasswordChange}
          className="mt-2 bg-green-600 text-white py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-green-700 transition"
        >
          <Save className="w-4 h-4" /> Change Password
        </button>
      </div>

      {/* Business / System Settings */}
      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
          <Home className="w-5 h-5 text-purple-500" /> Business Settings
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            value={business.name}
            onChange={(e) => setBusiness({ ...business, name: e.target.value })}
            placeholder="Business Name"
            className="p-3 border rounded-lg w-full"
          />
          <input
            type="text"
            value={business.address}
            onChange={(e) => setBusiness({ ...business, address: e.target.value })}
            placeholder="Address"
            className="p-3 border rounded-lg w-full"
          />
          <input
            type="text"
            value={business.phone}
            onChange={(e) => setBusiness({ ...business, phone: e.target.value })}
            placeholder="Phone"
            className="p-3 border rounded-lg w-full"
          />
          <input
            type="number"
            value={business.taxPercent}
            onChange={(e) => setBusiness({ ...business, taxPercent: e.target.value })}
            placeholder="Tax %"
            className="p-3 border rounded-lg w-full"
          />
          <input
            type="text"
            value={business.currency}
            onChange={(e) => setBusiness({ ...business, currency: e.target.value })}
            placeholder="Currency"
            className="p-3 border rounded-lg w-full"
          />
        </div>
        <button
          onClick={handleBusinessSave}
          className="mt-2 bg-purple-600 text-white py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-purple-700 transition"
        >
          <Save className="w-4 h-4" /> Save Business Settings
        </button>
      </div>
    </div>
  );
}
