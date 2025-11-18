/**
 * Nobel Match Master - Game Logic
 * 
 * TODO: Implement game logic here
 * This is a placeholder that will be replaced with actual game code
 * 
 * Reference the Fas-1 version for game mechanics:
 * - Card flipping
 * - Match detection
 * - Scoring system
 * - Timer
 */

// Game state
let gameState = {
  cards: [],
  flippedCards: [],
  matchedPairs: 0,
  score: 0,
  timeElapsed: 0,
  timerInterval: null,
  isPlaying: false
};

/**
 * Start the game
 */
function startGame() {
  console.log('Starting Match Master game...');
  
  // Reset game state
  gameState = {
    cards: [],
    flippedCards: [],
    matchedPairs: 0,
    score: 0,
    timeElapsed: 0,
    timerInterval: null,
    isPlaying: true
  };
  
  // Update UI
  updateGameUI();
  
  // Start timer
  startTimer();
  
  // TODO: Initialize game board with Nobel Prize data
  // For now, show placeholder
  renderPlaceholderGame();
  
  NobelUI.showToast('Game started! Good luck!', 'info');
}

/**
 * Reset the game
 */
function resetGame() {
  console.log('Resetting game...');
  
  // Stop timer
  if (gameState.timerInterval) {
    clearInterval(gameState.timerInterval);
  }
  
  // Reset state
  gameState.isPlaying = false;
  gameState.score = 0;
  gameState.matchedPairs = 0;
  gameState.timeElapsed = 0;
  
  // Update UI
  updateGameUI();
  
  // Clear game container
  const container = document.getElementById('game-container');
  container.innerHTML = '<p class="text-center text-gray-500">Click "Start Game" to begin!</p>';
}

/**
 * Start the game timer
 */
function startTimer() {
  gameState.timerInterval = setInterval(() => {
    gameState.timeElapsed++;
    updateTimerDisplay();
  }, 1000);
}

/**
 * Update timer display
 */
function updateTimerDisplay() {
  const minutes = Math.floor(gameState.timeElapsed / 60);
  const seconds = gameState.timeElapsed % 60;
  const display = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  
  document.getElementById('timer-display').textContent = display;
}

/**
 * Update game UI (score, matches, etc.)
 */
function updateGameUI() {
  document.getElementById('score-display').textContent = gameState.score;
  document.getElementById('matches-display').textContent = gameState.matchedPairs;
  updateTimerDisplay();
}

/**
 * End the game and submit score
 */
function endGame() {
  console.log('Game ended!');
  
  // Stop timer
  if (gameState.timerInterval) {
    clearInterval(gameState.timerInterval);
  }
  
  gameState.isPlaying = false;
  
  // Show completion message
  NobelUI.showToast(`Game complete! Score: ${gameState.score}`, 'success');
  
  // Submit score
  const metadata = {
    matches: gameState.matchedPairs,
    difficulty: 'medium' // TODO: Add difficulty selection
  };
  
  submitGameScore(gameState.score, gameState.timeElapsed, metadata);
}

/**
 * Render placeholder game (to be replaced with actual game)
 */
function renderPlaceholderGame() {
  const container = document.getElementById('game-container');
  
  container.innerHTML = `
    <div class="text-center">
      <h3 class="text-xl font-bold mb-4">🚧 Game Implementation Pending</h3>
      <p class="text-gray-600 mb-4">
        This is a placeholder. The actual match master game logic
        will be implemented by the game team using the Fas-1 version as reference.
      </p>
      <div class="grid grid-cols-4 gap-4 max-w-md mx-auto">
        ${Array(8).fill(0).map((_, i) => `
          <div class="aspect-square bg-gradient-to-br from-blue-400 to-purple-400 rounded-lg flex items-center justify-center text-white text-2xl cursor-pointer hover:scale-105 transition">
            ${i + 1}
          </div>
        `).join('')}
      </div>
      <button onclick="endGame()" class="nobel-btn nobel-btn-primary mt-6">
        🎯 Finish Game (Test)
      </button>
    </div>
  `;
}

// Export functions
window.startGame = startGame;
window.resetGame = resetGame;
window.endGame = endGame;

console.log('✅ Match Master game logic loaded');
