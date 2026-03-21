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

  // 2. Data Arrays (Static for now, will be fetched later)
  const salesTrend = [
    { day: "Mon", sales: 1200, lastWeek: 900 },
    { day: "Tue", sales: 2100, lastWeek: 1800 },
    { day: "Wed", sales: 1800, lastWeek: 2200 },
    { day: "Thu", sales: 2500, lastWeek: 2100 },
    { day: "Fri", sales: 3000, lastWeek: 2800 },
    { day: "Sat", sales: 2200, lastWeek: 2400 },
    { day: "Sun", sales: 2700, lastWeek: 2100 },
  ];

  const topProducts = [
    { name: "Electronics", value: 400 },
    { name: "Groceries", value: 300 },
    { name: "Clothing", value: 300 },
    { name: "Home Decor", value: 200 },
  ];

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"];

  const [reportStats, setReportStats] = useState({
    revenue: 0,
    growth: 0,
    isPositive: true,
    topCategory: "Loading...",
    topBranch: "Loading..."
  });

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
  // This runs automatically whenever activeTab changes
  useEffect(() => {
    const fetchRealReportData = async () => {
      setLoading(true);
      try {
        // When your backend is live, uncomment the lines below:
         const response = await fetch(`/api/reports/stats?range=${activeTab.toLowerCase()}`);
         const data = await response.json();
         setReportStats({
           revenue: data.totalRevenue,
           growth: data.percentageGrowth,
           isPositive: data.percentageGrowth >= 0,
           topCategory: data.bestCategory,
           topBranch: data.bestBranch
         });

        // MOCK LOGIC for testing UI immediately:
        setTimeout(() => {
          setReportStats({
            revenue: activeTab === "Month" ? 650000 : 154000,
            growth: 12.5,
            isPositive: true,
            topCategory: "Electronics",
            topBranch: "Nairobi CBD"
          });
          setLoading(false);
        }, 500);

      } catch (error) {
        console.error("Database fetch failed:", error);
        setLoading(false);
      }
    };

    fetchRealReportData();
  }, [activeTab]);

  return (
    <div className="p-8 bg-[#f8fafc] min-h-screen space-y-8">
      
      {/* 1. HEADER & GLOBAL FILTERS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-indigo-600 rounded-xl text-white">
              <BarChart2 size={24} />
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Analytics Hub</h1>
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
    title="Download Report"
    className="p-3 bg-white border border-gray-200 rounded-2xl text-gray-600 hover:shadow-md hover:border-indigo-100 hover:text-indigo-600 transition-all active:scale-95"
  >
    <Download size={20} />
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

      {/* 3. CHART GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sales Trend (Area Chart) */}
        <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-black text-gray-900 uppercase text-xs tracking-widest">Revenue Velocity</h3>
            <div className="flex items-center gap-4 text-[10px] font-bold">
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-indigo-600"></span> Current</div>
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-indigo-200"></span> Previous</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={salesTrend}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Area type="monotone" dataKey="sales" stroke="#4f46e5" strokeWidth={4} fillOpacity={1} fill="url(#colorSales)" />
              <Area type="monotone" dataKey="lastWeek" stroke="#e2e8f0" strokeWidth={2} fill="transparent" strokeDasharray="5 5" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution (Donut Chart) */}
        <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
          <h3 className="font-black text-gray-900 uppercase text-xs tracking-widest mb-8">Category Share</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={topProducts}
                innerRadius={80}
                outerRadius={110}
                paddingAngle={8}
                dataKey="value"
              >
                {topProducts.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={10} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="middle" align="right" layout="vertical" iconType="circle" wrapperStyle={{ paddingLeft: '20px', fontWeight: 'bold', fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}