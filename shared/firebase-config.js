import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyD_rYe_EMMxlIQ1CLzVly9UtfVROLwawpQ",
    authDomain: "te4-nobelquest.firebaseapp.com",
    projectId: "te4-nobelquest",
    storageBucket: "te4-nobelquest.firebasestorage.app",
    messagingSenderId: "1067428082128",
    appId: "1:1067428082128:web:a53068bd2ae98bb9c489d5",
    measurementId: "G-NMF366H8XL"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
