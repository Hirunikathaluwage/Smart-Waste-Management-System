import React, { useState, useEffect } from 'react';
import pickupRequestService from '../../services/pickupRequestService';
import MapLocationPicker from './MapLocationPicker';

const PickupRequestList = ({ userId, isAdmin = false }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);

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

  const handleEditRequest = (request) => {
    setEditingRequest(request);
    setShowEditForm(true);
    setSelectedRequest(null);
  };

  const handleDeleteRequest = async (requestId) => {
    if (window.confirm('Are you sure you want to delete this pickup request? This action cannot be undone.')) {
      try {
        await pickupRequestService.deletePickupRequest(requestId);
        fetchRequests(); // Refresh the list
        setSelectedRequest(null);
      } catch (err) {
        console.error('Error deleting request:', err);
        alert('Failed to delete request. Please try again.');
      }
    }
  };

  const handleUpdateRequest = async (updateData) => {
    try {
      await pickupRequestService.updatePickupRequest(editingRequest.requestId, updateData);
      fetchRequests(); // Refresh the list
      setShowEditForm(false);
      setEditingRequest(null);
    } catch (err) {
      console.error('Error updating request:', err);
      alert('Failed to update request. Please try again.');
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
                
                <div className="ml-4 flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedRequest(request);
                    }}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View Details
                  </button>
                  {(request.status === 'DRAFT' || request.status === 'PENDING') && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditRequest(request);
                        }}
                        className="text-green-600 hover:text-green-800 text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteRequest(request.requestId);
                        }}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </>
                  )}
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

      {/* Edit Request Modal */}
      {showEditForm && editingRequest && (
        <EditRequestModal
          request={editingRequest}
          onClose={() => {
            setShowEditForm(false);
            setEditingRequest(null);
          }}
          onUpdate={handleUpdateRequest}
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

// Edit Request Modal Component
const EditRequestModal = ({ request, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    itemDescription: request.itemDescription || '',
    estimatedWeight: request.estimatedWeight || '',
    specialInstructions: request.specialInstructions || '',
    preferredDateTime: request.preferredDateTime ? 
      new Date(request.preferredDateTime).toISOString().slice(0, 16) : '',
    pickupLocation: request.pickupLocation || '',
    address: request.address || '',
    city: request.city || '',
    postalCode: request.postalCode || '',
    latitude: request.latitude || '',
    longitude: request.longitude || ''
  });
  const [selectedLocation, setSelectedLocation] = useState({
    latitude: request.latitude || null,
    longitude: request.longitude || null,
    address: request.address || '',
    city: request.city || '',
    postalCode: request.postalCode || ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setFormData(prev => ({
      ...prev,
      address: location.address,
      city: location.city,
      postalCode: location.postalCode,
      latitude: location.latitude.toString(),
      longitude: location.longitude.toString()
    }));
    setErrors(prev => ({ ...prev, address: '', city: '', postalCode: '', location: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.itemDescription.trim()) {
      newErrors.itemDescription = 'Item description is required';
    }
    if (!selectedLocation || !selectedLocation.latitude) {
      newErrors.location = 'Please select a pickup location on the map';
    }
    if (!formData.preferredDateTime) {
      newErrors.preferredDateTime = 'Preferred date and time is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const updateData = {
        ...formData,
        estimatedWeight: formData.estimatedWeight ? parseFloat(formData.estimatedWeight) : null,
        preferredDateTime: new Date(formData.preferredDateTime).toISOString(),
        latitude: selectedLocation?.latitude || null,
        longitude: selectedLocation?.longitude || null,
        address: selectedLocation?.address || formData.address,
        city: selectedLocation?.city || formData.city,
        postalCode: selectedLocation?.postalCode || formData.postalCode
      };
      
      await onUpdate(updateData);
    } catch (error) {
      console.error('Error updating request:', error);
      setErrors({ submit: 'Failed to update request. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Edit Request #{request.requestId.slice(0, 8)}
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

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Item Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Item Description *
              </label>
              <textarea
                name="itemDescription"
                value={formData.itemDescription}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.itemDescription ? 'border-red-500' : 'border-gray-300'
                }`}
                rows={3}
                placeholder="Describe the items to be picked up..."
              />
              {errors.itemDescription && (
                <p className="text-red-500 text-sm mt-1">{errors.itemDescription}</p>
              )}
            </div>

            {/* Estimated Weight */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estimated Weight (kg)
              </label>
              <input
                type="number"
                name="estimatedWeight"
                value={formData.estimatedWeight}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter estimated weight in kg"
                min="0"
                step="0.1"
              />
            </div>

            {/* Special Instructions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Instructions
              </label>
              <textarea
                name="specialInstructions"
                value={formData.specialInstructions}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={2}
                placeholder="Any special instructions for pickup..."
              />
            </div>

            {/* Preferred Date and Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Date and Time *
              </label>
              <input
                type="datetime-local"
                name="preferredDateTime"
                value={formData.preferredDateTime}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.preferredDateTime ? 'border-red-500' : 'border-gray-300'
                }`}
                min={new Date().toISOString().slice(0, 16)}
              />
              {errors.preferredDateTime && (
                <p className="text-red-500 text-sm mt-1">{errors.preferredDateTime}</p>
              )}
            </div>

            {/* Location Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pickup Location *
              </label>
              <MapLocationPicker
                onLocationSelect={handleLocationSelect}
                initialLocation={selectedLocation}
                height="300px"
                className="mb-4"
              />
              {errors.location && (
                <p className="text-red-500 text-sm mt-1">{errors.location}</p>
              )}
              
              {/* Display Selected Location Info */}
              {selectedLocation && selectedLocation.latitude && (
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="text-sm font-semibold text-blue-800 mb-2">📍 Selected Location:</h4>
                  <div className="text-sm text-blue-700 space-y-1">
                    <p><strong>Address:</strong> {selectedLocation.address}</p>
                    <p><strong>City:</strong> {selectedLocation.city}</p>
                    <p><strong>Postal Code:</strong> {selectedLocation.postalCode}</p>
                    <p><strong>Coordinates:</strong> {selectedLocation.latitude.toFixed(6)}, {selectedLocation.longitude.toFixed(6)}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Pickup Location Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pickup Location Description
              </label>
              <input
                type="text"
                name="pickupLocation"
                value={formData.pickupLocation}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Front door, Backyard, Gate, etc."
              />
              <p className="text-xs text-gray-500 mt-1">
                Additional details about where to find the items at the selected location
              </p>
            </div>

            {/* Error Message */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {errors.submit}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Updating...' : 'Update Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PickupRequestList;
