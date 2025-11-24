function renderCards() {
  const container = document.getElementById("cardGrid");
  if (!container) return;

  // Första gången - skapa alla kort
  if (container.children.length === 0) {
    container.innerHTML = "";
    container.className = "grid gap-2 sm:gap-4 grid-cols-3 sm:grid-cols-4";

    game.cards.forEach((card) => {
      const cardEl = document.createElement("div");
      cardEl.classList.add("game-card");
      cardEl.setAttribute("data-card-id", card.id);
      
      const innerEl = document.createElement("div");
      innerEl.classList.add("game-card-inner");

      const frontEl = document.createElement("div");
      frontEl.classList.add("game-card-front");
      frontEl.textContent = "?";

      const backEl = document.createElement("div");
      backEl.classList.add("game-card-back");

      if (card.type === "person") {
        backEl.innerHTML = `
    <div class="flex flex-col items-center gap-1 text-center text-white">
      ${
        card.imageUrl
          ? `<img src="${card.imageUrl}" class="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-contain bg-white p-1" alt="${card.name}">`
          : ""
      }
      <div class="font-bold text-sm sm:text-base">${card.name}</div>
      <div class="text-xs sm:text-sm">${card.country}</div>
    </div>
  `;
      } else if (card.type === "achievement") {
        backEl.innerHTML = `
    <div class="flex flex-col justify-between h-full text-white p-2">
      <div class="font-bold text-base sm:text-lg text-center text-yellow-400" >${card.category}</div>
<div class="text-base sm:text-lg font-semibold text-center flex-1 flex items-center justify-center px-1 text-white break-words">${card.achievement}</div>
    <div class="text-xs sm:text-center text-center text-white/90">${card.year}</div>
    </div>
  `;
      }

      // Sätt ihop kortet
      innerEl.appendChild(frontEl);
      innerEl.appendChild(backEl);
      cardEl.appendChild(innerEl);
      
      // Lägg till click handler
      cardEl.onclick = () => flipCard(card.id);
      
      container.appendChild(cardEl);
    });
  }

  // Uppdatera befintliga kort (detta sker varje gång)
  game.cards.forEach((card) => {
    const cardEl = container.querySelector(`[data-card-id="${card.id}"]`);
    if (!cardEl) return;

    if (card.matched) {
      // Matchade kort - lägg till båda klasserna och ta bort click handler
      if (!cardEl.classList.contains("matched")) {
        cardEl.classList.add("flipped", "matched");
        cardEl.onclick = null;
      }
    } else if (card.flipped) {
      // Kort som ska vändas - lägg till flipped
      if (!cardEl.classList.contains("flipped")) {
        setTimeout(() => {
          cardEl.classList.add("flipped");
        }, 10);
      }
    } else {
      // Kort som ska vändas tillbaka - ta bort flipped
      cardEl.classList.remove("flipped");
    }
  });
  
  // Uppdatera stats
  document.getElementById("matches").textContent = game.moves;
  document.getElementById("score").textContent = `${game.matches}/${game.pairsNeeded}`;
}

function showEndScreen() {
  const finalScore = finalizeScore();
  const minutes = Math.floor(game.timer / 60);
  const seconds = game.timer % 60;
  const timeFormatted = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

  // Göm gameScreen, visa endScreen
  document.getElementById("gameScreen").classList.add("hidden");
  const endScreen = document.getElementById("endScreen");
  endScreen.classList.remove("hidden");
  
// Ändra rubrik beroende på om spelaren gav upp eller vann
const heading = document.querySelector("#endScreen h2");
if (game.gaveUp) {
  heading.textContent = "Spelet avbrutet";
  heading.className = "text-4xl font-bold text-center mb-8 text-white/80";
} else {
  heading.textContent = "Grattis! 🎉";
  heading.className = "text-4xl font-bold text-center mb-8 text-[#C5A572]";
}

  // Uppdatera resultat
  document.getElementById("finalScore").textContent = finalScore;
  document.getElementById("time").textContent = timeFormatted;
  document.getElementById("finalAttempts").textContent = game.moves;

  // "Spela igen"-knapp
  document.getElementById("playAgain").onclick = () => {
    endScreen.classList.add("hidden");
    document.getElementById("gameScreen").classList.remove("hidden");
    // Rensa korten så nya skapas
    document.getElementById("cardGrid").innerHTML = "";
    startGame();
  };
}