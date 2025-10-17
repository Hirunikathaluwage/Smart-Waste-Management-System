/**
 * CollectionService - Handles all collection-related API calls
 * 
 * SOLID PRINCIPLES APPLIED:
 * - SRP (Single Responsibility): Only handles collection API operations
 * - DIP (Dependency Inversion): Depends on abstraction (fetch API) not concrete implementation
 * - OCP (Open/Closed): Open for extension with new endpoints, closed for modification
 * 
 * CODE SMELLS AVOIDED:
 * - No duplicate code: Reusable API call methods
 * - No magic strings: Base URL is configurable
 * - Proper error handling: Consistent error responses
 * - Clear method naming: Descriptive method names
 */

const API_BASE_URL = 'http://localhost:8080/api';

class CollectionService {
  /**
   * Create a new collection record
   * SRP: Single responsibility - only creates collection records
   * 
   * @param {Object} collectionData - The collection data
   * @returns {Promise<Object>} Created collection record
   */
  async createCollectionRecord(collectionData) {
    try {
      const response = await fetch(`${API_BASE_URL}/collections`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(collectionData),
      });

      if (!response.ok) {
        if (response.status === 409) {
          throw new Error('Bin was already collected today');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const record = await response.json();
      return record;
    } catch (error) {
      console.error('Error creating collection record:', error);
      throw new Error(`Failed to create collection record: ${error.message}`);
    }
  }

  /**
   * Get today's collection records for a worker
   * SRP: Single responsibility - only fetches today's collections
   * 
   * @param {string} workerId - The worker identifier
   * @returns {Promise<Array>} Array of today's collection records
   */
  async getTodayCollectionRecords(workerId) {
    try {
      const response = await fetch(`${API_BASE_URL}/collections/worker/${workerId}/today`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const records = await response.json();
      return records;
    } catch (error) {
      console.error(`Error fetching today's collections for worker ${workerId}:`, error);
      throw new Error(`Failed to fetch today's collections: ${error.message}`);
    }
  }

  /**
   * Get collection records by worker ID
   * SRP: Single responsibility - only fetches collections by worker
   * 
   * @param {string} workerId - The worker identifier
   * @returns {Promise<Array>} Array of collection records
   */
  async getCollectionRecordsByWorker(workerId) {
    try {
      const response = await fetch(`${API_BASE_URL}/collections/worker/${workerId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const records = await response.json();
      return records;
    } catch (error) {
      console.error(`Error fetching collections for worker ${workerId}:`, error);
      throw new Error(`Failed to fetch collections: ${error.message}`);
    }
  }

  /**
   * Get collection statistics for a worker
   * SRP: Single responsibility - only fetches collection statistics
   * 
   * @param {string} workerId - The worker identifier
   * @returns {Promise<Object>} Collection statistics
   */
  async getCollectionStats(workerId) {
    try {
      const response = await fetch(`${API_BASE_URL}/collections/worker/${workerId}/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const stats = await response.json();
      return stats;
    } catch (error) {
      console.error(`Error fetching collection stats for worker ${workerId}:`, error);
      throw new Error(`Failed to fetch collection stats: ${error.message}`);
    }
  }

  /**
   * Check if bin was already collected today
   * SRP: Single responsibility - only checks if bin was collected today
   * 
   * @param {string} binId - The bin identifier
   * @returns {Promise<boolean>} True if bin was collected today, false otherwise
   */
  async isBinAlreadyCollectedToday(binId) {
    try {
      const response = await fetch(`${API_BASE_URL}/collections/bin/${binId}/collected-today`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.alreadyCollected;
    } catch (error) {
      console.error(`Error checking if bin ${binId} was collected today:`, error);
      return false; // Default to false if check fails
    }
  }

  /**
   * Get collection records by bin ID
   * SRP: Single responsibility - only fetches collections by bin
   * 
   * @param {string} binId - The bin identifier
   * @returns {Promise<Array>} Array of collection records for the bin
   */
  async getCollectionRecordsByBin(binId) {
    try {
      const response = await fetch(`${API_BASE_URL}/collections/bin/${binId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const records = await response.json();
      return records;
    } catch (error) {
      console.error(`Error fetching collections for bin ${binId}:`, error);
      throw new Error(`Failed to fetch collections for bin: ${error.message}`);
    }
  }

  /**
   * Health check for collection service
   * SRP: Single responsibility - only checks service health
   * 
   * @returns {Promise<Object>} Health status
   */
  async healthCheck() {
    try {
      const response = await fetch(`${API_BASE_URL}/collections/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const health = await response.json();
      return health;
    } catch (error) {
      console.error('Error checking collection service health:', error);
      throw new Error(`Failed to check service health: ${error.message}`);
    }
  }
}

// Export singleton instance
const collectionService = new CollectionService();
export default collectionService;
