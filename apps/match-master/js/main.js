const gameSound = {
  flip: new Audio('sounds/flip.mp3'),
  match: new Audio('sounds/match.mp3'),
  win: new Audio('sounds/win.mp3'),
  wrong: new Audio('sounds/wrong.mp3'),
};

gameSound.flip.volume= 0.5;
gameSound.match.volume= 0.6;
gameSound.win.volume= 0.7;
const startbtn = document.getElementById("btn-start");

// Funktion för att starta spelet (anropas från howto-knappen)
window.launchMatchGame = function() {
  document.getElementById("view-start").classList.add("hidden");
  document.getElementById("gameScreen").classList.remove("hidden");
  startGame();
};

window.addEventListener("DOMContentLoaded", () => {
  // Starta spelet när användaren klickar på Spela
  const startbtn = document.getElementById("btn-start");

  if (startbtn) {
   startbtn.onclick = (e) => {
    e.preventDefault();
    openHowTo('match')
   
    };
  }
  const howtoBtn = document.getElementById("btn-howto");
  if (howtoBtn) {
    howtoBtn.onclick = (e) => {
      e.preventDefault();
      openHowTo('match');
    };
  }
  
  // ===== GE UPP MODAL =====
  const giveupOverlay = document.getElementById("giveup-overlay");
  const giveupCancel = document.getElementById("giveup-cancel");
  const giveupConfirm = document.getElementById("giveup-confirm");

  function openGiveUpModal() {
    giveupOverlay.classList.remove("hidden");
  }

  function closeGiveUpModal() {
    giveupOverlay.classList.add("hidden");
  }

  giveupCancel.onclick = closeGiveUpModal;

  giveupConfirm.onclick = () => {
    closeGiveUpModal();
    game.gaveUp = true;
    stopTimer();
    showEndScreen();
  };

  document.getElementById("giveUpBtn").onclick = openGiveUpModal;
});




