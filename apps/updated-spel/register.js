import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

// Firebase konfiguration
const firebaseConfig = {
    apiKey: "AIzaSyD_rYe_EMMxlIQ1CLzVly9UtfVROLwawpQ",
    authDomain: "te4-nobelquest.firebaseapp.com",
    projectId: "te4-nobelquest",
    storageBucket: "te4-nobelquest.firebasestorage.app",
    messagingSenderId: "1067428082128",
    appId: "1:1067428082128:web:a53068bd2ae98bb9c489d5"
};

// Initialisera Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// DOM-element
const form = document.getElementById("registerForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const registerBtn = document.getElementById("registerBtn");
const errorMessage = document.getElementById("errorMessage");

// Funktion för att visa felmeddelande
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
}

// Funktion för att dölja felmeddelande
function hideError() {
    errorMessage.textContent = "";
    errorMessage.style.display = "none";
}

// Funktion för att översätta Firebase-fel till svenska
function getErrorMessage(errorCode) {
    switch(errorCode) {
        case 'auth/email-already-in-use':
            return 'E-postadressen används redan av ett annat konto.';
        case 'auth/invalid-email':
            return 'Ogiltig e-postadress.';
        case 'auth/weak-password':
            return 'Lösenordet är för svagt. Använd minst 6 tecken.';
        case 'auth/operation-not-allowed':
            return 'Registrering är inte aktiverad.';
        default:
            return 'Ett fel uppstod. Försök igen.';
    }
}

// Hantera formulärinlämning
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideError();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    // Validering
    if (!email || !password) {
        showError("Vänligen fyll i alla fält.");
        return;
    }

    // Inaktivera knappen under registrering
    registerBtn.disabled = true;
    registerBtn.textContent = "Registrerar...";

    try {
        await createUserWithEmailAndPassword(auth, email, password);
        
        // Lyckad registrering
        alert("Konto skapat! Välkommen!");
        window.location.href = "../apps/demo-game/menu.html";
    } catch (error) {
        // Visa felmeddelande
        showError(getErrorMessage(error.code));
        
        // Återaktivera knappen
        registerBtn.disabled = false;
        registerBtn.textContent = "Registrera";
    }
});