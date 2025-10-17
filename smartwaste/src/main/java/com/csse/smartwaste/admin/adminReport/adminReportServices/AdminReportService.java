package com.csse.smartwaste.admin.adminReport.adminReportServices;

import java.util.List;
import java.util.Optional;

import com.csse.smartwaste.admin.adminReport.adminReportDto.ReportRequestDto;
import com.csse.smartwaste.admin.adminReport.adminReportDto.ReportSummaryDto;
import com.csse.smartwaste.admin.adminReport.reportEntity.Report;

public interface AdminReportService {

    ReportSummaryDto generateReport(ReportRequestDto request);

    List<Report> getAllReports();

    Optional<Report> getReportById(String id);
}
