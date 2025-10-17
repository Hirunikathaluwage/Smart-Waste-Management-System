import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { MAPBOX_CONFIG } from '../../config/mapbox';
import RouteConfigService from '../../services/RouteConfig';
import 'mapbox-gl/dist/mapbox-gl.css';

/**
 * Route Map Component
 * 
 * SOLID PRINCIPLES APPLIED:
 * - SRP (Single Responsibility): Only handles map display and route visualization
 * - OCP (Open/Closed): Open for extension with new map features, closed for modification
 * - DIP (Dependency Inversion): Depends on RouteConfigService abstraction
 * - ISP (Interface Segregation): Focused map interface without unnecessary dependencies
 * 
 * CODE SMELLS AVOIDED:
 * - No God class: Focused only on map visualization
 * - No duplicate code: Reusable map component
 * - No magic numbers: All map constants properly defined
 * - Clear separation: Map logic separated from business logic
 */

// Map configuration constants
const MAP_CONFIG = {
  DEFAULT_ZOOM: 12,
  MARKER_SIZE: 0.5,
  ROUTE_LINE_COLOR: '#3B82F6',
  ROUTE_LINE_WIDTH: 3,
  MARKER_COLORS: {
    ACTIVE: '#10B981',      // Green
    COLLECTED: '#3B82F6',   // Blue
    DAMAGED: '#EF4444',     // Red
    MAINTENANCE: '#F59E0B', // Yellow
    LOST: '#6B7280'         // Gray
  }
};

const RouteMap = ({ 
  selectedRouteId, 
  collectedBins = [], 
  height = '400px',
  className = '',
  onBinClick = null 
}) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markers = useRef({});
  const routeLine = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(null);

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
        zoom: MAP_CONFIG.DEFAULT_ZOOM,
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
        drawRouteLine();
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
   * Update map when route or collection data changes
   */
  useEffect(() => {
    if (mapLoaded && map.current) {
      updateMapMarkers();
      drawRouteLine();
      centerMapOnRoute();
    }
  }, [selectedRouteId, collectedBins, mapLoaded]);

  /**
   * Center map on selected route - follows SRP for map positioning
   */
  const centerMapOnRoute = () => {
    if (!map.current || !selectedRouteId) return;

    const routeCenter = RouteConfigService.getRouteCenter(selectedRouteId);
    if (routeCenter) {
      map.current.flyTo({
        center: [routeCenter.longitude, routeCenter.latitude],
        zoom: MAP_CONFIG.DEFAULT_ZOOM,
        duration: 1000
      });
    }
  };

  /**
   * Update map markers based on bin status - follows SRP for marker management
   */
  const updateMapMarkers = () => {
    if (!map.current || !selectedRouteId) return;

    // Clear existing markers
    Object.values(markers.current).forEach(marker => marker.remove());
    markers.current = {};

    // Get bins for the selected route
    const routeBins = RouteConfigService.getBinsForRoute(selectedRouteId);
    
    routeBins.forEach(bin => {
      const isCollected = collectedBins.some(collected => collected.binId === bin.binId);
      const status = isCollected ? 'COLLECTED' : bin.status;
      const color = MAP_CONFIG.MARKER_COLORS[status] || MAP_CONFIG.MARKER_COLORS.ACTIVE;

      // Create marker element
      const markerElement = document.createElement('div');
      markerElement.className = 'route-marker';
      markerElement.style.cssText = `
        width: 20px;
        height: 20px;
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
      `;
      markerElement.textContent = bin.binId.split('-')[1]; // Show bin number

      // Create popup content
      const popupContent = `
        <div style="padding: 8px; min-width: 200px;">
          <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">${bin.binId}</h3>
          <p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">${bin.address}</p>
          <p style="margin: 0; font-size: 12px;">
            <span style="color: ${color}; font-weight: bold;">Status: ${status}</span>
          </p>
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
   * Draw route line connecting bins - follows SRP for route visualization
   */
  const drawRouteLine = () => {
    if (!map.current || !selectedRouteId) return;

    // Remove existing route line
    if (routeLine.current) {
      map.current.removeLayer('route-line');
      map.current.removeSource('route-line');
      routeLine.current = null;
    }

    // Get bins for the selected route
    const routeBins = RouteConfigService.getBinsForRoute(selectedRouteId);
    
    if (routeBins.length < 2) return; // Need at least 2 bins to draw a line

    // Create line coordinates
    const coordinates = routeBins.map(bin => [bin.longitude, bin.latitude]);

    // Add route line source
    map.current.addSource('route-line', {
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

    // Add route line layer
    map.current.addLayer({
      id: 'route-line',
      type: 'line',
      source: 'route-line',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': MAP_CONFIG.ROUTE_LINE_COLOR,
        'line-width': MAP_CONFIG.ROUTE_LINE_WIDTH,
        'line-opacity': 0.7
      }
    });

    routeLine.current = true;
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
    <div className={`route-map-container ${className}`} style={{ height }}>
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
            <span className="text-gray-600">Loading map...</span>
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

      {/* Route Progress Overlay */}
      {mapLoaded && selectedRouteId && (
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 min-w-[200px]">
          <div className="text-sm font-semibold text-gray-900 mb-2">
            {RouteConfigService.getRouteById(selectedRouteId)?.name || 'Route Progress'}
          </div>
          <div className="space-y-1">
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
        </div>
      )}

      {/* Legend */}
      {mapLoaded && selectedRouteId && (
        <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-3">
          <div className="text-xs font-semibold text-gray-900 mb-2">Bin Status</div>
          <div className="space-y-1">
            {Object.entries(MAP_CONFIG.MARKER_COLORS).map(([status, color]) => (
              <div key={status} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full border border-gray-300"
                  style={{ backgroundColor: color }}
                />
                <span className="text-xs text-gray-600">{status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RouteMap;
