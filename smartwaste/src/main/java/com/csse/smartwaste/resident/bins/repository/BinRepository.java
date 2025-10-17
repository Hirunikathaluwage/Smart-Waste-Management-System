package com.csse.smartwaste.resident.bins.repository;

import com.csse.smartwaste.resident.bins.entity.Bin;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BinRepository extends MongoRepository<Bin, String> {
}
