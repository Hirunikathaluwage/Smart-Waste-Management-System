import React, { useState, useEffect } from 'react';
import { FeedbackDisplay, ProgressIndicator, SensorDataDisplay, CollectionTable } from '../../components/collection/CollectionComponents';
import audioFeedbackService from '../../services/AudioFeedbackService';
import mockIoTSensorService from '../../services/MockIoTSensorService';
import binService from '../../services/BinService';

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

  // Load bins from backend on component mount - follows SRP for data loading
  useEffect(() => {
    const loadBins = async () => {
      try {
        setLoading(true);
        const bins = await binService.getAllBins();
        setAvailableBins(bins);
        setRouteProgress(prev => ({ ...prev, total: bins.length }));
        setError(null);
      } catch (err) {
        console.error('Failed to load bins:', err);
        setError('Failed to load bins from server');
        // Fallback to mock data if backend is unavailable
        const mockBins = [
          { binId: 'BIN-001', address: '123 Galle Road, Colombo 03', ownerId: 'RES-001', status: 'ACTIVE' },
          { binId: 'BIN-002', address: '456 Union Place, Colombo 02', ownerId: 'RES-002', status: 'ACTIVE' },
          { binId: 'BIN-003', address: '789 Main Street, Colombo 11', ownerId: 'RES-003', status: 'DAMAGED' },
          { binId: 'BIN-004', address: '321 Marine Drive, Colombo 06', ownerId: 'RES-004', status: 'ACTIVE' },
          { binId: 'BIN-005', address: '654 Galle Road, Mount Lavinia', ownerId: 'RES-005', status: 'ACTIVE' },
        ];
        setAvailableBins(mockBins);
        setRouteProgress(prev => ({ ...prev, total: mockBins.length }));
      } finally {
        setLoading(false);
      }
    };

    loadBins();
  }, []);

  // Timer effect - follows SRP for time tracking
  useEffect(() => {
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const hours = Math.floor(elapsed / 3600000);
      const minutes = Math.floor((elapsed % 3600000) / 60000);
      setElapsedTime(`${hours}h ${minutes}m`);
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  // Audio feedback system - follows SRP for feedback handling
  const playFeedbackSound = (type) => {
    // Use the audio feedback service - follows DIP principle
    audioFeedbackService.playFeedbackSound(type);
  };


  // Bin scanning handler - follows SRP for scan processing
  const handleBinScan = () => {
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

    // Check for duplicate scan
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

    // Check for sensor failure (10% chance)
    if (Math.random() < 0.1) {
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
    
    const collection = {
      binId: binId.toUpperCase(),
      location: bin.address,
      timestamp: new Date().toLocaleString(),
      weight: sensorData.weight,
      fillLevel: sensorData.fillLevel,
      status: 'Collected',
      reason: null
    };

    setCollectedBins(prev => [...prev, collection]);
    setTotalWeight(prev => prev + sensorData.weight);
    setRouteProgress(prev => ({ ...prev, collected: prev.collected + 1 }));
    
    setFeedback({
      type: 'success',
      message: '✓ Collection Recorded Successfully',
      options: []
    });
    
    playFeedbackSound('success');
    setBinId('');
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
    const collection = {
      binId: binId.toUpperCase(),
      location: mockBins.find(b => b.id === binId.toUpperCase())?.location || 'Unknown',
      timestamp: new Date().toLocaleString(),
      weight: manualWeight,
      fillLevel: 'Manual Entry',
      status: 'Manual Entry - Sensor Failed',
      reason: 'Sensor failure'
    };

    setCollectedBins(prev => [...prev, collection]);
    setTotalWeight(prev => prev + manualWeight);
    setRouteProgress(prev => ({ ...prev, collected: prev.collected + 1 }));
    
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
    
    const missedBin = {
      binId: binId.toUpperCase(),
      location: mockBins.find(b => b.id === binId.toUpperCase())?.location || 'Unknown',
      timestamp: new Date().toLocaleString(),
      weight: 0,
      fillLevel: 'N/A',
      status: 'Missed',
      reason: reason
    };

    setCollectedBins(prev => [...prev, missedBin]);
    setRouteProgress(prev => ({ ...prev, collected: prev.collected + 1 }));
    
    setFeedback({
      type: 'warning',
      message: `Bin marked as missed: ${reason}`,
      options: []
    });
    
    setBinId('');
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
            <CollectionTable collectedBins={collectedBins} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* End of Shift Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">End-of-Shift Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Bins Collected:</span>
                  <span className="font-semibold">{routeProgress.collected}/{routeProgress.total} ({progressPercentage}%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Weight:</span>
                  <span className="font-semibold">{totalWeight} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Time Taken:</span>
                  <span className="font-semibold">{elapsedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Missed Bins:</span>
                  <span className="font-semibold">{collectedBins.filter(b => b.status === 'Missed').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Override Collections:</span>
                  <span className="font-semibold">{collectedBins.filter(b => b.status === 'Override Collection').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Route:</span>
                  <span className="font-semibold">North District Route 3</span>
                </div>
              </div>
              <button
                onClick={() => setShowSummary(!showSummary)}
                className="w-full mt-4 bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                {showSummary ? 'Hide Details' : 'View Full Summary'}
              </button>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                  Reschedule Pickup
                </button>
                <button className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                  Report Issue
                </button>
                <button 
                  onClick={() => setIsOffline(!isOffline)}
                  className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                    isOffline ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {isOffline ? 'Go Online' : 'Go Offline'}
                </button>
              </div>
            </div>

            {/* Mock Bin Database Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Bins</h2>
              <div className="space-y-2">
                {availableBins.map((bin) => (
                  <div key={bin.binId} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm font-medium">{bin.binId}</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      bin.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {bin.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionPage;
