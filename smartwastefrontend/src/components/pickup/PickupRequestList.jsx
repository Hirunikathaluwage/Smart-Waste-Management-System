import React, { useState, useEffect } from 'react';
import pickupRequestService from '../../services/pickupRequestService';

const PickupRequestList = ({ userId, isAdmin = false }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, [userId, isAdmin]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      let data;
      
      if (isAdmin) {
        data = await pickupRequestService.getAllPickupRequests();
      } else {
        data = await pickupRequestService.getPickupRequestsByUserId(userId);
      }
      
      setRequests(data);
    } catch (err) {
      setError('Failed to fetch pickup requests');
      console.error('Error fetching requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRequest = async (requestId, reason) => {
    try {
      await pickupRequestService.cancelPickupRequest(requestId, reason);
      fetchRequests(); // Refresh the list
      setSelectedRequest(null);
    } catch (err) {
      console.error('Error cancelling request:', err);
    }
  };

  const handleRescheduleRequest = async (requestId, newDateTime) => {
    try {
      await pickupRequestService.reschedulePickupRequest(requestId, {
        preferredDateTime: newDateTime
      });
      fetchRequests(); // Refresh the list
      setSelectedRequest(null);
    } catch (err) {
      console.error('Error rescheduling request:', err);
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

  const getPaymentStatusColor = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      COMPLETED: 'bg-green-100 text-green-800',
      DECLINED: 'bg-red-100 text-red-800',
      MISSED: 'bg-red-100 text-red-800',
      REFUNDED: 'bg-blue-100 text-blue-800',
      PARTIAL: 'bg-orange-100 text-orange-800'
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
        <h2 className="text-2xl font-bold text-gray-800">
          {isAdmin ? 'All Pickup Requests' : 'My Pickup Requests'}
        </h2>
        <div className="flex space-x-2">
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

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No pickup requests found.
          </div>
        ) : (
          filteredRequests.map((request) => (
            <div
              key={request.requestId}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedRequest(request)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Request #{request.requestId.slice(0, 8)}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(request.paymentStatus)}`}>
                      {request.paymentStatus}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Waste Type:</span> {request.wasteType}
                    </div>
                    <div>
                      <span className="font-medium">Pickup Type:</span> {request.pickupType}
                    </div>
                    <div>
                      <span className="font-medium">Amount:</span> ${request.finalAmount?.toFixed(2)}
                    </div>
                    <div>
                      <span className="font-medium">Location:</span> {request.address}
                    </div>
                    <div>
                      <span className="font-medium">Preferred Date:</span> {formatDate(request.preferredDateTime)}
                    </div>
                    {request.scheduledDateTime && (
                      <div>
                        <span className="font-medium">Scheduled Date:</span> {formatDate(request.scheduledDateTime)}
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Description:</span> {request.itemDescription}
                    </p>
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
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Request Details Modal */}
      {selectedRequest && (
        <RequestDetailsModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onCancel={handleCancelRequest}
          onReschedule={handleRescheduleRequest}
          isAdmin={isAdmin}
        />
      )}
    </div>
  );
};

// Request Details Modal Component
const RequestDetailsModal = ({ request, onClose, onCancel, onReschedule, isAdmin }) => {
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [showRescheduleForm, setShowRescheduleForm] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [newDateTime, setNewDateTime] = useState('');

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCancel = () => {
    onCancel(request.requestId, cancelReason);
    setShowCancelForm(false);
    setCancelReason('');
  };

  const handleReschedule = () => {
    onReschedule(request.requestId, newDateTime);
    setShowRescheduleForm(false);
    setNewDateTime('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Request Details #{request.requestId.slice(0, 8)}
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
                  <span className="font-medium">Status:</span>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {request.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Payment Status:</span>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {request.paymentStatus}
                  </span>
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
                  <span className="font-medium">Created:</span>
                  <span>{formatDate(request.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Preferred Date:</span>
                  <span>{formatDate(request.preferredDateTime)}</span>
                </div>
                {request.scheduledDateTime && (
                  <div className="flex justify-between">
                    <span className="font-medium">Scheduled Date:</span>
                    <span>{formatDate(request.scheduledDateTime)}</span>
                  </div>
                )}
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

            {/* Payment Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">Payment Information</h3>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">Base Amount:</span>
                  <span>${request.baseAmount?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Urgency Fee:</span>
                  <span>${request.urgencyFee?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Total Amount:</span>
                  <span>${request.totalAmount?.toFixed(2)}</span>
                </div>
                {request.rewardPointsUsed > 0 && (
                  <div className="flex justify-between">
                    <span className="font-medium">Reward Points Used:</span>
                    <span>{request.rewardPointsUsed} points</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold">
                  <span>Final Amount:</span>
                  <span>${request.finalAmount?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Payment Method:</span>
                  <span>{request.paymentMethod}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-end space-x-4">
            {request.status === 'PENDING' && (
              <>
                <button
                  onClick={() => setShowRescheduleForm(true)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Reschedule
                </button>
                <button
                  onClick={() => setShowCancelForm(true)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Cancel Request
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>

          {/* Cancel Form */}
          {showCancelForm && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="font-semibold text-red-800 mb-2">Cancel Request</h4>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Please provide a reason for cancellation..."
                className="w-full p-3 border border-red-300 rounded-lg mb-3"
                rows={3}
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowCancelForm(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Confirm Cancellation
                </button>
              </div>
            </div>
          )}

          {/* Reschedule Form */}
          {showRescheduleForm && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Reschedule Request</h4>
              <input
                type="datetime-local"
                value={newDateTime}
                onChange={(e) => setNewDateTime(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
                className="w-full p-3 border border-blue-300 rounded-lg mb-3"
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowRescheduleForm(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReschedule}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Confirm Reschedule
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PickupRequestList;
