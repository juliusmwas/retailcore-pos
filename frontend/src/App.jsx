import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";

// Public pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import SelectBranch from "./pages/SelectBranch";
import POS from "./pages/POS";
import About from "./About";
import Contact from "./pages/Contact";

// Admin Layout + Pages
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Branches from "./pages/admin/Branches";
import Staff from "./pages/admin/Staff";
import Products from "./pages/admin/Products";
import Sales from "./pages/admin/Sales";
import Reports from "./pages/admin/Reports";
import Settings from "./pages/admin/Settings";
import BranchDetails from "./pages/branches/BranchDetails";

// Manager Pages (Add ManagerLayout here later if you create one)
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import ManagerLayout from "./components/manager/ManagerLayout";
import ManagerSales from "./pages/manager/ManagerSales";
import ManagerInventory from "./pages/manager/ManagerInventory";
import ManagerStaff from "./pages/manager/ManagerStaff";
import ManagerSettings from "./pages/manager/ManagerSettings";
import PrivacyPolicy from "./pages/Privacy-policy";
import TermsOfService from "./pages/Terms-of-service";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* 1. PUBLIC ROUTES */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />

          {/* 2. SHARED ROUTES (Roles that need to pick a branch) */}
          <Route
            path="/select-branch"
            element={
              <ProtectedRoute roles={["OWNER", "ADMIN", "MANAGER", "CASHIER"]}>
                <SelectBranch />
              </ProtectedRoute>
            }
          />

          {/* 3. CASHIER ROUTES */}
          <Route
            path="/pos"
            element={
              <ProtectedRoute roles={["CASHIER", "MANAGER", "OWNER"]}>
                <POS />
              </ProtectedRoute>
            }
          />

          {/* 4. ADMIN ROUTES (Nested) */}
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
            <Route path="branches/:id" element={<BranchDetails />} />
          </Route>

          {/* 5. MANAGER ROUTES (Nested) */}
          {/* 5. MANAGER ROUTES (Nested under the ManagerLayout) */}
          <Route
            path="/manager"
            element={
              <ProtectedRoute roles={["MANAGER", "OWNER"]}>
                <ManagerLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<ManagerDashboard />} />
            {/* We will add these pages next: */}
            <Route path="sales" element={<ManagerSales />} />
            <Route path="inventory" element={<ManagerInventory />} />
            <Route path="staff" element={<ManagerStaff />} />
            <Route path="settings" element={<ManagerSettings />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
