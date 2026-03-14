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
  const [loading, setLoading] = useState(true);

  // 🔄 Function to refresh branches from DB
  const updateBranches = async () => {
    if (!token) return; 

    try {
      const response = await getBranches();
      const branchList = response.data.data || [];
      setBranches(branchList);
      
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
          
          // 1. Set basic states
          setUser(parsed.user);
          setBranches(parsed.branches || []);
          setToken(parsed.token || null);

          // 2. FIX: Ensure business object has an ID
          // Pulls ID from 'business' object, or fallback to 'user.businessId'
          const businessId = parsed.business?.id || parsed.user?.businessId || parsed.branches?.[0]?.businessId;
          setBusiness(parsed.business?.id ? parsed.business : { id: businessId });

          if (storedActiveBranch) {
            setActiveBranch(JSON.parse(storedActiveBranch));
          }

          const rawRole = parsed.user?.role || parsed.branches?.[0]?.role || (parsed.user ? "OWNER" : null);
          if (rawRole) setRole(rawRole.toUpperCase());
          
        } catch (error) {
          console.error("Auth hydration failed:", error);
          localStorage.removeItem("auth"); 
        }
      }
      
      setLoading(false);
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    if (token) {
      updateBranches();
    }
  }, [token]);

  const login = ({ user, business, branches, token }) => {
    // FIX: Normalize the business object immediately during login
    const businessId = business?.id || user?.businessId || branches?.[0]?.businessId;
    const finalBusiness = { ...business, id: businessId };

    setUser(user);
    setBusiness(finalBusiness);
    setBranches(branches || []);
    setToken(token);
    
    const assignedRole = user?.role || branches?.[0]?.role || "OWNER";
    setRole(assignedRole.toUpperCase());

    localStorage.setItem("auth", JSON.stringify({ 
      user: { ...user, role: assignedRole }, 
      business: finalBusiness, 
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
        loading,
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