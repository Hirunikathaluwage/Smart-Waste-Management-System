import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { MAPBOX_CONFIG } from '../config/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';

/**
 * Ultra Simple Map Test - Minimal implementation
 * This will help identify if the issue is with CSS, sizing, or map rendering
 */
const UltraSimpleMapTest = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [status, setStatus] = useState('Initializing...');

  useEffect(() => {
    if (map.current) return;

    console.log('UltraSimpleMapTest: Starting...');
    setStatus('Setting access token...');

    // Set access token
    mapboxgl.accessToken = MAPBOX_CONFIG.accessToken;
    console.log('UltraSimpleMapTest: Access token set');

    // Clear container
    if (mapContainer.current) {
      mapContainer.current.innerHTML = '';
      console.log('UltraSimpleMapTest: Container cleared');
    }

    setStatus('Creating map...');
    console.log('UltraSimpleMapTest: Creating map instance...');

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [79.8612, 6.9271], // Colombo, Sri Lanka
        zoom: 13
      });

      console.log('UltraSimpleMapTest: Map instance created');

      map.current.on('load', () => {
        console.log('UltraSimpleMapTest: Map loaded successfully!');
        setStatus('✅ Map loaded successfully!');
      });

      map.current.on('error', (e) => {
        console.error('UltraSimpleMapTest: Map error:', e);
        setStatus(`❌ Map error: ${e.error?.message || 'Unknown error'}`);
      });

      map.current.on('style.load', () => {
        console.log('UltraSimpleMapTest: Style loaded');
        setStatus('Style loaded, rendering...');
      });

      map.current.on('render', () => {
        console.log('UltraSimpleMapTest: Map rendering');
        setStatus('✅ Map is rendering!');
      });

    } catch (error) {
      console.error('UltraSimpleMapTest: Error creating map:', error);
      setStatus(`❌ Error: ${error.message}`);
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Ultra Simple Map Test</h1>
      
      <div style={{ 
        backgroundColor: '#f0f8ff', 
        padding: '15px', 
        borderRadius: '8px',
        marginBottom: '20px',
        border: '2px solid #007bff'
      }}>
        <h3>Status: {status}</h3>
        <p><strong>Access Token:</strong> {MAPBOX_CONFIG.accessToken ? 'Present' : 'Missing'}</p>
        <p><strong>Style:</strong> {MAPBOX_CONFIG.style}</p>
        <p><strong>Mapbox GL Version:</strong> {mapboxgl.version}</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Map Container (Fixed Size)</h3>
        <div 
          ref={mapContainer} 
          style={{
            width: '800px',
            height: '400px',
            border: '3px solid #007bff',
            backgroundColor: '#f0f0f0',
            position: 'relative'
          }}
        />
        <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
          Container: 800x400px with blue border
        </p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Map Container (Responsive)</h3>
        <div 
          style={{
            width: '100%',
            height: '300px',
            border: '3px solid #28a745',
            backgroundColor: '#f0f0f0',
            position: 'relative'
          }}
        >
          <div 
            ref={mapContainer} 
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              top: 0,
              left: 0
            }}
          />
        </div>
        <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
          Container: 100% width, 300px height with green border
        </p>
      </div>

      <div style={{ 
        backgroundColor: '#fff3cd', 
        padding: '15px', 
        borderRadius: '8px',
        border: '2px solid #ffc107'
      }}>
        <h3>Debugging Info</h3>
        <p>Check browser console for detailed logs</p>
        <p>If you see a gray box instead of a map, the issue is likely:</p>
        <ul>
          <li>CSS conflicts</li>
          <li>Container sizing issues</li>
          <li>Mapbox GL CSS not loading</li>
          <li>WebGL not supported</li>
        </ul>
      </div>
    </div>
  );
};

export default UltraSimpleMapTest;
