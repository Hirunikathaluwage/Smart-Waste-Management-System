package com.csse.smartwaste.resident.rewards.transactions.repository;

import com.csse.smartwaste.resident.rewards.transactions.entity.RewardTransaction;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RewardTransactionRepository extends MongoRepository<RewardTransaction, String> {
}
