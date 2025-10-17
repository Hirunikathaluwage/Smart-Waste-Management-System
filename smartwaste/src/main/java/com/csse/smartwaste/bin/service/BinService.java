package com.csse.smartwaste.bin.service;

import com.csse.smartwaste.bin.entity.Bin;
import com.csse.smartwaste.bin.repository.BinRepository;
import com.csse.smartwaste.bin.dto.BinRequest;
import com.csse.smartwaste.bin.dto.BinResponse;
import com.csse.smartwaste.common.exception.DuplicateResourceException;
import com.csse.smartwaste.common.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;

/**
 * Bin Service - Handles business logic for bin operations
 * 
 * SOLID PRINCIPLES APPLIED:
 * - SRP (Single Responsibility): Only responsible for bin business logic
 * - DIP (Dependency Inversion): Depends on repository abstraction, not concrete implementation
 * - OCP (Open/Closed): Open for extension with new business logic, closed for modification
 * - ISP (Interface Segregation): Provides focused service methods
 * 
 * CODE SMELLS AVOIDED:
 * - No God class: Focused only on bin business logic
 * - No duplicate code: Reusable methods
 * - No long parameter lists: Uses DTOs for complex data
 * - Proper error handling: Uses custom exceptions
 * - Clear method naming: Descriptive method names
 */
@Service
public class BinService {

    private final BinRepository binRepository;

    /**
     * Constructor injection - follows Dependency Injection best practice
     * DIP: Depends on abstraction (BinRepository interface) not concrete implementation
     */
    @Autowired
    public BinService(BinRepository binRepository) {
        this.binRepository = binRepository;
    }

    /**
     * Create a new bin
     * SRP: Single responsibility - only handles bin creation logic
     * 
     * @param binRequest the bin creation request
     * @return BinResponse containing the created bin
     * @throws DuplicateResourceException if bin with same binId already exists
     */
    public BinResponse createBin(BinRequest binRequest) {
        // Validate bin doesn't already exist
        if (binRepository.existsByBinId(binRequest.getBinId())) {
            throw new DuplicateResourceException("Bin", "binId", binRequest.getBinId());
        }

        // Convert DTO to entity
        Bin bin = convertRequestToEntity(binRequest);
        
        // Save bin
        Bin savedBin = binRepository.save(bin);
        
        // Convert entity to response DTO
        return BinResponse.fromBin(savedBin);
    }

    /**
     * Get bin by binId
     * SRP: Single responsibility - only handles bin retrieval logic
     * 
     * @param binId the unique bin identifier
     * @return BinResponse containing the bin
     * @throws ResourceNotFoundException if bin not found
     */
    public BinResponse getBinByBinId(String binId) {
        Bin bin = binRepository.findByBinId(binId)
                .orElseThrow(() -> new ResourceNotFoundException("Bin", "binId", binId));
        
        return BinResponse.fromBin(bin);
    }

    /**
     * Get all bins
     * SRP: Single responsibility - only handles bin retrieval logic
     * 
     * @return List of BinResponse containing all bins
     */
    public List<BinResponse> getAllBins() {
        List<Bin> bins = binRepository.findAll();
        return bins.stream()
                .map(BinResponse::fromBin)
                .collect(Collectors.toList());
    }

    /**
     * Get bins by owner ID
     * SRP: Single responsibility - only handles bin retrieval by owner logic
     * 
     * @param ownerId the owner identifier
     * @return List of BinResponse containing bins owned by the specified owner
     */
    public List<BinResponse> getBinsByOwnerId(String ownerId) {
        List<Bin> bins = binRepository.findByOwnerId(ownerId);
        return bins.stream()
                .map(BinResponse::fromBin)
                .collect(Collectors.toList());
    }

    /**
     * Get bins by status
     * SRP: Single responsibility - only handles bin retrieval by status logic
     * 
     * @param status the bin status
     * @return List of BinResponse containing bins with the specified status
     */
    public List<BinResponse> getBinsByStatus(Bin.BinStatus status) {
        List<Bin> bins = binRepository.findByStatus(status);
        return bins.stream()
                .map(BinResponse::fromBin)
                .collect(Collectors.toList());
    }

    /**
     * Update bin status
     * SRP: Single responsibility - only handles bin status update logic
     * 
     * @param binId the unique bin identifier
     * @param status the new status
     * @return BinResponse containing the updated bin
     * @throws ResourceNotFoundException if bin not found
     */
    public BinResponse updateBinStatus(String binId, Bin.BinStatus status) {
        Bin bin = binRepository.findByBinId(binId)
                .orElseThrow(() -> new ResourceNotFoundException("Bin", "binId", binId));
        
        bin.setStatus(status);
        Bin updatedBin = binRepository.save(bin);
        
        return BinResponse.fromBin(updatedBin);
    }

    /**
     * Delete bin by binId
     * SRP: Single responsibility - only handles bin deletion logic
     * 
     * @param binId the unique bin identifier
     * @throws ResourceNotFoundException if bin not found
     */
    public void deleteBin(String binId) {
        Bin bin = binRepository.findByBinId(binId)
                .orElseThrow(() -> new ResourceNotFoundException("Bin", "binId", binId));
        
        binRepository.delete(bin);
    }

    /**
     * Check if bin exists
     * SRP: Single responsibility - only handles bin existence check logic
     * 
     * @param binId the unique bin identifier
     * @return true if bin exists, false otherwise
     */
    public boolean binExists(String binId) {
        return binRepository.existsByBinId(binId);
    }

    /**
     * Get bin count by status
     * SRP: Single responsibility - only handles bin counting logic
     * 
     * @param status the bin status
     * @return count of bins with the specified status
     */
    public long getBinCountByStatus(Bin.BinStatus status) {
        return binRepository.countByStatus(status);
    }

    /**
     * Get activity summary grouped by zones
     * SRP: Single responsibility - only handles activity summary calculation
     * 
     * @return Map containing zone-wise activity summary
     */
    public Map<String, Map<String, Object>> getActivitySummary() {
        List<Bin> allBins = binRepository.findAll();
        
        // Group bins by geographical zones based on coordinates
        Map<String, List<Bin>> zoneGroups = groupBinsByZone(allBins);
        
        Map<String, Map<String, Object>> activitySummary = new HashMap<>();
        
        for (Map.Entry<String, List<Bin>> entry : zoneGroups.entrySet()) {
            String zoneName = entry.getKey();
            List<Bin> zoneBins = entry.getValue();
            
            // Calculate counts by status
            long activeCount = zoneBins.stream()
                .filter(bin -> bin.getStatus() == Bin.BinStatus.ACTIVE)
                .count();
            
            long collectedCount = zoneBins.stream()
                .filter(bin -> bin.getStatus() == Bin.BinStatus.COLLECTED)
                .count();
            
            long damagedCount = zoneBins.stream()
                .filter(bin -> bin.getStatus() == Bin.BinStatus.DAMAGED)
                .count();
            
            long totalCount = zoneBins.size();
            
            // Determine overall status
            String overallStatus = determineOverallStatus(activeCount, collectedCount, damagedCount, totalCount);
            
            Map<String, Object> zoneData = new HashMap<>();
            zoneData.put("totalBins", totalCount);
            zoneData.put("activeBins", activeCount);
            zoneData.put("collectedBins", collectedCount);
            zoneData.put("damagedBins", damagedCount);
            zoneData.put("status", overallStatus);
            zoneData.put("scheduledPickups", activeCount + damagedCount); // Bins that need collection
            
            activitySummary.put(zoneName, zoneData);
        }
        
        return activitySummary;
    }

    /**
     * Group bins by geographical zones
     * SRP: Single responsibility - only handles zone grouping logic
     * 
     * @param bins list of all bins
     * @return Map of zone name to list of bins in that zone
     */
    private Map<String, List<Bin>> groupBinsByZone(List<Bin> bins) {
        Map<String, List<Bin>> zoneGroups = new HashMap<>();
        
        // Initialize zones
        zoneGroups.put("Downtown Area - Zone A", new ArrayList<>());
        zoneGroups.put("Residential Area - Zone B", new ArrayList<>());
        zoneGroups.put("Business District - Zone C", new ArrayList<>());
        
        // Group bins by coordinates (simplified zone assignment)
        for (Bin bin : bins) {
            if (bin.getLatitude() != null && bin.getLongitude() != null) {
                String zone = determineZoneByCoordinates(bin.getLatitude(), bin.getLongitude());
                zoneGroups.get(zone).add(bin);
            } else {
                // Fallback to address-based grouping
                String zone = determineZoneByAddress(bin.getAddress());
                zoneGroups.get(zone).add(bin);
            }
        }
        
        return zoneGroups;
    }

    /**
     * Determine zone based on coordinates
     * SRP: Single responsibility - only handles coordinate-based zone determination
     * 
     * @param latitude bin latitude
     * @param longitude bin longitude
     * @return zone name
     */
    private String determineZoneByCoordinates(Double latitude, Double longitude) {
        // Simplified zone determination based on coordinates
        // In a real implementation, this would use proper geographical boundaries
        
        if (latitude >= 6.9 && latitude <= 6.95 && longitude >= 79.85 && longitude <= 79.9) {
            return "Downtown Area - Zone A";
        } else if (latitude >= 6.85 && latitude <= 6.9 && longitude >= 79.8 && longitude <= 79.85) {
            return "Residential Area - Zone B";
        } else {
            return "Business District - Zone C";
        }
    }

    /**
     * Determine zone based on address
     * SRP: Single responsibility - only handles address-based zone determination
     * 
     * @param address bin address
     * @return zone name
     */
    private String determineZoneByAddress(String address) {
        if (address == null) {
            return "Business District - Zone C";
        }
        
        String lowerAddress = address.toLowerCase();
        
        if (lowerAddress.contains("downtown") || lowerAddress.contains("city center") || lowerAddress.contains("commercial")) {
            return "Downtown Area - Zone A";
        } else if (lowerAddress.contains("residential") || lowerAddress.contains("housing") || lowerAddress.contains("apartment")) {
            return "Residential Area - Zone B";
        } else {
            return "Business District - Zone C";
        }
    }

    /**
     * Determine overall status for a zone
     * SRP: Single responsibility - only handles status determination logic
     * 
     * @param activeCount number of active bins
     * @param collectedCount number of collected bins
     * @param damagedCount number of damaged bins
     * @param totalCount total number of bins
     * @return overall status string
     */
    private String determineOverallStatus(long activeCount, long collectedCount, long damagedCount, long totalCount) {
        if (totalCount == 0) {
            return "NO_DATA";
        }
        
        double completionRate = (double) collectedCount / totalCount;
        
        if (completionRate >= 0.8) {
            return "COMPLETED";
        } else if (completionRate >= 0.3) {
            return "IN_PROGRESS";
        } else {
            return "PENDING";
        }
    }

    /**
     * Convert BinRequest DTO to Bin entity
     * SRP: Single responsibility - only handles DTO to entity conversion
     * 
     * @param binRequest the bin request DTO
     * @return Bin entity
     */
    private Bin convertRequestToEntity(BinRequest binRequest) {
        // Create bin tag
        Bin.BinTag binTag = null;
        if (binRequest.getTag() != null) {
            binTag = new Bin.BinTag(
                binRequest.getTag().getType(),
                binRequest.getTag().getValue()
            );
        }

        return new Bin(
            binRequest.getBinId(),
            binRequest.getOwnerId(),
            binRequest.getStatus(),
            binTag,
            binRequest.getLatitude(),
            binRequest.getLongitude(),
            binRequest.getAddress()
        );
    }
}
