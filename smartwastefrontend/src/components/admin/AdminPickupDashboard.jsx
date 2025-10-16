import React, { useState, useEffect } from 'react';
import pickupRequestService from '../../services/pickupRequestService';

const AdminPickupDashboard = () => {
  const [stats, setStats] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsData, requestsData] = await Promise.all([
        pickupRequestService.getPickupStats(),
        pickupRequestService.getAllPickupRequests()
      ]);
      
      setStats(statsData);
      setRequests(requestsData);
    } catch (err) {
      setError('Failed to fetch data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRequest = async (requestId, updateData) => {
    try {
      await pickupRequestService.updatePickupRequest(requestId, updateData);
      fetchData(); // Refresh data
      setSelectedRequest(null);
    } catch (err) {
      console.error('Error updating request:', err);
    }
  };

  const filteredRequests = requests.filter(request => {
    if (filter === 'all') return true;
    return request.status === filter;
  });

  const getStatusColor = (status) => {
    const colors = {
      DRAFT: 'bg-gray-100 text-gray-800',
      PENDING: 'bg-yellow-100 text-yellow-800',
      SCHEDULED: 'bg-blue-100 text-blue-800',
      IN_PROGRESS: 'bg-purple-100 text-purple-800',
      COMPLETED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
      FAILED: 'bg-red-100 text-red-800',
      RESCHEDULED: 'bg-orange-100 text-orange-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Pickup Request Management</h2>
        <button
          onClick={fetchData}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Refresh Data
        </button>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Total Requests</h3>
                <p className="text-2xl font-bold text-blue-600">{stats.totalRequests}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Pending Requests</h3>
                <p className="text-2xl font-bold text-yellow-600">{stats.pendingRequests}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Completed</h3>
                <p className="text-2xl font-bold text-green-600">{stats.completedRequests}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Total Revenue</h3>
                <p className="text-2xl font-bold text-purple-600">${stats.totalRevenue?.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Additional Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Emergency Requests</h3>
            <p className="text-3xl font-bold text-red-600">{stats.emergencyRequests}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Pending Payments</h3>
            <p className="text-3xl font-bold text-orange-600">${stats.pendingPayments?.toFixed(2)}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-2">This Month</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.requestsThisMonth}</p>
          </div>
        </div>
      )}

      {/* Filter and Requests List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">All Requests</h3>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Requests</option>
              <option value="DRAFT">Draft</option>
              <option value="PENDING">Pending</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="p-6">
          {filteredRequests.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No pickup requests found.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRequests.map((request) => (
                <div
                  key={request.requestId}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedRequest(request)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-lg font-semibold text-gray-800">
                          Request #{request.requestId.slice(0, 8)}
                        </h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                        <span className="text-sm text-gray-500">
                          {request.pickupType}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">User:</span> {request.userName}
                        </div>
                        <div>
                          <span className="font-medium">Waste Type:</span> {request.wasteType}
                        </div>
                        <div>
                          <span className="font-medium">Amount:</span> ${request.finalAmount?.toFixed(2)}
                        </div>
                        <div>
                          <span className="font-medium">Location:</span> {request.city}
                        </div>
                      </div>
                      
                      <div className="mt-2 text-sm text-gray-500">
                        <span className="font-medium">Created:</span> {formatDate(request.createdAt)}
                        {request.preferredDateTime && (
                          <>
                            <span className="mx-2">•</span>
                            <span className="font-medium">Preferred:</span> {formatDate(request.preferredDateTime)}
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="ml-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRequest(request);
                        }}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Manage
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Request Management Modal */}
      {selectedRequest && (
        <RequestManagementModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onUpdate={handleUpdateRequest}
        />
      )}
    </div>
  );
};

// Request Management Modal Component
const RequestManagementModal = ({ request, onClose, onUpdate }) => {
  const [updateData, setUpdateData] = useState({
    status: request.status,
    assignedWorkerId: request.assignedWorkerId || '',
    assignedWorkerName: request.assignedWorkerName || '',
    adminNotes: request.adminNotes || '',
    scheduledDateTime: request.scheduledDateTime ? 
      new Date(request.scheduledDateTime).toISOString().slice(0, 16) : ''
  });

  const handleUpdate = () => {
    const updatePayload = {
      ...updateData,
      scheduledDateTime: updateData.scheduledDateTime ? 
        new Date(updateData.scheduledDateTime) : null
    };
    onUpdate(request.requestId, updatePayload);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Manage Request #{request.requestId.slice(0, 8)}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Request Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">Request Information</h3>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">User:</span>
                  <span>{request.userName} ({request.userEmail})</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Waste Type:</span>
                  <span>{request.wasteType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Pickup Type:</span>
                  <span>{request.pickupType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Amount:</span>
                  <span>${request.finalAmount?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Payment Status:</span>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {request.paymentStatus}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Created:</span>
                  <span>{formatDate(request.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Preferred Date:</span>
                  <span>{formatDate(request.preferredDateTime)}</span>
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">Location Information</h3>
              
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Address:</span>
                  <p className="text-gray-600">{request.address}</p>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">City:</span>
                  <span>{request.city}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Postal Code:</span>
                  <span>{request.postalCode}</span>
                </div>
                {request.pickupLocation && (
                  <div>
                    <span className="font-medium">Pickup Location:</span>
                    <p className="text-gray-600">{request.pickupLocation}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Item Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">Item Details</h3>
              
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Description:</span>
                  <p className="text-gray-600">{request.itemDescription}</p>
                </div>
                {request.estimatedWeight && (
                  <div className="flex justify-between">
                    <span className="font-medium">Estimated Weight:</span>
                    <span>{request.estimatedWeight} kg</span>
                  </div>
                )}
                {request.specialInstructions && (
                  <div>
                    <span className="font-medium">Special Instructions:</span>
                    <p className="text-gray-600">{request.specialInstructions}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Management Controls */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">Management Controls</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={updateData.status}
                    onChange={(e) => setUpdateData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="PENDING">Pending</option>
                    <option value="SCHEDULED">Scheduled</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                    <option value="FAILED">Failed</option>
                    <option value="RESCHEDULED">Rescheduled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Scheduled Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={updateData.scheduledDateTime}
                    onChange={(e) => setUpdateData(prev => ({ ...prev, scheduledDateTime: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assigned Worker ID
                  </label>
                  <input
                    type="text"
                    value={updateData.assignedWorkerId}
                    onChange={(e) => setUpdateData(prev => ({ ...prev, assignedWorkerId: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter worker ID"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assigned Worker Name
                  </label>
                  <input
                    type="text"
                    value={updateData.assignedWorkerName}
                    onChange={(e) => setUpdateData(prev => ({ ...prev, assignedWorkerName: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter worker name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Admin Notes
                  </label>
                  <textarea
                    value={updateData.adminNotes}
                    onChange={(e) => setUpdateData(prev => ({ ...prev, adminNotes: e.target.value }))}
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Add admin notes..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Update Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPickupDashboard;
