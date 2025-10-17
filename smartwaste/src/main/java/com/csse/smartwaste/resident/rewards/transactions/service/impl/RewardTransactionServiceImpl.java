package com.csse.smartwaste.resident.rewards.transactions.service.impl;

import com.csse.smartwaste.resident.rewards.transactions.entity.RewardTransaction;
import com.csse.smartwaste.resident.rewards.transactions.repository.RewardTransactionRepository;
import com.csse.smartwaste.resident.rewards.transactions.service.RewardTransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RewardTransactionServiceImpl implements RewardTransactionService {

    @Autowired
    private RewardTransactionRepository repository;

    @Override
    public List<RewardTransaction> getAllTransactions() {
        return repository.findAll();
    }

    @Override
    public RewardTransaction getTransactionById(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reward transaction not found"));
    }

    @Override
    public RewardTransaction createTransaction(RewardTransaction transaction) {
        return repository.save(transaction);
    }

    @Override
    public RewardTransaction updateTransaction(String id, RewardTransaction transaction) {
        RewardTransaction existing = getTransactionById(id);
        transaction.setId(existing.getId());
        return repository.save(transaction);
    }

    @Override
    public void deleteTransaction(String id) {
        repository.deleteById(id);
    }
}
