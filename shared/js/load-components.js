// Load shared components
async function loadComponent(id, path) {
  const response = await fetch(path);
  const html = await response.text();
  document.getElementById(id).innerHTML = html;
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadComponent("app-header", "/shared/components/header.html");
  await loadComponent("app-footer", "/shared/components/footer.html");

  const title = document.body.getAttribute("data-page-title");
  if (title) document.getElementById("page-title").textContent = title;

  // Fix footer links based on current location
  const currentPath = window.location.pathname;
  const isInAppFolder = currentPath.includes("/apps/");

  if (!isInAppFolder) {
    // On menu page - link to overview pages
    document.getElementById("help-link").href = "/help.html";
    document.getElementById("leaderboard-link").href = "/leaderboard.html";
  }
  // If in app folder, links stay as "help.html" and "leaderboard.html" (relative)

  // Show user status in footer
  const user = localStorage.getItem("username");
  if (user) {
    document.getElementById("user-status").innerHTML =
      ' | <span class="text-gray-600">Player: ' +
      user +
      '</span> | <button onclick="logoutUser()" class="text-blue-600 hover:underline">Sign Out</button>';
  }
});
