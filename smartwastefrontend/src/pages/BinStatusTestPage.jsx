import React, { useState, useEffect } from 'react';
import { 
  Trash2, 
  Battery, 
  Signal, 
  Thermometer, 
  Gauge,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Plus,
  ShoppingCart,
  MapPin
} from 'lucide-react';
import BinBagRequestModal from '../components/BinBagRequestModal';
import binSimulationService from '../services/BinSimulationService';
import FoolproofMap from '../components/FoolproofMap';


/**
 * Simple Bin Status Test Page
 */
const BinStatusTestPage = () => {
  const [binsData, setBinsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [statistics, setStatistics] = useState({});
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestType, setRequestType] = useState('bin'); // 'bin' or 'bag'
  const [notification, setNotification] = useState(null);

  // Load real bins from database
  useEffect(() => {
    const loadRealBins = async () => {
      try {
        console.log('Loading real bins from database...');
        setLoading(true);
        
        const userId = 'RES-001'; // Use your existing ownerId format
        
        // Fetch bins from the existing Bin entity API
        const response = await fetch(`http://localhost:8080/api/bins/owner/${userId}`);
        
        if (response.ok) {
          const binsData = await response.json();
          console.log('✅ Loaded real bins from database:', binsData);
          
          // Convert database bins to simulation format
          const convertedBins = binsData.map(bin => ({
            binId: bin.binId,
            ownerId: bin.ownerId,
            wasteType: bin.tag?.type || 'General',
            location: bin.address || 'Unknown Location',
            fillLevel: Math.floor(Math.random() * 100), // Random fill level for demo
            weight: Math.floor(Math.random() * 50) + 10, // Random weight
            temperature: Math.floor(Math.random() * 10) + 20, // Random temperature
            battery: Math.floor(Math.random() * 30) + 70, // Random battery
            humidity: Math.floor(Math.random() * 20) + 40, // Random humidity
            pressure: Math.floor(Math.random() * 5) + 1013, // Random pressure
            lastUpdated: new Date().toISOString(),
            status: bin.status || 'ACTIVE'
          }));
          
          setBinsData(convertedBins);
          
          // Calculate statistics
          const stats = {
            totalBins: convertedBins.length,
            activeBins: convertedBins.filter(bin => bin.status === 'ACTIVE').length,
            fullBins: convertedBins.filter(bin => bin.fillLevel > 80).length,
            lowBatteryBins: convertedBins.filter(bin => bin.battery < 20).length,
            averageFillLevel: Math.round(convertedBins.reduce((sum, bin) => sum + bin.fillLevel, 0) / convertedBins.length) || 0
          };
          
          setStatistics(stats);
          setLastUpdated(new Date());
          
        } else {
          console.warn('⚠️ Failed to load bins from database, using simulation');
          // Fallback to simulation if database fails
          binSimulationService.initializeUserBins(userId);
          const bins = binSimulationService.getUserBins(userId);
          const stats = binSimulationService.getUserStats(userId);
          
          setBinsData(bins);
          setStatistics(stats);
          setLastUpdated(new Date());
          
          // Subscribe to simulation updates
          const unsubscribe = binSimulationService.subscribe((allBins) => {
            const userBins = allBins.filter(bin => bin.ownerId === userId);
            const userStats = binSimulationService.getUserStats(userId);
            setBinsData(userBins);
            setStatistics(userStats);
            setLastUpdated(new Date());
          });
          
          binSimulationService.startUpdates(5000);
          
          return () => {
            unsubscribe();
            binSimulationService.stopUpdates();
          };
        }
        
      } catch (error) {
        console.error('❌ Error loading bins:', error);
        // Use empty state if there's an error
        setBinsData([]);
        setStatistics({
          totalBins: 0,
          activeBins: 0,
          fullBins: 0,
          lowBatteryBins: 0,
          averageFillLevel: 0
        });
      } finally {
        setLoading(false);
      }
    };

    loadRealBins();
  }, []);

  const getFillLevelColor = (fillLevel) => {
    if (fillLevel >= 90) return 'text-red-600 bg-red-100';
    if (fillLevel >= 70) return 'text-yellow-600 bg-yellow-100';
    if (fillLevel >= 50) return 'text-blue-600 bg-blue-100';
    return 'text-green-600 bg-green-100';
  };

  const getBatteryColor = (batteryLevel) => {
    if (batteryLevel < 20) return 'text-red-600 bg-red-100';
    if (batteryLevel < 50) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  const getSignalColor = (signalStrength) => {
    switch (signalStrength) {
      case 'Excellent': return 'text-green-600 bg-green-100';
      case 'Good': return 'text-blue-600 bg-blue-100';
      case 'Fair': return 'text-yellow-600 bg-yellow-100';
      case 'Poor': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ACTIVE': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'OVERFLOWING': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <CheckCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const renderBinCard = (bin) => (
    <div key={bin.binId} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          {getStatusIcon(bin.status)}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{bin.binId}</h3>
            <p className="text-sm text-gray-600">{bin.wasteType} • {bin.location}</p>
          </div>
        </div>
        <button
          onClick={() => {
            binSimulationService.updateAllBins();
          }}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <Gauge className="w-4 h-4 text-blue-500" />
          <div>
            <p className="text-xs text-gray-500">Fill Level</p>
            <p className={`text-sm font-medium ${getFillLevelColor(bin.fillLevel)} px-2 py-1 rounded`}>
              {bin.fillLevel}%
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Battery className="w-4 h-4 text-green-500" />
          <div>
            <p className="text-xs text-gray-500">Battery</p>
            <p className={`text-sm font-medium ${getBatteryColor(bin.batteryLevel)} px-2 py-1 rounded`}>
              {bin.batteryLevel}%
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Signal className="w-4 h-4 text-purple-500" />
          <div>
            <p className="text-xs text-gray-500">Signal</p>
            <p className={`text-sm font-medium ${getSignalColor(bin.signalStrength)} px-2 py-1 rounded`}>
              {bin.signalStrength}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Thermometer className="w-4 h-4 text-red-500" />
          <div>
            <p className="text-xs text-gray-500">Temperature</p>
            <p className="text-sm font-medium text-gray-900">{bin.temperature}°C</p>
          </div>
        </div>
      </div>

      {bin.alerts && bin.alerts.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Alerts</h4>
          <div className="space-y-1">
            {bin.alerts.map((alert, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm">
                <span>{alert.icon}</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  alert.severity === 'high' ? 'bg-red-100 text-red-700' :
                  alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {alert.message}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between items-center text-xs text-gray-500">
        <span>Last updated: {new Date(bin.lastUpdated).toLocaleTimeString()}</span>
        <span>{bin.location}</span>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading bin simulation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-pulse">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5" />
            <span>{notification.message}</span>
            <button
              onClick={() => setNotification(null)}
              className="ml-2 text-white hover:text-gray-200"
            >
              ×
            </button>
          </div>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Bin Status Simulation</h1>
          <p className="text-gray-600 mt-2">Real-time IoT sensor data simulation</p>
          <div className="flex items-center space-x-2 text-sm text-gray-500 mt-2">
            <RefreshCw className="w-4 h-4" />
            <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Trash2 className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Bins</p>
                <p className="text-2xl font-semibold text-gray-900">{statistics.totalBins}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Bins</p>
                <p className="text-2xl font-semibold text-gray-900">{statistics.activeBins}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Overflowing</p>
                <p className="text-2xl font-semibold text-gray-900">{statistics.overflowingBins}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Battery className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Low Battery</p>
                <p className="text-2xl font-semibold text-gray-900">{statistics.lowBatteryBins}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bin Locations Map */}
        <div className="mb-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-blue-500" />
            Bin Locations Map
          </h2>
          <div className="h-96 rounded-lg overflow-hidden">
            <FoolproofMap />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            💡 This map shows the locations of your bins. Click on the map above when requesting new bins to select the exact delivery location.
          </p>
        </div>

        {/* Bin Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {binsData.map(renderBinCard)}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => {
                setRequestType('bin');
                setShowRequestModal(true);
              }}
              className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <Plus className="w-5 h-5 text-blue-500" />
              <span className="text-gray-700 font-medium">Request New Bin</span>
            </button>
            <button
              onClick={() => {
                setRequestType('bag');
                setShowRequestModal(true);
              }}
              className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
            >
              <ShoppingCart className="w-5 h-5 text-green-500" />
              <span className="text-gray-700 font-medium">Request Bags</span>
            </button>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
            >
              <RefreshCw className="w-5 h-5 text-purple-500" />
              <span className="text-gray-700 font-medium">Refresh Data</span>
            </button>
            
            {/* Debug Button - Remove in production */}
            <button
              onClick={() => {
                const userId = 'demo-resident-user';
                binSimulationService.addNewBin(userId, 'Test Bin', 'Test Location');
                console.log('Debug: Added test bin');
              }}
              className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors"
            >
              <Plus className="w-5 h-5 text-orange-500" />
              <span className="text-gray-700 font-medium">Test Add Bin</span>
            </button>
          </div>
        </div>

        {/* Debug Info */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Debug Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Statistics</h3>
              <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
                {JSON.stringify(statistics, null, 2)}
              </pre>
            </div>
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Bin Data</h3>
              <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">
                {JSON.stringify(binsData, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bin/Bag Request Modal */}
      <BinBagRequestModal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        userRole="RESIDENT"
        initialRequestType={requestType}
        onBinAdded={(quantity, type) => {
          console.log(`🎉 Bin added callback: ${quantity} ${type}(s)`);
          setNotification({
            type: 'success',
            message: `🎉 ${quantity} new ${type} bin(s) added to your dashboard!`,
            timestamp: new Date()
          });
          
          // Auto-hide notification after 5 seconds
          setTimeout(() => setNotification(null), 5000);
        }}
      />
    </div>
  );
};

export default BinStatusTestPage;
