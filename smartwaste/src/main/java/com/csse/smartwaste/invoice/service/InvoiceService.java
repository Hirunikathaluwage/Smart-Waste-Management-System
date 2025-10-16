package com.csse.smartwaste.invoice.service;

import com.itextpdf.html2pdf.HtmlConverter;
import com.itextpdf.kernel.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;

/**
 * InvoiceService - Handles PDF invoice generation
 */
@Service
public class InvoiceService {

    /**
     * Generate PDF invoice for successful payment
     */
    public byte[] generateInvoicePdf(Map<String, Object> paymentData, Map<String, Object> pickupData) {
        try {
            String htmlContent = generateInvoiceHtml(paymentData, pickupData);
            return convertHtmlToPdf(htmlContent);
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate invoice PDF", e);
        }
    }

    /**
     * Generate HTML content for the invoice
     */
    public String generateInvoiceHtml(Map<String, Object> paymentData, Map<String, Object> pickupData) {
        String currentDate = LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
        String invoiceNumber = "INV-" + System.currentTimeMillis();
        
        String customerName = (String) pickupData.getOrDefault("customerName", "Customer");
        String customerEmail = (String) pickupData.getOrDefault("customerEmail", "");
        String pickupAddress = (String) pickupData.getOrDefault("address", "");
        String wasteType = (String) pickupData.getOrDefault("wasteType", "");
        String itemDescription = (String) pickupData.getOrDefault("itemDescription", "");
        
        Double amount = (Double) paymentData.getOrDefault("amount", 0.0);
        String paymentIntentId = (String) paymentData.getOrDefault("paymentIntentId", "");
        String paymentMethodId = (String) paymentData.getOrDefault("paymentMethodId", "");

        return String.format("""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Invoice - Smart Waste Management</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 20px;
                        background-color: #f5f5f5;
                    }
                    .invoice-container {
                        max-width: 800px;
                        margin: 0 auto;
                        background: white;
                        padding: 30px;
                        border-radius: 10px;
                        box-shadow: 0 0 20px rgba(0,0,0,0.1);
                    }
                    .header {
                        text-align: center;
                        border-bottom: 3px solid #4CBB17;
                        padding-bottom: 20px;
                        margin-bottom: 30px;
                    }
                    .company-name {
                        font-size: 28px;
                        font-weight: bold;
                        color: #4CBB17;
                        margin-bottom: 10px;
                    }
                    .company-tagline {
                        color: #666;
                        font-size: 14px;
                    }
                    .invoice-title {
                        font-size: 24px;
                        font-weight: bold;
                        color: #333;
                        margin-bottom: 5px;
                    }
                    .invoice-number {
                        color: #666;
                        font-size: 14px;
                    }
                    .invoice-details {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 30px;
                    }
                    .bill-to, .invoice-info {
                        flex: 1;
                    }
                    .section-title {
                        font-weight: bold;
                        color: #333;
                        margin-bottom: 10px;
                        font-size: 16px;
                    }
                    .info-row {
                        margin-bottom: 5px;
                        color: #666;
                    }
                    .service-details {
                        margin-bottom: 30px;
                    }
                    .service-table {
                        width: 100%%;
                        border-collapse: collapse;
                        margin-top: 15px;
                    }
                    .service-table th,
                    .service-table td {
                        padding: 12px;
                        text-align: left;
                        border-bottom: 1px solid #ddd;
                    }
                    .service-table th {
                        background-color: #f8f9fa;
                        font-weight: bold;
                        color: #333;
                    }
                    .total-section {
                        margin-top: 20px;
                        text-align: right;
                    }
                    .total-amount {
                        font-size: 20px;
                        font-weight: bold;
                        color: #4CBB17;
                        padding: 15px;
                        background-color: #f0f8f0;
                        border-radius: 5px;
                        display: inline-block;
                    }
                    .payment-info {
                        margin-top: 30px;
                        padding: 20px;
                        background-color: #f8f9fa;
                        border-radius: 5px;
                    }
                    .payment-status {
                        color: #28a745;
                        font-weight: bold;
                        font-size: 16px;
                    }
                    .footer {
                        margin-top: 40px;
                        text-align: center;
                        color: #666;
                        font-size: 12px;
                        border-top: 1px solid #ddd;
                        padding-top: 20px;
                    }
                </style>
            </head>
            <body>
                <div class="invoice-container">
                    <div class="header">
                        <div class="company-name">🌱 Smart Waste Management</div>
                        <div class="company-tagline">Eco-Friendly Waste Collection Services</div>
                        <div class="invoice-title">INVOICE</div>
                        <div class="invoice-number">Invoice #%s</div>
                    </div>
                    
                    <div class="invoice-details">
                        <div class="bill-to">
                            <div class="section-title">Bill To:</div>
                            <div class="info-row"><strong>%s</strong></div>
                            <div class="info-row">%s</div>
                            <div class="info-row">%s</div>
                        </div>
                        <div class="invoice-info">
                            <div class="section-title">Invoice Details:</div>
                            <div class="info-row"><strong>Date:</strong> %s</div>
                            <div class="info-row"><strong>Payment ID:</strong> %s</div>
                            <div class="info-row"><strong>Method ID:</strong> %s</div>
                        </div>
                    </div>
                    
                    <div class="service-details">
                        <div class="section-title">Service Details:</div>
                        <table class="service-table">
                            <thead>
                                <tr>
                                    <th>Service</th>
                                    <th>Description</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Waste Collection</td>
                                    <td>%s - %s</td>
                                    <td>$%.2f</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    
                    <div class="total-section">
                        <div class="total-amount">Total: $%.2f</div>
                    </div>
                    
                    <div class="payment-info">
                        <div class="section-title">Payment Information:</div>
                        <div class="info-row"><strong>Status:</strong> <span class="payment-status">✅ PAID</span></div>
                        <div class="info-row"><strong>Payment Method:</strong> Credit/Debit Card (Stripe)</div>
                        <div class="info-row"><strong>Transaction Date:</strong> %s</div>
                    </div>
                    
                    <div class="footer">
                        <p>Thank you for choosing Smart Waste Management!</p>
                        <p>For any queries, contact us at support@smartwaste.com</p>
                        <p>This is an automated invoice generated on %s</p>
                    </div>
                </div>
            </body>
            </html>
            """, 
            invoiceNumber,
            customerName,
            customerEmail,
            pickupAddress,
            currentDate,
            paymentIntentId,
            paymentMethodId,
            wasteType,
            itemDescription,
            amount,
            amount,
            currentDate,
            currentDate
        );
    }

    /**
     * Convert HTML to PDF using iText
     */
    private byte[] convertHtmlToPdf(String htmlContent) throws IOException {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        
        try (PdfWriter writer = new PdfWriter(outputStream)) {
            HtmlConverter.convertToPdf(htmlContent, writer);
        }
        
        return outputStream.toByteArray();
    }
}
