import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext.jsx'
import { useAuth } from '../contexts/AuthContext.jsx'
import { User, LogOut, ChevronDown, LayoutDashboard } from 'lucide-react'

const PRIMARY_TABS = [
  { id: 'dryfood', label: 'Dry food' },
  { id: 'handmade', label: 'Hand Made' },
  { id: 'jewellery', label: 'jewellery' },
  { id: 'waretrending', label: 'Ware trending' },
  { id: 'hunzadresses', label: 'hunza dresses' },
]

const DRY_FOOD_COLUMNS = [
  {
    title: 'Shop by category',
    items: ['Apples', 'Hunza Food', 'Gb dry', 'lorem', 'Gilgit foods', 'Gilgit foods', 'Gilgit foods'],
  },
  {
    title: 'Trending now',
    items: ['Apples', 'Hunza Food', 'Gb dry', 'lorem', 'Item food', 'Gilgit foods', 'Gilgit foods'],
  },
  {
    title: 'What to wear',
    items: ['Apples', 'Hunza Food', 'Gb dry', 'lorem', 'Hunza Cap', 'shuqa'],
  },
  {
    title: 'most sale',
    items: ['Apples', 'Hunza Food', 'Gb dry', 'lorem', 'Apricot', 'Dry chamus'],
  },
  {
    title: 'Best products',
    items: ['Apples', 'Hunza Food', 'Gb dry', 'lorem'],
  },
  {
    title: 'deals for you',
    items: ['Apples', 'Hunza Food', 'Gb dry', 'lorem'],
  },
]

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('dryfood')
  const navigate = useNavigate()
  const { totalItems } = useCart()
  const { user, logout } = useAuth()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <nav className="w-full sticky top-0 z-50">
      {/* Navbar row - hidden when menu is open */}
      {!isMobileMenuOpen && (
        <div className="w-full bg-white/70 backdrop-blur-[2px] py-4 px-4 md:px-8 lg:px-16">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            {/* Logo */}
            <a href="/" className="shrink-0">
              <img
                src="/images/logo.png"
                alt="Hunza Naturals"
                className="h-10 md:h-12 w-auto"
              />
            </a>

            {/* Search Bar - Hidden on mobile, visible on md and up */}
            <form
              onSubmit={handleSearch}
              className="hidden md:flex flex-1 max-w-xl mx-4 lg:mx-8"
            >
              <div className="relative w-full flex">
                <input
                  type="text"
                  placeholder="What Are You Looking For..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-5 py-3 rounded-l-full border border-gray-200 border-r-0 bg-gray-50/50 text-gray-600 placeholder-gray-400 focus:outline-none focus:border-orange-400 text-sm"
                />
                <button
                  type="submit"
                  className="px-6 py-3  text-white font-medium rounded-r-full bg-[#F59115] hover:bg-orange-600 transition-all duration-200 text-sm whitespace-nowrap cursor-pointer"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Hamburger Menu */}
            <div className='flex justify-center items-center gap-6 cursor-pointer'>
              {/* Cart Button */}
              <button
                onClick={() => navigate('/cart')}
                className="relative p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <img src="/images/cart.svg" alt="cart" className="w-6 h-6" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#F59115] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {totalItems > 9 ? '9+' : totalItems}
                  </span>
                )}
              </button>

              {/* User Section */}
              <div className="flex items-center gap-4">
                {user ? (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center overflow-hidden">
                        {user.avatar?.url ? (
                          <img src={user.avatar.url} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-4 h-4 text-[#F59115]" />
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-700 hidden lg:block">{user.name}</span>
                    </div>
                    <button
                      onClick={logout}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      title="Logout"
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                    {user.role === 'admin' && (
                      <button
                        onClick={() => navigate('/admin-dashboard')}
                        className="p-2 text-gray-400 hover:text-[#F59115] hover:bg-orange-50 rounded-lg transition-all"
                        title="Admin Dashboard"
                      >
                        <LayoutDashboard className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => navigate('/register')}
                    className="flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded-lg transition-all group"
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-200 group-hover:border-[#F59115]">
                      <User className="w-5 h-5 text-gray-500 group-hover:text-[#F59115]" />
                    </div>
                    <span className="text-sm font-medium text-gray-600 group-hover:text-[#F59115] hidden sm:block">Register</span>
                  </button>
                )}
              </div>

              {/* Hamburger Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="flex flex-col justify-center items-center gap-1.5 p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                aria-label="Toggle menu"
              >
                <span className={`w-6 h-0.5 bg-gray-800 rounded-full transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                <span className={`w-6 h-0.5 bg-gray-800 rounded-full transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`w-6 h-0.5 bg-gray-800 rounded-full transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mega Menu - from top of page when open, navbar hidden; content 1440×420 */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop - click or mouse leave to close */}
          <div
            className="fixed inset-0 z-40 bg-black/20"
            onClick={() => setIsMobileMenuOpen(false)}
            onMouseLeave={() => setIsMobileMenuOpen(false)}
            aria-hidden
          />
          <div
            className="fixed top-0 left-1/2 -translate-x-1/2 z-50 w-[1440px] max-w-[100vw] h-[420px] bg-white shadow-lg overflow-y-auto"
            onMouseLeave={() => setIsMobileMenuOpen(false)}
            style={{ opacity: 1 }}
          >
            <div className="w-full h-full max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16 py-5 box-border">
              {/* Primary category tabs */}
              <div className="flex flex-wrap gap-6 md:gap-8 border-b border-gray-200 pb-3 mb-4">
                {PRIMARY_TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`text-sm font-medium transition-colors whitespace-nowrap pb-1 border-b-2 -mb-[13px] ${activeTab === tab.id
                      ? 'text-[#F59115] border-[#F59115]'
                      : 'text-gray-600 border-transparent hover:text-gray-800'
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Columns - content for active tab */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
                {DRY_FOOD_COLUMNS.map((column) => (
                  <div key={column.title}>
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">
                      {column.title}
                    </h3>
                    <ul className="space-y-1">
                      {column.items.map((item) => (
                        <li key={`${column.title}-${item}-${column.items.indexOf(item)}`}>
                          <a
                            href={`/products?category=${encodeURIComponent(item)}`}
                            className="text-sm text-gray-500 hover:text-[#F59115] transition-colors"
                          >
                            {item}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </nav>
  )
}

export default Navbar
