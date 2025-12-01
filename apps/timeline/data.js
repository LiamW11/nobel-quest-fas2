// ansvarar för att hämta och blanda nobelpristagare
export async function loadNobelData() {
  const res = await fetch("starter-kit/nobel-data.json");
  const json = await res.json();
  // format: [{id, name, year, category, imageUrl}]
  return json.laureates;
}

// fisher yates shuffle
export function shuffle(array) {
  // vi går igenom listan baklänges och byter plats på två element åt gången
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
