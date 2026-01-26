import { useState } from "react";
import {
  UserPlus,
  Users,
  ShieldCheck,
  Store,
  Power,
  Edit,
} from "lucide-react";

export default function Staff() {
  // Mock staff data
  const [staff] = useState([
    {
      id: 1,
      name: "John Mwangi",
      email: "john@bizmanager.com",
      role: "ADMIN",
      branch: "Nairobi CBD",
      status: "ACTIVE",
    },
    {
      id: 2,
      name: "Mary Wanjiku",
      email: "mary@bizmanager.com",
      role: "CASHIER",
      branch: "Westlands",
      status: "ACTIVE",
    },
    {
      id: 3,
      name: "Peter Otieno",
      email: "peter@bizmanager.com",
      role: "CASHIER",
      branch: "Kasarani",
      status: "INACTIVE",
    },
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Users className="w-6 h-6" />
            Staff Management
          </h1>
          <p className="text-sm text-gray-500">
            Manage staff accounts, roles, and branch assignments
          </p>
        </div>

        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          <UserPlus className="w-4 h-4" />
          Add Staff
        </button>
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Role</th>
              <th className="px-6 py-3 text-left">Branch</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {staff.map((member) => (
              <tr key={member.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-800">
                  {member.name}
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {member.email}
                </td>

                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                    <ShieldCheck className="w-3 h-3" />
                    {member.role}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1 text-gray-700">
                    <Store className="w-4 h-4" />
                    {member.branch}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      member.status === "ACTIVE"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {member.status}
                  </span>
                </td>

                <td className="px-6 py-4 text-right space-x-2">
                  <button className="inline-flex items-center gap-1 text-blue-600 hover:underline">
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>

                  <button className="inline-flex items-center gap-1 text-red-600 hover:underline">
                    <Power className="w-4 h-4" />
                    Disable
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
