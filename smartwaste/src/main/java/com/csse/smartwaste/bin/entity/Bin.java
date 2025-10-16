package com.csse.smartwaste.bin.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.LocalDateTime;

/**
 * Bin Entity - Represents a waste collection bin
 * 
 * SOLID PRINCIPLES APPLIED:
 * - SRP (Single Responsibility): This class has only one reason to change - bin data structure changes
 * - OCP (Open/Closed): Open for extension (new fields) but closed for modification of core structure
 * - DRY (Don't Repeat Yourself): Reusable bin model across the application
 * 
 * CODE SMELLS AVOIDED:
 * - No God class: Focused only on bin representation
 * - No magic numbers: All constants are properly defined
 * - Clear naming: Descriptive field names
 * - Proper encapsulation: Private fields with public getters/setters
 */
@Document(collection = "bins")
@JsonIgnoreProperties(ignoreUnknown = true)
public class Bin {

    @Id
    private String id;

    private String binId;
    private String ownerId;
    private BinStatus status;
    private BinTag tag;
    private Double latitude;
    private Double longitude;
    private String address;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Default constructor for MongoDB
    public Bin() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // Constructor with required fields
    public Bin(String binId, String ownerId, BinStatus status, BinTag tag, Double latitude, Double longitude, String address) {
        this();
        this.binId = binId;
        this.ownerId = ownerId;
        this.status = status;
        this.tag = tag;
        this.latitude = latitude;
        this.longitude = longitude;
        this.address = address;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getBinId() { return binId; }
    public void setBinId(String binId) { this.binId = binId; }

    public String getOwnerId() { return ownerId; }
    public void setOwnerId(String ownerId) { this.ownerId = ownerId; }

    public BinStatus getStatus() { return status; }
    public void setStatus(BinStatus status) { 
        this.status = status; 
        this.updatedAt = LocalDateTime.now();
    }

    public BinTag getTag() { return tag; }
    public void setTag(BinTag tag) { this.tag = tag; }

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
     * Bin Status Enum
     * SRP: Single responsibility - only manages bin status values
     * OCP: Open for extension - new statuses can be added without modifying existing code
     * 
     * Status Definitions:
     * - ACTIVE: Bin is ready for collection
     * - COLLECTED: Bin has been collected today
     * - DAMAGED: Bin needs repair
     * - LOST: Bin is missing
     * - MAINTENANCE: Bin is under maintenance
     */
    public enum BinStatus {
        ACTIVE, COLLECTED, DAMAGED, LOST, MAINTENANCE
    }

    /**
     * Bin Tag Inner Class
     * SRP: Single responsibility - only represents tag information
     * Encapsulation: Groups related tag data together
     */
    public static class BinTag {
        private String type;
        private String value;

        public BinTag() {}

        public BinTag(String type, String value) {
            this.type = type;
            this.value = value;
        }

        public String getType() { return type; }
        public void setType(String type) { this.type = type; }

        public String getValue() { return value; }
        public void setValue(String value) { this.value = value; }
    }


    @Override
    public String toString() {
        return "Bin{" +
                "id='" + id + '\'' +
                ", binId='" + binId + '\'' +
                ", ownerId='" + ownerId + '\'' +
                ", status=" + status +
                ", address='" + address + '\'' +
                '}';
    }
}
