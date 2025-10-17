package com.csse.smartwaste.admin.adminReport.reportEntity;

import java.time.LocalDateTime;
import java.util.Map;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * SRP: Represents a persisted report document. OCP: Extendable for new report
 * attributes without modifying existing logic.
 */
@Document(collection = "reports") // MongoDB will auto-create this collection
public class Report {

    @Id
    private String id;

    private String reportType;
    private String area;
    private String dateRange;
    private Map<String, Boolean> selectedWasteTypes;

    private double totalWaste;
    private double recyclingRate;

    private LocalDateTime createdAt = LocalDateTime.now();

    // --- Getters & Setters ---
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
