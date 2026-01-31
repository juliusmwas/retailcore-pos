import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

export default function Topbar({ collapsed, toggleSidebar }) {
  const { branches, activeBranch, selectBranch, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  const handleBranchChange = (e) => {
    const value = e.target.value;
    if (value === "ALL") {
      selectBranch(null);
    } else {
      const branch = branches.find((b) => b.id === value);
      selectBranch(branch);
    }
  };

  const handleConfirmLogout = () => {
    logout();
    setShowLogoutModal(false);
    navigate("/login", { replace: true });
  };


  return (
    <>
      <header className="h-16 bg-white shadow flex items-center justify-between px-4">
        <button
          onClick={toggleSidebar}
          className="text-xl font-bold"
        >
          ☰
        </button>

        <div className="flex items-center gap-4">
          <select
            className="border rounded px-3 py-1"
            value={activeBranch?.id || "ALL"}
            onChange={handleBranchChange}
          >
            <option value="ALL">All Branches</option>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowLogoutModal(true)}
            className="text-red-600 font-semibold"
          >
            Logout
          </button>
        </div>
      </header>

      {/* LOGOUT CONFIRMATION MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6">
            <h2 className="text-lg font-bold mb-2">
              Confirm Logout
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to log out? You will need to log in again.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 rounded border hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmLogout}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
