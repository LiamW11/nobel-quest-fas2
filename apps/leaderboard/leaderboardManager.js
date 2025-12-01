// leaderboardManager.js (KORRIGERAD OCH SLUTGILTIG VERSION)

// Denna sökväg ser korrekt ut:
import { db, auth } from "../../shared/firebase-config.js"; 
import { doc, setDoc, collection, query, orderBy, limit, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/**
 * Hämtar den inloggade användarens UID och visningsnamn.
 */
function getPlayerInfo() {
    const user = auth.currentUser;
    if (!user) {
        console.error("Ingen användare inloggad. Poängen kan inte sparas.");
        return null;
    }
    const displayName = user.displayName || user.email.split('@')[0] || "Anonym Spelare";
    return { uid: user.uid, displayName: displayName };
}

export async function submitScore(gameId, score) {
    const playerInfo = getPlayerInfo();
    if (!playerInfo) return;
    
    const validGames = ['LB-match', 'LB-timeline', 'LB-trivia'];
    if (!validGames.includes(gameId)) {
        console.error(`Ogiltigt Game ID: ${gameId}`);
        return;
    }

    const { uid, displayName } = playerInfo;
    
    try {
        // KORREKT SÖKVÄG FÖR ATT SKRIVA: (Collection: gameId, Document: uid)
        // Poängen sparas nu i t.ex. /LB-timeline/[användar-UID]
        const scoreDocRef = doc(db, gameId, uid); 
        
        await setDoc(scoreDocRef, {
            userId: uid,           
            displayName: displayName,
            score: score,
            timestamp: new Date()
        }, { merge: true });

        console.log(`Poäng för ${gameId} skickad: ${score}`);
        
    } catch (error) {
        if (error.code === 'permission-denied') {
            console.log(`Poäng (${score}) är inte högre än befintlig. Sparades ej.`);
        } else {
            console.error("Fel vid inlämning av poäng:", error);
        }
    }
}

export async function getTopScores(gameId) {
    // KORREKT SÖKVÄG FÖR ATT LÄSA: (Collection: gameId)
    const scoresCollectionRef = collection(db, gameId); // <-- FIXAR FELET

    const q = query(scoresCollectionRef, orderBy("score", "desc"), limit(5));

    try {
        const querySnapshot = await getDocs(q);
        const topScores = [];
        querySnapshot.forEach((doc) => {
            topScores.push(doc.data());
        });
        return topScores;
    } catch (error) {
        console.error("Fel vid hämtning av Top 5 poäng:", error);
        return [];
    }
}