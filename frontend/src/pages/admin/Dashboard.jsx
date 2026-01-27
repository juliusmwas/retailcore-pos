// src/pages/admin/Dashboard.jsx
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

export default function Dashboard() {
  // Mock admin data (UI preview only)
  const data = {
   kpis: [
      { title: "Total Revenue", value: "$45,230", trend: "+12%", type: "profit" },
      { title: "Orders Today", value: "120", trend: "+5%", type: "profit" },
      { title: "Active Staff", value: "15", trend: "Stable", type: "neutral" },
      { title: "Products", value: "88", trend: "-2%", type: "loss" },
    ],

    salesOverTime: [
      { day: "Mon", sales: 1200 },
      { day: "Tue", sales: 2100 },
      { day: "Wed", sales: 800 },
      { day: "Thu", sales: 1600 },
      { day: "Fri", sales: 2500 },
      { day: "Sat", sales: 1900 },
      { day: "Sun", sales: 3000 },
    ],
    topProducts: [
      { name: "Product A", sold: 120 },
      { name: "Product B", sold: 95 },
      { name: "Product C", sold: 80 },
    ],
    orders: [
      { id: "#101", customer: "John Doe", amount: 2500, status: "Completed" },
      { id: "#102", customer: "Jane Smith", amount: 1800, status: "Pending" },
      { id: "#103", customer: "Mike Johnson", amount: 3200, status: "Completed" },
      { id: "#104", customer: "Alice Brown", amount: 1500, status: "Cancelled" },
    ],
    alerts: [
      "3 products are low on stock",
      "2 orders pending approval",
      "Sales dropped in Branch B yesterday",
    ],
  };

  return (
    <div className="p-8 space-y-10 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm">
            Business overview & system control
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
            Export Report
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Add Product
          </button>
        </div>
      </div>

    
      {/* KPI INSIGHT CARDS */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
  {data.kpis.map((kpi) => (
    <div
      key={kpi.title}
      className="bg-white rounded-xl shadow p-5"
    >
      <p className="text-gray-500 text-sm">{kpi.title}</p>
      <p className="text-2xl font-bold mt-1">{kpi.value}</p>

      <p
        className={`text-sm mt-2 font-medium ${
          kpi.type === "profit"
            ? "text-green-600"
            : kpi.type === "loss"
            ? "text-red-600"
            : "text-gray-500"
        }`}
      >
        {kpi.trend}
      </p>
    </div>
  ))}
</div>


      {/* ANALYTICS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="font-semibold mb-4">Weekly Sales Trend</h2>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={data.salesOverTime}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#2563eb"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="font-semibold mb-4">Top Selling Products</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data.topProducts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sold" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* OPERATIONS CENTER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders Feed */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow p-5">
          <h2 className="font-semibold mb-4">Recent Orders</h2>
          <div className="space-y-3">
            {data.orders.map((order) => (
              <div
                key={order.id}
                className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50"
              >
                <div>
                  <p className="font-medium">{order.customer}</p>
                  <p className="text-sm text-gray-500">
                    {order.id} • ${order.amount}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 text-sm rounded-full ${
                    order.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : order.status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {order.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts & Admin Actions */}
        <div className="bg-white rounded-xl shadow p-5 space-y-6">
          <div>
            <h2 className="font-semibold mb-3">⚠ Attention Needed</h2>
            <ul className="space-y-2 text-sm text-gray-600">
              {data.alerts.map((alert, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-red-500">•</span>
                  {alert}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-semibold mb-3">Quick Admin Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <ActionBtn label="Add Staff" />
              <ActionBtn label="Manage Roles" />
              <ActionBtn label="View Reports" />
              <ActionBtn label="System Logs" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Small reusable button */
function ActionBtn({ label }) {
  return (
    <button className="bg-gray-100 hover:bg-gray-200 rounded px-3 py-2 text-sm">
      {label}
    </button>
  );
}
