import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { MAPBOX_CONFIG } from '../config/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';

/**
 * Simple Map Component for Bin Status Page
 * Minimal implementation to test map loading
 */
const SimpleBinMap = ({ readOnly = true }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(null);

  useEffect(() => {
    if (map.current) return;

    console.log('SimpleBinMap: Initializing map...');
    console.log('SimpleBinMap: Setting access token:', MAPBOX_CONFIG.accessToken);

    // Set Mapbox access token BEFORE creating the map
    mapboxgl.accessToken = MAPBOX_CONFIG.accessToken;
    
    // Disable analytics to prevent ad blocker issues
    mapboxgl.config.API_URL = 'https://api.mapbox.com';

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
        console.log('SimpleBinMap: Map loaded successfully');
        setMapLoaded(true);
        setMapError(null);
        
        // Add sample bin markers
        addSampleBins();
      });

      map.current.on('error', (e) => {
        console.error('SimpleBinMap: Map error:', e);
        setMapError(`Map error: ${e.error?.message || 'Unknown error'}`);
      });

    } catch (error) {
      console.error('SimpleBinMap: Map initialization error:', error);
      setMapError(`Initialization error: ${error.message}`);
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  const addSampleBins = () => {
    const sampleBins = [
      { lng: 79.8612, lat: 6.9271, status: 'active', id: 'BIN001' },
      { lng: 79.8712, lat: 6.9371, status: 'full', id: 'BIN002' },
      { lng: 79.8512, lat: 6.9171, status: 'active', id: 'BIN003' },
      { lng: 79.8812, lat: 6.9471, status: 'maintenance', id: 'BIN004' },
      { lng: 79.8412, lat: 6.9071, status: 'active', id: 'BIN005' }
    ];

    sampleBins.forEach(bin => {
      const color = bin.status === 'active' ? '#10B981' : 
                   bin.status === 'full' ? '#F59E0B' : 
                   bin.status === 'maintenance' ? '#EF4444' : '#6B7280';
      
      const marker = new mapboxgl.Marker({
        color: color,
        scale: 0.8
      })
        .setLngLat([bin.lng, bin.lat])
        .addTo(map.current);

      const popup = new mapboxgl.Popup({
        closeButton: true,
        closeOnClick: false,
        anchor: 'bottom'
      })
        .setLngLat([bin.lng, bin.lat])
        .setHTML(`
          <div class="p-2">
            <h4 class="font-semibold text-gray-800 mb-1">${bin.id}</h4>
            <p class="text-sm text-gray-600 mb-1">Status: <span class="font-medium" style="color: ${color}">${bin.status.toUpperCase()}</span></p>
            <p class="text-xs text-gray-500">Bin Location</p>
          </div>
        `)
        .addTo(map.current);

      marker.setPopup(popup);
    });
  };

  return (
    <div className="relative">
      <div 
        ref={mapContainer} 
        className="w-full rounded-lg border border-gray-300"
        style={{ height: '100%' }}
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
          ✅ Map Loaded
        </div>
      )}
    </div>
  );
};

export default SimpleBinMap;
