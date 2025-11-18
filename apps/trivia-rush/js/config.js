/**
 * Nobel Trivia Rush - Configuration and Initialization
 * 
 * This file handles:
 * - Authentication state management
 * - Login/logout functionality
 * - Leaderboard loading
 * - Game initialization
 */

// Game identifier for leaderboard
const GAME_ID = 'trivia-rush';

// DOM Elements
const authSection = document.getElementById('auth-section');
const gameSection = document.getElementById('game-section');
const userName = document.getElementById('user-name');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');

/**
 * Handle authentication state changes
 */
NobelAuth.onAuthChange(user => {
  if (user) {
    // User logged in - show game
    authSection.classList.add('hidden');
    gameSection.classList.remove('hidden');
    userName.textContent = user.displayName || 'Player';
    
    // Load leaderboard
    loadLeaderboard();
    
    console.log('User logged in:', user.displayName);
  } else {
    // User logged out - show auth screen
    authSection.classList.remove('hidden');
    gameSection.classList.add('hidden');
    
    console.log('User logged out');
  }
});

/**
 * Login button handler
 */
loginBtn.addEventListener('click', async () => {
  try {
    NobelUI.showLoading('Logging in...');
    await NobelAuth.loginWithGoogle();
    NobelUI.hideLoading();
    NobelUI.showToast('Login successful! Ready to play!', 'success');
  } catch (error) {
    NobelUI.hideLoading();
    NobelUI.showToast('Login failed. Please try again.', 'error');
    console.error('Login error:', error);
  }
});

/**
 * Logout button handler
 */
logoutBtn.addEventListener('click', async () => {
  NobelUI.showConfirm(
    'Are you sure you want to logout?',
    async () => {
      try {
        await NobelAuth.logout();
        NobelUI.showToast('Logged out successfully', 'info');
      } catch (error) {
        NobelUI.showToast('Logout failed', 'error');
        console.error('Logout error:', error);
      }
    }
  );
});

/**
 * Load and display leaderboard
 */
async function loadLeaderboard() {
  try {
    const scores = await NobelRepo.getLeaderboard(GAME_ID, 10);
    const currentUserId = NobelAuth.getUserId();
    
    NobelUI.renderLeaderboard(scores, 'leaderboard', {
      title: '🏆 Top Players',
      showTime: true,
      highlightUserId: currentUserId,
      emptyMessage: 'No scores yet. Be the first to play!'
    });
  } catch (error) {
    console.error('Failed to load leaderboard:', error);
    NobelUI.showToast('Could not load leaderboard', 'warning');
  }
}

/**
 * Submit score to leaderboard
 * Called from game.js when game ends
 */
async function submitGameScore(score, timeSeconds, metadata = {}) {
  try {
    NobelUI.showLoading('Submitting score...');
    
    await NobelRepo.submitScore(GAME_ID, score, timeSeconds, metadata);
    
    NobelUI.hideLoading();
    NobelUI.showToast('🎉 Score submitted!', 'success');
    
    // Refresh leaderboard
    await loadLeaderboard();
    
  } catch (error) {
    NobelUI.hideLoading();
    NobelUI.showToast('Failed to submit score', 'error');
    console.error('Submit score error:', error);
  }
}

/**
 * Start game handler
 */
startBtn.addEventListener('click', () => {
  if (window.startGame && typeof window.startGame === 'function') {
    window.startGame();
    startBtn.disabled = true;
    resetBtn.disabled = false;
  } else {
    console.error('startGame function not found');
    NobelUI.showToast('Game initialization failed', 'error');
  }
});

/**
 * Reset game handler
 */
resetBtn.addEventListener('click', () => {
  if (window.resetGame && typeof window.resetGame === 'function') {
    window.resetGame();
    startBtn.disabled = false;
    resetBtn.disabled = true;
  }
});

// Make functions available globally
window.submitGameScore = submitGameScore;
window.loadLeaderboard = loadLeaderboard;

console.log('✅ Trivia Rush config loaded');
