/**
 * IoTSensorService - Real-time IoT sensor data simulation for bins
 * 
 * SOLID PRINCIPLES APPLIED:
 * - SRP (Single Responsibility): Only responsible for IoT sensor data simulation
 * - OCP (Open/Closed): Open for extension with new sensor types, closed for modification
 * - DIP (Dependency Inversion): Depends on sensor data abstraction, not concrete implementations
 * - ISP (Interface Segregation): Focused sensor interface without unnecessary dependencies
 * 
 * CODE SMELLS AVOIDED:
 * - No God class: Focused only on sensor data simulation
 * - No duplicate code: Reusable sensor data components
 * - No magic numbers: All sensor ranges properly defined
 * - Clear separation: Data generation logic separated from business logic
 */

class IoTSensorService {
  constructor() {
    // Sensor configuration following OCP - easy to extend with new sensor types
    this.sensorConfig = {
      weight: { min: 5, max: 50, unit: 'kg' },
      fillLevel: { min: 20, max: 100, unit: '%' },
      temperature: { min: 15, max: 30, unit: '°C' },
      batteryLevel: { min: 60, max: 100, unit: '%' },
      humidity: { min: 30, max: 80, unit: '%' },
      pressure: { min: 1000, max: 1020, unit: 'hPa' }
    };

    // Waste types following OCP - easy to extend with new waste types
    this.wasteTypes = ['General', 'Recyclable', 'Organic', 'Hazardous', 'Electronic'];
    
    // Signal strength levels following OCP - easy to extend with new levels
    this.signalLevels = ['Excellent', 'Good', 'Fair', 'Poor', 'No Signal'];
    
    // Bin statuses following OCP - easy to extend with new statuses
    this.binStatuses = ['ACTIVE', 'DAMAGED', 'MAINTENANCE', 'LOST', 'OVERFLOWING'];
    
    // Real-time data storage
    this.realTimeData = new Map();
    this.subscribers = new Map();
    this.updateInterval = null;
    
    // Initialize with some default bins
    this.initializeDefaultBins();
  }

  /**
   * Initialize default bins for demonstration
   * SRP: Single responsibility - only handles default bin initialization
   */
  initializeDefaultBins() {
    const defaultBins = [
      { binId: 'BIN001', ownerId: 'user123', wasteType: 'General', location: 'Front Yard' },
      { binId: 'BIN002', ownerId: 'user123', wasteType: 'Recyclable', location: 'Back Yard' },
      { binId: 'BIN003', ownerId: 'user456', wasteType: 'Organic', location: 'Kitchen' },
      { binId: 'BIN004', ownerId: 'user456', wasteType: 'General', location: 'Garage' },
      { binId: 'BIN005', ownerId: 'business789', wasteType: 'Electronic', location: 'Office' },
      { binId: 'BIN006', ownerId: 'business789', wasteType: 'Hazardous', location: 'Storage' }
    ];

    defaultBins.forEach(bin => {
      this.realTimeData.set(bin.binId, {
        ...bin,
        ...this.generateSensorData(bin.binId),
        lastUpdated: new Date().toISOString()
      });
    });
  }

  /**
   * Ensure user has bins - creates default bins if user has none
   * SRP: Single responsibility - only handles user bin initialization
   */
  ensureUserHasBins(userId) {
    console.log('ensureUserHasBins called for userId:', userId);
    const userBins = this.getOwnerBinsData(userId);
    console.log('Current user bins:', userBins);
    
    if (userBins.length === 0) {
      console.log('No bins found, creating default bins for user:', userId);
      // Create default bins for the user
      const userBinTypes = [
        { wasteType: 'General', location: 'Front Yard' },
        { wasteType: 'Recyclable', location: 'Back Yard' },
        { wasteType: 'Organic', location: 'Kitchen' }
      ];

      userBinTypes.forEach((binType, index) => {
        const binId = `BIN${String(index + 1).padStart(3, '0')}`;
        const binData = {
          binId: binId,
          ownerId: userId,
          wasteType: binType.wasteType,
          location: binType.location
        };

        console.log('Adding bin:', binData);
        this.addBin(binData);
      });
      
      console.log('After adding bins, user bins:', this.getOwnerBinsData(userId));
    } else {
      console.log('User already has bins:', userBins.length);
    }
  }

  /**
   * Generate random number within range - follows SRP for random generation
   * DIP: Depends on Math.random abstraction
   */
  generateRandomValue(min, max, precision = 0) {
    const value = Math.random() * (max - min) + min;
    return precision > 0 ? Math.round(value * Math.pow(10, precision)) / Math.pow(10, precision) : Math.round(value);
  }

  /**
   * Generate random waste type - follows SRP for waste type selection
   * OCP: Easy to extend with new waste types
   */
  generateRandomWasteType() {
    return this.wasteTypes[this.generateRandomValue(0, this.wasteTypes.length - 1)];
  }

  /**
   * Generate random signal strength - follows SRP for signal generation
   * OCP: Easy to extend with new signal levels
   */
  generateRandomSignalStrength() {
    return this.signalLevels[this.generateRandomValue(0, this.signalLevels.length - 1)];
  }

  /**
   * Generate sensor data for a specific bin - follows SRP for data generation
   * OCP: Open for extension with new sensor types
   * DIP: Depends on sensor configuration abstraction
   */
  generateSensorData(binId) {
    if (!binId) {
      throw new Error('Bin ID is required for sensor data generation');
    }

    // Generate sensor data following OCP - easy to extend with new sensors
    const sensorData = {
      binId: binId.toUpperCase(),
      timestamp: new Date().toISOString(),
      weight: this.generateRandomValue(
        this.sensorConfig.weight.min, 
        this.sensorConfig.weight.max
      ),
      fillLevel: this.generateRandomValue(
        this.sensorConfig.fillLevel.min, 
        this.sensorConfig.fillLevel.max
      ),
      temperature: this.generateRandomValue(
        this.sensorConfig.temperature.min, 
        this.sensorConfig.temperature.max
      ),
      humidity: this.generateRandomValue(
        this.sensorConfig.humidity.min, 
        this.sensorConfig.humidity.max
      ),
      pressure: this.generateRandomValue(
        this.sensorConfig.pressure.min, 
        this.sensorConfig.pressure.max
      ),
      wasteType: this.generateRandomWasteType(),
      batteryLevel: this.generateRandomValue(
        this.sensorConfig.batteryLevel.min, 
        this.sensorConfig.batteryLevel.max
      ),
      signalStrength: this.generateRandomSignalStrength(),
      location: {
        latitude: this.generateRandomValue(6.8, 7.0, 4), // Colombo area
        longitude: this.generateRandomValue(79.8, 80.0, 4)
      },
      status: this.getBinStatus(),
      alerts: []
    };

    // Generate alerts based on sensor data
    sensorData.alerts = this.generateSensorAlerts(sensorData);

    return sensorData;
  }

  /**
   * Get bin status based on sensor data
   * SRP: Single responsibility - only handles status determination
   */
  getBinStatus() {
    const statuses = ['ACTIVE', 'DAMAGED', 'MAINTENANCE', 'OVERFLOWING'];
    return statuses[this.generateRandomValue(0, statuses.length - 1)];
  }

  /**
   * Generate sensor alerts - follows SRP for alert generation
   * OCP: Easy to extend with new alert types
   */
  generateSensorAlerts(sensorData) {
    const alerts = [];

    // Generate alerts based on sensor data following OCP - easy to extend with new alerts
    if (sensorData.fillLevel > 90) {
      alerts.push({
        type: 'overflow',
        message: `Bin ${sensorData.binId} is overflowing (${sensorData.fillLevel}%)`,
        severity: 'high',
        timestamp: new Date().toISOString(),
        icon: '⚠️'
      });
    }

    if (sensorData.batteryLevel < 20) {
      alerts.push({
        type: 'low_battery',
        message: `Bin ${sensorData.binId} has low battery (${sensorData.batteryLevel}%)`,
        severity: 'medium',
        timestamp: new Date().toISOString(),
        icon: '🔋'
      });
    }

    if (sensorData.signalStrength === 'Poor' || sensorData.signalStrength === 'No Signal') {
      alerts.push({
        type: 'poor_signal',
        message: `Bin ${sensorData.binId} has poor signal strength (${sensorData.signalStrength})`,
        severity: 'medium',
        timestamp: new Date().toISOString(),
        icon: '📶'
      });
    }

    if (sensorData.temperature > 25) {
      alerts.push({
        type: 'high_temperature',
        message: `Bin ${sensorData.binId} has high temperature (${sensorData.temperature}°C)`,
        severity: 'low',
        timestamp: new Date().toISOString(),
        icon: '🌡️'
      });
    }

    return alerts;
  }

  /**
   * Get real-time sensor data for a specific bin
   * SRP: Single responsibility - only handles data retrieval
   */
  getBinSensorData(binId) {
    return this.realTimeData.get(binId) || null;
  }

  /**
   * Get all bins sensor data for a specific owner
   * SRP: Single responsibility - only handles owner data retrieval
   */
  getOwnerBinsData(ownerId) {
    const ownerBins = [];
    this.realTimeData.forEach((binData, binId) => {
      if (binData.ownerId === ownerId) {
        ownerBins.push(binData);
      }
    });
    return ownerBins;
  }

  /**
   * Get all bins sensor data
   * SRP: Single responsibility - only handles all data retrieval
   */
  getAllBinsData() {
    return Array.from(this.realTimeData.values());
  }

  /**
   * Start real-time updates
   * SRP: Single responsibility - only handles real-time updates
   */
  startRealTimeUpdates(intervalMs = 5000) {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }

    this.updateInterval = setInterval(() => {
      this.updateAllSensorData();
      this.notifySubscribers();
    }, intervalMs);
  }

  /**
   * Stop real-time updates
   * SRP: Single responsibility - only handles stopping updates
   */
  stopRealTimeUpdates() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  /**
   * Update all sensor data
   * SRP: Single responsibility - only handles data updates
   */
  updateAllSensorData() {
    this.realTimeData.forEach((binData, binId) => {
      const updatedData = this.generateSensorData(binId);
      this.realTimeData.set(binId, {
        ...binData,
        ...updatedData,
        lastUpdated: new Date().toISOString()
      });
    });
  }

  /**
   * Subscribe to real-time updates
   * SRP: Single responsibility - only handles subscription management
   */
  subscribe(callback) {
    const subscriptionId = Date.now().toString();
    this.subscribers.set(subscriptionId, callback);
    return subscriptionId;
  }

  /**
   * Unsubscribe from real-time updates
   * SRP: Single responsibility - only handles unsubscription
   */
  unsubscribe(subscriptionId) {
    this.subscribers.delete(subscriptionId);
  }

  /**
   * Notify all subscribers
   * SRP: Single responsibility - only handles notification
   */
  notifySubscribers() {
    const allData = this.getAllBinsData();
    this.subscribers.forEach(callback => {
      try {
        callback(allData);
      } catch (error) {
        console.error('Error notifying subscriber:', error);
      }
    });
  }

  /**
   * Add a new bin to monitoring
   * SRP: Single responsibility - only handles bin addition
   */
  addBin(binData) {
    console.log('addBin called with:', binData);
    const sensorData = this.generateSensorData(binData.binId);
    const fullBinData = {
      ...binData,
      ...sensorData,
      lastUpdated: new Date().toISOString()
    };
    console.log('Full bin data to add:', fullBinData);
    this.realTimeData.set(binData.binId, fullBinData);
    console.log('Bin added. Total bins now:', this.realTimeData.size);
  }

  /**
   * Remove a bin from monitoring
   * SRP: Single responsibility - only handles bin removal
   */
  removeBin(binId) {
    this.realTimeData.delete(binId);
  }

  /**
   * Get sensor configuration
   * SRP: Single responsibility - only handles configuration retrieval
   */
  getSensorConfig() {
    return { ...this.sensorConfig };
  }

  /**
   * Update sensor configuration
   * SRP: Single responsibility - only handles configuration management
   */
  updateSensorConfig(newConfig) {
    this.sensorConfig = { ...this.sensorConfig, ...newConfig };
  }

  /**
   * Get bin statistics
   * SRP: Single responsibility - only handles statistics calculation
   */
  getBinStatistics(ownerId = null) {
    const bins = ownerId ? this.getOwnerBinsData(ownerId) : this.getAllBinsData();
    
    const stats = {
      totalBins: bins.length,
      activeBins: bins.filter(bin => bin.status === 'ACTIVE').length,
      overflowingBins: bins.filter(bin => bin.fillLevel > 90).length,
      lowBatteryBins: bins.filter(bin => bin.batteryLevel < 20).length,
      averageFillLevel: bins.length > 0 ? 
        bins.reduce((sum, bin) => sum + bin.fillLevel, 0) / bins.length : 0,
      averageBatteryLevel: bins.length > 0 ? 
        bins.reduce((sum, bin) => sum + bin.batteryLevel, 0) / bins.length : 0
    };

    return stats;
  }

  /**
   * Get bins by status
   * SRP: Single responsibility - only handles status filtering
   */
  getBinsByStatus(status) {
    const allBins = this.getAllBinsData();
    return allBins.filter(bin => bin.status === status);
  }

  /**
   * Get bins by fill level range
   * SRP: Single responsibility - only handles fill level filtering
   */
  getBinsByFillLevel(minLevel, maxLevel) {
    const allBins = this.getAllBinsData();
    return allBins.filter(bin => bin.fillLevel >= minLevel && bin.fillLevel <= maxLevel);
  }
}

// Create singleton instance - follows Singleton pattern for global sensor management
const iotSensorService = new IoTSensorService();

export default iotSensorService;
