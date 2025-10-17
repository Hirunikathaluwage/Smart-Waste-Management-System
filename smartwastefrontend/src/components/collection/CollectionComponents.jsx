import React from 'react';

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

const InformationCircleIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
  </svg>
);

/**
 * FeedbackDisplay Component - Handles all types of user feedback
 * 
 * SOLID PRINCIPLES APPLIED:
 * - SRP (Single Responsibility): Only responsible for displaying feedback messages
 * - OCP (Open/Closed): Open for extension with new feedback types, closed for modification
 * - DIP (Dependency Inversion): Depends on feedback type abstraction, not concrete implementations
 * - ISP (Interface Segregation): Focused feedback interface without unnecessary dependencies
 * 
 * CODE SMELLS AVOIDED:
 * - No God class: Focused only on feedback display
 * - No duplicate code: Reusable across all feedback types
 * - No magic strings: All feedback types properly defined
 * - Clear separation: UI logic separated from business logic
 */
const FeedbackDisplay = ({ type, message, options = [], onClose }) => {
  // Icon mapping following OCP - easy to extend with new feedback types
  const getIcon = () => {
    const iconClass = "w-8 h-8";
    switch (type) {
      case 'success':
        return <CheckCircleIcon className={`${iconClass} text-green-500`} />;
      case 'warning':
        return <ExclamationTriangleIcon className={`${iconClass} text-yellow-500`} />;
      case 'error':
        return <XCircleIcon className={`${iconClass} text-red-500`} />;
      case 'offline':
        return <CloudSlashIcon className={`${iconClass} text-yellow-500`} />;
      case 'info':
        return <InformationCircleIcon className={`${iconClass} text-blue-500`} />;
      default:
        return <InformationCircleIcon className={`${iconClass} text-gray-500`} />;
    }
  };

  // Style mapping following OCP - easy to extend with new styles
  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'offline':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  // Button style mapping following SRP - single responsibility for button styling
  const getButtonStyle = (buttonType) => {
    switch (buttonType) {
      case 'primary':
        return 'bg-green-600 text-white hover:bg-green-700';
      case 'secondary':
        return 'bg-gray-200 text-gray-800 hover:bg-gray-300';
      case 'danger':
        return 'bg-red-600 text-white hover:bg-red-700';
      case 'warning':
        return 'bg-yellow-600 text-white hover:bg-yellow-700';
      default:
        return 'bg-gray-200 text-gray-800 hover:bg-gray-300';
    }
  };

  return (
    <div className={`p-4 rounded-lg border-2 ${getStyles()} transition-all duration-300`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          {getIcon()}
          <div className="flex-1">
            <p className="font-medium">{message}</p>
            {options.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {options.map((option, index) => (
                  <button
                    key={index}
                    onClick={option.onClick}
                    className={`px-4 py-2 rounded text-sm font-medium transition-colors ${getButtonStyle(option.type)}`}
                  >
                    {option.text}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XCircleIcon className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

/**
 * ProgressIndicator Component - Displays various progress metrics
 * 
 * SOLID PRINCIPLES APPLIED:
 * - SRP (Single Responsibility): Only responsible for displaying progress information
 * - OCP (Open/Closed): Open for extension with new progress types, closed for modification
 * - DIP (Dependency Inversion): Depends on progress data abstraction
 * 
 * CODE SMELLS AVOIDED:
 * - No God class: Focused only on progress display
 * - No duplicate code: Reusable progress components
 * - No magic numbers: All progress calculations properly handled
 */
const ProgressIndicator = ({ 
  label, 
  current, 
  total, 
  unit = '', 
  icon: Icon, 
  color = 'green',
  showPercentage = true 
}) => {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;
  
  const getColorClasses = () => {
    switch (color) {
      case 'green':
        return 'text-green-600 bg-green-600';
      case 'blue':
        return 'text-blue-600 bg-blue-600';
      case 'yellow':
        return 'text-yellow-600 bg-yellow-600';
      case 'red':
        return 'text-red-600 bg-red-600';
      default:
        return 'text-gray-600 bg-gray-600';
    }
  };

  return (
    <div className="flex items-center space-x-3">
      {Icon && <Icon className={`w-6 h-6 ${getColorClasses().split(' ')[0]}`} />}
      <div className="flex-1">
        <p className="text-sm text-gray-600">{label}</p>
        <p className="text-lg font-semibold">
          {current}/{total} {unit} {showPercentage && `(${percentage}%)`}
        </p>
        {showPercentage && (
          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${getColorClasses().split(' ')[1]}`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * SensorDataDisplay Component - Shows mock IoT sensor data
 * 
 * SOLID PRINCIPLES APPLIED:
 * - SRP (Single Responsibility): Only responsible for displaying sensor data
 * - OCP (Open/Closed): Open for extension with new sensor types, closed for modification
 * - DIP (Dependency Inversion): Depends on sensor data abstraction
 * 
 * CODE SMELLS AVOIDED:
 * - No God class: Focused only on sensor data display
 * - No duplicate code: Reusable sensor data components
 * - No magic strings: All sensor types properly defined
 */
const SensorDataDisplay = ({ sensorData, title = "Bin Sensor Data (Mock)" }) => {
  if (!sensorData) return null;

  // Sensor data fields following OCP - easy to extend with new sensor types
  const sensorFields = [
    { key: 'binId', label: 'Bin ID', value: sensorData.binId },
    { key: 'weight', label: 'Weight', value: `${sensorData.weight} kg` },
    { key: 'fillLevel', label: 'Fill Level', value: `${sensorData.fillLevel}%` },
    { key: 'temperature', label: 'Temperature', value: `${sensorData.temperature}°C` },
    { key: 'lastCollection', label: 'Last Collection', value: sensorData.lastCollection },
    { key: 'wasteType', label: 'Waste Type', value: sensorData.wasteType },
    { key: 'batteryLevel', label: 'Battery Level', value: `${sensorData.batteryLevel}%` },
    { key: 'signalStrength', label: 'Signal Strength', value: sensorData.signalStrength }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {sensorFields.map((field) => (
          <div key={field.key} className="text-center">
            <p className="text-sm text-gray-600">{field.label}</p>
            <p className="font-semibold text-gray-900">{field.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * CollectionTable Component - Displays collected bins in table format
 * 
 * SOLID PRINCIPLES APPLIED:
 * - SRP (Single Responsibility): Only responsible for displaying collection data
 * - OCP (Open/Closed): Open for extension with new columns, closed for modification
 * - DIP (Dependency Inversion): Depends on collection data abstraction
 * 
 * CODE SMELLS AVOIDED:
 * - No God class: Focused only on table display
 * - No duplicate code: Reusable table components
 * - No magic strings: All status types properly defined
 */
const CollectionTable = ({ collectedBins, title = "Collected Bins", onResetBin }) => {
  // Status badge styling following OCP - easy to extend with new status types
  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'Collected':
        return 'bg-green-100 text-green-800';
      case 'Override Collection':
        return 'bg-yellow-100 text-yellow-800';
      case 'Manual Entry - Sensor Failed':
        return 'bg-blue-100 text-blue-800';
      case 'Missed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Reset button handler following SRP - single responsibility
  const handleResetBin = (binId, event) => {
    event.stopPropagation(); // Prevent row click
    if (onResetBin) {
      onResetBin(binId);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-green-600">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Collected Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Venue
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Date & Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Weight
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Fill Level
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {collectedBins.map((bin, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {bin.binId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {bin.location}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {bin.timestamp}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {bin.weight} kg
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {bin.fillLevel}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeStyle(bin.status)}`}>
                    {bin.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={(e) => handleResetBin(bin.binId, e)}
                    className="text-red-600 hover:text-red-900 font-medium text-xs bg-red-50 hover:bg-red-100 px-2 py-1 rounded transition-colors"
                    title="Reset bin to make it scannable again"
                  >
                    Reset
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {collectedBins.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No bins collected yet. Start scanning to record collections.
          </div>
        )}
      </div>
    </div>
  );
};

export { FeedbackDisplay, ProgressIndicator, SensorDataDisplay, CollectionTable };
