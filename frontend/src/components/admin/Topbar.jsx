import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

export default function Topbar({ collapsed, toggleSidebar }) {
  // We pull updateBranches so we can fetch data if the list is empty
  const { branches, activeBranch, selectBranch, logout, updateBranches } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  // 🔄 Sync branches if the list is empty (e.g., on a deep refresh)
  useEffect(() => {
    if (branches.length === 0) {
      updateBranches();
    }
  }, []);

  const handleBranchChange = (e) => {
    const value = e.target.value;
    if (value === "ALL") {
      selectBranch(null); // Setting to null means "Global View"
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
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="text-xl font-bold cursor-pointer hover:bg-gray-100 p-2 rounded-full"
          >
            ☰
          </button>
          <h1 className="hidden md:block font-semibold text-gray-700">
            {activeBranch ? `Branch: ${activeBranch.name}` : "All Locations"}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {/* BRANCH SELECTOR */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 hidden sm:inline">Switch Location:</span>
            <select
              className="border border-gray-300 rounded-lg px-3 py-1.5 bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
              value={activeBranch?.id || "ALL"}
              onChange={handleBranchChange}
            >
              <option value="ALL">🌍 All Branches</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  📍 {b.name}
                </option>
              ))}
            </select>
          </div>

          <div className="h-6 w-px bg-gray-200 mx-2"></div>

          <button
            onClick={() => setShowLogoutModal(true)}
            className="text-red-600 font-semibold hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            Logout
          </button>
        </div>
      </header>

      {/* LOGOUT CONFIRMATION MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 transform transition-all">
            <h2 className="text-xl font-bold mb-2 text-gray-800">Confirm Logout</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to log out? Your active branch session will be saved.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmLogout}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 shadow-md transition-colors cursor-pointer"
              >
                Logout Now
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}