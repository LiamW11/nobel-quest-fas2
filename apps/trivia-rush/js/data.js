// Datastruktur för alla quizfrågor
let quizData = {
  physics: [],
  chemistry: [],
  medicine: [],
  literature: [],
  peace: [],
  economics: []
};

// Array som fylls med all nobelpristagardata från JSON-filen
let allLaureates = [];

// Utility function to shuffle an array
function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

// Utility function to get unique random items from an array
function getUniqueRandomItems(array, count) {
  const unique = Array.from(new Set(array)); // dedupe
  const shuffled = [...unique].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
// Utility function to get category name in Swedish
function getCategoryName(category) {
  const names = {
    physics: "fysik",
    chemistry: "kemi",
    medicine: "medicin",
    literature: "litteratur",
    peace: "fred",
    economics: "ekonomi"
  };
  return names[category] || category;
}

// Export for use in game.js
window.getCategoryName = getCategoryName;

// Helper function to create a "who won for X" question
function generateWrongNames(correctName, category, laureates) {
  let names = laureates
    .filter(l => l.category && l.category.toLowerCase() === category && l.name !== correctName)
    .map(l => l.name);

  if (names.length < 3) {
    const extras = laureates
      .filter(l => l.name !== correctName)
      .map(l => l.name);
    names = Array.from(new Set([...names, ...extras]));
  }

  return getUniqueRandomItems(names, 3);
}

function generateQuizQuestions() {
  // Physics questions
  quizData.physics = [
    createYearQuestion("Marie Curie", "physics", allLaureates),
    createCountryQuestion("Albert Einstein", "physics", allLaureates),
    createAchievementQuestion("Niels Bohr", allLaureates),
    createYearQuestion("Werner Heisenberg", "physics", allLaureates),
    createCountryQuestion("Richard Feynman", "physics", allLaureates),
    createAchievementQuestion("Enrico Fermi", allLaureates),
    createYearQuestion("Max Planck", "physics", allLaureates),
    createCountryQuestion("Paul Dirac", "physics", allLaureates),
    createYearQuestion("Peter Higgs", "physics", allLaureates),
    createAchievementQuestion("Roger Penrose", allLaureates)
  ];

  // Chemistry questions
  quizData.chemistry = [
    createYearQuestion("Marie Curie", "chemistry", allLaureates, 1911),
    createCountryQuestion("Linus Pauling", "chemistry", allLaureates),
    createAchievementQuestion("Dorothy Hodgkin", allLaureates),
    createYearQuestion("Ahmed Zewail", "chemistry", allLaureates),
    createCountryQuestion("Jennifer Doudna", "chemistry", allLaureates),
    createAchievementQuestion("Emmanuelle Charpentier", allLaureates),
    createYearQuestion("Rosalind Franklin", "chemistry", allLaureates),
    createWhoWonQuestion("CRISPR-genredigering", "chemistry", allLaureates),
    createWhoWonQuestion("Kemiska bindningar", "chemistry", allLaureates),
    createWhoWonQuestion("Femtokemi", "chemistry", allLaureates)
  ];

  // Medicine questions
  quizData.medicine = [
    createYearQuestion("Alexander Fleming", "medicine", allLaureates),
    createCountryQuestion("Tu Youyou", "medicine", allLaureates),
    createAchievementQuestion("Frederick Banting", allLaureates),
    createYearQuestion("Francis Crick", "medicine", allLaureates),
    createWhoWonQuestion("DNA-strukturen", "medicine", allLaureates),
    createAchievementQuestion("Gertrude Elion", allLaureates),
    createYearQuestion("Shinya Yamanaka", "medicine", allLaureates),
    createCountryQuestion("May-Britt Moser", "medicine", allLaureates),
    createYearQuestion("Katalin Karikó", "medicine", allLaureates),
    createAchievementQuestion("Elizabeth Blackburn", allLaureates)
  ];

  // Literature questions
  quizData.literature = [
    createYearQuestion("Ernest Hemingway", "literature", allLaureates),
    createCountryQuestion("Toni Morrison", "literature", allLaureates),
    createAchievementQuestion("Gabriel García Márquez", allLaureates),
    createYearQuestion("Selma Lagerlöf", "literature", allLaureates),
    createCountryQuestion("Pablo Neruda", "literature", allLaureates),
    createAchievementQuestion("Rabindranath Tagore", allLaureates),
    createYearQuestion("John Steinbeck", "literature", allLaureates),
    createWhoWonQuestion("Novellkonst", "literature", allLaureates),
    createYearQuestion("Kazuo Ishiguro", "literature", allLaureates),
    createCountryQuestion("Orhan Pamuk", "literature", allLaureates)
  ];

  // Peace questions
  quizData.peace = [
    createYearQuestion("Malala Yousafzai", "peace", allLaureates),
    createCountryQuestion("Nelson Mandela", "peace", allLaureates),
    createAchievementQuestion("Martin Luther King Jr.", allLaureates),
    createYearQuestion("Mother Teresa", "peace", allLaureates),
    createCountryQuestion("Wangari Maathai", "peace", allLaureates),
    createAchievementQuestion("Dalai Lama", allLaureates),
    createYearQuestion("Barack Obama", "peace", allLaureates),
    createWhoWonQuestion("Kamp mot apartheid", "peace", allLaureates),
    createYearQuestion("Desmond Tutu", "peace", allLaureates),
    createCountryQuestion("Kofi Annan", "peace", allLaureates)
  ];

  // Economics questions
  quizData.economics = [
    createYearQuestion("Esther Duflo", "economics", allLaureates),
    createCountryQuestion("Esther Duflo", "economics", allLaureates),
    createAchievementQuestion("Esther Duflo", allLaureates),
    createWhoWonQuestion("Fattigdomsforskning", "economics", allLaureates),

    // Custom economics questions
    {
      question: "Vilket år delades det första ekonomipriset ut?",
      options: ["1969", "1901", "1975", "1955"],
      correct: "1969",
      category: "economics"
    },
    {
      question: "Hur många nobelpristagare i ekonomi finns med i vår databas?",
      options: ["1", "5", "10", "15"],
      correct: "1",
      category: "economics"
    },
    {
      question: "Vilken organisation delar ut ekonomipriset?",
      options: ["Sveriges Riksbank", "FN", "Nobelstiftelsen", "Europaparlamentet"],
      correct: "Sveriges Riksbank",
      category: "economics"
    },

    {
      question: "Vilket område belönas oftast i ekonomipriset?",
      options: ["Makroekonomi", "Astrologi", "Arkeologi", "Botanik"],
      correct: "Makroekonomi",
      category: "economics"
    },
    {
      question: "Vilken av följande är ett vanligt forskningsområde inom ekonomi?",
      options: ["Spelteori", "Fotosyntes", "Cellbiologi", "Astrofysik"],
      correct: "Spelteori",
      category: "economics"
    },
    {
      question: "Vilket begrepp används ofta inom ekonomi för att beskriva hur människor fattar beslut?",
      options: ["Rationellt beteende", "Fotosyntes", "Gravitation", "Evolution"],
      correct: "Rationellt beteende",
      category: "economics"
    }
  ];
}

// Helper function to create a "year" question
function createYearQuestion(name, category, laureates, specificYear = null) {
  const laureate = laureates.find(l => l.name === name && (specificYear ? l.year === specificYear : true));
  if (!laureate) return null;

  const correctYear = laureate.year.toString();
  const wrongYears = generateWrongYears(correctYear, laureates);

  return {
    question: `Vilket år fick ${name} nobelpriset i ${getCategoryName(category)}?`,
    options: shuffle([correctYear, ...wrongYears]),
    correct: correctYear,
    category: category
  };
}

// Helper function to create a "which country" question
function createCountryQuestion(name, category, laureates) {
  const laureate = laureates.find(l => l.name === name);
  if (!laureate) return null;

  const correctCountry = laureate.country;
  const wrongCountries = generateWrongCountries(correctCountry, laureates);

  return {
    question: `Från vilket land kommer ${name}?`,
    options: shuffle([correctCountry, ...wrongCountries]),
    correct: correctCountry,
    category: category
  };
}


// skapar en "vad fick X nobelpriset för?" fråga
function createAchievementQuestion(name, laureates) {
  const laureate = laureates.find(l => l.name === name);
  if (!laureate) return null;

  const correctAchievement = laureate.achievement;
  const wrongAchievements = generateWrongAchievements(correctAchievement, laureate.category, laureates);

  return {
    question: `Vad fick ${name} nobelpriset för?`,
    options: shuffle([correctAchievement, ...wrongAchievements]),
    correct: correctAchievement,
    category: laureate.category.toLowerCase()
  };
}


// skapar en "vem fick nobelpriset för X?" fråga
function createWhoWonQuestion(achievement, category, laureates) {
  const laureate = laureates.find(l => l.achievement === achievement);
  if (!laureate) return null;

  const correctName = laureate.name;
  const wrongNames = generateWrongNames(correctName, category, laureates);

  return {
    question: `Vem fick nobelpriset för ${achievement}?`,
    options: shuffle([correctName, ...wrongNames]),
    correct: correctName,
    category: category
  };
}

// Helper functions to generate wrong answers
function generateWrongYears(correctYear, laureates) {
  const years = laureates.map(l => l.year.toString()).filter(y => y !== correctYear);
  return getUniqueRandomItems(years, 3);
}

function generateWrongCountries(correctCountry, laureates) {
  const countries = [...new Set(laureates.map(l => l.country))].filter(c => c !== correctCountry);
  return getUniqueRandomItems(countries, 3);
}

// General utility to get random items
function getRandomItems(array, count) {
  const shuffled = [...array].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function generateWrongAchievements(correctAchievement, category, laureates) {
  let achievements = laureates
    .filter(l => l.category === category && l.achievement !== correctAchievement)
    .map(l => l.achievement);

// Ensure we have at least 3 wrong answers
  if (achievements.length < 3) {
    const extras = laureates
      .filter(l => l.achievement !== correctAchievement)
      .map(l => l.achievement);
    achievements = Array.from(new Set([...achievements, ...extras]));
  }

  return getUniqueRandomItems(achievements, 3);
}


// Export quizData and allLaureates for use in other modules
window.quizData = quizData;
window.allLaureates = allLaureates;

// Signal som andra filer kan vänta på innan quizet är klart
window.quizReady = new Promise(resolve => {
  fetch('nobel-data.json')
    .then(response => response.json())
    .then(data => {
      console.log("Nobel data loaded:", data);
      allLaureates = data.laureates;
      generateQuizQuestions();
      resolve();
    })
    .catch(error => console.error("Error loading Nobel data:", error));
});