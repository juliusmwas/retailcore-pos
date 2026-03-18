import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBranchById } from "../../services/branchService";
import { 
  ArrowLeft, Building2, Users, Package, 
  TrendingUp, MapPin, Phone, Mail, 
  Settings, CheckCircle, Clock
} from "lucide-react";

export default function BranchDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [branch, setBranch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

useEffect(() => {
  const fetchDetails = async () => {
    try {
      setLoading(true);
      const res = await getBranchById(id);
      
      // Axios result is in res.data
      // Your controller sends { status: "success", data: branch }
      // So the branch is at res.data.data
      const branchData = res.data?.data || res.data;

      if (branchData && branchData.id) {
        setBranch(branchData);
      } else {
        setBranch(null); // This triggers "Branch not found"
      }
    } catch (err) {
      console.error("Error loading branch details:", err);
      setBranch(null);
    } finally {
      setLoading(false);
    }
  };
  fetchDetails();
}, [id]);

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  if (!branch) return <div className="p-10 text-center">Branch not found.</div>;

  return (
    <div className="p-6 lg:p-10 space-y-8 bg-gray-50 min-h-screen">
      {/* --- BREADCRUMBS & NAVIGATION --- */}
      <button 
        onClick={() => navigate("/branches")}
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
              <h1 className="text-4xl font-black text-gray-900 tracking-tight">{branch.name}</h1>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                branch.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
              }`}>
                {branch.status}
              </span>
            </div>
            <p className="text-gray-500 font-medium flex items-center gap-2 mt-1">
              <MapPin size={16} /> {branch.address}, {branch.city} • <span className="font-mono text-blue-600">{branch.code}</span>
            </p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl font-bold text-gray-700 hover:shadow-md transition-all">
            <Settings size={18} /> Edit Branch
          </button>
        </div>
      </div>

      {/* --- QUICK STATS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Personnel" value={branch._count?.users || 0} icon={<Users className="text-blue-600"/>} color="bg-blue-50" />
        <StatCard label="Inventory Items" value={branch._count?.products || 0} icon={<Package className="text-orange-600"/>} color="bg-orange-50" />
        <StatCard label="Today's Sales" value="KES 0.00" icon={<TrendingUp className="text-green-600"/>} color="bg-green-50" />
        <StatCard label="Capacity" value={`${branch.maxStaff || 0}%`} icon={<CheckCircle className="text-purple-600"/>} color="bg-purple-50" />
      </div>

      {/* --- TAB NAVIGATION --- */}
      <div className="flex gap-8 border-b border-gray-200 overflow-x-auto">
        {['overview', 'staff list', 'inventory', 'reports'].map((tab) => (
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
              <h3 className="text-xl font-bold text-gray-900 mb-6">Management Team</h3>
              <div className="space-y-6">
                <ContactInfo label="Primary Manager" name={branch.managerName} email={branch.managerEmail} phone={branch.managerPhone} />
                <div className="h-px bg-gray-50" />
                <ContactInfo label="Assistant Manager" name={branch.assistantManager || "Not Assigned"} />
              </div>
            </div>

            {/* Logistics Card */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Operations & Tax</h3>
              <div className="grid grid-cols-2 gap-6">
                <DetailItem label="Currency" value={branch.currency} />
                <DetailItem label="Tax Region" value={branch.taxRegion} />
                <DetailItem label="Opening Date" value={new Date(branch.openingDate).toLocaleDateString()} />
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
          <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Employee</th>
          <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Role</th>
          <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
          <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Action</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-50">
        {branch.users?.length > 0 ? (
          branch.users.map((item) => (
            <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
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
                <span className="text-[10px] font-black px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg border border-blue-100 uppercase tracking-tighter">
                  {item.role}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2 text-sm font-bold">
                  <div className={`w-2 h-2 rounded-full ${
                    item.user?.status === 'ACTIVE' ? 'bg-green-500' : 'bg-red-400'
                  }`} /> 
                  <span className={item.user?.status === 'ACTIVE' ? 'text-green-600' : 'text-red-600'}>
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
            <td colSpan="4" className="px-6 py-10 text-center text-gray-400 font-medium">
              No staff members assigned to this branch yet.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
)}
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
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-black text-gray-900">{value}</p>
      </div>
    </div>
  );
}

function ContactInfo({ label, name, email, phone }) {
  return (
    <div>
      <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2">{label}</p>
      <p className="text-lg font-bold text-gray-900">{name}</p>
      <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
        {email && <span className="flex items-center gap-1"><Mail size={14}/> {email}</span>}
        {phone && <span className="flex items-center gap-1"><Phone size={14}/> {phone}</span>}
      </div>
    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-sm font-bold text-gray-800">{value || "Not Set"}</p>
    </div>
  );
}