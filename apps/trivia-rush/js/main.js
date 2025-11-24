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
        viewStart.classList.add("hidden");
        viewQuiz.classList.remove("hidden");
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


