package com.csse.smartwaste.resident.rewards.accounts.repository;

import com.csse.smartwaste.resident.rewards.accounts.entity.RewardAccount;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RewardAccountRepository extends MongoRepository<RewardAccount, String> {
}
