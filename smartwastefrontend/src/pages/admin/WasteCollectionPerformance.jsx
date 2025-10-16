import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../components/dashboard/AdminDashboardLayout';
import {
  BarChart3, Package, Truck, Trash2, CheckSquare,
  TrendingUp, Clock, Users, MapPin, AlertCircle
} from 'lucide-react';

/**
 * WasteCollectionPerformance Component
 * Follows Single Responsibility Principle - handles collection performance analytics only
 * Follows DRY Principle - reuses DashboardLayout and common patterns
 */
const WasteCollectionPerformance = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeNav, setActiveNav] = useState('reports');
  const [timeRange, setTimeRange] = useState('week');
  const [selectedArea, setSelectedArea] = useState('all');

  // Navigation items
  const navItems = [
    { id: 'reports', label: 'Generate Reports', icon: BarChart3 },
    { id: 'pickups', label: 'Special Pickups', icon: Package },
    { id: 'routes', label: 'Route Changes', icon: Truck },
    { id: 'bins', label: 'Bin Requests', icon: Trash2 },
    { id: 'approvals', label: 'Approvals', icon: CheckSquare },
  ];

  // Performance Metrics - follows Data-Driven approach
  const performanceMetrics = [
    {
      id: 'completion-rate',
      label: 'Collection Completion Rate',
      value: '94.5%',
      change: '+2.3%',
      trend: 'up',
      icon: CheckSquare,
      color: '#4CBB17'
    },
    {
      id: 'avg-time',
      label: 'Average Collection Time',
      value: '18 min',
      change: '-3 min',
      trend: 'down',
      icon: Clock,
      color: '#3b82f6'
    },
    {
      id: 'worker-efficiency',
      label: 'Worker Efficiency',
      value: '87%',
      change: '+5%',
      trend: 'up',
      icon: Users,
      color: '#f59e0b'
    },
    {
      id: 'missed-collections',
      label: 'Missed Collections',
      value: '12',
      change: '-8',
      trend: 'down',
      icon: AlertCircle,
      color: '#ef4444'
    }
  ];

  // Route Performance Data
  const routePerformance = [
    { route: 'Route A - Downtown', collections: 145, efficiency: '96%', avgTime: '15 min', status: 'excellent' },
    { route: 'Route B - North Residential', collections: 203, efficiency: '92%', avgTime: '19 min', status: 'good' },
    { route: 'Route C - South Residential', collections: 178, efficiency: '88%', avgTime: '21 min', status: 'good' },
    { route: 'Route D - Industrial', collections: 89, efficiency: '85%', avgTime: '23 min', status: 'fair' },
    { route: 'Route E - West Zone', collections: 156, efficiency: '81%', avgTime: '25 min', status: 'needs-improvement' }
  ];

  // Worker Performance Data
  const workerPerformance = [
    { name: 'John Smith', collections: 234, efficiency: '95%', rating: 4.8 },
    { name: 'Sarah Johnson', collections: 228, efficiency: '94%', rating: 4.7 },
    { name: 'Mike Wilson', collections: 215, efficiency: '91%', rating: 4.5 },
    { name: 'Emily Davis', collections: 198, efficiency: '88%', rating: 4.3 },
    { name: 'Robert Brown', collections: 187, efficiency: '85%', rating: 4.1 }
  ];

  const handleLogout = () => {
    logout();
  };

  const handleNavClick = (navId) => {
    setActiveNav(navId);
    if (navId === 'reports') navigate('/admin/dashboard');
    else if (navId === 'bins') navigate('/admin/bins');
  };

  const getStatusColor = (status) => {
    const colors = {
      'excellent': '#4CBB17',
      'good': '#3b82f6',
      'fair': '#f59e0b',
      'needs-improvement': '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  return (
    <DashboardLayout
      navItems={navItems}
      activeNav={activeNav}
      onNavClick={handleNavClick}
      logo="Admin"
      user={user}
      onLogout={handleLogout}
      pageTitle="Waste Collection Performance"
      pageSubtitle="Monitor collection efficiency, worker performance, and route optimization"
    >
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Range</label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': '#4CBB17' }}
              onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px rgba(76, 187, 23, 0.5)'}
              onBlur={(e) => e.target.style.boxShadow = ''}
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Area</label>
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': '#4CBB17' }}
              onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px rgba(76, 187, 23, 0.5)'}
              onBlur={(e) => e.target.style.boxShadow = ''}
            >
              <option value="all">All Areas</option>
              <option value="downtown">Downtown</option>
              <option value="north">North Residential</option>
              <option value="south">South Residential</option>
              <option value="industrial">Industrial</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              className="w-full text-white py-2 rounded-lg font-medium transition-colors"
              style={{ backgroundColor: '#4CBB17' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#3da612'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4CBB17'}
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {performanceMetrics.map((metric) => {
          const IconComponent = metric.icon;
          return (
            <div key={metric.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-sm text-gray-600">{metric.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
                  <p className={`text-xs mt-1 ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {metric.change} from last period
                  </p>
                </div>
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${metric.color}15` }}
                >
                  <IconComponent className="w-5 h-5" style={{ color: metric.color }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Route Performance Table */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Route Performance</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Route</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Collections</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Efficiency</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Avg Time</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {routePerformance.map((route, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-900">{route.route}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{route.collections}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{route.efficiency}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{route.avgTime}</td>
                  <td className="py-3 px-4">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-medium capitalize"
                      style={{
                        backgroundColor: `${getStatusColor(route.status)}20`,
                        color: getStatusColor(route.status)
                      }}
                    >
                      {route.status.replace('-', ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Worker Performance Table */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Workers</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Worker Name</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Collections</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Efficiency</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Rating</th>
              </tr>
            </thead>
            <tbody>
              {workerPerformance.map((worker, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-900">{worker.name}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{worker.collections}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{worker.efficiency}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">⭐ {worker.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default WasteCollectionPerformance;