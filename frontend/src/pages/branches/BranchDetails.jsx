import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBranchById, updateBranch } from "../../services/branchService";
import {
  ArrowLeft,
  Building2,
  Users,
  Package,
  TrendingUp,
  MapPin,
  Phone,
  Mail,
  Settings,
  CheckCircle,
  Clock,
} from "lucide-react";

export default function BranchDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [branch, setBranch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editData, setEditData] = useState({});
  const [updating, setUpdating] = useState(false);
  const [inventory, setInventory] = useState([]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      // 1. Call the service we just updated in branchService.js
      const res = await updateBranch(id, editData);

      // 2. Check the response status
      if (res.data.status === "success") {
        // 3. Merge the updated fields into the existing branch state
        // We spread 'branch' first to keep counts/users, then spread the response data
        const updatedData = res.data?.data || res.data;

        setBranch((prev) => ({
          ...prev,
          ...updatedData,
        }));

        setIsEditModalOpen(false);
        // Optional: replace alert with a toast notification later
        alert("Branch updated successfully!");
      }
    } catch (err) {
      console.error("Update failed:", err);
      const errorMsg =
        err.response?.data?.message || "Failed to update branch.";
      alert(errorMsg);
    } finally {
      setUpdating(false);
    }
  };

  // Function to open modal and pre-fill data
  const openEditModal = () => {
    setEditData({
      name: branch.name,
      location: branch.location,
      address: branch.address,
      city: branch.city,
      managerName: branch.managerName,
      managerEmail: branch.managerEmail,
      revenueTarget: branch.revenueTarget,
      budget: branch.budget,
      status: branch.status,
    });
    setIsEditModalOpen(true);
  };

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const res = await getBranchById(id);
        const branchData = res.data?.data || res.data;

        if (branchData && branchData.id) {
          // 1. Process inventory first
          const formattedInventory = (branchData.inventory || []).map((inv) => {
            let currentStatus = "IN STOCK";
            if (inv.stock <= 0) currentStatus = "OUT OF STOCK";
            else if (inv.stock <= inv.minStock) currentStatus = "LOW STOCK";

            return {
              dbId: inv.id,
              name: inv.product?.name || "Unknown Product",
              category: inv.product?.category?.name || "General",
              id: inv.product?.sku || "N/A",
              stock: inv.stock,
              minStock: inv.minStock,
              price: inv.product?.sellingPrice
                ? Number(inv.product.sellingPrice).toLocaleString()
                : "0.00",
              status: currentStatus,
            };
          });

          // 2. Set inventory state
          setInventory(formattedInventory);

          // 3. Set branch state with explicit fallbacks for the stats
          setBranch({
            ...branchData,
            todaySales: branchData.todaySales || 0,
            // Ensure _count exists so the UI doesn't break
            _count: branchData._count || {
              users: 0,
              inventory: formattedInventory.length,
            },
          });
        } else {
          setBranch(null);
          setInventory([]);
        }
      } catch (err) {
        console.error("Error loading branch details:", err);
        setBranch(null);
        setInventory([]);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDetails();
  }, [id]);

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );

  if (!branch) return <div className="p-10 text-center">Branch not found.</div>;

  return (
    <div className="p-6 lg:p-10 space-y-8 bg-gray-50 min-h-screen">
      {/* --- BREADCRUMBS & NAVIGATION --- */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-blue-600 font-bold transition-all group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        Back to All Branches
      </button>

      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="flex gap-5 items-center">
          <div className="p-4 bg-blue-600 text-white rounded-3xl shadow-lg shadow-blue-200">
            <Building2 size={32} />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
                {branch.name}
              </h1>
              <span
                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                  branch.status === "ACTIVE"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {branch.status}
              </span>
            </div>
            <p className="text-gray-500 font-medium flex items-center gap-2 mt-1">
              <MapPin size={16} /> {branch.address}, {branch.city} •{" "}
              <span className="font-mono text-blue-600">{branch.code}</span>
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={openEditModal}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl font-bold text-gray-700 hover:shadow-md transition-all"
          >
            <Settings size={18} /> Edit Branch
          </button>
        </div>
      </div>

      {/* --- QUICK STATS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Personnel"
          value={branch._count?.users || 0}
          icon={<Users className="text-blue-600" />}
          color="bg-blue-50"
        />

        <StatCard
          label="Inventory Items"
          // Use the local inventory array length as a fallback
          value={inventory.length || branch?._count?.inventory || 0}
          icon={<Package className="text-orange-600" />}
          color="bg-orange-50"
        />

        <StatCard
          label="Today's Sales"
          value={`KES ${Number(branch.todaySales || 0).toLocaleString()}`} // Matches the new backend key
          icon={<TrendingUp className="text-green-600" />}
          color="bg-green-50"
        />

        <StatCard
          label="Capacity"
          // Using a simple calculation: (Current Users / Max Staff) * 100
          value={`${Math.round(((branch._count?.users || 0) / (branch.maxStaff || 1)) * 100)}%`}
          icon={<CheckCircle className="text-purple-600" />}
          color="bg-purple-50"
        />
      </div>

      {/* --- TAB NAVIGATION --- */}
      <div className="flex gap-8 border-b border-gray-200 overflow-x-auto">
        {["overview", "staff list", "inventory", "reports"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 px-2 text-sm font-bold capitalize whitespace-nowrap transition-all ${
              activeTab === tab
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* --- DYNAMIC CONTENT --- */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Management Card */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Management Team
              </h3>
              <div className="space-y-6">
                <ContactInfo
                  label="Primary Manager"
                  name={branch.managerName}
                  email={branch.managerEmail}
                  phone={branch.managerPhone}
                />
                <div className="h-px bg-gray-50" />
                <ContactInfo
                  label="Assistant Manager"
                  name={branch.assistantManager || "Not Assigned"}
                />
              </div>
            </div>

            {/* Logistics Card */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Operations & Tax
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <DetailItem label="Currency" value={branch.currency} />
                <DetailItem label="Tax Region" value={branch.taxRegion} />
                <DetailItem
                  label="Opening Date"
                  value={new Date(branch.openingDate).toLocaleDateString()}
                />
                <DetailItem label="Branch Type" value={branch.type} />
              </div>
            </div>
          </div>
        )}

        {activeTab === "staff list" && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {branch.users?.length > 0 ? (
                  branch.users.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-blue-50/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900">
                            {item.user?.fullName || "Unknown Staff"}
                          </span>
                          <span className="text-xs text-gray-500 font-medium">
                            {item.user?.email || "No email provided"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] font-bold px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg border border-blue-100 uppercase tracking-tighter">
                          {item.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm font-bold">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              item.user?.status === "ACTIVE"
                                ? "bg-green-500"
                                : "bg-red-400"
                            }`}
                          />
                          <span
                            className={
                              item.user?.status === "ACTIVE"
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            {item.user?.status || "INACTIVE"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => navigate(`/users/${item.user?.id}`)}
                          className="text-blue-600 font-bold text-sm hover:text-blue-800 transition-colors"
                        >
                          View Profile
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-10 text-center text-gray-400 font-medium"
                    >
                      No staff members assigned to this branch yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "inventory" && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="p-6 border-b border-gray-50">
              <h3 className="text-lg font-bold text-gray-900 tracking-tight">
                Current Stock Levels
              </h3>
              <p className="text-xs text-gray-400 mt-1 font-medium italic">
                Showing products currently assigned to this branch.
              </p>
            </div>
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">
                    Product
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">
                    SKU / Barcode
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">
                    Stock Level
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">
                    Price (KES)
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-16 text-center">
                      <Loader2
                        className="animate-spin mx-auto text-orange-500"
                        size={32}
                      />
                      <p className="text-gray-500 mt-2 font-medium">
                        Loading stock data...
                      </p>
                    </td>
                  </tr>
                ) : inventory.length > 0 ? (
                  inventory.map((item) => (
                    <tr
                      key={item.dbId}
                      className="hover:bg-orange-50/30 transition-colors"
                    >
                      <td className="px-6 py-4 text-center">
                        <div className="font-bold text-gray-900">
                          {item.name}
                        </div>
                        <div className="text-[10px] text-gray-500 font-bold uppercase">
                          {item.category}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="text-sm font-mono text-blue-600 font-bold">
                          {item.id} {/* This is the SKU from your controller */}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex flex-col items-center">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-lg font-bold ${item.status === "LOW STOCK" ? "text-red-600" : "text-gray-900"}`}
                            >
                              {item.stock}
                            </span>
                            <span className="text-[10px] text-gray-400 font-bold uppercase">
                              / min {item.minStock}
                            </span>
                          </div>
                          {/* Dynamic visual stock bar */}
                          <div className="w-24 h-1.5 bg-gray-100 rounded-full mt-2 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${item.status === "LOW STOCK" ? "bg-red-500" : "bg-green-500"}`}
                              style={{
                                width: `${Math.min((item.stock / (item.minStock * 3)) * 100, 100)}%`,
                              }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="text-sm font-bold text-gray-900">
                          {item.price}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span
                          className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-tighter border ${
                            item.status === "LOW STOCK"
                              ? "bg-red-100 text-red-700 border-red-200"
                              : item.status === "OUT OF STOCK"
                                ? "bg-gray-100 text-gray-700 border-gray-200"
                                : "bg-green-100 text-green-700 border-green-200"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center gap-2 opacity-40">
                        <Package size={48} className="text-gray-400" />
                        <p className="text-gray-500 font-bold">
                          No inventory found for this branch.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "reports" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Financial Targets Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-green-50 text-green-600 rounded-2xl">
                    <TrendingUp size={24} />
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Monthly Target
                  </span>
                </div>
                <h4 className="text-sm font-bold text-gray-500">
                  Revenue Goal
                </h4>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {branch.currency}{" "}
                  {branch.revenueTarget?.toLocaleString() || "0.00"}
                </p>
                <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 w-[10%]" />{" "}
                  {/* Static placeholder for now */}
                </div>
                <p className="text-[10px] text-gray-400 mt-2 font-bold">
                  10% of monthly goal reached
                </p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                    <Building2 size={24} />
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Operating Budget
                  </span>
                </div>
                <h4 className="text-sm font-bold text-gray-500">
                  Current Budget
                </h4>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {branch.currency} {branch.budget?.toLocaleString() || "0.00"}
                </p>
                <p className="text-[10px] text-blue-600 mt-4 font-bold uppercase tracking-tight">
                  Allocated for Q1 2026
                </p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
                    <Users size={24} />
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Staffing Level
                  </span>
                </div>
                <h4 className="text-sm font-bold text-gray-500">
                  Personnel Gap
                </h4>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {branch._count?.users || 0} / {branch.maxStaff || 0}
                </p>
                <div className="mt-4 flex gap-1">
                  {[...Array(10)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full ${i < (branch._count?.users / branch.maxStaff) * 10 ? "bg-purple-500" : "bg-gray-100"}`}
                    />
                  ))}
                </div>
                <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase">
                  Staff Capacity
                </p>
              </div>
            </div>

            {/* Detailed Metrics Table */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Branch Health Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-gray-50">
                    <span className="text-sm font-bold text-gray-500">
                      Branch Age
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                      {Math.floor(
                        (new Date() - new Date(branch.openingDate)) /
                          (1000 * 60 * 60 * 24),
                      )}{" "}
                      Days
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-50">
                    <span className="text-sm font-bold text-gray-500">
                      Inventory Value (Est.)
                    </span>
                    <span className="text-sm font-bold text-gray-900 text-orange-600">
                      Calculated on Sync
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-50">
                    <span className="text-sm font-bold text-gray-500">
                      Tax Compliance
                    </span>
                    <span className="text-[10px] font-bold px-2 py-1 bg-green-100 text-green-700 rounded-lg uppercase">
                      {branch.taxRegion || "Standard"}
                    </span>
                  </div>
                </div>

                <div className="bg-blue-600 rounded-2xl p-6 text-white relative overflow-hidden">
                  <div className="relative z-10">
                    <h4 className="text-lg font-bold opacity-90">
                      Quick Action
                    </h4>
                    <p className="text-sm mt-2 opacity-75">
                      Need to adjust branch targets or manager details?
                    </p>
                    <button className="mt-6 px-6 py-2 bg-white text-blue-600 rounded-xl font-bold text-sm hover:shadow-lg transition-all">
                      Generate Full PDF
                    </button>
                  </div>
                  <TrendingUp
                    size={120}
                    className="absolute -bottom-4 -right-4 opacity-10 rotate-12"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <EditBranchModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          data={editData}
          setData={setEditData}
          onSave={handleUpdate}
          loading={updating}
        />
      </div>
    </div>
  );
}

// --- REUSABLE SUB-COMPONENTS ---

function StatCard({ label, value, icon, color }) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5">
      <div className={`${color} p-4 rounded-2xl`}>{icon}</div>
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          {label}
        </p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

function ContactInfo({ label, name, email, phone }) {
  return (
    <div>
      <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-2">
        {label}
      </p>
      <p className="text-lg font-bold text-gray-900">{name}</p>
      <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
        {email && (
          <span className="flex items-center gap-1">
            <Mail size={14} /> {email}
          </span>
        )}
        {phone && (
          <span className="flex items-center gap-1">
            <Phone size={14} /> {phone}
          </span>
        )}
      </div>
    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
        {label}
      </p>
      <p className="text-sm font-bold text-gray-800">{value || "Not Set"}</p>
    </div>
  );
}

function EditBranchModal({ isOpen, onClose, data, setData, onSave, loading }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bold/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Edit Branch Details
            </h2>
            <p className="text-sm text-gray-500 font-medium">
              Update operational info and targets.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <ArrowLeft className="rotate-90 w-6 h-6 text-gray-400" />
          </button>
        </div>

        <form
          onSubmit={onSave}
          className="p-8 space-y-6 max-h-[70vh] overflow-y-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Info */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-400">
                Branch Name
              </label>
              <input
                type="text"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                value={data.name || ""}
                onChange={(e) => setData({ ...data, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-400">
                Status
              </label>
              <select
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                value={data.status || "ACTIVE"}
                onChange={(e) => setData({ ...data, status: e.target.value })}
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>

            {/* Location Info */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-400">
                City
              </label>
              <input
                type="text"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                value={data.city || ""}
                onChange={(e) => setData({ ...data, city: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-400">
                Address
              </label>
              <input
                type="text"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                value={data.address || ""}
                onChange={(e) => setData({ ...data, address: e.target.value })}
              />
            </div>

            {/* Financials */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-400">
                Revenue Target (KES)
              </label>
              <input
                type="number"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                value={data.revenueTarget || 0}
                onChange={(e) =>
                  setData({
                    ...data,
                    revenueTarget: parseFloat(e.target.value),
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-400">
                Budget (KES)
              </label>
              <input
                type="number"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                value={data.budget || 0}
                onChange={(e) =>
                  setData({ ...data, budget: parseFloat(e.target.value) })
                }
              />
            </div>
          </div>

          <div className="flex gap-4 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all disabled:opacity-50"
            >
              {loading ? "Saving Changes..." : "Save Updates"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
