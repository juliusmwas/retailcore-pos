import { createContext, useContext, useEffect, useState } from "react";
import { getBranches } from "../services/branchService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [business, setBusiness] = useState(null);
  const [branches, setBranches] = useState([]);
  const [activeBranch, setActiveBranch] = useState(null);
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // 🔄 Function to refresh branches from DB
  const updateBranches = async () => {
    try {
      const response = await getBranches();
      const branchList = response.data.data || [];
      setBranches(branchList);
      
      // Update local storage so the next refresh has the latest list
      const stored = JSON.parse(localStorage.getItem("auth"));
      if (stored) {
        localStorage.setItem("auth", JSON.stringify({ ...stored, branches: branchList }));
      }
    } catch (err) {
      console.error("Failed to sync branches:", err);
    }
  };

  // 🔁 Restore session on app load
  useEffect(() => {
    const storedAuth = localStorage.getItem("auth");
    const storedActiveBranch = localStorage.getItem("activeBranch");

    if (storedAuth) {
      try {
        const parsed = JSON.parse(storedAuth);
        setUser(parsed.user);
        setBusiness(parsed.business || null);
        setBranches(parsed.branches || []);
        setToken(parsed.token || null);

        // Restore the active branch selection if it exists
        if (storedActiveBranch) {
          setActiveBranch(JSON.parse(storedActiveBranch));
        }

        const rawRole = parsed.user?.role || parsed.branches?.[0]?.role || (parsed.user ? "OWNER" : null);
        if (rawRole) setRole(rawRole.toUpperCase());
        
        // Sync branches with server on load to ensure list is fresh
        updateBranches();
      } catch (error) {
        localStorage.removeItem("auth"); 
      }
    }
    setAuthLoading(false);
  }, []);

  const login = ({ user, business, branches, token }) => {
    setUser(user);
    setBusiness(business || null);
    setBranches(branches || []);
    setToken(token);
    const assignedRole = user?.role || branches?.[0]?.role || "OWNER";
    setRole(assignedRole.toUpperCase());

    localStorage.setItem("auth", JSON.stringify({ 
      user: { ...user, role: assignedRole }, 
      business, branches, token 
    }));
  };

  const selectBranch = (branch) => {
    setActiveBranch(branch);
    if (branch) {
      localStorage.setItem("activeBranch", JSON.stringify(branch));
    } else {
      localStorage.removeItem("activeBranch");
    }
  };

  const logout = () => {
    setUser(null);
    setBusiness(null);
    setBranches([]);
    setActiveBranch(null);
    setRole(null);
    setToken(null);
    localStorage.removeItem("auth");
    localStorage.removeItem("activeBranch");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        business,
        branches,
        activeBranch,
        role,
        token,
        authLoading,
        login,
        selectBranch,
        updateBranches, // New: allow pages to refresh the dropdown
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);