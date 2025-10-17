package com.csse.smartwaste.admin.adminReport.adminReportServices;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.csse.smartwaste.admin.adminReport.adminReportDto.ReportRequestDto;
import com.csse.smartwaste.admin.adminReport.adminReportDto.ReportSummaryDto;
import com.csse.smartwaste.admin.adminReport.adminReportRepository.ReportRepository;
import com.csse.smartwaste.admin.adminReport.adminReportRepository.WasteRecordRepository;
import com.csse.smartwaste.admin.adminReport.reportEntity.Report;
import com.csse.smartwaste.common.model.WasteRecord;

@Service
public class AdminReportServiceImpl implements AdminReportService {

    private final WasteRecordRepository wasteRecordRepository;
    private final ReportRepository reportRepository;

    public AdminReportServiceImpl(WasteRecordRepository wasteRecordRepository, ReportRepository reportRepository) {
        this.wasteRecordRepository = wasteRecordRepository;
        this.reportRepository = reportRepository;
    }

    @Override
    public ReportSummaryDto generateReport(ReportRequestDto request) {
        List<WasteRecord> records = request.getArea().equalsIgnoreCase("all-areas")
                ? wasteRecordRepository.findAll()
                : wasteRecordRepository.findByArea(request.getArea());

        double totalWaste = records.stream().mapToDouble(WasteRecord::getWeightKg).sum();
        double recycledWaste = records.stream()
                .filter(r -> r.getWasteType().equalsIgnoreCase("recyclables"))
                .mapToDouble(WasteRecord::getWeightKg)
                .sum();
        double recyclingRate = totalWaste > 0 ? (recycledWaste / totalWaste) * 100 : 0;

        List<String> highWasteZones = records.stream()
                .collect(Collectors.groupingBy(WasteRecord::getArea, Collectors.summingDouble(WasteRecord::getWeightKg)))
                .entrySet()
                .stream()
                .filter(e -> e.getValue() > 500)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());

        Report report = new Report();
        report.setReportType(request.getReportType());
        report.setArea(request.getArea());
        report.setDateRange(request.getDateRange());
        report.setSelectedWasteTypes(request.getSelectedWasteTypes());
        report.setTotalWaste(totalWaste);
        report.setRecyclingRate(recyclingRate);
        reportRepository.save(report);

        ReportSummaryDto summary = new ReportSummaryDto();
        summary.setReportType(report.getReportType());
        summary.setArea(report.getArea());
        summary.setTotalWaste(totalWaste);
        summary.setRecyclingRate(recyclingRate);
        summary.setHighWasteZones(highWasteZones);

        return summary;
    }

    // New: Get all reports
    @Override
    public List<Report> getAllReports() {
        return reportRepository.findAll();
    }

    //  New: Get report by ID
    @Override
    public Optional<Report> getReportById(String id) {
        return reportRepository.findById(id);
    }
}
