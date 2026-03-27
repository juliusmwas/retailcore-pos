import React, { useState } from "react";
import { Search, Filter, Eye, Download, FileText } from "lucide-react";

const ManagerSales = () => {
  // Mock Data - We will connect this to your PostgreSQL 'sales' table later
  const [sales] = useState([
    { id: "RCP-8821", time: "10:45 AM", customer: "Walking Customer", items: 3, total: "KES 1,200", method: "M-Pesa", status: "Completed" },
    { id: "RCP-8820", time: "10:30 AM", customer: "Alice Njeri", items: 1, total: "KES 450", method: "Cash", status: "Completed" },
    { id: "RCP-8819", time: "09:15 AM", customer: "Walking Customer", items: 5, total: "KES 8,900", method: "Card", status: "Voided" },
    { id: "RCP-8818", time: "08:50 AM", customer: "Walking Customer", items: 2, total: "KES 2,100", method: "M-Pesa", status: "Completed" },
  ]);

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Sales & Orders</h1>
          <p className="text-sm text-gray-500 font-medium">Manage and audit all branch transactions</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl font-bold text-xs hover:bg-gray-50 transition shadow-sm">
            <Download size={16} /> EXPORT CSV
          </button>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl font-bold text-xs hover:bg-blue-700 transition shadow-md">
            <FileText size={16} /> PRINT DAILY LOG
          </button>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by Receipt ID or Customer..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
        <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl cursor-pointer hover:bg-gray-100">
          <Filter size={16} className="text-gray-500" />
          <span className="text-sm font-bold text-gray-600 uppercase tracking-tighter">Filter By Method</span>
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Receipt ID</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Time</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Payment</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {sales.map((sale) => (
              <tr key={sale.id} className="hover:bg-blue-50/30 transition group">
                <td className="px-6 py-4">
                  <span className="font-bold text-blue-700 text-sm">{sale.id}</span>
                </td>
                <td className="px-6 py-4 text-xs font-bold text-gray-500">{sale.time}</td>
                <td className="px-6 py-4 text-sm font-bold text-gray-700">{sale.customer}</td>
                <td className="px-6 py-4">
                   <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-[10px] font-black">
                     {sale.method}
                   </span>
                </td>
                <td className="px-6 py-4 font-black text-sm text-gray-800">{sale.total}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black ${
                    sale.status === 'Completed' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                  }`}>
                    {sale.status.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagerSales;