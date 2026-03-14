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
  const [loading, setLoading] = useState(true); // Renamed for consistency

  // 🔄 Function to refresh branches from DB
  const updateBranches = async () => {
    // Only attempt if we have a token
    if (!token) return; 

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
    const initializeAuth = async () => {
      const storedAuth = localStorage.getItem("auth");
      const storedActiveBranch = localStorage.getItem("activeBranch");

      if (storedAuth) {
        try {
          const parsed = JSON.parse(storedAuth);
          
          // 1. Set basic states immediately from storage
          setUser(parsed.user);
          setBusiness(parsed.business || null);
          setBranches(parsed.branches || []);
          setToken(parsed.token || null);

          // 2. Restore active branch
          if (storedActiveBranch) {
            setActiveBranch(JSON.parse(storedActiveBranch));
          }

          // 3. Set Role
          const rawRole = parsed.user?.role || parsed.branches?.[0]?.role || (parsed.user ? "OWNER" : null);
          if (rawRole) setRole(rawRole.toUpperCase());
          
        } catch (error) {
          console.error("Auth hydration failed:", error);
          localStorage.removeItem("auth"); 
        }
      }
      
      // Finalize loading state
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Separate useEffect to sync branches once token is established
  useEffect(() => {
    if (token) {
      updateBranches();
    }
  }, [token]);

  const login = ({ user, business, branches, token }) => {
    setUser(user);
    setBusiness(business || null);
    setBranches(branches || []);
    setToken(token);
    const assignedRole = user?.role || branches?.[0]?.role || "OWNER";
    setRole(assignedRole.toUpperCase());

    localStorage.setItem("auth", JSON.stringify({ 
      user: { ...user, role: assignedRole }, 
      business, 
      branches, 
      token 
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
        loading, // Exposed as 'loading'
        login,
        selectBranch,
        updateBranches,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);