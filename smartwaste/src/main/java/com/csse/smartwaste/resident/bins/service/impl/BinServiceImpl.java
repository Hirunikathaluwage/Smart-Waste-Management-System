package com.csse.smartwaste.resident.bins.service.impl;

import com.csse.smartwaste.resident.bins.entity.Bin;
import com.csse.smartwaste.resident.bins.repository.BinRepository;
import com.csse.smartwaste.resident.bins.service.BinService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BinServiceImpl implements BinService {

    @Autowired
    private BinRepository binRepository;

    @Override
    public List<Bin> getAllBins() {
        return binRepository.findAll();
    }

    @Override
    public Bin getBinById(String id) {
        return binRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bin not found"));
    }

    @Override
    public Bin createBin(Bin bin) {
        return binRepository.save(bin);
    }

    @Override
    public Bin updateBin(String id, Bin bin) {
        Bin existing = getBinById(id);
        bin.setId(existing.getId());
        return binRepository.save(bin);
    }

    @Override
    public void deleteBin(String id) {
        binRepository.deleteById(id);
    }
}
