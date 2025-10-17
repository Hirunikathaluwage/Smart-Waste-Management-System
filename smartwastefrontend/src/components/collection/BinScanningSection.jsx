/**
 * Bin Scanning Section Component
 * Follows SRP - only handles bin scanning UI and logic
 */
import React from 'react';

const BinScanningSection = ({ 
  binId, 
  setBinId, 
  onBinScan, 
  onMarkAsMissed 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Scan Bin
      </h2>
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
            onKeyPress={(e) => e.key === "Enter" && onBinScan()}
          />
        </div>
        <div className="flex space-x-3">
          <button
            onClick={onBinScan}
            className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Scan Bin
          </button>
          <button
            onClick={onMarkAsMissed}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Mark as Missed
          </button>
        </div>
      </div>
    </div>
  );
};

export default BinScanningSection;
