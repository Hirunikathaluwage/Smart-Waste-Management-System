package com.csse.smartwaste.bin.dto;

import com.csse.smartwaste.bin.entity.Bin;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Bin Response DTO - Data Transfer Object for bin response data
 * 
 * SOLID PRINCIPLES APPLIED:
 * - SRP (Single Responsibility): Only responsible for transferring bin response data
 * - OCP (Open/Closed): Open for extension with new fields, closed for modification
 * - DRY (Don't Repeat Yourself): Reusable response structure
 * 
 * CODE SMELLS AVOIDED:
 * - No primitive obsession: Uses proper data types
 * - No data clumps: Groups related data together
 * - Clear structure: Well-organized response format
 */
public class BinResponse {
    private String id;
    private String binId;
    private String ownerId;
    private Bin.BinStatus status;
    private BinTagResponse tag;
    private Double latitude;
    private Double longitude;
    private String address;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Default constructor
    public BinResponse() {}

    // Constructor with all fields
    public BinResponse(String id, String binId, String ownerId, Bin.BinStatus status,
                      BinTagResponse tag, Double latitude, Double longitude, String address,
                      LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.binId = binId;
        this.ownerId = ownerId;
        this.status = status;
        this.tag = tag;
        this.latitude = latitude;
        this.longitude = longitude;
        this.address = address;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Static factory method to create from Bin entity
    // SRP: Single responsibility - only converts entity to DTO
    public static BinResponse fromBin(Bin bin) {
        BinTagResponse tagResponse = null;
        if (bin.getTag() != null) {
            tagResponse = new BinTagResponse(bin.getTag().getType(), bin.getTag().getValue());
        }

        return new BinResponse(
            bin.getId(),
            bin.getBinId(),
            bin.getOwnerId(),
            bin.getStatus(),
            tagResponse,
            bin.getLatitude(),
            bin.getLongitude(),
            bin.getAddress(),
            bin.getCreatedAt(),
            bin.getUpdatedAt()
        );
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getBinId() { return binId; }
    public void setBinId(String binId) { this.binId = binId; }

    public String getOwnerId() { return ownerId; }
    public void setOwnerId(String ownerId) { this.ownerId = ownerId; }

    public Bin.BinStatus getStatus() { return status; }
    public void setStatus(Bin.BinStatus status) { this.status = status; }

    public BinTagResponse getTag() { return tag; }
    public void setTag(BinTagResponse tag) { this.tag = tag; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    /**
     * Bin Tag Response DTO
     * SRP: Single responsibility - only represents tag response data
     */
    public static class BinTagResponse {
        private String type;
        private String value;

        public BinTagResponse() {}

        public BinTagResponse(String type, String value) {
            this.type = type;
            this.value = value;
        }

        public String getType() { return type; }
        public void setType(String type) { this.type = type; }

        public String getValue() { return value; }
        public void setValue(String value) { this.value = value; }
    }

}
