import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../components/dashboard/AdminDashboardLayout';
import { BarChart3, Package, Truck, Trash2, CheckSquare, DollarSign, TrendingUp, CreditCard, Receipt } from 'lucide-react';

/**
 * FinancialSummary Component
 * Follows Single Responsibility Principle - handles financial analytics only
 * Follows Dependency Inversion - depends on DashboardLayout abstraction
 */
const FinancialSummary = () => {
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

  // Financial Metrics
  const financialMetrics = [
    {
      id: 'total-revenue',
      label: 'Total Revenue',
      value: '$45,280',
      change: '+12.5%',
      icon: DollarSign,
      color: '#4CBB17'
    },
    {
      id: 'pending-payments',
      label: 'Pending Payments',
      value: '$8,450',
      change: '-3.2%',
      icon: CreditCard,
      color: '#f59e0b'
    },
    {
      id: 'collection-costs',
      label: 'Collection Costs',
      value: '$28,900',
      change: '+2.1%',
      icon: Receipt,
      color: '#ef4444'
    },
    {
      id: 'net-profit',
      label: 'Net Profit',
      value: '$16,380',
      change: '+8.7%',
      icon: TrendingUp,
      color: '#3b82f6'
    }
  ];

  // Revenue by Area
  const revenueByArea = [
    { area: 'Downtown', revenue: 12450, percentage: 27.5, accounts: 324 },
    { area: 'North Residential', revenue: 10890, percentage: 24.0, accounts: 512 },
    { area: 'South Residential', revenue: 9870, percentage: 21.8, accounts: 468 },
    { area: 'Industrial Zone', revenue: 8120, percentage: 17.9, accounts: 89 },
    { area: 'West Zone', revenue: 3950, percentage: 8.8, accounts: 187 }
  ];

  // Recent Transactions
  const recentTransactions = [
    { id: 'TXN-1001', customer: 'ABC Corporation', amount: 450, type: 'Collection Fee', status: 'paid', date: '2024-01-15' },
    { id: 'TXN-1002', customer: 'John Smith', amount: 85, type: 'Monthly Bill', status: 'paid', date: '2024-01-15' },
    { id: 'TXN-1003', customer: 'Sarah Johnson', amount: 125, type: 'Special Pickup', status: 'pending', date: '2024-01-14' },
    { id: 'TXN-1004', customer: 'Green Markets', amount: 380, type: 'Collection Fee', status: 'paid', date: '2024-01-14' },
    { id: 'TXN-1005', customer: 'Mike Wilson', amount: 95, type: 'Monthly Bill', status: 'overdue', date: '2024-01-13' }
  ];

  const handleLogout = () => logout();

  const handleNavClick = (navId) => {
    setActiveNav(navId);
    if (navId === 'reports') navigate('/admin/dashboard');
    else if (navId === 'bins') navigate('/admin/bins');
  };

  const getStatusColor = (status) => {
    const colors = {
      'paid': '#4CBB17',
      'pending': '#f59e0b',
      'overdue': '#ef4444'
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
      pageTitle="Financial Summary"
      pageSubtitle="View billing data, payment trends, and revenue analytics"
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
          <div className="flex items-end">
            <button
              className="w-full text-white py-2 rounded-lg font-medium transition-colors"
              style={{ backgroundColor: '#4CBB17' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#3da612'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4CBB17'}
            >
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {financialMetrics.map((metric) => {
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

                  {/* Revenue by Area */}
                  <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Area</h2>
                    <div className="space-y-4">
                      {revenueByArea.map((item, index) => (
                        <div key={index}>
                          <div className="flex justify-between items-center mb-2">
                            <div>
                              <span className="text-sm font-medium text-gray-700">{item.area}</span>
                              <span className="text-xs text-gray-500 ml-2">({item.accounts} accounts)</span>
                            </div>
                            <div className="text-right">
                              <span className="text-sm font-semibold text-gray-900">${item.revenue.toLocaleString()}</span>
                              <span className="text-xs text-gray-500 ml-2">({item.percentage}%)</span>
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                              className="h-3 rounded-full transition-all duration-300"
                              style={{
                                width: `${item.percentage}%`,
                                backgroundColor: '#4CBB17'
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Transactions */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h2>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200 bg-gray-50">
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Transaction ID</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Customer</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Amount</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Type</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentTransactions.map((transaction, index) => (
                            <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="py-3 px-4 text-sm text-gray-900">{transaction.id}</td>
                              <td className="py-3 px-4 text-sm text-gray-900">{transaction.customer}</td>
                              <td className="py-3 px-4 text-sm font-semibold text-gray-900">${transaction.amount}</td>
                              <td className="py-3 px-4 text-sm text-gray-600">{transaction.type}</td>
                              <td className="py-3 px-4 text-sm text-gray-600">{transaction.date}</td>
                              <td className="py-3 px-4">
                                <span
                                  className="px-3 py-1 rounded-full text-xs font-medium capitalize"
                                  style={{
                                    backgroundColor: `${getStatusColor(transaction.status)}20`,
                                    color: getStatusColor(transaction.status)
                                  }}
                                >
                                  {transaction.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </DashboardLayout>
              );
            };

            export default FinancialSummary;