import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../components/dashboard/WorkerDashboardLayout';
import DashboardCard from '../../components/dashboard/DashboardCard';
import ActionButton from '../../components/dashboard/ActionButton';
import ActivityItem from '../../components/dashboard/ActivityItem';
import { Truck, Trash2, Package, Clock, CheckSquare, MapPin } from 'lucide-react';

/**
 * WorkerDashboard Component
 * Follows Single Responsibility - only handles worker dashboard view
 * Follows DRY - uses shared components
 * Follows Open/Closed - easy to extend with new features
 */
const WorkerDashboard = () => {
  const { user, logout } = useAuth();
  const [activeNav, setActiveNav] = useState('routes');

  // Define navigation items for worker
  const navItems = [
    { id: 'routes', label: 'My Routes', icon: Truck },
    { id: 'collections', label: "Today's Collections", icon: Trash2 },
    { id: 'location', label: 'Current Location', icon: MapPin },
    { id: 'report', label: 'Report Issue', icon: Package },
    { id: 'schedule', label: 'Work Schedule', icon: Clock },
    { id: 'completed', label: 'Completed Tasks', icon: CheckSquare },
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
      logo="Worker"
      user={user}
      onLogout={handleLogout}
      pageTitle="Worker Dashboard"
      pageSubtitle="Manage your routes and collections"
    >
      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <DashboardCard
          title="Collection Routes"
          description="View assigned routes"
          icon="🗺️"
          color="bg-blue-500"
        />
        <DashboardCard
          title="Record Collection"
          description="Log waste collection data"
          icon="✅"
          color="bg-green-500"
        />
        <DashboardCard
          title="Bin Management"
          description="Handle bin operations"
          icon="🗑️"
          color="bg-purple-500"
        />
        <DashboardCard
          title="Report Issues"
          description="Submit field reports"
          icon="⚠️"
          color="bg-orange-500"
        />
      </div>

      {/* Today's Routes */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Today's Collection Routes</h2>
        <div className="space-y-3">
          <ActivityItem
            title="Downtown Area - Zone A"
            subtitle="15 scheduled pickups"
            status="pending"
          />
          <ActivityItem
            title="Residential Area - Zone B"
            subtitle="22 scheduled pickups"
            status="in_progress"
          />
          <ActivityItem
            title="Business District - Zone C"
            subtitle="8 scheduled pickups"
            status="completed"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ActionButton label="Start Collection" icon="▶️" colorScheme="blue" />
          <ActionButton label="Report Issue" icon="📝" colorScheme="blue" />
          <ActionButton label="View Schedule" icon="📅" colorScheme="blue" />
        </div>
      </div>

      {/* Recent Reports */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Reports</h2>
        <div className="space-y-3">
          <ActivityItem
            title="Damaged bin reported at Location A"
            subtitle="Oct 14, 2024"
            status="pending"
          />
          <ActivityItem
            title="Overflow bin at Location B"
            subtitle="Oct 13, 2024"
            status="resolved"
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default WorkerDashboard;