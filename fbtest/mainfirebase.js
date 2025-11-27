import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-analytics.js";
import { 
    getAuth, 
    GoogleAuthProvider, 
    signInWithPopup, 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

import {
    getFirestore,
    doc,
    setDoc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB8c8TZsDsgZaQx3t4DWm8x3e0QZHVbj0A",
  authDomain: "te4-nobel-quests.firebaseapp.com",
  projectId: "te4-nobel-quests",
  storageBucket: "te4-nobel-quests.firebasestorage.app",
  messagingSenderId: "1098687895626",
  appId: "1:1098687895626:web:bb4459a0ac7890792c6eb3",
  measurementId: "G-XPPM9PF0TW"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
auth.languageCode = 'en';

const provider = new GoogleAuthProvider();


// Save user to Firestore if new
async function registerUserInFirestore(user) {
    const userRef = doc(db, "users", user.uid);
    const snapshot = await getDoc(userRef);

    if (!snapshot.exists()) {
        await setDoc(userRef, {
            uid: user.uid,
            email: user.email,
            name: user.displayName || "No name",
            createdAt: new Date().toISOString()
        });
        console.log("User added to Firestore!");
    }
}


// --------------------
// GOOGLE LOGIN
// --------------------
const googleBtn = document.getElementById("google-login-btn");
if (googleBtn) {
    googleBtn.addEventListener("click", () => {
        signInWithPopup(auth, provider)
            .then(async (result) => {
                const user = result.user;
                await registerUserInFirestore(user);
                window.location.href = "logged.html";
            })
            .catch((error) => {
                alert(error.message);
            });
    });
}


// --------------------
// EMAIL/PASSWORD REGISTER
// --------------------
const registerBtn = document.getElementById("email-register-btn");
if (registerBtn) {
    registerBtn.addEventListener("click", () => {
        const email = document.getElementById("reg-email").value;
        const password = document.getElementById("reg-password").value;

        createUserWithEmailAndPassword(auth, email, password)
            .then(async (result) => {
                await registerUserInFirestore(result.user);
                window.location.href = "logged.html";
            })
            .catch(error => alert(error.message));
    });
}


// --------------------
// EMAIL/PASSWORD LOGIN
// --------------------
const loginBtn = document.getElementById("email-login-btn");
if (loginBtn) {
    loginBtn.addEventListener("click", () => {
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        signInWithEmailAndPassword(auth, email, password)
            .then(async (result) => {
                await registerUserInFirestore(result.user);
                window.location.href = "logged.html";
            })
            .catch(error => alert(error.message));
    });
}
