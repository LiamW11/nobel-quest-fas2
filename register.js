import { auth, db } from '../shared/firebase-config.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { doc, setDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

const form = document.getElementById('registerForm');
const emailInput = document.getElementById('email');
const saveButton = document.getElementById('saveEmail');
const messageDiv = document.getElementById('message');

const SHARED_PASSWORD = "Nobel2025!";

// AV för tillfället, avkommentera för 
// att sätta igång perma login
 onAuthStateChanged(auth, (user) => {
    if (user) {
//      om loggad in, skicka till huvudmenyn
      window.location.href = 'mainMenu/menu.html';
    }
  });


function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    messageDiv.classList.remove('hidden');
}

// 🔥 Extract "Melvin S. CLASS"
function extractDisplayName(email, userClass) {
    const beforeAt = email.split("@")[0];
    const parts = beforeAt.split(/[\.\-\_]/).filter(Boolean);

    const first = parts[0] || "";
    const last = parts[1] || "";

    const firstFormatted = first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();
    const lastInitial = last ? last.charAt(0).toUpperCase() : "";

    const name = lastInitial ? `${firstFormatted} ${lastInitial}.` : firstFormatted;
    return `${name} ${userClass}`;
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const userClass = form.querySelector("select[name='klass']").value;

    // Class validation
    if (userClass === "Placeholder") {
        showMessage("Välj en klass.", "error");
        return;
    }

    // Empty validation
    if (!email) {
        showMessage("Vänligen ange en e-postadress.", "error");
        return;
    }

    // 🔥 EDU email restriction
    if (!email.endsWith("@edu.huddinge.se") && !email.endsWith("@huddinge.se")) {
        showMessage("Endast edu.huddinge.se/huddinge.se är tillåtna.", "error");
        return;
    }

    saveButton.disabled = true;
    saveButton.textContent = "Sparar...";

    const displayName = extractDisplayName(email, userClass);
    console.log("Generated displayName:", displayName);

    try {
        let user;
        let isNewUser = false;

        try {
            // Try login
            const userCredential = await signInWithEmailAndPassword(auth, email, SHARED_PASSWORD);
            user = userCredential.user;
            console.log("Inloggning lyckades för användare:", user.uid);

        } catch (loginError) {

            // If user doesn't exist → create account
            if (
                loginError.code === 'auth/user-not-found' ||
                loginError.code === 'auth/invalid-login-credentials' ||
                loginError.code === 'auth/invalid-credential'
            ) {
                const userCredential = await createUserWithEmailAndPassword(auth, email, SHARED_PASSWORD);
                user = userCredential.user;
                isNewUser = true;
                console.log("Användare skapad:", user.uid);

            } else {
                throw loginError;
            }
        }

        // 🔥 VIKTIGT: Uppdatera ALLTID Firestore OCH Auth-profil (även vid inloggning!)
        try {
            await setDoc(doc(db, "users", user.uid), {
                email: email,
                displayName: displayName,
                class: userClass,
                updatedAt: new Date().toISOString(),
                uid: user.uid
            }, { merge: true });
            console.log("Firestore-dokument uppdaterat med displayName:", displayName);
        } catch (dbError) {
            console.error("Fel vid uppdatering av användardokument:", dbError);
        }

        // 🔥 Uppdatera Auth-profil med det nya namnet
        try {
            await updateProfile(user, { displayName });
            await auth.currentUser.reload();
            console.log("✅ User reloadad, nytt displayName:", auth.currentUser.displayName);
            console.log("Auth-profil uppdaterad med displayName:", displayName);
        } catch (err) {
            console.warn("Kunde inte uppdatera auth profile:", err);
        }
        

        // Save locally
        localStorage.setItem("userEmail", email);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userUid", user.uid);

        showMessage(isNewUser ? "Konto skapat och inloggad!" : "Inloggning lyckades!", "success");

        setTimeout(() => {
            window.location.href = "../mainMenu/menu.html";
        }, 1500);

    } catch (error) {
        console.error("Fel vid inloggning/registrering:", error.code, error.message);

        let errorMessage = "Ett fel uppstod. Vänligen försök igen.";
        if (error.code === 'auth/email-already-in-use') errorMessage = "E-postadressen är redan registrerad.";
        else if (error.code === 'auth/invalid-email') errorMessage = "Ogiltig e-postadress.";
        else if (error.code === 'auth/operation-not-allowed') errorMessage = "E-post måste aktiveras i Firebase-konsolen.";
        else if (error.code === 'auth/network-request-failed') errorMessage = "Nätverksfel. Kontrollera din internetanslutning.";

        showMessage(errorMessage, "error");
        saveButton.disabled = false;
        saveButton.textContent = "Registrera och börja spela";
    }
});