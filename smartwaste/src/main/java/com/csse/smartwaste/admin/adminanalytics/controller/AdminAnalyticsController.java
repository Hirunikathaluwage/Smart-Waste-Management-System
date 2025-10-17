package com.csse.smartwaste.admin.adminanalytics.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.csse.smartwaste.admin.adminanalytics.dto.EnvironmentalAnalyticsDto;
import com.csse.smartwaste.admin.adminanalytics.dto.FinancialAnalyticsDto;
import com.csse.smartwaste.admin.adminanalytics.dto.PerformanceAnalyticsDto;
import com.csse.smartwaste.admin.adminanalytics.dto.RecyclingAnalyticsDto;
import com.csse.smartwaste.admin.adminanalytics.service.AdminAnalyticsService;

/**
 * SRP: Exposes REST endpoints for all analytics dashboards.
 */
@RestController
@RequestMapping("/api/admin/analytics")
@CrossOrigin(origins = "*")
public class AdminAnalyticsController {

    private final AdminAnalyticsService analyticsService;

    public AdminAnalyticsController(AdminAnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/performance")
    public ResponseEntity<PerformanceAnalyticsDto> getPerformance() {
        return ResponseEntity.ok(analyticsService.getPerformanceAnalytics());
    }

    @GetMapping("/recycling")
    public ResponseEntity<RecyclingAnalyticsDto> getRecycling() {
        return ResponseEntity.ok(analyticsService.getRecyclingAnalytics());
    }

    @GetMapping("/financial")
    public ResponseEntity<FinancialAnalyticsDto> getFinancial() {
        return ResponseEntity.ok(analyticsService.getFinancialAnalytics());
    }

    @GetMapping("/environmental")
    public ResponseEntity<EnvironmentalAnalyticsDto> getEnvironmental() {
        return ResponseEntity.ok(analyticsService.getEnvironmentalAnalytics());
    }
}
