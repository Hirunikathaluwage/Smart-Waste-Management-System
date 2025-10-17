package com.csse.smartwaste.common.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * WasteRecord model SRP: Represents a single waste collection record stored in
 * MongoDB. This entity is shared across multiple modules.
 */
@Document(collection = "waste_records")
public class WasteRecord {

    @Id
    private String id;
    private String area;
    private String wasteType; // e.g., general, recyclables, organic, hazardous
    private double weightKg;
    private String collectionDate;

    public WasteRecord() {
    }

    // --- Getters and Setters ---
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getArea() {
        return area;
    }

    public void setArea(String area) {
        this.area = area;
    }

    public String getWasteType() {
        return wasteType;
    }

    public void setWasteType(String wasteType) {
        this.wasteType = wasteType;
    }

    public double getWeightKg() {
        return weightKg;
    }

    public void setWeightKg(double weightKg) {
        this.weightKg = weightKg;
    }

    public String getCollectionDate() {
        return collectionDate;
    }

    public void setCollectionDate(String collectionDate) {
        this.collectionDate = collectionDate;
    }
}
