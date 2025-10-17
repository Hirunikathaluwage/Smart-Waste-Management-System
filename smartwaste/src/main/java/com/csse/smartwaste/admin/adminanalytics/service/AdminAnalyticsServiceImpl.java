package com.csse.smartwaste.admin.adminanalytics.service;

import com.csse.smartwaste.admin.adminanalytics.dto.*;

import org.springframework.stereotype.Service;
import java.util.*;

/**
 * SRP: Each method serves one analytics dashboard type. OCP: Supports extension
 * for new dashboards without modification. DIP: Controller depends only on
 * interface, not implementation.
 */
@Service
public class AdminAnalyticsServiceImpl implements AdminAnalyticsService {

    // -------------------- PERFORMANCE ANALYTICS --------------------
    @Override
    public PerformanceAnalyticsDto getPerformanceAnalytics() {
        PerformanceAnalyticsDto dto = new PerformanceAnalyticsDto();
        dto.setCompletionRate(94.5);
        dto.setAvgCollectionTime(18.0);
        dto.setWorkerEfficiency(87.0);
        dto.setMissedCollections(12);

        dto.setTopRoutes(List.of(
                route("Route A - Downtown", 145, "96%", "15 min", "excellent"),
                route("Route B - North", 203, "92%", "19 min", "good")
        ));

        dto.setTopWorkers(List.of(
                worker("John Smith", 234, "95%", 4.8),
                worker("Sarah Johnson", 228, "94%", 4.7)
        ));

        return dto;
    }

    private PerformanceAnalyticsDto.RoutePerformance route(String r, int c, String e, String t, String s) {
        PerformanceAnalyticsDto.RoutePerformance rp = new PerformanceAnalyticsDto.RoutePerformance();
        rp.setRoute(r);
        rp.setCollections(c);
        rp.setEfficiency(e);
        rp.setAvgTime(t);
        rp.setStatus(s);
        return rp;
    }

    private PerformanceAnalyticsDto.WorkerPerformance worker(String n, int c, String e, double r) {
        PerformanceAnalyticsDto.WorkerPerformance wp = new PerformanceAnalyticsDto.WorkerPerformance();
        wp.setName(n);
        wp.setCollections(c);
        wp.setEfficiency(e);
        wp.setRating(r);
        return wp;
    }

    // -------------------- RECYCLING ANALYTICS --------------------
    @Override
    public RecyclingAnalyticsDto getRecyclingAnalytics() {
        RecyclingAnalyticsDto dto = new RecyclingAnalyticsDto();
        dto.setOverallRecyclingRate(68);
        dto.setContaminationRate(8.5);
        dto.setParticipationRate(76);
        return dto;
    }

    // -------------------- FINANCIAL ANALYTICS --------------------
    @Override
    public FinancialAnalyticsDto getFinancialAnalytics() {
        FinancialAnalyticsDto dto = new FinancialAnalyticsDto();
        dto.setTotalRevenue(45280);
        dto.setPendingPayments(8450);
        dto.setCollectionCosts(28900);
        dto.setNetProfit(16380);
        return dto;
    }

    // -------------------- ENVIRONMENTAL ANALYTICS --------------------
    @Override
    public EnvironmentalAnalyticsDto getEnvironmentalAnalytics() {
        EnvironmentalAnalyticsDto dto = new EnvironmentalAnalyticsDto();
        dto.setCarbonSaved(12.4);
        dto.setWasteDiverted(1847);
        dto.setWaterSaved(4580);
        dto.setTreesSaved(156);
        return dto;
    }
}
