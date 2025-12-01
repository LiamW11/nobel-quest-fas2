// Gemensam How-To funktionalitet för alla spel
(function() {
  'use strict';

  // Funktion för att öppna en specifik how-to modal
  window.openHowTo = function(gameType) {
    const modal = document.getElementById(`howto-${gameType}`);
    if (modal) {
      modal.classList.remove('hidden');
    }
  };

  // Funktion för att stänga alla how-to modaler
  function closeAllHowTo() {
    const modals = document.querySelectorAll('.howto-modal');
    modals.forEach(modal => {
      modal.classList.add('hidden');
    });
  }

  // 🔁 Event delegation istället för DOMContentLoaded + querySelectorAll
  document.addEventListener('click', function(e) {
    // Klick på X-knapp
    if (e.target.closest('.howto-close')) {
      e.preventDefault();
      closeAllHowTo();
      return;
    }

    // Klick på "Jag fattar – kör igång!" / "Okej, jag fattar!"
    if (e.target.closest('.howto-gotit')) {
      e.preventDefault();
      closeAllHowTo();
      return;
    }

    // Klick på overlay (utanför själva rutan)
    if (e.target.classList.contains('howto-modal')) {
      closeAllHowTo();
    }
  });
})();
