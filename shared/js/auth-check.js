// Authentication helper - checks if user is logged in

function loginUser() {
  const username = document.getElementById("username-input").value;
  if (username.trim()) {
    localStorage.setItem("username", username);
    location.reload(); // Reload page to show game content
  }
}

function logoutUser() {
  localStorage.removeItem("username");
  window.location.href = "/menu.html";
}

function getUsername() {
  return localStorage.getItem("username");
}

function isLoggedIn() {
  return !!localStorage.getItem("username");
}

// Check authentication and show/hide game content
async function checkAuth() {
  const username = getUsername();

  if (username) {
    // User is logged in - show game
    const gameContent = document.getElementById("game-content");
    if (gameContent) {
      gameContent.classList.remove("hidden");
    }
    const playerName = document.getElementById("player-name");
    if (playerName) {
      playerName.textContent = username;
    }
  } else {
    // User not logged in - show login component
    const loginContainer = document.getElementById("login-container");
    if (loginContainer) {
      const response = await fetch("/shared/components/login.html");
      const html = await response.text();
      loginContainer.innerHTML = html;
    }
  }
}
