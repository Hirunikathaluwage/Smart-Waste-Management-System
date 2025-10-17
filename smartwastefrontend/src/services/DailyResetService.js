/**
 * DailyResetService - Handles daily reset functionality for collection data
 * 
 * SOLID PRINCIPLES APPLIED:
 * - SRP (Single Responsibility): Only handles daily reset logic
 * - OCP (Open/Closed): Open for extension with new reset types, closed for modification
 * - DIP (Dependency Inversion): Depends on SessionService abstraction
 * 
 * CODE SMELLS AVOIDED:
 * - No duplicate code: Centralized reset logic
 * - No magic numbers: All values defined as constants
 * - No long functions: Each method has single responsibility
 * - No mixed responsibilities: Only handles daily reset
 * - No console logging in production: Configurable logging
 */

import SessionService from './SessionService';

class DailyResetService {
  // Constants following DRY principle
  static CONFIG = {
    DEBUG_MODE: process.env.NODE_ENV === 'development',
    RESET_CALLBACKS: []
  };

  /**
   * Check if daily reset is needed and execute if necessary
   * SRP: Single responsibility - only checks and executes daily reset
   * 
   * @param {Function} resetCallback - Callback to execute on reset
   * @returns {boolean} True if reset was executed
   */
  static checkAndExecuteDailyReset(resetCallback) {
    if (SessionService.needsDailyReset()) {
      this.executeDailyReset(resetCallback);
      return true;
    }
    return false;
  }

  /**
   * Execute daily reset
   * SRP: Single responsibility - only executes daily reset
   * 
   * @param {Function} resetCallback - Callback to execute on reset
   */
  static executeDailyReset(resetCallback) {
    const newSession = SessionService.resetForNewDay();
    
    this.log('Daily reset executed', {
      date: newSession.date,
      startTime: new Date(newSession.startTime).toLocaleTimeString()
    });
    
    // Execute reset callback if provided
    if (resetCallback && typeof resetCallback === 'function') {
      resetCallback();
    }
    
    // Execute all registered callbacks
    this.CONFIG.RESET_CALLBACKS.forEach(callback => {
      if (typeof callback === 'function') {
        callback();
      }
    });
  }

  /**
   * Register a callback for daily reset
   * SRP: Single responsibility - only registers callbacks
   * 
   * @param {Function} callback - Callback to register
   */
  static registerResetCallback(callback) {
    if (typeof callback === 'function') {
      this.CONFIG.RESET_CALLBACKS.push(callback);
    }
  }

  /**
   * Unregister a callback for daily reset
   * SRP: Single responsibility - only unregisters callbacks
   * 
   * @param {Function} callback - Callback to unregister
   */
  static unregisterResetCallback(callback) {
    const index = this.CONFIG.RESET_CALLBACKS.indexOf(callback);
    if (index > -1) {
      this.CONFIG.RESET_CALLBACKS.splice(index, 1);
    }
  }

  /**
   * Clear all registered callbacks
   * SRP: Single responsibility - only clears callbacks
   */
  static clearAllCallbacks() {
    this.CONFIG.RESET_CALLBACKS = [];
  }

  /**
   * Get default reset data for collection state
   * SRP: Single responsibility - only provides default reset data
   * 
   * @returns {Object} Default reset data
   */
  static getDefaultResetData() {
    return {
      collectedBins: [],
      totalWeight: 0,
      routeProgress: { collected: 0, total: 25 }
    };
  }

  /**
   * Log message if debug mode is enabled
   * SRP: Single responsibility - only handles logging
   * 
   * @param {string} message - Log message
   * @param {Object} data - Additional data to log
   */
  static log(message, data = null) {
    if (this.CONFIG.DEBUG_MODE) {
      console.log(`[DailyResetService] ${message}`, data);
    }
  }
}

export default DailyResetService;

