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

  const [newBranch, setNewBranch] = useState({
    name: "",
    location: "",
    staffCount: "",
    status: "ACTIVE",
  });



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

  const handleInputChange = (e) => {
  const { name, value } = e.target;
  setNewBranch((prev) => ({ ...prev, [name]: value }));
};

const handleAddBranch = () => {
  if (!newBranch.name || !newBranch.location) {
    alert("Branch name and location are required");
    return;
  }

  const branch = {
      id: Date.now(),
      name: newBranch.name,
      location: newBranch.location,
      staffCount: Number(newBranch.staffCount || 0),
      status: newBranch.status,
      createdAt: new Date().toISOString().split("T")[0],
    };

    setBranches((prev) => [branch, ...prev]);

    // reset
    setNewBranch({
      name: "",
      location: "",
      staffCount: "",
      status: "ACTIVE",
    });

    setShowAddModal(false);
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

      {showAddModal && (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-1">Add New Branch</h2>
        <p className="text-gray-500 text-sm mb-6">
          Create a new business branch
        </p>

        <div className="space-y-4">
          <input
            name="name"
            value={newBranch.name}
            onChange={handleInputChange}
            placeholder="Branch Name"
            className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
          />

          <input
            name="location"
            value={newBranch.location}
            onChange={handleInputChange}
            placeholder="Location (e.g. Westlands)"
            className="w-full border rounded-lg px-4 py-3"
          />

          <input
            name="staffCount"
            type="number"
            value={newBranch.staffCount}
            onChange={handleInputChange}
            placeholder="Initial Staff Count"
            className="w-full border rounded-lg px-4 py-3"
          />

          <select
            name="status"
            value={newBranch.status}
            onChange={handleInputChange}
            className="w-full border rounded-lg px-4 py-3"
          >
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => setShowAddModal(false)}
            className="px-4 py-2 rounded-lg border hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={handleAddBranch}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Add Branch
          </button>
        </div>
      </div>
    </div>
  )}


    </div>
  );
}
