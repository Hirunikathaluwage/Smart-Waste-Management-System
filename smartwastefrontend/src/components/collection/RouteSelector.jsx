import React, { useState, useEffect } from 'react';
import RouteConfigService from '../../services/RouteConfig';

/**
 * Route Selection Component
 * 
 * SOLID PRINCIPLES APPLIED:
 * - SRP (Single Responsibility): Only handles route selection and validation
 * - OCP (Open/Closed): Open for extension with new route types, closed for modification
 * - DIP (Dependency Inversion): Depends on RouteConfigService abstraction
 * - ISP (Interface Segregation): Focused selection interface without unnecessary dependencies
 * 
 * CODE SMELLS AVOIDED:
 * - No God class: Focused only on route selection
 * - No duplicate code: Reusable selection component
 * - No magic numbers: All validation rules properly defined
 * - Clear separation: Selection logic separated from display logic
 */

const RouteSelector = ({ 
  selectedRouteId, 
  onRouteChange, 
  className = '',
  disabled = false 
}) => {
  const [availableRoutes, setAvailableRoutes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Load available routes on component mount - follows SRP for data loading
   */
  useEffect(() => {
    try {
      const routes = RouteConfigService.getAvailableRoutes();
      setAvailableRoutes(routes);
      setError(null);
    } catch (err) {
      console.error('Failed to load routes:', err);
      setError('Failed to load available routes');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Handle route selection change - follows SRP for selection handling
   * @param {Event} event - The change event
   */
  const handleRouteChange = (event) => {
    const newRouteId = event.target.value;
    
    if (RouteConfigService.isValidRoute(newRouteId)) {
      onRouteChange(newRouteId);
    } else {
      console.warn('Invalid route selected:', newRouteId);
    }
  };

  /**
   * Get selected route information - follows SRP for route information
   */
  const getSelectedRouteInfo = () => {
    if (!selectedRouteId) return null;
    return RouteConfigService.getRouteById(selectedRouteId);
  };

  const selectedRoute = getSelectedRouteInfo();

  return (
    <div className={`route-selector ${className}`}>
      {/* Route Selection Dropdown */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Select Route
        </label>
        
        {isLoading ? (
          <div className="flex items-center space-x-2 p-3 border border-gray-300 rounded-lg bg-gray-50">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
            <span className="text-sm text-gray-600">Loading routes...</span>
          </div>
        ) : error ? (
          <div className="p-3 border border-red-300 rounded-lg bg-red-50">
            <div className="text-sm text-red-600">{error}</div>
          </div>
        ) : (
          <select
            value={selectedRouteId || ''}
            onChange={handleRouteChange}
            disabled={disabled}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">-- Select a Route --</option>
            {availableRoutes.map((route) => (
              <option key={route.id} value={route.id}>
                {route.name} ({route.bins.length} bins)
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Selected Route Information */}
      {selectedRoute && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <h3 className="text-sm font-semibold text-green-800">
                {selectedRoute.name}
              </h3>
            </div>
            <p className="text-xs text-green-700">
              {selectedRoute.description}
            </p>
            <div className="text-xs text-green-600">
              <span className="font-medium">Bins in route:</span> {selectedRoute.bins.length}
            </div>
          </div>
        </div>
      )}

      {/* Route Validation Message */}
      {selectedRouteId && !selectedRoute && (
        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
          <div className="text-xs text-yellow-700">
            ⚠️ Selected route is not available
          </div>
        </div>
      )}
    </div>
  );
};

export default RouteSelector;
