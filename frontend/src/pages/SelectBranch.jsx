import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

export default function SelectBranch() {
  const { user, branches, selectBranch, logout, role } = useAuth();
  const navigate = useNavigate();

  // 1. DYNAMIC IDENTIFICATION: 
  // We find the branch where the user has an assigned role (CASHIER or MANAGER).
  // Owners/Admins don't have a specific station, so they see everything.
  const isOwner = role === "OWNER" || role === "ADMIN";
  
  // This finds the first branch in the list that matches the user's current role
  const assignedBranch = branches?.find(b => b.role === role);
  const assignedBranchId = assignedBranch?.id;

  const handleSelect = (branch) => {
    // 2. Security Check
    // A branch is "Allowed" if the user is an Owner OR if the branch ID matches their assignment
    const isAllowed = isOwner || branch.id === assignedBranchId;

    if (!isAllowed) {
      toast.error(`Access Denied: Your account is restricted to the ${assignedBranch?.name || 'assigned branch'}.`, {
        duration: 4000,
        style: { border: '1px solid #fee2e2', fontWeight: 'bold', fontSize: '13px' },
      });
      return;
    }

    // 3. Success
    selectBranch(branch);
    
    if (role === "CASHIER") {
      navigate("/pos");
    } else if (role === "MANAGER") {
      navigate("/manager/dashboard");
    } else {
      navigate("/admin/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <Toaster position="top-center" />
      
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-gray-800 tracking-tight uppercase">Select Branch</h2>
            <p className="text-sm text-gray-500 font-medium italic">Assigning session for {user?.fullName || 'Staff'}</p>
        </div>
        
        <div className="space-y-3">
          {branches && branches.length > 0 ? (
            branches.map((branch) => {
              // A branch is clickable if user is Owner OR if this is their assigned station
              const isUserStation = branch.id === assignedBranchId;
              const canClick = isOwner || isUserStation;

              return (
                <button
                  key={branch.id}
                  onClick={() => handleSelect(branch)}
                  className={`w-full p-5 border-2 rounded-xl transition-all text-left font-bold flex justify-between items-center group shadow-sm ${
                    canClick 
                    ? "border-gray-100 hover:border-blue-500 hover:bg-blue-50 cursor-pointer opacity-100" 
                    : "border-gray-50 opacity-40 bg-gray-50 cursor-not-allowed"
                  }`}
                >
                  <div className="flex flex-col">
                      <span className={`transition-colors ${canClick ? 'text-gray-800 group-hover:text-blue-700' : 'text-gray-400'}`}>
                        {branch.name}
                      </span>
                      <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                        {branch.location || 'RetailCore Terminal'}
                      </span>
                  </div>
                  
                  {isUserStation && (
                    <span className="text-[9px] bg-blue-600 text-white px-2 py-1 rounded-lg uppercase">
                      Your Station
                    </span>
                  )}
                </button>
              );
            })
          ) : (
            <div className="text-center py-6 text-gray-500 italic">No branches assigned.</div>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <button onClick={logout} className="text-xs font-black uppercase text-red-500 hover:text-red-700 w-full">
            ← Sign out
          </button>
        </div>
      </div>
    </div>
  );
}