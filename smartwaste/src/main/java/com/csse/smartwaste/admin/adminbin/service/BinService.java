package com.csse.smartwaste.admin.adminbin.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import com.csse.smartwaste.admin.adminbin.entity.Bin;
import com.csse.smartwaste.admin.adminbin.repository.BinRepository;

@Service("adminBinService")
public class BinService {

    private final BinRepository binRepository;

    @Autowired
    public BinService(@Qualifier("adminBinRepository") BinRepository binRepository) {
        this.binRepository = binRepository;
    }

    public List<Bin> getAllBins() {
        return binRepository.findAll();
    }

    public Optional<Bin> getBinById(String id) {
        return binRepository.findById(id);
    }

    public Bin createBinRequest(Bin bin) {
        bin.setStatus("Pending");
        bin.setCreatedAt(LocalDateTime.now());
        return binRepository.save(bin);
    }

    public Bin updateStatus(String id, String status, String note) {
        Optional<Bin> optionalBin = binRepository.findById(id);
        if (optionalBin.isPresent()) {
            Bin bin = optionalBin.get();
            bin.setStatus(status);
            bin.setNote(note);
            bin.setUpdatedAt(LocalDateTime.now());
            return binRepository.save(bin);
        }
        throw new RuntimeException("Bin not found");
    }

    public void deleteBin(String id) {
        binRepository.deleteById(id);
    }
}
