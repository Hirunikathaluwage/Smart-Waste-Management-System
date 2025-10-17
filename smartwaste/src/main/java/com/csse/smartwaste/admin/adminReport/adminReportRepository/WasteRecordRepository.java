package com.csse.smartwaste.admin.adminReport.adminReportRepository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.csse.smartwaste.common.model.WasteRecord;

/**
 * WasteRecordRepository DIP: Service layer depends on this interface, not the
 * concrete database logic.
 */
public interface WasteRecordRepository extends MongoRepository<WasteRecord, String> {

    List<WasteRecord> findByArea(String area);

    List<WasteRecord> findByWasteType(String wasteType);
}
