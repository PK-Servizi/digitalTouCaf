import { NavLink, Outlet, useLocation, Link } from 'react-router-dom';
import { Users, FolderOpen, ArrowRightLeft, ChevronDown, LogOut, Menu, X, UserCircle, LayoutDashboard, Bell } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import logo from '../logo/logo-tuocaf.png';
import { useAuth } from '../context/AuthContext';
import notificationsService from '../services/notifications.service';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/customers', label: 'Customers', icon: Users },
  { to: '/files', label: 'Requests', icon: FolderOpen },
  { to: '/movements', label: 'Invoices', icon: ArrowRightLeft },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifs, setLoadingNotifs] = useState(false);
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);
  const location = useLocation();

  useEffect(() => { setMobileMenuOpen(false); }, [location.pathname]);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await notificationsService.getAll({ unread: true, limit: 1 });
        setUnreadCount(res.total || res.meta?.total || (res.data || res || []).length);
      } catch {
        // silently ignore
      }
    };
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
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
              <Link to="/dashboard" className="flex items-center shrink-0">
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
              {/* Notification bell */}
              <div className="relative" ref={notifRef}>
                <button
                  onClick={async () => {
                    const opening = !notifOpen;
                    setNotifOpen(opening);
                    if (opening && notifications.length === 0) {
                      setLoadingNotifs(true);
                      try {
                        const res = await notificationsService.getAll({ limit: 10 });
                        setNotifications(res.data || res || []);
                      } catch { /* ignore */ }
                      setLoadingNotifs(false);
                    }
                  }}
                  className="relative p-2 rounded-lg hover:bg-white/15 transition-colors"
                >
                  <Bell size={20} className="text-blue-100" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-[#E87425] text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-[#1E3A5F] min-w-[18px] h-[18px]">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
                {notifOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 animate-fade-in overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                      <p className="text-sm font-semibold text-gray-800">Notifications</p>
                      {unreadCount > 0 && (
                        <button
                          onClick={async () => {
                            try {
                              await notificationsService.markAllRead();
                              setUnreadCount(0);
                              setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
                            } catch { /* ignore */ }
                          }}
                          className="text-xs text-[#1E3A5F] hover:underline"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-72 overflow-y-auto">
                      {loadingNotifs ? (
                        <div className="flex items-center justify-center py-6">
                          <div className="w-6 h-6 border-2 border-[#E87425] border-t-transparent rounded-full animate-spin" />
                        </div>
                      ) : notifications.length === 0 ? (
                        <p className="text-sm text-gray-500 text-center py-6">No notifications</p>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            className={`px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors ${!notif.read ? 'bg-blue-50/50' : ''}`}
                          >
                            <p className="text-sm font-medium text-gray-800">{notif.title}</p>
                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{notif.message}</p>
                            <p className="text-[10px] text-gray-400 mt-1">{new Date(notif.createdAt).toLocaleString()}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
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
                      onClick={() => { setDropdownOpen(false); logout(); }}
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
