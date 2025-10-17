package com.csse.smartwaste.admin.adminReport.adminReportRepository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.csse.smartwaste.admin.adminReport.reportEntity.Report;

/**
 * ReportRepository SRP: Handles persistence of generated reports.
 */
@Repository
public interface ReportRepository extends MongoRepository<Report, String> {
}
