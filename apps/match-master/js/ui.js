function renderCards() {
  const container = document.getElementById("cardGrid");
  if (!container) return;

  container.className = "grid gap-2 sm:gap-4 grid-cols-3 sm:grid-cols-4";
  container.innerHTML = "";
  
  game.cards.forEach((card) => {
    const cardEl = document.createElement("div");
    cardEl.classList.add("game-card");
    
    const innerEl = document.createElement("div");
    innerEl.classList.add("game-card-inner");

    const frontEl = document.createElement("div");
    frontEl.classList.add("game-card-front");
    frontEl.textContent = "?";

    const backEl = document.createElement("div");
    backEl.classList.add("game-card-back");

    // Fyll baksidan med innehåll
    if (card.type === "person") {
      backEl.innerHTML = `
        <div class="flex flex-col items-center gap-1 text-center text-white">
          ${card.imageUrl ? `<img src="${card.imageUrl}" class="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-contain bg-white p-1" alt="${card.name}">` : ""}
          <div class="font-bold text-xs sm:text-sm">${card.name}</div>
          <div class="text-xs hidden sm:block">${card.country}</div>
        </div>
      `;
    } else if (card.type === "achievement") {
      backEl.innerHTML = `
        <div class="flex flex-col items-center gap-1 text-center text-white p-1">
          <div class="font-bold text-xs">${card.category}</div>
          <div class="text-xs line-clamp-3">${card.achievement}</div>
          <div class="text-xs text-white">${card.year}</div>
        </div>
      `;
    }

    // Sätt ihop kortet
    innerEl.appendChild(frontEl);
    innerEl.appendChild(backEl);
    cardEl.appendChild(innerEl);
    container.appendChild(cardEl);
    
    // Vänd alla kort så du ser innehållet (temporärt för test)
    cardEl.classList.add("flipped");
  });
}