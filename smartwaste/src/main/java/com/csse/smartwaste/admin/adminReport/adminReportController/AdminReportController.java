package com.csse.smartwaste.admin.adminReport.adminReportController;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.csse.smartwaste.admin.adminReport.adminReportDto.ReportRequestDto;
import com.csse.smartwaste.admin.adminReport.adminReportDto.ReportSummaryDto;
import com.csse.smartwaste.admin.adminReport.adminReportServices.AdminReportService;
import com.csse.smartwaste.admin.adminReport.reportEntity.Report;

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

    //  Get all saved reports
    @GetMapping("/all")
    public ResponseEntity<List<Report>> getAllReports() {
        List<Report> reports = adminReportService.getAllReports();
        return ResponseEntity.ok(reports);
    }

    //  Get report by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getReportById(@PathVariable String id) {
        return adminReportService.getReportById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
