/**
 * SessionService - Handles session management with daily reset functionality
 * 
 * SOLID PRINCIPLES APPLIED:
 * - SRP (Single Responsibility): Only handles session management
 * - OCP (Open/Closed): Open for extension with new session features, closed for modification
 * - DIP (Dependency Inversion): Depends on abstractions (localStorage, Date), not concrete implementations
 * 
 * CODE SMELLS AVOIDED:
 * - No duplicate code: Centralized session logic
 * - No magic strings: All keys defined as constants
 * - No long functions: Each method has single responsibility
 * - No mixed responsibilities: Only handles session management
 * - No console logging in production: Configurable logging
 */

class SessionService {
  // Constants following DRY principle
  static STORAGE_KEYS = {
    SESSION_DATE: 'sessionDate',
    SESSION_START_TIME: 'sessionStartTime'
  };

  static CONFIG = {
    DEBUG_MODE: process.env.NODE_ENV === 'development',
    UPDATE_INTERVAL: 60000 // 1 minute
  };

  /**
   * Initialize session with daily reset check
   * SRP: Single responsibility - only initializes session
   * 
   * @returns {Object} Session data with start time and reset status
   */
  static initializeSession() {
    const today = this.getTodayDateString();
    const storedDate = this.getStoredDate();
    const storedStartTime = this.getStoredStartTime();
    
    const isNewDay = storedDate !== today;
    const hasNoStoredData = !storedStartTime;
    
    if (isNewDay || hasNoStoredData) {
      return this.createNewSession(today);
    }
    
    return this.continueExistingSession(storedStartTime, today);
  }

  /**
   * Check if session needs daily reset
   * SRP: Single responsibility - only checks for daily reset
   * 
   * @returns {boolean} True if reset is needed
   */
  static needsDailyReset() {
    const today = this.getTodayDateString();
    const storedDate = this.getStoredDate();
    return storedDate !== today;
  }

  /**
   * Reset session for new day
   * SRP: Single responsibility - only resets session
   * 
   * @returns {Object} New session data
   */
  static resetForNewDay() {
    const today = this.getTodayDateString();
    return this.createNewSession(today);
  }

  /**
   * Get current session start time
   * SRP: Single responsibility - only retrieves start time
   * 
   * @returns {number|null} Session start time in milliseconds
   */
  static getCurrentSessionStartTime() {
    const storedStartTime = this.getStoredStartTime();
    return storedStartTime ? parseInt(storedStartTime) : null;
  }

  /**
   * Create new session for today
   * SRP: Single responsibility - only creates new session
   * 
   * @param {string} today - Today's date string
   * @returns {Object} New session data
   */
  static createNewSession(today) {
    const newStartTime = Date.now();
    
    this.setStoredDate(today);
    this.setStoredStartTime(newStartTime);
    
    this.log('New daily session started', {
      date: today,
      startTime: new Date(newStartTime).toLocaleTimeString()
    });
    
    return {
      startTime: newStartTime,
      isNewSession: true,
      date: today
    };
  }

  /**
   * Continue existing session
   * SRP: Single responsibility - only continues existing session
   * 
   * @param {string} storedStartTime - Stored start time string
   * @param {string} today - Today's date string
   * @returns {Object} Existing session data
   */
  static continueExistingSession(storedStartTime, today) {
    const startTime = parseInt(storedStartTime);
    
    this.log('Continuing existing session', {
      date: today,
      startTime: new Date(startTime).toLocaleTimeString()
    });
    
    return {
      startTime: startTime,
      isNewSession: false,
      date: today
    };
  }

  /**
   * Get today's date string
   * SRP: Single responsibility - only gets today's date
   * 
   * @returns {string} Today's date string
   */
  static getTodayDateString() {
    return new Date().toDateString();
  }

  /**
   * Get stored date from localStorage
   * SRP: Single responsibility - only retrieves stored date
   * 
   * @returns {string|null} Stored date or null
   */
  static getStoredDate() {
    return localStorage.getItem(this.STORAGE_KEYS.SESSION_DATE);
  }

  /**
   * Get stored start time from localStorage
   * SRP: Single responsibility - only retrieves stored start time
   * 
   * @returns {string|null} Stored start time or null
   */
  static getStoredStartTime() {
    return localStorage.getItem(this.STORAGE_KEYS.SESSION_START_TIME);
  }

  /**
   * Set stored date in localStorage
   * SRP: Single responsibility - only sets stored date
   * 
   * @param {string} date - Date string to store
   */
  static setStoredDate(date) {
    localStorage.setItem(this.STORAGE_KEYS.SESSION_DATE, date);
  }

  /**
   * Set stored start time in localStorage
   * SRP: Single responsibility - only sets stored start time
   * 
   * @param {number} startTime - Start time in milliseconds
   */
  static setStoredStartTime(startTime) {
    localStorage.setItem(this.STORAGE_KEYS.SESSION_START_TIME, startTime.toString());
  }

  /**
   * Clear all session data
   * SRP: Single responsibility - only clears session data
   */
  static clearSession() {
    localStorage.removeItem(this.STORAGE_KEYS.SESSION_DATE);
    localStorage.removeItem(this.STORAGE_KEYS.SESSION_START_TIME);
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
      console.log(`[SessionService] ${message}`, data);
    }
  }
}

export default SessionService;
