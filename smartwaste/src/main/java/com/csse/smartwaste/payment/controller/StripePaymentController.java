package com.csse.smartwaste.payment.controller;

import com.csse.smartwaste.payment.service.StripePaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

/**
 * StripePaymentController - REST controller for Stripe payment operations
 */
@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class StripePaymentController {

    @Autowired
    private StripePaymentService stripePaymentService;

    /**
     * Create payment intent for pickup request
     */
    @PostMapping("/create-payment-intent")
    public ResponseEntity<Map<String, Object>> createPaymentIntent(
            @RequestParam String pickupRequestId,
            @RequestParam BigDecimal amount,
            @RequestParam(defaultValue = "usd") String currency) {
        
        Map<String, Object> result = stripePaymentService.processPayment(amount, currency, pickupRequestId);
        
        if ((Boolean) result.get("success")) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.badRequest().body(result);
        }
    }

    /**
     * Verify payment completion
     */
    @GetMapping("/verify-payment/{paymentIntentId}")
    public ResponseEntity<Map<String, Object>> verifyPayment(@PathVariable String paymentIntentId) {
        Map<String, Object> result = Map.of(
            "success", stripePaymentService.verifyPayment(paymentIntentId),
            "paymentIntentId", paymentIntentId
        );
        
        return ResponseEntity.ok(result);
    }

    /**
     * Get payment status
     */
    @GetMapping("/status/{paymentIntentId}")
    public ResponseEntity<Map<String, Object>> getPaymentStatus(@PathVariable String paymentIntentId) {
        try {
            var paymentIntent = stripePaymentService.getPaymentIntent(paymentIntentId);
            Map<String, Object> result = Map.of(
                "success", true,
                "paymentIntentId", paymentIntentId,
                "status", paymentIntent.getStatus(),
                "amount", paymentIntent.getAmount(),
                "currency", paymentIntent.getCurrency()
            );
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, Object> result = Map.of(
                "success", false,
                "error", e.getMessage()
            );
            return ResponseEntity.badRequest().body(result);
        }
    }
}
