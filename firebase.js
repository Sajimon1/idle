import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue } from "firebase/database";

const firebaseConfig = { apiKey: "AIzaSyDAPGIhZBDgnTWuvpmldrzR8a_vwrQZ5EA",

    authDomain: "sajimon-idle.firebaseapp.com",
  
    databaseURL: "https://sajimon-idle-default-rtdb.europe-west1.firebasedatabase.app",
  
    projectId: "sajimon-idle",
  
    storageBucket: "sajimon-idle.firebasestorage.app",
  
    messagingSenderId: "912985394812",
  
    appId: "1:912985394812:web:c0e05326c9ae4436be43f9",
  
    measurementId: "G-T0PRST31JQ" };
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db, ref, set, onValue };
