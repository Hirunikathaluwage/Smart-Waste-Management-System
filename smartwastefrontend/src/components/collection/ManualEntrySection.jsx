/**
 * Manual Entry Section Component
 * Follows SRP - only handles manual entry UI and logic
 */
import React from 'react';

const ManualEntrySection = ({ 
  showManualEntry, 
  manualWeight, 
  setManualWeight, 
  wasteType, 
  setWasteType, 
  onManualEntry, 
  onCancel 
}) => {
  if (!showManualEntry) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Manual Entry
      </h2>
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
            onClick={onManualEntry}
            className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Record Manual Collection
          </button>
          <button
            onClick={onCancel}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManualEntrySection;
