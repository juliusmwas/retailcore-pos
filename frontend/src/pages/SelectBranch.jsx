import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

export default function SelectBranch() {
  const { branches, selectBranch, logout } = useAuth(); // ✅ Added logout from context
  const navigate = useNavigate();

  const handleSelect = (branch) => {
    selectBranch(branch);
    // Navigate based on the role assigned to this specific branch
    navigate(branch.role === "CASHIER" ? "/pos" : "/admin/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Select Branch</h2>
        
        <div className="space-y-3">
          {branches.length > 0 ? (
            branches.map((branch) => (
              <button
                key={branch.id}
                onClick={() => handleSelect(branch)}
                className="w-full p-4 border-2 border-gray-100 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left font-medium flex justify-between items-center group"
              >
                <span>{branch.name}</span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-500 group-hover:bg-blue-100">
                  {branch.role || "STAFF"}
                </span>
              </button>
            ))
          ) : (
            <p className="text-center text-gray-500 py-4">No branches assigned to your account.</p>
          )}
        </div>

        {/* ✅ The Logout Link */}
        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <button
            onClick={logout}
            className="text-sm font-medium text-red-500 hover:text-red-700 hover:underline transition-colors"
          >
            ← Sign out and go back
          </button>
        </div>
      </div>
      
      <p className="mt-4 text-xs text-gray-400">
        RetailCore POS v1.0.4
      </p>
    </div>
  );
}