import { auth, db } from "./shared/firebase-config.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  doc,
  setDoc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const SHARED_PASSWORD = "Nobel2025!";

// 🚫 PROFANITY FILTER - Ladda blockerade ord från JSON
let BLOCKED_WORDS = [];

// Ladda blocked words från JSON-fil
async function loadBlockedWords() {
  try {
    const response = await fetch('./blocked-words.json');
    const data = await response.json();
    BLOCKED_WORDS = data.blockedWords;
    console.log(`✅ Loaded ${BLOCKED_WORDS.length} blocked words`);
  } catch (error) {
    console.error('❌ Failed to load blocked words:', error);
    // Fallback till tom array om filen inte hittas
    BLOCKED_WORDS = [];
  }
}

// Kör laddning av blockerade ord direkt
await loadBlockedWords();

// 🔍 Funktion för att hitta blockerade ord
function containsBlockedWords(text) {
  if (!text || BLOCKED_WORDS.length === 0) return false;
  
  // Normalisera text: lowercase + ta bort mellanslag/specialtecken
  const normalized = text.toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[0-9@$]/g, match => {
      // Konvertera leetspeak tillbaka till bokstäver
      const leet = { '0': 'o', '1': 'i', '3': 'e', '4': 'a', '5': 's', '7': 't', '8': 'b', '@': 'a', '$': 's' };
      return leet[match] || match;
    });
  
  // Kolla om någon del av texten innehåller blockerade ord
  return BLOCKED_WORDS.some(word => {
    // Exakt match eller innehåller ordet
    return normalized === word || normalized.includes(word);
  });
}

// 🛡️ Validera namn-delar (förnamn/efternamn)
function validateNameParts(firstName, lastName) {
  // Kolla längd
  if (firstName.length < 2 || lastName.length < 2) {
    throw new Error('För- och efternamn måste vara minst 2 tecken långa.');
  }
  
  // Bara bokstäver (svenska alfabetet)
  const namePattern = /^[a-zåäöéü]+$/i;
  if (!namePattern.test(firstName) || !namePattern.test(lastName)) {
    throw new Error('Namnet får bara innehålla bokstäver (a-ö).');
  }
  
  // Kolla mot blockerade ord
  if (containsBlockedWords(firstName)) {
    throw new Error('Denna mail existerar inte, ange din skolmail');
  }
  
  if (containsBlockedWords(lastName)) {
    throw new Error('Denna mail existerar inte, ange din skolmail');
  }
  
  return true;
}

// 📊 Logga försök till blockerade namn
function logBlockedAttempt(email, reason) {
  console.warn(`🚫 Blocked registration attempt:`, {
    email: email,
    reason: reason,
    timestamp: new Date().toISOString()
  });
}

// 🔧 TESTING HELPER: Expose logout function globally for console testing
window.testLogout = async function () {
  try {
    await auth.signOut();
    localStorage.clear();
    console.log(
      "✅ Logged out successfully - refresh page to test registration"
    );
    setTimeout(() => window.location.reload(), 500);
  } catch (error) {
    console.error("❌ Logout error:", error);
  }
};

console.log("💡 TIP: To test registration, open console and run: testLogout()");

// 🔧 CRITICAL MOBILE FIX: Wait for DOM to be fully loaded
// Mobile browsers often execute scripts before DOM is ready
let form, emailInput, saveButton, messageDiv, classSelect;

// 🔧 MOBILE FIX: Comprehensive validation function
function validateFormInputs() {
  if (!emailInput || !classSelect || !saveButton) {
    console.error("❌ DOM elements not ready!");
    return false;
  }

  const sanitized = emailInput.value.toLowerCase().replace(/\s+/g, "");
  const classSelected = classSelect.value !== "Placeholder";

  // Check if email has proper format AND correct domain
  const hasProperStructure = sanitized.includes(".") && sanitized.includes("@");
  const hasValidDomain =
    sanitized.endsWith("@edu.huddinge.se") ||
    sanitized.endsWith("@huddinge.se");

  // Only enable if BOTH email is complete AND class is selected
  const isValid = hasProperStructure && hasValidDomain && classSelected;

  saveButton.disabled = !isValid;

  // Visual feedback
  if (sanitized.length > 0 && !hasValidDomain && hasProperStructure) {
    emailInput.style.borderColor = "#ef4444"; // Red for wrong domain
  } else if (isValid) {
    emailInput.style.borderColor = "#22c55e"; // Green for valid
  } else {
    emailInput.style.borderColor = "#C5A572"; // Default gold
  }

  return isValid;
}

// 🔧 CRITICAL: Initialize everything after DOM is ready
function initializeForm() {
  // Get DOM elements
  form = document.getElementById("registerForm");
  emailInput = document.getElementById("email");
  saveButton = document.getElementById("saveEmail");
  messageDiv = document.getElementById("message");
  classSelect = document.querySelector("select[name='klass']");

  // Verify elements exist
  if (!form || !emailInput || !saveButton || !messageDiv || !classSelect) {
    console.error("❌ Critical DOM elements missing!");
    return;
  }

  console.log("✅ DOM elements loaded successfully");

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

    // Run comprehensive validation
    validateFormInputs();
  });

  // 🔧 MOBILE FIX: Validate when class selection changes
  classSelect.addEventListener("change", () => {
    validateFormInputs();
  });

  // 🔧 MOBILE FIX: Handle autofill completion (fires after page load)
  emailInput.addEventListener("change", (e) => {
    // Trigger input event to sanitize autofilled values
    emailInput.dispatchEvent(new Event("input"));
  });

  // Setup form submit handler
  setupFormSubmit();

  // Initial validation check
  validateFormInputs();
}

// Wait for DOM to be ready - works on all browsers including mobile
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeForm);
} else {
  // DOM already loaded
  initializeForm();
}

// 🔧 FIX: Prevent auto-redirect during registration
let isRegistering = false;

onAuthStateChanged(auth, (user) => {
  // Don't redirect if we're in the middle of registration
  // The form submit will handle the redirect after Firestore is saved
  if (user && !isRegistering) {
    window.location.href = "mainMenu/menu.html";
  }
});

function showMessage(text, type) {
  messageDiv.textContent = text;
  messageDiv.className = `message ${type}`;
  messageDiv.classList.remove("hidden");
}

// 🔥 Extract "Melvin S. CLASS" with mobile browser hardening + PROFANITY FILTER
function extractDisplayName(email, userClass) {
  // 🔧 MOBILE FIX: Aggressive normalization to handle mobile browser quirks
  const normalizedEmail = email.toLowerCase().replace(/\s+/g, "");

  const beforeAt = normalizedEmail.split("@")[0];
  const parts = beforeAt
    .split(/[\.\-\_]/)
    .filter(Boolean)
    .map((p) => p.trim());

  // 🔧 FIX: Validate that email has both first and last name parts
  if (parts.length < 2) {
    throw new Error(
      "E-postadressen måste innehålla både förnamn och efternamn (t.ex. fornamn.efternamn@edu.huddinge.se)"
    );
  }

  const first = parts[0];
  const last = parts[parts.length - 1];

  // 🚫 VALIDERA NAMN MOT PROFANITY FILTER
  try {
    validateNameParts(first, last);
  } catch (error) {
    logBlockedAttempt(email, error.message);
    throw error; // Kasta vidare felet till användaren
  }

  const firstFormatted =
    first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();
  const lastInitial = last.charAt(0).toUpperCase();

  const displayName = `${firstFormatted} ${lastInitial}. ${userClass}`;

  return displayName;
}

function setupFormSubmit() {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // 🔧 MOBILE FIX: Final sanitization pass to catch any browser artifacts
    const email = emailInput.value.toLowerCase().replace(/\s+/g, "").trim();

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
    if (
      !email.endsWith("@edu.huddinge.se") &&
      !email.endsWith("@huddinge.se")
    ) {
      showMessage("Endast edu.huddinge.se/huddinge.se är tillåtna.", "error");
      return;
    }

    saveButton.disabled = true;
    saveButton.textContent = "Sparar...";

    // 🔧 FIX: Prevent race condition - block auto-redirect during registration
    isRegistering = true;

    // 🔧 FIX: Wrap displayName extraction in try-catch to handle validation errors
    let displayName;
    try {
      displayName = extractDisplayName(email, userClass);
    } catch (err) {
      showMessage(err.message, "error");
      saveButton.disabled = false;
      saveButton.textContent = "Start Quest!";
      isRegistering = false;
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

      // 🔥 FIX: ALWAYS update Firestore (both new users AND returning users)
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

      // 🔥 FIX: Update Auth profile with displayName
      await updateProfile(user, { displayName });
      await user.reload();

      // Save locally
      localStorage.setItem("userEmail", email);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userUid", user.uid);
      localStorage.setItem("displayName", displayName);
      localStorage.setItem("userClass", userClass);

      showMessage(
        isNewUser ? "Konto skapat och inloggad!" : "Inloggning lyckades!",
        "success"
      );

      // 🔧 FIX: Now safe to redirect - Firestore is saved
      isRegistering = false;
      setTimeout(() => {
        window.location.href = "mainMenu/menu.html";
      }, 1500);
    } catch (error) {
      // 🔧 FIX: Re-enable auto-redirect on error
      isRegistering = false;
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
      saveButton.textContent = "Start Quest!";
    }
  });
}