import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { STRIPE_CONFIG } from '../../config/stripe';

// Initialize Stripe
const stripePromise = loadStripe(STRIPE_CONFIG.publishableKey);

const PaymentForm = ({ amount, onPaymentSuccess, onPaymentError, isLoading = false }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

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
      const response = await fetch('/api/payments/create-payment-intent', {
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
        onPaymentSuccess({
          paymentMethodId: paymentMethod.id,
          paymentIntentId: paymentIntent.id,
          amount: amount,
          currency: 'usd',
          status: 'succeeded'
        });
      } else {
        throw new Error('Payment was not successful');
      }

    } catch (err) {
      const errorMessage = err.message || 'Payment failed. Please try again.';
      setError(errorMessage);
      onPaymentError(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const cardElementOptions = {
    style: STRIPE_CONFIG.appearance,
    hidePostalCode: false,
  };

  return (
    <div className="stripe-payment-form">
      <form onSubmit={handleSubmit} className="space-y-4">
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

      <div className="mt-4 text-xs text-gray-500 text-center">
        <p>🔒 Your payment information is secure and encrypted</p>
        <p>Powered by Stripe</p>
      </div>
    </div>
  );
};

const StripePaymentForm = ({ amount, onPaymentSuccess, onPaymentError, isLoading }) => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm
        amount={amount}
        onPaymentSuccess={onPaymentSuccess}
        onPaymentError={onPaymentError}
        isLoading={isLoading}
      />
    </Elements>
  );
};

export default StripePaymentForm;
