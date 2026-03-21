import { useState } from "react";
import { 
  ShoppingCart, CreditCard, Banknote, Store, 
  Receipt, Search, Filter, Download, ChevronRight, User 
} from "lucide-react";

export default function Sales() {
  const [sales, setSales] = useState([]); // Your sales data
  const [salesStats, setSalesStats] = useState({ total: 0, mobileAndCash: 0, cards: 0 });
  const [loading, setLoading] = useState(false);

const fetchStats = async () => {
  try {
    const response = await axios.get(`/api/sales/stats?businessId=${businessId}&branchId=${selectedBranch}`);
    setSalesStats(response.data);
  } catch (error) {
    console.error("Error fetching stats", error);
  }
};

const [searchQuery, setSearchQuery] = useState("");

// This logic replaces your standard 'sales.map' in the JSX
const filteredSales = sales.filter((sale) => {
  const query = searchQuery.toLowerCase();
  return (
    sale.id.toLowerCase().includes(query) || 
    sale.cashier.toLowerCase().includes(query) ||
    sale.branch.toLowerCase().includes(query)
  );
});


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

      {/* 3. SEARCH & FILTER BAR - FUNCTIONAL */}
<div className="flex flex-col md:flex-row gap-4">
  <div className="relative flex-1 group">
    <Search 
      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" 
      size={20} 
    />
    <input 
      type="text" 
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      placeholder="Search by Transaction ID, Cashier, or Branch..." 
      className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-50 transition-all font-medium text-gray-600 shadow-sm"
    />
    
    {/* Bonus: Clear Search Button */}
    {searchQuery && (
      <button 
        onClick={() => setSearchQuery("")}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400 hover:text-red-500 uppercase tracking-widest"
      >
        Clear
      </button>
    )}
  </div>

  <button 
    onClick={() => alert("Filter drawer coming soon! Here you'll filter by Date, Status, or Payment Method.")}
    className="px-6 py-4 bg-white border border-gray-100 rounded-2xl font-bold text-gray-600 flex items-center gap-2 hover:bg-gray-50 shadow-sm transition-all"
  >
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

  {/* Rows Logic */}
  {loading ? (
    // Loading State
    <div className="space-y-4">
      {[1, 2, 3].map((n) => (
        <div key={n} className="h-24 w-full bg-white animate-pulse rounded-[2rem] border border-gray-50" />
      ))}
    </div>
  ) : filteredSales.length > 0 ? (
    filteredSales.map((sale) => (
      <div 
        key={sale.id} 
        onClick={() => console.log("Opening details for:", sale.id)} // Placeholder for Details Drawer
        className="grid grid-cols-1 md:grid-cols-6 items-center px-8 py-6 bg-white border border-gray-50 rounded-[2rem] shadow-sm hover:shadow-md hover:border-blue-100 transition-all group cursor-pointer"
      >
        {/* ID & Date */}
        <div className="flex flex-col">
          <span className="text-xs font-black text-blue-600 font-mono tracking-tighter uppercase leading-none">
            #{sale.id}
          </span>
          <span className="text-[10px] text-gray-400 font-bold mt-1">
            {new Date(sale.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
          </span>
        </div>

        {/* Branch */}
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-blue-50 transition-colors">
            <Store size={14} className="text-gray-400 group-hover:text-blue-600" />
          </div>
          <span className="text-sm font-bold text-gray-700 truncate">{sale.branch}</span>
        </div>

        {/* Cashier */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-100 to-blue-50 flex items-center justify-center border border-white shadow-sm overflow-hidden">
            <User size={14} className="text-blue-600" />
          </div>
          <span className="text-sm font-bold text-gray-700">{sale.cashier}</span>
        </div>

        {/* Payment Method */}
        <div className="text-center">
          <span className="px-3 py-1 bg-gray-100 text-[9px] font-black rounded-lg text-gray-500 uppercase tracking-wider">
            {sale.payment}
          </span>
        </div>

        {/* Amount */}
        <div className="text-center">
          <span className="text-base font-black text-gray-900">
            KES {Number(sale.amount).toLocaleString()}
          </span>
        </div>

        {/* Status & Action */}
        <div className="flex items-center justify-end gap-4">
          <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black border tracking-tighter ${
            sale.status === "COMPLETED" 
              ? "bg-green-50 text-green-700 border-green-100" 
              : "bg-red-50 text-red-700 border-red-100"
          }`}>
            {sale.status}
          </span>
          <ChevronRight size={18} className="text-gray-300 group-hover:text-blue-600 transition-colors" />
        </div>
      </div>
    ))
  ) : (
    // Empty State
    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
       <div className="p-4 bg-gray-50 rounded-full mb-4">
          <ShoppingCart size={40} className="text-gray-300" />
       </div>
       <p className="text-gray-400 font-black uppercase text-xs tracking-[0.2em]">No transactions found</p>
       {searchQuery && (
         <button 
           onClick={() => setSearchQuery("")}
           className="mt-2 text-blue-600 font-bold text-xs hover:underline"
         >
           Clear search filters
         </button>
       )}
    </div>
  )}
</div>
    </div>
  );
}