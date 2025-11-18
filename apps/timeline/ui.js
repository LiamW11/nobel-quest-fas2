// bygger upp användargränssnittet: startskärm, spelbråde och leaderboard
import { getLeaderboard } from "./storage.js";

// visa startskärmen där spelaren väljer svårighetsgrad
export function renderStart(root) {
  root.innerHTML = `
  <section class="mx-auto max-w-2xl text-center">
    <h2 class="text-2xl font-bold mb-6">Välj svårighetsgrad</h2>
    <div class="flex flex-col gap-4 items-center">
      <button class="btn btn-primary py-4 text-base w-3/4 sm:w-2/3 md:w-1/2" data-level="easy">Lätt (5)</button>
      <button class="btn btn-primary py-4 text-base w-3/4 sm:w-2/3 md:w-1/2" data-level="medium">Medel (8)</button>
      <button class="btn btn-primary py-4 text-base w-3/4 sm:w-2/3 md:w-1/2" data-level="hard">Svår (12)</button>
    </div>
  </section>`;

  // koppla click-event till varje svårighetsknapp
  root.querySelectorAll("[data-level]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const level = e.currentTarget.dataset.level;

      // skicka en custom event så main.js kan reagera och starta spelet 
      document.dispatchEvent(
        new CustomEvent("difficulty:selected", { detail: { level } })
      );
    });
  });
}

// visa själva spelet: lista med kort som går att sortera och knapp för att skicka in
export function renderBoard(root, cards) {
  root.innerHTML = `
<section class="max-w-3xl mx-auto">
    <div class="top-[env(safe-area-inset-top)] z-10 bg-neutral-50/80 backdrop-blur pb-3">
    <h2 class="text-xl font-bold pt-2 text-center">Sortera nobelpristagarna i ordningen de vann nobelpriset, från äldst till yngst</h2>
    <p id="timer" class="text-xl font-bold text-center">Tid kvar: </p>
    </div>

    <ul id="sortable-list" class="mt-2 space-y-3" aria-label="Sortera pristagarna"></ul>

    <div class="mt-4">
    <button id="submit" class="btn btn-primary w-full py-4 text-base ">Kolla ordning</button>
    </div>
    </section>
    `;

  const list = root.querySelector("#sortable-list");

  // skapa ett list-element per nobelpristagare
  cards.forEach((c) => {
    const li = document.createElement("li");
    li.className =
     //bra fix för scroll problemet oskar upptäckte
      "draggable card p-3 w-10/12 md:w-full bg-white shadow-sm flex items-center gap-4";
    li.draggable = true;
    li.dataset.id = c.id;
    li.innerHTML = 
    //Första raden är onödig tycker jag
    `
        <div class="shrink-0 grid place-items-center w-6 h-6 rounded-lg bg-neutral-100 text-neutral-500 select-none" aria-hidden="true">⋮⋮</div>
        <img src="${c.imageUrl}" alt="${c.name}" class="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-lg" loading="lazy"/>
        <div class="flex-1 min-w-0">
        <h4 class="font-bold truncate">${c.name}</h4>
        <span class="badge-gold">${c.category}</span>
        </div>
        `;
    list.appendChild(li);
  });
}

// renderar leaderboard-sektionen under spelet 
export function renderLeaderboard() {
  const leaderboard = getLeaderboard();
  const container = document.getElementById('leaderboard-entries');
  
  // om det inte finns några sparade resultat
  if (leaderboard.length === 0) {
    container.innerHTML = '<p class="text-neutral-500 text-center py-4">Inga resultat än</p>';
    return;
  }

  // skapa en rad per resultat i leaderboarden
    container.innerHTML = leaderboard.map((entry, index) => `
    <div class="flex items-center justify-between gap-4 p-3 bg-white rounded-lg shadow-sm mb-2 ring-gold">
      <div class="flex items-center gap-3">
        <span class="font-bold text-lg w-6">${index + 1}.</span>
        <div>
          <p class="font-bold">${entry.name}</p>
          <p class="text-sm text-neutral-500">
            ${entry.correctCount}/${entry.total} rätt • ${entry.difficulty}
          </p>
        </div>
      </div>
      <span class="text-xl font-bold text-gold">${entry.score}</span>
    </div>
  `).join('');
}