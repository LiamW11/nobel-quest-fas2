import { renderStart, renderBoard } from "./ui.js";
import { loadNobelData, shuffle } from "./data.js";
import {
  setDifficulty,
  setPools,
  submitAndScore,
  gameState,
  startTimer,
  stopTimer,
} from "./game2.js";
import { wireDnD, readUserOrder } from "./dnd.js";
import { saveLastScore } from "./storage.js";

import { submitScore } from "../leaderboard/leaderboardManager.js";


const app = document.getElementById("app");
renderStart(app);
loadNobelData();

// Instruktioner i dropdown öppnar how-to popup
setTimeout(() => {
  const menuInstructions = document.getElementById("menu-instructions");
  if (menuInstructions) {
    menuInstructions.addEventListener("click", (e) => {
      e.preventDefault();
      document.getElementById("dropdownMenu").classList.add("hidden");
      openHowTo('timeline');
    });
  }
}, 500);

document.addEventListener("difficulty:selected", async (e) => {
  const all = await loadNobelData();
  const level = e.detail.level;
  setDifficulty(level);
  const pool = shuffle(all).slice(0, 8);
  setPools(pool);
  renderBoard(app, pool);
  // aktivera drag and drop på listan
  wireDnD(app);
  startTimer();

  // koppla knappen "kolla ordning" så att den rättar spelet
  app.querySelector("#submit").addEventListener("click", () => {
    const order = readUserOrder(app);
    const { score, correctCount } = submitAndScore(order);
    saveLastScore({ score, correctCount, total: pool.length, ts: Date.now() });
    const playerName = "Anonym";

    const entry = {
      name: playerName,
      score: Math.round(score),
      correctCount,
      total: pool.length,
      timeLeft: gameState.timeLeft,
      ts: Date.now(),
    };
    stopTimer();

    // Melvins kod för att skicka poäng till leaderboard
    const finalScore = Math.round(score);
    submitScore("LB-timeline", finalScore);


    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#C5A572", "#D4B88C", "#E5D4B0", "#A38A5F"],
    });

    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#C5A572", "#D4B88C", "#E5D4B0", "#A38A5F"],
      });
    }, 250);

    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#C5A572", "#D4B88C", "#E5D4B0", "#A38A5F"],
      });
    }, 400);


    // skapa en snabb uppslagskarta från id till pristagare
    const laureateMap = {};
    pool.forEach((l) => (laureateMap[l.id] = l));

    // Bygg upp HTML för resultatskärmen
    let resultHTML = `
        <section class="max-w-3xl mx-auto">
        <div class="text-center mt-1">
        <p class="text-white mb-1 text-xl">
        Rätt: ${correctCount}/${pool.length} • 
        Poäng: <span class="score-display">${score}</span> • 
        ${
          gameState.timeLeft <= 0
            ? "Tiden tog slut"
            : `Tid kvar: ${gameState.timeLeft}`
        }
    </p>

    <p 
    id="time-multiplier"
    class="text-md font-bold text-center text-white py-2 mb-2"
    >
    Extrapoäng baserat på tid: ${gameState.timeBonus}
    </p>

      

    </div>

 <div class="flex flex-row justify-between items-center w-full max-w-3xl mx-auto mt-4 pb-2 gap-2">
  <button
    id="btn-user-order"
    class="bg-[#C5A572] text-[#002952] py-2 px-4 w-1/2 rounded-lg text-sm font-semibold"
  >
    Din ordning
  </button>

  <button
    id="btn-correct-order"
    class="bg-transparent text-white border border-[#C5A572] py-2 px-4 w-1/2 rounded-lg text-sm font-semibold"
  >
    Rätt ordning
  </button>
</div>

     <div id="user-order" class="space-y-3">


     `;
    // lägg till ett kort i resultatlistan för varje placerad pristagare
    order.forEach((placedId, index) => {
      const laureate = laureateMap[placedId];
      const correctId = gameState.orderCorrect[index];
      const isCorrect = placedId === correctId;

      resultHTML += `
        <div class="card p-2 w-full mx-auto bg-[#142845]/95 shadow-sm flex items-start gap-4 ring-1 ring-white/20 ${
          isCorrect ? "ring-correct" : "ring-wrong"
        }">
          <img src="${laureate.imageUrl}" alt="${
        laureate.name
      }" class="w-20 h-20 object-cover rounded-lg flex-shrink-0" loading="lazy" />
          <div class="flex-1 min-w-0">
            <h4 class="text-white font-bold break-words">${laureate.name}</h4>
            <span class="text-[#EBCB96] break-words">${laureate.category}</span>
            <span class="text-white text-sm break-words">: ${
              laureate.achievement
            }</span>
          </div>
          <div class="text-right flex-shrink-0">
           <p class="text-2xl font-bold ${
             isCorrect ? "text-green-400" : "text-red-400"
           }">
              ${laureate.year}
            </p>
            <p class="text-sm text-white/60 whitespace-nowrap">
              ${isCorrect ? `+60 Poäng` : "-15 Poäng"}
            </p>
           
          </div>
        </div>
      `;
    });

    resultHTML += `
        </div>
        <div id="correct-order" class="space-y-3 hidden">
        `;

    gameState.orderCorrect.forEach((id) => {
      const laureate = laureateMap[id];

      resultHTML += `
          <div class="card p-2 w-full mx-auto bg-[#142845]/95 shadow-sm flex items-start gap-4 ring-1 ring-white/20 ring-correct">
          <img src="${laureate.imageUrl}" alt="${laureate.name}" class="w-20 h-20 object-cover rounded-lg" loading="lazy" />
           <div class="flex-1">
            <h4 class="text-white font-bold break-words">${laureate.name}</h4>
            <span class="text-[#EBCB96] break-words">${laureate.category}</span>
            <span class="text-white text-sm break-words">: ${laureate.achievement}</span>
          
          </div>
          <div class="text-right">
          <p class="text-2xl font-bold text-green-400">
              ${laureate.year}
            </p>
            
            
          </div>
          </div>
          `;
    });

    resultHTML += `
    
        </div> 
           <div class="text-center mt-3 pb-3">
             <button 
         class="w-full mt-1 mb-4 px-6 py-3 rounded-lg bg-[#C5A572] hover:bg-[#b08f57] text-[#002952] font-semibold shadow-lg shadow-black/30 transition "
        onclick="window.location.href='../leaderboard/leaderboard.html'">
        Till Leaderboard
      </button>
      <button
      
      onclick="window.location.href='/apps/match-master/index.html'"
        id="again"
        class="inline-flex items-center justify-center px-10 py-3 rounded-xl bg-[#C5A572] hover:bg-[#b08f57] active:bg-[#9c7f4c] text-[#002952] font-semibold shadow-lg shadow-black/30 transition w-full"
      >
        Nästa spel
      </button>

    </div>
        </section>
        `;

    // visa resultatskärmen istället för spelet
    app.innerHTML = resultHTML;
    const userOrderEl = app.querySelector("#user-order");
    const correctOrderEl = app.querySelector("#correct-order");
    const userOrderBtn = app.querySelector("#btn-user-order");
    const correctOrderBtn = app.querySelector("#btn-correct-order");

    function setActiveButton(mode) {
      if (mode === "user") {
        // visa DIN ordning
        userOrderEl.classList.remove("hidden");
        correctOrderEl.classList.add("hidden");

        // stil för aktiv/inaktiv knapp
        userOrderBtn.classList.add("bg-[#C5A572]", "text-[#002952]");
        userOrderBtn.classList.remove(
          "bg-transparent",
          "text-white",
          "border",
          "border-[#C5A572]"
        );

        correctOrderBtn.classList.add(
          "bg-transparent",
          "text-white",
          "border",
          "border-[#C5A572]"
        );
        correctOrderBtn.classList.remove("bg-[#C5A572]", "text-[#002952]");
      } else {
        // visa RÄTT ordning
        correctOrderEl.classList.remove("hidden");
        userOrderEl.classList.add("hidden");

        correctOrderBtn.classList.add("bg-[#C5A572]", "text-[#002952]");
        correctOrderBtn.classList.remove(
          "bg-transparent",
          "text-white",
          "border",
          "border-[#C5A572]"
        );

        userOrderBtn.classList.add(
          "bg-transparent",
          "text-white",
          "border",
          "border-[#C5A572]"
        );
        userOrderBtn.classList.remove("bg-[#C5A572]", "text-[#002952]");
      }
    }

    // koppla knapparna
    userOrderBtn.addEventListener("click", () => setActiveButton("user"));
    correctOrderBtn.addEventListener("click", () => setActiveButton("correct"));

    // startläge: visa din ordning
    setActiveButton("user");
  });
});