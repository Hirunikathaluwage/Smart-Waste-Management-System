package com.csse.smartwaste.pickup.dto;

import com.csse.smartwaste.common.model.PickupType;
import com.csse.smartwaste.common.model.WasteType;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * PickupRequestCreateDTO - DTO for creating pickup requests
 */
public class PickupRequestCreateDTO {
    
    private String userId;
    private WasteType wasteType;
    private String itemDescription;
    private List<String> itemImages;
    private BigDecimal estimatedWeight;
    private String specialInstructions;
    private PickupType pickupType;
    private LocalDateTime preferredDateTime;
    private String pickupLocation;
    private String address;
    private String city;
    private String postalCode;
    private Double latitude;
    private Double longitude;
    private String paymentMethod;
    private BigDecimal rewardPointsUsed;

    // Constructors
    public PickupRequestCreateDTO() {}

    // Getters & Setters
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public WasteType getWasteType() { return wasteType; }
    public void setWasteType(WasteType wasteType) { this.wasteType = wasteType; }

    public String getItemDescription() { return itemDescription; }
    public void setItemDescription(String itemDescription) { this.itemDescription = itemDescription; }

    public List<String> getItemImages() { return itemImages; }
    public void setItemImages(List<String> itemImages) { this.itemImages = itemImages; }

    public BigDecimal getEstimatedWeight() { return estimatedWeight; }
    public void setEstimatedWeight(BigDecimal estimatedWeight) { this.estimatedWeight = estimatedWeight; }

    public String getSpecialInstructions() { return specialInstructions; }
    public void setSpecialInstructions(String specialInstructions) { this.specialInstructions = specialInstructions; }

    public PickupType getPickupType() { return pickupType; }
    public void setPickupType(PickupType pickupType) { this.pickupType = pickupType; }

    public LocalDateTime getPreferredDateTime() { return preferredDateTime; }
    public void setPreferredDateTime(LocalDateTime preferredDateTime) { this.preferredDateTime = preferredDateTime; }

    public String getPickupLocation() { return pickupLocation; }
    public void setPickupLocation(String pickupLocation) { this.pickupLocation = pickupLocation; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getPostalCode() { return postalCode; }
    public void setPostalCode(String postalCode) { this.postalCode = postalCode; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public BigDecimal getRewardPointsUsed() { return rewardPointsUsed; }
    public void setRewardPointsUsed(BigDecimal rewardPointsUsed) { this.rewardPointsUsed = rewardPointsUsed; }
}
