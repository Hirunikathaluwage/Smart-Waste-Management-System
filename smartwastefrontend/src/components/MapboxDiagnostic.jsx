import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { MAPBOX_CONFIG } from '../config/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';

/**
 * Comprehensive Mapbox Diagnostic Component
 * Tests all aspects of Mapbox integration
 */
const MapboxDiagnostic = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(null);
  const [diagnostics, setDiagnostics] = useState({
    apiKeyValid: false,
    networkConnected: false,
    mapboxGLVersion: null,
    styleLoaded: false,
    tilesLoading: false,
    errors: []
  });

  useEffect(() => {
    runDiagnostics();
  }, []);

  const runDiagnostics = async () => {
    const newDiagnostics = {
      apiKeyValid: false,
      networkConnected: false,
      mapboxGLVersion: mapboxgl.version,
      styleLoaded: false,
      tilesLoading: false,
      errors: []
    };

    // Test 1: Check API Key
    try {
      const response = await fetch(`https://api.mapbox.com/styles/v1/mapbox/streets-v11?access_token=${MAPBOX_CONFIG.accessToken}`);
      if (response.ok) {
        newDiagnostics.apiKeyValid = true;
      } else {
        newDiagnostics.errors.push(`API Key test failed: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      newDiagnostics.errors.push(`API Key test error: ${error.message}`);
    }

    // Test 2: Check Network Connection
    try {
      const response = await fetch('https://www.google.com', { mode: 'no-cors' });
      newDiagnostics.networkConnected = true;
    } catch (error) {
      newDiagnostics.errors.push(`Network test failed: ${error.message}`);
    }

    setDiagnostics(newDiagnostics);

    // Initialize map if API key is valid
    if (newDiagnostics.apiKeyValid) {
      initializeMap();
    }
  };

  const initializeMap = () => {
    if (map.current) return;

    console.log('MapboxDiagnostic: Initializing map...');

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
        console.log('MapboxDiagnostic: Map loaded successfully');
        setMapLoaded(true);
        setMapError(null);
        setDiagnostics(prev => ({ ...prev, styleLoaded: true }));
      });

      map.current.on('error', (e) => {
        console.error('MapboxDiagnostic: Map error:', e);
        const errorMsg = `Map error: ${e.error?.message || 'Unknown error'}`;
        setMapError(errorMsg);
        setDiagnostics(prev => ({
          ...prev,
          errors: [...prev.errors, errorMsg]
        }));
      });

      map.current.on('sourcedata', (e) => {
        if (e.isSourceLoaded) {
          setDiagnostics(prev => ({ ...prev, tilesLoading: true }));
        }
      });

    } catch (error) {
      console.error('MapboxDiagnostic: Map initialization error:', error);
      const errorMsg = `Initialization error: ${error.message}`;
      setMapError(errorMsg);
      setDiagnostics(prev => ({
        ...prev,
        errors: [...prev.errors, errorMsg]
      }));
    }
  };

  const getStatusIcon = (status) => {
    return status ? '✅' : '❌';
  };

  const getStatusColor = (status) => {
    return status ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Mapbox Diagnostic Tool</h1>
      
      {/* Configuration Status */}
      <div className="mb-6 bg-blue-50 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-blue-800 mb-3">Configuration Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-blue-700">
              <span className="font-medium">API Key:</span> {MAPBOX_CONFIG.accessToken ? 'Present' : 'Missing'}
            </p>
            <p className="text-sm text-blue-700">
              <span className="font-medium">Style:</span> {MAPBOX_CONFIG.style}
            </p>
            <p className="text-sm text-blue-700">
              <span className="font-medium">Mapbox GL Version:</span> {diagnostics.mapboxGLVersion}
            </p>
          </div>
          <div>
            <p className="text-sm text-blue-700">
              <span className="font-medium">Current URL:</span> {window.location.href}
            </p>
            <p className="text-sm text-blue-700">
              <span className="font-medium">User Agent:</span> {navigator.userAgent.substring(0, 50)}...
            </p>
          </div>
        </div>
      </div>

      {/* Diagnostic Results */}
      <div className="mb-6 bg-gray-50 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Diagnostic Results</h2>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className={getStatusColor(diagnostics.apiKeyValid)}>
              {getStatusIcon(diagnostics.apiKeyValid)}
            </span>
            <span className="text-sm">API Key Valid</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className={getStatusColor(diagnostics.networkConnected)}>
              {getStatusIcon(diagnostics.networkConnected)}
            </span>
            <span className="text-sm">Network Connected</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className={getStatusColor(diagnostics.styleLoaded)}>
              {getStatusIcon(diagnostics.styleLoaded)}
            </span>
            <span className="text-sm">Style Loaded</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className={getStatusColor(diagnostics.tilesLoading)}>
              {getStatusIcon(diagnostics.tilesLoading)}
            </span>
            <span className="text-sm">Tiles Loading</span>
          </div>
        </div>
      </div>

      {/* Errors */}
      {diagnostics.errors.length > 0 && (
        <div className="mb-6 bg-red-50 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-red-800 mb-3">Errors Found</h2>
          <ul className="space-y-1">
            {diagnostics.errors.map((error, index) => (
              <li key={index} className="text-sm text-red-700">• {error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Map Test */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Map Test</h2>
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

      {/* Troubleshooting Tips */}
      <div className="bg-yellow-50 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-yellow-800 mb-3">Troubleshooting Tips</h2>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• If API Key is invalid, check your Mapbox account dashboard</li>
          <li>• If network fails, check your internet connection</li>
          <li>• If style doesn't load, verify the style URL is correct</li>
          <li>• If tiles don't load, check for ad blockers or firewall issues</li>
          <li>• For localhost development, ensure your domain is allowed in Mapbox settings</li>
        </ul>
      </div>
    </div>
  );
};

export default MapboxDiagnostic;
