/**
 * Nobel Quest - Shared Repository API
 * 
 * This module provides a simple wrapper around Firebase Firestore
 * for storing and retrieving game data (scores, progress, leaderboards).
 * 
 * Usage:
 *   await NobelRepo.submitScore('match-master', 1500, 45)
 *   const leaderboard = await NobelRepo.getLeaderboard('match-master', 10)
 *   await NobelRepo.saveProgress('timeline', { level: 3, completed: true })
 */

const NobelRepo = {
  /**
   * Submit a score for a game
   * @param {string} gameId - Game identifier ('match-master', 'timeline', 'trivia-rush')
   * @param {number} score - Player's score
   * @param {number} timeSeconds - Time taken in seconds (default: 0)
   * @param {Object} metadata - Additional game-specific data (default: {})
   * @returns {Promise<string>} Document ID of the created score
   * @throws {Error} If user is not logged in or submission fails
   */
  async submitScore(gameId, score, timeSeconds = 0, metadata = {}) {
    const user = firebaseAuth.currentUser;
    if (!user) {
      throw new Error('User must be logged in to submit scores');
    }

    const scoreData = {
      userId: user.uid,
      userName: user.displayName || 'Anonymous',
      userEmail: user.email,
      gameId,
      score,
      timeSeconds,
      metadata,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };

    try {
      const docRef = await firebaseDb.collection('scores').add(scoreData);
      console.log('✅ Score submitted:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('❌ Failed to submit score:', error.message);
      throw error;
    }
  },

  /**
   * Get leaderboard for a specific game
   * @param {string} gameId - Game identifier
   * @param {number} limit - Number of top scores to fetch (default: 10)
   * @returns {Promise<Array>} Array of score objects
   * @throws {Error} If fetch fails
   */
  async getLeaderboard(gameId, limit = 10) {
    try {
      const snapshot = await firebaseDb
        .collection('scores')
        .where('gameId', '==', gameId)
        .orderBy('score', 'desc')
        .orderBy('timestamp', 'asc') // Tie-breaker: earlier submission wins
        .limit(limit)
        .get();

      const scores = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate()
      }));

      console.log(`✅ Fetched ${scores.length} scores for ${gameId}`);
      return scores;
    } catch (error) {
      console.error('❌ Failed to fetch leaderboard:', error.message);
      throw error;
    }
  },

  /**
   * Get user's personal scores for a game
   * @param {string} gameId - Game identifier
   * @param {number} limit - Number of scores to fetch (default: 10)
   * @returns {Promise<Array>} Array of user's score objects
   * @throws {Error} If user is not logged in or fetch fails
   */
  async getUserScores(gameId, limit = 10) {
    const user = firebaseAuth.currentUser;
    if (!user) {
      throw new Error('User must be logged in');
    }

    try {
      const snapshot = await firebaseDb
        .collection('scores')
        .where('gameId', '==', gameId)
        .where('userId', '==', user.uid)
        .orderBy('score', 'desc')
        .limit(limit)
        .get();

      const scores = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate()
      }));

      console.log(`✅ Fetched ${scores.length} user scores for ${gameId}`);
      return scores;
    } catch (error) {
      console.error('❌ Failed to fetch user scores:', error.message);
      throw error;
    }
  },

  /**
   * Get user's best score for a game
   * @param {string} gameId - Game identifier
   * @returns {Promise<Object|null>} Best score object or null
   * @throws {Error} If user is not logged in or fetch fails
   */
  async getUserBestScore(gameId) {
    const scores = await this.getUserScores(gameId, 1);
    return scores.length > 0 ? scores[0] : null;
  },

  /**
   * Save user progress for a game (optional feature)
   * @param {string} gameId - Game identifier
   * @param {Object} progressData - Game state to save
   * @returns {Promise<void>}
   * @throws {Error} If user is not logged in or save fails
   */
  async saveProgress(gameId, progressData) {
    const user = firebaseAuth.currentUser;
    if (!user) {
      throw new Error('User must be logged in to save progress');
    }

    const docId = `${user.uid}_${gameId}`;
    
    try {
      await firebaseDb.collection('progress').doc(docId).set({
        userId: user.uid,
        gameId,
        data: progressData,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      }, { merge: true });

      console.log('✅ Progress saved for', gameId);
    } catch (error) {
      console.error('❌ Failed to save progress:', error.message);
      throw error;
    }
  },

  /**
   * Load user progress for a game
   * @param {string} gameId - Game identifier
   * @returns {Promise<Object|null>} Saved progress data or null if none exists
   * @throws {Error} If user is not logged in or load fails
   */
  async loadProgress(gameId) {
    const user = firebaseAuth.currentUser;
    if (!user) {
      throw new Error('User must be logged in to load progress');
    }

    const docId = `${user.uid}_${gameId}`;
    
    try {
      const doc = await firebaseDb.collection('progress').doc(docId).get();
      
      if (doc.exists) {
        console.log('✅ Progress loaded for', gameId);
        return doc.data().data;
      } else {
        console.log('ℹ️ No saved progress for', gameId);
        return null;
      }
    } catch (error) {
      console.error('❌ Failed to load progress:', error.message);
      throw error;
    }
  },

  /**
   * Get user's rank on the leaderboard
   * @param {string} gameId - Game identifier
   * @param {number} userScore - User's score to compare
   * @returns {Promise<number>} User's rank (1-based)
   */
  async getUserRank(gameId, userScore) {
    try {
      const snapshot = await firebaseDb
        .collection('scores')
        .where('gameId', '==', gameId)
        .where('score', '>', userScore)
        .get();

      const rank = snapshot.size + 1;
      console.log(`✅ User rank: ${rank}`);
      return rank;
    } catch (error) {
      console.error('❌ Failed to get user rank:', error.message);
      return null;
    }
  }
};

// Make available globally
window.NobelRepo = NobelRepo;

console.log('✅ NobelRepo module loaded');
