// bygger upp användargränssnittet: startskärm, spelbråde och leaderboard
import { gameState } from "./game2.js";


// visa startskärmen där spelaren väljer svårighetsgrad
// visa startskärmen där spelaren väljer svårighetsgrad
export function renderStart(root) {
  root.innerHTML = `
  <section class="bg-[#142845]/95 mx-auto w-[91%] mt-20 py-6 max-w-2xl text-center shadow-2xl ring-1 ring-white/10 rounded-3xl">
    <div class="flex flex-col gap-4 items-center">

            <p class="text-white/85 leading-relaxed text-lg">
              Läs Hur spelar man, och tryck sedan Spela för att påbörja spelet
              <p class="text-xl font-semibold text-white">Lycka Till!</p>
            </p>  

      <button id="startButton"
        class="inline-flex items-center justify-center px-10 py-3 rounded-xl bg-[#C5A572] hover:bg-[#b08f57] active:bg-[#9c7f4c] text-[#002952] font-semibold shadow-lg shadow-black/30 transition" 
        data-level="play">
        Spela
      </button>

      <button 
        id="howToButton" 
        class="block w-full text-sm text-white/80 underline hover:text-white">
        <span>Hur spelar man? — Nobel Timeline</span>
      </button>
    </div>
  </section>



  <div id="howToModal"
    class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 hidden">
    <div class="bg-[#C5A572] text-[#002952] max-w-md w-11/12 rounded-lg shadow-2xl p-6 relative">

      <button id="closeHowTo" class="absolute top-3 right-4 text-2xl leading-none"
        aria-label="Stäng">
        &times;
      </button>

      <h2 class="text-xl font-bold mb-4 text-center">Hur spelar man?</h2>
      <p>Här är instruktionerna för hur man spelar spelet:</p>
      <ol class="list-decimal list-inside mt-2 space-y-1">
        <li class="pt-1">Du får åtta nobelpristagare i en slumpad lista.</li>
        <li class="pt-1">Ordna dem så att den som fick priset tidigast hamnar högst och den som fick senast hamnar längst ned.</li>
        <li class="pt-1">Poängberäkning: +100 per rätt, -25 per fel och (tid kvar)/100.</li>
        <li class="pt-1">Exempel: Tre rätt och 30 sekunder kvar → (300 × 1.3) - (25 × 5) = 265 poäng.</li>
      </ol>

      <div class="mt-6 text-center">
        <button id="okHowTo" class="bg-[#002952] text-white px-6 py-2 rounded-lg hover:bg-[#001d3a]">
          Okej, jag fattar!
        </button>
      </div>
    </div>
  </div>
  `;

  // --- spel-knappen ---
  root.querySelectorAll("[data-level]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const level = e.currentTarget.dataset.level;

      document.dispatchEvent(
        new CustomEvent("difficulty:selected", { detail: { level } })
      );
    });
  });

  // --- modal-logik ---
  const howToButton = root.querySelector("#howToButton");
  const howToModal = document.querySelector("#howToModal");
  const closeHowTo = howToModal.querySelector("#closeHowTo");
  const okHowTo = howToModal.querySelector("#okHowTo");

  function openModal() {
    howToModal.classList.remove("hidden");
  }

  function closeModal() {
    howToModal.classList.add("hidden");
  }

  howToButton.addEventListener("click", openModal);
  
  closeHowTo.addEventListener("click", closeModal);

  okHowTo.addEventListener("click", () => {
    closeModal();
    document.getElementById("startButton").click();
  }
);

  // stäng om man klickar på overlay
  howToModal.addEventListener("click", (event) => {
    if (event.target === howToModal) {
      closeModal();
    }
  });
}

// visa själva spelet: lista med kort som går att sortera och knapp för att skicka in
export function renderBoard(root, cards) {
  console.log(gameState.yearCorrect);
  root.innerHTML = `
<section class="max-w-3xl mx-auto">
  <div class="top-[env(safe-area-inset-top)] z-10 backdrop-blur-sm pb-3 pt-3 sticky">
    <p id="timer" class="text-xl font-bold text-center text-white">
      Tid kvar:
    </p>

    <div class="w-full h-2 bg-white/10 rounded-full mt-2 overflow-hidden">
      <div
        id="timer-bar"
        class="h-2 bg-[#76DB7E] rounded-full transition-all duration-1000"
        style="width: 100%"
      ></div>
    </div>
  </div>


    <p class="text-center text-[#002952] text-xl font-bold w-full bg-[#C5A572] rounded-lg">${gameState.yearCorrect[0]}</p>
    <ul id="sortable-list" class="p-1 space-y-3" aria-label="Sortera pristagarna"></ul>
    <p class="text-center text-[#002952] text-xl font-bold w-full bg-[#C5A572] rounded-lg">${gameState.yearCorrect[gameState.yearCorrect.length - 1]}</p>


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
      "draggable card p-2 w-10/12 md:w-full bg-[#142845]/95 shadow-sm flex items-start gap-4 ring-1 ring-white/20";
    li.draggable = true;
    li.dataset.id = c.id;
    li.innerHTML =
      //Första raden är onödig tycker jag
      `
        <img src="${c.imageUrl}" alt="${c.name}" class="w-20 h-20 object-cover rounded-lg" loading="lazy"/>
        <div class="">
        <h4 class="text-white font-bold truncate w-[90%]">${c.name}</h4>
        <span class="text-[#EBCB96]">${c.category}</span>
        <span class="text-white text-sm">: ${c.achievement}</span>
        </div>
        `;
    list.appendChild(li);
  });
}

