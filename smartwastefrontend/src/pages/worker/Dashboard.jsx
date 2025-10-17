import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../components/dashboard/WorkerDashboardLayout';
import DashboardCard from '../../components/dashboard/DashboardCard';
import ActionButton from '../../components/dashboard/ActionButton';
import ActivityItem from '../../components/dashboard/ActivityItem';
import CollectionPage from './CollectionPage';
import PickupRoutesPage from './PickupRoutesPage';
import api from '../../services/api';

// Icon components using emojis
const Truck = () => <span className="text-lg">🚛</span>;
const Trash2 = () => <span className="text-lg">🗑️</span>;
const Package = () => <span className="text-lg">📦</span>;
const Clock = () => <span className="text-lg">🕐</span>;
const CheckSquare = () => <span className="text-lg">✅</span>;
const MapPin = () => <span className="text-lg">📍</span>;
const Scan = () => <span className="text-lg">📱</span>;

/**
 * WorkerDashboard Component
 * Streamlined navigation with clear separation of concerns
 */
const WorkerDashboard = () => {
  const { user, logout } = useAuth();
  const [activeNav, setActiveNav] = useState('dashboard');
  const [activitySummary, setActivitySummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Simplified navigation items - only includes items with dedicated functionality
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Package },
    { id: 'routes', label: 'Pickup Routes', icon: Truck },
    { id: 'collection', label: 'Record Collection', icon: Scan },
    { id: 'schedule', label: 'Work Schedule', icon: Clock },
    { id: 'completed', label: 'Completed Tasks', icon: CheckSquare },
  ];

  const handleLogout = () => {
    logout();
  };

  // Fetch activity summary data from API
  useEffect(() => {
    const fetchActivitySummary = async () => {
      try {
        setLoading(true);
        const response = await api.get('/bins/activity-summary');
        setActivitySummary(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching activity summary:', err);
        setError('Failed to load activity summary');
        // Set fallback data
        setActivitySummary({
          "Downtown Area - Zone A": {
            totalBins: 0,
            activeBins: 0,
            collectedBins: 0,
            damagedBins: 0,
            status: "NO_DATA",
            scheduledPickups: 0
          },
          "Residential Area - Zone B": {
            totalBins: 0,
            activeBins: 0,
            collectedBins: 0,
            damagedBins: 0,
            status: "NO_DATA",
            scheduledPickups: 0
          },
          "Business District - Zone C": {
            totalBins: 0,
            activeBins: 0,
            collectedBins: 0,
            damagedBins: 0,
            status: "NO_DATA",
            scheduledPickups: 0
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchActivitySummary();
  }, []);

  // Dashboard Overview Component
  const DashboardOverview = () => (
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


      {/* Today's Activity Summary */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Today's Activity Summary</h2>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <span className="ml-2 text-gray-600">Loading activity summary...</span>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-600">
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {Object.entries(activitySummary).map(([zoneName, zoneData]) => {
              const statusMapping = {
                'PENDING': 'pending',
                'IN_PROGRESS': 'in_progress', 
                'COMPLETED': 'completed',
                'NO_DATA': 'pending'
              };
              
              return (
                <ActivityItem
                  key={zoneName}
                  title={zoneName}
                  subtitle={`${zoneData.scheduledPickups} scheduled pickups (${zoneData.totalBins} total bins)`}
                  status={statusMapping[zoneData.status] || 'pending'}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Reports */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Reports</h2>
        <div className="space-y-3">
          <ActivityItem
            title="Damaged bin reported at Location A"
            subtitle="Oct 17, 2025"
            status="pending"
          />
          <ActivityItem
            title="Overflow bin at Location B"
            subtitle="Oct 16, 2025"
            status="resolved"
          />
          <ActivityItem
            title="Maintenance required at Zone C"
            subtitle="Oct 15, 2025"
            status="in_progress"
          />
          <ActivityItem
            title="Collection delay reported"
            subtitle="Oct 14, 2025"
            status="resolved"
          />
        </div>
      </div>
    </>
  );

  // Work Schedule Component
  const WorkSchedule = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Weekly Work Schedule</h2>
      <div className="space-y-3">
        <ActivityItem
          title="Sunday - Zone G"
          subtitle="7:00 AM - 3:00 PM"
          status="in_progress"
        />
        <ActivityItem
          title="Monday - Zone A & B"
          subtitle="7:00 AM - 3:00 PM"
          status="completed"
        />
        <ActivityItem
          title="Tuesday - Zone C"
          subtitle="7:00 AM - 3:00 PM"
          status="pending"
        />
        <ActivityItem
          title="Wednesday - Zone D & E"
          subtitle="7:00 AM - 3:00 PM"
          status="pending"
        />
        <ActivityItem
          title="Thursday - Zone F"
          subtitle="7:00 AM - 3:00 PM"
          status="pending"
        />
        <ActivityItem
          title="Friday - Zone A"
          subtitle="7:00 AM - 3:00 PM"
          status="pending"
        />
      </div>
    </div>
  );

  // Completed Tasks Component
  const CompletedTasks = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Completed Tasks This Week</h2>
      <div className="space-y-3">
        <ActivityItem
          title="Zone A Collection Route"
          subtitle="Monday - 45 pickups completed"
          status="completed"
        />
        <ActivityItem
          title="Zone B Collection Route"
          subtitle="Monday - 38 pickups completed"
          status="completed"
        />
        <ActivityItem
          title="Bin Replacement - Location X"
          subtitle="Tuesday - Damaged bin replaced"
          status="completed"
        />
        <ActivityItem
          title="Zone C Collection Route"
          subtitle="Tuesday - 52 pickups completed"
          status="completed"
        />
      </div>
    </div>
  );

  // Content renderer with clear separation
  const renderContent = () => {
    switch (activeNav) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'routes':
        return <PickupRoutesPage />;
      case "collection":
        return <CollectionPage />;
      case 'schedule':
        return <WorkSchedule />;
      case 'completed':
        return <CompletedTasks />;
      default:
        return <DashboardOverview />;
    }
  };

  // Dynamic page titles
  const getPageTitle = () => {
    const titles = {
      dashboard: 'Worker Dashboard',
      routes: 'Pickup Routes',
      collection: 'Record Collection',
      schedule: 'Work Schedule',
      completed: 'Completed Tasks'
    };
    return titles[activeNav] || 'Worker Dashboard';
  };

  const getPageSubtitle = () => {
    const subtitles = {
      dashboard: 'Overview of your daily activities',
      routes: 'View and manage your assigned routes',
      collection: 'Record waste collection data',
      schedule: 'Your weekly work schedule',
      completed: 'Review completed tasks'
    };
    return subtitles[activeNav] || 'Manage your routes and collections';
  };

  return (
    <DashboardLayout
      navItems={navItems}
      activeNav={activeNav}
      onNavClick={setActiveNav}
      logo="Worker"
      user={user}
      onLogout={handleLogout}
      pageTitle={getPageTitle()}
      pageSubtitle={getPageSubtitle()}
    >
      {renderContent()}
    </DashboardLayout>
  );
};

export default WorkerDashboard;
