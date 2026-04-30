import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext.jsx'
import { useAuth } from '../contexts/AuthContext.jsx'
import { useCurrency } from '../contexts/CurrencyContext.jsx'
import { User, LogOut, ChevronDown, LayoutDashboard, Globe } from 'lucide-react'

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
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false)
  const navigate = useNavigate()
  const { totalItems } = useCart()
  const { user, logout, authLoading } = useAuth()
  const { currency, setCurrency, availableCurrencies, loading, lastUpdated, refreshRates } = useCurrency()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/all-products?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  if (authLoading) {
    return (
      <nav className="w-full sticky top-0 z-50 bg-white/70 backdrop-blur-[2px] py-4 px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
           <div className="h-10 w-32 bg-gray-100 animate-pulse rounded" />
           <div className="h-10 flex-1 max-w-xl mx-8 bg-gray-100 animate-pulse rounded-full hidden md:block" />
           <div className="h-10 w-24 bg-gray-100 animate-pulse rounded" />
        </div>
      </nav>
    )
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

            {/* Hamburger Menu & Actions */}
            <div className='flex justify-center items-center gap-4 md:gap-6 cursor-pointer'>
              
              {/* Currency Selector */}
              <div className="relative">
                <button
                  onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-all duration-150"
                  title="Change Currency"
                >
                  <Globe className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">{currency}</span>
                  <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform duration-150 ${isCurrencyDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isCurrencyDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-[60]" 
                      onClick={() => setIsCurrencyDropdownOpen(false)}
                    />
                    <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-[70] py-2 min-w-[140px]">
                      {Object.entries(availableCurrencies).map(([currCode, currInfo]) => (
                        <button
                          key={currCode}
                          onClick={() => {
                            setCurrency(currCode);
                            setIsCurrencyDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-sm transition-colors flex items-center justify-between ${
                            currency === currCode 
                              ? 'bg-gray-100 text-gray-900 font-medium' 
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <span>{currCode}</span>
                          <span className="text-gray-500">{currInfo.symbol}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

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
                    <button
                      onClick={() => navigate('/profile')}
                      className="flex items-center p-0.5 bg-gray-50 rounded-full border border-gray-100 hover:border-orange-200 transition-all cursor-pointer group"
                      title="View Profile"
                    >
                      <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-orange-100 flex items-center justify-center overflow-hidden group-hover:ring-2 group-hover:ring-orange-200 transition-all">
                        {user.avatar?.url ? (
                          <img src={user.avatar.url} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xs md:text-sm font-bold text-[#F59115] uppercase">
                            {user.name?.charAt(0)}
                          </span>
                        )}
                      </div>
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
                            href={`/all-products?category=${encodeURIComponent(item)}`}
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
