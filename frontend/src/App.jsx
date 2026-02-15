import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";

// Public pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import SelectBranch from "./pages/SelectBranch";
import POS from "./pages/POS";

// Admin Layout + Pages
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Branches from "./pages/admin/Branches";
import Staff from "./pages/admin/Staff";
import Products from "./pages/admin/Products";
import Sales from "./pages/admin/Sales";
import Reports from "./pages/admin/Reports";
import Settings from "./pages/admin/Settings";

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
              <ProtectedRoute roles={["OWNER", "ADMIN", "CASHIER"]}>
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

          {/* ================= ADMIN ROUTES ================= */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={["OWNER", "ADMIN"]}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="branches" element={<Branches />} />
            <Route path="staff" element={<Staff />} />
            <Route path="products" element={<Products />} />
            <Route path="sales" element={<Sales />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Index />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
