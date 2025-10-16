import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../components/dashboard/AdminDashboardLayout';
import DashboardCard from '../../components/dashboard/DashboardCard';
import StatCard from '../../components/dashboard/StatCard';
import ActionButton from '../../components/dashboard/ActionButton';
import ActivityItem from '../../components/dashboard/ActivityItem';
import { BarChart3, Package, Truck, Trash2, CheckSquare, Users } from 'lucide-react';

const AdminDashboard = () => {
  const authContext = useAuth();
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('dashboard');

  useEffect(() => {
    console.log('=== AUTH CONTEXT DEBUG ===');
    console.log('Full auth context:', authContext);
    console.log('User:', authContext.user);
    console.log('Logout function:', authContext.logout);
    console.log('Logout type:', typeof authContext.logout);
  }, [authContext]);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'reports', label: 'Generate Reports', icon: BarChart3 },
    { id: 'pickups', label: 'Special Pickups', icon: Package },
    { id: 'routes', label: 'Route Changes', icon: Truck },
    { id: 'bins', label: 'Bin Requests', icon: Trash2 },
    { id: 'approvals', label: 'Approvals', icon: CheckSquare },
    { id: 'users', label: 'Manage Users', icon: Users },
  ];

  const handleLogout = () => {
    console.log('=== LOGOUT BUTTON CLICKED ===');
    console.log('About to call logout...');

    if (authContext && authContext.logout) {
      console.log('Calling authContext.logout()');
      authContext.logout();
      console.log('Logout called successfully');
    } else {
      console.error('ERROR: authContext or logout function is missing!');
    }
  };

  console.log('AdminDashboard rendering - passing onLogout:', handleLogout);

  return (
    <DashboardLayout
      navItems={navItems}
      activeNav={activeNav}
      onNavClick={setActiveNav}
      logo="Admin"
      user={authContext.user}
      onLogout={handleLogout}
      pageTitle="Admin Dashboard"
      pageSubtitle="System Analytics & Management"
    >
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Total Users"
          value="1,234"
          icon="👥"
          color="bg-blue-500"
          trend="+12%"
        />
        <StatCard
          title="Active Workers"
          value="45"
          icon="👷"
          color="bg-green-500"
          trend="+5%"
        />
        <StatCard
          title="Pending Requests"
          value="28"
          icon="📋"
          color="bg-yellow-500"
          trend="-3%"
        />
        <StatCard
          title="Collections Today"
          value="156"
          icon="🗑️"
          color="bg-purple-500"
          trend="+8%"
        />
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <DashboardCard
          title="Operations Management"
          description="Manage daily operations"
          icon="⚙️"
          color="bg-indigo-500"
        />
        <DashboardCard
          title="Review Requests"
          description="Handle user requests"
          icon="📝"
          color="bg-blue-500"
        />
        <DashboardCard
          title="Analytics & Reports"
          description="View system analytics"
          icon="📊"
          color="bg-emerald-500"
        />
      </div>

      {/* Recent Requests */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Requests</h2>
        <div className="space-y-3">
          <ActivityItem
            title="Special Pickup Request - Zone A"
            subtitle="Requested by: John Doe"
            status="pending"
          />
          <ActivityItem
            title="Bin Replacement - Zone B"
            subtitle="Requested by: Jane Smith"
            status="approved"
          />
          <ActivityItem
            title="Schedule Change Request"
            subtitle="Requested by: Mike Johnson"
            status="pending"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <ActionButton 
            label="Pickup Management" 
            icon="📦" 
            colorScheme="indigo" 
            onClick={() => navigate('/admin/pickup-management')}
          />
          <ActionButton label="Generate Report" icon="📈" colorScheme="indigo" />
          <ActionButton label="Manage Users" icon="👤" colorScheme="indigo" />
          <ActionButton label="View Analytics" icon="📊" colorScheme="indigo" />
        </div>
      </div>

      {/* System Overview */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">System Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Collection Efficiency</h3>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div className="bg-green-500 h-4 rounded-full" style={{ width: '85%' }}></div>
            </div>
            <p className="text-sm text-gray-600 mt-1">85% - Excellent</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">User Satisfaction</h3>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div className="bg-blue-500 h-4 rounded-full" style={{ width: '92%' }}></div>
            </div>
            <p className="text-sm text-gray-600 mt-1">92% - Very Good</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;