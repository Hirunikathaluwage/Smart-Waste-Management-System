import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../components/dashboard/ResidentDashboardLayout';
import DashboardCard from '../../components/dashboard/DashboardCard';
import ActionButton from '../../components/dashboard/ActionButton';
import ActivityItem from '../../components/dashboard/ActivityItem';
import { Calendar, Trash2, CreditCard, Award, MessageCircle } from 'lucide-react';

/**
 * ResidentDashboard Component
 * Follows Single Responsibility - only handles resident dashboard view
 * Follows DRY - uses shared components
 * Follows Open/Closed - easy to extend with new features
 */
const ResidentDashboard = () => {
  const { user, logout } = useAuth();
  const [activeNav, setActiveNav] = useState('schedule');

  // Define navigation items for resident
  const navItems = [
    { id: 'schedule', label: 'Collection Schedule', icon: Calendar },
    { id: 'pickup', label: 'Request Pickup', icon: Trash2 },
    { id: 'bins', label: 'My Bins', icon: Trash2 },
    { id: 'payments', label: 'Payment History', icon: CreditCard },
    { id: 'rewards', label: 'Eco Rewards', icon: Award },
    { id: 'support', label: 'Support', icon: MessageCircle },
  ];

  // Logout handler
  const handleLogout = () => {
    logout();
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
      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <DashboardCard
          title="Waste Account"
          description="Manage your waste collection account"
          icon="🗑️"
          color="bg-emerald-500"
        />
        <DashboardCard
          title="Request Pickup"
          description="Schedule a waste pickup"
          icon="📅"
          color="bg-blue-500"
        />
        <DashboardCard
          title="Payments"
          description="View and make payments"
          icon="💳"
          color="bg-purple-500"
        />
        <DashboardCard
          title="Rewards"
          description="Check your eco rewards"
          icon="🏆"
          color="bg-yellow-500"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ActionButton label="Schedule Pickup" icon="📞" colorScheme="emerald" />
          <ActionButton label="View History" icon="📊" colorScheme="emerald" />
          <ActionButton label="Contact Support" icon="💬" colorScheme="emerald" />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          <ActivityItem
            title="Pickup Completed"
            subtitle="Oct 14, 2024"
            status="success"
          />
          <ActivityItem
            title="Payment Processed"
            subtitle="Oct 12, 2024"
            status="success"
          />
          <ActivityItem
            title="Reward Earned: 50 Points"
            subtitle="Oct 10, 2024"
            status="info"
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ResidentDashboard;