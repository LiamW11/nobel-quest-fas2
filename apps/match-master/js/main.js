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

  const helpLink = document.getElementById("help-link");
  const howtoOverlay = document.getElementById("howto-overlay");
  const howtoClose = document.getElementById("howto-close");
  const howtoGotIt = document.getElementById("howto-gotit");

  // Funktion för att öppna modal
  function openHowTo(e) {
    if (e) e.preventDefault(); // Förhindra länkens standardbeteende
    if (!howtoOverlay) return;
    howtoOverlay.classList.remove("hidden");
  }

  // Funktion för att stänga modal
  function closeHowTo() {
    if (!howtoOverlay) return;
    howtoOverlay.classList.add("hidden");
  }

  // Koppla "How to Play"-länken i footern
  if (helpLink) {
    helpLink.addEventListener("click", openHowTo);
  }

  // Koppla stäng-knappen (X)
  if (howtoClose) {
    howtoClose.addEventListener("click", closeHowTo);
  }

  // Koppla "Jag fattar"-knappen
  if (howtoGotIt) {
    howtoGotIt.addEventListener("click", closeHowTo);
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
