import { NavLink } from "react-router-dom";

export default function Sidebar({ collapsed }) {
  const linkClass =
    "flex items-center gap-3 px-4 py-3 hover:bg-blue-700 transition";

  return (
    <aside
      className={`bg-blue-600 text-white transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="h-16 flex items-center justify-center font-bold text-lg">
        {collapsed ? "BM" : "BizManager"}
      </div>

      <nav className="mt-4">
        <NavLink to="/admin/dashboard">Dashboard</NavLink>
        <NavLink to="/admin/branches">Branches</NavLink>
        <NavLink to="/admin/staff">Staff</NavLink>
        <NavLink to="/admin/products">Products</NavLink>
        <NavLink to="/admin/sales">Sales</NavLink>
        <NavLink to="/admin/reports">Reports</NavLink>
        <NavLink to="/admin/settings">Settings</NavLink>
      </nav>
    </aside>
  );
}
