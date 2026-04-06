import { useLocation } from "react-router-dom";
import { Menu, User } from "lucide-react";

const pageTitles = {
  "/admin-dashboard": "Dashboard",
  "/admin-dashboard/products": "Products",
  "/admin-dashboard/categories": "Categories",
  "/admin-dashboard/deals": "Deals",
};

export default function Header({ onMenuToggle }) {
  const location = useLocation();
  const title = pageTitles[location.pathname] || "Dashboard";

  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-1.5 text-gray-500 hover:text-gray-700 cursor-pointer"
        >
          <Menu size={22} />
        </button>
        <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
          <User size={16} className="text-[#F59115]" />
        </div>
        <span className="text-sm font-medium text-gray-700 hidden sm:block">Admin</span>
      </div>
    </header>
  );
}