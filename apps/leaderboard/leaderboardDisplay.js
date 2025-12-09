// Importerar funktionen som hämtar data från Firestore
import { getTopScores, getAllScores } from "./leaderboardManager.js"; 

/**
 * Skapar en leaderboard-rad med mobiloptimerad design
 */
function createLeaderboardItem(rank, name, score) {
    let rankBadge = '';
    let itemClass = 'bg-[#1e3458]';
    
    if (rank === 1) {
        rankBadge = '<div class="rank-1 w-9 h-9 rounded-full flex items-center justify-center text-lg font-black flex-shrink-0">🥇</div>';
        itemClass = 'bg-gradient-to-r from-[#1e3458] to-[#2a4a6f] border-2 border-yellow-500';
    } else if (rank === 2) {
        rankBadge = '<div class="rank-2 w-9 h-9 rounded-full flex items-center justify-center text-lg font-black flex-shrink-0">🥈</div>';
        itemClass = 'bg-gradient-to-r from-[#1e3458] to-[#2a4a6f] border-2 border-gray-400';
    } else if (rank === 3) {
        rankBadge = '<div class="rank-3 w-9 h-9 rounded-full flex items-center justify-center text-lg font-black flex-shrink-0">🥉</div>';
        itemClass = 'bg-gradient-to-r from-[#1e3458] to-[#2a4a6f] border-2 border-orange-600';
    } else {
        // Alternera färger för plats 4-10
        itemClass = rank % 2 === 0 ? 'bg-[#1a2f4a]' : 'bg-[#1e3458]';
        rankBadge = `<div class="w-9 h-9 bg-[#0b1e39] rounded-full flex items-center justify-center flex-shrink-0">
                      <span class="text-base font-bold text-gray-400">${rank}</span>
                    </div>`;
    }

    return `
        <li class="flex items-center p-2.5 ${itemClass} rounded-xl shadow-lg transition duration-300 active:scale-95">
            ${rankBadge}
            
            <div class="flex-grow min-w-0 ml-2.5">
                <p class="text-sm font-bold text-white truncate leading-tight">${name}</p>
            </div>
            
            <div class="flex-shrink-0 ml-2 text-right">
                <p class="text-2xl font-black text-[#C5A572] leading-tight">${score}</p>
            </div>
        </li>
    `;
}

/**
 * Renderar en topplista i HTML
 */
function renderLeaderboard(listId, data) {
    const listElement = document.getElementById(listId);
    if (!listElement) return;
    
    if (data.length === 0) {
        listElement.innerHTML = '<li class="text-center py-8 text-gray-400 text-sm">Inga poäng registrerade än 🎯</li>';
        return;
    }
    
    listElement.innerHTML = data.map((item, index) => 
        createLeaderboardItem(index + 1, item.displayName, item.score)
    ).join('');
}

/**
 * Kombinerar poäng från alla spel
 */
async function getCombinedScores() {
    const games = ['LB-timeline', 'LB-match', 'LB-trivia'];
    const allScores = {};

    for (const gameId of games) {
        const scores = await getAllScores(gameId);
        scores.forEach(scoreEntry => {
            const userId = scoreEntry.userId;
            if (!allScores[userId]) {
                allScores[userId] = {
                    displayName: scoreEntry.displayName,
                    score: 0,
                    userId: userId
                };
            }
            allScores[userId].score += scoreEntry.score;
        });
    }

    const combinedArray = Object.values(allScores);
    combinedArray.sort((a, b) => b.score - a.score);
    
    return combinedArray.slice(0, 10);
}

/**
 * Hanterar hämtning och visning av alla fyra topplistor
 */
export async function loadAllLeaderboards() {
    try {
        // Ladda kombinerad topplista
        const combinedScores = await getCombinedScores();
        renderLeaderboard('list-combined', combinedScores);

        // Ladda individuella spel parallellt
        const [timelineScores, matchScores, triviaScores] = await Promise.all([
            getTopScores('LB-timeline', 10),
            getTopScores('LB-match', 10),
            getTopScores('LB-trivia', 10)
        ]);

        renderLeaderboard('list-timeline', timelineScores);
        renderLeaderboard('list-match', matchScores);
        renderLeaderboard('list-trivia', triviaScores);

    } catch (error) {
        console.error("Fel vid laddning av leaderboards:", error);
    }
}

// Kör funktionen när sidan laddats
window.addEventListener('DOMContentLoaded', loadAllLeaderboards);