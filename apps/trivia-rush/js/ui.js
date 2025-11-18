const CATS = ["physics", "chemistry", "medicine", "literature", "peace", "economics"];

window.__nobelCategories = CATS.slice(); 

document.addEventListener("DOMContentLoaded", () => {
  const elAll = document.getElementById("cat-all");
  const boxes = CATS.map((c) => document.getElementById("cat-" + c));

 
  function setIndividualsDisabled(disabled) {
    boxes.forEach((b) => {
      if (!b) return;
      b.disabled = disabled;
      
      const pill = b.nextElementSibling;
      if (pill) {
        pill.classList.toggle("opacity-40", disabled);
        pill.classList.toggle("cursor-not-allowed", disabled);
        pill.classList.toggle("pointer-events-none", disabled);
      }
    });
  }

  
  function setAllDisabled(disabled) {
    if (!elAll) return;
    elAll.disabled = disabled;
    const pill = elAll.nextElementSibling;
    if (pill) {
      pill.classList.toggle("opacity-40", disabled);
      pill.classList.toggle("cursor-not-allowed", disabled);
      pill.classList.toggle("pointer-events-none", disabled);
    }
  }

  function updateGlobalFromUI() {
    if (!elAll) return;

    if (elAll.checked) {
  
      window.__nobelCategories = CATS.slice();
      boxes.forEach((b) => b && (b.checked = false));
      setIndividualsDisabled(true);
      setAllDisabled(false);
    } else {
      const picked = CATS.filter((c, i) => boxes[i] && boxes[i].checked);
      window.__nobelCategories = picked.length ? picked : [];
     
      const anyPicked = picked.length > 0;
      setAllDisabled(anyPicked);
      setIndividualsDisabled(false);
     
    }
  }

  if (elAll) elAll.addEventListener("change", updateGlobalFromUI);
  boxes.forEach((b) => {
    if (!b) return;
    b.addEventListener("change", () => {
     
      if (boxes.some((x) => x && x.checked)) elAll.checked = false;
      updateGlobalFromUI();
    });
  });

 
  updateGlobalFromUI();
});
