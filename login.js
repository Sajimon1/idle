
// 🔥 Import instancje Firebase z database.js
import { app, auth, db } from "./database.js";

// 🔥 Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase, ref, get, set } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// 🔹 Funkcja logowania przez Google
function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
        .then(async (result) => {
            const user = result.user;
            console.log("Zalogowano:", user.displayName);
            console.log("info:", user);

            // ✅ Sprawdzamy, czy użytkownik ma już nick
            await checkIfUserHasNickname(user);
        })
        .catch((error) => {
            console.error("Błąd logowania:", error);
        });
}

// 🔹 Sprawdza, czy użytkownik ma już zapisany nick w Realtime Database
async function checkIfUserHasNickname(user) {
    const userRef = ref(db, `users/${user.uid}/nickname`);
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
        console.log("Nick już ustawiony:", snapshot.val());
        document.getElementById("status").innerText = `Zalogowano jako: ${snapshot.val()}`;
        document.getElementById("google-login").style.display = "none";
        document.getElementById("nickname-form").style.display = "none";
        showGameContainer();
    } else {
        console.log("Brak nicku – użytkownik musi go podać.");
        showNicknameForm(user);
    }
}

// 🔹 Pokazuje formularz wyboru nicku
function showNicknameForm(user) {
    document.getElementById("status").innerText = `Zalogowano jako: ${user.displayName}`;
    document.getElementById("google-login").style.display = "none";
    document.getElementById("nickname-form").style.display = "block";
}

// 🔹 Zapisuje nick użytkownika do Realtime Database
async function saveNickname() {
    const nickname = document.getElementById("nickname").value.trim();
    if (nickname === "") {
        alert("Nick nie może być pusty!");
        return;
    }

    const user = auth.currentUser;
    if (user) {
        try {
            await set(ref(db, `users/${user.uid}/nickname`), nickname);

            document.getElementById("status").innerText = `Nick: ${nickname}`;
            document.getElementById("nickname-form").style.display = "none";
            console.log("Nick zapisany w Realtime Database");
            showGameContainer();
        } catch (error) {
            console.error("Błąd zapisywania nicku:", error);
            document.getElementById("status").innerText = `Błąd zapisu: ${error.message}`;
        }
    }
}

function showGameContainer() {
    document.getElementById("game-container").style.display = "flex";
    document.getElementById("login-background").style.display = "none";
}






// 🔹 Event Listenery
document.getElementById("google-login").addEventListener("click", loginWithGoogle);
document.getElementById("save-nickname").addEventListener("click", saveNickname);