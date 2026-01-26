import { useState } from "react";
import {
  ShoppingCart,
  CreditCard,
  Banknote,
  Store,
  Receipt,
} from "lucide-react";

export default function Sales() {
  const [sales] = useState([
    {
      id: "TXN-1001",
      date: "2026-01-26",
      branch: "Nairobi CBD",
      cashier: "John Mwangi",
      amount: 2450,
      payment: "MPESA",
      status: "COMPLETED",
    },
    {
      id: "TXN-1002",
      date: "2026-01-26",
      branch: "Westlands",
      cashier: "Alice Njeri",
      amount: 1320,
      payment: "CASH",
      status: "COMPLETED",
    },
    {
      id: "TXN-1003",
      date: "2026-01-26",
      branch: "Kasarani",
      cashier: "Peter Otieno",
      amount: 980,
      payment: "CARD",
      status: "REFUNDED",
    },
  ]);

  const statusBadge = (status) => {
    if (status === "COMPLETED") return "bg-green-100 text-green-700";
    if (status === "REFUNDED") return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <ShoppingCart className="w-6 h-6" />
          Sales
        </h1>
        <p className="text-sm text-gray-500">
          Track transactions across all branches
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow flex items-center gap-4">
          <Receipt className="w-10 h-10 text-blue-600" />
          <div>
            <p className="text-sm text-gray-500">Total Sales Today</p>
            <p className="text-xl font-bold">KES 4,750</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow flex items-center gap-4">
          <Banknote className="w-10 h-10 text-green-600" />
          <div>
            <p className="text-sm text-gray-500">Cash & MPESA</p>
            <p className="text-xl font-bold">KES 3,770</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow flex items-center gap-4">
          <CreditCard className="w-10 h-10 text-purple-600" />
          <div>
            <p className="text-sm text-gray-500">Card Payments</p>
            <p className="text-xl font-bold">KES 980</p>
          </div>
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="px-6 py-3 text-left">Transaction</th>
              <th className="px-6 py-3 text-left">Date</th>
              <th className="px-6 py-3 text-left">Branch</th>
              <th className="px-6 py-3 text-left">Cashier</th>
              <th className="px-6 py-3 text-left">Payment</th>
              <th className="px-6 py-3 text-left">Amount</th>
              <th className="px-6 py-3 text-left">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {sales.map((sale) => (
              <tr key={sale.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-800">
                  {sale.id}
                </td>
                <td className="px-6 py-4">{sale.date}</td>
                <td className="px-6 py-4 flex items-center gap-1">
                  <Store className="w-4 h-4 text-gray-500" />
                  {sale.branch}
                </td>
                <td className="px-6 py-4">{sale.cashier}</td>
                <td className="px-6 py-4">{sale.payment}</td>
                <td className="px-6 py-4 font-semibold">
                  {sale.amount.toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadge(
                      sale.status
                    )}`}
                  >
                    {sale.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
