// hanterar all lagring i localstorage: senaste resultat och leaderboard

const KEY = "nobel-timeline-last-score";

// spara senaste resultatet så det går att läsa upp senare om man vill
export const saveLastScore = (o) =>
  localStorage.setItem(KEY, JSON.stringify(o));

// hämta senaste sparade resultatet (eller null om inget finns)
export const getLastScore = () =>
  JSON.parse(localStorage.getItem(KEY) || "null");




