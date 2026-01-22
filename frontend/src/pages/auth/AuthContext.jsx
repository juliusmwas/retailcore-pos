import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [business, setBusiness] = useState(null);
  const [branches, setBranches] = useState([]);
  const [activeBranch, setActiveBranch] = useState(null);
  const [role, setRole] = useState(null);

  const login = ({ user, business, branches }) => {
    setUser(user);
    setBusiness(business);
    setBranches(branches);
  };

  const selectBranch = (branch) => {
    setActiveBranch(branch);
    setRole(branch.role);
  };

  const logout = () => {
    setUser(null);
    setBusiness(null);
    setBranches([]);
    setActiveBranch(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        business,
        branches,
        activeBranch,
        role,
        login,
        selectBranch,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
