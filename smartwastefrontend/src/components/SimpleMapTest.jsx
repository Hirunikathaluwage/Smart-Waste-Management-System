import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { MAPBOX_CONFIG } from '../config/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';

/**
 * Simple Map Test Component
 * Used to test if Mapbox is working correctly
 */
const SimpleMapTest = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(null);

  useEffect(() => {
    if (map.current) return;

    console.log('SimpleMapTest: Initializing map with config:', MAPBOX_CONFIG);

    // Set Mapbox access token BEFORE creating the map
    mapboxgl.accessToken = MAPBOX_CONFIG.accessToken;

    // Ensure container is empty
    if (mapContainer.current) {
      mapContainer.current.innerHTML = '';
    }

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: MAPBOX_CONFIG.style,
        center: [79.8612, 6.9271], // Colombo, Sri Lanka
        zoom: 13,
        attributionControl: false
      });

      map.current.on('load', () => {
        console.log('SimpleMapTest: Map loaded successfully');
        setMapLoaded(true);
        setMapError(null);
      });

      map.current.on('error', (e) => {
        console.error('SimpleMapTest: Map error:', e);
        setMapError(`Map error: ${e.error?.message || 'Unknown error'}`);
      });

    } catch (error) {
      console.error('SimpleMapTest: Map initialization error:', error);
      setMapError(`Initialization error: ${error.message}`);
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Simple Map Test</h2>
      
      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">Configuration Status:</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Access Token: {MAPBOX_CONFIG.accessToken ? '✅ Present' : '❌ Missing'}</li>
          <li>• Style: {MAPBOX_CONFIG.style}</li>
          <li>• Mapbox GL Version: {mapboxgl.version}</li>
        </ul>
      </div>

      <div className="relative">
        <div 
          ref={mapContainer} 
          className="w-full h-96 rounded-lg border border-gray-300"
        />
        
        {!mapLoaded && !mapError && (
          <div className="absolute inset-0 bg-gray-100 border-2 border-gray-200 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-3"></div>
              <div className="text-gray-600">Loading map...</div>
            </div>
          </div>
        )}
        
        {mapError && (
          <div className="absolute inset-0 bg-red-50 border-2 border-red-200 rounded-lg flex items-center justify-center">
            <div className="text-center p-4">
              <div className="text-red-600 text-lg font-semibold mb-2">❌ Map Error</div>
              <p className="text-red-700 mb-3">{mapError}</p>
              <div className="text-sm text-red-600">
                <p>Please check:</p>
                <ul className="list-disc list-inside mt-1">
                  <li>Your Mapbox API key is valid</li>
                  <li>You have internet connection</li>
                  <li>Your domain is allowed in Mapbox settings</li>
                </ul>
              </div>
            </div>
          </div>
        )}
        
        {mapLoaded && (
          <div className="absolute top-2 right-2 bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
            ✅ Map Loaded Successfully
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleMapTest;
