window.addEventListener("DOMContentLoaded", () => {
  // Koppla startknappen
  document.getElementById("startBtn").onclick = () => {
    document.getElementById("startScreen").classList.add("hidden");
    document.getElementById("gameScreen").classList.remove("hidden");
    startGame();
  };

  // Koppla "Ge upp"-knappen
  document.getElementById("giveUpBtn").onclick = () => {
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