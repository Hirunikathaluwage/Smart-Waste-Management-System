package com.csse.smartwaste.resident.rewards.accounts.controller;

import com.csse.smartwaste.resident.rewards.accounts.entity.RewardAccount;
import com.csse.smartwaste.resident.rewards.accounts.service.RewardAccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resident/rewards/accounts")
@CrossOrigin("*")
public class RewardAccountController {

    @Autowired
    private RewardAccountService service;

    @GetMapping
    public List<RewardAccount> getAll() {
        return service.getAllAccounts();
    }

    @GetMapping("/{id}")
    public RewardAccount getById(@PathVariable String id) {
        return service.getAccountById(id);
    }

    @PostMapping
    public RewardAccount create(@RequestBody RewardAccount account) {
        return service.createAccount(account);
    }

    @PutMapping("/{id}")
    public RewardAccount update(@PathVariable String id, @RequestBody RewardAccount account) {
        return service.updateAccount(id, account);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        service.deleteAccount(id);
    }
}
