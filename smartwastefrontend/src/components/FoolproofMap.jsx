import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { MAPBOX_CONFIG } from '../config/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';

/**
 * Foolproof Map Component with Bin Markers
 * Shows all bins from the database on the map
 */
const FoolproofMap = () => {
  const mapContainer = useRef(null);
  const [bins, setBins] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch bins data
  useEffect(() => {
    const fetchBins = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/bins');
        if (response.ok) {
          const binsData = await response.json();
          setBins(binsData);
          console.log('✅ Loaded bins for map:', binsData);
        } else {
          console.warn('⚠️ Failed to fetch bins, using mock data');
          // Fallback to mock data
          const mockBins = [
            {
              id: 'BIN001',
              latitude: 6.9271,
              longitude: 79.8612,
              status: 'ACTIVE',
              fillLevel: 75,
              batteryLevel: 85,
              temperature: 25
            },
            {
              id: 'BIN002',
              latitude: 6.9371,
              longitude: 79.8712,
              status: 'FULL',
              fillLevel: 95,
              batteryLevel: 60,
              temperature: 28
            },
            {
              id: 'BIN003',
              latitude: 6.9171,
              longitude: 79.8512,
              status: 'ACTIVE',
              fillLevel: 45,
              batteryLevel: 90,
              temperature: 22
            },
            {
              id: 'BIN004',
              latitude: 6.9471,
              longitude: 79.8812,
              status: 'MAINTENANCE',
              fillLevel: 30,
              batteryLevel: 20,
              temperature: 35
            },
            {
              id: 'BIN005',
              latitude: 6.9071,
              longitude: 79.8412,
              status: 'ACTIVE',
              fillLevel: 60,
              batteryLevel: 75,
              temperature: 24
            }
          ];
          setBins(mockBins);
        }
      } catch (error) {
        console.error('❌ Error fetching bins:', error);
        setBins([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBins();
  }, []);

  useEffect(() => {
    if (loading || bins.length === 0) return;

    // Set access token
    mapboxgl.accessToken = MAPBOX_CONFIG.accessToken;
    
    // Create map with explicit options
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [79.8612, 6.9271], // Colombo, Sri Lanka
      zoom: 13,
      attributionControl: false
    });

    // Add bin markers when map loads
    map.on('load', () => {
      console.log('🗺️ Map loaded, adding bin markers...');
      
      bins.forEach(bin => {
        // Determine marker color based on status
        let color = '#10B981'; // Green for active
        if (bin.status === 'FULL') color = '#F59E0B'; // Yellow for full
        if (bin.status === 'MAINTENANCE') color = '#EF4444'; // Red for maintenance
        if (bin.status === 'OFFLINE') color = '#6B7280'; // Gray for offline

        // Create marker
        const marker = new mapboxgl.Marker({
          color: color,
          scale: 1.2
        })
          .setLngLat([bin.longitude, bin.latitude])
          .addTo(map);

        // Create popup with bin information
        const popup = new mapboxgl.Popup({
          closeButton: true,
          closeOnClick: false,
          anchor: 'bottom'
        })
          .setLngLat([bin.longitude, bin.latitude])
          .setHTML(`
            <div style="padding: 10px; min-width: 200px;">
              <h3 style="margin: 0 0 8px 0; color: #1f2937; font-size: 16px; font-weight: bold;">
                ${bin.id}
              </h3>
              <div style="margin-bottom: 6px;">
                <span style="font-weight: bold; color: ${color};">${bin.status}</span>
              </div>
              <div style="font-size: 14px; color: #6b7280;">
                <div style="margin-bottom: 4px;">
                  <strong>Fill Level:</strong> ${bin.fillLevel}%
                </div>
                <div style="margin-bottom: 4px;">
                  <strong>Battery:</strong> ${bin.batteryLevel}%
                </div>
                <div style="margin-bottom: 4px;">
                  <strong>Temperature:</strong> ${bin.temperature}°C
                </div>
                <div style="margin-top: 8px; font-size: 12px; color: #9ca3af;">
                  Coordinates: ${bin.latitude.toFixed(6)}, ${bin.longitude.toFixed(6)}
                </div>
              </div>
            </div>
          `)
          .addTo(map);

        marker.setPopup(popup);
      });

      console.log(`✅ Added ${bins.length} bin markers to map`);
    });

    return () => map.remove();
  }, [bins, loading]);

  return (
    <div style={{ 
      width: '100%', 
      height: '400px',
      border: '2px solid red',
      backgroundColor: 'lightgray',
      position: 'relative'
    }}>
      {loading && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          zIndex: 1000
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #3498db',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 10px'
            }}></div>
            <p style={{ margin: 0, color: '#666' }}>Loading bins...</p>
          </div>
        </div>
      )}
      
      <div 
        ref={mapContainer} 
        style={{ 
          width: '100%', 
          height: '100%',
          minHeight: '400px'
        }} 
      />
      
      {/* Legend */}
      <div style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        background: 'white',
        padding: '10px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        fontSize: '12px',
        zIndex: 1000
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Bin Status</div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2px' }}>
          <div style={{ width: '12px', height: '12px', backgroundColor: '#10B981', marginRight: '5px', borderRadius: '50%' }}></div>
          Active
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2px' }}>
          <div style={{ width: '12px', height: '12px', backgroundColor: '#F59E0B', marginRight: '5px', borderRadius: '50%' }}></div>
          Full
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2px' }}>
          <div style={{ width: '12px', height: '12px', backgroundColor: '#EF4444', marginRight: '5px', borderRadius: '50%' }}></div>
          Maintenance
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '12px', height: '12px', backgroundColor: '#6B7280', marginRight: '5px', borderRadius: '50%' }}></div>
          Offline
        </div>
      </div>
    </div>
  );
};

export default FoolproofMap;
