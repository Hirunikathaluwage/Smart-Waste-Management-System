import React, { useState, useEffect } from 'react';
import pickupRequestService from '../../services/pickupRequestService';
import MapLocationPicker from './MapLocationPicker';
import StripePaymentForm from '../payment/StripePaymentForm';
import { useAuth } from '../../context/AuthContext';

const PickupRequestForm = ({ onSuccess, onCancel }) => {
  const { user } = useAuth();
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
      transactionId: paymentResult.paymentMethodId,
      paymentIntentId: paymentResult.paymentIntentId,
      paymentStatus: 'COMPLETED'
    }));
    setPaymentProcessing(false);
    
    // Show success message
    alert('Payment successful! You can now submit your pickup request.');
  };

  const handlePaymentError = (error) => {
    console.error('Payment failed:', error);
    setPaymentProcessing(false);
    
    // Show detailed error message
    const errorMessage = error.message || 'Payment failed. Please try again or choose a different payment method.';
    alert(`Payment Error: ${errorMessage}`);
    
    // Don't clear the form - let user retry with different card or method
    console.log('Payment failed, form remains filled for retry');
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
    // If called from form, prevent default
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    
    // Don't submit if payment form is active and processing
    if (showPaymentForm && paymentProcessing) {
      console.log('Payment form is active, preventing main form submission');
      return;
    }
    
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
    <div className="w-full max-w-none mx-auto p-2 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-gray-800 mb-2">Request Waste Pickup</h2>
      
      <form onSubmit={handleSubmit} className="space-y-2">
        {/* Ultra-compact form layout using full width */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
          
          {/* Column 1 - Waste Details */}
          <div className="space-y-1">
            <div className="bg-gray-50 p-2 rounded">
              <h3 className="text-sm font-semibold text-gray-700 mb-1">Waste Details</h3>
              
              <div className="space-y-1">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-0.5">
                    Type of Waste *
                  </label>
                  <select
                    name="wasteType"
                    value={formData.wasteType}
                    onChange={handleInputChange}
                    className={`w-full p-1.5 text-sm border rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
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
                  {errors.wasteType && <p className="text-red-500 text-xs mt-0.5">{errors.wasteType}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-0.5">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    name="estimatedWeight"
                    value={formData.estimatedWeight}
                    onChange={handleInputChange}
                    min="0"
                    step="0.1"
                    className="w-full p-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Weight"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-0.5">
                    Item Description *
                  </label>
                  <textarea
                    name="itemDescription"
                    value={formData.itemDescription}
                    onChange={handleInputChange}
                    rows={2}
                    className={`w-full p-1.5 text-sm border rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.itemDescription ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Describe items..."
                  />
                  {errors.itemDescription && <p className="text-red-500 text-xs mt-0.5">{errors.itemDescription}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Column 2 - Pickup Details */}
          <div className="space-y-1">
            <div className="bg-gray-50 p-2 rounded">
              <h3 className="text-sm font-semibold text-gray-700 mb-1">Pickup Details</h3>
              
              <div className="space-y-1">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-0.5">
                    Pickup Type *
                  </label>
                  <select
                    name="pickupType"
                    value={formData.pickupType}
                    onChange={handleInputChange}
                    className={`w-full p-1.5 text-sm border rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.pickupType ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    {pickupTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  {errors.pickupType && <p className="text-red-500 text-xs mt-0.5">{errors.pickupType}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-0.5">
                    Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    name="preferredDateTime"
                    value={formData.preferredDateTime}
                    onChange={handleInputChange}
                    min={new Date().toISOString().slice(0, 16)}
                    className={`w-full p-1.5 text-sm border rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.preferredDateTime ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.preferredDateTime && <p className="text-red-500 text-xs mt-0.5">{errors.preferredDateTime}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-0.5">
                    Location Description
                  </label>
                  <input
                    type="text"
                    name="pickupLocation"
                    value={formData.pickupLocation}
                    onChange={handleInputChange}
                    className="w-full p-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Front door, Backyard..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-0.5">
                    Special Instructions
                  </label>
                  <input
                    type="text"
                    name="specialInstructions"
                    value={formData.specialInstructions}
                    onChange={handleInputChange}
                    className="w-full p-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Special instructions..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Column 3 - Payment Details */}
          <div className="space-y-1">
            <div className="bg-gray-50 p-2 rounded">
              <h3 className="text-sm font-semibold text-gray-700 mb-1">Payment Details</h3>
              
              <div className="space-y-1">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-0.5">
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
                    className={`w-full p-1.5 text-sm border rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.paymentMethod ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    {paymentMethods.map(method => (
                      <option key={method.value} value={method.value}>
                        {method.label}
                      </option>
                    ))}
                  </select>
                  {errors.paymentMethod && <p className="text-red-500 text-xs mt-0.5">{errors.paymentMethod}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-0.5">
                    Reward Points
                  </label>
                  <input
                    type="number"
                    name="rewardPointsUsed"
                    value={formData.rewardPointsUsed}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full p-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Points"
                  />
                </div>
              </div>
            </div>

            {/* Fee Calculation - Minimal padding */}
            {feeCalculation && (
              <div className="bg-blue-50 p-2 rounded">
                <h3 className="text-sm font-semibold text-blue-800 mb-1">Fee Calculation</h3>
                <div className="space-y-0.5 text-xs">
                  <div className="flex justify-between">
                    <span>Base:</span>
                    <span>${feeCalculation.baseAmount?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Urgency:</span>
                    <span>${feeCalculation.urgencyFee?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total:</span>
                    <span>${feeCalculation.totalAmount?.toFixed(2)}</span>
                  </div>
                  {feeCalculation.rewardPointsUsed > 0 && (
                    <div className="flex justify-between">
                      <span>Points:</span>
                      <span>-${(feeCalculation.rewardPointsUsed * 0.01).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold text-sm border-t pt-0.5">
                    <span>Final:</span>
                    <span>${feeCalculation.finalAmount?.toFixed(2)}</span>
                  </div>
                </div>
                {isCalculating && <p className="text-blue-600 text-xs mt-1">Calculating...</p>}
              </div>
            )}
          </div>

          {/* Column 4 - Map */}
          <div className="space-y-1">
            <div className="bg-gray-50 p-2 rounded">
              <h3 className="text-sm font-semibold text-gray-700 mb-1">Pickup Location</h3>
              
              <MapLocationPicker
                onLocationSelect={handleLocationSelect}
                initialLocation={selectedLocation}
                height="250px"
                className="mb-1"
              />
              
              {errors.location && (
                <div className="mt-1 p-1 bg-red-50 border border-red-200 text-red-700 rounded text-xs">
                  {errors.location}
                </div>
              )}
            </div>
          </div>
        </div>
      </form>

      {/* Stripe Payment Form - Minimal padding */}
      {showPaymentForm && feeCalculation && (
        <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded">
          <h4 className="text-sm font-semibold text-blue-800 mb-1">💳 Card Payment</h4>
          <StripePaymentForm
            amount={feeCalculation.finalAmount}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentError={handlePaymentError}
            isLoading={paymentProcessing}
            pickupData={{
              customerName: user?.name || 'Customer',
              customerEmail: user?.email || '',
              address: `${formData.address}, ${formData.city}, ${formData.postalCode}`,
              wasteType: formData.wasteType,
              itemDescription: formData.itemDescription,
              pickupType: formData.pickupType,
              preferredDateTime: formData.preferredDateTime,
              estimatedWeight: formData.estimatedWeight
            }}
          />
        </div>
      )}

      {/* Error Messages - Minimal padding */}
      {errors.submit && (
        <div className="mt-2 bg-red-50 border border-red-200 text-red-700 px-2 py-1 rounded text-xs">
          {errors.submit}
        </div>
      )}

      {/* Action Buttons - Minimal padding */}
      <div className="flex flex-col sm:flex-row justify-end gap-1 sm:gap-2 mt-2">
        <button
          type="button"
          onClick={onCancel}
          className="w-full sm:w-auto px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting || isCalculating}
          className="w-full sm:w-auto px-3 py-1.5 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Request'}
        </button>
      </div>
    </div>
  );
};

export default PickupRequestForm;
