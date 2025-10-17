/**
 * Bin Simulation Service
 * Manages bin and bag simulation data
 */
class BinSimulationService {
  constructor() {
    this.bins = new Map();
    this.updateInterval = null;
    this.subscribers = new Set();
  }

  // Generate realistic bin data
  generateBinData(binId, ownerId, wasteType, location) {
    const now = new Date();
    
    // Natural fill level progression (bins fill up over time)
    const baseFill = Math.random() * 30 + 20; // Start between 20-50%
    const timeFactor = (now.getHours() / 24) * 20; // Fill more during day
    const fillLevel = Math.min(95, baseFill + timeFactor + Math.random() * 10);
    
    // Battery decreases over time but stays reasonable
    const batteryLevel = Math.max(15, 100 - (Math.random() * 30));
    
    // Temperature varies with time of day
    const hour = now.getHours();
    const baseTemp = 20 + (hour > 6 && hour < 18 ? 8 : 0); // Warmer during day
    const temperature = baseTemp + Math.random() * 4;
    
    // Signal strength (mostly good)
    const signalLevels = ['Excellent', 'Good', 'Fair', 'Poor'];
    const signalStrength = signalLevels[Math.random() < 0.8 ? 0 : Math.floor(Math.random() * 4)];
    
    return {
      binId,
      ownerId,
      wasteType,
      location,
      fillLevel: Math.round(fillLevel),
      batteryLevel: Math.round(batteryLevel),
      temperature: Math.round(temperature * 10) / 10,
      humidity: Math.round(40 + Math.random() * 30),
      pressure: Math.round(1010 + Math.random() * 20),
      signalStrength,
      status: fillLevel > 90 ? 'OVERFLOWING' : 'ACTIVE',
      lastUpdated: now.toISOString(),
      alerts: this.generateAlerts(fillLevel, batteryLevel, signalStrength)
    };
  }

  generateAlerts(fillLevel, batteryLevel, signalStrength) {
    const alerts = [];
    
    if (fillLevel > 90) {
      alerts.push({
        type: 'overflow',
        message: `Bin is overflowing (${fillLevel}%)`,
        severity: 'high',
        icon: '⚠️'
      });
    }
    
    if (batteryLevel < 20) {
      alerts.push({
        type: 'low_battery',
        message: `Low battery (${batteryLevel}%)`,
        severity: 'medium',
        icon: '🔋'
      });
    }
    
    if (signalStrength === 'Poor') {
      alerts.push({
        type: 'poor_signal',
        message: 'Poor signal strength',
        severity: 'medium',
        icon: '📶'
      });
    }
    
    return alerts;
  }

  // Initialize bins for a user
  initializeUserBins(userId) {
    const binTypes = [
      { wasteType: 'General', location: 'Front Yard' },
      { wasteType: 'Recyclable', location: 'Back Yard' },
      { wasteType: 'Organic', location: 'Kitchen' }
    ];

    binTypes.forEach((binType, index) => {
      const binId = `BIN${String(index + 1).padStart(3, '0')}`;
      const binData = this.generateBinData(binId, userId, binType.wasteType, binType.location);
      this.bins.set(binId, binData);
    });
  }

  // Add a new bin to the simulation
  addNewBin(userId, wasteType, location, binType = 'General') {
    // Find the next available bin ID
    let binIndex = 1;
    let binId;
    do {
      binId = `BIN${String(binIndex).padStart(3, '0')}`;
      binIndex++;
    } while (this.bins.has(binId));

    const binData = this.generateBinData(binId, userId, wasteType, location);
    this.bins.set(binId, binData);
    
    // Notify subscribers
    this.subscribers.forEach(callback => {
      try {
        callback(Array.from(this.bins.values()));
      } catch (error) {
        console.error('Error notifying subscriber:', error);
      }
    });

    return binData;
  }

  // Add bags (represented as a special bin type)
  addNewBags(userId, bagType, quantity, location) {
    // For bags, we create a special bin entry that represents the bag collection
    const binId = `BAGS${Date.now()}`;
    const binData = {
      binId,
      ownerId: userId,
      wasteType: `${bagType} Bags (${quantity} packs)`,
      location,
      fillLevel: 0, // Bags start empty
      batteryLevel: 100, // No battery for bags
      temperature: 20,
      humidity: 50,
      pressure: 1013,
      signalStrength: 'Excellent',
      status: 'ACTIVE',
      lastUpdated: new Date().toISOString(),
      alerts: [],
      isBagCollection: true,
      bagType,
      bagQuantity: quantity
    };

    this.bins.set(binId, binData);
    
    // Notify subscribers
    this.subscribers.forEach(callback => {
      try {
        callback(Array.from(this.bins.values()));
      } catch (error) {
        console.error('Error notifying subscriber:', error);
      }
    });

    return binData;
  }

  // Get bins for a user
  getUserBins(userId) {
    return Array.from(this.bins.values()).filter(bin => bin.ownerId === userId);
  }

  // Get statistics
  getUserStats(userId) {
    const userBins = this.getUserBins(userId);
    return {
      totalBins: userBins.length,
      activeBins: userBins.filter(bin => bin.status === 'ACTIVE').length,
      overflowingBins: userBins.filter(bin => bin.fillLevel > 90).length,
      lowBatteryBins: userBins.filter(bin => bin.batteryLevel < 20).length,
      averageFillLevel: userBins.length > 0 ? 
        Math.round(userBins.reduce((sum, bin) => sum + bin.fillLevel, 0) / userBins.length) : 0,
      averageBatteryLevel: userBins.length > 0 ? 
        Math.round(userBins.reduce((sum, bin) => sum + bin.batteryLevel, 0) / userBins.length) : 0
    };
  }

  // Update all bins with new data
  updateAllBins() {
    this.bins.forEach((bin, binId) => {
      if (!bin.isBagCollection) { // Only update real bins, not bag collections
        const updatedBin = this.generateBinData(binId, bin.ownerId, bin.wasteType, bin.location);
        this.bins.set(binId, updatedBin);
      }
    });
    
    // Notify subscribers
    this.subscribers.forEach(callback => {
      try {
        callback(Array.from(this.bins.values()));
      } catch (error) {
        console.error('Error notifying subscriber:', error);
      }
    });
  }

  // Start real-time updates
  startUpdates(intervalMs = 5000) {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    
    this.updateInterval = setInterval(() => {
      this.updateAllBins();
    }, intervalMs);
  }

  // Stop updates
  stopUpdates() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  // Subscribe to updates
  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  // Get all bins
  getAllBins() {
    return Array.from(this.bins.values());
  }
}

// Create singleton instance
const binSimulationService = new BinSimulationService();

export default binSimulationService;

