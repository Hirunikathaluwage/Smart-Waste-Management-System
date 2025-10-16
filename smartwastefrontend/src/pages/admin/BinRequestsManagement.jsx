import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../components/dashboard/AdminDashboardLayout';
import { BarChart3, Package, Truck, Trash2, CheckSquare, LineChart, Check, X } from 'lucide-react';

const BinRequestsManagement = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeNav, setActiveNav] = useState('bins');
  const [activeTab, setActiveTab] = useState('special-pickup');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Sidebar nav items (same as AdminDashboard)
  const navItems = [
    { id: 'reports', label: 'Generate Reports', icon: BarChart3 },
    { id: 'pickups', label: 'Special Pickups', icon: Package },
    { id: 'routes', label: 'Route Changes', icon: Truck },
    { id: 'bins', label: 'Bin Requests', icon: Trash2 },
    { id: 'approvals', label: 'Approvals', icon: CheckSquare },
    { id: 'analytics', label: 'Analytics', icon: LineChart },
  ];

  const tabs = [
    { id: 'special-pickup', label: 'Special Pickup' },
    { id: 'route-changes', label: 'Route Changes' },
    { id: 'bin-bag-requests', label: 'Bin/Bag Requests' }
  ];

  const binRequests = [
    { id: 'SP001', name: 'John Smith', area: 'Downtown', date: '2024-01-15', type: 'Furniture', status: 'pending' },
    { id: 'SP002', name: 'Sarah Johnson', area: 'Northside', date: '2024-01-14', type: 'Electronics', status: 'approved' },
    { id: 'SP003', name: 'Mike Wilson', area: 'Eastside', date: '2024-01-13', type: 'Garden Waste', status: 'declined' },
    { id: 'SP004', name: 'Emily Davis', area: 'Westside', date: '2024-01-12', type: 'Furniture', status: 'pending' },
    { id: 'SP005', name: 'Robert Brown', area: 'Downtown', date: '2024-01-11', type: 'Electronics', status: 'approved' },
  ];

  const filteredRequests =
    statusFilter === 'all'
      ? binRequests
      : binRequests.filter((req) => req.status === statusFilter);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRequests = filteredRequests.slice(startIndex, endIndex);

  const getStatusStyle = (status) => {
    const styles = {
      pending: { bg: '#fbbf2420', color: '#fbbf24' },
      approved: { bg: '#4CBB1720', color: '#4CBB17' },
      declined: { bg: '#ef444420', color: '#ef4444' }
    };
    return styles[status] || styles.pending;
  };

  const handleLogout = () => logout();

  const handleNavClick = (navId) => {
    setActiveNav(navId);
    if (navId === 'reports') navigate('/admin/dashboard');
    else if (navId === 'bins') navigate('/admin/bins');
    else if (navId === 'analytics') navigate('/admin/analytics'); //  Go to analytics dashboard
  };

  const handleApprove = (id) => console.log('Approve request:', id);
  const handleDecline = (id) => console.log('Decline request:', id);

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
      {/* Centered content */}
      <div className="flex justify-center w-full">
        <div className="w-full max-w-6xl bg-white rounded-lg shadow-md mb-6">
          {/* Tabs */}
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
                  style={
                    activeTab === tab.id
                      ? { color: '#4CBB17', borderColor: '#4CBB17' }
                      : {}
                  }
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Filters + Table */}
          <div className="p-6">
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
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="py-3 px-4 font-semibold text-gray-700">ID</th>
                    <th className="py-3 px-4 font-semibold text-gray-700">Name</th>
                    <th className="py-3 px-4 font-semibold text-gray-700">Area</th>
                    <th className="py-3 px-4 font-semibold text-gray-700">Date</th>
                    <th className="py-3 px-4 font-semibold text-gray-700">Type</th>
                    <th className="py-3 px-4 font-semibold text-gray-700">Status</th>
                    <th className="py-3 px-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRequests.map((req) => {
                    const style = getStatusStyle(req.status);
                    return (
                      <tr key={req.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-900">#{req.id}</td>
                        <td className="py-3 px-4 text-gray-800">{req.name}</td>
                        <td className="py-3 px-4 text-gray-600">{req.area}</td>
                        <td className="py-3 px-4 text-gray-600">{req.date}</td>
                        <td className="py-3 px-4 text-gray-600">{req.type}</td>
                        <td className="py-3 px-4">
                          <span
                            className="px-3 py-1 rounded-full text-xs font-medium capitalize"
                            style={{ backgroundColor: style.bg, color: style.color }}
                          >
                            {req.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleApprove(req.id)}
                              className="p-1 rounded hover:bg-green-50"
                              style={{ color: '#4CBB17' }}
                              title="Approve"
                            >
                              <Check className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDecline(req.id)}
                              className="p-1 rounded text-red-500 hover:bg-red-50"
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
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${
                      currentPage === i + 1
                        ? 'text-white'
                        : 'text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                    style={currentPage === i + 1 ? { backgroundColor: '#4CBB17' } : {}}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BinRequestsManagement;
