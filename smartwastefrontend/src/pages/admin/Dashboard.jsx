import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../components/dashboard/AdminDashboardLayout';
import {
  BarChart3, Package, Truck, Trash2, CheckSquare,
  TrendingUp, Recycle, MapPin, AlertCircle, DollarSign, Leaf, ArrowRight, LineChart
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  // ✅ Detect and set active nav based on current path
  const [activeNav, setActiveNav] = useState(
    location.pathname.includes('/analytics') ? 'analytics' : 'reports'
  );

  useEffect(() => {
    if (location.pathname.includes('/analytics')) {
      setActiveNav('analytics');
    } else {
      setActiveNav('reports');
    }
  }, [location.pathname]);

  const [reportType, setReportType] = useState('waste-trends');
  const [area, setArea] = useState('all-areas');
  const [dateRange, setDateRange] = useState('');
  const [selectedWasteTypes, setSelectedWasteTypes] = useState({
    general: false,
    recyclables: false,
    organic: false,
    hazardous: false
  });

  // Sidebar navigation items
  const navItems = [
    { id: 'reports', label: 'Generate Reports', icon: BarChart3 },
    { id: 'pickups', label: 'Special Pickups', icon: Package },
    { id: 'routes', label: 'Route Changes', icon: Truck },
    { id: 'bins', label: 'Bin Requests', icon: Trash2 },
    { id: 'approvals', label: 'Approvals', icon: CheckSquare },
    { id: 'analytics', label: 'Analytics', icon: LineChart },
  ];

  // Analytics dashboard cards
  const analyticsDashboards = [
    {
      id: 'performance',
      title: 'Waste Collection Performance',
      description: 'Monitor collection efficiency, worker performance, and route optimization',
      icon: TrendingUp,
      color: '#4CBB17',
      path: '/admin/performance'
    },
    {
      id: 'recycling',
      title: 'Recycling Trends',
      description: 'Track recycling rates, waste composition, and sustainability metrics',
      icon: Recycle,
      color: '#3b82f6',
      path: '/admin/recycling'
    },
    {
      id: 'financial',
      title: 'Financial Summary',
      description: 'View billing data, payment trends, and revenue analytics',
      icon: DollarSign,
      color: '#f59e0b',
      path: '/admin/financial'
    },
    {
      id: 'environmental',
      title: 'Environmental Impact',
      description: 'Analyze carbon footprint, waste reduction, and environmental KPIs',
      icon: Leaf,
      color: '#10b981',
      path: '/admin/environmental'
    }
  ];

  const statistics = [
    {
      id: 'total-waste',
      label: 'Total Waste',
      value: '2,847 kg',
      change: '+12% from last month',
      icon: TrendingUp,
      iconColor: '#4CBB17'
    },
    {
      id: 'recycling-rate',
      label: 'Recycling Rate',
      value: '68%',
      change: '+6% improvement',
      icon: Recycle,
      iconColor: '#3b82f6'
    },
    {
      id: 'routes-active',
      label: 'Routes Active',
      value: '24',
      change: '2 optimized',
      icon: MapPin,
      iconColor: '#f59e0b'
    },
    {
      id: 'waste-zones',
      label: 'High Waste Zones',
      value: '7',
      change: 'Requires attention',
      icon: AlertCircle,
      iconColor: '#ef4444'
    }
  ];

  const recentRequests = [
    {
      id: 'SP-001',
      resident: 'John Smith',
      area: 'Downtown',
      date: '2024-01-15',
      status: 'pending',
      statusColor: '#fbbf24'
    },
    {
      id: 'SP-002',
      resident: 'Sarah Johnson',
      area: 'Residential North',
      date: '2024-01-16',
      status: 'approved',
      statusColor: '#4CBB17'
    }
  ];

  const handleLogout = () => logout();

  // ✅ Sidebar navigation click handling
  const handleNavClick = (navId) => {
    setActiveNav(navId);
    if (navId === 'bins') navigate('/admin/bins');
    else if (navId === 'analytics') navigate('/admin/analytics');
    else if (navId === 'reports') navigate('/admin/dashboard');
  };

  const handleWasteTypeChange = (type) => {
    setSelectedWasteTypes(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handleGenerateReport = () => {
    console.log('Generating report...', {
      reportType,
      area,
      dateRange,
      wasteTypes: selectedWasteTypes
    });
  };

  return (
    <DashboardLayout
      navItems={navItems}
      activeNav={activeNav}
      onNavClick={handleNavClick}
      logo="Admin"
      user={user}
      onLogout={handleLogout}
      pageTitle={activeNav === 'analytics' ? 'Analytics Dashboards' : 'Generate Reports'}
      pageSubtitle={activeNav === 'analytics'
        ? 'Access comprehensive analytics and reporting tools'
        : 'Create comprehensive reports and analyze waste management data'}
    >

      {/* ✅ ANALYTICS VIEW */}
      {activeNav === 'analytics' ? (
        <>
          <div className="mb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboards</h2>
                <p className="text-gray-600 mt-1">Select a dashboard to view detailed analytics and insights</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {analyticsDashboards.map((dashboard) => {
                const IconComponent = dashboard.icon;
                return (
                  <div
                    key={dashboard.id}
                    onClick={() => navigate(dashboard.path)}
                    className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-xl transition-all duration-200 border-2 border-transparent group"
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = dashboard.color}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110"
                        style={{ backgroundColor: `${dashboard.color}15` }}
                      >
                        <IconComponent className="w-6 h-6" style={{ color: dashboard.color }} />
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-all group-hover:translate-x-1" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-opacity-80">
                      {dashboard.title}
                    </h3>
                    <p className="text-sm text-gray-600">{dashboard.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Analytics Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statistics.map((stat) => {
              const IconComponent = stat.icon;
              return (
                <div key={stat.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                      <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                    </div>
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${stat.iconColor}15` }}
                    >
                      <IconComponent className="w-5 h-5" style={{ color: stat.iconColor }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        /* ✅ REPORT GENERATION VIEW */
        <>
          {/* Report Generation Form */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                  style={{ '--tw-ring-color': '#4CBB17' }}
                >
                  <option value="waste-trends">Waste Trends</option>
                  <option value="collection-routes">Collection Routes</option>
                  <option value="revenue-analysis">Revenue Analysis</option>
                  <option value="efficiency-report">Efficiency Report</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Area</label>
                <select
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                  style={{ '--tw-ring-color': '#4CBB17' }}
                >
                  <option value="all-areas">All Areas</option>
                  <option value="downtown">Downtown</option>
                  <option value="residential-north">Residential North</option>
                  <option value="residential-south">Residential South</option>
                  <option value="industrial">Industrial Zone</option>
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <input
                type="date"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                style={{ '--tw-ring-color': '#4CBB17' }}
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Waste Types</label>
              <div className="flex flex-wrap gap-4">
                {Object.keys(selectedWasteTypes).map((type) => (
                  <label key={type} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedWasteTypes[type]}
                      onChange={() => handleWasteTypeChange(type)}
                      className="h-4 w-4 rounded border-gray-300"
                      style={{ accentColor: '#4CBB17' }}
                    />
                    <span className="text-sm text-gray-700 capitalize">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerateReport}
              className="w-full text-white py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2"
              style={{ backgroundColor: '#4CBB17' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#3da612'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4CBB17'}
            >
              <BarChart3 className="w-5 h-5" />
              <span>Generate Report</span>
            </button>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {statistics.map((stat) => {
              const IconComponent = stat.icon;
              return (
                <div key={stat.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                      <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                    </div>
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${stat.iconColor}15` }}
                    >
                      <IconComponent className="w-5 h-5" style={{ color: stat.iconColor }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Waste Trends</h2>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <p className="text-gray-400">Chart visualization will be displayed here</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recycling Rates by Area</h2>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <p className="text-gray-400">Chart visualization will be displayed here</p>
              </div>
            </div>
          </div>

          {/* Recent Requests Table */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Requests</h2>
              <button
                onClick={() => navigate('/admin/bins')}
                className="text-sm font-medium transition-colors"
                style={{ color: '#4CBB17' }}
                onMouseEnter={(e) => e.target.style.color = '#3da612'}
                onMouseLeave={(e) => e.target.style.color = '#4CBB17'}
              >
                View All →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Request ID</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Resident</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Area</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRequests.map((request) => (
                    <tr key={request.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-900">#{request.id}</td>
                      <td className="py-3 px-4 text-sm text-gray-900">{request.resident}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{request.area}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{request.date}</td>
                      <td className="py-3 px-4">
                        <span
                          className="px-3 py-1 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: `${request.statusColor}20`,
                            color: request.statusColor
                          }}
                        >
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          className="px-3 py-1 text-white rounded text-xs font-medium mr-2 transition-colors"
                          style={{ backgroundColor: '#4CBB17' }}
                        >
                          Approve
                        </button>
                        <button className="px-3 py-1 bg-red-500 text-white rounded text-xs font-medium hover:bg-red-600 transition-colors">
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default AdminDashboard;
