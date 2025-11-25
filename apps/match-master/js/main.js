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
  // Koppla startknappen
  document.getElementById("startBtn").onclick = () => {
    document.getElementById("startScreen").classList.add("hidden");
    document.getElementById("gameScreen").classList.remove("hidden");
    startGame();
  };

  // Koppla "Ge upp"-knappen
  document.getElementById("giveUpBtn").onclick = () => {
  game.gaveUp = true;
  stopTimer();
  showEndScreen();
};
  // Koppla "Tillbaka"-knappen i endScreen
  document.getElementById("backToStart").onclick = () => {
    document.getElementById("endScreen").classList.add("hidden");
    document.getElementById("startScreen").classList.remove("hidden");
    // Återställ cardGrid
    document.getElementById("cardGrid").innerHTML = "";
  };
});