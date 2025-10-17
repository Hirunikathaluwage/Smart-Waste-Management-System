/**
 * Route Configuration Service
 * 
 * SOLID PRINCIPLES APPLIED:
 * - SRP (Single Responsibility): Only handles route configuration and geographic data
 * - OCP (Open/Closed): Open for extension with new routes, closed for modification
 * - DIP (Dependency Inversion): Provides data abstraction for route operations
 * 
 * CODE SMELLS AVOIDED:
 * - No magic numbers: All coordinates properly defined
 * - No duplicate code: Centralized route data management
 * - Clear separation: Geographic logic separated from UI
 */

// Geographic data for all bins (from your database records)
const BIN_GEO_DATA = {
  'BIN-001': {
    binId: 'BIN-001',
    latitude: 6.9271,
    longitude: 79.8612,
    address: '123 Galle Road, Colombo 03',
    ownerId: 'RES-001',
    status: 'COLLECTED'
  },
  'BIN-002': {
    binId: 'BIN-002',
    latitude: 6.9147,
    longitude: 79.8523,
    address: '456 Union Place, Colombo 02',
    ownerId: 'RES-002',
    status: 'ACTIVE'
  },
  'BIN-003': {
    binId: 'BIN-003',
    latitude: 6.9319,
    longitude: 79.8656,
    address: '789 Main Street, Colombo 11',
    ownerId: 'RES-003',
    status: 'DAMAGED'
  },
  'BIN-004': {
    binId: 'BIN-004',
    latitude: 6.9089,
    longitude: 79.8765,
    address: '321 Marine Drive, Colombo 06',
    ownerId: 'RES-004',
    status: 'ACTIVE'
  },
  'BIN-005': {
    binId: 'BIN-005',
    latitude: 6.9201,
    longitude: 79.8888,
    address: '654 Galle Road, Mount Lavinia',
    ownerId: 'RES-005',
    status: 'ACTIVE'
  }
};

// Predefined routes based on geographic proximity - MUTUALLY EXCLUSIVE
const PREDEFINED_ROUTES = {
  'colombo-central': {
    id: 'colombo-central',
    name: 'Colombo Central Route',
    description: 'Covers Colombo 02, 03, and 06 areas',
    bins: ['BIN-001', 'BIN-002', 'BIN-004'],
    center: {
      latitude: 6.9169, // Average of route bins
      longitude: 79.8633
    }
  },
  'colombo-north-south': {
    id: 'colombo-north-south',
    name: 'Colombo North-South Route',
    description: 'Covers Colombo 11 and Mount Lavinia areas',
    bins: ['BIN-003', 'BIN-005'],
    center: {
      latitude: 6.9260, // Average of route bins
      longitude: 79.8772
    }
  }
};

/**
 * Route Configuration Service Class
 * Follows SRP - Single Responsibility for route data management
 */
class RouteConfigService {
  /**
   * Get all available routes
   * @returns {Array} Array of route objects
   */
  static getAvailableRoutes() {
    return Object.values(PREDEFINED_ROUTES);
  }

  /**
   * Get route by ID
   * @param {string} routeId - The route identifier
   * @returns {Object|null} Route object or null if not found
   */
  static getRouteById(routeId) {
    return PREDEFINED_ROUTES[routeId] || null;
  }

  /**
   * Get geographic data for a specific bin
   * @param {string} binId - The bin identifier
   * @returns {Object|null} Bin geographic data or null if not found
   */
  static getBinGeoData(binId) {
    return BIN_GEO_DATA[binId] || null;
  }

  /**
   * Get all bins with geographic data
   * @returns {Array} Array of bin objects with geographic data
   */
  static getAllBinsWithGeoData() {
    return Object.values(BIN_GEO_DATA);
  }

  /**
   * Get bins for a specific route
   * @param {string} routeId - The route identifier
   * @returns {Array} Array of bin objects for the route
   */
  static getBinsForRoute(routeId) {
    const route = this.getRouteById(routeId);
    if (!route) return [];

    return route.bins.map(binId => this.getBinGeoData(binId)).filter(Boolean);
  }

  /**
   * Validate if a route ID is valid
   * @param {string} routeId - The route identifier to validate
   * @returns {boolean} True if valid, false otherwise
   */
  static isValidRoute(routeId) {
    return routeId in PREDEFINED_ROUTES;
  }

  /**
   * Get route center coordinates for map centering
   * @param {string} routeId - The route identifier
   * @returns {Object|null} Center coordinates or null if route not found
   */
  static getRouteCenter(routeId) {
    const route = this.getRouteById(routeId);
    return route ? route.center : null;
  }

  /**
   * Calculate route progress
   * @param {string} routeId - The route identifier
   * @param {Array} collectedBins - Array of collected bin IDs
   * @returns {Object} Progress object with collected, total, and percentage
   */
  static calculateRouteProgress(routeId, collectedBins = []) {
    const route = this.getRouteById(routeId);
    if (!route) {
      return { collected: 0, total: 0, percentage: 0 };
    }

    const totalBins = route.bins.length;
    const collectedCount = route.bins.filter(binId => 
      collectedBins.some(collected => collected.binId === binId)
    ).length;
    
    const percentage = totalBins > 0 ? Math.round((collectedCount / totalBins) * 100) : 0;

    return {
      collected: collectedCount,
      total: totalBins,
      percentage
    };
  }
}

export default RouteConfigService;
