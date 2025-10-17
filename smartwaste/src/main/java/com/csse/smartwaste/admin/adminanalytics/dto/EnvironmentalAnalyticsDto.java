package com.csse.smartwaste.admin.adminanalytics.dto;

import java.util.List;

/**
 * SRP: Handles environmental KPI data. OCP: Easily extendable for new
 * sustainability metrics.
 */
public class EnvironmentalAnalyticsDto {

    private double carbonSaved;
    private double wasteDiverted;
    private double waterSaved;
    private int treesSaved;

    private List<SustainabilityGoal> goals;
    private List<AreaImpact> impactByArea;

    // Nested DTOs ------------------------
    public static class SustainabilityGoal {

        private String goal;
        private double progress;
        private double target;

        public String getGoal() {
            return goal;
        }

        public void setGoal(String goal) {
            this.goal = goal;
        }

        public double getProgress() {
            return progress;
        }

        public void setProgress(double progress) {
            this.progress = progress;
        }

        public double getTarget() {
            return target;
        }

        public void setTarget(double target) {
            this.target = target;
        }
    }

    public static class AreaImpact {

        private String area;
        private double carbonSaved;
        private double recyclingRate;
        private double wasteReduced;

        public String getArea() {
            return area;
        }

        public void setArea(String area) {
            this.area = area;
        }

        public double getCarbonSaved() {
            return carbonSaved;
        }

        public void setCarbonSaved(double carbonSaved) {
            this.carbonSaved = carbonSaved;
        }

        public double getRecyclingRate() {
            return recyclingRate;
        }

        public void setRecyclingRate(double recyclingRate) {
            this.recyclingRate = recyclingRate;
        }

        public double getWasteReduced() {
            return wasteReduced;
        }

        public void setWasteReduced(double wasteReduced) {
            this.wasteReduced = wasteReduced;
        }
    }

    // Getters & Setters -------------------
    public double getCarbonSaved() {
        return carbonSaved;
    }

    public void setCarbonSaved(double carbonSaved) {
        this.carbonSaved = carbonSaved;
    }

    public double getWasteDiverted() {
        return wasteDiverted;
    }

    public void setWasteDiverted(double wasteDiverted) {
        this.wasteDiverted = wasteDiverted;
    }

    public double getWaterSaved() {
        return waterSaved;
    }

    public void setWaterSaved(double waterSaved) {
        this.waterSaved = waterSaved;
    }

    public int getTreesSaved() {
        return treesSaved;
    }

    public void setTreesSaved(int treesSaved) {
        this.treesSaved = treesSaved;
    }

    public List<SustainabilityGoal> getGoals() {
        return goals;
    }

    public void setGoals(List<SustainabilityGoal> goals) {
        this.goals = goals;
    }

    public List<AreaImpact> getImpactByArea() {
        return impactByArea;
    }

    public void setImpactByArea(List<AreaImpact> impactByArea) {
        this.impactByArea = impactByArea;
    }
}
