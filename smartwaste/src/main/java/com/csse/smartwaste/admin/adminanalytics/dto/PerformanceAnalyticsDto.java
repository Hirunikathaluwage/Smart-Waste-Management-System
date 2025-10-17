package com.csse.smartwaste.admin.adminanalytics.dto;

import java.util.List;

/**
 * PerformanceAnalyticsDto SRP: Represents performance analytics data for
 * collection operations. OCP: Can be extended with new KPIs like "vehicle
 * utilization" without modification.
 */
public class PerformanceAnalyticsDto {

    private double completionRate;
    private double avgCollectionTime;
    private double workerEfficiency;
    private int missedCollections;
    private List<RoutePerformance> topRoutes;
    private List<WorkerPerformance> topWorkers;

    // Nested DTOs --------------------------------------
    public static class RoutePerformance {

        private String route;
        private int collections;
        private String efficiency;
        private String avgTime;
        private String status;

        public String getRoute() {
            return route;
        }

        public void setRoute(String route) {
            this.route = route;
        }

        public int getCollections() {
            return collections;
        }

        public void setCollections(int collections) {
            this.collections = collections;
        }

        public String getEfficiency() {
            return efficiency;
        }

        public void setEfficiency(String efficiency) {
            this.efficiency = efficiency;
        }

        public String getAvgTime() {
            return avgTime;
        }

        public void setAvgTime(String avgTime) {
            this.avgTime = avgTime;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }
    }

    public static class WorkerPerformance {

        private String name;
        private int collections;
        private String efficiency;
        private double rating;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public int getCollections() {
            return collections;
        }

        public void setCollections(int collections) {
            this.collections = collections;
        }

        public String getEfficiency() {
            return efficiency;
        }

        public void setEfficiency(String efficiency) {
            this.efficiency = efficiency;
        }

        public double getRating() {
            return rating;
        }

        public void setRating(double rating) {
            this.rating = rating;
        }
    }

    // Main DTO Getters & Setters -----------------------
    public double getCompletionRate() {
        return completionRate;
    }

    public void setCompletionRate(double completionRate) {
        this.completionRate = completionRate;
    }

    public double getAvgCollectionTime() {
        return avgCollectionTime;
    }

    public void setAvgCollectionTime(double avgCollectionTime) {
        this.avgCollectionTime = avgCollectionTime;
    }

    public double getWorkerEfficiency() {
        return workerEfficiency;
    }

    public void setWorkerEfficiency(double workerEfficiency) {
        this.workerEfficiency = workerEfficiency;
    }

    public int getMissedCollections() {
        return missedCollections;
    }

    public void setMissedCollections(int missedCollections) {
        this.missedCollections = missedCollections;
    }

    public List<RoutePerformance> getTopRoutes() {
        return topRoutes;
    }

    public void setTopRoutes(List<RoutePerformance> topRoutes) {
        this.topRoutes = topRoutes;
    }

    public List<WorkerPerformance> getTopWorkers() {
        return topWorkers;
    }

    public void setTopWorkers(List<WorkerPerformance> topWorkers) {
        this.topWorkers = topWorkers;
    }
}
