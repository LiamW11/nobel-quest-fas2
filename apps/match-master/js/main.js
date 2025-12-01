const gameSound = {
  flip: new Audio('sounds/flip.mp3'),
  match: new Audio('sounds/match.mp3'),
  win: new Audio('sounds/win.mp3'),
  wrong: new Audio('sounds/wrong.mp3'),
};

gameSound.flip.volume= 0.5;
gameSound.match.volume= 0.6;
gameSound.win.volume= 0.7;

window.addEventListener("DOMContentLoaded", () => {
  // Starta spelet direkt när sidan laddas
  startGame();

  // Help-länk i footer (onclick hanteras redan i HTML, men detta är backup)
  const helpLink = document.getElementById("help-link");
  if (helpLink && !helpLink.onclick) {
    helpLink.addEventListener("click", (e) => {
      e.preventDefault();
      if (typeof openHowTo === 'function') {
        openHowTo('match');
      } else {
        setTimeout(() => openHowTo('match'), 100);
      }
    });
  }
  // ========== GE UPP MODAL FUNKTIONALITET ==========
  
  const giveupOverlay = document.getElementById("giveup-overlay");
  const giveupCancel = document.getElementById("giveup-cancel");
  const giveupConfirm = document.getElementById("giveup-confirm");

  // Funktion för att öppna ge upp-modal
  function openGiveUpModal() {
    if (!giveupOverlay) return;
    giveupOverlay.classList.remove("hidden");
  }

  // Funktion för att stänga ge upp-modal
  function closeGiveUpModal() {
    if (!giveupOverlay) return;
    giveupOverlay.classList.add("hidden");
  }

  // Koppla "Avbryt"-knappen
  if (giveupCancel) {
    giveupCancel.addEventListener("click", closeGiveUpModal);
  }

  // Koppla "Ge upp" (bekräfta)-knappen
  if (giveupConfirm) {
    giveupConfirm.addEventListener("click", () => {
      closeGiveUpModal();
      game.gaveUp = true;
      stopTimer();
      showEndScreen();
   });
  }
  // Koppla "Ge upp"-knappen
  document.getElementById("giveUpBtn").onclick = () => {
    openGiveUpModal();
  };
});
