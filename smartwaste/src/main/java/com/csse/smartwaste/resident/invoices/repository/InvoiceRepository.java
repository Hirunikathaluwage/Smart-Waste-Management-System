package com.csse.smartwaste.resident.invoices.repository;

import com.csse.smartwaste.resident.invoices.entity.Invoice;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InvoiceRepository extends MongoRepository<Invoice, String> {
}
