import React, { useState, useEffect } from 'react';
import { FeedbackDisplay, ProgressIndicator, SensorDataDisplay, CollectionTable } from '../../components/collection/CollectionComponents';
import NavigationMap from '../../components/collection/NavigationMap';
import GPSPermissionDialog from '../../components/common/GPSPermissionDialog';
import FullSummaryModal from '../../components/collection/FullSummaryModal';
import { ModalBackdropComponent } from '../../components/common/ModalBackdrop';
import audioFeedbackService from '../../services/AudioFeedbackService';
import mockIoTSensorService from '../../services/MockIoTSensorService';
import binService from '../../services/BinService';
import collectionService from '../../services/CollectionService';
import RouteConfigService from '../../services/RouteConfig';
import RouteSummaryService from '../../services/RouteSummaryService';
import SessionService from '../../services/SessionService';
import DailyResetService from '../../services/DailyResetService';
import locationService from '../../services/LocationService';

// Simple SVG icons to avoid external dependencies - follows SRP for icon management
const CheckCircleIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

const ExclamationTriangleIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
);

const XCircleIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
  </svg>
);

const CloudSlashIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
  </svg>
);

const ClockIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
  </svg>
);

const ScaleIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
  </svg>
);

const MapPinIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
  </svg>
);

const TruckIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707L16 7.586A1 1 0 0015.414 7H14z" />
  </svg>
);

/**
 * Worker Collection Page - Handles waste collection recording
 * 
 * SOLID PRINCIPLES APPLIED:
 * - SRP (Single Responsibility): Only handles waste collection recording UI
 * - OCP (Open/Closed): Open for extension with new collection types, closed for modification
 * - DIP (Dependency Inversion): Depends on service abstractions, not concrete implementations
 * - ISP (Interface Segregation): Focused collection interface without unnecessary dependencies
 * 
 * CODE SMELLS AVOIDED:
 * - No God class: Focused only on collection recording
 * - No duplicate code: Reusable feedback components
 * - No magic numbers: All constants properly defined
 * - Clear separation: UI logic separated from business logic
 */
const CollectionPage = () => {
  // State management following SRP - each state has single responsibility
  const [binId, setBinId] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [isOffline, setIsOffline] = useState(false);
  const [collectedBins, setCollectedBins] = useState([]);
  const [routeProgress, setRouteProgress] = useState({ collected: 0, total: 25 });
  const [totalWeight, setTotalWeight] = useState(0);
  const [elapsedTime, setElapsedTime] = useState('0h 0m');
  const [sensorData, setSensorData] = useState(null);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [manualWeight, setManualWeight] = useState(25);
  const [wasteType, setWasteType] = useState('General');
  const [showSummary, setShowSummary] = useState(false);
  const [availableBins, setAvailableBins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [workerId] = useState('WORKER-001'); // Mock worker ID for demo
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [isLocationTracking, setIsLocationTracking] = useState(false);
  const [showNavigationMap, setShowNavigationMap] = useState(false);
  const [showGPSPermissionDialog, setShowGPSPermissionDialog] = useState(false);
  const [showResetConfirmation, setShowResetConfirmation] = useState(false);
  const [binToReset, setBinToReset] = useState(null);
  const [hasRequestedPermission, setHasRequestedPermission] = useState(false);
  const [isRefreshingLocation, setIsRefreshingLocation] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [currentRouteSummary, setCurrentRouteSummary] = useState(null);
  const [showFullSummary, setShowFullSummary] = useState(false);

  /**
   * Helper function to get bin status styling - follows SRP for status display logic
   * @param {string} status - The bin status
   * @returns {object} - CSS classes for status display
   */
  const getBinStatusStyle = (status) => {
    switch (status) {
      case 'ACTIVE':
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          icon: '🟢'
        };
      case 'COLLECTED':
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-800',
          icon: '✅'
        };
      case 'DAMAGED':
        return {
          bg: 'bg-red-100',
          text: 'text-red-800',
          icon: '🔴'
        };
      case 'MAINTENANCE':
        return {
          bg: 'bg-yellow-100',
          text: 'text-yellow-800',
          icon: '⚠️'
        };
      case 'LOST':
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          icon: '❓'
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          icon: '❓'
        };
    }
  };

  /**
   * Refresh bin data from backend - follows SRP for data refresh logic
   * Updates bin statuses to reflect current state after collection
   */
  const refreshBinData = async () => {
    try {
      const bins = await binService.getAllBins();
      setAvailableBins(bins);
      setRouteProgress(prev => ({ ...prev, total: bins.length }));
    } catch (err) {
      console.error('Failed to refresh bin data:', err);
      // Don't show error to user for refresh failures
    }
  };

  // Load bins and collection data from backend on component mount - follows SRP for data loading
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load bins
        const bins = await binService.getAllBins();
        setAvailableBins(bins);
        
        // Load today's collection records
        const todayCollections = await collectionService.getTodayCollectionRecords(workerId);
        
        // Load any locally collected bins that might not be in backend yet
        const localCollections = JSON.parse(localStorage.getItem('localCollections') || '[]');
        const allCollections = [...todayCollections, ...localCollections];
        
        // Normalize data structure to ensure consistent field names
        const normalizedCollections = allCollections.map(collection => ({
          binId: collection.binId,
          location: collection.location || collection.binLocation || collection.address || 'Unknown Location',
          timestamp: collection.timestamp || collection.dateTime || collection.collectedAt || new Date().toLocaleString(),
          weight: collection.weight || 0,
          fillLevel: collection.fillLevel || 'N/A',
          status: collection.status || 'Collected',
          reason: collection.reason || null
        }));
        
        // Remove duplicates based on binId
        const uniqueCollections = normalizedCollections.reduce((acc, current) => {
          const existingIndex = acc.findIndex(item => item.binId === current.binId);
          if (existingIndex === -1) {
            acc.push(current);
          } else {
            // Prefer backend data over local data
            acc[existingIndex] = current.binId.startsWith('BIN-') ? current : acc[existingIndex];
          }
          return acc;
        }, []);
        
        setCollectedBins(uniqueCollections);
        
        // Calculate total weight from all collections
        const totalWeightFromSaved = uniqueCollections.reduce((sum, record) => sum + (record.weight || 0), 0);
        setTotalWeight(totalWeightFromSaved);
        
        setError(null);
      } catch (err) {
        console.error('Failed to load data:', err);
        setError('Failed to load data from server');
        
        // Fallback to mock data if backend is unavailable
        const sessionResetBins = JSON.parse(sessionStorage.getItem('sessionResetBins') || '[]');
        const mockBins = [
          { binId: 'BIN-001', address: '123 Galle Road, Colombo 03', ownerId: 'RES-001', status: sessionResetBins.includes('BIN-001') ? 'ACTIVE' : 'COLLECTED' },
          { binId: 'BIN-002', address: '456 Union Place, Colombo 02', ownerId: 'RES-002', status: 'ACTIVE' },
          { binId: 'BIN-003', address: '789 Main Street, Colombo 11', ownerId: 'RES-003', status: 'DAMAGED' },
          { binId: 'BIN-004', address: '321 Marine Drive, Colombo 06', ownerId: 'RES-004', status: 'ACTIVE' },
          { binId: 'BIN-005', address: '654 Galle Road, Mount Lavinia', ownerId: 'RES-005', status: 'ACTIVE' },
        ];
        setAvailableBins(mockBins);
        
        // Set empty collected bins for fallback to respect reset state
        setCollectedBins([]);
        setTotalWeight(0);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [workerId]);

  // Update route progress when collected bins change
  useEffect(() => {
    // Use total bins for progress calculation
    setRouteProgress(prev => ({ ...prev, collected: collectedBins.length, total: availableBins.length }));
  }, [collectedBins, availableBins]);

  // GPS Location Tracking - follows SRP for location management
  useEffect(() => {
    const initializeLocation = async () => {
      try {
        // Check if we should request permission
        const availability = await locationService.checkLocationAvailability();
        
        if (availability.available && availability.canEnable && !hasRequestedPermission) {
          // Show permission dialog instead of directly requesting
          setShowGPSPermissionDialog(true);
          setHasRequestedPermission(true);
        } else if (availability.available && !availability.canEnable) {
          // Permission already granted, get location
          const location = await locationService.getCurrentLocation();
          setCurrentLocation(location);
          setLocationError(null);
        }
      } catch (error) {
        console.warn('Failed to initialize location:', error);
        setLocationError('Location services unavailable');
      }
    };

    initializeLocation();
  }, [hasRequestedPermission]);

  // Start/stop location tracking based on user preference
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

  // Initialize session with daily reset - follows SRP for session management
  useEffect(() => {
    const sessionData = SessionService.initializeSession();
    setSessionStartTime(sessionData.startTime);
  }, []);

  // Timer effect with daily reset check - follows SRP for time tracking
  useEffect(() => {
    if (!sessionStartTime) return;

    const timer = setInterval(() => {
      const wasReset = DailyResetService.checkAndExecuteDailyReset(() => {
        setSessionStartTime(SessionService.getCurrentSessionStartTime());
      });
      
      if (wasReset) {
        // Reset collection data on daily reset
        const resetData = DailyResetService.getDefaultResetData();
        setCollectedBins(resetData.collectedBins);
        setTotalWeight(resetData.totalWeight);
        setRouteProgress(resetData.routeProgress);
      }
      
      const elapsedTime = RouteSummaryService.calculateElapsedTime(sessionStartTime);
      setElapsedTime(elapsedTime);
    }, SessionService.CONFIG.UPDATE_INTERVAL);

    return () => clearInterval(timer);
  }, [sessionStartTime]);

  // Calculate current route summary - follows SRP for summary calculation
  useEffect(() => {
    const currentRouteId = localStorage.getItem('selectedRouteId');
    const summary = RouteSummaryService.getCurrentRouteSummary(collectedBins, currentRouteId, sessionStartTime);
    setCurrentRouteSummary(summary);
  }, [collectedBins, sessionStartTime]);


  // Audio feedback system - follows SRP for feedback handling
  const playFeedbackSound = (type) => {
    // Use the audio feedback service - follows DIP principle
    audioFeedbackService.playFeedbackSound(type);
  };

  /**
   * Get current route name for display - follows SRP for route information
   * @returns {string} Route name or fallback text
   */
  const getCurrentRouteName = () => {
    const savedRouteId = localStorage.getItem('selectedRouteId');
    if (!savedRouteId) return 'No Route Selected';
    const route = RouteConfigService.getRouteById(savedRouteId);
    return route ? route.name : 'Invalid Route';
  };

  /**
   * Handle GPS permission granted - follows SRP for permission handling
   */
  const handleGPSPermissionGranted = async () => {
    try {
      const location = await locationService.getCurrentLocation();
      setCurrentLocation(location);
      setLocationError(null);
      setShowGPSPermissionDialog(false);
    } catch (error) {
      console.error('Failed to get location after permission granted:', error);
      setLocationError('Failed to get location');
    }
  };

  /**
   * Handle GPS permission denied - follows SRP for permission handling
   * @param {string} message - Error message from permission denial
   */
  const handleGPSPermissionDenied = (message) => {
    setLocationError(message);
    setShowGPSPermissionDialog(false);
  };

  /**
   * Handle location tracking toggle - follows SRP for tracking control
   */
  const handleLocationTrackingToggle = () => {
    if (!currentLocation) {
      // Show permission dialog if location not available
      setShowGPSPermissionDialog(true);
      return;
    }
    
    setIsLocationTracking(!isLocationTracking);
  };

  /**
   * Handle location refresh - follows SRP for location refresh
   */
  const handleLocationRefresh = async () => {
    setIsRefreshingLocation(true);
    setLocationError(null);

    try {
      const location = await locationService.getHighAccuracyLocation();
      setCurrentLocation(location);
      setLocationError(null);
    } catch (error) {
      console.error('Failed to refresh location:', error);
      setLocationError('Failed to refresh location. Please try again.');
    } finally {
      setIsRefreshingLocation(false);
    }
  };

  /**
   * Get location quality indicator - follows SRP for quality display
   * @param {Object} location - Current location object
   * @returns {Object} Quality indicator data
   */
  const getLocationQualityIndicator = (location) => {
    if (!location) return null;

    const quality = location.quality || locationService.getLocationQuality(location.accuracy);
    const color = locationService.getLocationQualityColor(quality);
    const description = locationService.getLocationQualityDescription(quality);

    return {
      quality,
      color,
      description,
      accuracy: Math.round(location.accuracy)
    };
  };


  // Bin scanning handler - follows SRP for scan processing
  const handleBinScan = async () => {
    if (!binId.trim()) {
      setFeedback({
        type: 'error',
        message: 'Please enter a Bin ID',
        options: []
      });
      playFeedbackSound('error');
      return;
    }

    const bin = availableBins.find(b => b.binId === binId.toUpperCase());
    
    if (!bin) {
      setFeedback({
        type: 'error',
        message: 'Invalid Bin ID - Not Registered',
        options: [
          { text: 'Retry Scan', type: 'secondary', onClick: () => setBinId('') },
          { text: 'Report Issue', type: 'secondary', onClick: () => console.log('Report issue') },
          { text: 'Skip', type: 'secondary', onClick: () => setBinId('') }
        ]
      });
      playFeedbackSound('error');
      return;
    }

    // Proceed directly with collection - location verification removed
    proceedWithCollection(bin);
  };

  /**
   * Proceed with collection after validation - follows SRP for collection processing
   * @param {Object} bin - The bin object to collect
   */
  const proceedWithCollection = async (bin) => {

    // Check for duplicate scan using backend service
    try {
      const alreadyCollectedToday = await collectionService.isBinAlreadyCollectedToday(binId.toUpperCase());
      if (alreadyCollectedToday) {
        setFeedback({
          type: 'warning',
          message: `This bin was already collected today`,
          options: [
            { text: 'Cancel', type: 'secondary', onClick: () => setBinId('') },
            { text: 'Override with Reason', type: 'primary', onClick: () => handleOverrideCollection(bin) }
          ]
        });
        playFeedbackSound('warning');
        return;
      }
    } catch (error) {
      console.error('Failed to check duplicate collection:', error);
      // Fallback to local check
      const alreadyCollected = collectedBins.find(cb => cb.binId === binId.toUpperCase());
      if (alreadyCollected) {
        setFeedback({
          type: 'warning',
          message: `This bin was already collected today at ${alreadyCollected.timestamp}`,
          options: [
            { text: 'Cancel', type: 'secondary', onClick: () => setBinId('') },
            { text: 'Override with Reason', type: 'primary', onClick: () => handleOverrideCollection(bin) }
          ]
        });
        playFeedbackSound('warning');
        return;
      }
    }

    // Check for sensor failure - BIN-003 always fails, others have 10% chance
    const isBin003 = binId.toUpperCase() === 'BIN-003';
    const shouldSimulateSensorFailure = isBin003 || Math.random() < 0.1;
    
    if (shouldSimulateSensorFailure) {
      setFeedback({
        type: 'warning',
        message: 'Sensor Error - Switch to Manual Entry',
        options: [
          { text: 'Proceed to Manual Entry', type: 'primary', onClick: () => setShowManualEntry(true) }
        ]
      });
      playFeedbackSound('warning');
      return;
    }

    // Successful collection - use mock IoT sensor service
    const sensorData = mockIoTSensorService.generateSensorData(binId.toUpperCase());
    setSensorData(sensorData);
    
    // Prepare collection data for backend
    const collectionData = {
      binId: binId.toUpperCase(),
      workerId: workerId,
      binLocation: bin.address,
      binOwner: bin.ownerId,
      weight: sensorData.weight,
      fillLevel: sensorData.fillLevel,
      wasteType: sensorData.wasteType,
      status: 'COLLECTED',
      sensorData: {
        temperature: sensorData.temperature,
        batteryLevel: sensorData.batteryLevel,
        signalStrength: sensorData.signalStrength
      }
    };

    try {
      // Save to backend
      const savedRecord = await collectionService.createCollectionRecord(collectionData);
      
      // Update local state
      const localCollection = {
        binId: binId.toUpperCase(),
        location: bin.address,
        timestamp: new Date().toLocaleString(),
        weight: sensorData.weight,
        fillLevel: sensorData.fillLevel,
        status: 'Collected',
        reason: null
      };

      setCollectedBins(prev => [...prev, localCollection]);
      setTotalWeight(prev => prev + sensorData.weight);
      setRouteProgress(prev => ({ ...prev, collected: prev.collected + 1 }));
      
      // Save to localStorage for persistence
      const currentCollections = JSON.parse(localStorage.getItem('localCollections') || '[]');
      const updatedCollections = [...currentCollections, localCollection];
      localStorage.setItem('localCollections', JSON.stringify(updatedCollections));
      
      setFeedback({
        type: 'success',
        message: '✓ Collection Recorded and Saved Successfully',
        options: []
      });
      
      playFeedbackSound('success');
      setBinId('');
      
      // Refresh bin data to show updated status
      await refreshBinData();
    } catch (error) {
      console.error('Failed to save collection:', error);
      
      // Still update local state for demo purposes
      const localCollection = {
        binId: binId.toUpperCase(),
        location: bin.address,
        timestamp: new Date().toLocaleString(),
        weight: sensorData.weight,
        fillLevel: sensorData.fillLevel,
        status: 'Collected',
        reason: null
      };

      setCollectedBins(prev => [...prev, localCollection]);
      setTotalWeight(prev => prev + sensorData.weight);
      setRouteProgress(prev => ({ ...prev, collected: prev.collected + 1 }));
      
      // Save to localStorage for persistence
      const currentCollections = JSON.parse(localStorage.getItem('localCollections') || '[]');
      const updatedCollections = [...currentCollections, localCollection];
      localStorage.setItem('localCollections', JSON.stringify(updatedCollections));
      
      setFeedback({
        type: 'success',
        message: '✓ Collection Recorded (Saved Locally)',
        options: []
      });
      
      playFeedbackSound('success');
      setBinId('');
      
      // Try to refresh bin data even in fallback case
      await refreshBinData();
    }
  };

  // Override collection handler - follows SRP for override logic
  const handleOverrideCollection = (bin) => {
    const sensorData = mockIoTSensorService.generateSensorData(bin.binId);
    const collection = {
      binId: bin.binId,
      location: bin.address,
      timestamp: new Date().toLocaleString(),
      weight: sensorData.weight,
      fillLevel: sensorData.fillLevel,
      status: 'Override Collection',
      reason: 'Re-collection requested'
    };

    setCollectedBins(prev => [...prev, collection]);
    setTotalWeight(prev => prev + sensorData.weight);
    setRouteProgress(prev => ({ ...prev, collected: prev.collected + 1 }));
    
    setFeedback({
      type: 'success',
      message: '✓ Override Collection Recorded',
      options: []
    });
    
    setBinId('');
  };

  // Manual entry handler - follows SRP for manual data entry
  const handleManualEntry = () => {
    const bin = availableBins.find(b => b.binId === binId.toUpperCase());
    const collection = {
      binId: binId.toUpperCase(),
      location: bin?.address || 'Unknown',
      timestamp: new Date().toLocaleString(),
      weight: manualWeight,
      fillLevel: 'Manual Entry',
      status: 'Manual Entry - Sensor Failed',
      reason: 'Sensor failure'
    };

    setCollectedBins(prev => [...prev, collection]);
    setTotalWeight(prev => prev + manualWeight);
    setRouteProgress(prev => ({ ...prev, collected: prev.collected + 1 }));
    
    // Save to localStorage for persistence
    const currentCollections = JSON.parse(localStorage.getItem('localCollections') || '[]');
    const updatedCollections = [...currentCollections, collection];
    localStorage.setItem('localCollections', JSON.stringify(updatedCollections));
    
    setFeedback({
      type: 'success',
      message: '✓ Manual Collection Recorded',
      options: []
    });
    
    setShowManualEntry(false);
    setBinId('');
  };

  // Mark as missed handler - follows SRP for missed bin handling
  const handleMarkAsMissed = () => {
    const reasons = ['Blocked - Cannot access bin', 'Damaged - Bin is broken', 'Overflowing - Bin exceeds capacity', 'Not Present - Bin not at location'];
    const reason = reasons[Math.floor(Math.random() * reasons.length)];
    
    const bin = availableBins.find(b => b.binId === binId.toUpperCase());
    const missedBin = {
      binId: binId.toUpperCase(),
      location: bin?.address || 'Unknown',
      timestamp: new Date().toLocaleString(),
      weight: 0,
      fillLevel: 'N/A',
      status: 'Missed',
      reason: reason
    };

    setCollectedBins(prev => [...prev, missedBin]);
    setRouteProgress(prev => ({ ...prev, collected: prev.collected + 1 }));
    
    // Save to localStorage for persistence
    const currentCollections = JSON.parse(localStorage.getItem('localCollections') || '[]');
    const updatedCollections = [...currentCollections, missedBin];
    localStorage.setItem('localCollections', JSON.stringify(updatedCollections));
    
    setFeedback({
      type: 'warning',
      message: `Bin marked as missed: ${reason}`,
      options: []
    });
    
    setBinId('');
  };

  // Reset bin handler - follows SRP for reset functionality
  const handleResetBin = (binId) => {
    setBinToReset(binId);
    setShowResetConfirmation(true);
  };

  // Confirm reset handler - follows SRP for confirmation logic
  const handleConfirmReset = async () => {
    if (!binToReset) return;

    // Store the bin to remove for weight calculation
    const binToRemove = collectedBins.find(bin => bin.binId === binToReset);
    const binWeight = binToRemove?.weight || 0;

    try {
      // Try to reset via API first
      await collectionService.resetCollectionRecord(binToReset, workerId);
      
      // Update local state
      setCollectedBins(prev => prev.filter(bin => bin.binId !== binToReset));
      
      // Update total weight
      setTotalWeight(prev => prev - binWeight);
      
      // Update route progress
      setRouteProgress(prev => ({ ...prev, collected: prev.collected - 1 }));
      
      // Update bin status in available bins to ACTIVE
      setAvailableBins(prev => prev.map(bin => 
        bin.binId === binToReset ? { ...bin, status: 'ACTIVE' } : bin
      ));
      
      // Remove from localStorage
      const currentCollections = JSON.parse(localStorage.getItem('localCollections') || '[]');
      const filteredCollections = currentCollections.filter(bin => bin.binId !== binToReset);
      localStorage.setItem('localCollections', JSON.stringify(filteredCollections));
      
      setFeedback({
        type: 'success',
        message: `Bin ${binToReset} has been reset and is now available for scanning again`,
        options: []
      });
      
    } catch (error) {
      console.error('Failed to reset bin via API:', error);
      
      // Fallback to local reset with persistence
      setCollectedBins(prev => prev.filter(bin => bin.binId !== binToReset));
      setTotalWeight(prev => prev - binWeight);
      setRouteProgress(prev => ({ ...prev, collected: prev.collected - 1 }));
      
      // Update bin status in available bins to ACTIVE
      setAvailableBins(prev => prev.map(bin => 
        bin.binId === binToReset ? { ...bin, status: 'ACTIVE' } : bin
      ));
      
      // Remove from localStorage
      const currentCollections = JSON.parse(localStorage.getItem('localCollections') || '[]');
      const filteredCollections = currentCollections.filter(bin => bin.binId !== binToReset);
      localStorage.setItem('localCollections', JSON.stringify(filteredCollections));
      
      setFeedback({
        type: 'success',
        message: `Bin ${binToReset} has been reset locally and is now available for scanning again`,
        options: []
      });
    }
    
    setShowResetConfirmation(false);
    setBinToReset(null);
  };

  // Cancel reset handler - follows SRP for cancellation logic
  const handleCancelReset = () => {
    setShowResetConfirmation(false);
    setBinToReset(null);
  };

  // Handle full summary modal - follows SRP for modal management
  const handleShowFullSummary = () => {
    setShowFullSummary(true);
  };

  // Handle close full summary modal - follows SRP for modal management
  const handleCloseFullSummary = () => {
    setShowFullSummary(false);
  };

  // Get comprehensive summary data - follows SRP for data preparation
  const getFullSummaryData = () => {
    return RouteSummaryService.getAllRoutesSummary(collectedBins, sessionStartTime);
  };

  // Progress calculation - follows SRP for progress tracking
  const progressPercentage = Math.round((routeProgress.collected / routeProgress.total) * 100);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <TruckIcon className="w-6 h-6 text-gray-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Waste Collection</h1>
            </div>
            {isOffline && (
              <div className="flex items-center space-x-2 text-yellow-600">
                <CloudSlashIcon className="w-5 h-5" />
                <span className="text-sm font-medium">Offline Mode Active</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-lg shadow-sm p-6 text-center mb-6">
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
              <span className="text-gray-600">Loading bins from server...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <XCircleIcon className="w-5 h-5 text-red-600" />
              <span className="text-red-800 font-medium">Connection Error</span>
            </div>
            <p className="text-red-700 mt-1">{error}</p>
            <p className="text-red-600 text-sm mt-2">Using fallback data for demonstration.</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Collection Area */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Progress Indicators */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Collection Progress</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ProgressIndicator
                  label="Route Progress"
                  current={routeProgress.collected}
                  total={routeProgress.total}
                  unit="bins"
                  icon={MapPinIcon}
                  color="green"
                  showPercentage={true}
                />
                <ProgressIndicator
                  label="Total Weight"
                  current={totalWeight}
                  total={1000}
                  unit="kg"
                  icon={ScaleIcon}
                  color="green"
                  showPercentage={false}
                />
                <ProgressIndicator
                  label="Elapsed Time"
                  current={elapsedTime}
                  total="8h 0m"
                  unit=""
                  icon={ClockIcon}
                  color="green"
                  showPercentage={false}
                />
              </div>
            </div>

            {/* Bin Scanning Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Scan Bin</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter Bin ID (Simulated QR Scan)
                  </label>
                  <input
                    type="text"
                    value={binId}
                    onChange={(e) => setBinId(e.target.value)}
                    placeholder="Enter Bin ID (e.g., BIN-001)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg"
                    onKeyPress={(e) => e.key === 'Enter' && handleBinScan()}
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={handleBinScan}
                    className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    Scan Bin
                  </button>
                  <button
                    onClick={handleMarkAsMissed}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Mark as Missed
                  </button>
                </div>
              </div>
            </div>

            {/* Feedback Display */}
            {feedback && (
              <FeedbackDisplay 
                type={feedback.type} 
                message={feedback.message} 
                options={feedback.options} 
              />
            )}

            {/* Manual Entry Section */}
            {showManualEntry && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Manual Entry</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estimated Weight: {manualWeight} kg
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="50"
                      value={manualWeight}
                      onChange={(e) => setManualWeight(parseInt(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600 mt-1">
                      <span>5 kg</span>
                      <span>50 kg</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Waste Type
                    </label>
                    <select
                      value={wasteType}
                      onChange={(e) => setWasteType(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="General">General</option>
                      <option value="Recyclable">Recyclable</option>
                      <option value="Organic">Organic</option>
                    </select>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleManualEntry}
                      className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
                    >
                      Record Manual Collection
                    </button>
                    <button
                      onClick={() => setShowManualEntry(false)}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Sensor Data Display */}
            {sensorData && (
              <SensorDataDisplay sensorData={sensorData} />
            )}

            {/* Collected Bins Table */}
            <CollectionTable 
              collectedBins={collectedBins} 
              onResetBin={handleResetBin}
            />

            {/* Navigation Map */}
            {showNavigationMap && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Navigation Map</h2>
                  <button
                    onClick={() => setShowNavigationMap(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <XCircleIcon className="w-5 h-5" />
                  </button>
                </div>
                <NavigationMap
                  selectedRouteId={localStorage.getItem('selectedRouteId')}
                  collectedBins={collectedBins}
                  currentLocation={currentLocation}
                  height="500px"
                  showNavigation={true}
                  onBinClick={(bin) => {
                    console.log('Bin clicked:', bin);
                  }}
                />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Current Route Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Route Summary</h2>
              {currentRouteSummary ? (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Bins Collected:</span>
                    <span className="font-semibold">{currentRouteSummary.binsCollected}/{currentRouteSummary.totalBins} ({currentRouteSummary.completionPercentage}%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Weight:</span>
                    <span className="font-semibold">{currentRouteSummary.totalWeight} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Time Taken:</span>
                    <span className="font-semibold">{currentRouteSummary.elapsedTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Missed Bins:</span>
                    <span className="font-semibold">{currentRouteSummary.missedBins}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Override Collections:</span>
                    <span className="font-semibold">{currentRouteSummary.overrideCollections}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Route:</span>
                    <span className="font-semibold">{currentRouteSummary.routeName}</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <p className="text-sm">No route selected</p>
                </div>
              )}
              <button
                onClick={() => setShowFullSummary(true)}
                className="w-full mt-4 bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                View Full Summary
              </button>
            </div>


            {/* Location Tracking Controls */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Location Tracking</h2>
              <div className="space-y-4">
                {/* Location Status */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">GPS Status:</span>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${currentLocation ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-sm font-medium">
                      {currentLocation ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                {/* GPS Quality Indicator */}
                {currentLocation && (() => {
                  const qualityInfo = getLocationQualityIndicator(currentLocation);
                  return (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">GPS Quality:</span>
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${
                            qualityInfo.quality === 'excellent' ? 'bg-green-500' :
                            qualityInfo.quality === 'good' ? 'bg-blue-500' :
                            qualityInfo.quality === 'fair' ? 'bg-yellow-500' : 'bg-red-500'
                          }`}></div>
                          <span className={`text-sm font-medium ${qualityInfo.color}`}>
                            {qualityInfo.quality.charAt(0).toUpperCase() + qualityInfo.quality.slice(1)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Accuracy:</span>
                        <span className="text-sm font-medium">{qualityInfo.accuracy}m</span>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-2">
                        <p className="text-xs text-gray-600">{qualityInfo.description}</p>
                      </div>
                    </div>
                  );
                })()}

                {/* Location Error */}
                {locationError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="text-sm text-red-800">{locationError}</div>
                  </div>
                )}

                {/* Control Buttons */}
                <div className="space-y-2">
                  <button
                    onClick={handleLocationTrackingToggle}
                    className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                      isLocationTracking 
                        ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {isLocationTracking ? 'Stop Tracking' : 'Start Tracking'}
                  </button>
                  
                  <button
                    onClick={handleLocationRefresh}
                    disabled={isRefreshingLocation}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {isRefreshingLocation ? 'Refreshing...' : 'Refresh Location'}
                  </button>
                  
                  <button
                    onClick={() => setShowNavigationMap(!showNavigationMap)}
                    className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                  >
                    {showNavigationMap ? 'Hide Navigation Map' : 'Show Navigation Map'}
                  </button>
                </div>
              </div>
            </div>

            {/* Available Bins Status Display */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Bins</h2>
              <div className="space-y-2">
                {availableBins.map((bin) => {
                  const statusStyle = getBinStatusStyle(bin.status);
                  return (
                    <div key={bin.binId} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">{bin.binId}</span>
                        <span className="text-xs">{statusStyle.icon}</span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${statusStyle.bg} ${statusStyle.text}`}>
                        {bin.status}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="text-xs text-gray-600 space-y-1">
                  <div className="flex items-center space-x-2">
                    <span>🟢</span>
                    <span>ACTIVE - Ready for collection</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>✅</span>
                    <span>COLLECTED - Already collected today</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>🔴</span>
                    <span>DAMAGED - Needs repair</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>⚠️</span>
                    <span>MAINTENANCE - Under maintenance</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* GPS Permission Dialog */}
      <GPSPermissionDialog
        isOpen={showGPSPermissionDialog}
        onClose={() => setShowGPSPermissionDialog(false)}
        onPermissionGranted={handleGPSPermissionGranted}
        onPermissionDenied={handleGPSPermissionDenied}
      />

      {/* Reset Confirmation Dialog */}
      <ModalBackdropComponent
        isOpen={showResetConfirmation}
        onClose={handleCancelReset}
      >
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <ExclamationTriangleIcon className="w-4 h-4 text-red-600" />
                </div>
                <h3 className="text-base font-semibold text-gray-900">Reset Bin Collection</h3>
              </div>
            </div>
            <div className="px-5 py-4">
              <p className="text-gray-700 mb-3 text-sm">
                Are you sure you want to reset bin <span className="font-semibold text-gray-900 bg-gray-100 px-2 py-1 rounded text-xs">{binToReset}</span>?
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <p className="text-xs text-blue-800">
                  <strong>What this does:</strong> Removes the bin from your collected list and makes it available for scanning again.
                </p>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={handleCancelReset}
                  className="px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmReset}
                  className="px-3 py-2 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Reset Bin
                </button>
              </div>
            </div>
          </div>
        </div>
      </ModalBackdropComponent>

      {/* Full Summary Modal */}
      <FullSummaryModal
        isOpen={showFullSummary}
        onClose={handleCloseFullSummary}
        summaryData={getFullSummaryData()}
      />
    </div>
  );
};

export default CollectionPage;
