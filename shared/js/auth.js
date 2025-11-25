// auth.js

auth.onAuthStateChanged(async (user) => {
    const path = window.location.pathname;

    if (user) {
        // användare är inloggad → blockera login-sidan
        if (path.includes("login.html") || path.endsWith("/")) {
            window.location.replace("meny.html");
        }
    } else {
        // ingen användare → tvinga till login
        if (path.includes("meny.html")) {
            window.location.replace("login.html");
        }
    }
});

