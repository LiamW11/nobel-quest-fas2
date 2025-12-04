// game.js – Core quiz logic with timer

let state = {
  questions: [],
  currentIndex: 0,
  score: 0,
  timeScore: 0,
  bonusScore: 0,
  streak: 0,
  totalQuestions: 0,
  selectedCategories: [],
  timer: null,
  timeLeft: 30,
};

// Start the quiz
function startGame(selectedCategories) {
  state.selectedCategories = selectedCategories;

  // Gather questions from selected categories
  let pool = [];
  if (selectedCategories.includes("all")) {
    Object.values(window.quizData).forEach((arr) => pool.push(...arr));
  } else {
    selectedCategories.forEach((cat) => {
      if (window.quizData[cat]) pool.push(...window.quizData[cat]);
    });
  }

  // Filter out invalid or empty questions
  pool = pool.filter(
    (q) =>
      q &&
      q.question &&
      Array.isArray(q.options) &&
      q.options.length >= 2 &&
      q.correct
  );

  if (pool.length === 0) {
    alert("Inga frågor hittades för valda kategorier.");
    return;
  }

  // Shuffle all possible questions
  pool = shuffle(pool);

  // Take only 10 random questions
  state.questions = pool.slice(0, 10);

  if (state.questions.length === 0) {
  alert("Inga giltiga frågor hittades. Kontrollera datan.");
  return false;
}

  // Reset the 'answered' flag on all questions
  state.questions.forEach((q) => delete q.answered);

  // Initialize state
  state.totalQuestions = state.questions.length;
  state.currentIndex = 0;
  state.score = 0;
  state.timeScore = 0;
  state.score = 0;
  state.bonusScore = 0;
  state.streak = 0;
  document.getElementById("streak-pill").textContent = ``;
  document.getElementById("quizvy").innerHTML = `<div class="flex items-center">
                <div id="question-pill">1/10</div>
                <div id="score-pill" 
                    class="score-pill absolute left-10 font-bold">
                  Poäng: 0
                </div>
                <div id="streak-box" class="relative left-24">
                  <div id="streak-pill" class="absolute inset-0 flex items-center justify-center text-lg font-bold text-white z-10 pointer-events-none"></div>
                </div>
              </div>`;
              document.getElementById("question-pill").textContent = `${state.currentIndex + 1} / ${state.totalQuestions}`;

  loadQuestion();

  const scorePill = document.getElementById("score-pill");
  const timeScorePill = document.getElementById("time-score-pill");
  const nextBtn = document.getElementById("btn-next");

  scorePill.textContent = "Poäng: 0";
  if (timeScorePill) timeScorePill.textContent = "Tidspoäng: 0";

  nextBtn.disabled = true;
  nextBtn.classList.add("opacity-60", "cursor-not-allowed");
  nextBtn.classList.remove("hover:bg-[#C5A572]/20");

    return true;

}
// Start timer for current question
function startTimer() {
  // Clear any existing timer
  if (state.timer) {
    clearInterval(state.timer);
  }

  state.timeLeft = 15;
  updateTimerDisplay();

  state.timer = setInterval(() => {
    state.timeLeft--;
    updateTimerDisplay();

    if (state.timeLeft <= 0) {
      clearInterval(state.timer);
      handleTimeOut();
    }
  }, 1000);
}

// Update timer display
function updateTimerDisplay() {
  const timerBar = document.getElementById("timer-bar");
  const timerEl = document.getElementById("timer");

  if (timerEl) {
    timerEl.textContent = `${state.timeLeft}s`;

    // Change color based on time left
    if (state.timeLeft <= 5) {
      timerEl.classList.add("text-[#D96666]");
      timerEl.classList.remove("text-[#C5A572]", "text-[#76DB7E]");
    } else if (state.timeLeft <= 10) {
      timerEl.classList.add("text-[#C5A572]");
      timerEl.classList.remove("text-[#D96666]", "text-[#76DB7E]");
    } else {
      timerEl.classList.add("text-[#76DB7E]");
      timerEl.classList.remove("text-[#D96666]", "text-[#C5A572]");
    }
  }

  if (timerBar) {
    const percentage = (state.timeLeft / 15) * 100;
    timerBar.style.width = `${percentage}%`;

    // Change color based on time left
    if (state.timeLeft <= 5) {
      timerBar.classList.add("bg-[#D96666]");
      timerBar.classList.remove("bg-[#76DB7E]", "bg-[#C5A572]");
    } else if (state.timeLeft <= 10) {
      timerBar.classList.remove("bg-[#D96666]", "bg-[#76DB7E]");
      timerBar.classList.add("bg-[#C5A572]");
    } else {
      timerBar.classList.remove("bg-[#C5A572]", "bg-[#D96666]");
      timerBar.classList.add("bg-[#76DB7E]");
    }
  }
}

// Handle time out
function handleTimeOut() {
  const question = state.questions[state.currentIndex];
  const buttons = document.querySelectorAll("#options button");
  const nextBtn = document.getElementById("btn-next");

  // Remove the flame when streak breaks - preserve question-pill
      document.getElementById("quizvy").innerHTML = `<div class="flex items-center">
                  <div id="question-pill">0/10</div>
                  <div id="score-pill" 
                      class="score-pill absolute left-10 font-bold">
                    Poäng: 0
                  </div>
                  <div id="streak-box" class="relative left-24">
                    <div id="streak-pill" class="absolute inset-0 flex items-center justify-center text-lg font-bold text-white z-10 pointer-events-none"></div>
                  </div>
                </div>`;
                document.getElementById("question-pill").textContent = `${state.currentIndex + 1} / ${state.totalQuestions}`;
  
  state.streak = 0;

  // Prevent double scoring
  if (question.answered) return;
  question.answered = true;

  // Disable all buttons and show correct answer
  buttons.forEach((btn) => {
    btn.disabled = true;
    if (btn.textContent === question.correct) {
      btn.classList.add("bg-green-600");
      btn.classList.remove("hover:bg-white/20");
    } else {
      btn.classList.add("bg-gray-600");
      btn.classList.remove("hover:bg-white/20");
    }
  });

  // Enable next button
  nextBtn.disabled = false;
  nextBtn.classList.remove("opacity-60", "cursor-not-allowed");
  nextBtn.classList.add("hover:bg-[#C5A572]/20", "transition");
}

// Load current question
function loadQuestion() {
  const nextBtn = document.getElementById("btn-next");
  nextBtn.disabled = true;
  nextBtn.classList.add("opacity-60", "cursor-not-allowed");
  nextBtn.classList.remove("hover:bg-[#C5A572]/20");

  const question = state.questions[state.currentIndex];
  if (!question) {
    return endGame();
  }

  // Start timer for this question
  console.log(state.streak);
  startTimer();

  // Update UI
  document.getElementById("question-category").textContent =
    getCategoryName(question.category).charAt(0).toUpperCase() +
    getCategoryName(question.category).slice(1);
  document.getElementById("question-text").textContent = question.question;

  const optionsContainer = document.getElementById("options");
  optionsContainer.innerHTML = "";

  question.options.forEach((option) => {
    const btn = document.createElement("button");
    btn.textContent = option;
    btn.className =
      "w-full px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition";
    btn.addEventListener("click", () => checkAnswer(option));
    optionsContainer.appendChild(btn);
  });

  document.getElementById("btn-next").disabled = true;
  document
    .getElementById("btn-next")
    .classList.add("opacity-60", "cursor-not-allowed");
}

// Check the selected answer
function checkAnswer(selected) {
  const question = state.questions[state.currentIndex];
  const buttons = document.querySelectorAll("#options button");
  const nextBtn = document.getElementById("btn-next");
  if (state.streak > 0)
  document.getElementById(
    "streak-pill"
  ).textContent = `${state.streak}`;

  // Prevent double scoring
  if (question.answered) return;
  question.answered = true;

  // Stop the timer
  if (state.timer) {
    clearInterval(state.timer);
  }

  // Calculate time bonus (0-30 points based on time left)
  const timeBonus = state.timeLeft;

  // Disable all buttons and color them
  buttons.forEach((btn) => {
    btn.disabled = true;
    if (btn.textContent === question.correct) {
      btn.classList.add("bg-green-600");
      btn.classList.remove("hover:bg-white/20");
    } else if (btn.textContent === selected && selected !== question.correct) {
      btn.classList.add("bg-red-600");
      btn.classList.remove("hover:bg-white/20");
    } else {
      btn.classList.remove("hover:bg-white/20");
    }
  });

  // Add scores if answer is correct
  if (selected === question.correct) {
    state.score += 25;
    state.timeScore += timeBonus * 2;
    // Streak logic
    state.streak++;

    if (state.streak == 1) {
      console.log("First streak achieved!");
  const streakBox = document.getElementById("streak-box");
  streakBox.innerHTML = `
    <div id="streak-pill"
         class="absolute inset-0 flex items-center justify-center text-lg font-bold text-white z-10 pointer-events-none">
      ${state.streak}
    </div>

    <div class="Smallfire absolute inset-0 flex items-center justify-center pointer-events-none">
      <div class="fire-center">
        <div class="main-fire"></div>
        <div class="particle-fire"></div>
      </div>
    </div>
  `;
}

if (state.streak == 2) {
  const streakBox = document.getElementById("streak-box");
  streakBox.innerHTML = `
    <div id="streak-pill"
         class="absolute inset-0 flex items-center justify-center text-lg font-bold text-white z-10 pointer-events-none">
      ${state.streak}
    </div>

    <div class="Mediumfire absolute inset-0 flex items-center justify-center pointer-events-none">
      <div class="fire-center">
        <div class="main-fire"></div>
        <div class="particle-fire"></div>
      </div>
    </div>
  `;
}

    if (state.streak == 3) {
  const streakBox = document.getElementById("streak-box");
  streakBox.innerHTML = `
    <div id="streak-pill"
         class="absolute inset-0 flex items-center justify-center text-lg font-bold text-white z-10 pointer-events-none">
      ${state.streak}
    </div>

    <div class="fire absolute inset-0 flex items-center justify-center pointer-events-none">
      <div class="fire-left">
        <div class="main-fire"></div>
        <div class="particle-fire"></div>
      </div>
      <div class="fire-center">
        <div class="main-fire"></div>
        <div class="particle-fire"></div>
      </div>
      <div class="fire-right">
        <div class="main-fire"></div>
        <div class="particle-fire"></div>
      </div>
      <div class="fire-bottom">
        <div class="main-fire"></div>
      </div>
    </div>
  `;
}


    const bonusPercent = Math.min((state.streak - 1) * 0.4, 1.2); // 10% per streak, max 50%
    const basePoints = 1 + timeBonus;
    const bonusPoints = Math.round(basePoints * bonusPercent);
    state.bonusScore += bonusPoints;

    console.log(`Streak: ${state.streak}, Bonus +${bonusPoints}`);
    const streakPill = document.getElementById("streak-pill");
    if (streakPill) streakPill.textContent = `${state.streak}`;
  } else {
      // Wrong answer breaks streak
      state.streak = 0;
      const streakPill = document.getElementById("streak-pill");
      if (streakPill) streakPill.textContent = ``;
      
      // Remove the flame when streak breaks - preserve question-pill
      document.getElementById("quizvy").innerHTML = `<div class="flex items-center">
                  <div id="question-pill">0/10</div>
                  <div id="score-pill" 
                      class="score-pill absolute left-10 font-bold">
                    Poäng: 0
                  </div>
                  <div id="streak-box" class="relative left-24">
                    <div id="streak-pill" class="absolute inset-0 flex items-center justify-center text-lg font-bold text-white z-10 pointer-events-none"></div>
                  </div>
                </div>`;
                document.getElementById("question-pill").textContent = `${state.currentIndex + 1} / ${state.totalQuestions}`;
    }
  if (state.streak == 0){
    // Remove the flame when streak breaks - preserve question-pill
      document.getElementById("quizvy").innerHTML = `<div class="flex items-center">
                  <div id="question-pill">0/10</div>
                  <div id="score-pill" 
                      class="score-pill absolute left-10 font-bold">
                    Poäng: 0
                  </div>
                  <div id="streak-box" class="relative left-24">
                    <div id="streak-pill" class="absolute inset-0 flex items-center justify-center text-lg font-bold text-white z-10 pointer-events-none"></div>
                  </div>
                </div>`;
                document.getElementById("question-pill").textContent = `${state.currentIndex + 1} / ${state.totalQuestions}`;
    };

  // Enable next button
  nextBtn.disabled = false;
  nextBtn.classList.remove("opacity-60", "cursor-not-allowed");
  nextBtn.classList.add("hover:bg-[#C5A572]/20", "transition");

  // Update score display
  document.getElementById("score-pill").textContent = `Poäng: ${state.score + state.timeScore + state.bonusScore}`;
  const timeScorePill = document.getElementById("time-score-pill");
  if (timeScorePill) {
    timeScorePill.textContent = `Tidspoäng: ${state.timeScore}`;
  }
}

// Move to next question
document.getElementById("btn-next").addEventListener("click", () => {
  state.currentIndex++;
  updateProgress();
  if (state.currentIndex < state.totalQuestions) {
    loadQuestion();
  } else {
    endGame();
  }
});

// Update progress bar
function updateProgress() {
  const progress = (state.currentIndex + 1 / state.totalQuestions) * 100;

  // Update scoreboard
  document.getElementById("score-pill").textContent =
    `Poäng: ${state.score + state.timeScore + state.bonusScore}`;
  const timeScorePill = document.getElementById("time-score-pill");
  if (timeScorePill) {
    timeScorePill.textContent = `Tidspoäng: ${state.timeScore}`;
  }

  // Update new progress bar
  const bar = document.getElementById("question-progress-bar");
  const text = document.getElementById("progress-text");

  document.getElementById("question-pill").textContent = `${state.currentIndex + 1} / ${state.totalQuestions}`;
  if (bar) bar.style.width = `${progress}%`;
  if (text) text.textContent = `${state.currentIndex} / ${state.totalQuestions}`;
}



// End the game
function endGame() {
  // Clear timer
  if (state.timer) {
    clearInterval(state.timer);
  }

  document.getElementById("view-quiz").classList.add("hidden");
  document.getElementById("view-result").classList.remove("hidden");

  // Calculate max possible time score (15 points per question)
  const maxTimeScore = state.totalQuestions * 15;
  const totalScore = state.score + state.timeScore + state.bonusScore;
  const maxTotalScore = state.totalQuestions + maxTimeScore;

  // Skicka poäng till leaderboard (backend teamet la till denna rad)
  if (window.submitScore) {
    window.submitScore("LB-trivia", totalScore);
  }

  document.getElementById(
    "final-bonus-score"
  ).textContent = `Bonuspoäng: ${state.bonusScore}`;
  document.getElementById(
    "final-score"
  ).textContent = `Du fick ${state.score/25} av 10 rätt.`;
  document.getElementById(
    "final-time-score"
  ).textContent = `Tidspoäng: ${state.timeScore} av 300 möjliga`;
  document.getElementById(
    "final-total-score"
  ).textContent = `Totalt: ${totalScore} poäng`;

  let feedback;
  // Provide feedback based on performance
  const percentage = (state.score / state.totalQuestions) * 100;
  if (
    state.score === state.totalQuestions &&
    state.timeScore >= maxTimeScore * 0.8
  ) {
    feedback = "Otroligt! Perfekt poäng OCH blixtsnabb! 🏆";
  } else if (state.score === state.totalQuestions) {
    feedback = "Perfekt! Du är en Nobelmästare!";
  } else if (percentage >= 80) {
    feedback = "Utmärkt! Du har koll på Nobelpristagarna!";
  } else if (percentage >= 60) {
    feedback = "Bra jobbat! Du vet mycket om Nobelpriset!";
  } else if (percentage >= 40) {
    feedback = "Hyggligt! Fortsätt öva så blir du bättre!";
  } else {
    feedback = "Fortsätt öva – du lär dig snabbt!";
  }

  document.getElementById("final-feedback").textContent = feedback;

  // Save best scores in localStorage
  const bestCorrect = Math.max(
    state.score,
    parseInt(localStorage.getItem("bestScore") || "0")
  );
  const bestTime = Math.max(
    state.timeScore,
    parseInt(localStorage.getItem("bestTimeScore") || "0")
  );
  const bestTotal = Math.max(
    totalScore,
    parseInt(localStorage.getItem("bestTotalScore") || "0")
  );

  localStorage.setItem("bestScore", bestCorrect);
  localStorage.setItem("bestTimeScore", bestTime);
  localStorage.setItem("bestTotalScore", bestTotal);

  document.getElementById("best-score").textContent = `${bestCorrect} rätt`;
  document.getElementById(
    "best-time-score"
  ).textContent = `${bestTime} tidspoäng`;
  document.getElementById(
    "best-total-score"
  ).textContent = `${bestTotal} totalt`;

}

// Expose startGame for main.js
window.startGame = startGame;

if (state.streak == 1){
  console.log("First streak achieved!");
}
