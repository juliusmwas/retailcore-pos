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

  // 🔁 Restore session
  useEffect(() => {
    const storedAuth = localStorage.getItem("auth");

    if (storedAuth) {
      const parsed = JSON.parse(storedAuth);
      setUser(parsed.user);
      setBusiness(parsed.business || null);
      setBranches(parsed.branches || []);
      setToken(parsed.token || null);
    }

    setAuthLoading(false);
  }, []);

  const login = ({ user, business, branches, token }) => {
    setUser(user);
    setBusiness(business || null);
    setBranches(branches || []);
    setToken(token);

    localStorage.setItem(
      "auth",
      JSON.stringify({ user, business, branches, token })
    );
  };

  const selectBranch = (branch) => {
    setActiveBranch(branch);
    setRole(branch?.role || null);
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
  return useContext(AuthContext);
}
