package com.csse.smartwaste.admin.adminanalytics.service;

import com.csse.smartwaste.admin.adminanalytics.dto.EnvironmentalAnalyticsDto;
import com.csse.smartwaste.admin.adminanalytics.dto.FinancialAnalyticsDto;
import com.csse.smartwaste.admin.adminanalytics.dto.PerformanceAnalyticsDto;
import com.csse.smartwaste.admin.adminanalytics.dto.RecyclingAnalyticsDto;

public interface AdminAnalyticsService {

    PerformanceAnalyticsDto getPerformanceAnalytics();

    RecyclingAnalyticsDto getRecyclingAnalytics();

    FinancialAnalyticsDto getFinancialAnalytics();

    EnvironmentalAnalyticsDto getEnvironmentalAnalytics();
}
