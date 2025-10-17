package com.csse.smartwaste.resident.payments.repository;

import com.csse.smartwaste.resident.payments.entity.Payment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentRepository extends MongoRepository<Payment, String> {
}
