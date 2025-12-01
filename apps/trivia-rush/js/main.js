// main.js

document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("btn-start");
  const viewStart = document.getElementById("view-start");
  const viewQuiz = document.getElementById("view-quiz");
  const form = document.getElementById("category-form");

  // Starta quizet
  if (startBtn) {
    startBtn.addEventListener("click", async () => {
      // Vänta tills Nobel-datan är laddad
      await window.quizReady;

      // Hämta valda kategorier
      let selected = Array.from(
        document.querySelectorAll("input[name='categories']:checked")
      ).map((i) => i.value);

      // Om inget valt → kör alla
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

      // Försök starta spelet
      const success = startGame(selected);

      // Gå vidare om spelet startade
      if (success) {
        if (viewStart) viewStart.classList.add("hidden");
        if (viewQuiz) viewQuiz.classList.remove("hidden");
      }
    });
  }

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
