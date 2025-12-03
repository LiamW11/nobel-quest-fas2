
import { auth, db } from '../firebase-config.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Funktion för att städa upp visningsnamnet genom att ta bort klassinfo.
// Den letar efter klassnamn (t.ex. NASA24, KLASS9C) i slutet.
function cleanDisplayName(name) {
    if (!name) return "";
    // Regex: Matchar alla versaler, siffror eller kombinationer i slutet av namnet (efter ett mellanslag)
    // Exempel: "Greger S. NASA24" blir "Greger S."
    return name.replace(/\s[A-Z0-9\.\_\-]+$/, '');
}

// Funktion för att få två bokstäver från namnet
function getInitials(name) {
    if (!name) return "?";
    
    // Ta bort extra mellanslag och dela upp namnet
    const parts = name.trim().split(/\s+/);
    
    if (parts.length === 1) {
        // Om bara ett ord (t.ex. "Malte" eller "malte.mohr"), ta första två bokstäver
        return parts[0].substring(0, 2).toUpperCase();
    } else {
        // Om flera ord, ta första bokstaven från första och andra ordet
        return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
    }
}

// Ladda header automatiskt när sidan laddas
window.addEventListener('DOMContentLoaded', async () => {
  try {
    // FIX FÖR 404: Använder den stabila sökvägen från HTML-sidans rot
    const response = await fetch('../../shared/components/header.html'); 
    const html = await response.text();
    document.getElementById('header-container').innerHTML = html;
    
    // Vänta lite så elementen hinner skapas
    setTimeout(updateProfile, 100);
  } catch (error) {
    console.error('Header-fel:', error);
  }
});

// Uppdatera profil
function updateProfile() {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const userData = userDoc.data();
        
        // Prioritera user.displayName som sparas i register.js
        const rawDisplayName = user.displayName || userData?.displayName || user.email.split('@')[0];
        
        // 🔥 FIXEN: Klipp bort klassinformationen FÖRE visning
        const displayName = cleanDisplayName(rawDisplayName); 
        
        const nameEl = document.getElementById('userDisplayName');
        const initialEl = document.getElementById('userInitial');
        
        if (nameEl) nameEl.textContent = displayName;
        if (initialEl) initialEl.textContent = getInitials(displayName);
      } catch (error) {
        console.error('Profil-fel:', error);
      }
    }
  });
}