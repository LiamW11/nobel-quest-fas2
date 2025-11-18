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
      const selected = Array.from(
        document.querySelectorAll("input[name='categories']:checked")
      ).map((i) => i.value);

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

// Ljud på som standard
window.soundEnabled = true;

// Ljud-knapp
const soundBtn = document.getElementById("btn-sound");
if (soundBtn) {
  soundBtn.addEventListener("click", () => {
    window.soundEnabled = !window.soundEnabled;
    soundBtn.textContent = window.soundEnabled ? "🔊 Ljud på" : "🔇 Ljud av";
    console.log("Ljud:", window.soundEnabled ? "På" : "Av");
  });
}
