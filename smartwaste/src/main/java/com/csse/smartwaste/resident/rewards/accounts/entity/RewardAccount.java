package com.csse.smartwaste.resident.rewards.accounts.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "reward_accounts")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class RewardAccount {
    @Id
    private String id;

    private String residentId;
    private Double totalPoints;
    private String tier; // BRONZE | SILVER | GOLD | PLATINUM
}
