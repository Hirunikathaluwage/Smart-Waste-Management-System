package com.csse.smartwaste.resident.rewards.accounts.service.impl;

import com.csse.smartwaste.resident.rewards.accounts.entity.RewardAccount;
import com.csse.smartwaste.resident.rewards.accounts.repository.RewardAccountRepository;
import com.csse.smartwaste.resident.rewards.accounts.service.RewardAccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RewardAccountServiceImpl implements RewardAccountService {

    @Autowired
    private RewardAccountRepository repository;

    @Override
    public List<RewardAccount> getAllAccounts() {
        return repository.findAll();
    }

    @Override
    public RewardAccount getAccountById(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reward account not found"));
    }

    @Override
    public RewardAccount createAccount(RewardAccount account) {
        return repository.save(account);
    }

    @Override
    public RewardAccount updateAccount(String id, RewardAccount account) {
        RewardAccount existing = getAccountById(id);
        account.setId(existing.getId());
        return repository.save(account);
    }

    @Override
    public void deleteAccount(String id) {
        repository.deleteById(id);
    }
}
