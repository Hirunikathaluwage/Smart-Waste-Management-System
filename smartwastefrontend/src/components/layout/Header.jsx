import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { HiMenu, HiX, HiChevronDown, HiLogout, HiUser, HiCog } from 'react-icons/hi';
import { IoLeafOutline } from 'react-icons/io5';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../constants/roles';

// Public navigation items
const PUBLIC_NAV_ITEMS = [
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/services' },
  { name: 'Pricing', path: '/pricing' },
  { name: 'Track Collection', path: '/track' },
  { name: 'About Us', path: '/about' },
  { name: 'Contact Us', path: '/contact' }
];

// Role-specific navigation items
const ROLE_NAV_ITEMS = {
  [ROLES.RESIDENT]: [
    { name: 'Dashboard', path: '/resident/dashboard', icon: '🏠' },
    { name: 'Schedule', path: '/resident/schedule', icon: '📅' },
    { name: 'Request Pickup', path: '/resident/pickups', icon: '🗑️' },
    { name: 'Payments', path: '/resident/payments', icon: '💳' },
    { name: 'Rewards', path: '/resident/rewards', icon: '🏆' },
    { name: 'Support', path: '/resident/support', icon: '💬' }
  ],
  [ROLES.WORKER]: [
    { name: 'Dashboard', path: '/worker/dashboard', icon: '🏠' },
    { name: 'My Routes', path: '/worker/routes', icon: '🗺️' },
    { name: 'Collections', path: '/worker/collections', icon: '🗑️' },
    { name: 'Reports', path: '/worker/reports', icon: '📝' },
    { name: 'Schedule', path: '/worker/schedule', icon: '📅' }
  ],
  [ROLES.ADMIN]: [
    { name: 'Dashboard', path: '/admin/dashboard', icon: '🏠' },
    { name: 'Reports', path: '/admin/reports', icon: '📊' },
    { name: 'Users', path: '/admin/users', icon: '👥' },
    { name: 'Routes', path: '/admin/routes', icon: '🗺️' },
    { name: 'Requests', path: '/admin/requests', icon: '📋' },
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
      <header className="bg-white shadow-md fixed w-full top-0 z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105"
                style={{ backgroundColor: '#4CBB17' }}
              >
                <IoLeafOutline className="text-white text-xl" />
              </div>
              <h1 className="text-xl font-bold" style={{ color: '#4CBB17' }}>
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
                      ? 'text-gray-700 hover:text-gray-900'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  style={activeItem === item.name ? {
                    backgroundColor: '#4CBB1715',
                    color: '#4CBB17'
                  } : {}}
                  onMouseEnter={(e) => {
                    if (activeItem !== item.name) {
                      e.currentTarget.style.backgroundColor = '#4CBB1710';
                      e.currentTarget.style.color = '#4CBB17';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeItem !== item.name) {
                      e.currentTarget.style.backgroundColor = '';
                      e.currentTarget.style.color = '';
                    }
                  }}
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
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200"
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: '#4CBB17' }}
                    >
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
                        className="flex items-center w-full px-4 py-2 text-sm text-white hover:opacity-90 rounded-b-lg transition-opacity"
                        style={{ backgroundColor: '#4CBB17' }}
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
                    className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link to="/signup">
                    <button
                      className="text-white px-6 py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 transform"
                      style={{ backgroundColor: '#4CBB17' }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#3da612'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#4CBB17'}
                    >
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
                className="text-gray-700 hover:bg-gray-50 p-2 rounded-lg transition-all duration-200"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <HiX className="h-6 w-6" style={{ color: '#4CBB17' }} />
                ) : (
                  <HiMenu className="h-6 w-6" style={{ color: '#4CBB17' }} />
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-4 space-y-2">
            {currentNavItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 flex items-center space-x-2 text-gray-700 hover:bg-gray-50"
                style={activeItem === item.name ? {
                  backgroundColor: '#4CBB1715',
                  color: '#4CBB17'
                } : {}}
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
                  className="block w-full text-left px-4 py-3 text-white rounded-lg"
                  style={{ backgroundColor: '#4CBB17' }}
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
                  <button
                    className="w-full text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                    style={{ backgroundColor: '#4CBB17' }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#3da612'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#4CBB17'}
                  >
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