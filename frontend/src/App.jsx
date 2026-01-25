import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import SelectBranch from "./pages/SelectBranch";
import POS from "./pages/POS";
import Dashboard from "./pages/admin/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />

          {/* Cashier / Staff */}
          <Route
            path="/select-branch"
            element={
              <ProtectedRoute roles={["CASHIER"]}>
                <SelectBranch />
              </ProtectedRoute>
            }
          />

          <Route
            path="/pos"
            element={
              <ProtectedRoute roles={["CASHIER"]}>
                <POS />
              </ProtectedRoute>
            }
          />

          {/* Admin / Owner */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute roles={["OWNER", "ADMIN"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Index />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
