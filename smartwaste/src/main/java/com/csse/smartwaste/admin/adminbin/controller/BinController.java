package com.csse.smartwaste.admin.adminbin.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.csse.smartwaste.admin.adminbin.entity.Bin;
import com.csse.smartwaste.admin.adminbin.service.BinService;

@RestController("adminBinController")
@RequestMapping("/api/admin/bins")
@CrossOrigin(origins = "*")
public class BinController {

    private final BinService binService;

    public BinController(BinService binService) {
        this.binService = binService;
    }

    @GetMapping("/all")
    public ResponseEntity<List<Bin>> getAllBins() {
        return ResponseEntity.ok(binService.getAllBins());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getBinById(@PathVariable String id) {
        return binService.getBinById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(404)
                .body(Map.of("error", "Bin not found", "id", id)));
    }

    @PostMapping("/create")
    public ResponseEntity<?> createBinRequest(@RequestBody Bin bin) {
        Bin created = binService.createBinRequest(bin);
        return ResponseEntity.ok(Map.of(
                "message", "Bin request created successfully",
                "data", created
        ));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable String id,
            @RequestParam String status,
            @RequestParam(required = false) String note) {
        try {
            Bin updated = binService.updateStatus(id, status, note);
            return ResponseEntity.ok(Map.of(
                    "message", "Bin status updated successfully",
                    "id", updated.getId(),
                    "newStatus", updated.getStatus(),
                    "note", updated.getNote()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage(), "id", id));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBin(@PathVariable String id) {
        try {
            binService.deleteBin(id);
            return ResponseEntity.ok(Map.of(
                    "message", "Bin deleted successfully",
                    "id", id
            ));
        } catch (Exception e) {
            return ResponseEntity.status(404).body(Map.of(
                    "error", "Bin not found or already deleted",
                    "id", id
            ));
        }
    }
}
