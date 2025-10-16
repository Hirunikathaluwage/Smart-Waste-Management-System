package com.csse.smartwaste.payment.service;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.model.PaymentMethod;
import com.stripe.param.PaymentIntentCreateParams;
import com.stripe.param.PaymentMethodCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

/**
 * StripePaymentService - Handles Stripe payment processing
 */
@Service
public class StripePaymentService {

    @Value("${stripe.secret.key:sk_test_51RoanIBgt7VkeO796Id9w7jCURNd7MbHCAPGJLbc1dUXKo01OMTyFqar60UHzEfo4P2ZfKAzuU6FrqXM4oduYKEv00TEGTVw2m}")
    private String stripeSecretKey;

    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeSecretKey;
    }

    /**
     * Create a payment intent for the pickup request
     */
    public PaymentIntent createPaymentIntent(BigDecimal amount, String currency, String pickupRequestId) throws StripeException {
        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(amount.multiply(new BigDecimal("100")).longValue()) // Convert to cents
                .setCurrency(currency.toLowerCase())
                .setDescription("Waste Pickup Request - " + pickupRequestId)
                .putMetadata("pickup_request_id", pickupRequestId)
                .setAutomaticPaymentMethods(
                        PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                .setEnabled(true)
                                .build()
                )
                .build();

        return PaymentIntent.create(params);
    }

    /**
     * Confirm a payment intent
     */
    public PaymentIntent confirmPaymentIntent(String paymentIntentId, String paymentMethodId) throws StripeException {
        PaymentIntent paymentIntent = PaymentIntent.retrieve(paymentIntentId);
        
        Map<String, Object> params = new HashMap<>();
        params.put("payment_method", paymentMethodId);
        
        return paymentIntent.confirm(params);
    }

    /**
     * Retrieve a payment intent
     */
    public PaymentIntent getPaymentIntent(String paymentIntentId) throws StripeException {
        return PaymentIntent.retrieve(paymentIntentId);
    }

    /**
     * Create a payment method
     */
    public PaymentMethod createPaymentMethod(String cardToken) throws StripeException {
        PaymentMethodCreateParams params = PaymentMethodCreateParams.builder()
                .setType(PaymentMethodCreateParams.Type.CARD)
                .build();

        return PaymentMethod.create(params);
    }

    /**
     * Process payment for pickup request
     */
    public Map<String, Object> processPayment(BigDecimal amount, String currency, String pickupRequestId) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            // Create payment intent
            PaymentIntent paymentIntent = createPaymentIntent(amount, currency, pickupRequestId);
            
            result.put("success", true);
            result.put("paymentIntentId", paymentIntent.getId());
            result.put("clientSecret", paymentIntent.getClientSecret());
            result.put("amount", amount);
            result.put("currency", currency);
            
        } catch (StripeException e) {
            result.put("success", false);
            result.put("error", e.getMessage());
            result.put("errorCode", e.getCode());
        }
        
        return result;
    }

    /**
     * Verify payment completion
     */
    public boolean verifyPayment(String paymentIntentId) {
        try {
            PaymentIntent paymentIntent = getPaymentIntent(paymentIntentId);
            return "succeeded".equals(paymentIntent.getStatus());
        } catch (StripeException e) {
            return false;
        }
    }
}
