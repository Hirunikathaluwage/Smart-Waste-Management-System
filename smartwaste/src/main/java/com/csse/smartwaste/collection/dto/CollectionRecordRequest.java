package com.csse.smartwaste.collection.dto;

import com.csse.smartwaste.collection.entity.CollectionRecord;
import java.time.LocalDateTime;

/**
 * CollectionRecordRequest DTO - For creating collection records
 * 
 * SOLID PRINCIPLES APPLIED:
 * - SRP (Single Responsibility): Only responsible for collection record creation data
 * - DRY (Don't Repeat Yourself): Reusable DTO for collection record creation
 * 
 * CODE SMELLS AVOIDED:
 * - No God class: Focused only on collection record creation
 * - Clear naming: Descriptive field names
 * - Proper encapsulation: Private fields with public getters/setters
 */
public class CollectionRecordRequest {

    private String binId;
    private String workerId;
    private String binLocation;
    private String binOwner;
    private Double weight;
    private Integer fillLevel;
    private String wasteType;
    private CollectionRecord.CollectionStatus status;
    private String reason;
    private SensorDataRequest sensorData;

    // Default constructor
    public CollectionRecordRequest() {}

    // Constructor with required fields
    public CollectionRecordRequest(String binId, String workerId, String binLocation, String binOwner,
                                  Double weight, Integer fillLevel, String wasteType, CollectionRecord.CollectionStatus status) {
        this.binId = binId;
        this.workerId = workerId;
        this.binLocation = binLocation;
        this.binOwner = binOwner;
        this.weight = weight;
        this.fillLevel = fillLevel;
        this.wasteType = wasteType;
        this.status = status;
    }

    // Getters and Setters
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

    public SensorDataRequest getSensorData() {
        return sensorData;
    }

    public void setSensorData(SensorDataRequest sensorData) {
        this.sensorData = sensorData;
    }

    /**
     * Sensor Data Request DTO
     * SRP: Single responsibility - only represents sensor data for requests
     */
    public static class SensorDataRequest {
        private Double temperature;
        private Integer batteryLevel;
        private String signalStrength;

        public SensorDataRequest() {}

        public SensorDataRequest(Double temperature, Integer batteryLevel, String signalStrength) {
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
