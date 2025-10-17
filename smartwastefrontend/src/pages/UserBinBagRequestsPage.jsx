import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ResidentDashboardLayout from '../components/dashboard/ResidentDashboardLayout';
import BusinessDashboardLayout from '../components/dashboard/BusinessDashboardLayout';
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
  Download
} from 'lucide-react';

/**
 * User Bin/Bag Requests History Page
 * Shows user's own bin and bag request history
 */
const UserBinBagRequestsPage = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'confirmed', 'delivered'

  // Fetch user's bin/bag requests from database
  useEffect(() => {
    const fetchUserRequests = async () => {
      try {
        console.log('Fetching user bin/bag requests from database...');
        const userId = 'demo-resident-user'; // In real app, this would come from auth context
        const response = await fetch(`http://localhost:8080/api/bin-requests/user/${userId}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log('✅ Fetched user requests from database:', data);
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
              status: 'DELIVERED',
              createdAt: '2024-01-15T10:30:00Z',
              deliveredAt: '2024-01-16T09:30:00Z',
              paymentIntentId: 'pi_1234567890',
              paymentStatus: 'succeeded',
              estimatedDelivery: '2024-01-16T09:00:00Z'
            },
            {
              id: 'REQ002',
              requestId: 'bag_request_1703001234568',
              requestType: 'BAG',
              itemType: 'Biodegradable',
              quantity: 5,
              deliveryAddress: '123 Main St, Springfield, IL 62701',
              specialInstructions: 'Ring doorbell twice',
              totalAmount: 25.00,
              status: 'CONFIRMED',
              createdAt: '2024-01-17T11:15:00Z',
              paymentIntentId: 'pi_1234567891',
              paymentStatus: 'succeeded',
              estimatedDelivery: '2024-01-18T14:00:00Z'
            }
          ];
          setRequests(mockRequests);
        }
      } catch (error) {
        console.error('❌ Error fetching user requests:', error);
        // Use empty array if there's an error
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRequests();
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
      case 'CANCELLED': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusDescription = (status) => {
    switch (status) {
      case 'PENDING': return 'Your request is being processed';
      case 'CONFIRMED': return 'Your request has been confirmed and is scheduled for delivery';
      case 'DELIVERED': return 'Your items have been delivered successfully';
      case 'CANCELLED': return 'Your request has been cancelled';
      default: return 'Status unknown';
    }
  };

  const filteredRequests = requests.filter(request => {
    return filter === 'all' || request.status.toLowerCase() === filter;
  });

  const generateInvoice = (request) => {
    // In a real app, this would generate a PDF invoice
    const invoiceData = {
      requestId: request.requestId,
      customerName: user?.name || 'Customer',
      customerEmail: user?.email || '',
      itemType: request.requestType,
      itemDescription: `${request.quantity}x ${request.itemType} ${request.requestType}`,
      totalAmount: request.totalAmount,
      status: request.status,
      createdAt: request.createdAt,
      deliveredAt: request.deliveredAt
    };
    
    console.log('Generating invoice:', invoiceData);
    alert('Invoice generated! Check console for details.');
  };

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
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
          {getStatusIcon(request.status)}
          <span className="ml-1">{request.status}</span>
        </span>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-700 mb-2">{getStatusDescription(request.status)}</p>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <MapPin className="w-4 h-4" />
          <span>{request.deliveryAddress}</span>
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
        {request.deliveredAt && (
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Truck className="w-4 h-4" />
            <span>Delivered: {new Date(request.deliveredAt).toLocaleDateString()}</span>
          </div>
        )}
        {request.estimatedDelivery && !request.deliveredAt && (
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>Expected: {new Date(request.estimatedDelivery).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <CreditCard className="w-4 h-4 text-green-500" />
          <span className="text-sm text-gray-600">Payment: {request.paymentStatus}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-lg font-semibold text-gray-900">${request.totalAmount}</span>
          <button
            onClick={() => generateInvoice(request)}
            className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={() => setSelectedRequest(request)}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
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
                <p className="text-sm font-medium text-gray-600">Confirmed</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {requests.filter(r => r.status === 'CONFIRMED').length}
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
                <p className="text-sm font-medium text-gray-600">Delivered</p>
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
            <h2 className="text-lg font-semibold text-gray-900">My Bin/Bag Requests</h2>
            <div className="flex items-center space-x-4">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Requests</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="delivered">Delivered</option>
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
            <p>You haven't made any bin/bag requests yet</p>
          </div>
        )}
      </div>
    );
  };

  // Navigation items
  const navItems = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'bin-status', label: 'Bin Status', icon: '🗑️' },
    { id: 'requests', label: 'My Requests', icon: '📋' },
    { id: 'pickup-requests', label: 'Pickup Requests', icon: '🚛' }
  ];

  return (
    <>
      {user?.role === 'BUSINESS' ? (
        <BusinessDashboardLayout
          navItems={navItems}
          activeNav="requests"
          onNavClick={() => {}}
          logo="Business"
          user={user}
          onLogout={() => {}}
          pageTitle="My Bin/Bag Requests"
          pageSubtitle="View your bin and bag request history"
        >
          {renderContent()}
        </BusinessDashboardLayout>
      ) : (
        <ResidentDashboardLayout
          navItems={navItems}
          activeNav="requests"
          onNavClick={() => {}}
          logo="Resident"
          user={user}
          onLogout={() => {}}
          pageTitle="My Bin/Bag Requests"
          pageSubtitle="View your bin and bag request history"
        >
          {renderContent()}
        </ResidentDashboardLayout>
      )}
    </>
  );
};

export default UserBinBagRequestsPage;
