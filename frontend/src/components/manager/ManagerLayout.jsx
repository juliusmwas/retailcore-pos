import React, { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { 
  LayoutDashboard, 
  Receipt, 
  PackageSearch, 
  Users2, 
  Settings, 
  LogOut,
  Menu,
  X,
  Store
} from "lucide-react";

const ManagerLayout = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { name: "Dashboard", path: "/manager/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Sales & Orders", path: "/manager/sales", icon: <Receipt size={20} /> },
    { name: "Inventory", path: "/manager/inventory", icon: <PackageSearch size={20} /> },
    { name: "Staff", path: "/manager/staff", icon: <Users2 size={20} /> },
    { name: "Settings", path: "/manager/settings", icon: <Settings size={20} /> },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };


  return (
    <div className="flex h-screen bg-gray-50">
   
            {/* --- SIDEBAR --- */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 bg-blue-700 text-white transform transition-all duration-300 
          lg:translate-x-0 lg:static lg:inset-0 
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
          ${isCollapsed ? "lg:w-20" : "lg:w-64"} w-64`} 
      >
        <div className="flex flex-col h-full relative">
          
          {/* DESKTOP TOGGLE BUTTON (Hidden on mobile) */}

          {/* Logo Section */}
          <div className={`p-6 flex items-center gap-3 transition-all ${isCollapsed ? "justify-center" : ""}`}>
            <div className="bg-white p-1.5 rounded-lg shrink-0">
              <Store className="text-blue-700" size={24} />
            </div>
            {!isCollapsed && (
              <span className="text-xl font-bold tracking-tight whitespace-nowrap overflow-hidden">
                RetailCore
              </span>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 space-y-1 mt-4">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  title={isCollapsed ? item.name : ""} // Show tooltip when collapsed
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all overflow-hidden ${
                    isCollapsed ? "justify-center px-0" : ""
                  } ${
                    isActive 
                      ? "bg-white text-blue-700 shadow-lg" 
                      : "hover:bg-blue-600 text-blue-100"
                  }`}
                >
                  <div className="shrink-0">{item.icon}</div>
                  {!isCollapsed && <span className="whitespace-nowrap">{item.name}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Logout at Bottom */}
          <div className="p-4 border-t border-blue-600">
            <button 
              onClick={handleLogout}
              className={`flex items-center gap-3 w-full px-4 py-3 text-blue-100 hover:bg-red-500 hover:text-white rounded-xl transition-colors font-medium ${
                isCollapsed ? "justify-center px-0" : ""
              }`}
            >
              <LogOut size={20} className="shrink-0" />
              {!isCollapsed && <span>Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-2 text-gray-500">
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>

            <button 
        onClick={() => setIsCollapsed(!isCollapsed)} 
        className="hidden lg:flex p-2 text-gray-400 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
      >
        <Menu size={20} className={`transition-transform duration-300 ${isCollapsed ? "" : "rotate-90"}`} />
      </button>

     <h2 className="text-base font-bold text-gray-800 tracking-tight">
  {/* The '?' starts the condition, and the ':' is the 'else' */}
  {user?.branchName ? (
    <span className="capitalize">{user.branchName}</span>
  ) : (
    <span className="text-gray-400 italic font-medium">Loading Branch...</span>
  )}
</h2>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-gray-800">{user?.fullName}</p>
              <p className="text-xs text-blue-600 font-medium">Branch Manager</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-full border border-blue-200 flex items-center justify-center text-blue-700 font-bold">
              {user?.fullName?.charAt(0)}
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          <Outlet /> {/* This renders the Dashboard, Inventory, etc. */}
        </main>
      </div>
    </div>
  );
};

export default ManagerLayout;