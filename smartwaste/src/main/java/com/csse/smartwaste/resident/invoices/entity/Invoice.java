package com.csse.smartwaste.resident.invoices.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

@Document(collection = "invoices")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Invoice {
    @Id
    private String id;

    private String accountId; // Resident User
    private String model; // PAYT | FLAT | SUBSCRIPTION

    private Period period;
    private List<LineItem> lineItems;
    private Double total;
    private String status; // ISSUED | PAID | VOID
    private Date issuedAt;
    private Date paidAt;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Period {
        private Date from;
        private Date to;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class LineItem {
        private String type; // COLLECTION | SERVICE_FEE
        private Double amount;
    }
}
