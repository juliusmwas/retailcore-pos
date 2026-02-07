// src/pages/admin/Branches.jsx
import { useState } from "react";
import {
  Plus,
  MapPin,
  Users,
  Power,
  Building2,
  Calendar,
} from "lucide-react";


export default function Branches() {

  const [showAddModal, setShowAddModal] = useState(false);


  const [branches, setBranches] = useState([
    {
      id: 1,
      name: "Main Branch",
      location: "Nairobi CBD",
      staffCount: 12,
      status: "ACTIVE",
      createdAt: "2024-10-01",
    },
    {
      id: 2,
      name: "Westlands Branch",
      location: "Westlands",
      staffCount: 6,
      status: "INACTIVE",
      createdAt: "2024-11-12",
    },
  ]);

  const toggleStatus = (id) => {
    setBranches((prev) =>
      prev.map((branch) =>
        branch.id === id
          ? {
              ...branch,
              status: branch.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
            }
          : branch
      )
    );
  };

  const [step, setStep] = useState(1);

const [branchForm, setBranchForm] = useState({
  // Core Identity
  name: "",
  code: "",
  type: "",
  status: "ACTIVE",
  openingDate: "",

  // Location
  country: "",
  city: "",
  address: "",
  building: "",
  postalCode: "",
  mapsLink: "",

  // Management
  managerName: "",
  managerEmail: "",
  managerPhone: "",
  assistantManager: "",
  reportingTo: "",

  // Staffing
  initialStaff: "",
  maxStaff: "",
  departments: "",
  shiftType: "",

  // Finance
  currency: "",
  taxRegion: "",
  costCenter: "",
  budget: "",
  revenueTarget: "",

  // Legal
  registrationNumber: "",
  licenseNumber: "",
  insuranceProvider: "",
  insurancePolicy: "",

  // System
  enableSales: true,
  enableInventory: true,
  enableReports: true,
  defaultDashboard: "",

  // Notes
  notes: "",
  setupStatus: "Pending",
});


const handleChange = (e) => {
  const { name, value, type, checked } = e.target;
  setBranchForm((prev) => ({
    ...prev,
    [name]: type === "checkbox" ? checked : value,
  }));
};

const nextStep = () => setStep((s) => Math.min(s + 1, 6));
const prevStep = () => setStep((s) => Math.max(s - 1, 1));

const handleSubmitBranch = () => {
  console.log("FINAL BRANCH DATA:", branchForm);

  // later → API call here
  setShowAddModal(false);
  setStep(1);
};

const isStepValid = () => {
  switch (step) {
    case 1: return branchForm.name && branchForm.code && branchForm.type;
    case 2: return branchForm.country && branchForm.city && branchForm.address;
    case 3: return branchForm.managerName && branchForm.managerEmail && branchForm.managerPhone;
    case 5: return branchForm.currency && branchForm.taxRegion;
    case 6: return true; // Review step is always "valid" to submit
    default: return true;
  }
};

// Base style for all inputs
const baseInputClass = "w-full px-4 py-2.5 bg-gray-50 border rounded-xl transition-all outline-none text-gray-700 placeholder:text-gray-400 focus:ring-2";

// Updated to show red border ONLY if required and empty
const getInputClass = (value, isRequired = false) => {
  const isInvalid = isRequired && !value;
  return `${baseInputClass} ${
    isInvalid 
      ? "border-red-300 focus:ring-red-500/10 focus:border-red-500 bg-red-50/30" 
      : "border-gray-200 focus:ring-blue-500/20 focus:border-blue-500"
  }`;
};

// Error Message Component
const ErrorMsg = ({ value, isRequired }) => {
  if (isRequired && !value) {
    return <p className="text-[11px] text-red-500 font-medium ml-1 mt-1 animate-in fade-in slide-in-from-top-1">This field is required</p>;
  }
  return null;
};

const generateCode = (name) => {
  if (!name) return "";
  // Take first 3 letters, uppercase them, add a random 4-digit number
  const prefix = name.replace(/\s/g, "").substring(0, 3).toUpperCase();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${random}`;
};


  return (
    <div className="space-y-8">
      {/* ===== HEADER ===== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Branches</h1>
          <p className="text-gray-500">
            Manage, activate, and monitor all business branches
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl shadow hover:bg-blue-700 transition"
        >
          <Plus size={18} />
          Add Branch
        </button>

      </div>

      {/* ===== BRANCH CARDS ===== */}
      {branches.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {branches.map((branch) => (
            <div
              key={branch.id}
              className="bg-white rounded-2xl shadow-sm border hover:shadow-md transition p-6 flex flex-col gap-6"
            >
              {/* TOP SECTION */}
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
                    <Building2 size={22} />
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold">
                      {branch.name}
                    </h2>

                    <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                      <MapPin size={14} />
                      {branch.location}
                    </div>
                  </div>
                </div>

                {/* STATUS */}
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    branch.status === "ACTIVE"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {branch.status}
                </span>
              </div>

              {/* MIDDLE METRICS */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
                  <Users size={18} className="text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-500">
                      Staff Members
                    </p>
                    <p className="font-semibold text-lg">
                      {branch.staffCount}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
                  <Calendar size={18} className="text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-500">
                      Created On
                    </p>
                    <p className="font-semibold text-sm">
                      {branch.createdAt}
                    </p>
                  </div>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex items-center justify-between pt-4 border-t">
                <button className="text-sm text-blue-600 font-medium hover:underline">
                  View Details
                </button>

                <button
                  onClick={() => toggleStatus(branch.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
                    branch.status === "ACTIVE"
                      ? "bg-red-50 text-red-600 hover:bg-red-100"
                      : "bg-green-50 text-green-600 hover:bg-green-100"
                  }`}
                >
                  <Power size={16} />
                  {branch.status === "ACTIVE"
                    ? "Deactivate"
                    : "Activate"}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* ===== EMPTY STATE ===== */
        <div className="bg-white rounded-2xl border p-12 text-center">
          <div className="mx-auto mb-4 w-14 h-14 flex items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <Building2 size={28} />
          </div>
          <h3 className="text-lg font-semibold mb-1">
            No branches yet
          </h3>
          <p className="text-gray-500 mb-6">
            Start by adding your first business branch
          </p>
          <button className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700">
            <Plus size={18} />
            Add Branch
          </button>
        </div>
      )}

      {/* ===== ADD MODAL ===== */}
{showAddModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
    <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
      
      {/* ===== MODAL HEADER ===== */}
      <div className="px-8 py-6 border-b border-gray-100 bg-white relative">
        <button 
          onClick={() => setShowAddModal(false)}
          className="absolute right-6 top-6 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <Plus size={24} className="rotate-45" />
        </button>
        
        <h2 className="text-2xl font-bold text-gray-900">
          Create New Branch
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Step {step} of 6 — Complete the setup to register a new business branch
        </p>

        {/* STEPPER */}
        <div className="flex items-center gap-3 mt-6">
          {[1, 2, 3, 4, 5, 6].map((s) => (
            <div key={s} className="flex-1 flex flex-col gap-2">
              <div
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  step >= s ? "bg-blue-600" : "bg-gray-100"
                }`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ===== MODAL BODY ===== */}
      <div className="px-8 py-6 max-h-[65vh] overflow-y-auto">

  {/* STEP 1 – CORE IDENTITY */}
  {step === 1 && (
    <section className="space-y-6 animate-in slide-in-from-right-4 duration-300">
      <div className="border-l-4 border-blue-500 pl-4">
        <h3 className="text-lg font-bold text-gray-800">Branch Identity</h3>
        <p className="text-sm text-gray-500">
          Basic identification and branch type <span className="text-red-500">*</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* BRANCH NAME */}
        <div className="flex flex-col gap-1">
          <input
            className={getInputClass(branchForm.name, true)}
            name="name"
            placeholder="Branch Name *"
            value={branchForm.name}
            onChange={(e) => {
              const newName = e.target.value;
              setBranchForm((prev) => ({
                ...prev,
                name: newName,
                // Auto-generate code if it's currently empty or just starting
                code: prev.code && prev.name ? prev.code : generateCode(newName),
              }));
            }}
          />
          <ErrorMsg value={branchForm.name} isRequired={true} />
        </div>

        {/* AUTO-GENERATED CODE */}
        <div className="flex flex-col gap-1 relative">
          <div className="relative">
            <input
              className={`${getInputClass(branchForm.code, true)} pr-10 bg-blue-50/30 font-mono`}
              name="code"
              placeholder="Branch Code *"
              value={branchForm.code}
              readOnly
            />
            <button
              type="button"
              onClick={() => setBranchForm(prev => ({ ...prev, code: generateCode(branchForm.name) }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-700 transition-colors"
              title="Regenerate Code"
            >
              <Power size={14} className="rotate-90" />
            </button>
          </div>
          <ErrorMsg value={branchForm.code} isRequired={true} />
        </div>

        {/* BRANCH TYPE */}
        <div className="flex flex-col gap-1">
          <select
            className={getInputClass(branchForm.type, true)}
            name="type"
            onChange={handleChange}
            value={branchForm.type}
          >
            <option value="">Branch Type *</option>
            <option>Retail</option>
            <option>Warehouse</option>
            <option>Office</option>
            <option>Franchise</option>
          </select>
          <ErrorMsg value={branchForm.type} isRequired={true} />
        </div>

        {/* OPENING DATE */}
        <div className="flex flex-col gap-1">
          <input
            className={getInputClass(branchForm.openingDate)}
            type="date"
            name="openingDate"
            onChange={handleChange}
            value={branchForm.openingDate}
          />
        </div>
      </div>
    </section>
  )}

  {/* STEP 2 – LOCATION */}
  {step === 2 && (
    <section className="space-y-6 animate-in slide-in-from-right-4 duration-300">
      <div className="border-l-4 border-blue-500 pl-4">
        <h3 className="text-lg font-bold text-gray-800">Location & Address</h3>
        <p className="text-sm text-gray-500">Physical presence details <span className="text-red-500">*</span></p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input className={getInputClass(branchForm.country, true)} name="country" placeholder="Country *" onChange={handleChange} value={branchForm.country} />
        <input className={getInputClass(branchForm.city, true)} name="city" placeholder="City / Town *" onChange={handleChange} value={branchForm.city} />
        <input className={`${getInputClass(branchForm.address, true)} md:col-span-2`} name="address" placeholder="Physical Address *" onChange={handleChange} value={branchForm.address} />
        <input className={getInputClass(branchForm.building)} name="building" placeholder="Building / Floor" onChange={handleChange} value={branchForm.building} />
        <input className={getInputClass(branchForm.mapsLink)} name="mapsLink" placeholder="Google Maps Link" onChange={handleChange} value={branchForm.mapsLink} />
      </div>
    </section>
  )}

  {/* STEP 3 – MANAGEMENT */}
  {step === 3 && (
    <section className="space-y-6 animate-in slide-in-from-right-4 duration-300">
      <div className="border-l-4 border-blue-500 pl-4">
        <h3 className="text-lg font-bold text-gray-800">Management</h3>
        <p className="text-sm text-gray-500">Contact person for this location <span className="text-red-500">*</span></p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input className={getInputClass(branchForm.managerName, true)} name="managerName" placeholder="Branch Manager *" onChange={handleChange} value={branchForm.managerName} />
        <input className={getInputClass(branchForm.managerEmail, true)} name="managerEmail" placeholder="Manager Email *" onChange={handleChange} value={branchForm.managerEmail} />
        <input className={getInputClass(branchForm.managerPhone, true)} name="managerPhone" placeholder="Manager Phone *" onChange={handleChange} value={branchForm.managerPhone} />
        <input className={getInputClass(branchForm.assistantManager)} name="assistantManager" placeholder="Assistant Manager" onChange={handleChange} value={branchForm.assistantManager} />
      </div>
    </section>
  )}

  {/* STEP 4 – STAFFING */}
  {step === 4 && (
    <section className="space-y-6 animate-in slide-in-from-right-4 duration-300">
      <div className="border-l-4 border-blue-500 pl-4">
        <h3 className="text-lg font-bold text-gray-800">Staffing & Capacity</h3>
        <p className="text-sm text-gray-500">Optional staffing projections</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input className={baseInputClass} type="number" name="initialStaff" placeholder="Initial Staff Count" onChange={handleChange} value={branchForm.initialStaff} />
        <input className={baseInputClass} type="number" name="maxStaff" placeholder="Max Staff Capacity" onChange={handleChange} value={branchForm.maxStaff} />
        <input className={`${baseInputClass} md:col-span-2`} name="departments" placeholder="Departments (comma separated)" onChange={handleChange} value={branchForm.departments} />
      </div>
    </section>
  )}

  {/* STEP 5 – FINANCE & LEGAL */}
  {step === 5 && (
    <section className="space-y-6 animate-in slide-in-from-right-4 duration-300">
      <div className="border-l-4 border-blue-500 pl-4">
        <h3 className="text-lg font-bold text-gray-800">Financial Setup</h3>
        <p className="text-sm text-gray-500">Tax and currency requirements <span className="text-red-500">*</span></p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input className={getInputClass(branchForm.currency, true)} name="currency" placeholder="Currency (KES, USD) *" onChange={handleChange} value={branchForm.currency} />
        <input className={getInputClass(branchForm.taxRegion, true)} name="taxRegion" placeholder="Tax Region / VAT Type *" onChange={handleChange} value={branchForm.taxRegion} />
        <input className={baseInputClass} name="registrationNumber" placeholder="Business Reg No." onChange={handleChange} value={branchForm.registrationNumber} />
        <input className={baseInputClass} name="licenseNumber" placeholder="License Number" onChange={handleChange} value={branchForm.licenseNumber} />
      </div>
    </section>
  )}

  {/* STEP 6 – REVIEW SUMMARY */}
  {step === 6 && (
    <section className="space-y-6 animate-in zoom-in-95 duration-300">
      <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-center gap-4">
        <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center shrink-0">
          <Building2 size={24} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-blue-900">Review Branch Details</h3>
          <p className="text-sm text-blue-700 font-medium">Please confirm all information is correct before proceeding.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <SummaryItem label="Branch Name" value={branchForm.name} />
        <SummaryItem label="Branch Code" value={branchForm.code} />
        <SummaryItem label="Type" value={branchForm.type} />
        <SummaryItem label="Location" value={`${branchForm.city}, ${branchForm.country}`} />
        <SummaryItem label="Manager" value={branchForm.managerName} />
        <SummaryItem label="Currency" value={branchForm.currency} />
      </div>

      <div className="p-4 bg-gray-50 rounded-xl border border-dashed border-gray-300">
        <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Enabled Modules</h4>
        <div className="flex gap-4">
          {branchForm.enableSales && <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded">SALES</span>}
          {branchForm.enableInventory && <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded">INVENTORY</span>}
          {!branchForm.enableSales && !branchForm.enableInventory && <span className="text-sm text-gray-400italic">No modules selected</span>}
        </div>
      </div>
    </section>
  )}
</div>

      {/* ===== MODAL FOOTER ===== */}
      <div className="px-8 py-5 border-t border-gray-100 bg-gray-50/50 flex justify-between items-center">
        <button
          onClick={step === 1 ? () => setShowAddModal(false) : prevStep}
          className="px-6 py-2.5 rounded-xl border border-gray-300 font-semibold text-gray-700 hover:bg-white hover:shadow-sm transition-all"
        >
          {step === 1 ? "Cancel" : "Back"}
        </button>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mr-2">
            Step {step} / 6
          </span>
          {step < 6 ? (
            <button
              onClick={nextStep}
              className="px-8 py-2.5 rounded-xl bg-blue-600 text-white font-semibold shadow-lg shadow-blue-200 hover:bg-blue-700 transform active:scale-95 transition-all"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handleSubmitBranch}
              className="px-8 py-2.5 rounded-xl bg-green-600 text-white font-semibold shadow-lg shadow-green-200 hover:bg-green-700 transform active:scale-95 transition-all"
            >
              Create Branch
            </button>
          )}
        </div>
      </div>
    </div>
  </div>
)}


    </div>
  );
}
