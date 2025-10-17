import { useState } from 'react';
import { Menu, X, Building2, Trash2, CreditCard, BarChart3, Users, Settings, Bell, LogOut } from 'lucide-react';

/**
 * Complete Dashboard Layout with Sidebar and Top Navigation - Business Version
 */
const DashboardLayout = ({
  navItems = [],
  activeNav = '',
  onNavClick = () => {},
  logo = 'Business',
  logoIcon = null,
  user = { name: 'Business User', avatar: null },
  onLogout = () => {},
  pageTitle = '',
  pageSubtitle = '',
  children
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col shadow-lg`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {isSidebarOpen && (
              <div className="flex items-center space-x-3">
                {logoIcon ? (
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#2563eb' }}>
                    {logoIcon}
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#2563eb' }}>
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                )}
                <span className="text-xl font-bold text-gray-900">{logo}</span>
              </div>
            )}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isSidebarOpen ? (
                <X className="w-5 h-5 text-gray-600" />
              ) : (
                <Menu className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onNavClick(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'border-l-4'
                    : 'text-gray-600 hover:bg-gray-50 border-l-4 border-transparent'
                }`}
                style={isActive ? { backgroundColor: '#2563eb20', color: '#2563eb', borderLeftColor: '#2563eb' } : {}}
              >
                {Icon && <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? '' : 'text-gray-500'}`} style={isActive ? { color: '#2563eb' } : {}} />}
                {isSidebarOpen && (
                  <span className={`font-medium ${isActive ? '' : 'text-gray-700'}`} style={isActive ? { color: '#2563eb' } : {}}>
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation Bar */}
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="px-8 py-4 flex justify-between items-center">
            {/* Page Title Section */}
            <div>
              {pageTitle && (
                <>
                  <h1 className="text-2xl font-bold text-gray-900">{pageTitle}</h1>
                  {pageSubtitle && <p className="text-sm text-gray-600 mt-1">{pageSubtitle}</p>}
                </>
              )}
            </div>

            {/* Right Section - User Info & Actions */}
            <div className="flex items-center space-x-4">
              {/* Notification Bell */}
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User Profile */}
              <div className="flex items-center space-x-3 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                ) : (
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#2563eb' }}>
                    <span className="text-white font-semibold text-sm">
                      {user?.name?.charAt(0)?.toUpperCase() || 'B'}
                    </span>
                  </div>
                )}
                <span className="text-sm font-medium text-gray-700">{user?.name || 'Business'}</span>
              </div>

              {/* Logout Button */}
              <button
                onClick={onLogout}
                className="px-4 py-2 text-white rounded-lg transition-colors text-sm font-medium flex items-center space-x-2"
                style={{ backgroundColor: '#2563eb' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;




