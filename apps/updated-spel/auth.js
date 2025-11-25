import { auth, db } from "./firebase-config.js";
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    setPersistence,
    browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Sätt persistence till LOCAL (håller användaren inloggad för evigt)
setPersistence(auth, browserLocalPersistence)
    .catch((error) => {
        console.error("Kunde inte sätta persistence:", error);
    });

// 🔹 Login / skapa ägare
export async function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        // Försök logga in
        await signInWithEmailAndPassword(auth, email, password);
        window.location.replace("meny.html");

    } catch (error) {

        if (error.code === "auth/user-not-found") {

            const ownerRef = doc(db, "meta", "owner");
            const ownerSnap = await getDoc(ownerRef);

            if (ownerSnap.exists()) {
                alert("Det finns redan ett konto. Du kan inte skapa fler.");
                return;
            }

            const userCred = await createUserWithEmailAndPassword(auth, email, password);
            const uid = userCred.user.uid;

            await setDoc(ownerRef, {
                ownerUid: uid,
                email: email,
                createdAt: new Date()
            });

            await setDoc(doc(db, "users", uid), {
                email: email,
                createdAt: new Date()
            });

            window.location.replace("meny.html");

        } else {
            alert("Fel: " + error.message);
        }
    }
}

// 🔹 Auth-guard (ska köras på varje skyddad sida)
export function protectPage() {
    onAuthStateChanged(auth, user => {
        if (!user) {
            window.location.replace("login.html");
        }
    });
}

// 🔹 Blockera back-knapp på skyddad sida
export function blockBackButton() {
    history.pushState(null, null, location.href);
    window.onpopstate = function () {
        history.go(1);
    };
}