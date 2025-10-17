package com.csse.smartwaste.resident.bins.controller;

import com.csse.smartwaste.resident.bins.entity.Bin;
import com.csse.smartwaste.resident.bins.service.BinService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resident/bins")
@CrossOrigin("*")
public class BinController {

    @Autowired
    private BinService binService;

    @GetMapping
    public List<Bin> getAll() {
        return binService.getAllBins();
    }

    @GetMapping("/{id}")
    public Bin getById(@PathVariable String id) {
        return binService.getBinById(id);
    }

    @PostMapping
    public Bin create(@RequestBody Bin bin) {
        return binService.createBin(bin);
    }

    @PutMapping("/{id}")
    public Bin update(@PathVariable String id, @RequestBody Bin bin) {
        return binService.updateBin(id, bin);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        binService.deleteBin(id);
    }
}
