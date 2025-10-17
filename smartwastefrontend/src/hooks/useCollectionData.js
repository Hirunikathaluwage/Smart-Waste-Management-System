/**
 * Custom hook for collection data management
 * Follows SRP - only handles data loading and persistence
 */
import { useState, useEffect, useCallback } from 'react';
import binService from '../services/BinService';
import collectionService from '../services/CollectionService';

export const useCollectionData = (workerId) => {
  const [availableBins, setAvailableBins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshBinData = useCallback(async () => {
    try {
      const bins = await binService.getAllBins();
      setAvailableBins(bins);
      return bins;
    } catch (err) {
      console.error("Failed to refresh bin data:", err);
      return null;
    }
  }, []);

  const loadCollectionData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Load bins
      const bins = await binService.getAllBins();
      setAvailableBins(bins);

      // Load today's collection records
      const todayCollections = await collectionService.getTodayCollectionRecords(workerId);
      
      // Load any locally collected bins that might not be in backend yet
      const localCollections = JSON.parse(localStorage.getItem('localCollections') || '[]');
      const allCollections = [...todayCollections, ...localCollections];
      
      // Normalize data structure to ensure consistent field names
      const normalizedCollections = allCollections.map(collection => ({
        binId: collection.binId,
        location: collection.location || collection.binLocation || collection.address || 'Unknown Location',
        timestamp: collection.timestamp || collection.dateTime || collection.collectedAt || new Date().toLocaleString(),
        weight: collection.weight || 0,
        fillLevel: collection.fillLevel || 'N/A',
        status: collection.status || 'Collected',
        reason: collection.reason || null
      }));
      
      // Remove duplicates based on binId
      const uniqueCollections = normalizedCollections.reduce((acc, current) => {
        const existingIndex = acc.findIndex(item => item.binId === current.binId);
        if (existingIndex === -1) {
          acc.push(current);
        } else {
          // Prefer backend data over local data
          acc[existingIndex] = current.binId.startsWith('BIN-') ? current : acc[existingIndex];
        }
        return acc;
      }, []);

      return {
        bins,
        collections: uniqueCollections,
        totalWeight: uniqueCollections.reduce((sum, record) => sum + (record.weight || 0), 0)
      };
    } catch (err) {
      console.error("Failed to load data:", err);
      setError("Failed to load data from server");

      // Fallback to mock data if backend is unavailable
      const sessionResetBins = JSON.parse(sessionStorage.getItem('sessionResetBins') || '[]');
      const mockBins = [
        { binId: 'BIN-001', address: '123 Galle Road, Colombo 03', ownerId: 'RES-001', status: sessionResetBins.includes('BIN-001') ? 'ACTIVE' : 'COLLECTED' },
        { binId: 'BIN-002', address: '456 Union Place, Colombo 02', ownerId: 'RES-002', status: 'ACTIVE' },
        { binId: 'BIN-003', address: '789 Main Street, Colombo 11', ownerId: 'RES-003', status: 'DAMAGED' },
        { binId: 'BIN-004', address: '321 Marine Drive, Colombo 06', ownerId: 'RES-004', status: 'ACTIVE' },
        { binId: 'BIN-005', address: '654 Galle Road, Mount Lavinia', ownerId: 'RES-005', status: 'ACTIVE' },
      ];
      setAvailableBins(mockBins);
      
      return {
        bins: mockBins,
        collections: [],
        totalWeight: 0
      };
    } finally {
      setLoading(false);
    }
  }, [workerId]);

  // Load data on mount
  useEffect(() => {
    loadCollectionData();
  }, [loadCollectionData]);

  return {
    availableBins,
    loading,
    error,
    refreshBinData,
    loadCollectionData
  };
};
