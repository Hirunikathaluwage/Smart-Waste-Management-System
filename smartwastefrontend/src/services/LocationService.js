/**
 * Location Service - GPS Tracking and Location Management
 * 
 * SOLID PRINCIPLES APPLIED:
 * - SRP (Single Responsibility): Only handles location tracking and GPS operations
 * - OCP (Open/Closed): Open for extension with new location features, closed for modification
 * - DIP (Dependency Inversion): Provides location abstraction for components
 * - ISP (Interface Segregation): Focused location interface without unnecessary dependencies
 * 
 * CODE SMELLS AVOIDED:
 * - No God class: Focused only on location operations
 * - No duplicate code: Centralized location logic
 * - No magic numbers: All location constants properly defined
 * - Clear separation: Location logic separated from UI components
 */

// Location tracking configuration constants
const LOCATION_CONFIG = {
  ACCURACY_THRESHOLD: 10, // meters
  UPDATE_INTERVAL: 5000, // 5 seconds
  MAX_AGE: 30000, // 30 seconds
  TIMEOUT: 15000, // 15 seconds (increased for better accuracy)
  HIGH_ACCURACY: true,
  ENABLE_HIGH_ACCURACY: true,
  MINIMUM_ACCURACY: 100, // meters - minimum acceptable accuracy
  MAXIMUM_ACCURACY: 5, // meters - ideal accuracy
  RETRY_ATTEMPTS: 3, // Number of retry attempts for better accuracy
  RETRY_DELAY: 2000 // Delay between retry attempts
};

// Default location (Colombo, Sri Lanka)
const DEFAULT_LOCATION = {
  latitude: 6.9271,
  longitude: 79.8612,
  accuracy: 0,
  timestamp: Date.now()
};

/**
 * Location Service Class - follows SRP for location management
 */
class LocationService {
  constructor() {
    this.currentLocation = null;
    this.watchId = null;
    this.listeners = new Set();
    this.isTracking = false;
    this.lastUpdateTime = 0;
  }

  /**
   * Request location permission with user-friendly messaging - follows SRP for permission handling
   * @returns {Promise<Object>} Permission result with user-friendly message
   */
  async requestLocationPermission() {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve({
          granted: false,
          message: 'Location services are not available on this device',
          canRetry: false
        });
        return;
      }

      // Check if permission was previously denied
      if (navigator.permissions) {
        navigator.permissions.query({ name: 'geolocation' }).then((result) => {
          if (result.state === 'denied') {
            resolve({
              granted: false,
              message: 'Location access was denied. Please enable location services in your browser settings to use GPS navigation features.',
              canRetry: true
            });
            return;
          }
          
          // Permission not yet determined, proceed with request
          this.getCurrentLocation()
            .then(() => {
              resolve({
                granted: true,
                message: 'Location access granted! GPS navigation is now available.',
                canRetry: false
              });
            })
            .catch((error) => {
              resolve({
                granted: false,
                message: this.getUserFriendlyErrorMessage(error),
                canRetry: true
              });
            });
        });
      } else {
        // Fallback for browsers without permissions API
        this.getCurrentLocation()
          .then(() => {
            resolve({
              granted: true,
              message: 'Location access granted! GPS navigation is now available.',
              canRetry: false
            });
          })
          .catch((error) => {
            resolve({
              granted: false,
              message: this.getUserFriendlyErrorMessage(error),
              canRetry: true
            });
          });
      }
    });
  }

  /**
   * Get user-friendly error message - follows SRP for error message formatting
   * @param {Object} error - Geolocation error object
   * @returns {string} User-friendly error message
   */
  getUserFriendlyErrorMessage(error) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return 'Location access denied. Please allow location access to use GPS navigation features.';
      case error.POSITION_UNAVAILABLE:
        return 'Location information is unavailable. Please check your GPS settings and try again.';
      case error.TIMEOUT:
        return 'Location request timed out. Please try again or check your internet connection.';
      default:
        return 'Unable to access location. Please check your device settings and try again.';
    }
  }

  /**
   * Check if location services are available - follows SRP for availability check
   * @returns {Object} Availability status and message
   */
  checkLocationAvailability() {
    if (!navigator.geolocation) {
      return {
        available: false,
        message: 'Location services are not supported by this browser',
        canEnable: false
      };
    }

    if (!navigator.permissions) {
      return {
        available: true,
        message: 'Location services are available',
        canEnable: true
      };
    }

    return navigator.permissions.query({ name: 'geolocation' }).then((result) => {
      switch (result.state) {
        case 'granted':
          return {
            available: true,
            message: 'Location access is already granted',
            canEnable: false
          };
        case 'denied':
          return {
            available: false,
            message: 'Location access is denied. Please enable it in browser settings.',
            canEnable: true
          };
        case 'prompt':
        default:
          return {
            available: true,
            message: 'Location access can be requested',
            canEnable: true
          };
      }
    });
  }

  /**
   * Get current location with enhanced accuracy - follows SRP for location retrieval
   * @param {boolean} retryForAccuracy - Whether to retry for better accuracy
   * @returns {Promise<Object>} Current location object with accuracy info
   */
  async getCurrentLocation(retryForAccuracy = false) {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      const options = {
        enableHighAccuracy: LOCATION_CONFIG.HIGH_ACCURACY,
        timeout: LOCATION_CONFIG.TIMEOUT,
        maximumAge: retryForAccuracy ? 0 : LOCATION_CONFIG.MAX_AGE // Force fresh location if retrying
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp || Date.now(),
            quality: this.getLocationQuality(position.coords.accuracy),
            heading: position.coords.heading,
            speed: position.coords.speed
          };
          
          this.currentLocation = location;
          this.lastUpdateTime = Date.now();
          this.notifyListeners(location);
          resolve(location);
        },
        (error) => {
          console.warn('Location error:', error.message);
          reject(error);
        },
        options
      );
    });
  }

  /**
   * Get high accuracy location with retry attempts - follows SRP for accuracy improvement
   * @returns {Promise<Object>} Best available location
   */
  async getHighAccuracyLocation() {
    let bestLocation = null;
    let attempts = 0;

    while (attempts < LOCATION_CONFIG.RETRY_ATTEMPTS) {
      try {
        const location = await this.getCurrentLocation(attempts > 0);
        
        if (!bestLocation || location.accuracy < bestLocation.accuracy) {
          bestLocation = location;
        }

        // If we have excellent accuracy, return immediately
        if (location.accuracy <= LOCATION_CONFIG.MAXIMUM_ACCURACY) {
          return location;
        }

        // If accuracy is acceptable, return it
        if (location.accuracy <= LOCATION_CONFIG.MINIMUM_ACCURACY) {
          return location;
        }

        attempts++;
        
        // Wait before retry
        if (attempts < LOCATION_CONFIG.RETRY_ATTEMPTS) {
          await new Promise(resolve => setTimeout(resolve, LOCATION_CONFIG.RETRY_DELAY));
        }
      } catch (error) {
        attempts++;
        if (attempts >= LOCATION_CONFIG.RETRY_ATTEMPTS) {
          throw error;
        }
        await new Promise(resolve => setTimeout(resolve, LOCATION_CONFIG.RETRY_DELAY));
      }
    }

    return bestLocation || DEFAULT_LOCATION;
  }

  /**
   * Get location quality rating - follows SRP for quality assessment
   * @param {number} accuracy - GPS accuracy in meters
   * @returns {string} Quality rating
   */
  getLocationQuality(accuracy) {
    if (accuracy <= LOCATION_CONFIG.MAXIMUM_ACCURACY) {
      return 'excellent';
    } else if (accuracy <= LOCATION_CONFIG.ACCURACY_THRESHOLD) {
      return 'good';
    } else if (accuracy <= LOCATION_CONFIG.MINIMUM_ACCURACY) {
      return 'fair';
    } else {
      return 'poor';
    }
  }

  /**
   * Get location quality color - follows SRP for UI styling
   * @param {string} quality - Location quality rating
   * @returns {string} Color class
   */
  getLocationQualityColor(quality) {
    switch (quality) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'fair': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  }

  /**
   * Get location quality description - follows SRP for user messaging
   * @param {string} quality - Location quality rating
   * @returns {string} User-friendly description
   */
  getLocationQualityDescription(quality) {
    switch (quality) {
      case 'excellent': return 'Excellent GPS signal - Very accurate';
      case 'good': return 'Good GPS signal - Accurate';
      case 'fair': return 'Fair GPS signal - Moderately accurate';
      case 'poor': return 'Poor GPS signal - May be inaccurate';
      default: return 'Unknown GPS quality';
    }
  }

  /**
   * Start continuous location tracking - follows SRP for tracking management
   * @param {Function} onLocationUpdate - Callback for location updates
   * @returns {number} Watch ID for stopping tracking
   */
  startTracking(onLocationUpdate) {
    if (this.isTracking) {
      console.warn('Location tracking already started');
      return this.watchId;
    }

    if (!navigator.geolocation) {
      console.warn('Geolocation not supported');
      return null;
    }

    this.addListener(onLocationUpdate);
    this.isTracking = true;

    const options = {
      enableHighAccuracy: LOCATION_CONFIG.ENABLE_HIGH_ACCURACY,
      timeout: LOCATION_CONFIG.TIMEOUT,
      maximumAge: LOCATION_CONFIG.MAX_AGE
    };

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp || Date.now()
        };

        // Only update if location is significantly different or accurate enough
        if (this.shouldUpdateLocation(location)) {
          this.currentLocation = location;
          this.lastUpdateTime = Date.now();
          this.notifyListeners(location);
        }
      },
      (error) => {
        console.warn('Location tracking error:', error.message);
        // Continue with last known location
      },
      options
    );

    return this.watchId;
  }

  /**
   * Stop location tracking - follows SRP for tracking management
   */
  stopTracking() {
    if (this.watchId) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
    this.isTracking = false;
    this.listeners.clear();
  }

  /**
   * Add location update listener - follows SRP for listener management
   * @param {Function} listener - Location update callback
   */
  addListener(listener) {
    this.listeners.add(listener);
  }

  /**
   * Remove location update listener - follows SRP for listener management
   * @param {Function} listener - Location update callback to remove
   */
  removeListener(listener) {
    this.listeners.delete(listener);
  }

  /**
   * Notify all listeners of location update - follows SRP for notification
   * @param {Object} location - Updated location object
   */
  notifyListeners(location) {
    this.listeners.forEach(listener => {
      try {
        listener(location);
      } catch (error) {
        console.error('Error in location listener:', error);
      }
    });
  }

  /**
   * Check if location should be updated - follows SRP for update logic
   * @param {Object} newLocation - New location to check
   * @returns {boolean} Whether to update location
   */
  shouldUpdateLocation(newLocation) {
    if (!this.currentLocation) return true;
    
    const timeDiff = newLocation.timestamp - this.currentLocation.timestamp;
    const accuracyGood = newLocation.accuracy <= LOCATION_CONFIG.ACCURACY_THRESHOLD;
    const timeElapsed = timeDiff >= LOCATION_CONFIG.UPDATE_INTERVAL;
    
    return accuracyGood || timeElapsed;
  }

  /**
   * Calculate distance between two points - follows SRP for distance calculation
   * @param {Object} point1 - First point {latitude, longitude}
   * @param {Object} point2 - Second point {latitude, longitude}
   * @returns {number} Distance in meters
   */
  calculateDistance(point1, point2) {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = point1.latitude * Math.PI / 180;
    const φ2 = point2.latitude * Math.PI / 180;
    const Δφ = (point2.latitude - point1.latitude) * Math.PI / 180;
    const Δλ = (point2.longitude - point1.longitude) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distance in meters
  }

  /**
   * Get nearest bin from current location - follows SRP for proximity calculation
   * @param {Array} bins - Array of bin objects with latitude/longitude
   * @returns {Object|null} Nearest bin or null if no bins
   */
  getNearestBin(bins) {
    if (!this.currentLocation || !bins || bins.length === 0) {
      return null;
    }

    let nearestBin = null;
    let minDistance = Infinity;

    bins.forEach(bin => {
      if (bin.latitude && bin.longitude) {
        const distance = this.calculateDistance(
          this.currentLocation,
          { latitude: bin.latitude, longitude: bin.longitude }
        );
        
        if (distance < minDistance) {
          minDistance = distance;
          nearestBin = { ...bin, distance };
        }
      }
    });

    return nearestBin;
  }

  /**
   * Check if location is within accuracy threshold of a bin - follows SRP for proximity check
   * @param {Object} bin - Bin object with latitude/longitude
   * @param {number} threshold - Distance threshold in meters
   * @returns {boolean} Whether location is within threshold
   */
  isNearBin(bin, threshold = LOCATION_CONFIG.ACCURACY_THRESHOLD) {
    if (!this.currentLocation || !bin.latitude || !bin.longitude) {
      return false;
    }

    const distance = this.calculateDistance(
      this.currentLocation,
      { latitude: bin.latitude, longitude: bin.longitude }
    );

    return distance <= threshold;
  }

  /**
   * Get current location or default - follows SRP for location retrieval
   * @returns {Object} Current location or default location
   */
  getLocation() {
    return this.currentLocation || DEFAULT_LOCATION;
  }

  /**
   * Check if tracking is active - follows SRP for status check
   * @returns {boolean} Whether tracking is active
   */
  isActive() {
    return this.isTracking && this.watchId !== null;
  }
}

// Create singleton instance - follows Singleton pattern for service management
const locationService = new LocationService();

export default locationService;
