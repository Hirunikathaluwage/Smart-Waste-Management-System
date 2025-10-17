/**
 * FullSummaryModal Component - Displays comprehensive summary for all routes
 * 
 * SOLID PRINCIPLES APPLIED:
 * - SRP (Single Responsibility): Only responsible for displaying full summary
 * - OCP (Open/Closed): Open for extension with new summary sections, closed for modification
 * - DIP (Dependency Inversion): Depends on summary data abstraction
 * 
 * CODE SMELLS AVOIDED:
 * - No God class: Focused only on summary display
 * - No duplicate code: Reusable summary components
 * - No magic strings: All status types properly defined
 * - Clear separation: UI logic separated from business logic
 */

import React from 'react';
import { ModalBackdropComponent } from '../common/ModalBackdrop';

// Icon components following SRP for icon management
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

/**
 * Summary Stat Card Component - Reusable stat display
 * SRP: Single responsibility - only displays a single stat
 */
const SummaryStatCard = ({ icon: Icon, label, value, color = "blue" }) => {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-800",
    green: "bg-green-100 text-green-800",
    red: "bg-red-100 text-red-800",
    yellow: "bg-yellow-100 text-yellow-800"
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center space-x-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colorClasses[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-lg font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
};

/**
 * Route Summary Row Component - Displays individual route data
 * SRP: Single responsibility - only displays route summary row
 */
const RouteSummaryRow = ({ routeSummary }) => {
  const getCompletionColor = (percentage) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900">{routeSummary.routeName}</h3>
        <span className={`text-sm font-medium ${getCompletionColor(routeSummary.completionPercentage)}`}>
          {routeSummary.completionPercentage}%
        </span>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <p className="text-gray-600">Bins Collected</p>
          <p className="font-semibold">{routeSummary.binsCollected}/{routeSummary.totalBins}</p>
        </div>
        <div>
          <p className="text-gray-600">Weight</p>
          <p className="font-semibold">{routeSummary.totalWeight} kg</p>
        </div>
        <div>
          <p className="text-gray-600">Missed</p>
          <p className="font-semibold text-red-600">{routeSummary.missedBins}</p>
        </div>
        <div>
          <p className="text-gray-600">Overrides</p>
          <p className="font-semibold text-yellow-600">{routeSummary.overrideCollections}</p>
        </div>
      </div>
    </div>
  );
};

/**
 * Main FullSummaryModal Component
 * SRP: Single responsibility - only displays comprehensive summary
 */
const FullSummaryModal = ({ isOpen, onClose, summaryData }) => {
  if (!isOpen) return null;

  const { elapsedTime, totalBinsCollected, totalWeight, totalMissedBins, totalOverrideCollections, totalManualEntries, routeSummaries } = summaryData || {
    elapsedTime: '0h 0m',
    totalBinsCollected: 0,
    totalWeight: 0,
    totalMissedBins: 0,
    totalOverrideCollections: 0,
    totalManualEntries: 0,
    routeSummaries: []
  };

  return (
    <ModalBackdropComponent
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-200">
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-200 sticky top-0 bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircleIcon className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Complete Shift Summary</h2>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Overall Statistics */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Overall Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <SummaryStatCard
                  icon={ClockIcon}
                  label="Total Time"
                  value={elapsedTime}
                  color="blue"
                />
                <SummaryStatCard
                  icon={CheckCircleIcon}
                  label="Bins Collected"
                  value={totalBinsCollected}
                  color="green"
                />
                <SummaryStatCard
                  icon={ScaleIcon}
                  label="Total Weight"
                  value={`${totalWeight} kg`}
                  color="blue"
                />
                <SummaryStatCard
                  icon={ExclamationTriangleIcon}
                  label="Missed Bins"
                  value={totalMissedBins}
                  color="red"
                />
              </div>
            </div>

            {/* Additional Stats */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-md font-semibold text-gray-900 mb-3">Additional Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Override Collections:</span>
                  <span className="font-semibold text-yellow-600">{totalOverrideCollections}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Manual Entries:</span>
                  <span className="font-semibold text-blue-600">{totalManualEntries}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Routes:</span>
                  <span className="font-semibold">{routeSummaries.length}</span>
                </div>
              </div>
            </div>

            {/* Route Breakdown */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Route Breakdown</h3>
              <div className="space-y-4">
                {routeSummaries.map((routeSummary, index) => (
                  <RouteSummaryRow key={routeSummary.routeId || index} routeSummary={routeSummary} />
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Close Summary
              </button>
            </div>
          </div>
        </div>
      </div>
    </ModalBackdropComponent>
  );
};

export default FullSummaryModal;
