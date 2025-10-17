/**
 * Location Tracking Section Component
 * Follows SRP - only handles location tracking UI
 */
import React from 'react';

const LocationTrackingSection = ({
  currentLocation,
  locationError,
  isLocationTracking,
  isRefreshingLocation,
  qualityInfo,
  onLocationTrackingToggle,
  onLocationRefresh,
  onToggleNavigationMap,
  showNavigationMap
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Location Tracking
      </h2>
      <div className="space-y-4">
        {/* Location Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">GPS Status:</span>
          <div className="flex items-center space-x-2">
            <div
              className={`w-2 h-2 rounded-full ${
                currentLocation ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
            <span className="text-sm font-medium">
              {currentLocation ? "Active" : "Inactive"}
            </span>
          </div>
        </div>

        {/* GPS Quality Indicator */}
        {currentLocation && qualityInfo && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                GPS Quality:
              </span>
              <div className="flex items-center space-x-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    qualityInfo.quality === "excellent"
                      ? "bg-green-500"
                      : qualityInfo.quality === "good"
                      ? "bg-blue-500"
                      : qualityInfo.quality === "fair"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                ></div>
                <span
                  className={`text-sm font-medium ${qualityInfo.color}`}
                >
                  {qualityInfo.quality.charAt(0).toUpperCase() +
                    qualityInfo.quality.slice(1)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Accuracy:
              </span>
              <span className="text-sm font-medium">
                {qualityInfo.accuracy}m
              </span>
            </div>

            <div className="bg-gray-50 rounded-lg p-2">
              <p className="text-xs text-gray-600">
                {qualityInfo.description}
              </p>
            </div>
          </div>
        )}

        {/* Location Error */}
        {locationError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="text-sm text-red-800">{locationError}</div>
          </div>
        )}

        {/* Control Buttons */}
        <div className="space-y-2">
          <button
            onClick={onLocationTrackingToggle}
            className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
              isLocationTracking
                ? "bg-red-100 text-red-700 hover:bg-red-200"
                : "bg-green-100 text-green-700 hover:bg-green-200"
            }`}
          >
            {isLocationTracking ? "Stop Tracking" : "Start Tracking"}
          </button>

          <button
            onClick={onLocationRefresh}
            disabled={isRefreshingLocation}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isRefreshingLocation
              ? "Refreshing..."
              : "Refresh Location"}
          </button>

          <button
            onClick={onToggleNavigationMap}
            className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors"
          >
            {showNavigationMap
              ? "Hide Navigation Map"
              : "Show Navigation Map"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationTrackingSection;
