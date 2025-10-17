import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import StripePaymentForm from '../components/payment/StripePaymentForm';
import MapLocationPicker from './pickup/MapLocationPicker';
import binSimulationService from '../services/BinSimulationService';
import { 
  Trash2, 
  Package, 
  ShoppingCart, 
  CreditCard, 
  CheckCircle,
  AlertCircle,
  X,
  Plus,
  Minus
} from 'lucide-react';

/**
 * BinBagRequestModal Component - Request additional bins or bags with payment
 * 
 * SOLID PRINCIPLES APPLIED:
 * - SRP (Single Responsibility): Only handles bin/bag requests
 * - OCP (Open/Closed): Open for extension with new request types
 * - DIP (Dependency Inversion): Depends on payment service abstraction
 * - ISP (Interface Segregation): Focused on request functionality
 * 
 * CODE SMELLS AVOIDED:
 * - No God class: Focused only on request functionality
 * - No duplicate code: Reusable components
 * - Clear separation: UI logic separated from business logic
 */
const BinBagRequestModal = ({ isOpen, onClose, userRole = 'RESIDENT', initialRequestType = 'bin', onBinAdded = null }) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [requestData, setRequestData] = useState({
    requestType: initialRequestType, // 'bin' or 'bag'
    binType: 'general',
    bagType: 'biodegradable',
    quantity: 1,
    deliveryAddress: '',
    specialInstructions: '',
    estimatedCost: 0,
    selectedLocation: null // Add location data
  });
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Update requestType when initialRequestType prop changes
  useEffect(() => {
    setRequestData(prev => ({
      ...prev,
      requestType: initialRequestType
    }));
  }, [initialRequestType]);

  // Pricing configuration
  const pricing = {
    bin: {
      general: { price: 25, name: 'General Waste Bin' },
      recyclable: { price: 30, name: 'Recyclable Waste Bin' },
      organic: { price: 35, name: 'Organic Waste Bin' },
      hazardous: { price: 50, name: 'Hazardous Waste Bin' },
      electronic: { price: 45, name: 'Electronic Waste Bin' }
    },
    bag: {
      biodegradable: { price: 2, name: 'Biodegradable Bags (Pack of 10)' },
      recyclable: { price: 3, name: 'Recyclable Bags (Pack of 10)' },
      heavy_duty: { price: 5, name: 'Heavy Duty Bags (Pack of 5)' },
      compostable: { price: 4, name: 'Compostable Bags (Pack of 10)' }
    }
  };

  // Calculate total cost
  const calculateTotalCost = () => {
    const basePrice = requestData.requestType === 'bin' 
      ? pricing.bin[requestData.binType]?.price || 0
      : pricing.bag[requestData.bagType]?.price || 0;
    
    return basePrice * requestData.quantity;
  };

  // Update request data
  const updateRequestData = (field, value) => {
    setRequestData(prev => ({
      ...prev,
      [field]: value,
      estimatedCost: calculateTotalCost()
    }));
  };

  // Handle quantity change
  const handleQuantityChange = (change) => {
    const newQuantity = Math.max(1, requestData.quantity + change);
    updateRequestData('quantity', newQuantity);
  };

  // Handle location selection from map
  const handleLocationSelect = (locationData) => {
    console.log('📍 Location selected:', locationData);
    updateRequestData('selectedLocation', locationData);
    updateRequestData('deliveryAddress', locationData.formattedAddress);
  };

  // Handle payment success
  const handlePaymentSuccess = async (paymentResult) => {
    console.log('🎉 PAYMENT SUCCESS HANDLER CALLED!', paymentResult);
    setPaymentSuccess(true);
    setIsProcessing(false);
    
    // Here you would typically send the request to your backend
    console.log('Payment successful:', paymentResult);
    console.log('Request data:', requestData);
    
    // Add the new bin/bag to the simulation
    const userId = 'RES-001'; // Use your existing ownerId format
    console.log('Using userId:', userId);
    
    // Save request to database
    try {
      const binRequestData = {
        requestType: requestData.requestType.toUpperCase(), // 'BIN' or 'BAG'
        itemType: requestData.requestType === 'bin' ? requestData.binType : requestData.bagType,
        quantity: requestData.quantity,
        customerName: user?.name || 'Demo User',
        customerEmail: user?.email || 'demo@example.com',
        customerPhone: user?.phone || '+1-555-0123',
        deliveryAddress: requestData.deliveryAddress || 'Kandy Town', // Use Kandy as default
        specialInstructions: requestData.specialInstructions || '',
        totalAmount: calculateTotalCost(),
        status: 'PENDING',
        paymentIntentId: paymentResult.id,
        paymentStatus: 'succeeded',
        priority: 'normal',
        latitude: requestData.selectedLocation?.latitude || 6.9271, // Send coordinates from map
        longitude: requestData.selectedLocation?.longitude || 79.8612
      };

      console.log('Saving bin request to database:', binRequestData);

      // Save to database via API - this will create both BinRequest and Bin entities
      const response = await fetch('http://localhost:8080/api/bin-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(binRequestData)
      });

      if (response.ok) {
        const savedRequest = await response.json();
        console.log('✅ Bin request saved to database:', savedRequest);
        console.log('✅ Bin entity also created in bins collection');
      } else {
        console.warn('⚠️ Failed to save to database, but continuing with simulation');
      }
    } catch (error) {
      console.error('❌ Error saving to database:', error);
      // Continue with simulation even if database save fails
    }
    
    if (requestData.requestType === 'bin') {
      // Add new bin to simulation
      const binType = requestData.binType.charAt(0).toUpperCase() + requestData.binType.slice(1);
      const location = requestData.deliveryAddress || 'Front Yard';
      
      console.log(`Adding ${requestData.quantity} new ${binType} bin(s) to simulation...`);
      
      for (let i = 0; i < requestData.quantity; i++) {
        const newBin = binSimulationService.addNewBin(userId, binType, location);
        console.log(`Added bin ${i + 1}:`, newBin);
      }
      
      console.log(`✅ Successfully added ${requestData.quantity} new ${binType} bin(s) to simulation`);
      
      // Notify parent component
      if (onBinAdded) {
        onBinAdded(requestData.quantity, binType);
      }
    } else if (requestData.requestType === 'bag') {
      // Add new bags to simulation
      const bagType = requestData.bagType.charAt(0).toUpperCase() + requestData.bagType.slice(1);
      const location = requestData.deliveryAddress || 'Front Yard';
      
      console.log(`Adding ${requestData.quantity} packs of ${bagType} bags to simulation...`);
      
      const newBags = binSimulationService.addNewBags(userId, bagType, requestData.quantity, location);
      console.log('Added bags:', newBags);
      
      console.log(`✅ Successfully added ${requestData.quantity} packs of ${bagType} bags to simulation`);
      
      // Notify parent component
      if (onBinAdded) {
        onBinAdded(requestData.quantity, bagType);
      }
    }
    
    // Simulate API call
    setTimeout(() => {
      alert(`Request submitted successfully! Your new ${requestData.requestType}(s) have been added to your dashboard and saved to the database. You will receive a confirmation email shortly.`);
      onClose();
    }, 2000);
  };

  // Handle payment error
  const handlePaymentError = (error) => {
    console.error('Payment error:', error);
    setIsProcessing(false);
  };

  // Submit bin/bag request to backend
  const submitBinRequest = async () => {
    try {
      setIsProcessing(true);
      
      const requestPayload = {
        userId: user?.userId || 'user123',
        requestType: requestData.requestType === 'bin' ? 'BIN' : 'BAG',
        itemType: requestData.requestType === 'bin' ? requestData.binType : requestData.bagType,
        quantity: requestData.quantity,
        unitPrice: requestData.requestType === 'bin' 
          ? pricing.bin[requestData.binType]?.price || 0
          : pricing.bag[requestData.bagType]?.price || 0,
        totalAmount: calculateTotalCost(),
        deliveryAddress: requestData.deliveryAddress,
        specialInstructions: requestData.specialInstructions
      };

      const response = await fetch('http://localhost:8080/api/payments/create-bin-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestPayload)
      });

      const result = await response.json();
      
      if (result.success) {
        // Payment intent created successfully
        return result.clientSecret;
      } else {
        throw new Error(result.error || 'Failed to create payment intent');
      }
    } catch (error) {
      console.error('Error creating bin request:', error);
      throw error;
    }
  };

  // Reset modal state
  const resetModal = () => {
    setCurrentStep(1);
    setRequestData({
      requestType: 'bin',
      binType: 'general',
      bagType: 'biodegradable',
      quantity: 1,
      deliveryAddress: '',
      specialInstructions: '',
      estimatedCost: 0
    });
    setPaymentSuccess(false);
    setIsProcessing(false);
  };

  // Handle close
  const handleClose = () => {
    resetModal();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900">
            Request {requestData.requestType === 'bin' ? 'Bin' : 'Bags'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'
              }`}>
                1
              </div>
              <span className="text-sm font-medium">Select Items</span>
            </div>
            <div className={`flex-1 h-0.5 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center space-x-2 ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'
              }`}>
                2
              </div>
              <span className="text-sm font-medium">Details</span>
            </div>
            <div className={`flex-1 h-0.5 ${currentStep >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center space-x-2 ${currentStep >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'
              }`}>
                3
              </div>
              <span className="text-sm font-medium">Payment</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {currentStep === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Select Request Type</h3>
              
              {/* Request Type Selection */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => updateRequestData('requestType', 'bin')}
                  className={`p-4 border-2 rounded-lg text-left transition-colors ${
                    requestData.requestType === 'bin' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Trash2 className="w-6 h-6 text-blue-600" />
                    <div>
                      <h4 className="font-medium text-gray-900">Waste Bin</h4>
                      <p className="text-sm text-gray-600">Smart IoT-enabled bins</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => updateRequestData('requestType', 'bag')}
                  className={`p-4 border-2 rounded-lg text-left transition-colors ${
                    requestData.requestType === 'bag' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Package className="w-6 h-6 text-green-600" />
                    <div>
                      <h4 className="font-medium text-gray-900">Waste Bags</h4>
                      <p className="text-sm text-gray-600">Eco-friendly bags</p>
                    </div>
                  </div>
                </button>
              </div>

              {/* Type Selection */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">
                  Select {requestData.requestType === 'bin' ? 'Bin' : 'Bag'} Type
                </h4>
                <div className="grid grid-cols-1 gap-3">
                  {Object.entries(pricing[requestData.requestType]).map(([key, item]) => (
                    <button
                      key={key}
                      onClick={() => updateRequestData(
                        requestData.requestType === 'bin' ? 'binType' : 'bagType', 
                        key
                      )}
                      className={`p-3 border rounded-lg text-left transition-colors ${
                        (requestData.requestType === 'bin' ? requestData.binType : requestData.bagType) === key
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-900">{item.name}</span>
                        <span className="text-sm text-gray-600">${item.price}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selection */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Quantity</h4>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-lg font-medium text-gray-900">{requestData.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Cost Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">Estimated Cost:</span>
                  <span className="text-xl font-semibold text-blue-600">
                    ${calculateTotalCost().toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setCurrentStep(2)}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Continue to Details
              </button>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Delivery Details</h3>
              
              {/* Map Location Picker */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Delivery Location *
                </label>
                <MapLocationPicker
                  onLocationSelect={handleLocationSelect}
                  initialLocation={requestData.selectedLocation}
                  height="300px"
                  className="mb-4"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Address *
                </label>
                <textarea
                  value={requestData.deliveryAddress}
                  onChange={(e) => updateRequestData('deliveryAddress', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Enter your delivery address..."
                />
                <p className="text-sm text-gray-500 mt-1">
                  💡 Click on the map above to select your exact location, or enter the address manually
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Instructions
                </label>
                <textarea
                  value={requestData.specialInstructions}
                  onChange={(e) => updateRequestData('specialInstructions', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={2}
                  placeholder="Any special delivery instructions..."
                />
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Order Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {requestData.quantity}x {pricing[requestData.requestType][
                        requestData.requestType === 'bin' ? requestData.binType : requestData.bagType
                      ].name}
                    </span>
                    <span className="font-medium">
                      ${(pricing[requestData.requestType][
                        requestData.requestType === 'bin' ? requestData.binType : requestData.bagType
                      ].price * requestData.quantity).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total:</span>
                    <span className="text-blue-600">${calculateTotalCost().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  disabled={!requestData.deliveryAddress.trim()}
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Proceed to Payment
                </button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Payment</h3>
              
              {paymentSuccess ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">Payment Successful!</h4>
                  <p className="text-gray-600 mb-4">
                    Your {requestData.requestType} request has been submitted successfully.
                  </p>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-green-800">
                      You will receive a confirmation email with delivery details within 24 hours.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Final Order Summary</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Item:</span>
                        <span>{pricing[requestData.requestType][
                          requestData.requestType === 'bin' ? requestData.binType : requestData.bagType
                        ].name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Quantity:</span>
                        <span>{requestData.quantity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Delivery Address:</span>
                        <span className="text-right max-w-xs truncate">{requestData.deliveryAddress}</span>
                      </div>
                      <div className="flex justify-between font-semibold text-lg border-t pt-2">
                        <span>Total Amount:</span>
                        <span className="text-blue-600">${calculateTotalCost().toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <StripePaymentForm
                    amount={calculateTotalCost()}
                    onPaymentSuccess={handlePaymentSuccess}
                    onPaymentError={handlePaymentError}
                    isLoading={isProcessing}
                    pickupData={{
                      customerName: user?.name || 'Customer',
                      customerEmail: user?.email || '',
                      address: requestData.deliveryAddress,
                      wasteType: requestData.requestType === 'bin' ? requestData.binType : requestData.bagType,
                      itemDescription: `${requestData.quantity}x ${pricing[requestData.requestType][
                        requestData.requestType === 'bin' ? requestData.binType : requestData.bagType
                      ].name}`,
                      requestId: `bin_request_${Date.now()}`
                    }}
                  />

                  <button
                    onClick={() => setCurrentStep(2)}
                    className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Back to Details
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BinBagRequestModal;
