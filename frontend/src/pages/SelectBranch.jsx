import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

export default function SelectBranch() {
  const { branches, selectBranch } = useAuth();
  const navigate = useNavigate();

  const handleSelect = (branch) => {
    selectBranch(branch);
    navigate(branch.role === "CASHIER" ? "/pos" : "/admin");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Select Branch</h2>
        {branches.map((branch) => (
          <button
            key={branch.id}
            onClick={() => handleSelect(branch)}
            className="w-full p-3 mb-2 border rounded hover:bg-gray-100"
          >
            {branch.name} ({branch.role})
          </button>
        ))}
      </div>
    </div>
  );
}
