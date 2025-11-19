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
  document.getElementById("score").textContent = 0;
  document.getElementById("timer").textContent = "0:00";

  console.log("🎨 Renderar kort...");
  renderCards();
}