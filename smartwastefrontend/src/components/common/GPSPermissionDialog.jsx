import React, { useState, useEffect } from 'react';
import locationService from '../../services/LocationService';

/**
 * GPS Permission Component - Handles location permission requests
 * 
 * SOLID PRINCIPLES APPLIED:
 * - SRP (Single Responsibility): Only handles GPS permission requests and user guidance
 * - OCP (Open/Closed): Open for extension with new permission types, closed for modification
 * - DIP (Dependency Inversion): Depends on LocationService abstraction
 * - ISP (Interface Segregation): Focused permission interface without unnecessary dependencies
 * 
 * CODE SMELLS AVOIDED:
 * - No God class: Focused only on permission handling
 * - No duplicate code: Reusable permission component
 * - No magic strings: All messages properly defined
 * - Clear separation: Permission logic separated from UI logic
 */

// SVG Icons following SRP for icon management
const LocationIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
  </svg>
);

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

const GPSPermissionDialog = ({ 
  isOpen, 
  onClose, 
  onPermissionGranted, 
  onPermissionDenied,
  className = '' 
}) => {
  const [isRequesting, setIsRequesting] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState(null);

  /**
   * Handle permission request - follows SRP for permission handling
   */
  const handleRequestPermission = async () => {
    setIsRequesting(true);
    setPermissionStatus(null);

    try {
      const result = await locationService.requestLocationPermission();
      setPermissionStatus(result);

      if (result.granted) {
        onPermissionGranted && onPermissionGranted();
      } else {
        onPermissionDenied && onPermissionDenied(result.message);
      }
    } catch (error) {
      console.error('Permission request error:', error);
      setPermissionStatus({
        granted: false,
        message: 'An error occurred while requesting location permission',
        canRetry: true
      });
    } finally {
      setIsRequesting(false);
    }
  };

  /**
   * Handle retry permission request - follows SRP for retry logic
   */
  const handleRetryPermission = () => {
    setPermissionStatus(null);
    handleRequestPermission();
  };

  /**
   * Handle skip permission - follows SRP for skip handling
   */
  const handleSkipPermission = () => {
    onPermissionDenied && onPermissionDenied('Location permission skipped by user');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${className}`}>
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <LocationIcon className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Enable Location Services</h3>
            <p className="text-sm text-gray-600">GPS navigation features</p>
          </div>
        </div>

        {/* Content */}
        <div className="mb-6">
          <p className="text-gray-700 mb-4">
            To provide you with the best waste collection experience, we need access to your location. 
            This enables:
          </p>
          
          <ul className="space-y-2 text-sm text-gray-600 mb-4">
            <li className="flex items-center space-x-2">
              <CheckCircleIcon className="w-4 h-4 text-green-500" />
              <span>Real-time route navigation</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircleIcon className="w-4 h-4 text-green-500" />
              <span>Location verification when scanning bins</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircleIcon className="w-4 h-4 text-green-500" />
              <span>Progress tracking and route optimization</span>
            </li>
          </ul>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>Privacy:</strong> Your location data is only used for navigation and is not stored permanently.
            </p>
          </div>
        </div>

        {/* Permission Status */}
        {permissionStatus && (
          <div className={`mb-4 p-3 rounded-lg ${
            permissionStatus.granted 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center space-x-2">
              {permissionStatus.granted ? (
                <CheckCircleIcon className="w-5 h-5 text-green-600" />
              ) : (
                <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
              )}
              <span className={`text-sm font-medium ${
                permissionStatus.granted ? 'text-green-800' : 'text-red-800'
              }`}>
                {permissionStatus.granted ? 'Permission Granted!' : 'Permission Denied'}
              </span>
            </div>
            <p className={`text-sm mt-1 ${
              permissionStatus.granted ? 'text-green-700' : 'text-red-700'
            }`}>
              {permissionStatus.message}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-3">
          {permissionStatus?.granted ? (
            <button
              onClick={onClose}
              className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Continue
            </button>
          ) : permissionStatus?.canRetry ? (
            <>
              <button
                onClick={handleRetryPermission}
                disabled={isRequesting}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isRequesting ? 'Requesting...' : 'Try Again'}
              </button>
              <button
                onClick={handleSkipPermission}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Skip
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleRequestPermission}
                disabled={isRequesting}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isRequesting ? 'Requesting...' : 'Allow Location Access'}
              </button>
              <button
                onClick={handleSkipPermission}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Skip
              </button>
            </>
          )}
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <XCircleIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default GPSPermissionDialog;
