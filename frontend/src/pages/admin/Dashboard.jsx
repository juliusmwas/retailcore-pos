// src/pages/admin/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

export default function Dashboard() {
  const { activeBranch } = useAuth();
  const [data, setData] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalStaff: 0,
    totalProducts: 0,
    salesOverTime: [],
    topProducts: [],
    recentOrders: []
  });

  // Fetch dashboard data whenever branch changes
  useEffect(() => {
    if (!activeBranch) return;

    // Simulate API fetch - replace with your backend call
    const fetchDashboard = async () => {
      // Example data
      const apiData = {
        totalSales: 45230,
        totalOrders: 120,
        totalStaff: 15,
        totalProducts: 88,
        salesOverTime: [
          { date: "2026-01-01", sales: 1200 },
          { date: "2026-01-02", sales: 2100 },
          { date: "2026-01-03", sales: 800 },
          { date: "2026-01-04", sales: 1600 },
          { date: "2026-01-05", sales: 2500 },
          { date: "2026-01-06", sales: 1900 },
          { date: "2026-01-07", sales: 3000 }
        ],
        topProducts: [
          { name: "Product A", sold: 120 },
          { name: "Product B", sold: 95 },
          { name: "Product C", sold: 80 }
        ],
        recentOrders: [
          { id: 101, customer: "John Doe", total: 2500, status: "Completed" },
          { id: 102, customer: "Jane Smith", total: 1800, status: "Pending" },
          { id: 103, customer: "Mike Johnson", total: 3200, status: "Completed" },
          { id: 104, customer: "Alice Brown", total: 1500, status: "Cancelled" }
        ]
      };
      setData(apiData);
    };

    fetchDashboard();
  }, [activeBranch]);

  if (!activeBranch) return <p className="p-8 text-red-500">Please select a branch.</p>;

  return (
    <div className="p-8 space-y-8">
      {/* Welcome */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          {`Dashboard - ${activeBranch.name}`}
        </h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Add Product
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white shadow p-4 rounded">
          <p className="text-gray-500">Total Sales</p>
          <p className="text-2xl font-bold">${data.totalSales}</p>
        </div>
        <div className="bg-white shadow p-4 rounded">
          <p className="text-gray-500">Total Orders</p>
          <p className="text-2xl font-bold">{data.totalOrders}</p>
        </div>
        <div className="bg-white shadow p-4 rounded">
          <p className="text-gray-500">Total Staff</p>
          <p className="text-2xl font-bold">{data.totalStaff}</p>
        </div>
        <div className="bg-white shadow p-4 rounded">
          <p className="text-gray-500">Total Products</p>
          <p className="text-2xl font-bold">{data.totalProducts}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow p-4 rounded">
          <h2 className="text-xl font-bold mb-2">Sales Over Time</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data.salesOverTime}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white shadow p-4 rounded">
          <h2 className="text-xl font-bold mb-2">Top Products</h2>
          <ResponsiveContainer width="100%" height={250}>
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

      {/* Recent Orders Table */}
      <div className="bg-white shadow rounded p-4">
        <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 text-left">Order ID</th>
              <th className="py-2 px-4 text-left">Customer</th>
              <th className="py-2 px-4 text-left">Total</th>
              <th className="py-2 px-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.recentOrders.map((order) => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{order.id}</td>
                <td className="py-2 px-4">{order.customer}</td>
                <td className="py-2 px-4">${order.total}</td>
                <td className={`py-2 px-4 font-semibold ${
                  order.status === "Completed"
                    ? "text-green-600"
                    : order.status === "Pending"
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}>
                  {order.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
