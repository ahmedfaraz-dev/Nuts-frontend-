import { useLocation, useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const pageTitles = {
  "/admin-dashboard": "Dashboard",
  "/admin-dashboard/products": "Products",
  "/admin-dashboard/categories": "Categories",
  "/admin-dashboard/deals": "Deals",
};

export default function Header({ onMenuToggle }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
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
        {user && (
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center p-0.5 bg-gray-50 rounded-full border border-gray-100 hover:border-orange-200 transition-all cursor-pointer group"
            title="View Profile"
          >
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center overflow-hidden group-hover:ring-2 group-hover:ring-orange-200 transition-all">
              {user.avatar?.url ? (
                <img src={user.avatar.url} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs font-bold text-[#F59115] uppercase">
                  {user.name?.charAt(0)}
                </span>
              )}
            </div>
          </button>
        )}
      </div>
    </header>
  );
}