/**
 * Custom hook for managing collection state
 * Follows SRP - only handles collection-related state management
 */
import { useState, useCallback } from 'react';

export const useCollectionState = () => {
  const [binId, setBinId] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [collectedBins, setCollectedBins] = useState([]);
  const [totalWeight, setTotalWeight] = useState(0);
  const [sensorData, setSensorData] = useState(null);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [manualWeight, setManualWeight] = useState(25);
  const [wasteType, setWasteType] = useState("General");
  const [showSummary, setShowSummary] = useState(false);

  const clearFeedback = useCallback(() => {
    setFeedback(null);
  }, []);

  const addCollectedBin = useCallback((bin) => {
    setCollectedBins(prev => [...prev, bin]);
    setTotalWeight(prev => prev + (bin.weight || 0));
  }, []);

  const removeCollectedBin = useCallback((binId) => {
    setCollectedBins(prev => {
      const binToRemove = prev.find(bin => bin.binId === binId);
      if (binToRemove) {
        setTotalWeight(prevWeight => prevWeight - (binToRemove.weight || 0));
      }
      return prev.filter(bin => bin.binId !== binId);
    });
  }, []);

  const updateCollectedBins = useCallback((bins) => {
    setCollectedBins(bins);
    const totalWeightFromBins = bins.reduce((sum, bin) => sum + (bin.weight || 0), 0);
    setTotalWeight(totalWeightFromBins);
  }, []);

  return {
    // State
    binId,
    feedback,
    collectedBins,
    totalWeight,
    sensorData,
    showManualEntry,
    manualWeight,
    wasteType,
    showSummary,
    
    // Setters
    setBinId,
    setFeedback,
    setSensorData,
    setShowManualEntry,
    setManualWeight,
    setWasteType,
    setShowSummary,
    
    // Actions
    clearFeedback,
    addCollectedBin,
    removeCollectedBin,
    updateCollectedBins
  };
};
