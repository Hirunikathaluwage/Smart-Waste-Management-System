package com.csse.smartwaste.admin.adminanalytics.dto;

import java.util.List;

/**
 * RecyclingAnalyticsDto SRP: Encapsulates all recycling analytics metrics. OCP:
 * Can be extended with new fields without modifying existing logic.
 */
public class RecyclingAnalyticsDto {

    private double overallRecyclingRate;
    private double contaminationRate;
    private double participationRate;
    private List<MaterialBreakdown> composition;
    private List<AreaRate> areaRates;

    // ---------------- Nested Classes ----------------
    public static class MaterialBreakdown {

        private String material;
        private double percentage;
        private double weightKg;

        public String getMaterial() {
            return material;
        }

        public void setMaterial(String material) {
            this.material = material;
        }

        public double getPercentage() {
            return percentage;
        }

        public void setPercentage(double percentage) {
            this.percentage = percentage;
        }

        public double getWeightKg() {
            return weightKg;
        }

        public void setWeightKg(double weightKg) {
            this.weightKg = weightKg;
        }
    }

    public static class AreaRate {

        private String area;
        private double rate;
        private String trend;
        private String change;

        public String getArea() {
            return area;
        }

        public void setArea(String area) {
            this.area = area;
        }

        public double getRate() {
            return rate;
        }

        public void setRate(double rate) {
            this.rate = rate;
        }

        public String getTrend() {
            return trend;
        }

        public void setTrend(String trend) {
            this.trend = trend;
        }

        public String getChange() {
            return change;
        }

        public void setChange(String change) {
            this.change = change;
        }
    }

    // ---------------- Getters & Setters ----------------
    public double getOverallRecyclingRate() {
        return overallRecyclingRate;
    }

    public void setOverallRecyclingRate(double overallRecyclingRate) {
        this.overallRecyclingRate = overallRecyclingRate;
    }

    public double getContaminationRate() {
        return contaminationRate;
    }

    public void setContaminationRate(double contaminationRate) {
        this.contaminationRate = contaminationRate;
    }

    public double getParticipationRate() {
        return participationRate;
    }

    public void setParticipationRate(double participationRate) {
        this.participationRate = participationRate;
    }

    public List<MaterialBreakdown> getComposition() {
        return composition;
    }

    public void setComposition(List<MaterialBreakdown> composition) {
        this.composition = composition;
    }

    public List<AreaRate> getAreaRates() {
        return areaRates;
    }

    public void setAreaRates(List<AreaRate> areaRates) {
        this.areaRates = areaRates;
    }
}
