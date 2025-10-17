/**
 * Custom hook for GPS location tracking
 * Follows SRP - only handles location-related functionality
 */
import { useState, useEffect, useCallback } from 'react';
import locationService from '../services/LocationService';

export const useLocationTracking = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [isLocationTracking, setIsLocationTracking] = useState(false);
  const [isRefreshingLocation, setIsRefreshingLocation] = useState(false);
  const [hasRequestedPermission, setHasRequestedPermission] = useState(false);

  const handleGPSPermissionGranted = useCallback(async () => {
    try {
      const location = await locationService.getCurrentLocation();
      setCurrentLocation(location);
      setLocationError(null);
      return true;
    } catch (error) {
      console.error("Failed to get location after permission granted:", error);
      setLocationError("Failed to get location");
      return false;
    }
  }, []);

  const handleGPSPermissionDenied = useCallback((message) => {
    setLocationError(message);
  }, []);

  const handleLocationTrackingToggle = useCallback(() => {
    if (!currentLocation) {
      return false; // Indicates permission dialog should be shown
    }
    setIsLocationTracking(!isLocationTracking);
    return true;
  }, [currentLocation, isLocationTracking]);

  const handleLocationRefresh = useCallback(async () => {
    setIsRefreshingLocation(true);
    setLocationError(null);

    try {
      const location = await locationService.getHighAccuracyLocation();
      setCurrentLocation(location);
      setLocationError(null);
    } catch (error) {
      console.error("Failed to refresh location:", error);
      setLocationError("Failed to refresh location. Please try again.");
    } finally {
      setIsRefreshingLocation(false);
    }
  }, []);

  const getLocationQualityIndicator = useCallback((location) => {
    if (!location) return null;

    const quality = location.quality || locationService.getLocationQuality(location.accuracy);
    const color = locationService.getLocationQualityColor(quality);
    const description = locationService.getLocationQualityDescription(quality);

    return {
      quality,
      color,
      description,
      accuracy: Math.round(location.accuracy),
    };
  }, []);

  // Initialize location tracking
  useEffect(() => {
    const initializeLocation = async () => {
      try {
        const availability = await locationService.checkLocationAvailability();

        if (
          availability.available &&
          availability.canEnable &&
          !hasRequestedPermission
        ) {
          setHasRequestedPermission(true);
          return false; // Indicates permission dialog should be shown
        } else if (availability.available && !availability.canEnable) {
          const location = await locationService.getCurrentLocation();
          setCurrentLocation(location);
          setLocationError(null);
        }
      } catch (error) {
        console.warn("Failed to initialize location:", error);
        setLocationError("Location services unavailable");
      }
      return true;
    };

    initializeLocation();
  }, [hasRequestedPermission]);

  // Start/stop location tracking
  useEffect(() => {
    if (isLocationTracking && currentLocation) {
      const watchId = locationService.startTracking((location) => {
        setCurrentLocation(location);
        setLocationError(null);
      });

      return () => {
        if (watchId) {
          locationService.stopTracking();
        }
      };
    }
  }, [isLocationTracking, currentLocation]);

  return {
    // State
    currentLocation,
    locationError,
    isLocationTracking,
    isRefreshingLocation,
    hasRequestedPermission,
    
    // Actions
    handleGPSPermissionGranted,
    handleGPSPermissionDenied,
    handleLocationTrackingToggle,
    handleLocationRefresh,
    getLocationQualityIndicator,
    setHasRequestedPermission
  };
};
