document.addEventListener("DOMContentLoaded", async () => {
  const placeholder = document.getElementById("footer-placeholder");
  if (!placeholder) return;

  try {
    const response = await fetch("../../shared/components/footer.html");
    const html = await response.text();
    placeholder.innerHTML = html;
  } catch (error) {
    console.error("Kunde inte ladda footern:", error);
  }
});
