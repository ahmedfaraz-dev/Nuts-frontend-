import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Package, Tag, Zap, Store, LogOut, X } from "lucide-react";

const navItems = [
  { to: "/admin-dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin-dashboard/products", label: "Products", icon: Package },
  { to: "/admin-dashboard/categories", label: "Categories", icon: Tag },
  { to: "/admin-dashboard/deals", label: "Deals", icon: Zap },
];

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();

  const isActive = (path, end) => {
    if (end) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:static top-0 left-0 z-50 h-screen w-60 bg-white border-r border-gray-200 flex flex-col transition-transform duration-200 ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
      >
        {/* Logo area */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Admin Panel</h2>
          <button
            onClick={onClose}
            className="lg:hidden p-1 text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {navItems.map((item) => {
            const active = isActive(item.to, item.end);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${active
                  ? "bg-orange-50 text-[#F59115]"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
              >
                <Icon size={18} strokeWidth={active ? 2.5 : 2} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom links */}
        <div className="px-3 py-4 border-t border-gray-100 flex flex-col gap-1">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <Store size={18} />
            Back to Home
          </Link>
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors w-full cursor-pointer">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}