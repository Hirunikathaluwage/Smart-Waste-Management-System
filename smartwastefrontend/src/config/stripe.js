// Stripe Configuration
// Get your keys from: https://dashboard.stripe.com/apikeys

export const STRIPE_CONFIG = {
  // Your Stripe publishable key (safe to use in frontend)
  publishableKey: 'pk_test_51RoanIBgt7VkeO797FFh74jOUIVSneevtaAd7RNTq046Zk6IrFZuqUMWlu25KBLwt7CHj4uFE6B0N2snv24teOfn00gRh73Xv1',
  
  // Currency settings
  currency: 'usd',
  
  // Appearance settings
  appearance: {
    theme: 'stripe',
    variables: {
      colorPrimary: '#3b82f6',
      colorBackground: '#ffffff',
      colorText: '#1f2937',
      colorDanger: '#ef4444',
      fontFamily: 'system-ui, sans-serif',
      spacingUnit: '4px',
      borderRadius: '8px',
    },
    rules: {
      '.Input': {
        border: '1px solid #d1d5db',
        borderRadius: '8px',
        padding: '12px',
        fontSize: '16px',
      },
      '.Input:focus': {
        borderColor: '#3b82f6',
        boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
      },
      '.Label': {
        fontSize: '14px',
        fontWeight: '500',
        color: '#374151',
        marginBottom: '6px',
      },
    },
  },
};

// Instructions:
// 1. This uses your test publishable key (safe for frontend)
// 2. The secret key should only be used in your backend
// 3. For production, replace with live keys
// 4. Never commit secret keys to version control
