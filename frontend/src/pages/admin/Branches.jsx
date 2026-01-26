// src/pages/admin/Branches.jsx
import { useState } from "react";
import { Plus, MapPin, Users, Power } from "lucide-react";

export default function Branches() {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Branches</h1>
          <p className="text-gray-500 text-sm">
            Manage all business branches
          </p>
        </div>

        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus size={18} />
          Add Branch
        </button>
      </div>

      {/* Branches Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 text-left text-sm">
            <tr>
              <th className="px-6 py-3">Branch</th>
              <th className="px-6 py-3">Location</th>
              <th className="px-6 py-3">Staff</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {branches.map((branch) => (
              <tr key={branch.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">
                  {branch.name}
                </td>

                <td className="px-6 py-4 text-gray-600 flex items-center gap-2">
                  <MapPin size={16} />
                  {branch.location}
                </td>

                <td className="px-6 py-4 flex items-center gap-2">
                  <Users size={16} />
                  {branch.staffCount}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      branch.status === "ACTIVE"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {branch.status}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <button
                    onClick={() => toggleStatus(branch.id)}
                    className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                  >
                    <Power size={16} />
                    Toggle Status
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {branches.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No branches found
          </div>
        )}
      </div>
    </div>
  );
}
