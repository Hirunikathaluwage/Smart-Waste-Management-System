package com.csse.smartwaste.admin.adminReport.adminReportServices;

import com.csse.smartwaste.admin.adminReport.adminReportDto.ReportRequestDto;
import com.csse.smartwaste.admin.adminReport.adminReportDto.ReportSummaryDto;

/**
 * AdminReportService ISP & DIP: Defines high-level operations; implementation
 * details hidden.
 */
public interface AdminReportService {

    ReportSummaryDto generateReport(ReportRequestDto request);
}
