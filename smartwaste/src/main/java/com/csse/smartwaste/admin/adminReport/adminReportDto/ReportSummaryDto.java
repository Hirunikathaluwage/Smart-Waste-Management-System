package com.csse.smartwaste.admin.adminReport.adminReportDto;

import java.util.List;

/**
 * ReportSummaryDto SRP: Holds the summarized results of a generated report.
 * OCP: Can be extended with new metrics (e.g., efficiency, revenue) without
 * modifying this class.
 */
public class ReportSummaryDto {

    private String reportType;
    private String area;
    private double totalWaste;
    private double recyclingRate;
    private List<String> highWasteZones;

    public ReportSummaryDto() {
    }

    // --- Getters and Setters ---
    public String getReportType() {
        return reportType;
    }

    public void setReportType(String reportType) {
        this.reportType = reportType;
    }

    public String getArea() {
        return area;
    }

    public void setArea(String area) {
        this.area = area;
    }

    public double getTotalWaste() {
        return totalWaste;
    }

    public void setTotalWaste(double totalWaste) {
        this.totalWaste = totalWaste;
    }

    public double getRecyclingRate() {
        return recyclingRate;
    }

    public void setRecyclingRate(double recyclingRate) {
        this.recyclingRate = recyclingRate;
    }

    public List<String> getHighWasteZones() {
        return highWasteZones;
    }

    public void setHighWasteZones(List<String> highWasteZones) {
        this.highWasteZones = highWasteZones;
    }
}
