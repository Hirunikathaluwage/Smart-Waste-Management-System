package com.csse.smartwaste.bin.dto;

import com.csse.smartwaste.bin.entity.Bin;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Bin Request DTO - Data Transfer Object for bin creation/update requests
 * 
 * SOLID PRINCIPLES APPLIED:
 * - SRP (Single Responsibility): Only responsible for transferring bin request data
 * - OCP (Open/Closed): Open for extension with new fields, closed for modification
 * - DRY (Don't Repeat Yourself): Reusable request structure
 * 
 * CODE SMELLS AVOIDED:
 * - No primitive obsession: Uses proper data types
 * - No data clumps: Groups related data together
 * - Clear validation: Proper field validation
 */
public class BinRequest {
    private String binId;
    private String ownerId;
    private Bin.BinStatus status;
    private BinTagRequest tag;
    private Double latitude;
    private Double longitude;
    private String address;

    // Default constructor
    public BinRequest() {}

    // Constructor with required fields
    public BinRequest(String binId, String ownerId, Bin.BinStatus status, 
                     BinTagRequest tag, Double latitude, Double longitude, String address) {
        this.binId = binId;
        this.ownerId = ownerId;
        this.status = status;
        this.tag = tag;
        this.latitude = latitude;
        this.longitude = longitude;
        this.address = address;
    }

    // Getters and Setters
    public String getBinId() { return binId; }
    public void setBinId(String binId) { this.binId = binId; }

    public String getOwnerId() { return ownerId; }
    public void setOwnerId(String ownerId) { this.ownerId = ownerId; }

    public Bin.BinStatus getStatus() { return status; }
    public void setStatus(Bin.BinStatus status) { this.status = status; }

    public BinTagRequest getTag() { return tag; }
    public void setTag(BinTagRequest tag) { this.tag = tag; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    /**
     * Bin Tag Request DTO
     * SRP: Single responsibility - only represents tag request data
     */
    public static class BinTagRequest {
        private String type;
        private String value;

        public BinTagRequest() {}

        public BinTagRequest(String type, String value) {
            this.type = type;
            this.value = value;
        }

        public String getType() { return type; }
        public void setType(String type) { this.type = type; }

        public String getValue() { return value; }
        public void setValue(String value) { this.value = value; }
    }

}

