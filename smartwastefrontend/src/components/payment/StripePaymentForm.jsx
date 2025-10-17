import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { STRIPE_CONFIG } from '../../config/stripe';
// Get jsPDF from global window object
const getJsPDF = () => {
  if (window.jspdf && window.jspdf.jsPDF) {
    return window.jspdf.jsPDF;
  }
  throw new Error('jsPDF not loaded. Please refresh the page.');
};

// Initialize Stripe
const stripePromise = loadStripe(STRIPE_CONFIG.publishableKey);

const PaymentForm = ({ amount, onPaymentSuccess, onPaymentError, isLoading = false, pickupData = {} }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const generateInvoice = async (paymentResult) => {
    try {
      // Get jsPDF from global window object
      const jsPDF = getJsPDF();
      
      // Create new PDF document
      const doc = new jsPDF();
      
      // Set up colors
      const primaryColor = [76, 187, 23]; // Green color
      const darkGray = [51, 51, 51];
      const lightGray = [102, 102, 102];
      
      // Header
      doc.setFillColor(...primaryColor);
      doc.rect(0, 0, 210, 30, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('🌱 Smart Waste Management', 20, 20);
      
      // Invoice title
      doc.setTextColor(...darkGray);
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('INVOICE', 20, 50);
      
      // Invoice number
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...lightGray);
      doc.text(`Invoice #INV-${Date.now()}`, 20, 60);
      
      // Date
      const currentDate = new Date().toLocaleDateString();
      doc.text(`Date: ${currentDate}`, 150, 60);
      
      // Customer information
      doc.setTextColor(...darkGray);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Bill To:', 20, 80);
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(pickupData.customerName || 'Customer', 20, 90);
      doc.text(pickupData.customerEmail || '', 20, 100);
      doc.text(pickupData.address || '', 20, 110);
      
      // Payment information
      doc.setFont('helvetica', 'bold');
      doc.text('Payment Information:', 20, 130);
      doc.setFont('helvetica', 'normal');
      doc.text(`Payment ID: ${paymentResult.paymentIntentId}`, 20, 140);
      doc.text(`Method ID: ${paymentResult.paymentMethodId}`, 20, 150);
      doc.text(`Status: ✅ PAID`, 20, 160);
      
      // Service details table
      doc.setFont('helvetica', 'bold');
      doc.text('Service Details:', 20, 180);
      
      // Table header
      doc.setFillColor(248, 249, 250);
      doc.rect(20, 185, 170, 10, 'F');
      doc.setTextColor(...darkGray);
      doc.setFontSize(10);
      doc.text('Service', 25, 192);
      doc.text('Description', 80, 192);
      doc.text('Amount', 150, 192);
      
      // Table row
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...lightGray);
      doc.text('Waste Collection', 25, 202);
      doc.text(`${pickupData.wasteType || 'General'} - ${pickupData.itemDescription || 'Items'}`, 80, 202);
      doc.text(`$${paymentResult.amount.toFixed(2)}`, 150, 202);
      
      // Total amount
      doc.setFillColor(240, 248, 240);
      doc.rect(120, 210, 70, 15, 'F');
      doc.setTextColor(...primaryColor);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text(`Total: $${paymentResult.amount.toFixed(2)}`, 125, 220);
      
      // Footer
      doc.setTextColor(...lightGray);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Thank you for choosing Smart Waste Management!', 20, 250);
      doc.text('For any queries, contact us at support@smartwaste.com', 20, 260);
      doc.text(`Invoice generated on ${currentDate}`, 20, 270);
      
      // Download the PDF
      doc.save(`invoice-${paymentResult.paymentIntentId}.pdf`);
      
      console.log('PDF invoice generated successfully');
    } catch (error) {
      console.error('Error generating PDF invoice:', error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation(); // Prevent event from bubbling up to parent form

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);

    try {
      // Create payment method
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        setError(error.message);
        onPaymentError(error);
        return;
      }

      // Create payment intent on backend
      const response = await fetch('http://localhost:8080/api/payments/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          pickupRequestId: `pickup_${Date.now()}`,
          amount: amount.toString(),
          currency: 'usd'
        })
      });

      const paymentIntentData = await response.json();

      if (!paymentIntentData.success) {
        throw new Error(paymentIntentData.error || 'Failed to create payment intent');
      }

      // Confirm payment intent
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
        paymentIntentData.clientSecret,
        {
          payment_method: paymentMethod.id,
        }
      );

      if (confirmError) {
        setError(confirmError.message);
        onPaymentError(confirmError);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        setPaymentSuccess(true);
        const paymentResult = {
          paymentMethodId: paymentMethod.id,
          paymentIntentId: paymentIntent.id,
          amount: amount,
          currency: 'usd',
          status: 'succeeded'
        };
        
        onPaymentSuccess(paymentResult);
        
        // Generate and download invoice
        generateInvoice(paymentResult);
        
        // Don't reset the form - let the parent component handle the state
      } else {
        throw new Error('Payment was not successful');
      }

    } catch (err) {
      console.error('Payment error details:', err);
      const errorMessage = err.message || 'Payment failed. Please try again.';
      setError(errorMessage);
      onPaymentError(err);
      
      // Don't clear the form on error - let user retry
      console.log('Payment failed, form remains filled for retry');
    } finally {
      setIsProcessing(false);
    }
  };

  const cardElementOptions = {
    style: STRIPE_CONFIG.appearance,
    hidePostalCode: false,
  };

  return (
    <div className="stripe-payment-form" onClick={(e) => e.stopPropagation()}>
      {paymentSuccess ? (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Payment Successful!
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>Amount: ${amount.toFixed(2)} {STRIPE_CONFIG.currency.toUpperCase()}</p>
                  <p>Your payment has been processed successfully.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Amount:</span>
              <span className="text-lg font-semibold text-gray-900">
                ${amount.toFixed(2)} {STRIPE_CONFIG.currency.toUpperCase()}
              </span>
            </div>
          </div>
          
          {/* Download Invoice Button */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => generateInvoice({
                paymentMethodId: 'pm_test',
                paymentIntentId: 'pi_test_' + Date.now(),
                amount: amount,
                currency: 'usd',
                status: 'succeeded'
              })}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Download Invoice PDF</span>
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" onClick={(e) => e.stopPropagation()}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Card Information
            </label>
            <div className="p-3 border border-gray-300 rounded-lg bg-white">
              <CardElement options={cardElementOptions} />
            </div>
            {error && (
              <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
          </div>

          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Amount:</span>
              <span className="text-lg font-semibold text-gray-900">
                ${amount.toFixed(2)} {STRIPE_CONFIG.currency.toUpperCase()}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={!stripe || isProcessing || isLoading}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
              !stripe || isProcessing || isLoading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isProcessing ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing Payment...
              </div>
            ) : (
              `Pay $${amount.toFixed(2)}`
            )}
          </button>
        </form>
      )}

      <div className="mt-4 text-xs text-gray-500 text-center">
        <p>🔒 Your payment information is secure and encrypted</p>
        <p>Powered by Stripe</p>
        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-yellow-800 font-medium">🧪 Test Mode</p>
          <p className="text-yellow-700">Use test card: 4242 4242 4242 4242</p>
          <p className="text-yellow-700">Expiry: 12/34, CVC: 123</p>
        </div>
      </div>
    </div>
  );
};

const StripePaymentForm = ({ amount, onPaymentSuccess, onPaymentError, isLoading, pickupData }) => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm
        amount={amount}
        onPaymentSuccess={onPaymentSuccess}
        onPaymentError={onPaymentError}
        isLoading={isLoading}
        pickupData={pickupData}
      />
    </Elements>
  );
};

export default StripePaymentForm;
