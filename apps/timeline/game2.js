export const gameState = {
  difficulty: null,
  timerInterval: null,
  orderCorrect: null,
  yearCorrect: null,
  timeLeft: 0,
  timeBonus: 0,
};

export function setDifficulty(level) {
  gameState.difficulty = level;
}
// spara vilka nobelpristagare som används i denna omgång, och räkna ut den korrekta ordningen baserad på årtal
export function setPools(laureates) {
  gameState.pool = laureates;

  // skapa en lista med id:n i korrekt kronologisk ordning
  // vi sorterar på year och plockar sedan ut id för varje pristagare
  gameState.orderCorrect = [...laureates]
    .sort((a, b) => a.year - b.year)
    // ta ut ENDAST id
    // bygg en helt ny lista med id-värden
    .map((x) => x.id);

  gameState.yearCorrect = [...laureates]
    .sort((a, b) => a.year - b.year)
    .map((x) => x.year);
}

export function submitAndScore(userIds) {
  const pointsPerCorrect = 60;
  // (jämför användarens ordning med den korrekta ordningen)
  // .filter() går igenom varje element i listan userIds,
  // är användarens id på plats i samma som det korrekta id:t på plats i
  let correct = userIds.filter(
    (id, i) => id === gameState.orderCorrect[i]
  ).length;
  let incorrect = userIds.length - correct;

  const basePoints = correct * pointsPerCorrect;

  // tidsbonus beräknas som en procentandel baserat på timeLeft
  // exempel: om timeLeft är 30, blir det 30 % av baspoängen
  const timeBonus = Math.round(basePoints * (gameState.timeLeft / 100));
  let score = basePoints + timeBonus - incorrect * 15;
  if (score < 0) score = 0;

  gameState.score = score;
  gameState.timeBonus = timeBonus;

  return { correctCount: correct, score, timeBonus };
}

export function startTimer() {
  const timeLeftEl = document.getElementById("timer");
  const timerBar = document.getElementById("timer-bar");
  let totalTime = 45;

  if (gameState.timerInterval) {
    clearInterval(gameState.timerInterval);
    gameState.timerInterval = null;
  }

  gameState.timeLeft = totalTime;

  function updateTimerUI() {
    if (timeLeftEl) {
      timeLeftEl.textContent = `Tid kvar: ${gameState.timeLeft}`;
    }

    if (timerBar) {
      const percentage = (gameState.timeLeft / totalTime) * 100;
      timerBar.style.width = `${percentage}%`;

      timerBar.classList.remove("bg-[#76DB7E]", "bg-[#C5A572]", "bg-[#D96666]");
      if (gameState.timeLeft <= 5) {
        timerBar.classList.add("bg-[#D96666]"); // röd
      } else if (gameState.timeLeft <= 15) {
        timerBar.classList.add("bg-[#C5A572]"); // guld
      } else {
        timerBar.classList.add("bg-[#76DB7E]"); // grön
      }
    }
  }

  updateTimerUI();

  gameState.timerInterval = setInterval(() => {
    if (gameState.timeLeft <= 0) {
      // tiden är slut – nollställ UI och auto-submit
      gameState.timeLeft = 0;
      updateTimerUI();
      stopTimer();
      const submitBtn = document.querySelector("#submit");
      if (submitBtn) submitBtn.click();
      return;
    }

    // räkna ned och uppdatera
    gameState.timeLeft--;
    updateTimerUI();
  }, 1000);
}

export function stopTimer() {
  clearInterval(gameState.timerInterval);
  gameState.timerInterval = null;

  const timerBar = document.getElementById("timer-bar");
  if (timerBar) {
    timerBar.style.width = "0%";
  }
}
