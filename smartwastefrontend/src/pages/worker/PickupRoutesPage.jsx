import React, { useState, useEffect } from 'react';
import RouteConfigService from '../../services/RouteConfig';
import NavigationMap from '../../components/collection/NavigationMap';

// SVG Icons following SRP for icon management
const TruckIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707L16 7.586A1 1 0 0015.414 7H14z" />
  </svg>
);

const ClockIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
  </svg>
);

const UserIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
  </svg>
);

const CarIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707L16 7.586A1 1 0 0015.414 7H14z" />
  </svg>
);

const MapPinIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
  </svg>
);

/**
 * Route Details Form Component - follows SRP for form management
 */
const RouteDetailsForm = ({ selectedRouteId, onRouteChange, className = '' }) => {
  const [availableRoutes, setAvailableRoutes] = useState([]);
  const [routeDetails, setRouteDetails] = useState({
    driver: 'Jayasinghe Perera',
    vehicle: 'Truck-001',
    startTime: '8:00 AM',
    endTime: '12:00 PM',
    status: 'In Progress'
  });

  useEffect(() => {
    const routes = RouteConfigService.getAvailableRoutes();
    setAvailableRoutes(routes);
  }, []);

  const selectedRoute = RouteConfigService.getRouteById(selectedRouteId);
  const totalStops = selectedRoute ? selectedRoute.bins.length : 0;

  return (
    <div className={`route-details-form ${className}`}>
      <div className="bg-white rounded-lg shadow-sm p-6">

        <div className="space-y-6">
          {/* Route Name - Full Width for Better Visibility */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Route Name
            </label>
            <select
              value={selectedRouteId || ''}
              onChange={(e) => onRouteChange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
            >
              <option value="">-- Select a Route --</option>
              {availableRoutes.map((route) => (
                <option key={route.id} value={route.id}>
                  {route.name}
                </option>
              ))}
            </select>
          </div>

          {/* Other Details - Responsive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* Driver */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Driver
              </label>
              <div className="flex items-center space-x-2">
                <UserIcon className="w-5 h-5 text-gray-400" />
                <span className="text-gray-900">{routeDetails.driver}</span>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
            </div>

            {/* Vehicle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vehicle
              </label>
              <div className="flex items-center space-x-2">
                <CarIcon className="w-5 h-5 text-gray-400" />
                <span className="text-gray-900">{routeDetails.vehicle}</span>
              </div>
            </div>

            {/* Start Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Time
              </label>
              <div className="flex items-center space-x-3">
                <ClockIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-gray-900 font-medium">{routeDetails.startTime}</span>
              </div>
            </div>

            {/* End Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Time
              </label>
              <div className="flex items-center space-x-3">
                <ClockIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-gray-900 font-medium">{routeDetails.endTime}</span>
              </div>
            </div>

            {/* Total Stops */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Stops
              </label>
              <div className="flex items-center justify-end space-x-2">
                <span className="text-2xl font-bold text-green-600">{totalStops}</span>
                <span className="text-sm text-gray-500">bins</span>
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <div className="flex justify-end">
                <span className="inline-flex px-4 py-2 bg-green-100 text-green-800 text-sm font-semibold rounded-full border border-green-200">
                  {routeDetails.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Collection Points List Component - follows SRP for list management
 */
const CollectionPointsList = ({ selectedRouteId, className = '' }) => {
  const [collectionPoints, setCollectionPoints] = useState([]);

  const POINT_CONFIG = {
    COMMERCIAL_KEYWORDS: ['Commercial', 'Business', 'Office', 'Mall', 'Shopping'],
    DEFAULT_TYPE: 'Residential',
    STATUS_COLORS: {
      ACTIVE: 'bg-green-100 text-green-800',
      COLLECTED: 'bg-blue-100 text-blue-800',
      DAMAGED: 'bg-red-100 text-red-800',
      MAINTENANCE: 'bg-yellow-100 text-yellow-800',
      LOST: 'bg-gray-100 text-gray-800'
    }
  };

  const determinePointType = (address) => {
    if (!address) return POINT_CONFIG.DEFAULT_TYPE;
    
    const isCommercial = POINT_CONFIG.COMMERCIAL_KEYWORDS.some(keyword => 
      address.toLowerCase().includes(keyword.toLowerCase())
    );
    
    return isCommercial ? 'Commercial' : POINT_CONFIG.DEFAULT_TYPE;
  };

  const getStatusColor = (status) => {
    return POINT_CONFIG.STATUS_COLORS[status] || POINT_CONFIG.STATUS_COLORS.LOST;
  };

  useEffect(() => {
    if (selectedRouteId && RouteConfigService.isValidRoute(selectedRouteId)) {
      const routeBins = RouteConfigService.getBinsForRoute(selectedRouteId);
      
      if (routeBins && routeBins.length > 0) {
        const points = routeBins.map((bin, index) => ({
          id: bin.binId,
          sequenceNumber: index + 1,
          binId: bin.binId,
          displayName: bin.binId,
          address: bin.address,
          type: determinePointType(bin.address),
          status: bin.status
        }));
        setCollectionPoints(points);
      } else {
        setCollectionPoints([]);
      }
    } else {
      setCollectionPoints([]);
    }
  }, [selectedRouteId]);

  return (
    <div className={`collection-points-list ${className}`}>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center space-x-2 mb-4">
          <MapPinIcon className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">Collection Points</h3>
        </div>
        
        <div className="space-y-3">
          {collectionPoints.length > 0 ? (
            collectionPoints.map((point) => (
              <div key={point.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-700">{point.sequenceNumber}</span>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-gray-900">{point.displayName}</span>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-600">{point.address}</span>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-gray-500">{point.type}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(point.status)}`}>
                      {point.status}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <MapPinIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">Select a route to view collection points</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Main Pickup Routes Page Component
 */
const PickupRoutesPage = () => {
  const [selectedRouteId, setSelectedRouteId] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isLocationTracking, setIsLocationTracking] = useState(false);

  const handleRouteChange = (routeId) => {
    console.log('🔄 Route Changed:', {
      newRouteId: routeId,
      routeValid: RouteConfigService.isValidRoute(routeId),
      routeBins: RouteConfigService.getBinsForRoute(routeId)?.map(bin => bin.binId) || []
    });
    
    setSelectedRouteId(routeId);
    
    // Save to localStorage for persistence
    if (routeId) {
      localStorage.setItem('selectedRouteId', routeId);
    } else {
      localStorage.removeItem('selectedRouteId');
    }
  };

  // Load saved route on component mount
  useEffect(() => {
    const savedRouteId = localStorage.getItem('selectedRouteId');
    console.log('🔄 Loading saved route:', {
      savedRouteId,
      isValid: RouteConfigService.isValidRoute(savedRouteId),
      availableRoutes: RouteConfigService.getAvailableRoutes().map(r => r.id)
    });
    
    if (savedRouteId && RouteConfigService.isValidRoute(savedRouteId)) {
      setSelectedRouteId(savedRouteId);
    } else if (savedRouteId) {
      console.warn('⚠️ Invalid route in localStorage, clearing:', savedRouteId);
      localStorage.removeItem('selectedRouteId');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Route Details and Collection Points */}
          <div className="lg:col-span-1 space-y-6">
            <RouteDetailsForm
              selectedRouteId={selectedRouteId}
              onRouteChange={handleRouteChange}
            />
            
            <CollectionPointsList
              selectedRouteId={selectedRouteId}
            />

            {/* Location Tracking Controls */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Location Tracking</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">GPS Status:</span>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${currentLocation ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-sm font-medium">
                      {currentLocation ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                {currentLocation && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Accuracy:</span>
                    <span className="text-sm font-medium">{Math.round(currentLocation.accuracy)}m</span>
                  </div>
                )}

                <button
                  onClick={() => {
                    setIsLocationTracking(!isLocationTracking);
                    if (!isLocationTracking) {
                      // Simulate GPS location for demonstration
                      setCurrentLocation({ 
                        latitude: 6.9271, 
                        longitude: 79.8612, 
                        accuracy: 15 
                      });
                    } else {
                      setCurrentLocation(null);
                    }
                  }}
                  className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                    isLocationTracking 
                      ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {isLocationTracking ? 'Stop Tracking' : 'Start Tracking'}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Map Placeholder */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center space-x-2 mb-4">
                <MapPinIcon className="w-5 h-5 text-green-600" />
                <h2 className="text-lg font-semibold text-gray-900">Route Map</h2>
              </div>
              
              {selectedRouteId ? (
                <NavigationMap
                  selectedRouteId={selectedRouteId}
                  currentLocation={currentLocation}
                  isLocationTracking={isLocationTracking}
                  className="h-[600px]"
                />
              ) : (
                <div className="h-[600px] bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <MapPinIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium mb-2">No Route Selected</h3>
                    <p>Select a route from the dropdown above to view the map</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PickupRoutesPage;