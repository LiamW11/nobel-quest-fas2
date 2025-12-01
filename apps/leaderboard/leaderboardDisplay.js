// leaderboardDisplay.js

// Importerar funktionen som hämtar data från Firestore (från leaderboardManager.js)
import { getTopScores } from "./leaderboardManager.js"; 

/**
 * Skapar och visar Top 5-listan i rätt HTML-element.
 */
function renderLeaderboard(scores, elementId) {
    const listElement = document.getElementById(elementId);
    if (!listElement) return;

    listElement.innerHTML = ''; // Rensa gamla listan

    if (scores.length === 0) {
        listElement.innerHTML = '<li>Inga poäng registrerade än.</li>';
        return;
    }

    scores.forEach((scoreEntry) => {
        const li = document.createElement('li');
        // Matchar formatet i er ursprungliga HTML: "Spelarnamn - Poäng pts"
        li.textContent = `${scoreEntry.displayName}: ${scoreEntry.score} pts`;
        listElement.appendChild(li);
    });
}

/**
 * Hanterar hämtning och visning av alla tre topplistor.
 */
async function loadAllLeaderboards() {
    // Mappar Firestore ID till HTML-listans ID
    const games = [
        { id: 'LB-timeline', listId: 'list-timeline' },
        { id: 'LB-match', listId: 'list-match' },
        { id: 'LB-trivia', listId: 'list-trivia' }
    ];

    // Ladda alla topplistor parallellt (för snabbare laddning)
    const fetchPromises = games.map(game => getTopScores(game.id));
    const results = await Promise.all(fetchPromises);

    // Rendera resultaten
    games.forEach((game, index) => {
        renderLeaderboard(results[index], game.listId);
    });
}

// Kör funktionen när sidan laddats
window.addEventListener('load', loadAllLeaderboards);