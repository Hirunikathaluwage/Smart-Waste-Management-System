package com.csse.smartwaste.admin.adminReport.adminReportController;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.csse.smartwaste.admin.adminReport.adminReportDto.ReportRequestDto;
import com.csse.smartwaste.admin.adminReport.adminReportDto.ReportSummaryDto;
import com.csse.smartwaste.admin.adminReport.adminReportServices.AdminReportService;

/**
 * AdminReportController SRP: Exposes endpoints for generating reports. OCP: Can
 * add new report endpoints without changing existing ones.
 */
@RestController
@RequestMapping("/api/admin/reports")
@CrossOrigin(origins = "*")
public class AdminReportController {

    private final AdminReportService adminReportService;

    public AdminReportController(AdminReportService adminReportService) {
        this.adminReportService = adminReportService;
    }

    @PostMapping("/generate")
    public ResponseEntity<ReportSummaryDto> generateReport(@RequestBody ReportRequestDto request) {
        ReportSummaryDto report = adminReportService.generateReport(request);
        return ResponseEntity.ok(report);
    }
}
