package com.csse.smartwaste.admin.adminReport.adminReportController;

import java.io.ByteArrayOutputStream;
import java.util.List;
import java.util.Map;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
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

/**
 * AdminReportController
 *
 * SRP: Handles all admin-side report operations (generate, view, delete,
 * export). OCP: New features like delete/PDF export added without breaking
 * existing functionality. DIP: Delegates all business logic to
 * AdminReportService interface.
 */
@RestController
@RequestMapping("/api/admin/reports")
@CrossOrigin(origins = "*")
public class AdminReportController {

    private final AdminReportService adminReportService;

    public AdminReportController(AdminReportService adminReportService) {
        this.adminReportService = adminReportService;
    }

    /**
     * Generate and save a new report.
     */
    @PostMapping("/generate")
    public ResponseEntity<ReportSummaryDto> generateReport(@RequestBody ReportRequestDto request) {
        ReportSummaryDto report = adminReportService.generateReport(request);
        return ResponseEntity.ok(report);
    }

    /**
     * Fetch all saved reports.
     */
    @GetMapping("/all")
    public ResponseEntity<List<Report>> getAllReports() {
        List<Report> reports = adminReportService.getAllReports();
        return ResponseEntity.ok(reports);
    }

    /**
     * Fetch a specific report by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getReportById(@PathVariable String id) {
        return adminReportService.getReportById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * ✅ NEW: Delete a report by ID.
     *
     * SRP: Only handles HTTP request/response mapping. OCP: Added as a new
     * endpoint without modifying existing ones.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReport(@PathVariable String id) {
        boolean deleted = adminReportService.deleteReport(id);
        if (deleted) {
            return ResponseEntity.ok(Map.of(
                    "message", "Report deleted successfully",
                    "reportId", id
            ));
        } else {
            return ResponseEntity.status(404).body(Map.of(
                    "error", "Report not found",
                    "reportId", id
            ));
        }
    }

    /**
     * Generate and download report as PDF. Returns a dynamically created PDF
     * stream.
     */
    @GetMapping("/pdf/{id}")
    public ResponseEntity<?> downloadReportPdf(@PathVariable String id) {
        return adminReportService.getReportById(id)
                .map(report -> {
                    try {
                        ByteArrayOutputStream out = new ByteArrayOutputStream();
                        com.itextpdf.text.Document document = new com.itextpdf.text.Document();
                        com.itextpdf.text.pdf.PdfWriter.getInstance(document, out);
                        document.open();

                        // --- Header Section ---
                        com.itextpdf.text.Font titleFont
                                = new com.itextpdf.text.Font(com.itextpdf.text.Font.FontFamily.HELVETICA, 18, com.itextpdf.text.Font.BOLD);
                        document.add(new com.itextpdf.text.Paragraph("Smart Waste Management Report", titleFont));
                        document.add(new com.itextpdf.text.Paragraph("Generated On: " + java.time.LocalDateTime.now()));
                        document.add(new com.itextpdf.text.Paragraph(" "));
                        document.add(new com.itextpdf.text.Paragraph("----------------------------------------"));
                        document.add(new com.itextpdf.text.Paragraph(" "));

                        // --- Report Details ---
                        document.add(new com.itextpdf.text.Paragraph("Report Type: "
                                + (report.getReportType() != null ? report.getReportType() : "N/A")));
                        document.add(new com.itextpdf.text.Paragraph("Area: "
                                + (report.getArea() != null ? report.getArea() : "N/A")));
                        document.add(new com.itextpdf.text.Paragraph("Date Range: "
                                + (report.getDateRange() != null ? report.getDateRange() : "N/A")));
                        document.add(new com.itextpdf.text.Paragraph("Total Waste: " + report.getTotalWaste() + " kg"));
                        document.add(new com.itextpdf.text.Paragraph("Recycling Rate: " + report.getRecyclingRate() + "%"));
                        document.add(new com.itextpdf.text.Paragraph(" "));

                        // --- Selected Waste Types ---
                        document.add(new com.itextpdf.text.Paragraph("Selected Waste Types:"));
                        document.add(new com.itextpdf.text.Paragraph(" "));

                        if (report.getSelectedWasteTypes() != null && !report.getSelectedWasteTypes().isEmpty()) {
                            for (Map.Entry<String, Boolean> entry : report.getSelectedWasteTypes().entrySet()) {
                                String line = "• " + entry.getKey() + ": " + (entry.getValue() ? "Included" : "Excluded");
                                document.add(new com.itextpdf.text.Paragraph(line));
                            }
                        } else {
                            document.add(new com.itextpdf.text.Paragraph("No waste types selected."));
                        }

                        document.add(new com.itextpdf.text.Paragraph(" "));
                        document.add(new com.itextpdf.text.Paragraph("----------------------------------------"));
                        document.add(new com.itextpdf.text.Paragraph("End of Report"));
                        document.close();

                        byte[] pdfBytes = out.toByteArray();
                        return ResponseEntity.ok()
                                .header("Content-Disposition", "attachment; filename=report-" + report.getId() + ".pdf")
                                .contentType(MediaType.APPLICATION_PDF)
                                .body(pdfBytes);

                    } catch (Exception e) {
                        e.printStackTrace();
                        return ResponseEntity.internalServerError()
                                .body(Map.of("error", "Failed to generate PDF", "message", e.getMessage()));
                    }
                })
                .orElse(ResponseEntity.status(404)
                        .body(Map.of("error", "Report Not Found", "id", id)));
    }
}
