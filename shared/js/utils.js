/**
 * Nobel Quest - Shared Utilities
 * 
 * Common utility functions used across all games.
 */

const NobelUtils = {
  /**
   * Shuffle an array using Fisher-Yates algorithm
   * @param {Array} array - Array to shuffle
   * @returns {Array} Shuffled array (original is not modified)
   */
  shuffle(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  },

  /**
   * Get a random element from an array
   * @param {Array} array - Array to pick from
   * @returns {*} Random element
   */
  randomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
  },

  /**
   * Get multiple random elements from an array
   * @param {Array} array - Array to pick from
   * @param {number} count - Number of elements to pick
   * @returns {Array} Array of random elements
   */
  randomElements(array, count) {
    const shuffled = this.shuffle(array);
    return shuffled.slice(0, count);
  },

  /**
   * Debounce a function
   * @param {Function} func - Function to debounce
   * @param {number} wait - Wait time in ms
   * @returns {Function} Debounced function
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * Format a date to readable string
   * @param {Date} date - Date object
   * @returns {string} Formatted date string
   */
  formatDate(date) {
    if (!date) return '';
    return new Intl.DateTimeFormat('sv-SE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  },

  /**
   * Calculate percentage
   * @param {number} value - Current value
   * @param {number} total - Total value
   * @returns {number} Percentage (0-100)
   */
  percentage(value, total) {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  },

  /**
   * Clamp a number between min and max
   * @param {number} value - Value to clamp
   * @param {number} min - Minimum value
   * @param {number} max - Maximum value
   * @returns {number} Clamped value
   */
  clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  },

  /**
   * Check if device is mobile
   * @returns {boolean} True if mobile device
   */
  isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  },

  /**
   * Copy text to clipboard
   * @param {string} text - Text to copy
   * @returns {Promise<boolean>} True if successful
   */
  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.error('Failed to copy:', err);
      return false;
    }
  },

  /**
   * Generate a random ID
   * @param {number} length - Length of ID (default: 8)
   * @returns {string} Random ID
   */
  generateId(length = 8) {
    return Math.random().toString(36).substring(2, length + 2);
  }
};

// Make available globally
window.NobelUtils = NobelUtils;

console.log('✅ NobelUtils module loaded');
