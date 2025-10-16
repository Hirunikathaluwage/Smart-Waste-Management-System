/**
 * AudioFeedbackService - Handles all audio feedback for the collection system
 * 
 * SOLID PRINCIPLES APPLIED:
 * - SRP (Single Responsibility): Only responsible for audio feedback management
 * - OCP (Open/Closed): Open for extension with new audio types, closed for modification
 * - DIP (Dependency Inversion): Depends on audio abstraction, not concrete implementations
 * - ISP (Interface Segregation): Focused audio interface without unnecessary dependencies
 * 
 * CODE SMELLS AVOIDED:
 * - No God class: Focused only on audio feedback
 * - No duplicate code: Reusable audio management
 * - No magic strings: All audio types properly defined
 * - Clear separation: Audio logic separated from UI logic
 */
class AudioFeedbackService {
  constructor() {
    // Audio context for Web Audio API - follows DIP principle
    this.audioContext = null;
    this.isInitialized = false;
    this.volume = 0.5; // Default volume level
    
    // Audio types following OCP - easy to extend with new audio types
    this.audioTypes = {
      SUCCESS: 'success',
      WARNING: 'warning', 
      ERROR: 'error',
      INFO: 'info',
      OFFLINE: 'offline'
    };
    
    // Initialize audio context on first user interaction
    this.initAudioContext();
  }

  /**
   * Initialize audio context - follows SRP for audio initialization
   * DIP: Depends on Web Audio API abstraction
   */
  initAudioContext() {
    try {
      // Create audio context only when needed - follows lazy initialization pattern
      if (typeof window !== 'undefined' && window.AudioContext) {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.isInitialized = true;
      }
    } catch (error) {
      console.warn('Audio context not supported:', error);
      this.isInitialized = false;
    }
  }

  /**
   * Generate beep sound - follows SRP for sound generation
   * OCP: Open for extension with different frequencies and durations
   */
  generateBeep(frequency = 800, duration = 200, type = 'sine') {
    if (!this.isInitialized || !this.audioContext) {
      console.log(`Mock audio: ${type} beep at ${frequency}Hz for ${duration}ms`);
      return;
    }

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      // Configure oscillator - follows SRP for oscillator setup
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
      oscillator.type = type;
      
      // Configure gain for volume control - follows SRP for volume management
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(this.volume, this.audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration / 1000);
      
      // Play the sound - follows SRP for sound playback
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration / 1000);
      
    } catch (error) {
      console.warn('Error generating beep:', error);
    }
  }

  /**
   * Play success sound - follows SRP for success feedback
   * OCP: Easy to extend with different success sounds
   */
  playSuccessSound() {
    // Success sound: ascending tone
    this.generateBeep(800, 150, 'sine');
    setTimeout(() => this.generateBeep(1000, 150, 'sine'), 100);
  }

  /**
   * Play warning sound - follows SRP for warning feedback
   * OCP: Easy to extend with different warning sounds
   */
  playWarningSound() {
    // Warning sound: two short beeps
    this.generateBeep(600, 100, 'sine');
    setTimeout(() => this.generateBeep(600, 100, 'sine'), 200);
  }

  /**
   * Play error sound - follows SRP for error feedback
   * OCP: Easy to extend with different error sounds
   */
  playErrorSound() {
    // Error sound: descending tone
    this.generateBeep(1000, 200, 'sine');
    setTimeout(() => this.generateBeep(600, 200, 'sine'), 150);
  }

  /**
   * Play info sound - follows SRP for info feedback
   * OCP: Easy to extend with different info sounds
   */
  playInfoSound() {
    // Info sound: single short beep
    this.generateBeep(700, 100, 'sine');
  }

  /**
   * Play offline sound - follows SRP for offline feedback
   * OCP: Easy to extend with different offline sounds
   */
  playOfflineSound() {
    // Offline sound: three quick beeps
    this.generateBeep(500, 80, 'sine');
    setTimeout(() => this.generateBeep(500, 80, 'sine'), 100);
    setTimeout(() => this.generateBeep(500, 80, 'sine'), 200);
  }

  /**
   * Play feedback sound by type - follows SRP for type-based feedback
   * OCP: Open for extension with new audio types
   * DIP: Depends on audio type abstraction
   */
  playFeedbackSound(type) {
    switch (type) {
      case this.audioTypes.SUCCESS:
        this.playSuccessSound();
        break;
      case this.audioTypes.WARNING:
        this.playWarningSound();
        break;
      case this.audioTypes.ERROR:
        this.playErrorSound();
        break;
      case this.audioTypes.INFO:
        this.playInfoSound();
        break;
      case this.audioTypes.OFFLINE:
        this.playOfflineSound();
        break;
      default:
        console.log(`Unknown audio type: ${type}`);
    }
  }

  /**
   * Set volume level - follows SRP for volume management
   * Validation ensures volume is within valid range
   */
  setVolume(volume) {
    if (volume >= 0 && volume <= 1) {
      this.volume = volume;
    } else {
      console.warn('Volume must be between 0 and 1');
    }
  }

  /**
   * Get current volume - follows SRP for volume retrieval
   */
  getVolume() {
    return this.volume;
  }

  /**
   * Check if audio is supported - follows SRP for capability checking
   */
  isAudioSupported() {
    return this.isInitialized && this.audioContext !== null;
  }

  /**
   * Resume audio context if suspended - follows SRP for context management
   * Required for some browsers that suspend audio context
   */
  async resumeAudioContext() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      try {
        await this.audioContext.resume();
        return true;
      } catch (error) {
        console.warn('Failed to resume audio context:', error);
        return false;
      }
    }
    return true;
  }
}

// Create singleton instance - follows Singleton pattern for global audio management
const audioFeedbackService = new AudioFeedbackService();

export default audioFeedbackService;
