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
