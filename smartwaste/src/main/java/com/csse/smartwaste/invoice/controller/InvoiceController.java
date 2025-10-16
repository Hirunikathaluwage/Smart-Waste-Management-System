package com.csse.smartwaste.invoice.controller;

import com.csse.smartwaste.invoice.service.InvoiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * InvoiceController - REST controller for invoice operations
 */
@RestController
@RequestMapping("/api/invoices")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class InvoiceController {

    @Autowired
    private InvoiceService invoiceService;

    /**
     * Generate and download invoice as HTML (temporary solution)
     */
    @PostMapping("/generate")
    public ResponseEntity<String> generateInvoice(@RequestBody Map<String, Object> requestData) {
        try {
            Map<String, Object> paymentData = (Map<String, Object>) requestData.get("paymentData");
            Map<String, Object> pickupData = (Map<String, Object>) requestData.get("pickupData");
            
            String htmlContent = invoiceService.generateInvoiceHtml(paymentData, pickupData);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.TEXT_HTML);
            headers.setContentDispositionFormData("attachment", "invoice.html");
            headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");
            
            return new ResponseEntity<>(htmlContent, headers, HttpStatus.OK);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error generating invoice: " + e.getMessage());
        }
    }

    /**
     * Generate invoice for successful payment
     */
    @PostMapping("/payment-success")
    public ResponseEntity<Map<String, Object>> generatePaymentInvoice(@RequestBody Map<String, Object> requestData) {
        try {
            Map<String, Object> paymentData = (Map<String, Object>) requestData.get("paymentData");
            Map<String, Object> pickupData = (Map<String, Object>) requestData.get("pickupData");
            
            byte[] pdfBytes = invoiceService.generateInvoicePdf(paymentData, pickupData);
            
            // Return success response with invoice download link
            Map<String, Object> response = Map.of(
                "success", true,
                "message", "Invoice generated successfully",
                "invoiceId", "INV-" + System.currentTimeMillis(),
                "downloadUrl", "/api/invoices/download/" + System.currentTimeMillis()
            );
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> response = Map.of(
                "success", false,
                "error", "Failed to generate invoice: " + e.getMessage()
            );
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
