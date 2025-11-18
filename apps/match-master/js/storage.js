// storage.js - LocalStorage för highscores

const STORAGE_KEY = "nobel-match-highscores";

// Sparar ett nytt highscore
function saveHighScore(playerName, score, time, moves, difficulty) {
  try {
    const highscores = getHighScores();

    const newScore = {
      name: playerName,
      score: score,
      time: time,
      moves: moves,
      difficulty: difficulty,
      date: new Date().toISOString(),
    };

    highscores.push(newScore);

    // Sortera efter poäng (högst först)
    highscores.sort((a, b) => {
      if (b.score === a.score) {
        return a.time - b.time; // Om poängen är lika sortera efter tid
      }
      return b.score - a.score;
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(highscores));
   
    // Returnera placeringen för detta score
    return getScoreRank(newScore, difficulty);
  } catch (error) {
    console.error("Fel vid sparning av highscore:", error);
    return -1;
  }
}

// Hämtar alla highscores
function getHighScores() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Fel vid hämtning av highscores:", error);
    return [];
  }
}

// Hämtar highscores för en specifik svårighetsgrad
function getHighScoresByDifficulty(difficulty) {
  const allScores = getHighScores();
  return allScores
    .filter((score) => score.difficulty === difficulty)
    .sort((a, b) => {
      if (b.score === a.score) {
        return a.time - b.time; // Om poängen är lika sortera efter tid
      }
      return b.score - a.score;
    })
    .slice(0, 10); // Top 10
}
// Hämtar highscores för en specifik svårighetsgrad sorterat efter tid
function getHighScoresByDifficultyAndTime(difficulty) {
  const allScores = getHighScores();
  return allScores
    .filter((score) => score.difficulty === difficulty)
    .sort((a, b) => a.time - b.time) // Snabbast tid först
    .slice(0, 10);
}

// Hittar placeringen för ett specifikt score
// Hittar placeringen för ett specifikt score
function getScoreRank(scoreObj, difficulty) {
  const scores = getHighScoresByDifficulty(difficulty);

  // Hitta index för detta score
  for (let i = 0; i < scores.length; i++) {
    if (
      scores[i].name === scoreObj.name &&
      scores[i].score === scoreObj.score &&
      scores[i].time === scoreObj.time
    ) {
      return i + 1; // Returnera placering (1-indexed)
    }
  }

  return -1; // Inte hittad
}

// Rensar alla highscores (för testning)
function clearHighScores() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Fel vid rensning av highscores:", error);
  }
}
