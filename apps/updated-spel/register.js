import {auth, db} from './firebase-config.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { doc, setDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

const form = document.getElementById('registerForm');
const emailInput = document.getElementById('email');
const saveButton = document.getElementById('saveEmail');
const messageDiv = document.getElementById('message');

const SHARED_PASSWORD = "Nobel2025!";

function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    messageDiv.classList.remove('hidden');
}

form.addeventListener("submit", async (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();

    //validate email format
    if (!email) {
        showMessage("Vänligen ange en giltig e-postadress.", "error");
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showMessage("Vänligen ange en giltig edu-adress.", "error");
        return;
    }

    saveButton.disabled = true;
    saveButton.textContent = "Sparar...";

    try {
        let user;
        let isNewUser = false;

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, SHARED_PASSWORD);
            user = userCredential.user;
            console.log("Inloggning lyckades för användare:", user.uid);
        } catch (loginError) {
            if (loginError.code === 'auth/user-not-found' ||
                loginError.code === 'auth/invalid-credentials' ||
                loginError.code === 'auth/invalid-login-credentials') {

                const userCredential = await createUserWithEmailAndPassword(auth, email, SHARED_PASSWORD);
                user = userCredential.user;
                isNewUser = true;
                console.log("Användare skapad");

                try {
                    await setDoc(doc(db, "users", user.uid), {
                        email: email,
                        createdAt: new Date().toISOString(),
                        uid: user.uid
                    });
                } catch (dbError) {
                    console.error("Fel vid skapande av användardokument:", dbError);
                }

            } else {
                throw loginError;
            }
        }

        //spara localt för permanent inloggning
        localStorage.setItem("userEmail", email);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userUid", user.uid);

        showMessage(isNewUser ? "Konto skapat och inloggad!" : "Inloggning lyckades!", "success");

        //omdirigera till meny-sidan efter en kort fördröjning
        setTimeout(() => {
            window.location.href = "menu.html";
        }, 1500);

    } catch (error) {
        console.error("Fel vid inloggning/registrering:", error.code, error.message);

        let errorMessage = "Ett fel uppstod. Vänligen försök igen.";
        if (error.code === 'auth/email-already-in-use') {
         errorMessage = "E-postadressen är redan registreradd.";
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = "Ogiltig e-postadress.";
        } else if (error.code === 'auth/operation-not-allowed') {
            errorMessage = "E-post måste aktiveras i Firebase-konsolen.";
        } else if (error.code === 'auth/network-request-failed') {
            errorMessage = "Nätverksfel. Kontrollera din internetanslutning.";
        }

        showMessage(errorMessage, "error");
        saveButton.disabled = false;
        saveButton.textContent = "Spara e-post";
    }
}); 


