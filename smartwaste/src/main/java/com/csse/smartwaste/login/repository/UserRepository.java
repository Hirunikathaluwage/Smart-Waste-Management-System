package com.csse.smartwaste.login.repository;

import com.csse.smartwaste.login.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
}
