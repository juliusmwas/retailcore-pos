import React, { useState, useEffect } from "react"; // Added useEffect here
import axios from "axios"; // Ensure axios is also here!
import { Search, Plus, Package, AlertCircle, ArrowUpRight } from "lucide-react";
import { useAuth } from "../../auth/AuthContext";

const ManagerInventory = () => {
  const { user, token } = useAuth();
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [adjustValue, setAdjustValue] = useState(0);
  const [adjustReason, setAdjustReason] = useState("STOCKTAKE");

  // 1. Fetching Logic (Memoized so it doesn't change on every render)
  const fetchInventory = async () => {
    if (!user?.branchId || !token) return;

    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5000/api/inventory/branch?branchId=${user.branchId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setInventory(response.data);
    } catch (error) {
      console.error("Error fetching branch inventory:", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Load data on mount
  useEffect(() => {
    fetchInventory();
  }, [user?.branchId, token]);

  // 3. Merged Adjustment Function (Clean & Error-Free)
  const handleConfirmAdjustment = async () => {
    if (!selectedItem || !adjustValue || adjustValue == 0) return;

    try {
      const response = await axios.patch(
        "http://localhost:5000/api/inventory/adjust",
        {
          inventoryId: selectedItem.dbId,
          adjustmentAmount: parseInt(adjustValue),
          reason: adjustReason,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.status === 200) {
        // Clear UI first
        setSelectedItem(null);
        setAdjustValue(0);
        setAdjustReason("STOCKTAKE");

        // Sync fresh data from DB
        await fetchInventory();

        // Optional feedback
        console.log("Stock synchronized successfully");
      }
    } catch (error) {
      console.error("Adjustment Failed:", error);
      window.alert(
        error.response?.data?.error || "Connection error. Please try again.",
      );
    }
  };

  // 4. Calculations (Fixed to match All-Caps backend status)
  const totalSKUs = inventory.length;
  const lowStockCount = inventory.filter(
    (item) => item.status === "LOW STOCK",
  ).length;
  const outOfStockCount = inventory.filter(
    (item) => item.status === "OUT OF STOCK",
  ).length;

  // 5. Search Filtering
  const filteredInventory = inventory.filter((item) => {
    const search = searchTerm.toLowerCase();
    return (
      item.name.toLowerCase().includes(search) ||
      item.id.toLowerCase().includes(search) ||
      item.category.toLowerCase().includes(search)
    );
  });

  // --- RETURN STARTS HERE ---

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
            Branch Inventory
          </h1>
          <p className="text-sm text-gray-500 font-medium">
            Track and adjust stock levels for
            <span className="text-blue-600 ml-1">
              {user?.branchName || "Current Branch"}
            </span>
          </p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition shadow-lg shadow-blue-200">
          <Plus size={18} /> REQUEST RESTOCK
        </button>
      </div>

      {/* Inventory Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total SKUs */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Package size={24} />
          </div>
          <div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
              Total SKUs
            </p>
            <h3 className="text-xl font-bold text-gray-800">
              {loading ? "..." : `${totalSKUs} Items`}
            </h3>
          </div>
        </div>

        {/* Low Stock */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 border-l-4 border-l-amber-400">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
              Low Stock
            </p>
            <h3 className="text-xl font-bold text-gray-800">
              {loading ? "..." : `${lowStockCount} Items`}
            </h3>
          </div>
        </div>

        {/* Out of Stock */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 border-l-4 border-l-red-500">
          <div className="p-3 bg-red-50 text-red-600 rounded-xl">
            <Package size={24} />
          </div>
          <div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
              Out of Stock
            </p>
            <h3 className="text-xl font-bold text-gray-800">
              {loading ? "..." : `${outOfStockCount} Items`}
            </h3>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-50 flex items-center gap-4">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by Product Name or SKU..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 transition font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <table className="w-full text-left">
          <thead className="bg-gray-50/50">
            <tr>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Product
              </th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Category
              </th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Current Stock
              </th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Price
              </th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Status
              </th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              /* 1. Loading State - Shown while fetching from Backend */
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm font-medium text-gray-400 italic">
                      Syncing Chuka Branch inventory...
                    </span>
                  </div>
                </td>
              </tr>
            ) : filteredInventory.length === 0 ? (
              /* 2. Empty/No Results State */
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-12 text-center text-gray-400 font-medium italic"
                >
                  {searchTerm
                    ? `No items found matching "${searchTerm}"`
                    : "No products currently stocked in this branch."}
                </td>
              </tr>
            ) : (
              /* 3. Real Data Mapping */
              filteredInventory.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-blue-50/30 transition group"
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-800 text-sm">
                        {item.name}
                      </span>
                      <span className="text-[10px] font-bold text-blue-500 uppercase tracking-tighter">
                        {item.id}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-gray-500">
                    {item.category}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`font-black text-sm ${item.stock <= item.minStock ? "text-amber-600" : "text-gray-700"}`}
                    >
                      {item.stock} Units
                    </span>
                  </td>
                  <td className="px-6 py-4 font-black text-sm text-gray-800">
                    {item.price}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-black ${
                        item.status === "IN STOCK"
                          ? "bg-green-50 text-green-600"
                          : item.status === "LOW STOCK"
                            ? "bg-amber-50 text-amber-600"
                            : "bg-red-50 text-red-600"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => {
                        // We pass the entire 'item' object so the Modal knows
                        // the name, current stock, and the Database ID (dbId)
                        setSelectedItem(item);
                        setAdjustValue(0); // Reset the input field every time we open a new one
                      }}
                      className="text-blue-600 hover:bg-blue-600 hover:text-white px-3 py-1.5 rounded-lg font-bold text-[10px] flex items-center gap-1 transition-all border border-blue-100"
                    >
                      ADJUST <ArrowUpRight size={14} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 border border-gray-100">
            {/* Header */}
            <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gradient-to-r from-blue-50/50 to-white">
              <div>
                <h2 className="font-black text-gray-800 tracking-tight">
                  Stock Adjustment
                </h2>
                <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">
                  Inventory Reconciliation
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedItem(null);
                  setAdjustValue(0);
                }}
                className="p-2 bg-gray-50 text-gray-400 hover:text-red-500 rounded-full transition-colors"
              >
                <span className="text-xl">✕</span>
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Product Identity */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Package size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">
                    Selected Product
                  </p>
                  <p className="font-bold text-gray-800 text-sm">
                    {selectedItem.name}
                  </p>
                </div>
              </div>

              {/* Math Display */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-white border border-gray-100 rounded-2xl">
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">
                    Current Stock
                  </p>
                  <p className="text-xl font-black text-gray-700">
                    {selectedItem.stock}{" "}
                    <span className="text-xs font-medium text-gray-400 uppercase">
                      Units
                    </span>
                  </p>
                </div>
                <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-2xl">
                  <p className="text-[10px] font-bold text-blue-500 uppercase mb-1">
                    New Total
                  </p>
                  <p className="text-xl font-black text-blue-700">
                    {selectedItem.stock + (parseInt(adjustValue) || 0)}{" "}
                    <span className="text-xs font-medium text-blue-400 uppercase">
                      Units
                    </span>
                  </p>
                </div>
              </div>

              {/* Inputs Section */}
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block ml-1">
                    Adjustment Amount (+ / -)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. -5 or 10"
                    className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl font-black text-xl transition-all outline-none"
                    value={adjustValue}
                    onChange={(e) => setAdjustValue(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block ml-1">
                    Reason for Adjustment
                  </label>
                  <select
                    className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl font-bold text-sm transition-all outline-none appearance-none cursor-pointer text-gray-700"
                    value={adjustReason}
                    onChange={(e) => setAdjustReason(e.target.value)}
                  >
                    <option value="STOCKTAKE">Stocktake Correction</option>
                    <option value="DAMAGE">Damaged / Spoilage</option>
                    <option value="RESTOCK">Manual Restock</option>
                    <option value="EXPIRED">Expired Items</option>
                    <option value="RETURN">Customer Return</option>
                  </select>
                </div>
              </div>

              {/* Audit Preview Box */}
              <div
                className={`p-4 rounded-2xl border-l-4 transition-all ${
                  parseInt(adjustValue) < 0
                    ? "bg-red-50 border-l-red-500 text-red-700"
                    : parseInt(adjustValue) > 0
                      ? "bg-green-50 border-l-green-500 text-green-700"
                      : "bg-gray-50 border-l-gray-300 text-gray-500"
                }`}
              >
                <p className="text-[11px] leading-relaxed font-bold italic">
                  {parseInt(adjustValue) < 0
                    ? `Note: You are removing ${Math.abs(adjustValue)} units from Chuka Branch due to ${adjustReason.toLowerCase()}.`
                    : parseInt(adjustValue) > 0
                      ? `Note: You are adding ${adjustValue} units to stock for ${adjustReason.toLowerCase()}.`
                      : "No adjustments entered yet."}
                </p>
              </div>

              <button
                onClick={handleConfirmAdjustment}
                disabled={!adjustValue || adjustValue == 0}
                className="w-full py-4 bg-blue-600 disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-2xl font-black tracking-wide hover:bg-blue-700 active:scale-[0.98] transition-all shadow-xl shadow-blue-100 uppercase text-xs"
              >
                Authorize Adjustment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerInventory;
