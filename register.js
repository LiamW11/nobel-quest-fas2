import { auth, db } from "../shared/firebase-config.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  doc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const form = document.getElementById("registerForm");
const emailInput = document.getElementById("email");
const saveButton = document.getElementById("saveEmail");
const messageDiv = document.getElementById("message");

const SHARED_PASSWORD = "Nobel2025!";

// 🔧 MOBILE FIX: Real-time input sanitization for mobile browsers
// Handles autocorrect, autocapitalize, and autofill artifacts
emailInput.addEventListener("input", (e) => {
  // Force lowercase and remove spaces (mobile keyboard artifacts)
  const sanitized = e.target.value.toLowerCase().replace(/\s+/g, "");
  if (e.target.value !== sanitized) {
    const cursorPos = e.target.selectionStart;
    e.target.value = sanitized;
    e.target.setSelectionRange(cursorPos, cursorPos);
  }

  // Enable submit button when email looks valid
  const hasValidFormat = sanitized.includes(".") && sanitized.includes("@");
  saveButton.disabled = !hasValidFormat;
});

// 🔧 MOBILE FIX: Handle autofill completion (fires after page load)
emailInput.addEventListener("change", (e) => {
  console.log("📧 Email changed (autofill?):", e.target.value);
  // Trigger input event to sanitize autofilled values
  emailInput.dispatchEvent(new Event("input"));
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    window.location.href = "mainMenu/menu.html";
  }
});

function showMessage(text, type) {
  messageDiv.textContent = text;
  messageDiv.className = `message ${type}`;
  messageDiv.classList.remove("hidden");
}

// 🔥 Extract "Melvin S. CLASS" with mobile browser hardening
function extractDisplayName(email, userClass) {
  // 🔧 MOBILE FIX: Aggressive normalization to handle mobile browser quirks
  // - Remove ALL whitespace (mobile keyboards can add spaces)
  // - Force lowercase (iOS Safari autocapitalizes)
  // - Trim each part separately (Android autofill artifacts)
  const normalizedEmail = email.toLowerCase().replace(/\s+/g, "");

  console.log("📧 Original email:", email);
  console.log("📧 Normalized email:", normalizedEmail);

  const beforeAt = normalizedEmail.split("@")[0];
  const parts = beforeAt
    .split(/[\.\-\_]/)
    .filter(Boolean)
    .map((p) => p.trim());

  console.log("📧 Extracted parts:", parts);

  // 🔧 FIX: Validate that email has both first and last name parts
  if (parts.length < 2) {
    throw new Error(
      "E-postadressen måste innehålla både förnamn och efternamn (t.ex. fornamn.efternamn@edu.huddinge.se)"
    );
  }

  const first = parts[0];
  // 🔧 FIX: Always use the LAST part as surname (handles middle names like aaaa.bbb.ccc)
  const last = parts[parts.length - 1];

  const firstFormatted =
    first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();
  const lastInitial = last.charAt(0).toUpperCase();

  const displayName = `${firstFormatted} ${lastInitial}. ${userClass}`;
  console.log("👤 Generated displayName:", displayName);

  // 🔧 FIX: Always include last initial (guaranteed by validation above)
  return displayName;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // 🔧 MOBILE FIX: Final sanitization pass to catch any browser artifacts
  // Mobile browsers can modify input values even after user finishes typing
  const email = emailInput.value.toLowerCase().replace(/\s+/g, "").trim();
  console.log("📧 Final email for submission:", email);

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

  // 🔧 FIX: Wrap displayName extraction in try-catch to handle validation errors
  let displayName;
  try {
    displayName = extractDisplayName(email, userClass);
  } catch (err) {
    showMessage(err.message, "error");
    saveButton.disabled = false;
    saveButton.textContent = "Registrera och börja spela";
    return;
  }

  try {
    let user;
    let isNewUser = false;

    try {
      // Try login
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        SHARED_PASSWORD
      );
      user = userCredential.user;
    } catch (loginError) {
      // If user doesn't exist → create account
      if (
        loginError.code === "auth/user-not-found" ||
        loginError.code === "auth/invalid-login-credentials" ||
        loginError.code === "auth/invalid-credential"
      ) {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          SHARED_PASSWORD
        );
        user = userCredential.user;
        isNewUser = true;
      } else {
        throw loginError;
      }
    }

    // 🔥 VIKTIGT: Uppdatera ALLTID Firestore OCH Auth-profil (även vid inloggning!)
    try {
      await updateProfile(user, { displayName });
    } catch (err) {
      console.error("❌ Kunde inte uppdatera auth profile:", err);
    }

    // 🔥 SEDAN: Uppdatera Firestore
    try {
      await setDoc(
        doc(db, "users", user.uid),
        {
          email: email,
          displayName: displayName,
          class: userClass,
          updatedAt: new Date().toISOString(),
          uid: user.uid,
        },
        { merge: true }
      );
    } catch (dbError) {
      console.error("❌ Fel vid uppdatering av användardokument:", dbError);
    }

    // Save locally
    localStorage.setItem("userEmail", email);
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userUid", user.uid);

    showMessage(
      isNewUser ? "Konto skapat och inloggad!" : "Inloggning lyckades!",
      "success"
    );

    setTimeout(() => {
      window.location.href = "../mainMenu/menu.html";
    }, 5000);
  } catch (error) {
    console.error(
      "Fel vid inloggning/registrering:",
      error.code,
      error.message
    );

    let errorMessage = "Ett fel uppstod. Vänligen försök igen.";
    if (error.code === "auth/email-already-in-use")
      errorMessage = "E-postadressen är redan registrerad.";
    else if (error.code === "auth/invalid-email")
      errorMessage = "Ogiltig e-postadress.";
    else if (error.code === "auth/operation-not-allowed")
      errorMessage = "E-post måste aktiveras i Firebase-konsolen.";
    else if (error.code === "auth/network-request-failed")
      errorMessage = "Nätverksfel. Kontrollera din internetanslutning.";

    showMessage(errorMessage, "error");
    saveButton.disabled = false;
    showMessage(errorMessage, "error");
    saveButton.disabled = false;
    saveButton.textContent = "Registrera och börja spela";
  }
});
