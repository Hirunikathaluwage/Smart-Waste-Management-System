package com.csse.smartwaste.resident.rewards.transactions.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Document(collection = "reward_transactions")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class RewardTransaction {
    @Id
    private String id;

    private String accountId;
    private String type; // EARN | REDEEM
    private Double points;
    private String description;
    private Date transactionDate;
}
