import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../components/dashboard/AdminDashboardLayout';
import { BarChart3, Package, Truck, Trash2, CheckSquare, Leaf, Wind, Droplets, TreePine } from 'lucide-react';

/**
 * EnvironmentalImpact Component
 * Follows Single Responsibility Principle - handles environmental analytics only
 * Follows Open/Closed Principle - easily extendable with new environmental metrics
 */
const EnvironmentalImpact = () => {
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

  // Environmental Metrics
  const environmentalMetrics = [
    {
      id: 'carbon-saved',
      label: 'CO₂ Emissions Saved',
      value: '12.4 tons',
      change: '+18%',
      icon: Wind,
      color: '#4CBB17'
    },
    {
      id: 'waste-diverted',
      label: 'Waste Diverted from Landfill',
      value: '1,847 kg',
      change: '+15%',
      icon: Leaf,
      color: '#10b981'
    },
    {
      id: 'water-saved',
      label: 'Water Saved',
      value: '4,580 L',
      change: '+12%',
      icon: Droplets,
      color: '#3b82f6'
    },
    {
      id: 'trees-saved',
      label: 'Trees Equivalent Saved',
      value: '156',
      change: '+22%',
      icon: TreePine,
      color: '#10b981'
    }
  ];

  // Monthly Impact Trends
  const monthlyImpact = [
    { month: 'Jan', carbonSaved: 8.2, wasteRecycled: 1245, treesEquiv: 98 },
    { month: 'Feb', carbonSaved: 9.5, wasteRecycled: 1456, treesEquiv: 115 },
    { month: 'Mar', carbonSaved: 10.1, wasteRecycled: 1567, treesEquiv: 128 },
    { month: 'Apr', carbonSaved: 11.3, wasteRecycled: 1689, treesEquiv: 142 },
    { month: 'May', carbonSaved: 12.4, wasteRecycled: 1847, treesEquiv: 156 }
  ];

  // Sustainability Goals
  const sustainabilityGoals = [
    { goal: 'Carbon Neutrality by 2030', progress: 35, target: 100 },
    { goal: '80% Waste Diversion Rate', progress: 68, target: 80 },
    { goal: 'Zero Landfill Operations', progress: 45, target: 100 },
    { goal: 'Renewable Energy Usage', progress: 52, target: 100 }
  ];

  // Environmental Impact by Area
  const impactByArea = [
    { area: 'Downtown', carbonSaved: 3.2, recyclingRate: 72, wasteReduced: 485 },
    { area: 'North Residential', carbonSaved: 2.8, recyclingRate: 68, wasteReduced: 412 },
    { area: 'South Residential', carbonSaved: 2.5, recyclingRate: 65, wasteReduced: 389 },
    { area: 'Industrial Zone', carbonSaved: 2.1, recyclingRate: 58, wasteReduced: 324 },
    { area: 'West Zone', carbonSaved: 1.8, recyclingRate: 61, wasteReduced: 237 }
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
      pageTitle="Environmental Impact"
      pageSubtitle="Analyze carbon footprint, waste reduction, and environmental KPIs"
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

      {/* Environmental Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {environmentalMetrics.map((metric) => {
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

      {/* Sustainability Goals Progress */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Sustainability Goals Progress</h2>
        <div className="space-y-4">
          {sustainabilityGoals.map((item, index) => (
            <div key={index}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">{item.goal}</span>
                <span className="text-sm font-semibold text-gray-900">{item.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="h-3 rounded-full transition-all duration-300"
                  style={{
                    width: `${item.progress}%`,
                    backgroundColor: item.progress >= 70 ? '#4CBB17' : item.progress >= 50 ? '#f59e0b' : '#ef4444'
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Impact Trends */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Monthly Impact Trends</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Month</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">CO₂ Saved (tons)</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Waste Recycled (kg)</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Trees Equivalent</th>
              </tr>
            </thead>
            <tbody>
              {monthlyImpact.map((data, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-900">{data.month}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{data.carbonSaved}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{data.wasteRecycled}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{data.treesEquiv}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Environmental Impact by Area */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Environmental Impact by Area</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Area</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">CO₂ Saved (tons)</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Recycling Rate</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Waste Reduced (kg)</th>
              </tr>
            </thead>
            <tbody>
              {impactByArea.map((area, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-900">{area.area}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{area.carbonSaved}</td>
                  <td className="py-3 px-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[80px]">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${area.recyclingRate}%`,
                            backgroundColor: '#4CBB17'
                          }}
                        />
                      </div>
                      <span className="text-gray-900">{area.recyclingRate}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{area.wasteReduced}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EnvironmentalImpact;