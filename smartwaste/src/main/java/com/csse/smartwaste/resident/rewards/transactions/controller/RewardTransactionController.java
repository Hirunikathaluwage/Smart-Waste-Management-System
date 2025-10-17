package com.csse.smartwaste.resident.rewards.transactions.controller;

import com.csse.smartwaste.resident.rewards.transactions.entity.RewardTransaction;
import com.csse.smartwaste.resident.rewards.transactions.service.RewardTransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resident/rewards/transactions")
@CrossOrigin("*")
public class RewardTransactionController {

    @Autowired
    private RewardTransactionService service;

    @GetMapping
    public List<RewardTransaction> getAll() {
        return service.getAllTransactions();
    }

    @GetMapping("/{id}")
    public RewardTransaction getById(@PathVariable String id) {
        return service.getTransactionById(id);
    }

    @PostMapping
    public RewardTransaction create(@RequestBody RewardTransaction transaction) {
        return service.createTransaction(transaction);
    }

    @PutMapping("/{id}")
    public RewardTransaction update(@PathVariable String id, @RequestBody RewardTransaction transaction) {
        return service.updateTransaction(id, transaction);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        service.deleteTransaction(id);
    }
}
