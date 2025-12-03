// main.js

document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("btn-start");
  const viewStart = document.getElementById("view-start");
  const viewQuiz = document.getElementById("view-quiz");
  const form = document.getElementById("category-form");

// Funktion för att faktiskt starta spelet
  async function launchGame() {
    await window.quizReady;

    let selected = Array.from(
      document.querySelectorAll("input[name='categories']:checked")
    ).map((i) => i.value);

    if (selected.length === 0) {
      selected = [
        "physics",
        "chemistry",
        "medicine",
        "literature",
        "peace",
        "economics",
      ];
    }

    const success = startGame(selected);

    if (success) {
      if (viewStart) viewStart.classList.add("hidden");
      if (viewQuiz) viewQuiz.classList.remove("hidden");
    }
  }

  // Klick på "Starta Quiz" öppnar how-to popup
  if (startBtn) {
    startBtn.addEventListener("click", (e) => {
      e.preventDefault();
      openHowTo('trivia');
    });
  }

  // Gör launchGame tillgänglig globalt för howto-knappen
  window.launchTriviaGame = launchGame;

  // Formuläret ska inte reloada sidan
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (startBtn) startBtn.click();
    });
  }

 // How-to knapp
  const howtoBtn = document.getElementById("btn-howto");
  if (howtoBtn) {
    howtoBtn.addEventListener("click", () => {
      openHowTo('trivia');
    });
  }

  // Help-länk i footer
  const helpLink = document.getElementById("help-link");
  if (helpLink) {
    helpLink.addEventListener("click", (e) => {
      e.preventDefault();
      openHowTo('trivia');
    });
  }
});
