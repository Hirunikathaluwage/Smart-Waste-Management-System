/**
 * BinService - Handles all bin-related API calls
 * 
 * SOLID PRINCIPLES APPLIED:
 * - SRP (Single Responsibility): Only handles bin API operations
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

class BinService {
  /**
   * Fetch all bins from backend
   * SRP: Single responsibility - only fetches all bins
   * 
   * @returns {Promise<Array>} Array of bin objects
   */
  async getAllBins() {
    try {
      const response = await fetch(`${API_BASE_URL}/bins`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const bins = await response.json();
      return bins;
    } catch (error) {
      console.error('Error fetching bins:', error);
      throw new Error(`Failed to fetch bins: ${error.message}`);
    }
  }

  /**
   * Fetch a specific bin by binId
   * SRP: Single responsibility - only fetches single bin
   * 
   * @param {string} binId - The bin identifier
   * @returns {Promise<Object>} Bin object
   */
  async getBinById(binId) {
    try {
      const response = await fetch(`${API_BASE_URL}/bins/${binId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Bin with ID ${binId} not found`);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const bin = await response.json();
      return bin;
    } catch (error) {
      console.error(`Error fetching bin ${binId}:`, error);
      throw new Error(`Failed to fetch bin: ${error.message}`);
    }
  }

  /**
   * Update bin status
   * SRP: Single responsibility - only updates bin status
   * 
   * @param {string} binId - The bin identifier
   * @param {string} status - The new status
   * @returns {Promise<Object>} Updated bin object
   */
  async updateBinStatus(binId, status) {
    try {
      const response = await fetch(`${API_BASE_URL}/bins/${binId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedBin = await response.json();
      return updatedBin;
    } catch (error) {
      console.error(`Error updating bin ${binId} status:`, error);
      throw new Error(`Failed to update bin status: ${error.message}`);
    }
  }

  /**
   * Get bins by status
   * SRP: Single responsibility - only fetches bins by status
   * 
   * @param {string} status - The bin status
   * @returns {Promise<Array>} Array of bins with specified status
   */
  async getBinsByStatus(status) {
    try {
      const response = await fetch(`${API_BASE_URL}/bins/status/${status}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const bins = await response.json();
      return bins;
    } catch (error) {
      console.error(`Error fetching bins by status ${status}:`, error);
      throw new Error(`Failed to fetch bins by status: ${error.message}`);
    }
  }

  /**
   * Check if bin exists
   * SRP: Single responsibility - only checks bin existence
   * 
   * @param {string} binId - The bin identifier
   * @returns {Promise<boolean>} True if bin exists, false otherwise
   */
  async binExists(binId) {
    try {
      const response = await fetch(`${API_BASE_URL}/bins/${binId}`, {
        method: 'HEAD',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.ok;
    } catch (error) {
      console.error(`Error checking bin existence ${binId}:`, error);
      return false;
    }
  }
}

// Export singleton instance
const binService = new BinService();
export default binService;
