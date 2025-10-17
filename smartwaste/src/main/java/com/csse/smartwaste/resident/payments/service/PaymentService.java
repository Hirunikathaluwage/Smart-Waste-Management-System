package com.csse.smartwaste.resident.payments.service;

import com.csse.smartwaste.resident.payments.entity.Payment;
import java.util.List;

public interface PaymentService {
    List<Payment> getAllPayments();

    Payment getPaymentById(String id);

    Payment createPayment(Payment payment);

    Payment updatePayment(String id, Payment payment);

    void deletePayment(String id);
}
