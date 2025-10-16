import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../components/dashboard/AdminDashboardLayout';
import { BarChart3, Package, Truck, Trash2, CheckSquare, Users, Check, X } from 'lucide-react';

/**
 * BinRequestsManagement Component
 * Follows Single Responsibility Principle - manages bin requests only
 * Follows Open/Closed Principle - easily extendable with new request types
 */
const BinRequestsManagement = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeNav, setActiveNav] = useState('bins');
  const [activeTab, setActiveTab] = useState('special-pickup');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Navigation items
  const navItems = [
    { id: 'reports', label: 'Generate Reports', icon: BarChart3 },
    { id: 'pickups', label: 'Special Pickups', icon: Package },
    { id: 'routes', label: 'Route Changes', icon: Truck },
    { id: 'bins', label: 'Bin Requests', icon: Trash2 },
    { id: 'approvals', label: 'Approvals', icon: CheckSquare },
    { id: 'users', label: 'Manage Users', icon: Users },
  ];

  // Tab configuration
  const tabs = [
    { id: 'special-pickup', label: 'Special Pickup' },
    { id: 'route-changes', label: 'Route Changes' },
    { id: 'bin-bag-requests', label: 'Bin/Bag Requests' }
  ];

  // Mock data for bin requests
  const binRequests = [
    {
      id: 'SP001',
      name: 'John Smith',
      area: 'Downtown',
      date: '2024-01-15',
      type: 'Furniture',
      status: 'pending'
    },
    {
      id: 'SP002',
      name: 'Sarah Johnson',
      area: 'Northside',
      date: '2024-01-14',
      type: 'Electronics',
      status: 'approved'
    },
    {
      id: 'SP003',
      name: 'Mike Wilson',
      area: 'Eastside',
      date: '2024-01-13',
      type: 'Garden Waste',
      status: 'declined'
    },
    {
      id: 'SP004',
      name: 'Emily Davis',
      area: 'Westside',
      date: '2024-01-12',
      type: 'Furniture',
      status: 'pending'
    },
    {
      id: 'SP005',
      name: 'Robert Brown',
      area: 'Downtown',
      date: '2024-01-11',
      type: 'Electronics',
      status: 'approved'
    },
  ];

  // Filter requests based on status
  const filteredRequests = statusFilter === 'all'
    ? binRequests
    : binRequests.filter(req => req.status === statusFilter);

  // Pagination
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRequests = filteredRequests.slice(startIndex, endIndex);

  // Status badge configuration
  const getStatusStyle = (status) => {
    const styles = {
      pending: { bg: '#fbbf2420', color: '#fbbf24' },
      approved: { bg: '#4CBB1720', color: '#4CBB17' },
      declined: { bg: '#ef444420', color: '#ef4444' }
    };
    return styles[status] || styles.pending;
  };

  const handleLogout = () => {
    logout();
  };

  const handleNavClick = (navId) => {
    setActiveNav(navId);

    // Navigate to different pages based on nav item
    if (navId === 'reports') {
      navigate('/admin/dashboard');
    } else if (navId === 'bins') {
      navigate('/admin/bins');
    } else if (navId === 'pickups') {
      // navigate('/admin/pickups');
    } else if (navId === 'routes') {
      // navigate('/admin/routes');
    } else if (navId === 'approvals') {
      // navigate('/admin/approvals');
    } else if (navId === 'users') {
      // navigate('/admin/users');
    }
  };

  const handleApprove = (id) => {
    console.log('Approve request:', id);
    // Approval logic here
  };

  const handleDecline = (id) => {
    console.log('Decline request:', id);
    // Decline logic here
  };

  return (
    <DashboardLayout
      navItems={navItems}
      activeNav={activeNav}
      onNavClick={handleNavClick}
      logo="Admin"
      user={user}
      onLogout={handleLogout}
      pageTitle="Requests Management"
      pageSubtitle="Manage all incoming requests across different categories"
    >
      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="border-b border-gray-200">
          <div className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 font-medium text-sm transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-current'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                style={activeTab === tab.id ? { color: '#4CBB17', borderColor: '#4CBB17' } : {}}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filter and Table Container */}
        <div className="p-6">
          {/* Filter by Status */}
          <div className="flex items-center space-x-3 mb-6">
            <label className="text-sm font-medium text-gray-700">
              Filter by Status:
            </label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 text-sm"
              style={{ '--tw-ring-color': '#4CBB17' }}
              onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px rgba(76, 187, 23, 0.5)'}
              onBlur={(e) => e.target.style.boxShadow = ''}
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="declined">Declined</option>
            </select>

            <div className="ml-auto text-sm text-gray-600">
              {filteredRequests.length} requests found
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">ID</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Name</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Area</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Type</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentRequests.map((request) => {
                  const statusStyle = getStatusStyle(request.status);
                  return (
                    <tr key={request.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">#{request.id}</td>
                      <td className="py-3 px-4 text-sm text-gray-900">{request.name}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{request.area}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{request.date}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{request.type}</td>
                      <td className="py-3 px-4">
                        <span
                          className="px-3 py-1 rounded-full text-xs font-medium capitalize"
                          style={{
                            backgroundColor: statusStyle.bg,
                            color: statusStyle.color
                          }}
                        >
                          {request.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleApprove(request.id)}
                            className="p-1 rounded hover:bg-green-50 transition-colors"
                            style={{ color: '#4CBB17' }}
                            title="Approve"
                          >
                            <Check className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDecline(request.id)}
                            className="p-1 rounded hover:bg-red-50 transition-colors text-red-500"
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
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredRequests.length)} of {filteredRequests.length} results
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>

              {[...Array(totalPages)].map((_, index) => {
                const pageNum = index + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === pageNum
                        ? 'text-white'
                        : 'text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                    style={currentPage === pageNum ? { backgroundColor: '#4CBB17' } : {}}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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

export default BinRequestsManagement;