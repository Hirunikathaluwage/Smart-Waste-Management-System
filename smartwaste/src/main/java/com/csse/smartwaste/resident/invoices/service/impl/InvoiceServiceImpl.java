package com.csse.smartwaste.resident.invoices.service.impl;

import com.csse.smartwaste.resident.invoices.entity.Invoice;
import com.csse.smartwaste.resident.invoices.repository.InvoiceRepository;
import com.csse.smartwaste.resident.invoices.service.InvoiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InvoiceServiceImpl implements InvoiceService {

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Override
    public List<Invoice> getAllInvoices() {
        return invoiceRepository.findAll();
    }

    @Override
    public Invoice getInvoiceById(String id) {
        return invoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));
    }

    @Override
    public Invoice createInvoice(Invoice invoice) {
        return invoiceRepository.save(invoice);
    }

    @Override
    public Invoice updateInvoice(String id, Invoice invoice) {
        Invoice existing = getInvoiceById(id);
        invoice.setId(existing.getId());
        return invoiceRepository.save(invoice);
    }

    @Override
    public void deleteInvoice(String id) {
        invoiceRepository.deleteById(id);
    }
}
