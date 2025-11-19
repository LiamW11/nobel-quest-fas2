
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-analytics.js";
  import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

 
  const firebaseConfig = {
    apiKey: "AIzaSyB8c8TZsDsgZaQx3t4DWm8x3e0QZHVbj0A",
    authDomain: "te4-nobel-quests.firebaseapp.com",
    projectId: "te4-nobel-quests",
    storageBucket: "te4-nobel-quests.firebasestorage.app",
    messagingSenderId: "1098687895626",
    appId: "1:1098687895626:web:bb4459a0ac7890792c6eb3",
    measurementId: "G-XPPM9PF0TW"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const auth = getAuth(app);
  auth.languageCode = 'en';
  const provider = new GoogleAuthProvider();

  const googleLogin = document.getElementById('google-login-btn');
  googleLogin.addEventListener('click', () => {
    alert('Logging in with Google account'); //så att vi ser att knappenn funkar
    signInWithPopup(auth, provider)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    // The signed-in user info.
    const user = result.user;
    // IdP data available using getAdditionalUserInfo(result)
    // ...
    console.log('User signed in: ', user);
    window.location.href = "logged.html";
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;

  });
  });
