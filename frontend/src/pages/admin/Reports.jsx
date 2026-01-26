import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Calendar, BarChart2, PieChart as PieIcon } from "lucide-react";

export default function Reports() {
  const [branch] = useState("All Branches");

  // Mock data for charts
  const salesTrend = [
    { day: "Mon", sales: 1200 },
    { day: "Tue", sales: 2100 },
    { day: "Wed", sales: 1800 },
    { day: "Thu", sales: 2500 },
    { day: "Fri", sales: 3000 },
    { day: "Sat", sales: 2200 },
    { day: "Sun", sales: 2700 },
  ];

  const topProducts = [
    { name: "Product A", value: 400 },
    { name: "Product B", value: 300 },
    { name: "Product C", value: 300 },
    { name: "Product D", value: 200 },
  ];

  const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <BarChart2 className="w-6 h-6 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-800">Reports</h1>
      </div>
      <p className="text-sm text-gray-500">
        Performance insights for {branch}
      </p>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow flex items-center gap-4">
          <Calendar className="w-10 h-10 text-blue-600" />
          <div>
            <p className="text-sm text-gray-500">Total Sales This Week</p>
            <p className="text-xl font-bold">KES 15,000</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow flex items-center gap-4">
          <PieIcon className="w-10 h-10 text-green-600" />
          <div>
            <p className="text-sm text-gray-500">Top Product Sold</p>
            <p className="text-xl font-bold">Product A</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow flex items-center gap-4">
          <BarChart className="w-10 h-10 text-purple-600" />
          <div>
            <p className="text-sm text-gray-500">Branches Active</p>
            <p className="text-xl font-bold">3</p>
          </div>
        </div>
      </div>

      {/* Sales Trend Chart */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="font-semibold text-gray-700 mb-4">Weekly Sales Trend</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={salesTrend}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="sales" fill="#4f46e5" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top Products Pie Chart */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="font-semibold text-gray-700 mb-4">Top Products</h2>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={topProducts}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {topProducts.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend verticalAlign="bottom" />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
