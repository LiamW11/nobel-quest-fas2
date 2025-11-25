document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("btn-start");
  const viewStart = document.getElementById("view-start");
  const viewQuiz = document.getElementById("view-quiz");

  

  if (startBtn) {
    startBtn.addEventListener("click", async () => {
      console.log("Startknappen klickad!");

      // Vänta tills Nobel-datan är laddad
      await window.quizReady;

      // Hämta valda kategorier
      let selected = Array.from(
          document.querySelectorAll("input[name='categories']:checked")
        ).map((i) => i.value);

        // If nothing selected → use all categories
        if (selected.length === 0) {
          selected = ["physics", "chemistry", "medicine", "literature", "peace", "economics"];
        }

      // Försök starta spelet
      const success = startGame(selected);

      // Gå endast vidare om spelet faktiskt startade
      if (success) {
       if (success) {
    document.getElementById("view-start").classList.add("hidden");
    document.getElementById("view-quiz").classList.remove("hidden");
}

      }
    });
  }

  // Hanterar formuläret (behövs inte för spelstart men lämnas kvar)
  const form = document.getElementById("category-form");

  form.addEventListener("submit", (e) => {
    e.preventDefault(); // stoppa reload

    const selected = Array.from(
      form.querySelectorAll("input[name='categories']:checked")
    ).map((input) => input.value);

    console.log("Valda kategorier:", selected);
  });
});

    const howtoBtn = document.getElementById("btn-howto");
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

    if (howtoBtn) {
        howtoBtn.addEventListener("click", openHowTo);
    }

    if (howtoClose) {
        howtoClose.addEventListener("click", closeHowTo);
    }

    if (howtoGotIt) {
        howtoGotIt.addEventListener("click", closeHowTo);
    }

    // Stäng om man klickar utanför själva rutan
    if (howtoOverlay) {
        howtoOverlay.addEventListener("click", (e) => {
            if (e.target === howtoOverlay) closeHowTo();
        });
    }

    // Stäng med ESC
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeHowTo();
    });


