import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [business, setBusiness] = useState(null);
  const [branches, setBranches] = useState([]);
  const [activeBranch, setActiveBranch] = useState(null);
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // 🔁 Restore session on app load
  useEffect(() => {
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth) {
      try {
        const parsed = JSON.parse(storedAuth);
        
        // 1. Set basic states
        setUser(parsed.user);
        setBusiness(parsed.business || null);
        setBranches(parsed.branches || []);
        setToken(parsed.token || null);
        
        // 2. Determine Role (Crucial for ProtectedRoute)
        // We check: user.role -> branch[0].role -> Default to "OWNER" if user exists
        const rawRole = parsed.user?.role || parsed.branches?.[0]?.role || (parsed.user ? "OWNER" : null);
        
        if (rawRole) {
          setRole(rawRole.toUpperCase());
        }
      } catch (error) {
        console.error("Auth Restoration Failed:", error);
        localStorage.removeItem("auth"); 
      }
    }
    setAuthLoading(false);
  }, []);

  // ✅ Login function - used by Login and Register pages
  const login = ({ user, business, branches, token }) => {
    // 1. Update State
    setUser(user);
    setBusiness(business || null);
    setBranches(branches || []);
    setToken(token);
    
    // 2. Normalize and Set Role
    // This ensures ProtectedRoute sees "OWNER" instead of undefined or null
    const assignedRole = user?.role || branches?.[0]?.role || "OWNER";
    const normalizedRole = assignedRole.toUpperCase();
    setRole(normalizedRole);

    // 3. Persist to LocalStorage
    // We add the role to the user object inside storage to be safe
    const authData = { 
      user: { ...user, role: assignedRole }, 
      business, 
      branches, 
      token 
    };
    
    localStorage.setItem("auth", JSON.stringify(authData));
  };

  const selectBranch = (branch) => {
    setActiveBranch(branch);
    if (branch?.role) {
      setRole(branch.role.toUpperCase());
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
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}