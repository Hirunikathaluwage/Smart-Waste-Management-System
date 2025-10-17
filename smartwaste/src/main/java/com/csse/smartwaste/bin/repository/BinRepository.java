package com.csse.smartwaste.bin.repository;

import com.csse.smartwaste.bin.entity.Bin;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

/**
 * Bin Repository - Handles data access operations for Bin entities
 * 
 * SOLID PRINCIPLES APPLIED:
 * - SRP (Single Responsibility): Only responsible for data access operations
 * - DIP (Dependency Inversion): Depends on abstraction (MongoRepository) not concrete implementation
 * - ISP (Interface Segregation): Provides focused, specific methods for bin operations
 * 
 * CODE SMELLS AVOIDED:
 * - No fat interfaces: Methods are focused and specific
 * - No data access logic in service layer: Repository handles all data operations
 * - Clear method naming: Descriptive method names
 * - Proper abstraction: Uses Spring Data MongoDB abstractions
 */
@Repository
public interface BinRepository extends MongoRepository<Bin, String> {

    /**
     * Find bin by binId
     * SRP: Single responsibility - only finds by binId
     * 
     * @param binId the unique bin identifier
     * @return Optional containing the bin if found
     */
    Optional<Bin> findByBinId(String binId);

    /**
     * Find all bins by owner ID
     * SRP: Single responsibility - only finds by ownerId
     * 
     * @param ownerId the owner identifier
     * @return List of bins owned by the specified owner
     */
    List<Bin> findByOwnerId(String ownerId);

    /**
     * Find all bins by status
     * SRP: Single responsibility - only finds by status
     * 
     * @param status the bin status
     * @return List of bins with the specified status
     */
    List<Bin> findByStatus(Bin.BinStatus status);

    /**
     * Find bins within a geographical area
     * SRP: Single responsibility - only finds by location
     * 
     * @param minLat minimum latitude
     * @param maxLat maximum latitude
     * @param minLng minimum longitude
     * @param maxLng maximum longitude
     * @return List of bins within the specified geographical bounds
     */
    @Query("{'location.coordinates': {$geoWithin: {$box: [[?0, ?1], [?2, ?3]]}}}")
    List<Bin> findBinsWithinBounds(double minLng, double minLat, double maxLng, double maxLat);

    /**
     * Check if bin exists by binId
     * SRP: Single responsibility - only checks existence
     * 
     * @param binId the unique bin identifier
     * @return true if bin exists, false otherwise
     */
    boolean existsByBinId(String binId);

    /**
     * Count bins by status
     * SRP: Single responsibility - only counts by status
     * 
     * @param status the bin status
     * @return count of bins with the specified status
     */
    long countByStatus(Bin.BinStatus status);

    /**
     * Find bins by tag type
     * SRP: Single responsibility - only finds by tag type
     * 
     * @param tagType the type of tag (QR, RFID, etc.)
     * @return List of bins with the specified tag type
     */
    @Query("{'tag.type': ?0}")
    List<Bin> findByTagType(String tagType);
}


