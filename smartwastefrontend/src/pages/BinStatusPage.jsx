import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ResidentDashboardLayout from '../components/dashboard/ResidentDashboardLayout';
import BusinessDashboardLayout from '../components/dashboard/BusinessDashboardLayout';
import BinBagRequestModal from '../components/BinBagRequestModal';
import { 
  Trash2, 
  Battery, 
  Signal, 
  Thermometer, 
  Droplets, 
  Gauge,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  RefreshCw,
  Plus,
  ShoppingCart
} from 'lucide-react';

/**
 * Simple Bin Simulation Service
 * Generates realistic bin fill data with natural patterns
 */
class BinSimulationService {
  constructor() {
    this.bins = new Map();
    this.updateInterval = null;
    this.subscribers = new Set();
  }

  // Generate realistic bin data
  generateBinData(binId, ownerId, wasteType, location) {
    const now = new Date();
    
    // Natural fill level progression (bins fill up over time)
    const baseFill = Math.random() * 30 + 20; // Start between 20-50%
    const timeFactor = (now.getHours() / 24) * 20; // Fill more during day
    const fillLevel = Math.min(95, baseFill + timeFactor + Math.random() * 10);
    
    // Battery decreases over time but stays reasonable
    const batteryLevel = Math.max(15, 100 - (Math.random() * 30));
    
    // Temperature varies with time of day
    const hour = now.getHours();
    const baseTemp = 20 + (hour > 6 && hour < 18 ? 8 : 0); // Warmer during day
    const temperature = baseTemp + Math.random() * 4;
    
    // Signal strength (mostly good)
    const signalLevels = ['Excellent', 'Good', 'Fair', 'Poor'];
    const signalStrength = signalLevels[Math.random() < 0.8 ? 0 : Math.floor(Math.random() * 4)];
    
    return {
      binId,
      ownerId,
      wasteType,
      location,
      fillLevel: Math.round(fillLevel),
      batteryLevel: Math.round(batteryLevel),
      temperature: Math.round(temperature * 10) / 10,
      humidity: Math.round(40 + Math.random() * 30),
      pressure: Math.round(1010 + Math.random() * 20),
      signalStrength,
      status: fillLevel > 90 ? 'OVERFLOWING' : 'ACTIVE',
      lastUpdated: now.toISOString(),
      alerts: this.generateAlerts(fillLevel, batteryLevel, signalStrength)
    };
  }

  generateAlerts(fillLevel, batteryLevel, signalStrength) {
    const alerts = [];
    
    if (fillLevel > 90) {
      alerts.push({
        type: 'overflow',
        message: `Bin is overflowing (${fillLevel}%)`,
        severity: 'high',
        icon: '⚠️'
      });
    }
    
    if (batteryLevel < 20) {
      alerts.push({
        type: 'low_battery',
        message: `Low battery (${batteryLevel}%)`,
        severity: 'medium',
        icon: '🔋'
      });
    }
    
    if (signalStrength === 'Poor') {
      alerts.push({
        type: 'poor_signal',
        message: 'Poor signal strength',
        severity: 'medium',
        icon: '📶'
      });
    }
    
    return alerts;
  }

  // Initialize bins for a user
  initializeUserBins(userId) {
    const binTypes = [
      { wasteType: 'General', location: 'Front Yard' },
      { wasteType: 'Recyclable', location: 'Back Yard' },
      { wasteType: 'Organic', location: 'Kitchen' }
    ];

    binTypes.forEach((binType, index) => {
      const binId = `BIN${String(index + 1).padStart(3, '0')}`;
      const binData = this.generateBinData(binId, userId, binType.wasteType, binType.location);
      this.bins.set(binId, binData);
    });
  }

  // Get bins for a user
  getUserBins(userId) {
    return Array.from(this.bins.values()).filter(bin => bin.ownerId === userId);
  }

  // Get statistics
  getUserStats(userId) {
    const userBins = this.getUserBins(userId);
    return {
      totalBins: userBins.length,
      activeBins: userBins.filter(bin => bin.status === 'ACTIVE').length,
      overflowingBins: userBins.filter(bin => bin.fillLevel > 90).length,
      lowBatteryBins: userBins.filter(bin => bin.batteryLevel < 20).length,
      averageFillLevel: userBins.length > 0 ? 
        Math.round(userBins.reduce((sum, bin) => sum + bin.fillLevel, 0) / userBins.length) : 0,
      averageBatteryLevel: userBins.length > 0 ? 
        Math.round(userBins.reduce((sum, bin) => sum + bin.batteryLevel, 0) / userBins.length) : 0
    };
  }

  // Update all bins with new data
  updateAllBins() {
    this.bins.forEach((bin, binId) => {
      const updatedBin = this.generateBinData(binId, bin.ownerId, bin.wasteType, bin.location);
      this.bins.set(binId, updatedBin);
    });
    
    // Notify subscribers
    this.subscribers.forEach(callback => {
      try {
        callback(Array.from(this.bins.values()));
      } catch (error) {
        console.error('Error notifying subscriber:', error);
      }
    });
  }

  // Start real-time updates
  startUpdates(intervalMs = 5000) {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    
    this.updateInterval = setInterval(() => {
      this.updateAllBins();
    }, intervalMs);
  }

  // Stop updates
  stopUpdates() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  // Subscribe to updates
  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }
}

// Create singleton instance
const binSimulation = new BinSimulationService();

/**
 * BinStatusPage Component - Shows bin simulation data
 */
const BinStatusPage = () => {
  const { user } = useAuth();
  const [binsData, setBinsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [statistics, setStatistics] = useState({});

  // Initialize simulation
  useEffect(() => {
    const userId = 'demo-user';
    
    // Initialize bins for the user
    binSimulation.initializeUserBins(userId);
    
    // Get initial data
    const bins = binSimulation.getUserBins(userId);
    const stats = binSimulation.getUserStats(userId);
    
    setBinsData(bins);
    setStatistics(stats);
    setLoading(false);
    
    // Subscribe to updates
    const unsubscribe = binSimulation.subscribe((allBins) => {
      const userBins = allBins.filter(bin => bin.ownerId === userId);
      const userStats = binSimulation.getUserStats(userId);
      
      setBinsData(userBins);
      setStatistics(userStats);
      setLastUpdated(new Date());
    });
    
    // Start real-time updates
    binSimulation.startUpdates(5000);
    
    // Cleanup
    return () => {
      unsubscribe();
      binSimulation.stopUpdates();
    };
  }, []);

  // Helper functions
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
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatLastUpdated = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  // Navigation items
  const navItems = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'bins', label: 'My Bins', icon: '🗑️' },
    { id: 'alerts', label: 'Alerts', icon: '⚠️' },
    { id: 'request', label: 'Request Bin/Bag', icon: '➕' }
  ];

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
            binSimulation.updateAllBins();
          }}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Sensor Data Grid */}
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

      {/* Alerts */}
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

      {/* Last Updated */}
      <div className="flex justify-between items-center text-xs text-gray-500">
        <span>Last updated: {formatLastUpdated(bin.lastUpdated)}</span>
        <div className="flex items-center space-x-1">
          <MapPin className="w-3 h-3" />
          <span>{bin.location}</span>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Trash2 className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Bins</p>
                <p className="text-2xl font-semibold text-gray-900">{statistics.totalBins || 0}</p>
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
                <p className="text-2xl font-semibold text-gray-900">{statistics.activeBins || 0}</p>
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
                <p className="text-2xl font-semibold text-gray-900">{statistics.overflowingBins || 0}</p>
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
                <p className="text-2xl font-semibold text-gray-900">{statistics.lowBatteryBins || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Status */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Real-time Bin Status</h2>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <RefreshCw className="w-4 h-4" />
              <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {binsData.map(renderBinCard)}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setShowRequestModal(true)}
              className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <Plus className="w-5 h-5 text-gray-400" />
              <span className="text-gray-600">Request New Bin</span>
            </button>
            <button
              onClick={() => setShowRequestModal(true)}
              className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
            >
              <ShoppingCart className="w-5 h-5 text-gray-400" />
              <span className="text-gray-600">Request Bags</span>
            </button>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
            >
              <RefreshCw className="w-5 h-5 text-gray-400" />
              <span className="text-gray-600">Refresh Data</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {user?.role === 'BUSINESS' ? (
        <BusinessDashboardLayout
          navItems={navItems}
          activeNav="bins"
          onNavClick={() => {}}
          logo="Business"
          user={user}
          onLogout={() => {}}
          pageTitle="Bin Status & IoT Sensors"
          pageSubtitle="Real-time monitoring of your commercial waste bins"
        >
          {renderContent()}
        </BusinessDashboardLayout>
      ) : (
        <ResidentDashboardLayout
          navItems={navItems}
          activeNav="bins"
          onNavClick={() => {}}
          logo="Resident"
          user={user}
          onLogout={() => {}}
          pageTitle="Bin Status & IoT Sensors"
          pageSubtitle="Real-time monitoring of your waste bins"
        >
          {renderContent()}
        </ResidentDashboardLayout>
      )}
      
      <BinBagRequestModal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        userRole={user?.role}
      />
    </>
  );
};

export default BinStatusPage;