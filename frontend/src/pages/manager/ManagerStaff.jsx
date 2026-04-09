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

  const formatLastLogin = (dateString) => {
    if (!dateString || dateString === "Never") return "Never";
    try {
      const date = new Date(dateString);
      // Returns "06 Apr, 11:36"
      return date
        .toLocaleString("en-GB", {
          day: "2-digit",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false, // Switches to the 24-hour format in your image
        })
        .replace(" at", ","); // Ensures a comma between the date and time
    } catch (e) {
      return dateString;
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "ACTIVE" ? "SUSPENDED" : "ACTIVE";

    try {
      // Matches your route: router.put("/:id", ...)
      await axios.put(
        `http://localhost:5000/api/staff/${id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // Refresh the list to see the changes
      fetchStaff();
    } catch (error) {
      console.error("Error updating status:", error);
      window.alert(
        "Failed to update staff status. Please check your connection.",
      );
    }
  };

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
        {staff.map((member) => {
          const isMe = member.id === user?.id;
          // Check if the role is a Manager or Admin to hide sales
          const isManagementRole =
            member.role === "MANAGER" || member.role === "ADMIN";

          return (
            <div
              key={member.id}
              className={`p-5 rounded-2xl shadow-sm border flex flex-col gap-4 relative overflow-hidden transition-all ${
                isMe
                  ? "bg-blue-50/50 border-blue-200 ring-1 ring-blue-100"
                  : "bg-white border-gray-100 group hover:border-blue-200"
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg border uppercase ${
                      isMe
                        ? "bg-blue-600 text-white border-blue-700"
                        : "bg-gray-100 text-gray-500 border-gray-200"
                    }`}
                  >
                    {member.fullName?.charAt(0) || "U"}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-gray-800 capitalize">
                        {member.fullName}
                      </h4>
                      {isMe && (
                        <span className="text-[9px] bg-blue-600 text-white px-1.5 py-0.5 rounded-md font-black uppercase tracking-tighter">
                          You
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-tighter">
                      {member.staffNumber || "NO ID"} • {member.role}
                    </p>
                  </div>
                </div>
                {!isMe && (
                  <button className="text-gray-400 hover:text-gray-600 p-1">
                    <MoreVertical size={18} />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2 border-y border-gray-50">
                <div className="border-b sm:border-b-0 sm:border-r border-gray-50 pb-2 sm:pb-0">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Sales Today
                  </p>
                  <p
                    className={`text-sm font-black ${isManagementRole ? "text-gray-400 italic font-medium" : "text-blue-600"}`}
                  >
                    {isManagementRole
                      ? "N/A (Management)"
                      : `KES ${Number(member.salesToday || 0).toLocaleString()}`}
                  </p>
                </div>
                <div className="sm:pl-2">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Last Check-in
                  </p>
                  <p className="text-sm font-bold text-gray-600">
                    {formatLastLogin(member.lastLogin)}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-black ${
                    member.status === "ACTIVE"
                      ? "bg-green-50 text-green-600"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  {member.status}
                </span>

                {!isMe ? (
                  <button
                    onClick={() => handleToggleStatus(member.id, member.status)}
                    className={`flex items-center gap-1.5 text-[10px] font-black px-2 py-1 rounded-lg transition uppercase ${
                      member.status === "ACTIVE"
                        ? "text-red-500 hover:bg-red-50"
                        : "text-blue-600 hover:bg-blue-50"
                    }`}
                  >
                    {member.status === "ACTIVE" ? (
                      <>
                        <Ban size={14} /> Suspend Access
                      </>
                    ) : (
                      <>
                        <ShieldCheck size={14} /> Reactivate
                      </>
                    )}
                  </button>
                ) : (
                  <span className="text-[10px] font-bold text-blue-400 italic px-2 flex items-center gap-1">
                    <ShieldCheck size={12} /> Managed Account
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ManagerStaff;
