package com.csse.smartwaste.admin.adminanalytics.dto;

import java.util.List;

/**
 * FinancialAnalyticsDto SRP: Represents financial performance analytics. OCP:
 * Easily extendable with new KPIs or attributes.
 */
public class FinancialAnalyticsDto {

    private double totalRevenue;
    private double pendingPayments;
    private double collectionCosts;
    private double netProfit;

    private List<RevenueByArea> revenueByArea;
    private List<TransactionSummary> recentTransactions;

    // Nested DTO classes -----------------
    public static class RevenueByArea {

        private String area;
        private double revenue;
        private double percentage;
        private int accounts;

        public String getArea() {
            return area;
        }

        public void setArea(String area) {
            this.area = area;
        }

        public double getRevenue() {
            return revenue;
        }

        public void setRevenue(double revenue) {
            this.revenue = revenue;
        }

        public double getPercentage() {
            return percentage;
        }

        public void setPercentage(double percentage) {
            this.percentage = percentage;
        }

        public int getAccounts() {
            return accounts;
        }

        public void setAccounts(int accounts) {
            this.accounts = accounts;
        }
    }

    public static class TransactionSummary {

        private String id;
        private String customer;
        private double amount;
        private String type;
        private String status;
        private String date;

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getCustomer() {
            return customer;
        }

        public void setCustomer(String customer) {
            this.customer = customer;
        }

        public double getAmount() {
            return amount;
        }

        public void setAmount(double amount) {
            this.amount = amount;
        }

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public String getDate() {
            return date;
        }

        public void setDate(String date) {
            this.date = date;
        }
    }

    // Main DTO fields --------------------
    public double getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(double totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public double getPendingPayments() {
        return pendingPayments;
    }

    public void setPendingPayments(double pendingPayments) {
        this.pendingPayments = pendingPayments;
    }

    public double getCollectionCosts() {
        return collectionCosts;
    }

    public void setCollectionCosts(double collectionCosts) {
        this.collectionCosts = collectionCosts;
    }

    public double getNetProfit() {
        return netProfit;
    }

    public void setNetProfit(double netProfit) {
        this.netProfit = netProfit;
    }

    public List<RevenueByArea> getRevenueByArea() {
        return revenueByArea;
    }

    public void setRevenueByArea(List<RevenueByArea> revenueByArea) {
        this.revenueByArea = revenueByArea;
    }

    public List<TransactionSummary> getRecentTransactions() {
        return recentTransactions;
    }

    public void setRecentTransactions(List<TransactionSummary> recentTransactions) {
        this.recentTransactions = recentTransactions;
    }
}
