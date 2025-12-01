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
        type="button"
        id="btn-howto" 
        class="mt-4 text-sm text-white/80 underline hover:text-white">
        How to play – så funkar spelet
      </button>
`;

 // --- spel-knappen ---
  root.querySelectorAll("[data-level]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const level = e.currentTarget.dataset.level;
      
      document.getElementById("back-btn").classList.add("invisible");

      document.dispatchEvent(
        new CustomEvent("difficulty:selected", { detail: { level } })
      );
    });
  });
  // --- how-to knapp ---
  const howtoBtn = root.querySelector("#btn-howto");
  if (howtoBtn) {
    howtoBtn.addEventListener("click", () => {
      if (typeof openHowTo === 'function') {
        openHowTo('timeline');
      } else {
        setTimeout(() => openHowTo('timeline'), 100);
      }
    });
  }
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

