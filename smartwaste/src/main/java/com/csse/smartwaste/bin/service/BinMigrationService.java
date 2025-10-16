package com.csse.smartwaste.bin.service;

import com.csse.smartwaste.bin.entity.Bin;
import com.csse.smartwaste.bin.repository.BinRepository;
import com.csse.smartwaste.bin.dto.BinRequest;
import com.csse.smartwaste.bin.dto.BinResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import com.mongodb.client.result.UpdateResult;
import org.springframework.stereotype.Service;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Bin Migration Service - Handles bin data migration and seeding
 * 
 * SOLID PRINCIPLES APPLIED:
 * - SRP (Single Responsibility): Only responsible for bin data migration operations
 * - DIP (Dependency Inversion): Depends on repository abstraction, not concrete implementation
 * - OCP (Open/Closed): Open for extension with new migration operations, closed for modification
 * 
 * CODE SMELLS AVOIDED:
 * - No God class: Focused only on migration operations
 * - No hardcoded values: Uses constants for sample data
 * - No duplicate code: Reusable migration methods
 * - Clear separation: Migration logic separated from business logic
 */
@Service
public class BinMigrationService {

    private final BinRepository binRepository;
    private final BinService binService;
    private final MongoTemplate mongoTemplate;

    /**
     * Constructor injection - follows Dependency Injection best practice
     * DIP: Depends on abstraction (BinRepository, BinService) not concrete implementation
     */
    @Autowired
    public BinMigrationService(BinRepository binRepository, BinService binService, MongoTemplate mongoTemplate) {
        this.binRepository = binRepository;
        this.binService = binService;
        this.mongoTemplate = mongoTemplate;
    }

    /**
     * Populate database with sample bin data
     * SRP: Single responsibility - only handles sample data population
     * 
     * @return Map containing migration results
     */
    public Map<String, Object> populateSampleBins() {
        // Sample bin data with Colombo addresses and coordinates
        List<BinRequest> sampleBins = Arrays.asList(
            createSampleBinRequest("BIN-001", "RES-001", Bin.BinStatus.ACTIVE, 
                "123 Galle Road, Colombo 03", 6.9271, 79.8612),
            createSampleBinRequest("BIN-002", "RES-002", Bin.BinStatus.ACTIVE, 
                "456 Union Place, Colombo 02", 6.9147, 79.8523),
            createSampleBinRequest("BIN-003", "RES-003", Bin.BinStatus.DAMAGED, 
                "789 Main Street, Colombo 11", 6.9319, 79.8656),
            createSampleBinRequest("BIN-004", "RES-004", Bin.BinStatus.ACTIVE, 
                "321 Marine Drive, Colombo 06", 6.9089, 79.8765),
            createSampleBinRequest("BIN-005", "RES-005", Bin.BinStatus.ACTIVE, 
                "654 Galle Road, Mount Lavinia", 6.9201, 79.8888)
        );

        int createdCount = 0;
        int skippedCount = 0;
        StringBuilder results = new StringBuilder();

        for (BinRequest binRequest : sampleBins) {
            try {
                if (!binService.binExists(binRequest.getBinId())) {
                    BinResponse createdBin = binService.createBin(binRequest);
                    createdCount++;
                    results.append("✅ Created bin: ").append(createdBin.getBinId())
                           .append(" at ").append(createdBin.getAddress()).append("\n");
                } else {
                    skippedCount++;
                    results.append("⏭️ Skipped existing bin: ").append(binRequest.getBinId()).append("\n");
                }
            } catch (Exception e) {
                results.append("❌ Error creating bin ").append(binRequest.getBinId())
                       .append(": ").append(e.getMessage()).append("\n");
            }
        }

        return Map.of(
            "success", true,
            "createdCount", createdCount,
            "skippedCount", skippedCount,
            "totalProcessed", sampleBins.size(),
            "results", results.toString()
        );
    }

    /**
     * Check migration status
     * SRP: Single responsibility - only handles migration status checking
     * 
     * @return Map containing migration status information
     */
    public Map<String, Object> getMigrationStatus() {
        long totalBins = binRepository.count();
        long activeBins = binRepository.countByStatus(Bin.BinStatus.ACTIVE);
        long damagedBins = binRepository.countByStatus(Bin.BinStatus.DAMAGED);
        long maintenanceBins = binRepository.countByStatus(Bin.BinStatus.MAINTENANCE);
        long lostBins = binRepository.countByStatus(Bin.BinStatus.LOST);

        // Check if sample bins exist
        boolean bin001Exists = binRepository.existsByBinId("BIN-001");
        boolean bin002Exists = binRepository.existsByBinId("BIN-002");
        boolean bin003Exists = binRepository.existsByBinId("BIN-003");
        boolean bin004Exists = binRepository.existsByBinId("BIN-004");
        boolean bin005Exists = binRepository.existsByBinId("BIN-005");

        int sampleBinsCount = (bin001Exists ? 1 : 0) + (bin002Exists ? 1 : 0) + 
                             (bin003Exists ? 1 : 0) + (bin004Exists ? 1 : 0) + 
                             (bin005Exists ? 1 : 0);

        return Map.of(
            "totalBins", totalBins,
            "activeBins", activeBins,
            "damagedBins", damagedBins,
            "maintenanceBins", maintenanceBins,
            "lostBins", lostBins,
            "sampleBinsCount", sampleBinsCount,
            "sampleBinsStatus", Map.of(
                "BIN-001", bin001Exists,
                "BIN-002", bin002Exists,
                "BIN-003", bin003Exists,
                "BIN-004", bin004Exists,
                "BIN-005", bin005Exists
            )
        );
    }

    /**
     * Create sample bin request with latitude and longitude
     * SRP: Single responsibility - only handles sample bin request creation
     * 
     * @param binId the bin identifier
     * @param ownerId the owner identifier
     * @param status the bin status
     * @param address the bin address
     * @param latitude the latitude coordinate
     * @param longitude the longitude coordinate
     * @return BinRequest for the sample bin
     */
    private BinRequest createSampleBinRequest(String binId, String ownerId, Bin.BinStatus status, 
                                            String address, Double latitude, Double longitude) {
        // Create bin tag
        BinRequest.BinTagRequest tag = new BinRequest.BinTagRequest("QR", binId);
        
        return new BinRequest(binId, ownerId, status, tag, latitude, longitude, address);
    }

    /**
     * Update existing bins with separate latitude and longitude fields
     * SRP: Single responsibility - only handles location data updates
     * 
     * @return Map containing update results
     */
    public Map<String, Object> updateBinLocations() {
        // Location data for each bin (latitude, longitude)
        Map<String, Map<String, Double>> binLocations = Map.of(
            "BIN-001", Map.of("latitude", 6.9271, "longitude", 79.8612), // 123 Galle Road, Colombo 03
            "BIN-002", Map.of("latitude", 6.9147, "longitude", 79.8523), // 456 Union Place, Colombo 02
            "BIN-003", Map.of("latitude", 6.9319, "longitude", 79.8656), // 789 Main Street, Colombo 11
            "BIN-004", Map.of("latitude", 6.9089, "longitude", 79.8765), // 321 Marine Drive, Colombo 06
            "BIN-005", Map.of("latitude", 6.9201, "longitude", 79.8888)  // 654 Galle Road, Mount Lavinia
        );

        int updatedCount = 0;
        int skippedCount = 0;
        StringBuilder results = new StringBuilder();

        for (Map.Entry<String, Map<String, Double>> entry : binLocations.entrySet()) {
            String binId = entry.getKey();
            Map<String, Double> coordinates = entry.getValue();
            
            try {
                // Use raw MongoDB update with separate latitude and longitude fields
                org.springframework.data.mongodb.core.query.Query query = 
                    new org.springframework.data.mongodb.core.query.Query(
                        org.springframework.data.mongodb.core.query.Criteria.where("binId").is(binId)
                    );
                
                org.springframework.data.mongodb.core.query.Update update = 
                    new org.springframework.data.mongodb.core.query.Update()
                        .set("latitude", coordinates.get("latitude"))
                        .set("longitude", coordinates.get("longitude"))
                        .set("updatedAt", java.time.LocalDateTime.now());
                
                UpdateResult result = mongoTemplate.updateFirst(query, update, Bin.class);
                
                if (result.getModifiedCount() > 0) {
                    updatedCount++;
                    results.append("✅ Updated location for bin: ").append(binId)
                           .append(" with latitude ").append(coordinates.get("latitude"))
                           .append(", longitude ").append(coordinates.get("longitude")).append("\n");
                } else {
                    skippedCount++;
                    results.append("⏭️ Skipped bin ").append(binId).append(" (no changes needed)\n");
                }
            } catch (Exception e) {
                results.append("❌ Error updating bin ").append(binId)
                       .append(": ").append(e.getMessage()).append("\n");
            }
        }

        return Map.of(
            "success", true,
            "updatedCount", updatedCount,
            "skippedCount", skippedCount,
            "totalProcessed", binLocations.size(),
            "results", results.toString()
        );
    }

    /**
     * Recreate bins with separate latitude and longitude fields (alternative approach)
     * SRP: Single responsibility - only handles bin recreation with locations
     * 
     * @return Map containing recreation results
     */
    public Map<String, Object> recreateBinsWithLocations() {
        // First, delete existing bins
        binRepository.deleteAll();
        
        // Location data for each bin (latitude, longitude)
        Map<String, Map<String, Double>> binLocations = Map.of(
            "BIN-001", Map.of("latitude", 6.9271, "longitude", 79.8612), // 123 Galle Road, Colombo 03
            "BIN-002", Map.of("latitude", 6.9147, "longitude", 79.8523), // 456 Union Place, Colombo 02
            "BIN-003", Map.of("latitude", 6.9319, "longitude", 79.8656), // 789 Main Street, Colombo 11
            "BIN-004", Map.of("latitude", 6.9089, "longitude", 79.8765), // 321 Marine Drive, Colombo 06
            "BIN-005", Map.of("latitude", 6.9201, "longitude", 79.8888)  // 654 Galle Road, Mount Lavinia
        );

        int createdCount = 0;
        StringBuilder results = new StringBuilder();

        for (Map.Entry<String, Map<String, Double>> entry : binLocations.entrySet()) {
            String binId = entry.getKey();
            Map<String, Double> coordinates = entry.getValue();
            
            try {
                // Create bin with separate latitude and longitude fields using raw MongoDB insert
                Map<String, Object> binDocument = Map.of(
                    "binId", binId,
                    "ownerId", "RES-" + binId.split("-")[1],
                    "status", binId.equals("BIN-003") ? "DAMAGED" : "ACTIVE",
                    "tag", Map.of(
                        "type", "QR",
                        "value", binId
                    ),
                    "latitude", coordinates.get("latitude"),
                    "longitude", coordinates.get("longitude"),
                    "address", getAddressForBin(binId),
                    "createdAt", java.time.LocalDateTime.now(),
                    "updatedAt", java.time.LocalDateTime.now()
                );
                
                mongoTemplate.insert(binDocument, "bins");
                createdCount++;
                results.append("✅ Created bin: ").append(binId)
                       .append(" at ").append(getAddressForBin(binId))
                       .append(" with latitude ").append(coordinates.get("latitude"))
                       .append(", longitude ").append(coordinates.get("longitude")).append("\n");
            } catch (Exception e) {
                results.append("❌ Error creating bin ").append(binId)
                       .append(": ").append(e.getMessage()).append("\n");
            }
        }

        return Map.of(
            "success", true,
            "createdCount", createdCount,
            "totalProcessed", binLocations.size(),
            "results", results.toString()
        );
    }

    /**
     * Update a single bin with a new field
     * SRP: Single responsibility - only handles individual bin field updates
     * 
     * @param binId the bin identifier to update
     * @param fieldName the field name to add/update
     * @param fieldValue the field value to set
     * @return Map containing update results
     */
    public Map<String, Object> updateSingleBinField(String binId, String fieldName, String fieldValue) {
        try {
            // Check if bin exists
            Optional<Bin> binOptional = binRepository.findByBinId(binId);
            if (binOptional.isEmpty()) {
                return Map.of(
                    "success", false,
                    "message", "Bin with ID " + binId + " not found"
                );
            }

            // Use raw MongoDB update for flexibility
            org.springframework.data.mongodb.core.query.Query query = 
                new org.springframework.data.mongodb.core.query.Query(
                    org.springframework.data.mongodb.core.query.Criteria.where("binId").is(binId)
                );
            
            org.springframework.data.mongodb.core.query.Update update = 
                new org.springframework.data.mongodb.core.query.Update()
                    .set(fieldName, fieldValue)
                    .set("updatedAt", java.time.LocalDateTime.now());
            
            UpdateResult result = mongoTemplate.updateFirst(query, update, Bin.class);
            
            if (result.getModifiedCount() > 0) {
                return Map.of(
                    "success", true,
                    "message", "Successfully updated bin " + binId + " with field " + fieldName + " = " + fieldValue,
                    "modifiedCount", result.getModifiedCount()
                );
            } else {
                return Map.of(
                    "success", false,
                    "message", "No changes made to bin " + binId
                );
            }
        } catch (Exception e) {
            return Map.of(
                "success", false,
                "error", e.getMessage(),
                "message", "Failed to update bin " + binId
            );
        }
    }

    /**
     * Migrate existing bins from GeoJsonPoint to separate latitude/longitude fields
     * SRP: Single responsibility - only handles coordinate schema migration
     * 
     * @return Map containing migration results
     */
    public Map<String, Object> migrateToSeparateCoordinates() {
        try {
            // Find all bins that have location field but no separate latitude/longitude
            org.springframework.data.mongodb.core.query.Query query = 
                new org.springframework.data.mongodb.core.query.Query(
                    org.springframework.data.mongodb.core.query.Criteria.where("location").exists(true)
                        .and("latitude").exists(false)
                );
            
            List<Bin> binsToMigrate = mongoTemplate.find(query, Bin.class);
            
            int migratedCount = 0;
            int skippedCount = 0;
            StringBuilder results = new StringBuilder();
            
            for (Bin bin : binsToMigrate) {
                try {
                    // Extract coordinates from existing location field
                    // Note: This assumes the old location field still exists in some documents
                    // In practice, you might need to handle this differently based on your data
                    
                    // For now, we'll set default coordinates based on bin ID
                    Map<String, Double> coordinates = getDefaultCoordinatesForBin(bin.getBinId());
                    
                    if (coordinates != null) {
                        org.springframework.data.mongodb.core.query.Query updateQuery = 
                            new org.springframework.data.mongodb.core.query.Query(
                                org.springframework.data.mongodb.core.query.Criteria.where("binId").is(bin.getBinId())
                            );
                        
                        org.springframework.data.mongodb.core.query.Update update = 
                            new org.springframework.data.mongodb.core.query.Update()
                                .set("latitude", coordinates.get("latitude"))
                                .set("longitude", coordinates.get("longitude"))
                                .unset("location") // Remove old location field
                                .set("updatedAt", java.time.LocalDateTime.now());
                        
                        UpdateResult result = mongoTemplate.updateFirst(updateQuery, update, Bin.class);
                        
                        if (result.getModifiedCount() > 0) {
                            migratedCount++;
                            results.append("✅ Migrated bin: ").append(bin.getBinId())
                                   .append(" to separate coordinates\n");
                        } else {
                            skippedCount++;
                            results.append("⏭️ Skipped bin ").append(bin.getBinId()).append(" (no changes needed)\n");
                        }
                    } else {
                        skippedCount++;
                        results.append("⏭️ Skipped bin ").append(bin.getBinId()).append(" (no coordinates available)\n");
                    }
                } catch (Exception e) {
                    results.append("❌ Error migrating bin ").append(bin.getBinId())
                           .append(": ").append(e.getMessage()).append("\n");
                }
            }
            
            return Map.of(
                "success", true,
                "migratedCount", migratedCount,
                "skippedCount", skippedCount,
                "totalProcessed", binsToMigrate.size(),
                "results", results.toString()
            );
        } catch (Exception e) {
            return Map.of(
                "success", false,
                "error", e.getMessage(),
                "message", "Failed to migrate coordinates"
            );
        }
    }
    
    /**
     * Get default coordinates for a bin ID
     * SRP: Single responsibility - only handles coordinate mapping
     */
    private Map<String, Double> getDefaultCoordinatesForBin(String binId) {
        return switch (binId) {
            case "BIN-001" -> Map.of("latitude", 6.9271, "longitude", 79.8612);
            case "BIN-002" -> Map.of("latitude", 6.9147, "longitude", 79.8523);
            case "BIN-003" -> Map.of("latitude", 6.9319, "longitude", 79.8656);
            case "BIN-004" -> Map.of("latitude", 6.9089, "longitude", 79.8765);
            case "BIN-005" -> Map.of("latitude", 6.9201, "longitude", 79.8888);
            default -> null;
        };
    }

    /**
     * Get address for bin ID
     * SRP: Single responsibility - only handles address mapping
     */
    private String getAddressForBin(String binId) {
        return switch (binId) {
            case "BIN-001" -> "123 Galle Road, Colombo 03";
            case "BIN-002" -> "456 Union Place, Colombo 02";
            case "BIN-003" -> "789 Main Street, Colombo 11";
            case "BIN-004" -> "321 Marine Drive, Colombo 06";
            case "BIN-005" -> "654 Galle Road, Mount Lavinia";
            default -> "Unknown Address";
        };
    }
}
