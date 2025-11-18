/**
 * Nobel Quest - Shared UI Components
 * 
 * This module provides reusable UI helpers and components
 * for displaying common elements across all games.
 * 
 * Usage:
 *   NobelUI.showToast('Score saved!', 'success')
 *   NobelUI.showLoading()
 *   NobelUI.renderLeaderboard(scores, 'leaderboard-container')
 */

const NobelUI = {
  /**
   * Show a toast notification
   * @param {string} message - Message to display
   * @param {string} type - 'success' | 'error' | 'info' | 'warning'
   * @param {number} duration - How long to show toast in ms (default: 3000)
   */
  showToast(message, type = 'info', duration = 3000) {
    const bgColor = {
      success: 'bg-green-500',
      error: 'bg-red-500',
      info: 'bg-blue-500',
      warning: 'bg-yellow-500'
    }[type] || 'bg-gray-500';

    const icon = {
      success: '✓',
      error: '✕',
      info: 'ℹ',
      warning: '⚠'
    }[type] || '';

    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 animate-slide-in`;
    toast.innerHTML = `
      <span class="text-xl font-bold">${icon}</span>
      <span>${message}</span>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('animate-fade-out');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },

  /**
   * Show loading spinner overlay
   * @param {string} message - Optional loading message
   */
  showLoading(message = 'Loading...') {
    // Remove existing spinner if any
    this.hideLoading();

    const spinner = document.createElement('div');
    spinner.id = 'nobel-loading';
    spinner.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    spinner.innerHTML = `
      <div class="bg-white p-8 rounded-lg shadow-xl text-center">
        <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
        <p class="text-gray-700 font-medium">${message}</p>
      </div>
    `;
    document.body.appendChild(spinner);
  },

  /**
   * Hide loading spinner
   */
  hideLoading() {
    const spinner = document.getElementById('nobel-loading');
    if (spinner) spinner.remove();
  },

  /**
   * Render a leaderboard table
   * @param {Array} scores - Array of score objects
   * @param {string} containerId - ID of container element
   * @param {Object} options - Display options
   */
  renderLeaderboard(scores, containerId, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container #${containerId} not found`);
      return;
    }

    const {
      title = 'Leaderboard',
      showTime = true,
      highlightUserId = null,
      emptyMessage = 'No scores yet. Be the first!'
    } = options;

    if (scores.length === 0) {
      container.innerHTML = `
        <div class="bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 class="text-2xl font-bold mb-4">${title}</h2>
          <p class="text-gray-500">${emptyMessage}</p>
        </div>
      `;
      return;
    }

    const tableRows = scores.map((score, index) => {
      const isCurrentUser = highlightUserId && score.userId === highlightUserId;
      const rankClass = index === 0 ? 'text-yellow-600 font-bold' : 
                       index === 1 ? 'text-gray-400 font-bold' :
                       index === 2 ? 'text-orange-600 font-bold' : '';
      const rowClass = isCurrentUser ? 'bg-blue-50 font-bold' : 'hover:bg-gray-50';
      
      return `
        <tr class="border-b ${rowClass}">
          <td class="py-3 px-4 ${rankClass}">${index + 1}</td>
          <td class="py-3 px-4">${score.userName}${isCurrentUser ? ' (You)' : ''}</td>
          <td class="text-right py-3 px-4 font-semibold">${score.score.toLocaleString()}</td>
          ${showTime ? `<td class="text-right py-3 px-4">${this.formatTime(score.timeSeconds)}</td>` : ''}
        </tr>
      `;
    }).join('');

    container.innerHTML = `
      <div class="bg-white rounded-lg shadow-lg p-6">
        <h2 class="text-2xl font-bold mb-4 text-gray-800">${title}</h2>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b-2 border-gray-300">
                <th class="text-left py-2 px-4">Rank</th>
                <th class="text-left py-2 px-4">Player</th>
                <th class="text-right py-2 px-4">Score</th>
                ${showTime ? '<th class="text-right py-2 px-4">Time</th>' : ''}
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  /**
   * Format time in seconds to readable string
   * @param {number} seconds - Time in seconds
   * @returns {string} Formatted time string
   */
  formatTime(seconds) {
    if (!seconds || seconds === 0) return '-';
    
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    
    if (mins > 0) {
      return `${mins}m ${secs}s`;
    }
    return `${secs}s`;
  },

  /**
   * Show a confirmation dialog
   * @param {string} message - Message to display
   * @param {Function} onConfirm - Callback when confirmed
   * @param {Function} onCancel - Callback when cancelled
   */
  showConfirm(message, onConfirm, onCancel = null) {
    const modal = document.createElement('div');
    modal.id = 'nobel-confirm';
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
      <div class="bg-white p-6 rounded-lg shadow-xl max-w-md">
        <p class="text-gray-800 mb-6">${message}</p>
        <div class="flex gap-4 justify-end">
          <button id="confirm-cancel" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
            Cancel
          </button>
          <button id="confirm-ok" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Confirm
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    document.getElementById('confirm-ok').addEventListener('click', () => {
      modal.remove();
      if (onConfirm) onConfirm();
    });
    
    document.getElementById('confirm-cancel').addEventListener('click', () => {
      modal.remove();
      if (onCancel) onCancel();
    });
  },

  /**
   * Display user stats card
   * @param {Object} stats - User statistics
   * @param {string} containerId - Container element ID
   */
  renderUserStats(stats, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="bg-white rounded-lg shadow-lg p-6">
        <h3 class="text-xl font-bold mb-4">Your Stats</h3>
        <div class="grid grid-cols-2 gap-4">
          <div class="text-center p-4 bg-blue-50 rounded">
            <div class="text-3xl font-bold text-blue-600">${stats.totalGames || 0}</div>
            <div class="text-sm text-gray-600">Games Played</div>
          </div>
          <div class="text-center p-4 bg-green-50 rounded">
            <div class="text-3xl font-bold text-green-600">${stats.bestScore || 0}</div>
            <div class="text-sm text-gray-600">Best Score</div>
          </div>
        </div>
      </div>
    `;
  }
};

// Make available globally
window.NobelUI = NobelUI;

console.log('✅ NobelUI module loaded');
