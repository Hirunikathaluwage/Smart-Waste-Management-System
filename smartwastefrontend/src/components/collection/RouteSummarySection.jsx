/**
 * Route Summary Section Component
 * Follows SRP - only handles route summary display
 */
import React from 'react';

const RouteSummarySection = ({ currentRouteSummary, onShowFullSummary }) => {
  return (
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
        onClick={onShowFullSummary}
        className="w-full mt-4 bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
      >
        View Full Summary
      </button>
    </div>
  );
};

export default RouteSummarySection;
