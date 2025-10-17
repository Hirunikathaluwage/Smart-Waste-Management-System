import React, { useRef, useEffect, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { MAPBOX_CONFIG } from '../../config/mapbox';
import RouteConfigService from '../../services/RouteConfig';
import locationService from '../../services/LocationService';
import 'mapbox-gl/dist/mapbox-gl.css';

/**
 * Error Boundary Component for NavigationMap
 * Follows SRP for error handling
 */
class NavigationMapErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('NavigationMap Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-full bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-500 p-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">Map Error</h3>
            <p className="text-sm mb-4">There was an error loading the map.</p>
            <button 
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Navigation Map Component - Dynamic Route Highlighting with GPS
 * 
 * SOLID PRINCIPLES APPLIED:
 * - SRP (Single Responsibility): Only handles navigation map display and GPS integration
 * - OCP (Open/Closed): Open for extension with new navigation features, closed for modification
 * - DIP (Dependency Inversion): Depends on LocationService and RouteConfigService abstractions
 * - ISP (Interface Segregation): Focused navigation interface without unnecessary dependencies
 * 
 * CODE SMELLS AVOIDED:
 * - No God class: Focused only on navigation map functionality
 * - No duplicate code: Reusable navigation components
 * - No magic numbers: All map and navigation constants properly defined
 * - Clear separation: Navigation logic separated from UI components
 */

// Navigation map configuration constants
const NAVIGATION_CONFIG = {
  DEFAULT_ZOOM: 14,
  MARKER_SIZE: 0.6,
  CURRENT_LOCATION_COLOR: '#3B82F6', // Blue
  COMPLETED_ROUTE_COLOR: '#10B981', // Green
  REMAINING_ROUTE_COLOR: '#6B7280', // Gray
  ACTIVE_ROUTE_COLOR: '#3B82F6', // Blue for active tracking
  NEXT_DESTINATION_COLOR: '#F59E0B', // Orange
  ROUTE_LINE_WIDTH: 4,
  CURRENT_LOCATION_PULSE_DURATION: 2000,
  MARKER_COLORS: {
    ACTIVE: '#10B981',      // Green
    COLLECTED: '#3B82F6',   // Blue
    DAMAGED: '#EF4444',     // Red
    MAINTENANCE: '#F59E0B', // Yellow
    LOST: '#6B7280',        // Gray
    NEXT: '#F59E0B'         // Orange for next destination
  }
};

const NavigationMap = ({ 
  selectedRouteId, 
  collectedBins = [], 
  currentLocation = null,
  isLocationTracking = false,
  height = '500px',
  className = '',
  onBinClick = null,
  showNavigation = true
}) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markers = useRef({});
  const routeLines = useRef({});
  const currentLocationMarker = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(null);
  const [nextDestination, setNextDestination] = useState(null);

  // Set Mapbox access token
  mapboxgl.accessToken = MAPBOX_CONFIG.accessToken;
  
  // Disable analytics to prevent ad blocker issues
  mapboxgl.config.API_URL = 'https://api.mapbox.com';

  /**
   * Initialize map - follows SRP for map initialization
   */
  useEffect(() => {
    if (map.current) return; // Initialize map only once

    try {
      // Get route center for initial map position
      const routeCenter = RouteConfigService.getRouteCenter(selectedRouteId);
      const center = routeCenter || [79.8612, 6.9271]; // Default to Colombo

      // Initialize map
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: MAPBOX_CONFIG.style,
        center: [center.longitude, center.latitude],
        zoom: NAVIGATION_CONFIG.DEFAULT_ZOOM,
        attributionControl: false,
        logoPosition: 'bottom-left'
      });

      // Add map controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Handle map load
      map.current.on('load', () => {
        setMapLoaded(true);
        setMapError(null);
        updateMapMarkers();
        drawRouteLines();
        updateCurrentLocationMarker();
      });

      // Handle map errors
      map.current.on('error', (e) => {
        console.error('Map error:', e);
        setMapError('Failed to load map');
      });

    } catch (error) {
      console.error('Map initialization error:', error);
      setMapError('Failed to initialize map');
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  /**
   * Update map when route, collection data, or tracking status changes
   * Separated location updates to prevent flickering
   */
  useEffect(() => {
    if (mapLoaded && map.current) {
      updateMapMarkers();
      drawRouteLines();
      findNextDestination();
    }
  }, [selectedRouteId, collectedBins, isLocationTracking, mapLoaded]);

  /**
   * Update current location marker separately to prevent route flickering
   */
  useEffect(() => {
    if (mapLoaded && map.current) {
      updateCurrentLocationMarker();
    }
  }, [currentLocation, mapLoaded]);

  /**
   * Find next destination bin - follows SRP for destination calculation
   */
  const findNextDestination = () => {
    if (!currentLocation) {
      setNextDestination(null);
      return;
    }

    // Validate route - follows SRP for route validation
    if (!selectedRouteId || !RouteConfigService.isValidRoute(selectedRouteId)) {
      setNextDestination(null);
      return;
    }

    const routeBins = RouteConfigService.getBinsForRoute(selectedRouteId);
    
    if (!routeBins || routeBins.length === 0) {
      setNextDestination(null);
      return;
    }

    const uncollectedBins = routeBins.filter(bin => 
      !collectedBins.some(collected => collected.binId === bin.binId)
    );

    if (uncollectedBins.length === 0) {
      setNextDestination(null);
      return;
    }

    // Find nearest uncollected bin
    const nearestBin = locationService.getNearestBin(uncollectedBins);
    setNextDestination(nearestBin);
  };

  /**
   * Update current location marker - follows SRP for location marker management
   */
  const updateCurrentLocationMarker = () => {
    if (!map.current || !currentLocation) {
      console.warn('⚠️ Cannot update current location marker: map or currentLocation not available');
      return;
    }

    // Validate coordinates
    if (!currentLocation.longitude || !currentLocation.latitude || 
        isNaN(currentLocation.longitude) || isNaN(currentLocation.latitude)) {
      console.warn('⚠️ Invalid current location coordinates:', currentLocation);
      return;
    }

    // Remove existing current location marker
    if (currentLocationMarker.current) {
      currentLocationMarker.current.remove();
    }

    // Create pulsing current location marker
    const markerElement = document.createElement('div');
    markerElement.className = 'current-location-marker';
    markerElement.style.cssText = `
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background-color: ${NAVIGATION_CONFIG.CURRENT_LOCATION_COLOR};
      border: 3px solid white;
      box-shadow: 0 0 0 0 ${NAVIGATION_CONFIG.CURRENT_LOCATION_COLOR};
      animation: pulse 2s infinite;
      cursor: pointer;
    `;

    // Add pulse animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0% { box-shadow: 0 0 0 0 ${NAVIGATION_CONFIG.CURRENT_LOCATION_COLOR}80; }
        70% { box-shadow: 0 0 0 10px ${NAVIGATION_CONFIG.CURRENT_LOCATION_COLOR}00; }
        100% { box-shadow: 0 0 0 0 ${NAVIGATION_CONFIG.CURRENT_LOCATION_COLOR}00; }
      }
    `;
    document.head.appendChild(style);

    // Create marker with validated coordinates
    currentLocationMarker.current = new mapboxgl.Marker(markerElement)
      .setLngLat([currentLocation.longitude, currentLocation.latitude])
      .setPopup(new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <div style="padding: 8px; min-width: 150px;">
            <h3 style="margin: 0 0 4px 0; font-size: 14px; font-weight: bold;">Current Location</h3>
            <p style="margin: 0; font-size: 12px; color: #666;">
              Accuracy: ${Math.round(currentLocation.accuracy || 0)}m
            </p>
          </div>
        `))
      .addTo(map.current);

    // Center map on current location if it's the first time
    if (!currentLocationMarker.current._map) {
      map.current.flyTo({
        center: [currentLocation.longitude, currentLocation.latitude],
        zoom: NAVIGATION_CONFIG.DEFAULT_ZOOM,
        duration: 1000
      });
    }
  };

  /**
   * Update map markers based on bin status - follows SRP for marker management
   */
  const updateMapMarkers = () => {
    if (!map.current) return;

    // Clear existing markers
    Object.values(markers.current).forEach(marker => marker.remove());
    markers.current = {};

    // Validate route and get bins - follows SRP for route validation
    if (!selectedRouteId || !RouteConfigService.isValidRoute(selectedRouteId)) {
      console.warn('❌ Invalid or missing route ID:', {
        selectedRouteId,
        isValid: RouteConfigService.isValidRoute(selectedRouteId),
        availableRoutes: RouteConfigService.getAvailableRoutes().map(r => r.id)
      });
      return;
    }

    // Get bins for the selected route
    const routeBins = RouteConfigService.getBinsForRoute(selectedRouteId);
    
    // Debug logging - follows SRP for debugging
    console.log('🔍 NavigationMap Debug:', {
      selectedRouteId,
      routeBins: routeBins?.length || 0,
      binIds: routeBins?.map(bin => bin.binId) || [],
      routeValid: RouteConfigService.isValidRoute(selectedRouteId)
    });
    
    if (!routeBins || routeBins.length === 0) {
      console.warn('No bins found for route:', selectedRouteId);
      return;
    }
    
    routeBins.forEach(bin => {
      const isCollected = collectedBins.some(collected => collected.binId === bin.binId);
      const isNextDestination = nextDestination && nextDestination.binId === bin.binId;
      
      let status = isCollected ? 'COLLECTED' : bin.status;
      let color = NAVIGATION_CONFIG.MARKER_COLORS[status];
      
      // Override color for next destination
      if (isNextDestination) {
        color = NAVIGATION_CONFIG.MARKER_COLORS.NEXT;
        status = 'NEXT';
      }

      // Create marker element
      const markerElement = document.createElement('div');
      markerElement.className = 'route-marker';
      markerElement.style.cssText = `
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background-color: ${color};
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        font-weight: bold;
        color: white;
        ${isNextDestination ? 'animation: bounce 1s infinite;' : ''}
      `;
      markerElement.textContent = bin.binId.split('-')[1]; // Show bin number

      // Add bounce animation for next destination
      if (isNextDestination) {
        const style = document.createElement('style');
        style.textContent = `
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-10px); }
            60% { transform: translateY(-5px); }
          }
        `;
        document.head.appendChild(style);
      }

      // Create popup content
      const popupContent = `
        <div style="padding: 8px; min-width: 200px;">
          <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">${bin.binId}</h3>
          <p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">${bin.address}</p>
          <p style="margin: 0; font-size: 12px;">
            <span style="color: ${color}; font-weight: bold;">Status: ${status}</span>
          </p>
          ${isNextDestination ? '<p style="margin: 4px 0 0 0; font-size: 11px; color: #F59E0B; font-weight: bold;">🎯 NEXT DESTINATION</p>' : ''}
        </div>
      `;

      // Create marker
      const marker = new mapboxgl.Marker(markerElement)
        .setLngLat([bin.longitude, bin.latitude])
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(popupContent))
        .addTo(map.current);

      // Add click handler if provided
      if (onBinClick) {
        markerElement.addEventListener('click', () => {
          onBinClick(bin);
        });
      }

      markers.current[bin.binId] = marker;
    });
  };

  /**
   * Draw route lines with progress visualization - follows SRP for route visualization
   * Optimized to prevent flickering with memoization and debouncing
   */
  const drawRouteLines = useCallback(() => {
    if (!map.current) return;

    // Validate route and get bins - follows SRP for route validation
    if (!selectedRouteId || !RouteConfigService.isValidRoute(selectedRouteId)) {
      console.warn('Cannot draw route lines - invalid or missing route ID:', selectedRouteId);
      // Clean up any existing lines when no valid route
      cleanupRouteLines();
      return;
    }

    // Get bins for the selected route
    const routeBins = RouteConfigService.getBinsForRoute(selectedRouteId);
    
    if (!routeBins || routeBins.length < 2) {
      console.warn('Cannot draw route lines - insufficient bins for route:', selectedRouteId);
      // Clean up any existing lines when insufficient bins
      cleanupRouteLines();
      return; // Need at least 2 bins to draw a line
    }

    // Create a unique key for the current route state to prevent unnecessary redraws
    const routeStateKey = `${selectedRouteId}-${isLocationTracking}-${collectedBins.length}`;
    
    // Check if we need to redraw (prevent flickering)
    if (routeLines.current._lastStateKey === routeStateKey) {
      return; // No changes, skip redraw
    }

    // Safely remove existing route lines - follows SRP for cleanup
    cleanupRouteLines();

    // Mark the current state to prevent unnecessary redraws
    routeLines.current._lastStateKey = routeStateKey;

    // Create coordinates for completed route
    const completedCoordinates = [];
    routeBins.forEach(bin => {
      const isCollected = collectedBins.some(collected => collected.binId === bin.binId);
      if (isCollected) {
        completedCoordinates.push([bin.longitude, bin.latitude]);
      }
    });

    // Draw completed route (green)
    if (completedCoordinates.length > 1) {
      drawRouteLine('completed-route', 'completed-route-layer', completedCoordinates, {
        color: NAVIGATION_CONFIG.COMPLETED_ROUTE_COLOR,
        width: NAVIGATION_CONFIG.ROUTE_LINE_WIDTH,
        opacity: 0.8
      });
    }

    // Draw remaining route (blue when tracking, gray when not tracking)
    const remainingCoordinates = routeBins
      .filter(bin => !collectedBins.some(collected => collected.binId === bin.binId))
      .map(bin => [bin.longitude, bin.latitude]);

    if (remainingCoordinates.length > 1) {
      const routeColor = isLocationTracking 
        ? NAVIGATION_CONFIG.ACTIVE_ROUTE_COLOR 
        : NAVIGATION_CONFIG.REMAINING_ROUTE_COLOR;
      
      const routeOpacity = isLocationTracking ? 0.9 : 0.6;
      const dashArray = isLocationTracking ? [] : [2, 2];
      
      drawRouteLine('remaining-route', 'remaining-route-layer', remainingCoordinates, {
        color: routeColor,
        width: NAVIGATION_CONFIG.ROUTE_LINE_WIDTH + (isLocationTracking ? 2 : 0),
        opacity: routeOpacity,
        dashArray: dashArray
      });
    }

    // Draw route from current location to next destination
    if (currentLocation && nextDestination && 
        !isNaN(currentLocation.longitude) && !isNaN(currentLocation.latitude) &&
        !isNaN(nextDestination.longitude) && !isNaN(nextDestination.latitude)) {
      const navigationCoordinates = [
        [currentLocation.longitude, currentLocation.latitude],
        [nextDestination.longitude, nextDestination.latitude]
      ];

      drawRouteLine('navigation-route', 'navigation-route-layer', navigationCoordinates, {
        color: NAVIGATION_CONFIG.NEXT_DESTINATION_COLOR,
        width: NAVIGATION_CONFIG.ROUTE_LINE_WIDTH + 2,
        opacity: 0.9
      });
    }
  }, [selectedRouteId, isLocationTracking, collectedBins, mapLoaded]);

  /**
   * Safely cleanup route lines - follows SRP for cleanup operations
   * Optimized to preserve state tracking
   */
  const cleanupRouteLines = () => {
    if (!map.current) return;

    // Store the state key before cleanup
    const lastStateKey = routeLines.current._lastStateKey;

    Object.values(routeLines.current).forEach(line => {
      try {
        if (line.layer && map.current.getLayer(line.layer)) {
          map.current.removeLayer(line.layer);
        }
        if (line.source && map.current.getSource(line.source)) {
          map.current.removeSource(line.source);
        }
      } catch (error) {
        console.warn('Error cleaning up route line:', error);
      }
    });
    
    // Reset route lines but preserve state tracking
    routeLines.current = { _lastStateKey: lastStateKey };
  };

  /**
   * Draw a single route line - follows SRP for line drawing
   * @param {string} sourceId - Source identifier
   * @param {string} layerId - Layer identifier
   * @param {Array} coordinates - Line coordinates
   * @param {Object} style - Line style options
   */
  const drawRouteLine = (sourceId, layerId, coordinates, style) => {
    if (!map.current) return;

    try {
      // Check if source already exists and remove it
      if (map.current.getSource(sourceId)) {
        if (map.current.getLayer(layerId)) {
          map.current.removeLayer(layerId);
        }
        map.current.removeSource(sourceId);
      }

      // Add new source
      map.current.addSource(sourceId, {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: coordinates
          }
        }
      });

      // Add new layer
      map.current.addLayer({
        id: layerId,
        type: 'line',
        source: sourceId,
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': style.color,
          'line-width': style.width,
          'line-opacity': style.opacity,
          ...(style.dashArray && { 'line-dasharray': style.dashArray })
        }
      });

      // Store reference for cleanup
      routeLines.current[sourceId.replace('-route', '')] = { 
        source: sourceId, 
        layer: layerId 
      };
    } catch (error) {
      console.error('Error drawing route line:', error);
    }
  };

  /**
   * Get route progress for display - follows SRP for progress calculation
   */
  const getRouteProgress = () => {
    if (!selectedRouteId) return { collected: 0, total: 0, percentage: 0 };
    return RouteConfigService.calculateRouteProgress(selectedRouteId, collectedBins);
  };

  const progress = getRouteProgress();

  return (
    <div className={`navigation-map-container ${className}`} style={{ height }}>
      {/* Map Container */}
      <div 
        ref={mapContainer} 
        className="w-full h-full rounded-lg border border-gray-300"
        style={{ minHeight: '300px' }}
      />
      
      {/* Loading State */}
      {!mapLoaded && !mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
            <span className="text-gray-600">Loading navigation map...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-50 rounded-lg">
          <div className="text-center">
            <div className="text-red-600 font-medium mb-2">Map Error</div>
            <div className="text-red-500 text-sm">{mapError}</div>
          </div>
        </div>
      )}

      {/* No Route Selected State */}
      {mapLoaded && !mapError && (!selectedRouteId || !RouteConfigService.isValidRoute(selectedRouteId)) && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-gray-600 font-medium mb-2">📍 No Route Selected</div>
            <div className="text-gray-500 text-sm">Please select a route to view bins and navigation</div>
          </div>
        </div>
      )}

      {/* Navigation Info Overlay */}
      {mapLoaded && showNavigation && selectedRouteId && RouteConfigService.isValidRoute(selectedRouteId) && (
        <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-white rounded-lg shadow-lg p-3 sm:p-4 max-w-[280px] w-full sm:min-w-[250px] z-10">
          <div className="text-sm font-semibold text-gray-900 mb-3">
            {RouteConfigService.getRouteById(selectedRouteId)?.name || 'Navigation'}
          </div>
          
          {/* Progress */}
          <div className="space-y-2 mb-3">
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Progress:</span>
              <span className="font-medium">{progress.collected}/{progress.total} ({progress.percentage}%)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
          </div>

          {/* Next Destination */}
          {nextDestination && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-2">
              <div className="text-xs font-medium text-orange-800 mb-1">Next Destination</div>
              <div className="text-xs text-orange-700">{nextDestination.binId}</div>
              <div className="text-xs text-orange-600">{nextDestination.address}</div>
              <div className="text-xs text-orange-600">
                Distance: {Math.round(nextDestination.distance)}m
              </div>
            </div>
          )}

          {/* Current Location */}
          {currentLocation && (
            <div className="mt-2 text-xs text-gray-600">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Current Location</span>
              </div>
              <div className="text-xs text-gray-500">
                Accuracy: {Math.round(currentLocation.accuracy)}m
              </div>
            </div>
          )}
        </div>
      )}

      {/* Legend */}
      {mapLoaded && selectedRouteId && (
        <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 bg-white rounded-lg shadow-lg p-2 sm:p-3 z-10">
          <div className="text-xs font-semibold text-gray-900 mb-2">Navigation Legend</div>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-xs text-gray-600">Current Location</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span className="text-xs text-gray-600">Next Destination</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-xs text-gray-600">Completed</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-gray-500"></div>
              <span className="text-xs text-gray-600">Remaining</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const NavigationMapWithErrorBoundary = (props) => (
  <NavigationMapErrorBoundary>
    <NavigationMap {...props} />
  </NavigationMapErrorBoundary>
);

export default NavigationMapWithErrorBoundary;
