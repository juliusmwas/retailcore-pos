import { useState, useEffect } from "react";
import { useAuth } from "../../auth/AuthContext";
import { getStaff, addStaff } from "../../services/staffService";
import { 
  UserPlus, Users, ShieldCheck, MapPin, 
  Mail, MoreVertical, CheckCircle, XCircle, 
  Search, Filter, Smartphone, X, Lock, Hash, User
} from "lucide-react";

export default function Staff() {
  const { activeBranch, branches } = useAuth();
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    staffNumber: "",
    phone: "",
    password: "",
    role: "CASHIER",
    branchId: activeBranch?.id || ""
  });

  // Sync modal's branch with Topbar's active branch
  useEffect(() => {
    if (activeBranch) {
      setFormData(prev => ({ ...prev, branchId: activeBranch.id }));
    }
  }, [activeBranch]);

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

  useEffect(() => {
    loadStaff();
  }, [activeBranch]);

  const handleOnboard = async (e) => {
    e.preventDefault();
    try {
      await addStaff(formData);
      setShowAddModal(false);
      // Reset form
      setFormData({
        fullName: "", email: "", staffNumber: "",
        phone: "", password: "", role: "CASHIER",
        branchId: activeBranch?.id || ""
      });
      loadStaff();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to onboard staff");
    }
  };

  const filteredStaff = staff.filter(s => 
    s.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.staffNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* 🚀 HEADER */}
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

      {/* 📊 QUICK STATS */}
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
            placeholder="Search by name, ID, or email..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
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

      {/* ➕ ADD STAFF MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-800">Onboard New Staff</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleOnboard} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input required type="text" placeholder="John Doe" className="w-full pl-10 p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500" 
                    value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Staff ID */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 ml-1">Staff ID / Number</label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input required type="text" placeholder="1001" className="w-full pl-10 p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500" 
                      value={formData.staffNumber} onChange={e => setFormData({...formData, staffNumber: e.target.value})} />
                  </div>
                </div>
                {/* Phone */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 ml-1">Phone Number</label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input required type="text" placeholder="07..." className="w-full pl-10 p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500" 
                      value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input required type="email" placeholder="staff@business.com" className="w-full pl-10 p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500" 
                    value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 ml-1">Login Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input required type="password" placeholder="••••••••" className="w-full pl-10 p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500" 
                    value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                {/* Role */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 ml-1">Role</label>
                  <select className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500 text-sm font-bold"
                    value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                    <option value="CASHIER">Cashier</option>
                    <option value="MANAGER">Manager</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
                {/* Branch */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 ml-1">Assign Branch</label>
                  <select required className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500 text-sm font-bold text-blue-600"
                    value={formData.branchId} onChange={e => setFormData({...formData, branchId: e.target.value})}>
                    <option value="">Select Branch</option>
                    {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
              </div>

              <button type="submit" className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 mt-4">
                Create Staff Account
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// --- SUB-COMPONENTS ---

function StatCard({ icon, label, value, bg }) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 transition-transform hover:scale-[1.02]">
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
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-inner">
          {member.fullName?.charAt(0)}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1">{member.fullName}</h3>
            <span className="text-xs font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-500 font-bold">#{member.staffNumber}</span>
          </div>
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
            member.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 
            member.role === 'MANAGER' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
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
          <span>{member.branches?.[0]?.branch?.name || "Global / Unassigned"}</span>
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
          Edit Profile
        </button>
        <button className="px-3 py-2 bg-gray-50 hover:bg-blue-50 text-gray-400 hover:text-blue-600 rounded-xl transition-all">
          <Smartphone className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}