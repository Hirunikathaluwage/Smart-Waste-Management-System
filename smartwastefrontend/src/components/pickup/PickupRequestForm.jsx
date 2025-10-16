import React, { useState, useEffect } from 'react';
import pickupRequestService from '../../services/pickupRequestService';
import MapLocationPicker from './MapLocationPicker';
import StripePaymentForm from '../payment/StripePaymentForm';

const PickupRequestForm = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    wasteType: '',
    itemDescription: '',
    estimatedWeight: '',
    specialInstructions: '',
    pickupType: 'REGULAR',
    preferredDateTime: '',
    pickupLocation: '',
    address: '',
    city: '',
    postalCode: '',
    latitude: '',
    longitude: '',
    paymentMethod: 'PayLater',
    rewardPointsUsed: 0
  });

  const [feeCalculation, setFeeCalculation] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  // Waste type options
  const wasteTypes = [
    { value: 'BULKY_WASTE', label: 'Bulky Waste (Furniture, Appliances)' },
    { value: 'E_WASTE', label: 'E-Waste (Electronics)' },
    { value: 'ORGANIC', label: 'Organic Waste' },
    { value: 'RECYCLABLE', label: 'Recyclable Materials' },
    { value: 'HAZARDOUS', label: 'Hazardous Waste' },
    { value: 'GENERAL', label: 'General Waste' }
  ];

  // Pickup type options
  const pickupTypes = [
    { value: 'REGULAR', label: 'Regular Pickup' },
    { value: 'EXTRA', label: 'Extra Pickup' },
    { value: 'EMERGENCY', label: 'Emergency Pickup' }
  ];

  // Payment method options
  const paymentMethods = [
    { value: 'PayLater', label: 'Pay Later (Cash on Pickup)' },
    { value: 'Cash', label: 'Cash on Pickup' },
    { value: 'Card', label: 'Credit/Debit Card (Stripe)' },
    { value: 'Points', label: 'Reward Points' }
  ];

  // Calculate fees when form data changes
  useEffect(() => {
    const calculateFees = async () => {
      if (formData.wasteType && formData.pickupType) {
        setIsCalculating(true);
        try {
          const user = JSON.parse(localStorage.getItem('user') || 'null');
          const calculationData = {
            ...formData,
            userId: user?.userId,
            estimatedWeight: formData.estimatedWeight ? parseFloat(formData.estimatedWeight) : null,
            rewardPointsUsed: formData.rewardPointsUsed ? parseFloat(formData.rewardPointsUsed) : 0
          };
          
          const fees = await pickupRequestService.calculateFees(calculationData);
          setFeeCalculation(fees);
        } catch (error) {
          console.error('Error calculating fees:', error);
        } finally {
          setIsCalculating(false);
        }
      }
    };

    calculateFees();
  }, [formData.wasteType, formData.pickupType, formData.estimatedWeight, formData.rewardPointsUsed]);

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
    
    // Clear location-related errors
    setErrors(prev => ({
      ...prev,
      address: '',
      city: '',
      postalCode: ''
    }));
  };

  const handlePaymentSuccess = (paymentResult) => {
    console.log('Payment successful:', paymentResult);
    setFormData(prev => ({
      ...prev,
      paymentMethod: 'Card',
      transactionId: paymentResult.paymentMethodId
    }));
    setShowPaymentForm(false);
    setPaymentProcessing(false);
    
    // Show success message
    alert('Payment successful! You can now submit your pickup request.');
  };

  const handlePaymentError = (error) => {
    console.error('Payment failed:', error);
    setPaymentProcessing(false);
    alert('Payment failed. Please try again or choose a different payment method.');
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.wasteType) newErrors.wasteType = 'Please select a waste type';
    if (!formData.itemDescription.trim()) newErrors.itemDescription = 'Please describe the items';
    if (!formData.pickupType) newErrors.pickupType = 'Please select a pickup type';
    if (!formData.preferredDateTime) newErrors.preferredDateTime = 'Please select a preferred date and time';
    if (!selectedLocation) newErrors.location = 'Please select a pickup location on the map';
    if (!formData.paymentMethod) newErrors.paymentMethod = 'Please select a payment method';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      const requestData = {
        ...formData,
        userId: user?.userId,
        estimatedWeight: formData.estimatedWeight ? parseFloat(formData.estimatedWeight) : null,
        rewardPointsUsed: formData.rewardPointsUsed ? parseFloat(formData.rewardPointsUsed) : 0,
        latitude: selectedLocation?.latitude || null,
        longitude: selectedLocation?.longitude || null,
        address: selectedLocation?.address || formData.address,
        city: selectedLocation?.city || formData.city,
        postalCode: selectedLocation?.postalCode || formData.postalCode
      };

      const result = await pickupRequestService.createPickupRequest(requestData);
      onSuccess(result);
    } catch (error) {
      console.error('Error creating pickup request:', error);
      setErrors({ submit: 'Failed to create pickup request. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Request Waste Pickup</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Waste Details Section */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Waste Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type of Waste *
              </label>
              <select
                name="wasteType"
                value={formData.wasteType}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.wasteType ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select waste type</option>
                {wasteTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {errors.wasteType && <p className="text-red-500 text-sm mt-1">{errors.wasteType}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estimated Weight (kg)
              </label>
              <input
                type="number"
                name="estimatedWeight"
                value={formData.estimatedWeight}
                onChange={handleInputChange}
                min="0"
                step="0.1"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter estimated weight"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Item Description *
            </label>
            <textarea
              name="itemDescription"
              value={formData.itemDescription}
              onChange={handleInputChange}
              rows={3}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.itemDescription ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Describe the items to be picked up..."
            />
            {errors.itemDescription && <p className="text-red-500 text-sm mt-1">{errors.itemDescription}</p>}
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Special Instructions
            </label>
            <textarea
              name="specialInstructions"
              value={formData.specialInstructions}
              onChange={handleInputChange}
              rows={2}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Any special instructions for the pickup..."
            />
          </div>
        </div>

        {/* Pickup Details Section */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Pickup Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pickup Type *
              </label>
              <select
                name="pickupType"
                value={formData.pickupType}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.pickupType ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                {pickupTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {errors.pickupType && <p className="text-red-500 text-sm mt-1">{errors.pickupType}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Date & Time *
              </label>
              <input
                type="datetime-local"
                name="preferredDateTime"
                value={formData.preferredDateTime}
                onChange={handleInputChange}
                min={new Date().toISOString().slice(0, 16)}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.preferredDateTime ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.preferredDateTime && <p className="text-red-500 text-sm mt-1">{errors.preferredDateTime}</p>}
            </div>
          </div>
        </div>

        {/* Location Details Section */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Location Details</h3>
          
          <MapLocationPicker
            onLocationSelect={handleLocationSelect}
            initialLocation={selectedLocation}
            height="400px"
            className="mb-4"
          />
          
          {errors.location && (
            <div className="mt-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
              {errors.location}
            </div>
          )}

          <div className="mt-4">
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
        </div>

        {/* Payment Details Section */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Payment Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method *
              </label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={(e) => {
                  handleInputChange(e);
                  if (e.target.value === 'Card') {
                    setShowPaymentForm(true);
                  } else {
                    setShowPaymentForm(false);
                  }
                }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.paymentMethod ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                {paymentMethods.map(method => (
                  <option key={method.value} value={method.value}>
                    {method.label}
                  </option>
                ))}
              </select>
              {errors.paymentMethod && <p className="text-red-500 text-sm mt-1">{errors.paymentMethod}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reward Points to Use
              </label>
              <input
                type="number"
                name="rewardPointsUsed"
                value={formData.rewardPointsUsed}
                onChange={handleInputChange}
                min="0"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter reward points"
              />
            </div>
          </div>

          {/* Stripe Payment Form */}
          {showPaymentForm && feeCalculation && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="text-lg font-semibold text-blue-800 mb-4">💳 Credit/Debit Card Payment</h4>
              <StripePaymentForm
                amount={feeCalculation.finalAmount}
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentError={handlePaymentError}
                isLoading={paymentProcessing}
              />
            </div>
          )}
        </div>

        {/* Fee Calculation Display */}
        {feeCalculation && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Fee Calculation</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Base Amount:</span>
                <span>${feeCalculation.baseAmount?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Urgency Fee:</span>
                <span>${feeCalculation.urgencyFee?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Amount:</span>
                <span>${feeCalculation.totalAmount?.toFixed(2)}</span>
              </div>
              {feeCalculation.rewardPointsUsed > 0 && (
                <div className="flex justify-between">
                  <span>Reward Points Used:</span>
                  <span>-${(feeCalculation.rewardPointsUsed * 0.01).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold text-lg border-t pt-2">
                <span>Final Amount:</span>
                <span>${feeCalculation.finalAmount?.toFixed(2)}</span>
              </div>
            </div>
            {isCalculating && <p className="text-blue-600 text-sm mt-2">Calculating fees...</p>}
          </div>
        )}

        {/* Error Messages */}
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {errors.submit}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || isCalculating}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PickupRequestForm;
