import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { HiMenu, HiX, HiChevronDown, HiLogout, HiUser, HiCog } from 'react-icons/hi';
import { IoLeafOutline } from 'react-icons/io5';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../constants/roles';

// Public navigation items
const PUBLIC_NAV_ITEMS = [
  { name: 'Home', path: '#home' },
  { name: 'Services', path: '#services' },
  { name: 'About', path: '#about' },
  { name: 'Contact', path: '#contact' }
];

// Role-specific navigation items
const ROLE_NAV_ITEMS = {
  [ROLES.RESIDENT]: [
    { name: 'Dashboard', path: '/resident/dashboard', icon: '🏠' },
    { name: 'Pickups', path: '/resident/pickups', icon: '🗑️' },
    { name: 'Payments', path: '/resident/payments', icon: '💳' },
    { name: 'Rewards', path: '/resident/rewards', icon: '🏆' }
  ],
  [ROLES.WORKER]: [
    { name: 'Dashboard', path: '/worker/dashboard', icon: '🏠' },
    { name: 'Routes', path: '/worker/routes', icon: '🗺️' },
    { name: 'Reports', path: '/worker/reports', icon: '📝' },
    { name: 'Schedule', path: '/worker/schedule', icon: '📅' }
  ],
  [ROLES.ADMIN]: [
    { name: 'Dashboard', path: '/admin/dashboard', icon: '🏠' },
    { name: 'Users', path: '/admin/users', icon: '👥' },
    { name: 'Analytics', path: '/admin/analytics', icon: '📊' },
    { name: 'Settings', path: '/admin/settings', icon: '⚙️' }
  ]
};

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('Home');
  const userMenuRef = useRef(null);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const currentNavItems = isAuthenticated() && user?.role 
    ? ROLE_NAV_ITEMS[user.role] || []
    : PUBLIC_NAV_ITEMS;

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  return (
    <>
      <header className="bg-white/95 backdrop-blur-md shadow-md fixed w-full top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-[#4CBB17] to-[#3d9613] rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                <IoLeafOutline className="text-white text-xl" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-[#2f7410] to-[#4CBB17] bg-clip-text text-transparent">
                EcoCollect
              </h1>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {currentNavItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setActiveItem(item.name)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                    activeItem === item.name
                      ? 'text-[#2f7410] bg-[#edfae0]'
                      : 'text-gray-700 hover:text-[#4CBB17] hover:bg-[#edfae0]/50'
                  }`}
                >
                  {item.icon && <span>{item.icon}</span>}
                  <span>{item.name}</span>
                </Link>
              ))}
              
              {/* User Menu or Auth Buttons */}
              {isAuthenticated() ? (
                <div className="relative ml-4" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-gray-700 hover:text-[#4CBB17] hover:bg-[#edfae0]/50 transition-all duration-200"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {user?.name?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                    <span className="hidden lg:block">{user?.name?.split(' ')[0]}</span>
                    <HiChevronDown className="w-4 h-4" />
                  </button>

                  {/* User Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{user?.role?.toLowerCase()}</p>
                      </div>
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <HiUser className="w-4 h-4 mr-3" />
                        Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <HiCog className="w-4 h-4 mr-3" />
                        Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <HiLogout className="w-4 h-4 mr-3" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="ml-4 flex items-center space-x-2">
                  <Link
                    to="/signin"
                    className="px-4 py-2 text-gray-700 hover:text-[#4CBB17] font-medium transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link to="/signup">
                    <button className="bg-gradient-to-r from-[#4CBB17] to-[#3d9613] text-white px-6 py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 transform">
                      Get Started
                    </button>
                  </Link>
                </div>
              )}
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-700 hover:text-[#4CBB17] hover:bg-[#edfae0] p-2 rounded-lg transition-all duration-200"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <HiX className="h-6 w-6" />
                ) : (
                  <HiMenu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden bg-white border-t border-gray-100 transition-all duration-300 ease-in-out ${
            isMobileMenuOpen
              ? 'max-h-screen opacity-100'
              : 'max-h-0 opacity-0 overflow-hidden'
          }`}
        >
          <div className="px-4 pt-2 pb-4 space-y-2">
            {currentNavItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 flex items-center space-x-2 ${
                  activeItem === item.name
                    ? 'text-[#2f7410] bg-[#edfae0]'
                    : 'text-gray-700 hover:bg-[#edfae0]/50 hover:text-[#4CBB17]'
                }`}
                onClick={() => {
                  setActiveItem(item.name);
                  setIsMobileMenuOpen(false);
                }}
              >
                {item.icon && <span>{item.icon}</span>}
                <span>{item.name}</span>
              </Link>
            ))}
            
            {/* Mobile User Menu or Auth Buttons */}
            {isAuthenticated() ? (
              <div className="pt-2 border-t border-gray-200">
                <div className="px-4 py-2 mb-2">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role?.toLowerCase()}</p>
                </div>
                <Link
                  to="/profile"
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  to="/settings"
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Settings
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="pt-2 border-t border-gray-200 space-y-2">
                <Link
                  to="/signin"
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="block w-full"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <button className="w-full bg-gradient-to-r from-[#4CBB17] to-[#3d9613] text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300">
                    Get Started
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Spacer to prevent content from going under fixed header */}
      <div className="h-16"></div>
    </>
  );
};

export default Header;
