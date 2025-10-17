package com.csse.smartwaste.resident.bins.service;

import com.csse.smartwaste.resident.bins.entity.Bin;
import java.util.List;

public interface BinService {
    List<Bin> getAllBins();

    Bin getBinById(String id);

    Bin createBin(Bin bin);

    Bin updateBin(String id, Bin bin);

    void deleteBin(String id);
}
