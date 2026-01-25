import { NavLink } from "react-router-dom";
import {
  MdDashboard,
  MdBusiness,
  MdPeople,
  MdInventory,
  MdPointOfSale,
  MdBarChart,
  MdSettings,
} from "react-icons/md";

export default function Sidebar({ collapsed }) {
  const links = [
    { to: "/admin/dashboard", label: "Dashboard", icon: <MdDashboard size={24} /> },
    { to: "/admin/branches", label: "Branches", icon: <MdBusiness size={24} /> },
    { to: "/admin/staff", label: "Staff", icon: <MdPeople size={24} /> },
    { to: "/admin/products", label: "Products", icon: <MdInventory size={24} /> },
    { to: "/admin/sales", label: "Sales", icon: <MdPointOfSale size={24} /> },
    { to: "/admin/reports", label: "Reports", icon: <MdBarChart size={24} /> },
    { to: "/admin/settings", label: "Settings", icon: <MdSettings size={24} /> },
  ];

  return (
    <aside
      className={`bg-blue-600 text-white transition-all duration-300 flex flex-col ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-center font-bold text-lg border-b border-blue-500">
        {collapsed ? "BM" : "BizManager"}
      </div>

      {/* Nav Links */}
      <nav className="flex-1 mt-4">
        {links.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 hover:bg-blue-700 transition ${
                isActive ? "bg-blue-800 font-semibold" : ""
              }`
            }
          >
            <span className="flex-shrink-0">{icon}</span>
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
