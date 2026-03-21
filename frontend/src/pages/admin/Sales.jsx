import { useState } from "react";
import { 
  ShoppingCart, CreditCard, Banknote, Store, 
  Receipt, Search, Filter, Download, ChevronRight, User 
} from "lucide-react";

export default function Sales() {
  const [sales] = useState([
    { id: "TXN-1001", date: "2026-01-26", branch: "Nairobi CBD", cashier: "John Mwangi", amount: 2450, payment: "MPESA", status: "COMPLETED" },
    { id: "TXN-1002", date: "2026-01-26", branch: "Westlands", cashier: "Alice Njeri", amount: 1320, payment: "CASH", status: "COMPLETED" },
    { id: "TXN-1003", date: "2026-01-26", branch: "Kasarani", cashier: "Peter Otieno", amount: 980, payment: "CARD", status: "REFUNDED" },
  ]);

  const [salesStats, setSalesStats] = useState({ total: 0, mobileAndCash: 0, cards: 0 });

// Inside your useEffect (or wherever you fetch your data)
const fetchStats = async () => {
  try {
    const response = await axios.get(`/api/sales/stats?businessId=${businessId}&branchId=${selectedBranch}`);
    setSalesStats(response.data);
  } catch (error) {
    console.error("Error fetching stats", error);
  }
};


  return (
    <div className="p-8 bg-[#f8fafc] min-h-screen space-y-8">
      
      {/* 1. TOP HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-blue-600 rounded-xl text-white">
              <ShoppingCart size={24} />
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Sales Ledger</h1>
          </div>
          <p className="text-sm text-gray-500 font-medium">Real-time transaction monitoring across all active branches</p>
        </div>
      
      </div>

      {/* 2. STATS GRID - FUNCTIONAL VERSION */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {/* Total Volume */}
  <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between">
    <div className="space-y-1">
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Volume</p>
      <p className="text-2xl font-black text-gray-900">
        KES {salesStats.total.toLocaleString()}
      </p>
    </div>
    <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
      <Receipt size={24} />
    </div>
  </div>

  {/* Mobile & Cash */}
  <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between">
    <div className="space-y-1">
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Mobile & Cash</p>
      <p className="text-2xl font-black text-green-600">
        KES {salesStats.mobileAndCash.toLocaleString()}
      </p>
    </div>
    <div className="p-4 bg-green-50 text-green-600 rounded-2xl">
      <Banknote size={24} />
    </div>
  </div>

  {/* Digital Cards */}
  <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between">
    <div className="space-y-1">
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Digital Cards</p>
      <p className="text-2xl font-black text-purple-600">
        KES {salesStats.cards.toLocaleString()}
      </p>
    </div>
    <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl">
      <CreditCard size={24} />
    </div>
  </div>
</div>

      {/* 3. SEARCH & FILTER BAR */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search by Transaction ID or Cashier..." 
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-50 transition-all font-medium text-gray-600 shadow-sm"
          />
        </div>
        <button className="px-6 py-4 bg-white border border-gray-100 rounded-2xl font-bold text-gray-600 flex items-center gap-2 hover:bg-gray-50 shadow-sm transition-all">
          <Filter size={20} /> Filters
        </button>
      </div>

      {/* 4. MODERN FLOATING TABLE */}
      <div className="space-y-4">
        {/* Table Header (Hidden on small screens) */}
        <div className="hidden md:grid grid-cols-6 px-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
          <div>Transaction</div>
          <div>Location</div>
          <div>Cashier</div>
          <div className="text-center">Payment</div>
          <div className="text-center">Amount</div>
          <div className="text-right">Status</div>
        </div>

        {/* Rows */}
        {sales.map((sale) => (
          <div 
            key={sale.id} 
            className="grid grid-cols-1 md:grid-cols-6 items-center px-8 py-6 bg-white border border-gray-50 rounded-[2rem] shadow-sm hover:shadow-md hover:border-blue-100 transition-all group cursor-pointer"
          >
            <div className="flex flex-col">
              <span className="text-xs font-black text-blue-600 font-mono tracking-tighter uppercase">{sale.id}</span>
              <span className="text-[10px] text-gray-400 font-bold">{sale.date}</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-blue-50 transition-colors">
                <Store size={14} className="text-gray-400 group-hover:text-blue-600" />
              </div>
              <span className="text-sm font-bold text-gray-700">{sale.branch}</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-100 to-gray-200 flex items-center justify-center border border-white shadow-sm">
                <User size={14} className="text-gray-500" />
              </div>
              <span className="text-sm font-bold text-gray-700">{sale.cashier}</span>
            </div>

            <div className="text-center">
              <span className="px-3 py-1 bg-gray-100 text-[10px] font-black rounded-lg text-gray-500 uppercase">
                {sale.payment}
              </span>
            </div>

            <div className="text-center">
              <span className="text-base font-black text-gray-900">KES {sale.amount.toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-end gap-4">
              <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black border ${
                sale.status === "COMPLETED" 
                  ? "bg-green-50 text-green-700 border-green-100" 
                  : "bg-red-50 text-red-700 border-red-100"
              }`}>
                {sale.status}
              </span>
              <ChevronRight size={18} className="text-gray-300 group-hover:text-blue-600 transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}