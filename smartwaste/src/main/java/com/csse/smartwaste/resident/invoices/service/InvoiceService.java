package com.csse.smartwaste.resident.invoices.service;

import com.csse.smartwaste.resident.invoices.entity.Invoice;
import java.util.List;

public interface InvoiceService {
    List<Invoice> getAllInvoices();

    Invoice getInvoiceById(String id);

    Invoice createInvoice(Invoice invoice);

    Invoice updateInvoice(String id, Invoice invoice);

    void deleteInvoice(String id);
}
