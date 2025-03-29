
// 🔥 Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase, ref, get, set } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// 🔥 Konfiguracja Firebase (UPEWNIJ SIĘ, ŻE MASZ POPRAWNE DANE!)
const firebaseConfig = {
    apiKey: "AIzaSyDAPGIhZBDgnTWuvpmldrzR8a_vwrQZ5EA",
    authDomain: "sajimon-idle.firebaseapp.com",
    databaseURL: "https://sajimon-idle-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "sajimon-idle",
    storageBucket: "sajimon-idle.firebasestorage.app",
    messagingSenderId: "T912985394812",
    appId: "1:912985394812:web:c0e05326c9ae4436be43f9"
};

// 🔥 Inicjalizacja Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);  // 🔴 Używamy Realtime Database zamiast Firestore!


export { app, auth, db }; // Eksportujemy instancje Firebase, aby można było ich używać w innych plikach