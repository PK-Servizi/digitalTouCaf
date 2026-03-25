import { NavLink, Outlet, useLocation, Link } from 'react-router-dom';
import { Users, FolderOpen, ArrowRightLeft, ChevronDown, LogOut, Menu, X, UserCircle } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import logo from '../logo/logo-tuocaf.png';

const navItems = [
  { to: '/customers', label: 'Customers', icon: Users },
  { to: '/files', label: 'File', icon: FolderOpen },
  { to: '/movements', label: 'Movements', icon: ArrowRightLeft },
];

export default function Layout({ user, onLogout }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  useEffect(() => { setMobileMenuOpen(false); }, [location.pathname]);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const displayName = user?.name || user?.email?.split('@')[0] || 'User';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Top Navbar */}
      <nav className="bg-gradient-to-r from-[#1E3A5F] to-[#264D6E] text-white shadow-xl sticky top-0 z-50">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Brand + Nav links */}
            <div className="flex items-center gap-3 sm:gap-4 lg:gap-8">
              <Link to="/customers" className="flex items-center shrink-0">
                <div className="bg-white/95 rounded-lg px-2 py-1 shadow-sm">
                  <img src={logo} alt="tuoCAF" className="h-7 sm:h-9" />
                </div>
              </Link>
              {/* Desktop nav */}
              <div className="hidden md:flex items-center gap-1">
                {navItems.map(({ to, label, icon: Icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-3 lg:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-white/25 text-white shadow-inner'
                          : 'text-blue-100 hover:bg-white/15 hover:text-white'
                      }`
                    }
                  >
                    <Icon size={18} />
                    <span className="hidden lg:inline">{label}</span>
                  </NavLink>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              {/* User dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-white/15 transition-all duration-200"
                >
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-[#E87425] to-[#F2943D] flex items-center justify-center text-xs sm:text-sm font-bold shadow-md ring-2 ring-white/30">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline text-sm font-medium max-w-[120px] truncate">{displayName.toUpperCase()}</span>
                  <ChevronDown size={14} className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 animate-fade-in overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                      <p className="text-xs text-gray-500">Signed in as</p>
                      <p className="text-sm font-semibold text-gray-800 truncate">{user?.email || displayName}</p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <UserCircle size={16} />
                      My Profile
                    </Link>
                    <button
                      onClick={() => { setDropdownOpen(false); onLogout(); }}
                      className="flex items-center gap-2 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100"
                    >
                      <LogOut size={16} />
                      Sign out
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-white/15 transition-colors"
              >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile nav menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/20 animate-fade-in">
            <div className="px-4 py-3 space-y-1">
              {navItems.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-white/25 text-white'
                        : 'text-blue-100 hover:bg-white/15 hover:text-white'
                    }`
                  }
                >
                  <Icon size={18} />
                  {label}
                </NavLink>
              ))}
              <Link
                to="/profile"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-blue-100 hover:bg-white/15 hover:text-white transition-all duration-200"
              >
                <UserCircle size={18} />
                My Profile
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="p-3 sm:p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto animate-fade-in">
        <Outlet />
      </main>
    </div>
  );
}
