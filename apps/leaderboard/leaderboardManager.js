import { db, auth } from "../../shared/firebase-config.js"; 
import { doc, setDoc, collection, query, orderBy, limit, getDocs, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

/**
 * Skickar in poäng till Firebase
 */
export async function submitScore(gameId, score) {
    const playerInfo = await getPlayerInfo();
    if (!playerInfo) return;
    
    const validGames = ['LB-match', 'LB-timeline', 'LB-trivia'];
    if (!validGames.includes(gameId)) return;

    const { uid, displayName } = playerInfo;
    
    try {
        const scoreDocRef = doc(db, gameId, uid);
        
        // Hämta befintligt dokument först
        const existingDoc = await getDoc(scoreDocRef);
        
        // Om dokumentet finns OCH nya poängen är lägre, uppdatera BARA displayName
        if (existingDoc.exists() && score <= existingDoc.data().score) {
            await setDoc(scoreDocRef, {
                displayName: displayName,
                timestamp: new Date()
            }, { merge: true });
            return;
        }
        
        // Annars: nytt highscore eller nytt dokument - spara allt
        await setDoc(scoreDocRef, {
            userId: uid,           
            displayName: displayName,
            score: score,
            timestamp: new Date()
        }, { merge: true });
        
    } catch (error) {
        // Tyst hantering av fel
    }
}

/**
 * Hämtar top poäng från en specifik spel-collection
 */
export async function getTopScores(gameId, limitCount = 10) {
    const scoresCollectionRef = collection(db, gameId);
    const q = query(scoresCollectionRef, orderBy("score", "desc"), limit(limitCount));

    try {
        const querySnapshot = await getDocs(q);
        const topScores = [];
        querySnapshot.forEach((doc) => {
            topScores.push(doc.data());
        });
        return topScores;
    } catch (error) {
        console.error(`Fel vid hämtning av poäng för ${gameId}:`, error);
        return [];
    }
}