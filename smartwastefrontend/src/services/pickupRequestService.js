import API from './api';

// Pickup request service
export const pickupRequestService = {
  // Create a new pickup request
  createPickupRequest: async (pickupData) => {
    try {
      const response = await API.post('/pickup-requests', pickupData);
      return response.data;
    } catch (error) {
      console.error('Error creating pickup request:', error);
      throw error;
    }
  },

  // Calculate fees for a pickup request
  calculateFees: async (pickupData) => {
    try {
      const response = await API.post('/pickup-requests/calculate-fees', pickupData);
      return response.data;
    } catch (error) {
      console.error('Error calculating fees:', error);
      throw error;
    }
  },

  // Get pickup request by ID
  getPickupRequestById: async (requestId) => {
    try {
      const response = await API.get(`/pickup-requests/${requestId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching pickup request:', error);
      throw error;
    }
  },

  // Get pickup requests by user ID
  getPickupRequestsByUserId: async (userId) => {
    try {
      const response = await API.get(`/pickup-requests/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user pickup requests:', error);
      throw error;
    }
  },

  // Update pickup request
  updatePickupRequest: async (requestId, updateData) => {
    try {
      const response = await API.put(`/pickup-requests/${requestId}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating pickup request:', error);
      throw error;
    }
  },

  // Process payment for pickup request
  processPayment: async (requestId, paymentData) => {
    try {
      const response = await API.post(`/pickup-requests/${requestId}/payment`, paymentData);
      return response.data;
    } catch (error) {
      console.error('Error processing payment:', error);
      throw error;
    }
  },

  // Cancel pickup request
  cancelPickupRequest: async (requestId, reason) => {
    try {
      const response = await API.post(`/pickup-requests/${requestId}/cancel`, reason);
      return response.data;
    } catch (error) {
      console.error('Error cancelling pickup request:', error);
      throw error;
    }
  },

  // Get all pickup requests (Admin only)
  getAllPickupRequests: async () => {
    try {
      const response = await API.get('/pickup-requests');
      return response.data;
    } catch (error) {
      console.error('Error fetching all pickup requests:', error);
      throw error;
    }
  },

  // Get pickup requests by status
  getPickupRequestsByStatus: async (status) => {
    try {
      const response = await API.get(`/pickup-requests/status/${status}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching pickup requests by status:', error);
      throw error;
    }
  },

  // Get emergency pickup requests
  getEmergencyPickupRequests: async () => {
    try {
      const response = await API.get('/pickup-requests/emergency');
      return response.data;
    } catch (error) {
      console.error('Error fetching emergency pickup requests:', error);
      throw error;
    }
  },

  // Get pending payment requests
  getPendingPaymentRequests: async () => {
    try {
      const response = await API.get('/pickup-requests/pending-payment');
      return response.data;
    } catch (error) {
      console.error('Error fetching pending payment requests:', error);
      throw error;
    }
  },

  // Reschedule pickup request
  reschedulePickupRequest: async (requestId, rescheduleData) => {
    try {
      const response = await API.post(`/pickup-requests/${requestId}/reschedule`, rescheduleData);
      return response.data;
    } catch (error) {
      console.error('Error rescheduling pickup request:', error);
      throw error;
    }
  },

  // Get pickup request statistics (Admin only)
  getPickupStats: async () => {
    try {
      const response = await API.get('/pickup-requests/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching pickup stats:', error);
      throw error;
    }
  }
};

export default pickupRequestService;
