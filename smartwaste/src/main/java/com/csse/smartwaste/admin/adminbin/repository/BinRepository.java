package com.csse.smartwaste.admin.adminbin.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.csse.smartwaste.admin.adminbin.entity.Bin;

@Repository("adminBinRepository") // unique bean name
public interface BinRepository extends MongoRepository<Bin, String> {
}
