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

  // ===========================
  // HOW TO PLAY / INSTRUKTIONER
  // ===========================

  const howtoBtn = document.getElementById("btn-howto");
  const helpLink = document.getElementById("help-link");
  const howtoOverlay = document.getElementById("howto-overlay");
  const howtoClose = document.getElementById("howto-close");
  const howtoGotIt = document.getElementById("howto-gotit");

  function openHowTo() {
    if (!howtoOverlay) return;
    howtoOverlay.classList.remove("hidden");
  }

  function closeHowTo() {
    if (!howtoOverlay) return;
    howtoOverlay.classList.add("hidden");
  }

  // Knappen under Starta Quiz
  if (howtoBtn) {
    howtoBtn.addEventListener("click", (e) => {
      e.preventDefault();
      openHowTo();
    });
  }

  // Länken "Instruktioner" i footern → exakt samma popup
  if (helpLink) {
    helpLink.addEventListener("click", (e) => {
      e.preventDefault();
      openHowTo();
    });
  }

  // Stäng med krysset
  if (howtoClose) {
    howtoClose.addEventListener("click", () => {
      closeHowTo();
    });
  }

  // "Jag fattar – kör igång!"
  if (howtoGotIt) {
    howtoGotIt.addEventListener("click", () => {
      closeHowTo();
      // Om du vill att quizet ska starta direkt här:
      if (startBtn) startBtn.click();
    });
  }

  // Klick utanför rutan stänger också
  if (howtoOverlay) {
    howtoOverlay.addEventListener("click", (e) => {
      if (e.target === howtoOverlay) closeHowTo();
    });
  }

  // ESC stänger
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeHowTo();
  });
});
