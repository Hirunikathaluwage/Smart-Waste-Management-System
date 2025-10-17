package com.csse.smartwaste.admin.adminReport.adminReportDto;

import java.util.Map;

/**
 * ReportRequestDto SRP: Captures report generation parameters from the
 * frontend.
 */
public class ReportRequestDto {

    private String reportType;
    private String area;
    private String dateRange;
    private Map<String, Boolean> selectedWasteTypes;

    public ReportRequestDto() {
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

    public String getDateRange() {
        return dateRange;
    }

    public void setDateRange(String dateRange) {
        this.dateRange = dateRange;
    }

    public Map<String, Boolean> getSelectedWasteTypes() {
        return selectedWasteTypes;
    }

    public void setSelectedWasteTypes(Map<String, Boolean> selectedWasteTypes) {
        this.selectedWasteTypes = selectedWasteTypes;
    }
}
