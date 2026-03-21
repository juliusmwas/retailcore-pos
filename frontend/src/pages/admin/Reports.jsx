import { useState, useEffect } from "react";
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, CartesianGrid 
} from "recharts";
import { 
  Calendar, BarChart2, PieChart as PieIcon, Download, 
  TrendingUp, TrendingDown, Layers, MapPin, Filter 
} from "lucide-react";

export default function Reports() {
  // 1. Unified State
  const [activeTab, setActiveTab] = useState("Week");
  const [loading, setLoading] = useState(false);

  // 2. REACTIVE DATA STATES (Replacing the static arrays)
  const [salesTrend, setSalesTrend] = useState([]); 
  const [topProducts, setTopProducts] = useState([]);
  
  const [reportStats, setReportStats] = useState({
    revenue: 0,
    growth: 0,
    isPositive: true,
    topCategory: "None",
    topBranch: "None"
  });

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"];

  // 3. Handlers
  const handleExportData = () => {
    if (!salesTrend || salesTrend.length === 0) return;

    const headers = ["Period", "Current Sales", "Previous Period Sales"];
    const csvRows = salesTrend.map(item => `${item.day},${item.sales},${item.lastWeek}`);
    
    const csvContent = [headers.join(","), ...csvRows].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `RetailCore_Report_${activeTab}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // 4. THE MAIN FETCH FUNCTION
  useEffect(() => {
    const fetchRealReportData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/reports/stats?range=${activeTab.toLowerCase()}`);
        
        // If the DB is empty or route doesn't exist yet, this will catch
        if (!response.ok) throw new Error("No data found");

        const data = await response.json();

        // Update Stats
        setReportStats({
          revenue: data.totalRevenue || 0,
          growth: data.percentageGrowth || 0,
          isPositive: (data.percentageGrowth || 0) >= 0,
          topCategory: data.bestCategory || "No Sales",
          topBranch: data.bestBranch || "N/A"
        });

        // Update Charts
        setSalesTrend(data.trendData || []);
        setTopProducts(data.categoryData || []);

      } catch (error) {
        console.error("Database fetch failed:", error);
        // Ensure UI stays at 0/Empty if fetch fails
        setReportStats({ revenue: 0, growth: 0, isPositive: true, topCategory: "None", topBranch: "None" });
        setSalesTrend([]);
        setTopProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRealReportData();
  }, [activeTab]);

  // Now the return function can follow...

  return (
    <div className="p-8 bg-[#f8fafc] min-h-screen space-y-8">
      
      {/* 1. HEADER & GLOBAL FILTERS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-indigo-600 rounded-xl text-white">
              <BarChart2 size={24} />
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Reports Hub</h1>
          </div>
          <p className="text-sm text-gray-500 font-medium">Detailed performance breakdown across the enterprise</p>
        </div>
        
        <div className="flex gap-3">
  {/* Filter Tabs */}
  <div className="flex bg-white border border-gray-200 p-1 rounded-2xl shadow-sm">
    {["Day", "Week", "Month"].map((tab) => (
      <button 
        key={tab}
        onClick={() => setActiveTab(tab)}
        className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
          activeTab === tab 
            ? "bg-indigo-600 text-white shadow-md" 
            : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
        }`}
      >
        {tab}
      </button>
    ))}
  </div>

  {/* Export Button */}
  <button 
  onClick={handleExportData}
  disabled={salesTrend.length === 0 || loading}
  className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all
    ${salesTrend.length === 0 
      ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
      : "bg-gray-900 text-white hover:bg-gray-800 active:scale-95 shadow-lg shadow-gray-200"
    }`}
>
  <Download size={16} />
  {salesTrend.length === 0 ? "No Data to Export" : "Export Report"}
</button>
</div>
      </div>

      {/* 2. INTELLIGENCE CARDS - FUNCTIONAL */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {/* Revenue Card */}
  <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-4">
    <div className="flex justify-between items-start">
      <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><Calendar size={20} /></div>
      <span className={`flex items-center gap-1 text-xs font-black px-2 py-1 rounded-lg ${
        reportStats.isPositive ? "text-green-500 bg-green-50" : "text-red-500 bg-red-50"
      }`}>
        {reportStats.isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
        {reportStats.isPositive ? "+" : ""}{reportStats.growth}%
      </span>
    </div>
    <div>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
        {activeTab}ly Revenue
      </p>
      <p className="text-3xl font-black text-gray-900">
  {/* Only use KES and toLocaleString if revenue is actually a number */}
  {typeof reportStats.revenue === 'number' 
    ? `KES ${reportStats.revenue.toLocaleString()}` 
    : reportStats.revenue}
</p>
    </div>
  </div>

  {/* Category Card */}
  <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-4">
    <div className="flex justify-between items-start">
      <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl"><Layers size={20} /></div>
      <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest italic">Best Seller</span>
    </div>
    <div>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Top Category</p>
      <p className="text-3xl font-black text-gray-900">{reportStats.topCategory}</p>
    </div>
  </div>

  {/* Branch Card */}
  <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-4">
    <div className="flex justify-between items-start">
      <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><MapPin size={20} /></div>
      <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest">Active</span>
    </div>
    <div>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Top Branch</p>
      <p className="text-3xl font-black text-gray-900">{reportStats.topBranch}</p>
    </div>
  </div>
</div>

      {/* 3. CHART GRID - FULLY FUNCTIONAL */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
  
  {/* Sales Trend (Area Chart) */}
  <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm relative overflow-hidden">
    {/* Loading Overlay */}
    {loading && (
      <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Syncing Trends...</p>
        </div>
      </div>
    )}

    <div className="flex justify-between items-center mb-8">
      <h3 className="font-black text-gray-900 uppercase text-xs tracking-widest">Revenue Velocity</h3>
      <div className="flex items-center gap-4 text-[10px] font-bold">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-600"></span> 
          Current {activeTab}
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-gray-200"></span> 
          Previous {activeTab}
        </div>
      </div>
    </div>

    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={salesTrend}>
          <defs>
            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="day" 
            axisLine={false} 
            tickLine={false} 
            tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} 
            dy={10} 
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} 
          />
          <Tooltip 
            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
          />
          <Area 
            type="monotone" 
            dataKey="sales" 
            stroke="#4f46e5" 
            strokeWidth={4} 
            fillOpacity={1} 
            fill="url(#colorSales)" 
            animationDuration={1500}
          />
          <Area 
            type="monotone" 
            dataKey="lastWeek" 
            stroke="#e2e8f0" 
            strokeWidth={2} 
            fill="transparent" 
            strokeDasharray="5 5" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>

  {/* Category Distribution (Donut Chart) */}
  <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm relative overflow-hidden">
    {/* Loading Overlay */}
    {loading && (
      <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )}

    <h3 className="font-black text-gray-900 uppercase text-xs tracking-widest mb-8">Category Share</h3>
    
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={topProducts}
            innerRadius={80}
            outerRadius={110}
            paddingAngle={8}
            dataKey="value"
            animationBegin={200}
            animationDuration={1200}
          >
            {topProducts.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]} 
                cornerRadius={10} 
                stroke="none"
              />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Legend 
            verticalAlign="middle" 
            align="right" 
            layout="vertical" 
            iconType="circle" 
            wrapperStyle={{ paddingLeft: '20px', fontWeight: '900', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }} 
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </div>
</div>
    </div>
  );
}