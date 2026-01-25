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
        <NavLink to="/admin/dashboard" className={linkClass}>
          📊 {!collapsed && "Dashboard"}
        </NavLink>
        <NavLink to="/admin/sales" className={linkClass}>
          💰 {!collapsed && "Sales"}
        </NavLink>
        <NavLink to="/admin/staff" className={linkClass}>
          👥 {!collapsed && "Staff"}
        </NavLink>
        <NavLink to="/admin/inventory" className={linkClass}>
          📦 {!collapsed && "Inventory"}
        </NavLink>
        <NavLink to="/admin/reports" className={linkClass}>
          📑 {!collapsed && "Reports"}
        </NavLink>
      </nav>
    </aside>
  );
}
