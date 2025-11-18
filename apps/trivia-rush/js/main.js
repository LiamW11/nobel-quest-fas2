document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("btn-start");
  const viewStart = document.getElementById("view-start");
  const viewQuiz = document.getElementById("view-quiz");

  if (startBtn) {
  startBtn.addEventListener("click", async () => {
    console.log("Startknappen klickad!");

    // Wait until questions are loaded
    await window.quizReady;

    // Hide start view, show quiz view
    viewStart.classList.add("hidden");
    viewQuiz.classList.remove("hidden");

    // Collect selected categories
    const selected = Array.from(
      document.querySelectorAll("input[name='categories']:checked")
    ).map((i) => i.value);

    // Start the game
    startGame(selected);
  });
}

  const form = document.getElementById("category-form");

  form.addEventListener("submit", (e) => {
    e.preventDefault(); // stop the page from reloading

    // collect all checked categories
    const selected = Array.from(form.querySelectorAll("input[name='categories']:checked"))
      .map((input) => input.value);

    console.log("Valda kategorier:", selected);
    // 👉 Here you can start your quiz logic:
    // startQuiz(selected);
  });

});

window.soundEnabled = true;

// Setup sound toggle button
const soundBtn = document.getElementById("btn-sound");
if (soundBtn) {
  soundBtn.addEventListener("click", () => {
    window.soundEnabled = !window.soundEnabled;
    soundBtn.textContent = window.soundEnabled ? "🔊 Ljud på" : "🔇 Ljud av";
    console.log("Ljud:", window.soundEnabled ? "På" : "Av");
  });
}