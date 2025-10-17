import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import WorkerDashboardLayout from '../../components/dashboard/WorkerDashboardLayout';
import { 
  Trash2, 
  Package, 
  MapPin, 
  Clock, 
  User, 
  Phone, 
  Mail,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Eye,
  Truck,
  Calendar,
  CreditCard,
  Download,
  Navigation,
  CheckSquare,
  XCircle
} from 'lucide-react';

/**
 * Worker Bin/Bag Requests Management Page
 * Shows bin and bag requests that workers need to handle
 */
const BinBagRequestsPage = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'assigned', 'completed'
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'PENDING', 'CONFIRMED', 'DELIVERED'

  // Fetch bin/bag requests from database
  useEffect(() => {
    const fetchWorkerRequests = async () => {
      try {
        console.log('Fetching worker bin/bag requests from database...');
        const response = await fetch('http://localhost:8080/api/bin-requests/worker');
        
        if (response.ok) {
          const data = await response.json();
          console.log('✅ Fetched worker requests from database:', data);
          setRequests(data);
        } else {
          console.warn('⚠️ Failed to fetch from database, using mock data');
          // Fallback to mock data if database is not available
          const mockRequests = [
            {
              id: 'REQ001',
              requestId: 'bin_request_1703001234567',
              requestType: 'BIN',
              itemType: 'General',
              quantity: 2,
              deliveryAddress: '123 Main St, Springfield, IL 62701',
              specialInstructions: 'Leave by front door',
              totalAmount: 50.00,
              status: 'CONFIRMED',
              createdAt: '2024-01-15T10:30:00Z',
              estimatedDelivery: '2024-01-16T09:00:00Z',
              customerName: 'John Smith',
              customerPhone: '+1-555-0123',
              customerEmail: 'john.smith@email.com',
              assignedWorker: 'worker-001',
              priority: 'HIGH',
              zone: 'Zone A'
            },
            {
              id: 'REQ002',
              requestId: 'bag_request_1703001234568',
              requestType: 'BAG',
              itemType: 'Biodegradable',
              quantity: 5,
              deliveryAddress: '456 Oak Ave, Springfield, IL 62702',
              specialInstructions: 'Ring doorbell twice',
              totalAmount: 25.00,
              status: 'PENDING',
              createdAt: '2024-01-17T11:15:00Z',
              estimatedDelivery: '2024-01-18T14:00:00Z',
              customerName: 'Jane Doe',
              customerPhone: '+1-555-0124',
              customerEmail: 'jane.doe@email.com',
              assignedWorker: null,
              priority: 'MEDIUM',
              zone: 'Zone B'
            },
            {
              id: 'REQ003',
              requestId: 'bin_request_1703001234569',
              requestType: 'BIN',
              itemType: 'Recycling',
              quantity: 1,
              deliveryAddress: '789 Pine St, Springfield, IL 62703',
              specialInstructions: 'Gate code: 1234',
              totalAmount: 30.00,
              status: 'DELIVERED',
              createdAt: '2024-01-14T08:45:00Z',
              deliveredAt: '2024-01-15T10:30:00Z',
              estimatedDelivery: '2024-01-15T10:00:00Z',
              customerName: 'Bob Johnson',
              customerPhone: '+1-555-0125',
              customerEmail: 'bob.johnson@email.com',
              assignedWorker: 'worker-001',
              priority: 'LOW',
              zone: 'Zone C'
            }
          ];
          setRequests(mockRequests);
        }
      } catch (error) {
        console.error('❌ Error fetching worker requests:', error);
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkerRequests();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'text-yellow-600 bg-yellow-100';
      case 'CONFIRMED': return 'text-blue-600 bg-blue-100';
      case 'DELIVERED': return 'text-green-600 bg-green-100';
      case 'CANCELLED': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING': return <Clock className="w-4 h-4" />;
      case 'CONFIRMED': return <CheckCircle className="w-4 h-4" />;
      case 'DELIVERED': return <Truck className="w-4 h-4" />;
      case 'CANCELLED': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH': return 'text-red-600 bg-red-100';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-100';
      case 'LOW': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleAssignToMe = async (requestId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/bin-requests/${requestId}/assign`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ workerId: user?.id || 'worker-001' })
      });

      if (response.ok) {
        // Update local state
        setRequests(prev => prev.map(req => 
          req.id === requestId 
            ? { ...req, assignedWorker: user?.id || 'worker-001', status: 'CONFIRMED' }
            : req
        ));
        console.log('✅ Successfully assigned request to worker');
      } else {
        console.error('❌ Failed to assign request');
      }
    } catch (error) {
      console.error('❌ Error assigning request:', error);
    }
  };

  const handleMarkDelivered = async (requestId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/bin-requests/${requestId}/deliver`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          deliveredAt: new Date().toISOString(),
          workerId: user?.id || 'worker-001'
        })
      });

      if (response.ok) {
        // Update local state
        setRequests(prev => prev.map(req => 
          req.id === requestId 
            ? { ...req, status: 'DELIVERED', deliveredAt: new Date().toISOString() }
            : req
        ));
        console.log('✅ Successfully marked request as delivered');
      } else {
        console.error('❌ Failed to mark request as delivered');
      }
    } catch (error) {
      console.error('❌ Error marking request as delivered:', error);
    }
  };

  const filteredRequests = requests.filter(request => {
    const matchesFilter = filter === 'all' || 
      (filter === 'pending' && request.status === 'PENDING') ||
      (filter === 'assigned' && request.assignedWorker && request.status === 'CONFIRMED') ||
      (filter === 'completed' && request.status === 'DELIVERED');
    
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    
    return matchesFilter && matchesStatus;
  });

  const renderRequestCard = (request) => (
    <div key={request.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          {request.requestType === 'BIN' ? (
            <Trash2 className="w-6 h-6 text-blue-500" />
          ) : (
            <Package className="w-6 h-6 text-green-500" />
          )}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{request.requestId}</h3>
            <p className="text-sm text-gray-600">
              {request.requestType} • {request.itemType} • Qty: {request.quantity}
            </p>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
                {request.priority}
              </span>
              <span className="text-xs text-gray-500">Zone: {request.zone}</span>
            </div>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
          {getStatusIcon(request.status)}
          <span className="ml-1">{request.status}</span>
        </span>
      </div>

      <div className="mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
          <MapPin className="w-4 h-4" />
          <span>{request.deliveryAddress}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
          <User className="w-4 h-4" />
          <span>{request.customerName}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Phone className="w-4 h-4" />
          <span>{request.customerPhone}</span>
        </div>
      </div>

      {request.specialInstructions && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-700">
            <strong>Special Instructions:</strong> {request.specialInstructions}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          <span>Ordered: {new Date(request.createdAt).toLocaleDateString()}</span>
        </div>
        {request.deliveredAt ? (
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Truck className="w-4 h-4" />
            <span>Delivered: {new Date(request.deliveredAt).toLocaleDateString()}</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>Expected: {new Date(request.estimatedDelivery).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <CreditCard className="w-4 h-4 text-green-500" />
          <span className="text-sm text-gray-600">${request.totalAmount}</span>
        </div>
        <div className="flex items-center space-x-2">
          {request.status === 'PENDING' && !request.assignedWorker && (
            <button
              onClick={() => handleAssignToMe(request.id)}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
            >
              <CheckSquare className="w-4 h-4" />
            </button>
          )}
          {request.status === 'CONFIRMED' && request.assignedWorker && (
            <button
              onClick={() => handleMarkDelivered(request.id)}
              className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
            >
              <Truck className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setSelectedRequest(request)}
            className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Trash2 className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Requests</p>
                <p className="text-2xl font-semibold text-gray-900">{requests.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {requests.filter(r => r.status === 'PENDING').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Assigned</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {requests.filter(r => r.assignedWorker && r.status === 'CONFIRMED').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Truck className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {requests.filter(r => r.status === 'DELIVERED').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Bin/Bag Requests</h2>
            <div className="flex items-center space-x-4">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Requests</option>
                <option value="pending">Pending Assignment</option>
                <option value="assigned">Assigned to Me</option>
                <option value="completed">Completed</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="DELIVERED">Delivered</option>
              </select>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Requests List */}
        <div className="grid grid-cols-1 gap-6">
          {filteredRequests.map(renderRequestCard)}
        </div>

        {filteredRequests.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Trash2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">No requests found</p>
            <p>No bin/bag requests match your current filters</p>
          </div>
        )}
      </div>
    );
  };

  // Navigation items
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'routes', label: 'Pickup Routes', icon: '🗺️' },
    { id: 'collection', label: 'Record Collection', icon: '✅' },
    { id: 'bin-requests', label: 'Bin/Bag Requests', icon: '🗑️' },
    { id: 'schedule', label: 'Work Schedule', icon: '🕐' },
    { id: 'completed', label: 'Completed Tasks', icon: '✅' }
  ];

  return (
    <WorkerDashboardLayout
      navItems={navItems}
      activeNav="bin-requests"
      onNavClick={() => {}}
      logo="Worker"
      user={user}
      onLogout={() => {}}
      pageTitle="Bin/Bag Requests"
      pageSubtitle="Manage bin and bag delivery requests"
    >
      {renderContent()}
    </WorkerDashboardLayout>
  );
};

export default BinBagRequestsPage;
