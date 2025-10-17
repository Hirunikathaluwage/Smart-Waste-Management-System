package com.csse.smartwaste.pickup.dto;

import java.math.BigDecimal;

/**
 * PickupStatsDTO - DTO for pickup request statistics
 */
public class PickupStatsDTO {
    
    private long totalRequests;
    private long pendingRequests;
    private long scheduledRequests;
    private long completedRequests;
    private long cancelledRequests;
    private long emergencyRequests;
    private BigDecimal totalRevenue;
    private BigDecimal pendingPayments;
    private long requestsThisMonth;
    private long requestsThisWeek;

    // Constructors
    public PickupStatsDTO() {}

    // Getters & Setters
    public long getTotalRequests() { return totalRequests; }
    public void setTotalRequests(long totalRequests) { this.totalRequests = totalRequests; }

    public long getPendingRequests() { return pendingRequests; }
    public void setPendingRequests(long pendingRequests) { this.pendingRequests = pendingRequests; }

    public long getScheduledRequests() { return scheduledRequests; }
    public void setScheduledRequests(long scheduledRequests) { this.scheduledRequests = scheduledRequests; }

    public long getCompletedRequests() { return completedRequests; }
    public void setCompletedRequests(long completedRequests) { this.completedRequests = completedRequests; }

    public long getCancelledRequests() { return cancelledRequests; }
    public void setCancelledRequests(long cancelledRequests) { this.cancelledRequests = cancelledRequests; }

    public long getEmergencyRequests() { return emergencyRequests; }
    public void setEmergencyRequests(long emergencyRequests) { this.emergencyRequests = emergencyRequests; }

    public BigDecimal getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; }

    public BigDecimal getPendingPayments() { return pendingPayments; }
    public void setPendingPayments(BigDecimal pendingPayments) { this.pendingPayments = pendingPayments; }

    public long getRequestsThisMonth() { return requestsThisMonth; }
    public void setRequestsThisMonth(long requestsThisMonth) { this.requestsThisMonth = requestsThisMonth; }

    public long getRequestsThisWeek() { return requestsThisWeek; }
    public void setRequestsThisWeek(long requestsThisWeek) { this.requestsThisWeek = requestsThisWeek; }
}
