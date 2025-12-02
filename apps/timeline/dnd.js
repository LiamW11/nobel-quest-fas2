export function wireDnD(root) {
  // Hämta listan med sorterbara element från DOM:en som skapas i renderboard från ui.js
  const list = root.querySelector("#sortable-list");
  if (!list) return;

  // Variabel som håller elementet som dras för tillfället
  let dragElement = null;
  // Variabel som håller den visuella klonen när man touchar på mobil
  let touchClone = null;
  // Variabel som lagrar startpositionen för touch
  let touchStartY = 0;
  // Variabel som spårar om en touch redan är aktiv
  let isTouchActive = false;

  //För pc
  list.addEventListener("dragstart", (element) => {
    // Hitta närmaste .draggable element (om användaren klickar på t.ex. en bild inuti)
    const currentCard = element.target.closest(".draggable");
    if (!currentCard) return;
    // Spara det element som dras
    dragElement = currentCard;
  });

  // Lyssnare för när användaren drar över ett annat kort
  list.addEventListener("dragover", (element) => {
    // Förhindra standardbeteendet (annars fungerar inte drop)
    element.preventDefault();
    // Hitta det element som musen är över
    const over = element.target.closest(".draggable");
    if (!over || over === dragElement) return;
    // Hämta elementets position och storlek
    const rect = over.getBoundingClientRect();
    // Kolla om musen är i övre halvan av elementet (då ska vi placera före)
    // before blir true eller false beroende på ifall det man drar är över eller under hälften av det hovrar över
    const before = element.clientY - rect.top < rect.height / 2;
    // Om musen är i övre halvan, sätt in det dragna elementet före
    if (before) {
      over.parentNode.insertBefore(dragElement, over);
    } else {
      // Annars sätt in det efter
      over.parentNode.insertBefore(dragElement, over.nextSibling);
    }
  });

  //För mobil
  // Lyssnare för när användaren börjar röra skärmen
  list.addEventListener(
    "touchstart",
    (element) => {
      const currentCard = element.target.closest(".draggable");
      if (!currentCard) return;

      // Kontrollera om en touch redan är aktiv
      if (isTouchActive) {
        element.preventDefault();
        return; // Ignorera nya touches
      }

      element.preventDefault();
      isTouchActive = true;

      // Spara det element som ska flyttas
      dragElement = currentCard;
      // Spara startpositionen för touch (första fingrets Y-koordinat)
      touchStartY = element.touches[0].clientY;

      // Skapa en visuell klon av elementet som följer fingret
      touchClone = currentCard.cloneNode(true); // true = klona alla barn också, alltså allt som ligger i kortet.
      // Positionera klonen med fixed position (följer inte scrollning)
      touchClone.style.position = "fixed";
      // Sätt samma bredd som originalet
      touchClone.classList.add("w-[93%]");
      touchClone.querySelector("h4").classList.remove("w-[90%]");
      touchClone.querySelector("h4").classList.remove("truncate");
      touchClone.style.opacity = "0.8";
      // Förhindra att klonen kan klickas/touchas (så vi kan hitta element under den)
      touchClone.style.pointerEvents = "none";
      // Sätt hög z-index så klonen visas ovanpå allt annat
      touchClone.style.zIndex = "1000";
      // Positionera klonen på samma X-position som originalet
      touchClone.style.left = currentCard.getBoundingClientRect().left + "px";
      // Centrera klonen vertikalt på fingrets position
      touchClone.style.top =
        element.touches[0].clientY - currentCard.offsetHeight / 2 + "px";
      // Lägg till klonen i body (utanför listan så den kan röra sig fritt)
      document.body.appendChild(touchClone);

      // Gör originalelementet genomskinligt så man ser var det kommer att placeras
      currentCard.style.opacity = "0.3";
    },
    { passive: false }
  ); // passive:false gör så att preventDefault fungerar

  // Lyssnare för när användaren rör fingret över skärmen
  list.addEventListener(
    "touchmove",
    (element) => {
      if (!dragElement || !touchClone) return;
      element.preventDefault();

      // Hämta första fingrets position
      const touch = element.touches[0];
      // Uppdatera klonens Y-position så den följer fingret (centrerad)
      touchClone.style.top =
        touch.clientY - dragElement.offsetHeight / 2 + "px";

      // Hitta vilket element som finns under fingret (ignorerar klonen pga pointerEvents: none)
      const elementBelow = document.elementFromPoint(
        touch.clientX,
        touch.clientY
      );
      // Hitta närmaste .draggable element
      const over = elementBelow?.closest(".draggable");

      if (over && over !== dragElement) {
        // Hämta elementets position och storlek
        const rect = over.getBoundingClientRect();
        // Kolla om fingret är i övre halvan av elementet
        const before = touch.clientY - rect.top < rect.height / 2;
        // Om fingret är i övre halvan, sätt in det dragna elementet före
        if (before) {
          over.parentNode.insertBefore(dragElement, over);
        } else {
          // Annars sätt in det efter
          over.parentNode.insertBefore(dragElement, over.nextSibling);
        }
      }
    },
    { passive: false }
  );

  // Lyssnare för när användaren lyfter fingret från skärmen
  list.addEventListener("touchend", () => {
    // Om det finns ett draget element
    if (dragElement) {
      dragElement.style.opacity = "1";
      dragElement = null;
    }

    if (touchClone) {
      touchClone.remove();
      touchClone = null;
    }

    isTouchActive = false;
  });

  list.addEventListener("touchcancel", () => {
    if (dragElement) {
      dragElement.style.opacity = "1";
      dragElement = null;
    }
    if (touchClone) {
      touchClone.remove();
      touchClone = null;
    }
    isTouchActive = false;
  });
}

// Funktion som läser användarens slutgiltiga sortering och returnerar en array med ID:n
export function readUserOrder(root) {
  // Hämta alla .draggable element som är direkta barn till #sortable-list
  // querySelectorAll returnerar en NodeList, som vi konverterar till en riktig array med spread-operatorn [...]
  return (
    [...root.querySelectorAll("#sortable-list > .draggable")]
      // Loopa igenom varje element och extrahera dess data-id attribut
      // .map() skapar en ny array med resultaten
      .map((element) => Number(element.dataset.id))
  );
  // el.dataset.id hämtar värdet från data-id attributet (t.ex. data-id="5")
  // Number() konverterar strängen till ett nummer (t.ex. "5" blir 5)
  // Returvärde: [5, 12, 3, 8] - en array med ID:n i den ordning användaren sorterat korten
}
