package com.csse.smartwaste.resident.rewards.accounts.service;

import com.csse.smartwaste.resident.rewards.accounts.entity.RewardAccount;
import java.util.List;

public interface RewardAccountService {
    List<RewardAccount> getAllAccounts();

    RewardAccount getAccountById(String id);

    RewardAccount createAccount(RewardAccount account);

    RewardAccount updateAccount(String id, RewardAccount account);

    void deleteAccount(String id);
}
