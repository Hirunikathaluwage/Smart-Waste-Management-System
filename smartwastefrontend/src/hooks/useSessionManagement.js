/**
 * Custom hook for session management
 * Follows SRP - only handles session timing and daily reset
 */
import { useState, useEffect } from 'react';
import SessionService from '../services/SessionService';
import DailyResetService from '../services/DailyResetService';
import RouteSummaryService from '../services/RouteSummaryService';

export const useSessionManagement = (collectedBins) => {
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState("0h 0m");
  const [currentRouteSummary, setCurrentRouteSummary] = useState(null);

  // Initialize session with daily reset
  useEffect(() => {
    const sessionData = SessionService.initializeSession();
    setSessionStartTime(sessionData.startTime);
  }, []);

  // Timer effect with daily reset check
  useEffect(() => {
    if (!sessionStartTime) return;

    const timer = setInterval(() => {
      const wasReset = DailyResetService.checkAndExecuteDailyReset(() => {
        setSessionStartTime(SessionService.getCurrentSessionStartTime());
      });
      
      if (wasReset) {
        // Reset collection data on daily reset
        const resetData = DailyResetService.getDefaultResetData();
        // Note: This would need to be handled by parent component
        // as we can't directly modify collectedBins from here
      }
      
      const elapsedTime = RouteSummaryService.calculateElapsedTime(sessionStartTime);
      setElapsedTime(elapsedTime);
    }, SessionService.CONFIG.UPDATE_INTERVAL);

    return () => clearInterval(timer);
  }, [sessionStartTime]);

  // Calculate current route summary
  useEffect(() => {
    const currentRouteId = localStorage.getItem('selectedRouteId');
    const summary = RouteSummaryService.getCurrentRouteSummary(collectedBins, currentRouteId, sessionStartTime);
    setCurrentRouteSummary(summary);
  }, [collectedBins, sessionStartTime]);

  const getFullSummaryData = () => {
    return RouteSummaryService.getAllRoutesSummary(collectedBins, sessionStartTime);
  };

  return {
    sessionStartTime,
    elapsedTime,
    currentRouteSummary,
    getFullSummaryData
  };
};
