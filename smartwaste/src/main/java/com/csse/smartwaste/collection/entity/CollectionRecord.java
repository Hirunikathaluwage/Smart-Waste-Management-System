package com.csse.smartwaste.collection.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.LocalDateTime;

/**
 * CollectionRecord Entity - Represents a waste collection record
 * 
 * SOLID PRINCIPLES APPLIED:
 * - SRP (Single Responsibility): This class has only one reason to change - collection record data structure changes
 * - OCP (Open/Closed): Open for extension (new fields) but closed for modification of core structure
 * - DRY (Don't Repeat Yourself): Reusable collection record model across the application
 * 
 * CODE SMELLS AVOIDED:
 * - No God class: Focused only on collection record representation
 * - No magic numbers: All constants are properly defined
 * - Clear naming: Descriptive field names
 * - Proper encapsulation: Private fields with public getters/setters
 */
@Document(collection = "collection_records")
@JsonIgnoreProperties(ignoreUnknown = true)
public class CollectionRecord {

    @Id
    private String id;

    @Field("bin_id")
    private String binId;

    @Field("worker_id")
    private String workerId;

    @Field("collection_date")
    private LocalDateTime collectionDate;

    @Field("bin_location")
    private String binLocation;

    @Field("bin_owner")
    private String binOwner;

    @Field("weight")
    private Double weight;

    @Field("fill_level")
    private Integer fillLevel;

    @Field("waste_type")
    private String wasteType;

    @Field("collection_status")
    private CollectionStatus status;

    @Field("collection_reason")
    private String reason;

    @Field("sensor_data")
    private SensorData sensorData;

    @Field("created_at")
    private LocalDateTime createdAt;

    @Field("updated_at")
    private LocalDateTime updatedAt;

    // Default constructor for MongoDB
    public CollectionRecord() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // Constructor with required fields
    public CollectionRecord(String binId, String workerId, String binLocation, String binOwner, 
                           Double weight, Integer fillLevel, String wasteType, CollectionStatus status) {
        this();
        this.binId = binId;
        this.workerId = workerId;
        this.binLocation = binLocation;
        this.binOwner = binOwner;
        this.weight = weight;
        this.fillLevel = fillLevel;
        this.wasteType = wasteType;
        this.status = status;
        this.collectionDate = LocalDateTime.now();
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getBinId() {
        return binId;
    }

    public void setBinId(String binId) {
        this.binId = binId;
    }

    public String getWorkerId() {
        return workerId;
    }

    public void setWorkerId(String workerId) {
        this.workerId = workerId;
    }

    public LocalDateTime getCollectionDate() {
        return collectionDate;
    }

    public void setCollectionDate(LocalDateTime collectionDate) {
        this.collectionDate = collectionDate;
    }

    public String getBinLocation() {
        return binLocation;
    }

    public void setBinLocation(String binLocation) {
        this.binLocation = binLocation;
    }

    public String getBinOwner() {
        return binOwner;
    }

    public void setBinOwner(String binOwner) {
        this.binOwner = binOwner;
    }

    public Double getWeight() {
        return weight;
    }

    public void setWeight(Double weight) {
        this.weight = weight;
    }

    public Integer getFillLevel() {
        return fillLevel;
    }

    public void setFillLevel(Integer fillLevel) {
        this.fillLevel = fillLevel;
    }

    public String getWasteType() {
        return wasteType;
    }

    public void setWasteType(String wasteType) {
        this.wasteType = wasteType;
    }

    public CollectionStatus getStatus() {
        return status;
    }

    public void setStatus(CollectionStatus status) {
        this.status = status;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public SensorData getSensorData() {
        return sensorData;
    }

    public void setSensorData(SensorData sensorData) {
        this.sensorData = sensorData;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    /**
     * Collection Status Enum
     * SRP: Single responsibility - only represents collection status
     */
    public enum CollectionStatus {
        COLLECTED,
        OVERRIDE,
        MISSED,
        FAILED
    }

    /**
     * Sensor Data Inner Class
     * SRP: Single responsibility - only represents sensor data
     */
    public static class SensorData {
        private Double temperature;
        private Integer batteryLevel;
        private String signalStrength;

        public SensorData() {}

        public SensorData(Double temperature, Integer batteryLevel, String signalStrength) {
            this.temperature = temperature;
            this.batteryLevel = batteryLevel;
            this.signalStrength = signalStrength;
        }

        // Getters and Setters
        public Double getTemperature() {
            return temperature;
        }

        public void setTemperature(Double temperature) {
            this.temperature = temperature;
        }

        public Integer getBatteryLevel() {
            return batteryLevel;
        }

        public void setBatteryLevel(Integer batteryLevel) {
            this.batteryLevel = batteryLevel;
        }

        public String getSignalStrength() {
            return signalStrength;
        }

        public void setSignalStrength(String signalStrength) {
            this.signalStrength = signalStrength;
        }
    }
}
