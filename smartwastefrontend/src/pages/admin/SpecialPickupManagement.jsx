import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../components/dashboard/AdminDashboardLayout';
import { Check, X, BarChart3, Package, Truck, Trash2, CheckSquare, LineChart } from 'lucide-react';

const SpecialPickupManagement = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeNav, setActiveNav] = useState('pickups');

  const navItems = [
    { id: 'reports', label: 'Generate Reports', icon: BarChart3 },
    { id: 'pickups', label: 'Special Pickups', icon: Package },
    { id: 'routes', label: 'Route Changes', icon: Truck },
    { id: 'bins', label: 'Bin Requests', icon: Trash2 },
    { id: 'analytics', label: 'Analytics', icon: LineChart },
  ];

  const specialPickups = [
    { id: 'SP001', name: 'John Smith', area: 'Downtown', date: '2024-01-15', type: 'Furniture', status: 'pending' },
    { id: 'SP002', name: 'Sarah Johnson', area: 'Northside', date: '2024-01-14', type: 'Electronics', status: 'approved' },
    { id: 'SP003', name: 'Mike Wilson', area: 'Eastside', date: '2024-01-13', type: 'Garden Waste', status: 'declined' },
    { id: 'SP004', name: 'Emily Davis', area: 'Westside', date: '2024-01-12', type: 'Furniture', status: 'pending' },
    { id: 'SP005', name: 'Robert Brown', area: 'Downtown', date: '2024-01-11', type: 'Electronics', status: 'approved' },
    { id: 'SP006', name: 'Lisa Anderson', area: 'Southside', date: '2024-01-10', type: 'Appliances', status: 'pending' },
    { id: 'SP007', name: 'David Martinez', area: 'Downtown', date: '2024-01-09', type: 'Construction Debris', status: 'approved' },
    { id: 'SP008', name: 'Jessica Lee', area: 'Northside', date: '2024-01-08', type: 'Furniture', status: 'declined' },
  ];

  const filteredRequests =
    statusFilter === 'all'
      ? specialPickups
      : specialPickups.filter((req) => req.status === statusFilter);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRequests = filteredRequests.slice(startIndex, endIndex);

  const getStatusStyle = (status) => {
    const styles = {
      pending: { bg: '#fef3c7', color: '#d97706', text: 'Pending' },
      approved: { bg: '#d1fae5', color: '#059669', text: 'Approved' },
      declined: { bg: '#fee2e2', color: '#dc2626', text: 'Declined' }
    };
    return styles[status] || styles.pending;
  };

  const handleApprove = (id) => console.log('Approve request:', id);
  const handleDecline = (id) => console.log('Decline request:', id);

  const handleLogout = () => logout();

  // Sidebar navigation click handling - same as AdminDashboard
  const handleNavClick = (navId) => {
    setActiveNav(navId);
    if (navId === 'bins') navigate('/admin/bins');
    else if (navId === 'pickups') navigate('/admin/pickups');
    else if (navId === 'analytics') navigate('/admin/analytics');
    else if (navId === 'reports') navigate('/admin/dashboard');
  };

  return (
    <DashboardLayout
      navItems={navItems}
      activeNav={activeNav}
      onNavClick={handleNavClick}
      logo="Admin"
      user={user}
      onLogout={handleLogout}
      pageTitle="Special Pickup Requests"
      pageSubtitle="Manage special waste collection requests from residents"
    >
      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-sm">
        {/* Filter Section */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <label className="text-sm font-medium text-gray-700">
                Filter by Status:
              </label>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="declined">Declined</option>
              </select>
            </div>
            <div className="text-sm text-gray-600">
              {filteredRequests.length} requests found
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">ID</th>
                <th className="py-3 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                <th className="py-3 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Area</th>
                <th className="py-3 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date</th>
                <th className="py-3 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Type</th>
                <th className="py-3 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                <th className="py-3 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentRequests.map((req) => {
                const statusStyle = getStatusStyle(req.status);
                return (
                  <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6 text-sm font-medium text-gray-900">#{req.id}</td>
                    <td className="py-4 px-6 text-sm text-gray-900">{req.name}</td>
                    <td className="py-4 px-6 text-sm text-gray-700">{req.area}</td>
                    <td className="py-4 px-6 text-sm text-gray-700">{req.date}</td>
                    <td className="py-4 px-6 text-sm text-gray-700">{req.type}</td>
                    <td className="py-4 px-6">
                      <span
                        className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium"
                        style={{
                          backgroundColor: statusStyle.bg,
                          color: statusStyle.color
                        }}
                      >
                        {statusStyle.text}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleApprove(req.id)}
                          className="text-green-600 hover:text-green-700 transition-colors"
                          title="Approve"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDecline(req.id)}
                          className="text-red-600 hover:text-red-700 transition-colors"
                          title="Decline"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredRequests.length)} of {filteredRequests.length} results
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>

              <div className="flex items-center space-x-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 text-sm font-medium rounded transition-colors ${
                      currentPage === i + 1
                        ? 'bg-green-600 text-white'
                        : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SpecialPickupManagement;