/**
 * MockIoTSensorService - Generates simulated IoT sensor data for bins
 * 
 * SOLID PRINCIPLES APPLIED:
 * - SRP (Single Responsibility): Only responsible for generating mock sensor data
 * - OCP (Open/Closed): Open for extension with new sensor types, closed for modification
 * - DIP (Dependency Inversion): Depends on sensor data abstraction, not concrete implementations
 * - ISP (Interface Segregation): Focused sensor interface without unnecessary dependencies
 * 
 * CODE SMELLS AVOIDED:
 * - No God class: Focused only on sensor data generation
 * - No duplicate code: Reusable sensor data components
 * - No magic numbers: All sensor ranges properly defined
 * - Clear separation: Data generation logic separated from business logic
 */
class MockIoTSensorService {
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
   * Generate random date within range - follows SRP for date generation
   * OCP: Easy to extend with different date ranges
   */
  generateRandomDate(daysAgo = 7) {
    const now = new Date();
    const daysBack = this.generateRandomValue(1, daysAgo);
    const randomDate = new Date(now.getTime() - (daysBack * 24 * 60 * 60 * 1000));
    return randomDate.toLocaleDateString();
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
      lastCollection: this.generateRandomDate(7),
      wasteType: this.generateRandomWasteType(),
      batteryLevel: this.generateRandomValue(
        this.sensorConfig.batteryLevel.min, 
        this.sensorConfig.batteryLevel.max
      ),
      signalStrength: this.generateRandomSignalStrength(),
      location: {
        latitude: this.generateRandomValue(6.8, 7.0, 4), // Colombo area
        longitude: this.generateRandomValue(79.8, 80.0, 4)
      }
    };

    return sensorData;
  }

  /**
   * Generate sensor data with specific conditions - follows SRP for conditional data
   * OCP: Easy to extend with new conditions
   */
  generateSensorDataWithCondition(binId, condition = 'normal') {
    const baseData = this.generateSensorData(binId);
    
    // Apply conditions following OCP - easy to extend with new conditions
    switch (condition) {
      case 'overflowing':
        baseData.fillLevel = this.generateRandomValue(90, 100);
        baseData.weight = this.generateRandomValue(40, 50);
        break;
      case 'empty':
        baseData.fillLevel = this.generateRandomValue(0, 10);
        baseData.weight = this.generateRandomValue(0, 5);
        break;
      case 'damaged':
        baseData.batteryLevel = this.generateRandomValue(0, 30);
        baseData.signalStrength = 'Poor';
        break;
      case 'maintenance':
        baseData.batteryLevel = this.generateRandomValue(20, 50);
        baseData.signalStrength = 'Fair';
        break;
      case 'normal':
      default:
        // Use base data as generated
        break;
    }

    return baseData;
  }

  /**
   * Generate batch sensor data for multiple bins - follows SRP for batch generation
   * OCP: Easy to extend with different batch sizes
   */
  generateBatchSensorData(binIds, condition = 'normal') {
    if (!Array.isArray(binIds)) {
      throw new Error('Bin IDs must be provided as an array');
    }

    return binIds.map(binId => 
      this.generateSensorDataWithCondition(binId, condition)
    );
  }

  /**
   * Validate sensor data - follows SRP for data validation
   * OCP: Easy to extend with new validation rules
   */
  validateSensorData(sensorData) {
    const errors = [];

    // Validate required fields following SRP for field validation
    const requiredFields = ['binId', 'weight', 'fillLevel', 'temperature', 'batteryLevel'];
    requiredFields.forEach(field => {
      if (!sensorData.hasOwnProperty(field)) {
        errors.push(`Missing required field: ${field}`);
      }
    });

    // Validate ranges following SRP for range validation
    if (sensorData.weight < 0 || sensorData.weight > 100) {
      errors.push('Weight must be between 0 and 100 kg');
    }

    if (sensorData.fillLevel < 0 || sensorData.fillLevel > 100) {
      errors.push('Fill level must be between 0 and 100%');
    }

    if (sensorData.batteryLevel < 0 || sensorData.batteryLevel > 100) {
      errors.push('Battery level must be between 0 and 100%');
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  /**
   * Get sensor configuration - follows SRP for configuration retrieval
   * OCP: Easy to extend with new configuration options
   */
  getSensorConfig() {
    return { ...this.sensorConfig };
  }

  /**
   * Update sensor configuration - follows SRP for configuration management
   * OCP: Easy to extend with new configuration options
   */
  updateSensorConfig(newConfig) {
    this.sensorConfig = { ...this.sensorConfig, ...newConfig };
  }

  /**
   * Generate sensor alert - follows SRP for alert generation
   * OCP: Easy to extend with new alert types
   */
  generateSensorAlert(sensorData, alertType = 'threshold') {
    const alerts = [];

    // Generate alerts based on sensor data following OCP - easy to extend with new alerts
    if (sensorData.fillLevel > 90) {
      alerts.push({
        type: 'overflow',
        message: `Bin ${sensorData.binId} is overflowing (${sensorData.fillLevel}%)`,
        severity: 'high',
        timestamp: new Date().toISOString()
      });
    }

    if (sensorData.batteryLevel < 20) {
      alerts.push({
        type: 'low_battery',
        message: `Bin ${sensorData.binId} has low battery (${sensorData.batteryLevel}%)`,
        severity: 'medium',
        timestamp: new Date().toISOString()
      });
    }

    if (sensorData.signalStrength === 'Poor' || sensorData.signalStrength === 'No Signal') {
      alerts.push({
        type: 'poor_signal',
        message: `Bin ${sensorData.binId} has poor signal strength (${sensorData.signalStrength})`,
        severity: 'medium',
        timestamp: new Date().toISOString()
      });
    }

    return alerts;
  }
}

// Create singleton instance - follows Singleton pattern for global sensor management
const mockIoTSensorService = new MockIoTSensorService();

export default mockIoTSensorService;
