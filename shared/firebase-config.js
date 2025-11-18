/**
 * Nobel Quest - Firebase Configuration
 * 
 * This file initializes Firebase for all Nobel Quest games.
 * Replace the placeholder values with your actual Firebase project credentials.
 * 
 * To get these values:
 * 1. Go to https://console.firebase.google.com/
 * 2. Select your project
 * 3. Click on the gear icon > Project settings
 * 4. Scroll down to "Your apps" > Web app > Firebase SDK snippet
 */

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Export Firebase instances for use in other modules
window.firebaseAuth = firebase.auth();
window.firebaseDb = firebase.firestore();

console.log('✅ Firebase initialized successfully');
