import { auth } from '../shared/firebase-config.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

//kontrollera om användaren är inloggad
export function requireAuth(redirectTo = 'register.html') {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // Användaren är inloggad
        console.log("Användaren är inloggad:", user.uid);
        resolve(user);
      } else {
        // Användaren är inte inloggad, omdirigera till inloggningssidan
        console.log("Användaren är inte inloggad");
        window.location.href = redirectTo;
        reject(new Error("Användaren är inte inloggad"));
      }
    });
  });
}

export function getUserEmail() {
  return localStorage.getItem('userEmail');
}

export function isUserLoggedIn() {
  return localStorage.getItem('isLoggedIn') === 'true';
}

export function initAutoAuth() {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', user.email);
      console.log("Användaren är aktiv");
    }
  });
}
