import React, { useState } from "react";
import { Search, Plus, Package, AlertCircle, ArrowUpRight } from "lucide-react";

const ManagerInventory = () => {
  // Mock Data - Representing items specifically in this branch
  const [inventory] = useState([
    { id: "PRD-001", name: "Sugar 1kg", category: "Groceries", stock: 5, price: "KES 150", status: "Low Stock" },
    { id: "PRD-042", name: "Cooking Oil 2L", category: "Groceries", stock: 24, price: "KES 650", status: "In Stock" },
    { id: "PRD-109", name: "LED Bulb 12W", category: "Electronics", stock: 0, price: "KES 300", status: "Out of Stock" },
    { id: "PRD-215", name: "Bread (White)", category: "Groceries", stock: 12, price: "KES 650", status: "In Stock" },
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Branch Inventory</h1>
          <p className="text-sm text-gray-500 font-medium">Track and adjust stock levels for Chuka Branch</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition shadow-lg shadow-blue-200">
          <Plus size={18} /> REQUEST RESTOCK
        </button>
      </div>

      {/* Inventory Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Package size={24} /></div>
          <div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Total SKUs</p>
            <h3 className="text-xl font-bold text-gray-800">142 Items</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 border-l-4 border-l-amber-400">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><AlertCircle size={24} /></div>
          <div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Low Stock</p>
            <h3 className="text-xl font-bold text-gray-800">12 Items</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 border-l-4 border-l-red-500">
          <div className="p-3 bg-red-50 text-red-600 rounded-xl"><Package size={24} /></div>
          <div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Out of Stock</p>
            <h3 className="text-xl font-bold text-gray-800">3 Items</h3>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-50 flex items-center gap-4">
           <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Search inventory..." className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm" />
           </div>
        </div>

        <table className="w-full text-left">
          <thead className="bg-gray-50/50">
            <tr>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Product</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Category</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Current Stock</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Price</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {inventory.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50/50 transition">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-800 text-sm">{item.name}</span>
                    <span className="text-[10px] font-bold text-blue-500 uppercase tracking-tighter">{item.id}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-xs font-bold text-gray-500">{item.category}</td>
                <td className="px-6 py-4 font-black text-sm text-gray-700">{item.stock} Units</td>
                <td className="px-6 py-4 font-black text-sm text-gray-800">{item.price}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black ${
                    item.status === 'In Stock' ? 'bg-green-50 text-green-600' : 
                    item.status === 'Low Stock' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
                  }`}>
                    {item.status.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg font-bold text-xs flex items-center gap-1 transition">
                    ADJUST <ArrowUpRight size={14} />
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

export default ManagerInventory;