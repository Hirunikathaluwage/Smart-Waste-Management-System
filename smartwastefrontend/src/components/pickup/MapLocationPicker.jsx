import React, { useState, useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { MAPBOX_CONFIG } from '../../config/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';

const MapLocationPicker = ({ 
  onLocationSelect, 
  initialLocation = null, 
  height = '400px',
  className = '' 
}) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);
  const popup = useRef(null);
  
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const [isLoading, setIsLoading] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(null);

  // Set Mapbox access token
  mapboxgl.accessToken = MAPBOX_CONFIG.accessToken;
  
  // Disable analytics to prevent ad blocker issues
  mapboxgl.config.API_URL = 'https://api.mapbox.com';

  useEffect(() => {
    if (map.current) return; // Initialize map only once

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: MAPBOX_CONFIG.style,
      center: [
        initialLocation?.longitude || 79.8612, // Default to Colombo, Sri Lanka
        initialLocation?.latitude || 6.9271
      ],
      zoom: initialLocation ? 15 : 13,
      // Disable analytics to prevent blocking issues
      attributionControl: false,
      logoPosition: 'bottom-left'
    });

    // Add map controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Set cursor to crosshair for better UX
    map.current.getCanvas().style.cursor = 'crosshair';

    // Handle map click
    map.current.on('click', handleMapClick);

    // Handle map load
    map.current.on('load', () => {
      setMapLoaded(true);
      setMapError(null);
      
      // Add initial marker if location is provided
      if (initialLocation) {
        addMarker(initialLocation.longitude, initialLocation.latitude, initialLocation);
      }
    });

    // Handle map errors
    map.current.on('error', (e) => {
      console.error('Mapbox error:', e);
      setMapError('Failed to load map. Please check your Mapbox API key.');
    });

    // Cleanup function
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (initialLocation && map.current && mapLoaded) {
      // Update map center and add marker for initial location
      map.current.setCenter([initialLocation.longitude, initialLocation.latitude]);
      map.current.setZoom(15);
      addMarker(initialLocation.longitude, initialLocation.latitude, initialLocation);
    }
  }, [initialLocation, mapLoaded]);

  const addMarker = (lng, lat, locationData) => {
    // Remove existing marker
    if (marker.current) {
      marker.current.remove();
    }

    // Create new marker
    marker.current = new mapboxgl.Marker({
      color: '#ef4444', // Red color
      scale: 1.2
    })
      .setLngLat([lng, lat])
      .addTo(map.current);

    // Create popup
    if (popup.current) {
      popup.current.remove();
    }

    popup.current = new mapboxgl.Popup({
      closeButton: true,
      closeOnClick: false,
      anchor: 'bottom'
    })
      .setLngLat([lng, lat])
      .setHTML(`
        <div class="p-2">
          <h4 class="font-semibold text-gray-800 mb-1">Selected Location</h4>
          <p class="text-sm text-gray-600 mb-2">${locationData.formattedAddress}</p>
          <p class="text-xs text-gray-500">
            Coordinates: ${lat.toFixed(6)}, ${lng.toFixed(6)}
          </p>
        </div>
      `)
      .addTo(map.current);
  };

  const handleMapClick = async (e) => {
    const { lng, lat } = e.lngLat;
    
    setIsLoading(true);
    
    try {
      // Reverse geocoding to get address from coordinates
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_CONFIG.accessToken}&types=address,poi`
      );
      
      const data = await response.json();
      
      let address = 'Unknown Location';
      let city = '';
      let postalCode = '';
      
      if (data.features && data.features.length > 0) {
        const feature = data.features[0];
        address = feature.place_name || feature.text || 'Unknown Location';
        
        // Extract city and postal code from context
        if (feature.context) {
          const cityFeature = feature.context.find(ctx => ctx.id.startsWith('place.'));
          const postalFeature = feature.context.find(ctx => ctx.id.startsWith('postcode.'));
          
          if (cityFeature) city = cityFeature.text;
          if (postalFeature) postalCode = postalFeature.text;
        }
      }

      const locationData = {
        latitude: lat,
        longitude: lng,
        address,
        city,
        postalCode,
        formattedAddress: address
      };

      setSelectedLocation(locationData);
      
      // Add marker and popup
      addMarker(lng, lat, locationData);
      
      // Call the parent component's callback
      onLocationSelect(locationData);
      
    } catch (error) {
      console.error('Error with reverse geocoding:', error);
      
      // Fallback location data without reverse geocoding
      const fallbackLocation = {
        latitude: lat,
        longitude: lng,
        address: `Location: ${lat.toFixed(6)}, ${lng.toFixed(6)}`,
        city: '',
        postalCode: '',
        formattedAddress: `Location: ${lat.toFixed(6)}, ${lng.toFixed(6)}`
      };
      
      setSelectedLocation(fallbackLocation);
      addMarker(lng, lat, fallbackLocation);
      onLocationSelect(fallbackLocation);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }

    setIsLoading(true);
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        // Update map center
        map.current.setCenter([longitude, latitude]);
        map.current.setZoom(15);

        // Trigger the map click handler with current location
        await handleMapClick({ lngLat: { lng: longitude, lat: latitude } });
      },
      (error) => {
        console.error('Error getting current location:', error);
        alert('Unable to get your current location. Please try again or select manually on the map.');
        setIsLoading(false);
      }
    );
  };

  return (
    <div className={`map-location-picker ${className}`}>
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-700">Select Pickup Location</h3>
        <button
          type="button"
          onClick={handleGetCurrentLocation}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          {isLoading ? 'Loading...' : 'Use Current Location'}
        </button>
      </div>

      <div className="relative">
        <div 
          ref={mapContainer} 
          className="w-full rounded-lg border border-gray-300"
          style={{ height }}
        />
        
        {mapError && (
          <div className="absolute inset-0 bg-red-50 border-2 border-red-200 rounded-lg flex items-center justify-center">
            <div className="text-center p-4">
              <div className="text-red-600 text-lg font-semibold mb-2">🗺️ Map Error</div>
              <p className="text-red-700 mb-3">{mapError}</p>
              <div className="text-sm text-red-600">
                <p>Please check:</p>
                <ul className="list-disc list-inside mt-1">
                  <li>Your Mapbox API key is valid</li>
                  <li>You have internet connection</li>
                  <li>Your domain is allowed in Mapbox settings</li>
                </ul>
                <p className="mt-2">
                  <a href="https://account.mapbox.com/access-tokens/" target="_blank" rel="noopener noreferrer" 
                     className="text-blue-600 underline">
                    Get your free Mapbox API key here
                  </a>
                </p>
              </div>
            </div>
          </div>
        )}
        
        {isLoading && !mapError && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              <span className="text-gray-600">Loading location...</span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-3 text-sm text-gray-600">
        <p>💡 <strong>Tip:</strong> Click anywhere on the map to select your pickup location</p>
      </div>

      {selectedLocation && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-1">Selected Location</h4>
          <p className="text-sm text-green-700">{selectedLocation.formattedAddress}</p>
          {selectedLocation.city && (
            <p className="text-xs text-green-600 mt-1">City: {selectedLocation.city}</p>
          )}
          {selectedLocation.postalCode && (
            <p className="text-xs text-green-600">Postal Code: {selectedLocation.postalCode}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default MapLocationPicker;