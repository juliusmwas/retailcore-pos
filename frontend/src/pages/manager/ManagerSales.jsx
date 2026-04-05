import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../auth/AuthContext"; // Your auth hook
import { Search, Filter, Eye, Download, FileText } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const ManagerSales = () => {
  const { user, token } = useAuth();
  const [sales, setSales] = useState([]); // Real data starts empty
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMethod, setFilterMethod] = useState("ALL");

  useEffect(() => {
    const fetchSales = async () => {
      if (!user?.branchId) return;

      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5000/api/sales/list?branchId=${user.branchId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setSales(response.data);
      } catch (error) {
        console.error("Error fetching sales history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, [user?.branchId, token]);

  const handlePrintDailyLog = () => {
    if (sales.length === 0) {
      window.alert(
        "Print Failed: The daily sales log is empty. Please process a sale before attempting to print.",
      );
      return;
    }

    const doc = new jsPDF();
    const date = new Date().toLocaleDateString();

    // Header
    doc.setFontSize(18);
    doc.text(`${user?.businessName || "RETAILCORE"} - DAILY SALES LOG`, 14, 20);
    doc.setFontSize(10);
    doc.text(`Branch: ${user?.branchName || "Chuka"} | Date: ${date}`, 14, 28);

    // Table
    autoTable(doc, {
      startY: 35,
      head: [["ID", "Time", "Customer", "Method", "Amount", "Status"]],
      body: sales.map((s) => [
        s.id,
        s.time,
        s.customer,
        s.method,
        s.total,
        s.status,
      ]),
      theme: "grid",
      headStyles: { fillColor: [37, 99, 235] }, // Blue-600
    });

    doc.save(`Daily_Sales_Log_${date}.pdf`);
  };

  const handleExportCSV = () => {
    if (sales.length === 0) {
      window.alert(
        "Export Failed: There are no sales records currently available for the Chuka Branch.",
      );
      return;
    }

    // 1. Define Headers
    const headers = [
      "Receipt ID",
      "Time",
      "Customer",
      "Payment Method",
      "Amount",
      "Status",
    ];

    // 2. Map sales data to rows
    const rows = sales.map((sale) => [
      sale.id,
      sale.time,
      sale.customer,
      sale.method,
      // Clean the "KES" prefix for the spreadsheet
      sale.total.replace("KES ", "").replace(",", ""),
      sale.status,
    ]);

    // 3. Create CSV Content
    const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");

    // 4. Create Download Link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `Sales_Report_${new Date().toLocaleDateString()}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredSales = sales.filter((sale) => {
    const matchesSearch =
      sale.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.customer.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterMethod === "ALL" || sale.method === filterMethod;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
            Sales & Orders
          </h1>
          <p className="text-sm text-gray-500 font-medium">
            Manage and audit all branch transactions
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl font-bold text-xs hover:bg-gray-50 transition shadow-sm"
          >
            <Download size={16} /> EXPORT CSV
          </button>

          <button
            onClick={handlePrintDailyLog}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl font-bold text-xs hover:bg-blue-700 transition shadow-md"
          >
            <FileText size={16} /> PRINT DAILY LOG
          </button>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[300px]">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by Receipt ID or Customer..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 transition font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl hover:bg-gray-100 transition">
          <Filter size={16} className="text-gray-500" />
          <select
            className="bg-transparent border-none text-sm font-bold text-gray-600 uppercase tracking-tighter focus:ring-0 cursor-pointer outline-none"
            value={filterMethod}
            onChange={(e) => setFilterMethod(e.target.value)}
          >
            <option value="ALL">ALL METHODS</option>
            <option value="CASH">CASH</option>
            <option value="MPESA">MPESA</option>
            <option value="CARD">CARD</option>
          </select>
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Receipt ID
              </th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Time
              </th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Customer
              </th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Payment
              </th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Amount
              </th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Status
              </th>
              <th className="px-6 py-4 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              // Loading state placeholder
              <tr>
                <td
                  colSpan="7"
                  className="px-6 py-10 text-center text-gray-400 font-medium"
                >
                  Fetching transaction history...
                </td>
              </tr>
            ) : filteredSales.length === 0 ? ( // Use filteredSales here
              <tr>
                <td
                  colSpan="7"
                  className="px-6 py-10 text-center text-gray-400 font-medium"
                >
                  {searchTerm || filterMethod !== "ALL"
                    ? `No results matching "${searchTerm}"`
                    : "No sales recorded for this branch yet."}
                </td>
              </tr>
            ) : (
              // Real Data
              filteredSales.map((sale) => (
                <tr
                  key={sale.id}
                  className="hover:bg-blue-50/30 transition group"
                >
                  <td className="px-6 py-4">
                    <span className="font-bold text-blue-700 text-sm">
                      {sale.id}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-gray-500">
                    {sale.time}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-700">
                    {sale.customer}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-[10px] font-black uppercase">
                      {sale.method}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-black text-sm text-gray-800">
                    {sale.total}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-black ${
                        sale.status === "COMPLETED"
                          ? "bg-green-50 text-green-600"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      {sale.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagerSales;
