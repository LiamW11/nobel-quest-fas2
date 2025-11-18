const game = {
  cards: [],
  flippedCards: [],
  moves: 0,
  matches: 0,
  isFlipping: false,
  timer: 0,
  timerInterval: null,
  difficulty: "easy",
  pairsNeeded: 3,
  score: 0,
  playerName: "",
};

function createNobelCards() {
  if (!nobelData || nobelData.length === 0) {
    console.error("nobelData är tom eller undefined!");
    return [];
  }

  const cards = [];
  let id = 0;
  const selected = shuffleCard(nobelData).slice(0, game.pairsNeeded);

  selected.forEach((laureate) => {
    cards.push({
      id: id++,
      pairId: laureate.id,
      type: "person",
      name: laureate.name,
      country: laureate.country,
      imageUrl: laureate.imageUrl,
      matched: false,
      flipped: false,
    });

    cards.push({
      id: id++,
      pairId: laureate.id,
      type: "achievement",
      category: laureate.category,
      achievement: laureate.achievement,
      year: laureate.year,
      matched: false,
      flipped: false,
    });
  });

  return shuffleCard(cards);
}

/**
 * Funktion som hanterar när en spelare klickar på ett kort
 * @param {number} cardId - ID:t för kortet som ska vändas
 */
function flipCard(cardId) {
  // Hitta kortet i spelet baserat på ID
  const card = game.cards.find((c) => c.id === cardId);

  // Om kortet inte finns, avbryt funktionen
  if (!card) {
    return;
  }

  // Om kortet redan är vänt, avbryt (förhindrar dubbelklick)
  if (card.flipped) {
    return;
  }

  // Om kortet redan är matchat, avbryt (kan inte vända matchade kort)
  if (card.matched) {
    return;
  }
  
  // Om två kort redan är vända, avbryt (max 2 kort åt gången)
  if (game.flippedCards.length >= 2) {
    return;
  }

  // Om spelet håller på att vända kort (animation pågår), avbryt
  if (game.isFlipping) {
    return;
  }

  // Starta timern när första kortet vänds (första draget)
  if (game.moves === 0 && game.flippedCards.length === 0) {
    startTimer();
  }

  // Spela upp vändljud från början
  gameSound.flip.currentTime = 0;
  gameSound.flip.play().catch((e) => console.log("Ljud blockerat"));

  // Markera kortet som vänt
  card.flipped = true;
  // Lägg till kortets ID i listan över vända kort
  game.flippedCards.push(cardId);

  // Uppdatera visningen av korten på skärmen
  renderCards();
  
  // Om två kort är vända, vänta 500ms och kontrollera sedan om de matchar
  if (game.flippedCards.length === 2) {
    setTimeout(() => {
      checkMatch();
    }, 500);
  }
}

/**
 * Funktion som kontrollerar om två vända kort matchar varandra
 * Kollar om de har samma pairId (samma Nobelpristagare)
 */
function checkMatch() {
  // Hämta ID:na för de två vända korten
  const [id1, id2] = game.flippedCards;
  // Hitta själva kortobjekten baserat på ID:na
  const card1 = game.cards.find((c) => c.id === id1);
  const card2 = game.cards.find((c) => c.id === id2);

  // Öka antalet drag (moves) med 1
  game.moves++;

  // Kontrollera om korten matchar genom att jämföra deras pairId
  if (card1.pairId === card2.pairId) {
    // === MATCHNING! ===
    
    // Spela upp matchningsljud från början
    gameSound.match.currentTime = 0;
    gameSound.match.play().catch((e) => console.log("Ljud blockerat"));
    
    // Markera båda korten som matchade
    card1.matched = true;
    card2.matched = true;
    
    // Öka antalet matchningar och poäng
    game.matches++;
    game.score += 100;
    
    // Töm listan över vända kort (redo för nästa drag)
    game.flippedCards = [];

    // Uppdatera visningen av korten
    renderCards();
    // Uppdatera poängvisningen på skärmen
    document.getElementById("score").textContent = game.score;

    // Om alla par har matchats, spelet är slut
    if (game.matches === game.pairsNeeded) {
      // Stoppa timern
      stopTimer();
   
      // Spela upp vinnarljud
      gameSound.win.currentTime = 0;
      gameSound.win.play().catch((e) => console.log("Ljud blockerat"));
    
      // Visa slutskärmen efter 800ms (ger tid för animation)
      setTimeout(() => showEndScreen(), 800);
    }
  } else {
    // === INGEN MATCHNING! ===
    
    // Dra av 10 poäng för felaktigt drag
    game.score -= 10;
    // Uppdatera poängvisningen
    document.getElementById("score").textContent = game.score;
  
    // Lås spelet tillfälligt under animationen
    game.isFlipping = true;
    
    // Hitta HTML-elementen för de två korten
    const card1Element = document.querySelector(`[data-card-id="${id1}"]`);
    const card2Element = document.querySelector(`[data-card-id="${id2}"]`);

    // Spela upp "fel"-ljud
    gameSound.wrong.play().catch((e) => console.log("Ljud blockerat"));
    
    // Lägg till "shake"-animation på båda korten
    if (card1Element) card1Element.classList.add("shake");
    if (card2Element) card2Element.classList.add("shake");

    // Efter 600ms (animation klar):
    setTimeout(() => {
      // Ta bort shake-animationen
      if (card1Element) card1Element.classList.remove("shake");
      if (card2Element) card2Element.classList.remove("shake");
      
      // Vänd tillbaka korten (markera som inte vända)
      card1.flipped = false;
      card2.flipped = false;
      
      // Töm listan över vända kort
      game.flippedCards = [];
      
      // Lås upp spelet igen (tillåt nya klick)
      game.isFlipping = false;
      
      // Uppdatera visningen (vänd tillbaka korten visuellt)
      renderCards();
    }, 600); 
  }
}

function finalizeScore() {
  let bonus = 0;

  if (game.timer < 60) bonus += 100;
  else if (game.timer < 120) bonus += 50;
  else if (game.timer < 180) bonus += 25;

  if (game.moves === game.pairsNeeded) bonus += 200;

  let maxBase = 0;
  switch (game.difficulty) {
    case "easy":
      maxBase = 600;
      break;
    case "medium":
      maxBase = 900;
      break;
    case "hard":
      maxBase = 1200;
      break;
  }

  const final = Math.min(game.score + bonus, maxBase + 300);
  return final;
}


function startTimer() {
  game.timer = 0;
  clearInterval(game.timerInterval);
  game.timerInterval = setInterval(() => {
    game.timer++;
    const mins = Math.floor(game.timer / 60);
    const secs = game.timer % 60;
    document.getElementById("timer").textContent = `${mins}:${secs
      .toString()
      .padStart(2, "0")}`;
  }, 1000);
}

function stopTimer() {
  clearInterval(game.timerInterval);
}

async function startGame(difficulty, playerName) {

  document.getElementById("startScreen").classList.add("hidden");
  document.getElementById("gameScreen").classList.remove("hidden");

  if (nobelData.length === 0) {
    await loadNobelData();
  }

  game.difficulty = difficulty || "easy";
  game.playerName = playerName || "Anonym";

  if (difficulty === "easy") game.pairsNeeded = 6;
  else if (difficulty === "medium") game.pairsNeeded = 9;
  else if (difficulty === "hard") game.pairsNeeded = 12;

  game.cards = createNobelCards();

  if (game.cards.length === 0) {
    console.error("❌ Inga kort skapades!");
    return;
  }
  game.flippedCards = [];
  game.moves = 0;
  game.matches = 0;
  game.isFlipping = false;
  game.timer = 0;
  game.score = 0;
  document.getElementById("score").textContent = 0;
  document.getElementById("timer").textContent = "0:00";

  renderCards();
}

document.getElementById("giveUpBtn").addEventListener("click", () => {
  if (confirm("Är du säker på att du vill ge upp? Dina poäng sparas inte.")) {
    // Stoppa timer och återställ spel manuellt — utan att kalla endGame()
    clearInterval(game.timerInterval);
    game.timerInterval = null;

    // Nollställ spelets data
    game.cards = [];
    game.flippedCards = [];
    game.moves = 0;
    game.matches = 0;
    game.timer = 0;
    game.score = 0;

    // Visa rätt sida i HTML
    document.getElementById("gameScreen").classList.add("hidden");
    document.getElementById("endScreen").classList.add("hidden");
    document.getElementById("leaderboardScreen").classList.add("hidden");
    document.getElementById("startScreen").classList.remove("hidden");

    // rensa korten
    const cardGrid = document.getElementById("cardGrid");
    if (cardGrid) cardGrid.innerHTML = "";
  }
});
