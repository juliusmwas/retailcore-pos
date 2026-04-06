import React, { useState, useEffect } from "react";
import { useAuth } from "../../auth/AuthContext";
import axios from "axios";
import {
  Users2,
  ShieldCheck,
  Clock,
  Award,
  MoreVertical,
  Ban,
} from "lucide-react";

const ManagerStaff = () => {
  const { user, token } = useAuth();
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. DEFINE IT FIRST
  const fetchStaff = async () => {
    if (!user?.branchId || !token) return;
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5000/api/staff/directory?branchId=${user.branchId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      // Backend returns { data: [...] }
      setStaff(response.data.data || []);
    } catch (error) {
      console.error("Error loading staff:", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. CALL IT SECOND
  useEffect(() => {
    fetchStaff();
  }, [user?.branchId, token]);

  // 3. CALCULATE DATA THIRD
  const activeNow = staff.filter((member) => member.status === "ACTIVE").length;

  const topSeller =
    staff.length > 0
      ? staff
          .filter((member) => member.role === "CASHIER") // Only look at cashiers
          .reduce(
            (prev, current) => {
              const getAmount = (val) =>
                Number(String(val || 0).replace(/[^0-9.-]+/g, ""));
              return getAmount(current.salesToday) > getAmount(prev.salesToday)
                ? current
                : prev;
            },
            staff.find((m) => m.role === "CASHIER") || { fullName: "N/A" },
          ) // Default to first cashier found
      : { fullName: "N/A" };

  // Mock Data - Only showing staff assigned to the Chuka Branch
  const [staff1] = useState([
    {
      id: "STF-1003",
      name: "Hannah Janet",
      role: "CASHIER",
      email: "hannahj@gmail.com",
      salesToday: "KES 12,400",
      status: "Active",
      lastLogin: "08:15 AM",
    },
    {
      id: "STF-1004",
      name: "Antony Taylor",
      role: "CASHIER",
      email: "antony@gmail.com",
      salesToday: "KES 8,200",
      status: "Active",
      lastLogin: "09:00 AM",
    },
    {
      id: "STF-1010",
      name: "Jane Doe",
      role: "CASHIER",
      email: "janedoe@gmail.com",
      salesToday: "KES 0",
      status: "Suspended",
      lastLogin: "Never",
    },
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
            Staff & Performance
          </h1>
          <p className="text-sm text-gray-500 font-medium">
            Manage your team at {user?.branchName || "your branch"}
          </p>
        </div>
        <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-xl border border-green-100">
          <ShieldCheck size={18} />
          <span className="text-xs font-black uppercase">Branch Secure</span>
        </div>
      </div>

      {/* Staff Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Team */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <Users2 size={24} />
          </div>
          <div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
              Total Team
            </p>
            <h3 className="text-xl font-bold text-gray-800">
              {loading ? "..." : `${staff.length} Members`}
            </h3>
          </div>
        </div>

        {/* Active Now */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-xl">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
              Active Now
            </p>
            <h3 className="text-xl font-bold text-gray-800">
              {loading ? "..." : `${activeNow} On Shift`}
            </h3>
          </div>
        </div>

        {/* Top Seller */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Award size={24} />
          </div>
          <div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
              Top Seller
            </p>
            <h3 className="text-xl font-bold text-gray-800">
              {loading
                ? "..."
                : topSeller.fullName?.split(" ")[0] +
                  (topSeller.fullName?.split(" ")[1]
                    ? ` ${topSeller.fullName.split(" ")[1][0]}.`
                    : "")}
            </h3>
          </div>
        </div>
      </div>

      {/* Staff List Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {staff1.map((member) => (
          <div
            key={member.id}
            className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4 relative overflow-hidden group hover:border-blue-200 transition-all"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center font-bold text-gray-500 text-lg border border-gray-200 uppercase">
                  {member.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">{member.name}</h4>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-tighter">
                    {member.id}
                  </p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600 p-1">
                <MoreVertical size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 py-2 border-y border-gray-50">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Sales Today
                </p>
                <p className="text-sm font-black text-blue-600">
                  {member.salesToday}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Last Check-in
                </p>
                <p className="text-sm font-bold text-gray-600">
                  {member.lastLogin}
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span
                className={`px-3 py-1 rounded-full text-[10px] font-black ${
                  member.status === "Active"
                    ? "bg-green-50 text-green-600"
                    : "bg-red-50 text-red-600"
                }`}
              >
                {member.status.toUpperCase()}
              </span>

              {/* Manager Action Button */}
              {member.status === "Active" ? (
                <button className="flex items-center gap-1.5 text-red-500 text-[10px] font-black hover:bg-red-50 px-2 py-1 rounded-lg transition uppercase">
                  <Ban size={14} /> Suspend Access
                </button>
              ) : (
                <button className="flex items-center gap-1.5 text-blue-600 text-[10px] font-black hover:bg-blue-50 px-2 py-1 rounded-lg transition uppercase">
                  <ShieldCheck size={14} /> Reactivate
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManagerStaff;
