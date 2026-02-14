import { useEffect, useState } from "react";
import { getBranches, createBranch, toggleBranchStatus } from "../../services/branchService";
import {
  Plus,
  MapPin,
  Users,
  Power,
  Building2,
  Calendar,
  Search,
} from "lucide-react";

export default function Branches() {
  const [branches, setBranches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- FORM STATE ---
  const [branchForm, setBranchForm] = useState({
    name: "",
    code: "",
    type: "",
    status: "ACTIVE",
    openingDate: "",
    country: "",
    city: "",
    address: "",
    building: "",
    postalCode: "",
    mapsLink: "",
    managerName: "",
    managerEmail: "",
    managerPhone: "",
    assistantManager: "",
    reportingTo: "",
    initialStaff: "",
    maxStaff: "",
    departments: "",
    shiftType: "",
    currency: "",
    taxRegion: "",
    costCenter: "",
    budget: "",
    revenueTarget: "",
    registrationNumber: "",
    licenseNumber: "",
    insuranceProvider: "",
    insurancePolicy: "",
    enableSales: true,
    enableInventory: true,
    enableReports: true,
    defaultDashboard: "",
    notes: "",
    setupStatus: "Pending",
  });

  // --- FETCH LOGIC ---
  const fetchBranches = async () => {
    try {
      setIsLoading(true);
      const res = await getBranches();
      // Handle different response structures
      const dataArray = res.data?.data || res.data || [];
      setBranches(Array.isArray(dataArray) ? dataArray : []);
    } catch (error) {
      console.error("Failed to fetch branches", error);
      setBranches([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  // --- HANDLERS ---
  const toggleStatus = async (id) => {
    try {
      await toggleBranchStatus(id);
      fetchBranches();
    } catch (error) {
      console.error("Failed to toggle branch status", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBranchForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const generateCode = (name) => {
    if (!name) return "";
    const prefix = name.replace(/\s/g, "").substring(0, 3).toUpperCase();
    const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${randomStr}`;
  };

  const handleSubmitBranch = async () => {
    try {
      setIsSubmitting(true);
      const payload = {
        ...branchForm,
        initialStaff: Number(branchForm.initialStaff) || 0,
        maxStaff: Number(branchForm.maxStaff) || 20,
        budget: Number(branchForm.budget) || 0,
        revenueTarget: Number(branchForm.revenueTarget) || 0,
        openingDate: branchForm.openingDate ? new Date(branchForm.openingDate).toISOString() : new Date().toISOString(),
      };

      const response = await createBranch(payload);

      if (response.status === 201 || response.status === 200) {
        await fetchBranches();
        handleCloseModal();
        alert("Branch created successfully!");
      }
    } catch (error) {
      const serverMsg = error.response?.data?.message || "Unknown server error";
      alert(`Error: ${serverMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setStep(1);
    setBranchForm({
        name: "", code: "", type: "", status: "ACTIVE", openingDate: "",
        country: "", city: "", address: "", building: "", postalCode: "",
        mapsLink: "", managerName: "", managerEmail: "", managerPhone: "",
        assistantManager: "", reportingTo: "", initialStaff: "", maxStaff: "",
        departments: "", shiftType: "", currency: "", taxRegion: "",
        costCenter: "", budget: "", revenueTarget: "", registrationNumber: "",
        licenseNumber: "", insuranceProvider: "", insurancePolicy: "",
        enableSales: true, enableInventory: true, enableReports: true,
        defaultDashboard: "", notes: "", setupStatus: "Pending",
    });
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, 6));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const isStepValid = () => {
    switch (step) {
      case 1: return branchForm.name && branchForm.code && branchForm.type && branchForm.openingDate;
      case 2: return branchForm.country && branchForm.city && branchForm.address;
      case 3: return branchForm.managerName && branchForm.managerEmail && branchForm.managerPhone;
      case 5: return branchForm.currency && branchForm.taxRegion;
      default: return true;
    }
  };

  // --- UI COMPONENTS ---
  const baseInputClass = "w-full px-4 py-2.5 bg-gray-50 border rounded-xl transition-all outline-none text-gray-700 focus:ring-2";
  const getInputClass = (value, isRequired = false) => {
    const isInvalid = isRequired && !value;
    return `${baseInputClass} ${isInvalid ? "border-red-300 focus:ring-red-500/10" : "border-gray-200 focus:ring-blue-500/20"}`;
  };

  const SummaryItem = ({ label, value }) => (
    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
      <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400">{label}</p>
      <p className="text-sm font-medium text-gray-800 truncate">{value || "N/A"}</p>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* ===== HEADER ===== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Branches</h1>
          <p className="text-gray-500 font-medium">Manage and monitor all your business locations</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all font-bold"
        >
          <Plus size={20} />
          Add Branch
        </button>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-500 font-medium">Syncing branches...</p>
        </div>
      ) : branches.length > 0 ? (
        <>
          {/* STATS SECTION (Only show if branches exist) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Branches</p>
                <p className="text-3xl font-black text-gray-900 mt-1">{branches.length}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Status</p>
                <p className="text-3xl font-black text-green-600 mt-1">{branches.filter(b => b.status === "ACTIVE").length}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Staffing</p>
                <p className="text-3xl font-black text-blue-600 mt-1">{branches.reduce((acc, b) => acc + (b.initialStaff || 0), 0)}</p>
            </div>
          </div>

          {/* BRANCH GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {branches.map((branch) => (
              <div key={branch.id} className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex gap-4">
                    <div className="p-3 rounded-xl bg-blue-50 text-blue-600"><Building2 size={24} /></div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">{branch.name}</h2>
                      <p className="text-sm text-gray-500 flex items-center gap-1"><MapPin size={14} /> {branch.city}, {branch.country}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${branch.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {branch.status}
                  </span>
                </div>
                <div className="flex gap-2 mt-4">
                    <button className="flex-1 py-2.5 text-sm font-bold text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-600 hover:text-white transition-all">Manage</button>
                    <button onClick={() => toggleStatus(branch.id)} className="p-2.5 rounded-xl border border-gray-100 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"><Power size={18} /></button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* THE EMPTY STATE (This shows when you first register) */
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-100 text-center animate-in fade-in zoom-in duration-500">
          <div className="w-24 h-24 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-6">
            <Building2 size={48} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Your Business is Ready!</h2>
          <p className="text-gray-500 max-w-sm mt-2 mb-10">
            Every great business starts with its first location. Click below to register your headquarters or first branch.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-3 bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold shadow-xl shadow-blue-100 hover:bg-blue-700 hover:scale-105 transition-all"
          >
            <Plus size={24} />
            Setup First Branch
          </button>
        </div>
      )}

      {/* ===== ADD BRANCH MODAL ===== */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in duration-200">
            <div className="px-8 py-6 border-b border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Add New Branch</h2>
                <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600"><Plus size={24} className="rotate-45" /></button>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5, 6].map(s => (
                  <div key={s} className={`h-1.5 flex-1 rounded-full ${step >= s ? 'bg-blue-600' : 'bg-gray-100'}`} />
                ))}
              </div>
            </div>

            <div className="px-8 py-8 max-h-[60vh] overflow-y-auto">
              {step === 1 && (
                <div className="space-y-4 animate-in slide-in-from-right-4">
                  <h3 className="font-bold text-gray-800">Branch Identity</h3>
                  <input className={getInputClass(branchForm.name, true)} name="name" placeholder="Branch Name *" value={branchForm.name} onChange={(e) => setBranchForm(p => ({ ...p, name: e.target.value, code: p.code || generateCode(e.target.value) }))} />
                  <input className={`${baseInputClass} font-mono bg-blue-50/30`} name="code" value={branchForm.code} readOnly placeholder="Code Auto-Generated" />
                  <select className={getInputClass(branchForm.type, true)} name="type" onChange={handleChange} value={branchForm.type}>
                    <option value="">Select Type *</option>
                    <option>Retail</option><option>Warehouse</option><option>Office</option>
                  </select>
                  <input type="date" className={getInputClass(branchForm.openingDate, true)} name="openingDate" onChange={handleChange} value={branchForm.openingDate} />
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4 animate-in slide-in-from-right-4">
                  <h3 className="font-bold text-gray-800">Location</h3>
                  <input className={getInputClass(branchForm.country, true)} name="country" placeholder="Country *" onChange={handleChange} value={branchForm.country} />
                  <input className={getInputClass(branchForm.city, true)} name="city" placeholder="City *" onChange={handleChange} value={branchForm.city} />
                  <input className={getInputClass(branchForm.address, true)} name="address" placeholder="Physical Address *" onChange={handleChange} value={branchForm.address} />
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4 animate-in slide-in-from-right-4">
                  <h3 className="font-bold text-gray-800">Management</h3>
                  <input className={getInputClass(branchForm.managerName, true)} name="managerName" placeholder="Manager Name *" onChange={handleChange} value={branchForm.managerName} />
                  <input className={getInputClass(branchForm.managerEmail, true)} name="managerEmail" placeholder="Manager Email *" onChange={handleChange} value={branchForm.managerEmail} />
                  <input className={getInputClass(branchForm.managerPhone, true)} name="managerPhone" placeholder="Manager Phone *" onChange={handleChange} value={branchForm.managerPhone} />
                </div>
              )}

              {step === 4 && (
                <div className="space-y-4 animate-in slide-in-from-right-4">
                  <h3 className="font-bold text-gray-800">Staffing Projections</h3>
                  <input className={baseInputClass} type="number" name="initialStaff" placeholder="Current Staff" onChange={handleChange} value={branchForm.initialStaff} />
                  <input className={baseInputClass} type="number" name="maxStaff" placeholder="Max Capacity" onChange={handleChange} value={branchForm.maxStaff} />
                </div>
              )}

              {step === 5 && (
                <div className="space-y-4 animate-in slide-in-from-right-4">
                  <h3 className="font-bold text-gray-800">Financial Setup</h3>
                  <input className={getInputClass(branchForm.currency, true)} name="currency" placeholder="Currency (e.g. KES) *" onChange={handleChange} value={branchForm.currency} />
                  <select className={getInputClass(branchForm.taxRegion, true)} name="taxRegion" onChange={handleChange} value={branchForm.taxRegion}>
                    <option value="">Tax Region *</option>
                    <option>Standard VAT (16%)</option>
                    <option>Zero Rated (0%)</option>
                  </select>
                </div>
              )}

              {step === 6 && (
                <div className="space-y-4 animate-in zoom-in-95">
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <h3 className="font-bold text-blue-900">Review & Save</h3>
                    <p className="text-sm text-blue-700">Check all details before creating the branch.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <SummaryItem label="Name" value={branchForm.name} />
                    <SummaryItem label="Code" value={branchForm.code} />
                    <SummaryItem label="Manager" value={branchForm.managerName} />
                    <SummaryItem label="City" value={branchForm.city} />
                  </div>
                </div>
              )}
            </div>

            <div className="px-8 py-6 border-t border-gray-100 bg-gray-50 flex justify-between">
              <button onClick={step === 1 ? handleCloseModal : prevStep} className="px-6 py-2 rounded-xl border border-gray-300 font-bold text-gray-600 hover:bg-white transition-all">
                {step === 1 ? "Cancel" : "Back"}
              </button>
              {step < 6 ? (
                <button onClick={nextStep} disabled={!isStepValid()} className={`px-8 py-2 rounded-xl font-bold transition-all ${isStepValid() ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}>
                  Continue
                </button>
              ) : (
                <button onClick={handleSubmitBranch} disabled={isSubmitting} className="px-8 py-2 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all">
                  {isSubmitting ? "Creating..." : "Confirm & Create"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}