import { useState, useEffect } from "react";
import { useAuth } from "../../auth/AuthContext";
import { getStaff, addStaff } from "../../services/staffService";
import { 
  UserPlus, Users, ShieldCheck, MapPin, 
  Mail, MoreVertical, CheckCircle, XCircle, 
  Search, Filter, Smartphone
} from "lucide-react";

export default function Staff() {
  const { activeBranch, branches } = useAuth();
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // 🔄 Fetch Staff on load or branch change
  useEffect(() => {
    const loadStaff = async () => {
      setLoading(true);
      try {
        const res = await getStaff(activeBranch?.id);
        setStaff(res.data);
      } catch (err) {
        console.error("Failed to load staff");
      } finally {
        setLoading(false);
      }
    };
    loadStaff();
  }, [activeBranch]);

  const filteredStaff = staff.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* 🚀 HEADER & STATS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Staff Directory</h1>
          <p className="text-gray-500">
            {activeBranch ? `Managing team for ${activeBranch.name}` : "Overseeing all business personnel"}
          </p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all transform hover:scale-105 active:scale-95"
        >
          <UserPlus className="w-5 h-5" />
          Onboard New Staff
        </button>
      </div>

      {/* 📊 QUICK STATS BAR */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard icon={<Users className="text-blue-600"/>} label="Total Team" value={staff.length} bg="bg-blue-50" />
        <StatCard icon={<CheckCircle className="text-green-600"/>} label="Active Now" value={staff.filter(s => s.status === 'ACTIVE').length} bg="bg-green-50" />
        <StatCard icon={<ShieldCheck className="text-purple-600"/>} label="Admins" value={staff.filter(s => s.role === 'ADMIN').length} bg="bg-purple-50" />
      </div>

      {/* 🔍 SEARCH & FILTER */}
      <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text"
            placeholder="Search by name, email or role..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition">
          <Filter className="w-4 h-4" /> Filters
        </button>
      </div>

      {/* 📇 STAFF GRID */}
      {loading ? (
        <div className="flex justify-center p-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStaff.map((member) => (
            <StaffCard key={member.id} member={member} />
          ))}
        </div>
      )}

      {/* Placeholder if empty */}
      {!loading && filteredStaff.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
           <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
           <p className="text-gray-500 text-lg">No staff found for this criteria.</p>
        </div>
      )}
    </div>
  );
}

// --- SUB-COMPONENTS ---

function StatCard({ icon, label, value, bg }) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
      <div className={`${bg} p-4 rounded-2xl`}>{icon}</div>
      <div>
        <p className="text-gray-500 text-sm font-medium">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

function StaffCard({ member }) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-all group relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-inner">
          {member.name.charAt(0)}
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1">{member.name}</h3>
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
            member.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
          }`}>
            {member.role}
          </span>
        </div>
      </div>

      <div className="mt-6 space-y-3 border-t border-gray-50 pt-4 text-sm">
        <div className="flex items-center gap-3 text-gray-600">
          <Mail className="w-4 h-4 text-gray-400" />
          <span className="truncate">{member.email}</span>
        </div>
        <div className="flex items-center gap-3 text-gray-600">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span>{member.branch?.name || "Global / Unassigned"}</span>
        </div>
        <div className="flex items-center gap-3">
          {member.status === "ACTIVE" ? (
            <span className="flex items-center gap-1 text-green-600 font-bold text-xs bg-green-50 px-2 py-1 rounded-lg">
              <CheckCircle className="w-3 h-3" /> Active
            </span>
          ) : (
            <span className="flex items-center gap-1 text-red-600 font-bold text-xs bg-red-50 px-2 py-1 rounded-lg">
              <XCircle className="w-3 h-3" /> Inactive
            </span>
          )}
        </div>
      </div>

      <div className="mt-6 flex gap-2">
        <button className="flex-1 py-2 bg-gray-50 hover:bg-blue-50 hover:text-blue-600 text-gray-600 rounded-xl text-xs font-bold transition-all border border-transparent hover:border-blue-100">
          View Profile
        </button>
        <button className="px-3 py-2 bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-xl transition-all">
          <Smartphone className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}