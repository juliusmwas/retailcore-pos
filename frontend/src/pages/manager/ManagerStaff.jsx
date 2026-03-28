import React, { useState } from "react";
import { Users2, ShieldCheck, Clock, Award, MoreVertical, Ban } from "lucide-react";

const ManagerStaff = () => {
  // Mock Data - Only showing staff assigned to the Chuka Branch
  const [staff] = useState([
    { id: "STF-1003", name: "Hannah Janet", role: "CASHIER", email: "hannahj@gmail.com", salesToday: "KES 12,400", status: "Active", lastLogin: "08:15 AM" },
    { id: "STF-1004", name: "Antony Taylor", role: "CASHIER", email: "antony@gmail.com", salesToday: "KES 8,200", status: "Active", lastLogin: "09:00 AM" },
    { id: "STF-1010", name: "Jane Doe", role: "CASHIER", email: "janedoe@gmail.com", salesToday: "KES 0", status: "Suspended", lastLogin: "Never" },
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Staff & Performance</h1>
          <p className="text-sm text-gray-500 font-medium">Manage your team at Chuka Branch</p>
        </div>
        <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-xl border border-green-100">
          <ShieldCheck size={18} />
          <span className="text-xs font-black uppercase">Branch Secure</span>
        </div>
      </div>

      {/* Staff Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><Users2 size={24} /></div>
          <div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Total Team</p>
            <h3 className="text-xl font-bold text-gray-800">{staff.length} Members</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-xl"><Clock size={24} /></div>
          <div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Active Now</p>
            <h3 className="text-xl font-bold text-gray-800">2 On Shift</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Award size={24} /></div>
          <div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Top Seller</p>
            <h3 className="text-xl font-bold text-gray-800">Hannah J.</h3>
          </div>
        </div>
      </div>

      {/* Staff List Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {staff.map((member) => (
          <div key={member.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4 relative overflow-hidden group hover:border-blue-200 transition-all">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center font-bold text-gray-500 text-lg border border-gray-200 uppercase">
                  {member.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">{member.name}</h4>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-tighter">{member.id}</p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600 p-1"><MoreVertical size={18} /></button>
            </div>

            <div className="grid grid-cols-2 gap-4 py-2 border-y border-gray-50">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sales Today</p>
                <p className="text-sm font-black text-blue-600">{member.salesToday}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Last Check-in</p>
                <p className="text-sm font-bold text-gray-600">{member.lastLogin}</p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className={`px-3 py-1 rounded-full text-[10px] font-black ${
                member.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
              }`}>
                {member.status.toUpperCase()}
              </span>
              
              {/* Manager Action Button */}
              {member.status === 'Active' ? (
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