// Gemensam How-To funktionalitet för alla spel
(function () {
  "use strict";

  // Funktion för att öppna en specifik how-to modal
  window.openHowTo = function (gameType) {
    const modal = document.getElementById(`howto-${gameType}`);
    if (modal) {
      modal.classList.remove("hidden");
    }
  };

  // Funktion för att stänga alla how-to modaler
  function closeAllHowTo() {
    const modals = document.querySelectorAll(".howto-modal");
    modals.forEach((modal) => {
      modal.classList.add("hidden");
    });
  }

  // 🔁 Event delegation istället för DOMContentLoaded + querySelectorAll
  document.addEventListener("click", function (e) {
    // Trivia-specifik "Jag fattar"-knapp - startar spelet
    if (e.target.closest(".howto-gotit-trivia")) {
      e.preventDefault();
      closeAllHowTo();
      if (typeof window.launchTriviaGame === 'function') {
        window.launchTriviaGame();
      }
      return;
    }
    
// Timeline-specifik "Jag fattar"-knapp
    if (e.target.closest(".howto-gotit-timeline")) {
      e.preventDefault();
      closeAllHowTo();
      if (typeof window.launchTimelineGame === 'function') {
        window.launchTimelineGame();
      }
      return;
    }

    // Generell "Jag fattar"-knapp (för dropdown-menyn etc)
if (e.target.closest(".howto-gotit-match")) {
      e.preventDefault();
      closeAllHowTo();
      if(typeof window.launchMatchGame === "function") {
        window.launchMatchGame();
      }
      return;
    }


    if (e.target.closest(".howto-gotit")) {
      e.preventDefault();
      closeAllHowTo();
      return;
    }

    // Klick på overlay (utanför själva rutan)
    if (e.target.classList.contains("howto-modal")) {
      closeAllHowTo();
    }
  });
})();
