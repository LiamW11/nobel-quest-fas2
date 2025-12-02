document.addEventListener("DOMContentLoaded", async () => {
  const placeholder = document.getElementById("footer-placeholder");
  if (!placeholder) return;

  try {
    // 1. Ladda in footern
    const response = await fetch("../../shared/components/footer.html");
    const html = await response.text();
    placeholder.innerHTML = html;

    // 2. Hämta "Instruktioner"-länken
    const helpLink = document.getElementById("help-link");

    if (helpLink) {
      const path = window.location.pathname;

      helpLink.addEventListener("click", (event) => {
        // Bara om openHowTo finns (på spel-sidorna)
        if (typeof openHowTo === "function") {

          // Match Master → öppna match-modal
          if (path.includes("match-master")) {
            event.preventDefault();
            openHowTo("match");
            return;
          }

          // Timeline → öppna timeline-modal
          if (path.includes("timeline")) {
            event.preventDefault();
            openHowTo("timeline");
            return;
          }

          // Trivia Rush → öppna trivia-modal
          if (path.includes("trivia-rush")) {
            event.preventDefault();
            openHowTo("trivia");
            return;
          }
        }
        // annars beter sig länken som vanligt (går till help.html)
      });
    }
  } catch (error) {
    console.error("Kunde inte ladda footern:", error);
  }
});
