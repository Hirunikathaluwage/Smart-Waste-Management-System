package com.csse.smartwaste.admin.adminbin.repository;

import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import com.csse.smartwaste.admin.adminbin.entity.Bin;

@Repository("residentBinRepository")
public interface ResidentBinRepository extends MongoRepository<Bin, String> {

    List<Bin> findByOwnerId(String ownerId);
}
