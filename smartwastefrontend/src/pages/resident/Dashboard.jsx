import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../components/dashboard/ResidentDashboardLayout';
import DashboardCard from '../../components/dashboard/DashboardCard';
import ActionButton from '../../components/dashboard/ActionButton';
import ActivityItem from '../../components/dashboard/ActivityItem';
import PickupRequestList from '../../components/pickup/PickupRequestList';
import pickupRequestService from '../../services/pickupRequestService';
import { Calendar, Trash2, CreditCard, Award, MessageCircle, Clock, CheckCircle, AlertCircle, MapPin } from 'lucide-react';

/**
 * ResidentDashboard Component
 * Follows Single Responsibility - only handles resident dashboard view
 * Follows DRY - uses shared components
 * Follows Open/Closed - easy to extend with new features
 */
const ResidentDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('overview');
  const [pickupRequests, setPickupRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    completedRequests: 0,
    totalSpent: 0
  });

  // Fetch pickup requests data
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.userId) return;
      
      try {
        setLoading(true);
        const requests = await pickupRequestService.getPickupRequestsByUserId(user.userId);
        setPickupRequests(requests);
        
        // Calculate statistics
        const totalRequests = requests.length;
        const pendingRequests = requests.filter(req => 
          ['DRAFT', 'PENDING', 'SCHEDULED', 'IN_PROGRESS'].includes(req.status)
        ).length;
        const completedRequests = requests.filter(req => req.status === 'COMPLETED').length;
        const totalSpent = requests
          .filter(req => req.paymentStatus === 'COMPLETED')
          .reduce((sum, req) => sum + (req.finalAmount || 0), 0);
        
        setStats({
          totalRequests,
          pendingRequests,
          completedRequests,
          totalSpent
        });
      } catch (error) {
        console.error('Error fetching pickup requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.userId]);

  // Define navigation items for resident
  const navItems = [
    { id: 'overview', label: 'Overview', icon: Calendar },
    { id: 'bin-status', label: 'Bin Status', icon: Trash2 },
    { id: 'requests', label: 'My Requests', icon: Trash2 },
    { id: 'schedule', label: 'Collection Schedule', icon: Calendar },
    { id: 'payments', label: 'Payment History', icon: CreditCard },
    { id: 'rewards', label: 'Eco Rewards', icon: Award },
    { id: 'support', label: 'Support', icon: MessageCircle },
  ];

  // Helper functions
  const getStatusIcon = (status) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'PENDING': case 'SCHEDULED': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'IN_PROGRESS': return <AlertCircle className="w-4 h-4 text-blue-500" />;
      case 'CANCELLED': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED': return 'text-green-600 bg-green-100';
      case 'PENDING': case 'SCHEDULED': return 'text-yellow-600 bg-yellow-100';
      case 'IN_PROGRESS': return 'text-blue-600 bg-blue-100';
      case 'CANCELLED': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Logout handler
  const handleLogout = () => {
    logout();
  };

  // Render content based on active navigation
  const renderContent = () => {
    switch (activeNav) {
      case 'overview':
        return (
          <>
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <DashboardCard
                dashboard={{
                  title: "Total Requests",
                  description: `${stats.totalRequests} pickup requests`,
                  icon: "📋",
                  color: "bg-blue-500",
                  path: "/resident/requests"
                }}
                onNavigate={() => setActiveNav('requests')}
              />
              <DashboardCard
                dashboard={{
                  title: "Pending Requests",
                  description: `${stats.pendingRequests} awaiting action`,
                  icon: "⏳",
                  color: "bg-yellow-500",
                  path: "/resident/requests"
                }}
                onNavigate={() => setActiveNav('requests')}
              />
              <DashboardCard
                dashboard={{
                  title: "Completed",
                  description: `${stats.completedRequests} successful pickups`,
                  icon: "✅",
                  color: "bg-green-500",
                  path: "/resident/requests"
                }}
                onNavigate={() => setActiveNav('requests')}
              />
              <DashboardCard
                dashboard={{
                  title: "Total Spent",
                  description: `$${stats.totalSpent.toFixed(2)} on services`,
                  icon: "💳",
                  color: "bg-purple-500",
                  path: "/resident/payments"
                }}
                onNavigate={() => setActiveNav('payments')}
              />
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ActionButton 
                  label="Request Pickup" 
                  icon="📞" 
                  colorScheme="emerald" 
                  onClick={() => navigate('/pickup-request')}
                />
                <ActionButton 
                  label="View All Requests" 
                  icon="📊" 
                  colorScheme="emerald"
                  onClick={() => setActiveNav('requests')}
                />
                <ActionButton 
                  label="Contact Support" 
                  icon="💬" 
                  colorScheme="emerald"
                  onClick={() => setActiveNav('support')}
                />
              </div>
            </div>

            {/* Recent Requests */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Recent Requests</h2>
                <button 
                  onClick={() => setActiveNav('requests')}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View All
                </button>
              </div>
              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : pickupRequests.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Trash2 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No pickup requests yet</p>
                  <button 
                    onClick={() => navigate('/pickup-request')}
                    className="mt-2 text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Create your first request
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {pickupRequests.slice(0, 5).map((request) => (
                    <div key={request.requestId} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(request.status)}
                        <div>
                          <p className="font-medium text-gray-900">
                            Request #{request.requestId.slice(0, 8)}
                          </p>
                          <p className="text-sm text-gray-600">
                            {request.wasteType} • {request.pickupType}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                        <p className="text-sm text-gray-500 mt-1">
                          {formatDate(request.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        );

      case 'bin-status':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Bin Status & IoT Sensors</h2>
            <div className="text-center py-12 text-gray-500">
              <Trash2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">Real-time Bin Monitoring</p>
              <p>View real-time IoT sensor data for your waste bins</p>
              <button 
                onClick={() => navigate('/resident/bin-status')}
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                View Bin Status
              </button>
            </div>
          </div>
        );

      case 'requests':
        return (
          <PickupRequestList 
            userId={user?.userId} 
            isAdmin={false}
          />
        );

      case 'schedule':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Collection Schedule</h2>
            <div className="text-center py-12 text-gray-500">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">Collection Schedule</p>
              <p>View your upcoming waste collection dates and times</p>
              <div className="mt-6 space-y-2">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Regular Collection</span>
                  <span className="text-sm text-gray-600">Every Tuesday & Friday</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Next Collection</span>
                  <span className="text-sm text-gray-600">Tuesday, Oct 22, 2024</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'payments':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment History</h2>
            <div className="text-center py-12 text-gray-500">
              <CreditCard className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">Payment History</p>
              <p>View your payment transactions and billing history</p>
              <div className="mt-6 space-y-2">
                {pickupRequests
                  .filter(req => req.paymentStatus === 'COMPLETED')
                  .slice(0, 5)
                  .map((request) => (
                    <div key={request.requestId} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <span className="font-medium">Request #{request.requestId.slice(0, 8)}</span>
                        <p className="text-sm text-gray-600">{formatDate(request.createdAt)}</p>
                      </div>
                      <span className="font-semibold text-green-600">${request.finalAmount?.toFixed(2)}</span>
                    </div>
                  ))}
                {pickupRequests.filter(req => req.paymentStatus === 'COMPLETED').length === 0 && (
                  <p className="text-gray-500">No payment history available</p>
                )}
              </div>
            </div>
          </div>
        );

      case 'rewards':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Eco Rewards</h2>
            <div className="text-center py-12 text-gray-500">
              <Award className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">Eco Rewards Program</p>
              <p>Earn points for sustainable waste management practices</p>
              <div className="mt-6 space-y-2">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Current Points</span>
                  <span className="text-lg font-semibold text-green-600">250 points</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Points Earned This Month</span>
                  <span className="text-sm text-gray-600">50 points</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'support':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Support</h2>
            <div className="text-center py-12 text-gray-500">
              <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">Need Help?</p>
              <p>Contact our support team for assistance</p>
              <div className="mt-6 space-y-4">
                <ActionButton 
                  label="Email Support" 
                  icon="📧" 
                  colorScheme="emerald"
                  onClick={() => window.open('mailto:support@smartwaste.com')}
                />
                <ActionButton 
                  label="Call Support" 
                  icon="📞" 
                  colorScheme="emerald"
                  onClick={() => window.open('tel:+1234567890')}
                />
                <ActionButton 
                  label="Live Chat" 
                  icon="💬" 
                  colorScheme="emerald"
                  onClick={() => alert('Live chat feature coming soon!')}
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <DashboardLayout
      navItems={navItems}
      activeNav={activeNav}
      onNavClick={setActiveNav}
      logo="Resident"
      user={user}
      onLogout={handleLogout}
      pageTitle="Resident Dashboard"
      pageSubtitle="Manage your waste collection and account"
    >
      {renderContent()}
    </DashboardLayout>
  );
};

export default ResidentDashboard;