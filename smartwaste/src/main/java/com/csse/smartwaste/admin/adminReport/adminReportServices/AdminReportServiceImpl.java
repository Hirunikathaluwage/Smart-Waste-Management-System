package com.csse.smartwaste.admin.adminReport.adminReportServices;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.csse.smartwaste.admin.adminReport.adminReportDto.ReportRequestDto;
import com.csse.smartwaste.admin.adminReport.adminReportDto.ReportSummaryDto;
import com.csse.smartwaste.admin.adminReport.adminReportRepository.WasteRecordRepository;
import com.csse.smartwaste.common.model.WasteRecord;

/**
 * AdminReportServiceImpl SRP: Handles report computation logic. OCP: Supports
 * adding new metrics without modifying existing logic. DIP: Depends on
 * WasteRecordRepository interface, not implementation.
 */
@Service
public class AdminReportServiceImpl implements AdminReportService {

    private final WasteRecordRepository wasteRecordRepository;

    public AdminReportServiceImpl(WasteRecordRepository wasteRecordRepository) {
        this.wasteRecordRepository = wasteRecordRepository;
    }

    @Override
    public ReportSummaryDto generateReport(ReportRequestDto request) {
        List<WasteRecord> records = request.getArea().equalsIgnoreCase("all-areas")
                ? wasteRecordRepository.findAll()
                : wasteRecordRepository.findByArea(request.getArea());

        double totalWaste = records.stream()
                .mapToDouble(WasteRecord::getWeightKg)
                .sum();

        double recycledWaste = records.stream()
                .filter(r -> r.getWasteType().equalsIgnoreCase("recyclables"))
                .mapToDouble(WasteRecord::getWeightKg)
                .sum();

        double recyclingRate = totalWaste > 0 ? (recycledWaste / totalWaste) * 100 : 0;

        List<String> highWasteZones = records.stream()
                .collect(Collectors.groupingBy(WasteRecord::getArea, Collectors.summingDouble(WasteRecord::getWeightKg)))
                .entrySet()
                .stream()
                .filter(e -> e.getValue() > 500) // threshold
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());

        ReportSummaryDto summary = new ReportSummaryDto();
        summary.setReportType(request.getReportType());
        summary.setArea(request.getArea());
        summary.setTotalWaste(totalWaste);
        summary.setRecyclingRate(recyclingRate);
        summary.setHighWasteZones(highWasteZones);

        return summary;
    }
}
