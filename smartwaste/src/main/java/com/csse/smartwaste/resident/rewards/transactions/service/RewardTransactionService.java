package com.csse.smartwaste.resident.rewards.transactions.service;

import com.csse.smartwaste.resident.rewards.transactions.entity.RewardTransaction;
import java.util.List;

public interface RewardTransactionService {
    List<RewardTransaction> getAllTransactions();

    RewardTransaction getTransactionById(String id);

    RewardTransaction createTransaction(RewardTransaction transaction);

    RewardTransaction updateTransaction(String id, RewardTransaction transaction);

    void deleteTransaction(String id);
}
