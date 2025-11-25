const game = {
  cards: [],
  flippedCards: [],
  moves: 0,
  matches: 0,
  isFlipping: false,
  timer: 0,
  timerInterval: null,
  pairsNeeded: 6,
  score: 0,
  gaveUp: false,
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

function flipCard(cardId) {
  const card = game.cards.find((c) => c.id === cardId);
  
  // Kolla om kortet kan vändas
  if (!card) return;
  if (card.flipped) return;  // Redan vänt
  if (card.matched) return;  // Redan matchat
  if (game.flippedCards.length >= 2) return;  // Max 2 kort åt gången
  if (game.isFlipping) return;  // Animation pågår

  // Starta timer vid första draget
  if (game.moves === 0 && game.flippedCards.length === 0) {
    startTimer();
  }

  // Vänd kortet
  card.flipped = true;
  game.flippedCards.push(cardId);
  renderCards();
  
  // Om 2 kort är vända, kolla matchning
  if (game.flippedCards.length === 2) {
    setTimeout(() => {
      checkMatch();
    }, 500);
  }
}

function checkMatch() {
  const [id1, id2] = game.flippedCards;
  const card1 = game.cards.find((c) => c.id === id1);
  const card2 = game.cards.find((c) => c.id === id2);

  game.moves++;

  if (card1.pairId === card2.pairId) {
    // ✅ MATCH!
    card1.matched = true;
    card2.matched = true;
    game.matches++;
    game.score += 100;
    game.flippedCards = [];

    renderCards();
    document.getElementById("score").textContent = game.score;
    document.getElementById("matches").textContent = `${game.matches}/${game.pairsNeeded}`;

    // Kolla om spelet är klart
    if (game.matches === game.pairsNeeded) {
      stopTimer();
      setTimeout(() => {
        showEndScreen();
      }, 800);
    }
  } else {
    // ❌ INGEN MATCH
    game.score -= 10;
    document.getElementById("score").textContent = game.score;
    
    game.isFlipping = true;
    
    // Hitta kort-elementen för shake-animation
    const card1Element = document.querySelector(`[data-card-id="${id1}"]`);
    const card2Element = document.querySelector(`[data-card-id="${id2}"]`);

    if (card1Element) card1Element.classList.add("shake");
    if (card2Element) card2Element.classList.add("shake");

    // Vänd tillbaka efter 600ms
    setTimeout(() => {
      if (card1Element) card1Element.classList.remove("shake");
      if (card2Element) card2Element.classList.remove("shake");
      
      card1.flipped = false;
      card2.flipped = false;
      game.flippedCards = [];
      game.isFlipping = false;
      renderCards();
    }, 600); 
  }
}


async function startGame() {
  console.log("🎮 Startar spel...");

  if (nobelData.length === 0) {
    console.log("📥 Laddar Nobel-data...");
    await loadNobelData();
  }
  
  game.pairsNeeded = 6;
  game.cards = createNobelCards();

  console.log("✅ Kort skapade:", game.cards.length);

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
  game.gaveUp = false;
  document.getElementById("score").textContent = 0;
  document.getElementById("timer").textContent = "0:00";

  console.log("🎨 Renderar kort...");
  renderCards();
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

function finalizeScore() {
  if (game.matches !== game.pairsNeeded) {
    return game.score;
  }
  let bonus = 0;
  
  // Tidsbonus
  if (game.timer < 60) bonus += 100;
  else if (game.timer < 120) bonus += 50;
  else if (game.timer < 180) bonus += 25;
  
  // Perfect game bonus
  if (game.moves === game.pairsNeeded) bonus += 200;
  
  const maxBase = 600;  
  const final = Math.min(game.score + bonus, maxBase + 300);
  return final;
}