import { auth, db } from "./firebase-config.js";
import { 
    createUserWithEmailAndPassword,
    setPersistence,
    browserLocalPersistence 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Sätt persistence till LOCAL (håller användaren inloggad för evigt)
setPersistence(auth, browserLocalPersistence)
    .catch((error) => {
        console.error("Kunde inte sätta persistence:", error);
    });

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
        // Kontrollera om det redan finns en ägare
        const ownerRef = doc(db, "meta", "owner");
        const ownerSnap = await getDoc(ownerRef);

        if (ownerSnap.exists()) {
            showError("Det finns redan ett konto. Du kan inte skapa fler.");
            registerBtn.disabled = false;
            registerBtn.textContent = "Registrera";
            return;
        }

        // Skapa användare
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        const uid = userCred.user.uid;

        // Spara som ägare
        await setDoc(ownerRef, {
            ownerUid: uid,
            email: email,
            createdAt: new Date()
        });

        // Spara användardata
        await setDoc(doc(db, "users", uid), {
            email: email,
            createdAt: new Date()
        });

        // Lyckad registrering
        alert("Konto skapat! Välkommen!");
        window.location.href = "meny.html";
        
    } catch (error) {
        // Visa felmeddelande
        showError(getErrorMessage(error.code));
        
        // Återaktivera knappen
        registerBtn.disabled = false;
        registerBtn.textContent = "Registrera";
    }
});