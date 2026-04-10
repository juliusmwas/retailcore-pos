import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useAuth } from "../../auth/AuthContext";
import {
  ShoppingCart,
  CreditCard,
  Banknote,
  Store,
  Receipt,
  Search,
  Filter,
  Download,
  ChevronRight,
  User,
  RefreshCcw,
} from "lucide-react";

export default function Sales() {
  const { activeBranch, user } = useAuth();

  // State Management
  const [sales, setSales] = useState([]);
  const [salesStats, setSalesStats] = useState({
    total: 0,
    mobileAndCash: 0,
    cards: 0,
  });
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);

  // 1. Centralized Data Fetching
  const fetchSalesData = async () => {
    // Determine the correct businessId
    const businessId = user?.businessId || user?.id;
    if (!businessId) return;

    setLoading(true);
    setError(null);

    try {
      // Get and parse auth data for the token
      const authData = JSON.parse(localStorage.getItem("auth") || "{}");
      const token = authData.token;

      if (!token) throw new Error("Authentication token missing");

      const branchId = activeBranch?.id;
      const branchParam =
        branchId && branchId !== "ALL" ? `&branchId=${branchId}` : "";

      const BASE_URL = "http://localhost:5000/api/sale";
      const config = { headers: { Authorization: `Bearer ${token}` } };

      // Execute both requests in parallel
      const [statsRes, listRes] = await Promise.all([
        axios.get(
          `${BASE_URL}/stats?businessId=${businessId}${branchParam}`,
          config,
        ),
        axios.get(
          `${BASE_URL}/list?businessId=${businessId}${branchParam}`,
          config,
        ),
      ]);

      setSalesStats({
        total: Number(statsRes.data?.total || 0),
        mobileAndCash: Number(statsRes.data?.mobileAndCash || 0),
        cards: Number(statsRes.data?.cards || 0),
      });

      setSales(Array.isArray(listRes.data) ? listRes.data : []);
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      console.error("Sales Fetch Error:", msg);
      setError(msg);
      setSales([]);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch when branch or user context changes
  useEffect(() => {
    fetchSalesData();
  }, [activeBranch?.id, user?.businessId]);

  // 2. Search Logic (Memoized for Performance)
  const filteredSales = useMemo(() => {
    if (!searchQuery) return sales;
    const q = searchQuery.toLowerCase();
    return sales.filter(
      (s) =>
        s.id?.toLowerCase().includes(q) ||
        s.cashier?.toLowerCase().includes(q) ||
        s.branchName?.toLowerCase().includes(q) ||
        s.method?.toLowerCase().includes(q),
    );
  }, [sales, searchQuery]);

  // 3. Export to CSV Logic
  const exportToCSV = () => {
    if (filteredSales.length === 0) return;
    const headers = [
      "ID",
      "Time",
      "Branch",
      "Cashier",
      "Method",
      "Amount",
      "Status",
    ];
    const rows = filteredSales.map((s) => [
      s.id,
      s.time,
      s.branchName,
      s.cashier,
      s.method,
      s.total,
      s.status,
    ]);

    const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `sales_report_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  return (
    <div className="p-8 bg-[#f8fafc] min-h-screen space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2.5 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-200">
              <ShoppingCart size={22} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Sales Ledger</h1>
          </div>
          <p className="text-sm text-gray-500">
            Monitoring {activeBranch?.name || "All Branches"}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={fetchSalesData}
            className="p-3 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-all shadow-sm"
            title="Refresh Data"
          >
            <RefreshCcw size={20} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          label={
            activeBranch?.name
              ? `${activeBranch.name} Volume`
              : "Total Business Volume"
          }
          value={salesStats.total}
          icon={<Receipt size={24} />}
          color="blue"
          loading={loading}
        />
        <StatCard
          label="Mobile & Cash"
          value={salesStats.mobileAndCash}
          icon={<Banknote size={24} />}
          color="green"
          loading={loading}
          subtext="Cash + M-PESA"
        />
        <StatCard
          label="Digital Cards"
          value={salesStats.cards}
          icon={<CreditCard size={24} />}
          color="purple"
          loading={loading}
          subtext="Visa / Mastercard"
        />
      </div>

      {/* SEARCH BAR */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search transactions..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-50 outline-none transition-all shadow-sm font-medium"
          />
        </div>
        <button className="px-6 py-4 bg-white border border-gray-100 rounded-2xl font-bold text-gray-600 flex items-center gap-2 hover:bg-gray-50 transition-all shadow-sm">
          <Filter size={20} /> Filters
        </button>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="hidden md:grid grid-cols-6 px-8 py-5 bg-gray-50/50 border-b border-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          <div>Transaction</div>
          <div>Location</div>
          <div>Cashier</div>
          <div className="text-center">Payment</div>
          <div className="text-center">Amount</div>
          <div className="text-right">Status</div>
        </div>

        <div className="divide-y divide-gray-50">
          {loading ? (
            <TableSkeleton />
          ) : filteredSales.length > 0 ? (
            filteredSales.map((sale) => <SalesRow key={sale.id} sale={sale} />)
          ) : (
            <EmptyState
              query={searchQuery}
              onClear={() => setSearchQuery("")}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// Helper Component for Stats
function StatCard({ label, value, icon, color, loading, subtext }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <div className="bg-white p-7 rounded-[2.2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between">
      <div className="space-y-1">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          {label}
        </p>
        <p
          className={`text-2xl font-bold ${color === "blue" ? "text-gray-900" : colors[color].split(" ")[1]}`}
        >
          {loading ? "..." : `KES ${Number(value).toLocaleString()}`}
        </p>
        {subtext && (
          <p className="text-[9px] text-gray-400 font-bold uppercase">
            {subtext}
          </p>
        )}
      </div>
      <div className={`p-4 rounded-2xl ${colors[color]}`}>{icon}</div>
    </div>
  );
}

// Helper Component for Table Rows
function SalesRow({ sale }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-6 items-center px-8 py-6 hover:bg-blue-50/30 transition-all group cursor-pointer">
      <div className="flex flex-col">
        <span className="text-xs font-bold text-blue-600 font-mono">
          #{sale.id}
        </span>
        <span className="text-[10px] text-gray-400 font-bold mt-1">
          {sale.time}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Store size={14} className="text-gray-400" />
        <span className="text-sm font-bold text-gray-700">
          {sale.branchName || "Main"}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
          <User size={12} />
        </div>
        <span className="text-sm font-bold text-gray-700">{sale.cashier}</span>
      </div>
      <div className="text-center">
        <span className="px-2.5 py-1 bg-gray-100 text-[9px] font-bold rounded-lg text-gray-500 uppercase tracking-wider">
          {sale.method}
        </span>
      </div>
      <div className="text-center font-bold text-gray-900">{sale.total}</div>
      <div className="flex items-center justify-end gap-3">
        <span
          className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
            sale.status === "COMPLETED"
              ? "bg-green-50 text-green-700 border-green-100"
              : "bg-red-50 text-red-700 border-red-100"
          }`}
        >
          {sale.status}
        </span>
        <ChevronRight
          size={16}
          className="text-gray-300 group-hover:text-blue-600"
        />
      </div>
    </div>
  );
}

// UI Skeletons & Empty States
const TableSkeleton = () => (
  <div className="p-8 space-y-4">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="h-16 bg-gray-50 animate-pulse rounded-2xl" />
    ))}
  </div>
);

const EmptyState = ({ query, onClear }) => (
  <div className="flex flex-col items-center justify-center py-24 text-center">
    <div className="p-5 bg-gray-50 rounded-full mb-4">
      <ShoppingCart size={40} className="text-gray-300" />
    </div>
    <h3 className="text-gray-900 font-bold">No transactions found</h3>
    <p className="text-gray-400 text-sm max-w-xs mx-auto mt-1">
      {query
        ? `We couldn't find anything matching "${query}"`
        : "New sales will appear here in real-time."}
    </p>
    {query && (
      <button
        onClick={onClear}
        className="mt-4 text-blue-600 font-bold text-sm hover:underline"
      >
        Clear all filters
      </button>
    )}
  </div>
);
