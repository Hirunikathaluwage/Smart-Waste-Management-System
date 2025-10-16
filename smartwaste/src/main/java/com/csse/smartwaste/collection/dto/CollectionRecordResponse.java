package com.csse.smartwaste.collection.dto;

import com.csse.smartwaste.collection.entity.CollectionRecord;
import java.time.LocalDateTime;

/**
 * CollectionRecordResponse DTO - For returning collection record data
 * 
 * SOLID PRINCIPLES APPLIED:
 * - SRP (Single Responsibility): Only responsible for collection record response data
 * - DRY (Don't Repeat Yourself): Reusable DTO for collection record responses
 * 
 * CODE SMELLS AVOIDED:
 * - No God class: Focused only on collection record response
 * - Clear naming: Descriptive field names
 * - Proper encapsulation: Private fields with public getters/setters
 */
public class CollectionRecordResponse {

    private String id;
    private String binId;
    private String workerId;
    private LocalDateTime collectionDate;
    private String binLocation;
    private String binOwner;
    private Double weight;
    private Integer fillLevel;
    private String wasteType;
    private CollectionRecord.CollectionStatus status;
    private String reason;
    private SensorDataResponse sensorData;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Default constructor
    public CollectionRecordResponse() {}

    // Constructor with all fields
    public CollectionRecordResponse(String id, String binId, String workerId, LocalDateTime collectionDate,
                                   String binLocation, String binOwner, Double weight, Integer fillLevel,
                                   String wasteType, CollectionRecord.CollectionStatus status, String reason,
                                   SensorDataResponse sensorData, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.binId = binId;
        this.workerId = workerId;
        this.collectionDate = collectionDate;
        this.binLocation = binLocation;
        this.binOwner = binOwner;
        this.weight = weight;
        this.fillLevel = fillLevel;
        this.wasteType = wasteType;
        this.status = status;
        this.reason = reason;
        this.sensorData = sensorData;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    /**
     * Factory method to create response from entity
     * SRP: Single responsibility - only converts entity to response
     * 
     * @param record the collection record entity
     * @return CollectionRecordResponse
     */
    public static CollectionRecordResponse fromCollectionRecord(CollectionRecord record) {
        SensorDataResponse sensorDataResponse = null;
        if (record.getSensorData() != null) {
            sensorDataResponse = new SensorDataResponse(
                record.getSensorData().getTemperature(),
                record.getSensorData().getBatteryLevel(),
                record.getSensorData().getSignalStrength()
            );
        }

        return new CollectionRecordResponse(
            record.getId(),
            record.getBinId(),
            record.getWorkerId(),
            record.getCollectionDate(),
            record.getBinLocation(),
            record.getBinOwner(),
            record.getWeight(),
            record.getFillLevel(),
            record.getWasteType(),
            record.getStatus(),
            record.getReason(),
            sensorDataResponse,
            record.getCreatedAt(),
            record.getUpdatedAt()
        );
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

    public CollectionRecord.CollectionStatus getStatus() {
        return status;
    }

    public void setStatus(CollectionRecord.CollectionStatus status) {
        this.status = status;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public SensorDataResponse getSensorData() {
        return sensorData;
    }

    public void setSensorData(SensorDataResponse sensorData) {
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
     * Sensor Data Response DTO
     * SRP: Single responsibility - only represents sensor data for responses
     */
    public static class SensorDataResponse {
        private Double temperature;
        private Integer batteryLevel;
        private String signalStrength;

        public SensorDataResponse() {}

        public SensorDataResponse(Double temperature, Integer batteryLevel, String signalStrength) {
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
