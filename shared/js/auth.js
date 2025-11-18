/**
 * Nobel Quest - Shared Authentication Module
 * 
 * This module provides a simple wrapper around Firebase Authentication
 * with Google Sign-In for all Nobel Quest games.
 * 
 * Usage:
 *   await NobelAuth.loginWithGoogle()
 *   await NobelAuth.logout()
 *   const user = NobelAuth.getCurrentUser()
 *   NobelAuth.onAuthChange(user => { ... })
 */

const NobelAuth = {
  /**
   * Login with Google using popup
   * @returns {Promise<firebase.User>} The logged in user
   * @throws {Error} If login fails
   */
  async loginWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
      const result = await firebaseAuth.signInWithPopup(provider);
      console.log('✅ Login successful:', result.user.displayName);
      return result.user;
    } catch (error) {
      console.error('❌ Login failed:', error.message);
      throw error;
    }
  },

  /**
   * Logout the current user
   * @returns {Promise<void>}
   * @throws {Error} If logout fails
   */
  async logout() {
    try {
      await firebaseAuth.signOut();
      console.log('✅ Logout successful');
    } catch (error) {
      console.error('❌ Logout failed:', error.message);
      throw error;
    }
  },

  /**
   * Get the currently logged in user
   * @returns {firebase.User|null} The current user or null if not logged in
   */
  getCurrentUser() {
    return firebaseAuth.currentUser;
  },

  /**
   * Listen to authentication state changes
   * @param {Function} callback - Called with user object (or null) when auth state changes
   * @returns {Function} Unsubscribe function
   */
  onAuthChange(callback) {
    return firebaseAuth.onAuthStateChanged(callback);
  },

  /**
   * Check if a user is currently logged in
   * @returns {boolean} True if user is logged in
   */
  isLoggedIn() {
    return firebaseAuth.currentUser !== null;
  },

  /**
   * Get user display name
   * @returns {string} User's display name or 'Guest'
   */
  getUserName() {
    const user = firebaseAuth.currentUser;
    return user ? (user.displayName || 'Guest') : 'Not logged in';
  },

  /**
   * Get user email
   * @returns {string|null} User's email or null
   */
  getUserEmail() {
    const user = firebaseAuth.currentUser;
    return user ? user.email : null;
  },

  /**
   * Get user ID
   * @returns {string|null} User's unique ID or null
   */
  getUserId() {
    const user = firebaseAuth.currentUser;
    return user ? user.uid : null;
  }
};

// Make available globally
window.NobelAuth = NobelAuth;

console.log('✅ NobelAuth module loaded');
