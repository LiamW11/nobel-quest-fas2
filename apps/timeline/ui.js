// bygger upp användargränssnittet: startskärm, spelbråde och leaderboard
import { getLeaderboard } from "./storage.js";

// visa startskärmen där spelaren väljer svårighetsgrad
export function renderStart(root) {
  root.innerHTML = `
  <section class="mx-auto max-w-2xl text-center">
    <div class="flex flex-col gap-4 items-center">
      <button class="mt-2 py-4 text-base w-3/4 sm:w-2/3 md:w-1/2 rounded-lg bg-[#C5A572] hover:bg-[#A38A5F] text-[#002952]" data-level="play">Spela</button>
    </div>

    <details class="bg-[#C5A572] hover:bg-[#A38A5F] ring-1 ring-white/10 rounded-lg shadow-2xl p-2 mt-4 w-2/3 mx-auto">
  <summary class="cursor-pointer text-center font-semibold gap-2">
    <span class="text-center text-[#002952]">Hur spelar man?</span>
  </summary>
  <div class="mt-4 text-[#002952]">
    <p>Här är instruktionerna för hur man spelar spelet:</p>
    <ol class="list-decimal list-inside mt-2 space-y-1">
      <li class="pt-1">Du får åtta nobelpristagare i en slumpad lista.</li>
      <li class="pt-1">Ordna dem så att den som fick priset tidigast hamnar högst och den som fick det senast hamnar längst ned.</li>
      <li class="pt-1">Poängberäkning: +100 per rätt, –25 per fel och (tid kvar)/100.</li>
      <li class="pt-1">Exempel: Tre rätt och 30 sekunder kvar → (300 x 1.3) - (25 x 5) = 265 poäng.</li>
    </ol>
  </div>
</details>



  </section>`;

  // koppla click-event till varje svårighetsknapp
  root.querySelectorAll("[data-level]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const level = e.currentTarget.dataset.level;
      document.getElementById("nameInput").style.display = "none";

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
    <div class="top-[env(safe-area-inset-top)] z-10 backdrop-blur pb-3 -mt-6">
    <p id="timer" class="text-xl font-bold text-center text-white">Tid kvar: </p>
    </div>

    <p class="text-center text-[#002952] font-bold w-full bg-[#C5A572] rounded-lg">Äldst</p>
    <ul id="sortable-list" class="p-1 space-y-3" aria-label="Sortera pristagarna"></ul>
    <p class="text-center text-[#002952] font-bold w-full bg-[#C5A572] rounded-lg">Yngst</p>


    <div class="mt-4">
    <button id="submit" class="bg-[#C5A572] hover:bg-[#A38A5F] text-[#002952] w-full rounded-lg py-4 text-base">Kolla ordning</button>
    </div>
    </section>
    `;


  const list = root.querySelector("#sortable-list");

  // skapa ett list-element per nobelpristagare
  cards.forEach((c) => {
    const li = document.createElement("li");
    li.className =
     //bra fix för scroll problemet oskar upptäckte
      "draggable card p-3 w-10/12 md:w-full bg-[#142845]/95 shadow-sm flex items-center gap-4 ring-1 ring-white/20";
    li.draggable = true;
    li.dataset.id = c.id;
    li.innerHTML = 
    //Första raden är onödig tycker jag
    `
        <div class="shrink-0 grid place-items-center w-6 h-6 rounded-lg text-white select-none" aria-hidden="true">⋮⋮</div>
        <img src="${c.imageUrl}" alt="${c.name}" class="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-lg" loading="lazy"/>
        <div class="flex-1 min-w-0">
        <h4 class="text-white font-bold truncate">${c.name}</h4>
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
    <div class="text-white flex items-center justify-between gap-4 p-3 bg-[#142845]/95 rounded-lg ring-1 ring-white/30 shadow-sm mb-2">
      <div class="flex items-center gap-3">
        <span class="font-bold text-lg w-6">${index + 1}.</span>
        <div>
          <p class="font-bold max-w-60 text-white block truncate">${entry.name}</p>
          <p class="text-sm text-neutral-300">
            ${entry.correctCount}/${entry.total} rätt • Tid kvar: ${entry.timeLeft}
          </p>
        </div>
      </div>
      <span class="text-xl font-bold text-white">${entry.score}</span>
    </div>
  `).join('');
}