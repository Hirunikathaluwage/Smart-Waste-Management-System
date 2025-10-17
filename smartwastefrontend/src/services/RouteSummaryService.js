/**
 * RouteSummaryService - Handles route-specific summary calculations
 * 
 * SOLID PRINCIPLES APPLIED:
 * - SRP (Single Responsibility): Only handles route summary calculations
 * - OCP (Open/Closed): Open for extension with new summary types, closed for modification
 * - DIP (Dependency Inversion): Depends on data abstractions, not concrete implementations
 * 
 * CODE SMELLS AVOIDED:
 * - No magic numbers: All calculations use named constants
 * - No duplicate code: Reusable calculation methods
 * - Clear method naming: Descriptive method names
 * - Proper error handling: Consistent error responses
 */

import RouteConfigService from './RouteConfig';

class RouteSummaryService {
  // Constants following DRY principle
  static TIME_CONSTANTS = {
    MILLISECONDS_PER_MINUTE: 60000,
    MILLISECONDS_PER_HOUR: 3600000,
    MINUTES_PER_HOUR: 60
  };

  static CONFIG = {
    DEBUG_MODE: process.env.NODE_ENV === 'development'
  };

  /**
   * Get current route summary data
   * SRP: Single responsibility - only calculates current route summary
   * 
   * @param {Array} collectedBins - All collected bins
   * @param {string} currentRouteId - Current route ID
   * @param {number} startTime - Session start time
   * @returns {Object} Current route summary data
   */
  static getCurrentRouteSummary(collectedBins, currentRouteId, startTime) {
    if (!currentRouteId) {
      return this.getEmptySummary('No Route Selected');
    }

    const route = RouteConfigService.getRouteById(currentRouteId);
    if (!route) {
      return this.getEmptySummary('Invalid Route');
    }

    const routeBins = this.filterBinsByRoute(collectedBins, currentRouteId);
    const elapsedTime = this.calculateElapsedTime(startTime);
    
    // Debug logging for development
    this.log('Route Summary Debug:', {
      routeId: currentRouteId,
      routeName: route.name,
      routeBins: route.bins,
      collectedBins: collectedBins?.map(b => b.binId) || [],
      filteredBins: routeBins.map(b => b.binId),
      totalCollected: collectedBins?.length || 0
    });
    
    return {
      routeName: route.name,
      routeId: currentRouteId,
      binsCollected: routeBins.length,
      totalBins: route.bins.length,
      completionPercentage: this.calculateCompletionPercentage(routeBins.length, route.bins.length),
      totalWeight: this.calculateTotalWeight(routeBins),
      elapsedTime: elapsedTime,
      missedBins: this.countBinsByStatus(routeBins, 'Missed'),
      overrideCollections: this.countBinsByStatus(routeBins, 'Override Collection'),
      manualEntries: this.countBinsByStatus(routeBins, 'Manual Entry - Sensor Failed')
    };
  }

  /**
   * Get comprehensive summary for all routes
   * SRP: Single responsibility - only calculates all routes summary
   * 
   * @param {Array} collectedBins - All collected bins
   * @param {number} startTime - Session start time
   * @returns {Object} Comprehensive summary data
   */
  static getAllRoutesSummary(collectedBins, startTime) {
    const allRoutes = RouteConfigService.getAvailableRoutes();
    const elapsedTime = this.calculateElapsedTime(startTime);
    
    const routeSummaries = allRoutes.map(route => {
      const routeBins = this.filterBinsByRoute(collectedBins, route.id);
      
      // Debug logging for each route
      this.log(`Route ${route.name} Debug:`, {
        routeId: route.id,
        routeBins: route.bins,
        filteredBins: routeBins.map(b => b.binId),
        binsCollected: routeBins.length,
        totalBins: route.bins.length
      });
      
      return {
        routeName: route.name,
        routeId: route.id,
        binsCollected: routeBins.length,
        totalBins: route.bins.length,
        completionPercentage: this.calculateCompletionPercentage(routeBins.length, route.bins.length),
        totalWeight: this.calculateTotalWeight(routeBins),
        missedBins: this.countBinsByStatus(routeBins, 'Missed'),
        overrideCollections: this.countBinsByStatus(routeBins, 'Override Collection'),
        manualEntries: this.countBinsByStatus(routeBins, 'Manual Entry - Sensor Failed')
      };
    });

    return {
      elapsedTime: elapsedTime,
      totalBinsCollected: collectedBins.length,
      totalWeight: this.calculateTotalWeight(collectedBins),
      totalMissedBins: this.countBinsByStatus(collectedBins, 'Missed'),
      totalOverrideCollections: this.countBinsByStatus(collectedBins, 'Override Collection'),
      totalManualEntries: this.countBinsByStatus(collectedBins, 'Manual Entry - Sensor Failed'),
      routeSummaries: routeSummaries
    };
  }

  /**
   * Filter bins by route ID
   * SRP: Single responsibility - only filters bins by route
   * 
   * @param {Array} collectedBins - All collected bins
   * @param {string} routeId - Route ID to filter by
   * @returns {Array} Filtered bins for the route
   */
  static filterBinsByRoute(collectedBins, routeId) {
    if (!routeId || !collectedBins || !Array.isArray(collectedBins)) return [];
    
    const route = RouteConfigService.getRouteById(routeId);
    if (!route || !route.bins || !Array.isArray(route.bins)) return [];
    
    // Route bins are stored as ['BIN-001', 'BIN-002', ...]
    // Collected bins have binId property that matches this format
    const routeBinIds = new Set(route.bins);
    
    return collectedBins.filter(bin => {
      // Ensure bin has binId property and it matches route bins
      return bin && bin.binId && routeBinIds.has(bin.binId);
    });
  }

  /**
   * Calculate elapsed time from start time with daily reset validation
   * SRP: Single responsibility - only calculates elapsed time
   * 
   * @param {number} startTime - Start time in milliseconds
   * @returns {string} Formatted elapsed time
   */
  static calculateElapsedTime(startTime) {
    if (!startTime) return '0h 0m';
    
    // Check if start time is from today
    const startDate = new Date(startTime).toDateString();
    const today = new Date().toDateString();
    
    // If start time is not from today, return 0h 0m (daily reset)
    if (startDate !== today) {
      return '0h 0m';
    }
    
    const elapsed = Date.now() - startTime;
    const hours = Math.floor(elapsed / this.TIME_CONSTANTS.MILLISECONDS_PER_HOUR);
    const minutes = Math.floor((elapsed % this.TIME_CONSTANTS.MILLISECONDS_PER_HOUR) / this.TIME_CONSTANTS.MILLISECONDS_PER_MINUTE);
    
    return `${hours}h ${minutes}m`;
  }

  /**
   * Calculate completion percentage
   * SRP: Single responsibility - only calculates percentage
   * 
   * @param {number} collected - Number of collected bins
   * @param {number} total - Total number of bins
   * @returns {number} Completion percentage
   */
  static calculateCompletionPercentage(collected, total) {
    if (total === 0) return 0;
    return Math.round((collected / total) * 100);
  }

  /**
   * Calculate total weight from bins
   * SRP: Single responsibility - only calculates total weight
   * 
   * @param {Array} bins - Array of bins
   * @returns {number} Total weight in kg
   */
  static calculateTotalWeight(bins) {
    if (!bins || !Array.isArray(bins)) return 0;
    return bins.reduce((total, bin) => total + (bin.weight || 0), 0);
  }

  /**
   * Count bins by status
   * SRP: Single responsibility - only counts bins by status
   * 
   * @param {Array} bins - Array of bins
   * @param {string} status - Status to count
   * @returns {number} Count of bins with the status
   */
  static countBinsByStatus(bins, status) {
    if (!bins || !Array.isArray(bins)) return 0;
    return bins.filter(bin => bin.status === status).length;
  }

  /**
   * Get empty summary for error cases
   * SRP: Single responsibility - only provides empty summary
   * 
   * @param {string} routeName - Route name for display
   * @returns {Object} Empty summary object
   */
  static getEmptySummary(routeName) {
    return {
      routeName: routeName,
      routeId: null,
      binsCollected: 0,
      totalBins: 0,
      completionPercentage: 0,
      totalWeight: 0,
      elapsedTime: '0h 0m',
      missedBins: 0,
      overrideCollections: 0,
      manualEntries: 0
    };
  }

  /**
   * Log message if debug mode is enabled
   * SRP: Single responsibility - only handles logging
   * 
   * @param {string} message - Log message
   * @param {Object} data - Additional data to log
   */
  static log(message, data = null) {
    if (this.CONFIG.DEBUG_MODE) {
      console.log(`[RouteSummaryService] ${message}`, data);
    }
  }
}

export default RouteSummaryService;
