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

  // När DOM är laddad, sätt upp event listeners
  document.addEventListener('DOMContentLoaded', function() {
    
    // Stäng-knappar (X)
    document.querySelectorAll('.howto-close').forEach(btn => {
      btn.addEventListener('click', closeAllHowTo);
    });

    // "Jag fattar"-knappar
    document.querySelectorAll('.howto-gotit').forEach(btn => {
      btn.addEventListener('click', closeAllHowTo);
    });

    // Stäng om man klickar på overlay (utanför modalen)
    document.querySelectorAll('.howto-modal').forEach(modal => {
      modal.addEventListener('click', function(e) {
        if (e.target === modal) {
          closeAllHowTo();
        }
      });
    });
  });
})();