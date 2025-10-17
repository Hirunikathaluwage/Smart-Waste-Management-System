import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../components/dashboard/AdminDashboardLayout';
import { BarChart3, Package, Truck, Trash2, CheckSquare, Recycle, TrendingUp, Leaf, Package2 } from 'lucide-react';

/**
 * RecyclingTrends Component
 * Follows Single Responsibility Principle - handles recycling analytics only
 * Follows Open/Closed Principle - easily extendable with new waste types
 */
const RecyclingTrends = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeNav, setActiveNav] = useState('reports');
  const [timeRange, setTimeRange] = useState('month');

  const navItems = [
    { id: 'reports', label: 'Generate Reports', icon: BarChart3 },
    { id: 'pickups', label: 'Special Pickups', icon: Package },
    { id: 'routes', label: 'Route Changes', icon: Truck },
    { id: 'bins', label: 'Bin Requests', icon: Trash2 },
    { id: 'approvals', label: 'Approvals', icon: CheckSquare },
  ];

  // Recycling Metrics
  const recyclingMetrics = [
    {
      id: 'overall-rate',
      label: 'Overall Recycling Rate',
      value: '68%',
      change: '+6%',
      icon: Recycle,
      color: '#4CBB17'
    },
    {
      id: 'total-recycled',
      label: 'Total Material Recycled',
      value: '1,847 kg',
      change: '+15%',
      icon: TrendingUp,
      color: '#3b82f6'
    },
    {
      id: 'contamination',
      label: 'Contamination Rate',
      value: '8.5%',
      change: '-2.3%',
      icon: Leaf,
      color: '#f59e0b'
    },
    {
      id: 'participation',
      label: 'Participation Rate',
      value: '76%',
      change: '+4%',
      icon: Package2,
      color: '#10b981'
    }
  ];

  // Waste Composition Data
  const wasteComposition = [
    { type: 'Paper & Cardboard', percentage: 32, weight: '912 kg', color: '#4CBB17' },
    { type: 'Plastics', percentage: 24, weight: '684 kg', color: '#3b82f6' },
    { type: 'Glass', percentage: 18, weight: '513 kg', color: '#f59e0b' },
    { type: 'Metals', percentage: 14, weight: '399 kg', color: '#10b981' },
    { type: 'Organic', percentage: 12, weight: '342 kg', color: '#8b5cf6' }
  ];

  // Area Recycling Rates
  const areaRecyclingRates = [
    { area: 'Downtown', rate: 72, trend: 'up', change: '+5%' },
    { area: 'North Residential', rate: 68, trend: 'up', change: '+3%' },
    { area: 'South Residential', rate: 65, trend: 'stable', change: '0%' },
    { area: 'Industrial Zone', rate: 58, trend: 'down', change: '-2%' },
    { area: 'West Zone', rate: 61, trend: 'up', change: '+4%' }
  ];

  const handleLogout = () => logout();

  const handleNavClick = (navId) => {
    setActiveNav(navId);
    if (navId === 'reports') navigate('/admin/dashboard');
    else if (navId === 'bins') navigate('/admin/bins');
  };

  return (
    <DashboardLayout
      navItems={navItems}
      activeNav={activeNav}
      onNavClick={handleNavClick}
      logo="Admin"
      user={user}
      onLogout={handleLogout}
      pageTitle="Recycling Trends"
      pageSubtitle="Track recycling rates, waste composition, and sustainability metrics"
    >
      {/* Time Range Filter */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Period</label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': '#4CBB17' }}
              onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px rgba(76, 187, 23, 0.5)'}
              onBlur={(e) => e.target.style.boxShadow = ''}
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Recycling Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {recyclingMetrics.map((metric) => {
          const IconComponent = metric.icon;
          return (
            <div key={metric.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-sm text-gray-600">{metric.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
                  <p className="text-xs text-green-600 mt-1">{metric.change} from last period</p>
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

      {/* Waste Composition */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Waste Composition Breakdown</h2>
        <div className="space-y-4">
          {wasteComposition.map((item, index) => (
            <div key={index}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">{item.type}</span>
                <div className="text-right">
                  <span className="text-sm font-semibold text-gray-900">{item.percentage}%</span>
                  <span className="text-xs text-gray-500 ml-2">({item.weight})</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="h-3 rounded-full transition-all duration-300"
                  style={{
                    width: `${item.percentage}%`,
                    backgroundColor: item.color
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Area Recycling Rates */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recycling Rates by Area</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Area</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Recycling Rate</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Trend</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Change</th>
              </tr>
            </thead>
            <tbody>
              {areaRecyclingRates.map((area, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-900">{area.area}</td>
                  <td className="py-3 px-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${area.rate}%`,
                            backgroundColor: '#4CBB17'
                          }}
                        />
                      </div>
                      <span className="text-gray-900 font-medium">{area.rate}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <span className={`${area.trend === 'up' ? 'text-green-600' : area.trend === 'down' ? 'text-red-600' : 'text-gray-600'}`}>
                      {area.trend === 'up' ? '↗' : area.trend === 'down' ? '↘' : '→'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{area.change}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RecyclingTrends;