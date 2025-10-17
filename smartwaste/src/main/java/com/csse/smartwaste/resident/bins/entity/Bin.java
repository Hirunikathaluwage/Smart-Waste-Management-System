package com.csse.smartwaste.resident.bins.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

@Document(collection = "bins")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Bin {
    @Id
    private String id;

    private String ownerId; // Resident User
    private String status; // ACTIVE | DAMAGED | LOST

    private Tag tag;
    private Sensor sensor;
    private Location location;

    private Date installedAt;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Tag {
        private String type; // RFID | QR
        private String value;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Sensor {
        private String type; // ULTRASONIC | WEIGHT | NONE
        private LastReading lastReading;

        @Data
        @AllArgsConstructor
        @NoArgsConstructor
        public static class LastReading {
            private Double fillLevelPct;
            private Double batteryPct;
            private Date readAt;
        }
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Location {
        private String type = "Point";
        private List<Double> coordinates;
    }
}
