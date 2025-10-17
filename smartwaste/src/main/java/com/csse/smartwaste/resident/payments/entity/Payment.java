package com.csse.smartwaste.resident.payments.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Document(collection = "payments")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Payment {
    @Id
    private String id;

    private String residentId;
    private String invoiceId;
    private Double amount;
    private String method; // CARD | CASH | ONLINE
    private String status; // PENDING | COMPLETED | FAILED
    private Date paidAt;
}
