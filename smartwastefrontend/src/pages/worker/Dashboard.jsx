import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../components/dashboard/WorkerDashboardLayout';
import DashboardCard from '../../components/dashboard/DashboardCard';
import ActionButton from '../../components/dashboard/ActionButton';
import ActivityItem from '../../components/dashboard/ActivityItem';
import CollectionPage from './CollectionPage';

// Simple icon components to avoid external dependencies - follows SRP for icon management
const Truck = () => <span className="text-lg">🚛</span>;
const Trash2 = () => <span className="text-lg">🗑️</span>;
const Package = () => <span className="text-lg">📦</span>;
const Clock = () => <span className="text-lg">🕐</span>;
const CheckSquare = () => <span className="text-lg">✅</span>;
const MapPin = () => <span className="text-lg">📍</span>;
const Scan = () => <span className="text-lg">📱</span>;

/**
 * WorkerDashboard Component
 * Follows Single Responsibility - only handles worker dashboard view
 * Follows DRY - uses shared components
 * Follows Open/Closed - easy to extend with new features
 */
const WorkerDashboard = () => {
  const { user, logout } = useAuth();
  const [activeNav, setActiveNav] = useState('routes');

  // Define navigation items for worker - follows OCP principle for easy extension
  const navItems = [
    { id: 'routes', label: 'My Routes', icon: Truck },
    { id: 'collection', label: 'Record Collection', icon: Scan },
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

  // Render different content based on active navigation - follows SRP principle
  const renderContent = () => {
    switch (activeNav) {
      case 'collection':
        return <CollectionPage />;
      case 'routes':
      case 'collections':
      case 'location':
      case 'report':
      case 'schedule':
      case 'completed':
      default:
        return (
          <>
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
                <ActionButton 
                  label="Start Collection" 
                  icon="▶️" 
                  colorScheme="blue" 
                  onClick={() => setActiveNav('collection')}
                />
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
          </>
        );
    }
  };

  return (
    <DashboardLayout
      navItems={navItems}
      activeNav={activeNav}
      onNavClick={setActiveNav}
      logo="Worker"
      user={user}
      onLogout={handleLogout}
      pageTitle={activeNav === 'collection' ? 'Waste Collection' : 'Worker Dashboard'}
      pageSubtitle={activeNav === 'collection' ? 'Record waste collection data' : 'Manage your routes and collections'}
    >
      {renderContent()}
    </DashboardLayout>
  );
};

export default WorkerDashboard;