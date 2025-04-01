/*
// Funkcja do dynamicznego generowania slotów w ekwipunku
function createInventorySlots(slotCount) {
    const inventory = document.getElementById('inventory');
    for (let i = 1; i <= slotCount; i++) {
        const slot = document.createElement('div');
        slot.className = 'inv-slot';
        slot.id = `inv-slot${i}`;

        const img = document.createElement('img');
        img.className = 'item-img';
        img.src = '';
        img.alt = '';

        const quantity = document.createElement('span');
        quantity.className = 'item-quantity';
        quantity.textContent = '0';

        slot.appendChild(img);
        slot.appendChild(quantity);
        inventory.appendChild(slot);
    }
}

// Wywołanie przy ładowaniu strony
window.onload = function() {
    createInventorySlots(120); // Tworzy 120 slotów
};

// Przykładowe dane przedmiotów z obrazkami
const items = {
    "Sword": "./sword.jpg",
    "Potion": "./potion.png",
    "Shield": "./shield.jpg"
    
};



// Funkcja przesuwająca zawartość slotów
function shiftSlots() {
    const slots = document.querySelectorAll('.inv-slot');
    for (let i = 0; i < slots.length - 1; i++) {
        // Jeśli ilość w danym slocie jest równa 0, a następny slot zawiera przedmiot
        if (parseInt(slots[i].dataset.quantity) === 0 && slots[i + 1].dataset.item) {
            // Przesuwamy dane z następnego slotu
            slots[i].dataset.item = slots[i + 1].dataset.item;
            slots[i].dataset.quantity = slots[i + 1].dataset.quantity;

            // Przesuwamy obrazek
            const img = slots[i].querySelector('.item-img');
            img.src = items[slots[i + 1].dataset.item];
            img.alt = slots[i + 1].dataset.item;

            // Przesuwamy ilość
            const quantityLabel = slots[i].querySelector('.item-quantity');
            quantityLabel.textContent = slots[i + 1].dataset.quantity;
            quantityLabel.style.display = slots[i + 1].dataset.quantity > 0 ? 'block' : 'none';  // Ukryj jeśli 0

            // Czyścimy slot 1 (przesunięty)
            slots[i + 1].dataset.item = '';
            slots[i + 1].dataset.quantity = 0;

            // Znikamy obrazek i ilość z przesuniętego slotu
            const imgNext = slots[i + 1].querySelector('.item-img');
            imgNext.style.display = 'none';
            const quantityNext = slots[i + 1].querySelector('.item-quantity');
            quantityNext.style.display = 'none';
        }
    }
}

function addItemToInventory(itemName, quantityToAdd) {
    const slots = document.querySelectorAll('.inv-slot');
    let itemAdded = false;

    // Iteracja przez wszystkie sloty w ekwipunku
    for (let slot of slots) {
        // Sprawdzenie, czy slot już zawiera ten przedmiot
        if (slot.dataset.item === itemName) {
            // Jeśli przedmiot już istnieje, zwiększamy ilość
            let currentQuantity = parseInt(slot.dataset.quantity) || 0;
            currentQuantity += quantityToAdd;

            // Zapewniamy, że liczba przedmiotów nie spadnie poniżej 0
            currentQuantity = Math.max(currentQuantity, 0);  // Liczba nie może być mniejsza niż 0

            slot.dataset.quantity = currentQuantity;

            // Znajdź element quantityLabel, który będzie wyświetlał liczbę
            const quantityLabel = slot.querySelector('.item-quantity');
            if (quantityLabel) {
                // Zaktualizuj wyświetlanie liczby przedmiotów
                quantityLabel.textContent = currentQuantity > 0 ? currentQuantity : '';  // Pusty string, jeśli 0
                quantityLabel.style.display = currentQuantity > 0 ? 'block' : 'none'; // Ukryj, jeśli 0
            }

            // Zaktualizuj widoczność obrazka
            const itemImage = slot.querySelector('.item-img');
            if (itemImage) {
                itemImage.style.display = currentQuantity > 0 ? 'block' : 'none'; // Ukryj, jeśli 0
            }

            itemAdded = true;
            break;
        }
    }

    // Jeśli przedmiot nie został dodany (brak przedmiotu w żadnym slocie), szukamy pierwszego wolnego slotu
    if (!itemAdded) {
        for (let slot of slots) {
            // Sprawdzenie, czy slot jest pusty
            if (!slot.dataset.item) {
                slot.dataset.item = itemName;
                slot.dataset.quantity = quantityToAdd;

                // Dodaj obrazek przedmiotu
                const img = slot.querySelector('.item-img');
                if (img) {
                    img.src = items[itemName];
                    img.alt = itemName;
                    img.style.display = 'block';  // Ustawiamy obrazek na widoczny
                }

                // Zaktualizuj wyświetlanie ilości przedmiotów
                const quantityLabel = slot.querySelector('.item-quantity');
                if (quantityLabel) {
                    quantityLabel.textContent = quantityToAdd > 0 ? quantityToAdd : '';  // Pusty string, jeśli 0
                    quantityLabel.style.display = quantityToAdd > 0 ? 'block' : 'none'; // Ukryj, jeśli 0
                }
                break;
            }
        }
    }

    // Po dodaniu przedmiotu sprawdzamy, czy trzeba przesunąć sloty
    shiftSlots();
}


document.getElementById("game-container-middle").addEventListener("click", cos);
document.getElementById("game-container-left").addEventListener("click", tam);








/////////////////////////




// Funkcja zapisywania ekwipunku z Firebase z usuwaniem przedmiotów o quantity 0
async function saveInventory() {
    const user = auth.currentUser;
    if (!user) return;

    const slots = document.querySelectorAll('.inv-slot');
    const inventory = {};

    slots.forEach((slot, index) => {
        const item = slot.dataset.item;
        const quantity = parseInt(slot.dataset.quantity) || 0;

        if (quantity > 0) {
            // Przedmiot z ilością większą niż 0 - zapisujemy go do ekwipunku
            inventory[index] = { item, quantity };
        } else {
            // Jeśli ilość jest 0, usuwamy przedmiot z bazy danych
            const itemRef = ref(db, `users/${user.uid}/inventory/${index}`);
            set(itemRef, null);  // Usuwamy przedmiot z bazy
        }
    });

    try {
        // Zapisz przedmioty do Firebase
        await set(ref(db, `users/${user.uid}/inventory`), inventory);
        console.log("Ekwipunek zapisany do Firebase");
    } catch (error) {
        console.error("Błąd zapisu ekwipunku:", error);
    }
}


// 💾 Wczytywanie ekwipunku z Firebase
async function loadInventory() {
    const user = auth.currentUser;
    if (!user) return;

    try {
        const snapshot = await get(ref(db, `users/${user.uid}/inventory`));
        if (snapshot.exists()) {
            const inventory = snapshot.val();
            Object.keys(inventory).forEach((key) => {
                const slot = document.getElementById(`inv-slot${parseInt(key) + 1}`);
                const { item, quantity } = inventory[key];
                slot.dataset.item = item;
                slot.dataset.quantity = quantity;

                const img = slot.querySelector('.item-img');
                img.src = items[item];
                img.alt = item;
                img.style.display = 'block';

                const quantityLabel = slot.querySelector('.item-quantity');
                quantityLabel.textContent = quantity;
                quantityLabel.style.display = quantity > 0 ? 'block' : 'none';
            });
            console.log("Ekwipunek załadowany z Firebase");
        }
    } catch (error) {
        console.error("Błąd wczytywania ekwipunku:", error);
    }
}

export { addItemToInventory, loadInventory, createInventorySlots };


// Funkcja, która doda kilka różnych przedmiotów na raz
function cos() {
    addItemToInventory("Sword", 1);   // Dodaje 2 miecze
    addItemToInventory("Potion", 999); // Dodaje 999 mikstur
    addItemToInventory("Shield", 55);  // Dodaje 55 tarczy
    saveAndCleanupInventory();
    
}
function tam(){
    addItemToInventory("Sword", -2);   // Dodaje 2 miecze
    addItemToInventory("Potion", -111); // Dodaje 999 mikstur
    addItemToInventory("Shield", -2);  // Dodaje 55 tarczy
    saveAndCleanupInventory(); 
    
}




///////////////////


// 🔥 Import Firebase
import { app, auth, db } from "./database.js";
import { ref, set, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// 🧹 Funkcja do czyszczenia ekwipunku w Firebase z zerowych przedmiotów
async function cleanupInventory() {
    const user = auth.currentUser;
    if (!user) return;
    const userId = user.uid;

    try {
        // Pobierz cały ekwipunek użytkownika
        const snapshot = await get(ref(db, `users/${userId}/inventory`));
        if (snapshot.exists()) {
            const inventory = snapshot.val();

            for (const [key, { item, quantity }] of Object.entries(inventory)) {
                // Usuń przedmiot z Firebase, jeśli ilość wynosi 0
                if (quantity <= 0) {
                    await set(ref(db, `users/${userId}/inventory/${key}`), null);
                    console.log(`Przedmiot ${item} o ilości 0 został usunięty z Firebase`);
                }
            }
        }
    } catch (error) {
        console.error("Błąd czyszczenia ekwipunku:", error);
    }
}

// 💾 Zapisz ekwipunek i wyczyść zerowe przedmioty
async function saveAndCleanupInventory() {
    await saveInventory();
    await cleanupInventory();
}

// Eksport funkcji
export { cleanupInventory, saveAndCleanupInventory };

/////////
*/

// 🔥 Import Firebase
import { app, auth, db } from "./database.js";
import { ref, set, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { items } from './scripts/items.js'; // Upewnij się, że ścieżka jest poprawna

// -------------------------- MODUŁ: EKWIPUNEK --------------------------

// Funkcja do dynamicznego generowania slotów w ekwipunku
export function createInventorySlots(slotCount) {
    const inventory = document.getElementById('inventory');
    for (let i = 1; i <= slotCount; i++) {
        const slot = document.createElement('div');
        slot.className = 'inv-slot';
        slot.id = `inv-slot${i}`;
        slot.innerHTML = `
            <img class="item-img" src="" alt="" style="display:none;">
            <span class="item-quantity" style="display:none;"></span>
        `;
        inventory.appendChild(slot);
    }
}

window.onload = function() {
    createInventorySlots(120); // Tworzy 120 slotów
    loadInventory();  // Wczytuje ekwipunek po załadowaniu slotów
};

// Funkcja przesuwająca zawartość slotów (czyszczenie slotów z zerowymi przedmiotami)
export function shiftSlots() {
    const slots = document.querySelectorAll('.inv-slot');
    for (let i = 0; i < slots.length - 1; i++) {
        const currentSlot = slots[i];
        const nextSlot = slots[i + 1];

        if (parseInt(currentSlot.dataset.quantity) === 0 && nextSlot.dataset.item) {
            // Przesuwamy dane z następnego slotu
            currentSlot.dataset.item = nextSlot.dataset.item;
            currentSlot.dataset.quantity = nextSlot.dataset.quantity;

            // Zaktualizowanie obrazka i ilości
            const img = currentSlot.querySelector('.item-img');
            const quantityLabel = currentSlot.querySelector('.item-quantity');
            img.src = items[nextSlot.dataset.item].image;  // Zmiana w tej linii
            img.alt = nextSlot.dataset.item;
            quantityLabel.textContent = nextSlot.dataset.quantity;

            // Czyszczenie następnego slotu
            nextSlot.dataset.item = '';
            nextSlot.dataset.quantity = 0;
            nextSlot.querySelector('.item-img').style.display = 'none';
            nextSlot.querySelector('.item-quantity').style.display = 'none';
        }
    }
}

// Funkcja dodawania przedmiotu do ekwipunku
export function addItemToInventory(itemName, quantityToAdd) {
    const slots = document.querySelectorAll('.inv-slot');
    let itemAdded = false;

    // Szukamy slotu z danym przedmiotem lub wolnego slotu
    for (let slot of slots) {
        if (slot.dataset.item === itemName) {
            let currentQuantity = parseInt(slot.dataset.quantity) || 0;
            currentQuantity = Math.max(currentQuantity + quantityToAdd, 0); // Liczba nie może być mniejsza niż 0
            slot.dataset.quantity = currentQuantity;

            const quantityLabel = slot.querySelector('.item-quantity');
            quantityLabel.textContent = currentQuantity > 0 ? currentQuantity : '';
            quantityLabel.style.display = currentQuantity > 0 ? 'block' : 'none';
            slot.querySelector('.item-img').style.display = currentQuantity > 0 ? 'block' : 'none';

            itemAdded = true;
            break;
        }
    }

    if (!itemAdded) {
        // Jeśli przedmiot nie istnieje, szukamy pustego slotu
        for (let slot of slots) {
            if (!slot.dataset.item) {
                slot.dataset.item = itemName;
                slot.dataset.quantity = quantityToAdd;

                const img = slot.querySelector('.item-img');
                img.src = items[itemName].image;  // Zmiana w tej linii
                img.alt = itemName;
                img.style.display = 'block';

                const quantityLabel = slot.querySelector('.item-quantity');
                quantityLabel.textContent = quantityToAdd > 0 ? quantityToAdd : '';
                quantityLabel.style.display = quantityToAdd > 0 ? 'block' : 'none';

                break;
            }
        }
    }

    shiftSlots(); // Przesuwanie slotów w ekwipunku (jeśli konieczne)
}

// -------------------------- MODUŁ: BAZA DANYCH --------------------------

// Funkcja zapisywania ekwipunku w Firebase
export async function saveInventory() {
    const user = auth.currentUser;
    if (!user) return;

    const slots = document.querySelectorAll('.inv-slot');
    const inventory = {};

    slots.forEach((slot, index) => {
        const item = slot.dataset.item;
        const quantity = parseInt(slot.dataset.quantity) || 0;

        if (quantity > 0) {
            inventory[index] = { item, quantity };
        } else {
            // Usuwamy przedmioty o ilości 0
            set(ref(db, `users/${user.uid}/inventory/${index}`), null);
        }
    });

    try {
        await set(ref(db, `users/${user.uid}/inventory`), inventory);
        console.log("Ekwipunek zapisany do Firebase");
    } catch (error) {
        console.error("Błąd zapisu ekwipunku:", error);
    }
}

// Funkcja wczytywania ekwipunku z Firebase po zalogowaniu
export async function loadInventory() {
    const user = auth.currentUser;
    if (!user) return;

    try {
        const snapshot = await get(ref(db, `users/${user.uid}/inventory`));
        if (snapshot.exists()) {
            const inventory = snapshot.val();

            // Upewnij się, że sloty zostały utworzone przed przypisaniem danych
            const slots = document.querySelectorAll('.inv-slot');
            Object.keys(inventory).forEach((key) => {
                const slot = slots[parseInt(key)];
                if (slot) {
                    const { item, quantity } = inventory[key];
                    slot.dataset.item = item;
                    slot.dataset.quantity = quantity;

                    const img = slot.querySelector('.item-img');
                    img.src = items[item].image;  // Zmiana w tej linii
                    img.alt = item;
                    img.style.display = 'block';

                    const quantityLabel = slot.querySelector('.item-quantity');
                    quantityLabel.textContent = quantity;
                    quantityLabel.style.display = quantity > 0 ? 'block' : 'none';
                } else {
                    console.error(`Brak slotu o numerze ${key + 1}.`);
                }
            });

            console.log("Ekwipunek załadowany z Firebase");
        } else {
            console.log("Brak ekwipunku w bazie danych.");
        }
    } catch (error) {
        console.error("Błąd wczytywania ekwipunku:", error);
    }
}

// Funkcja czyszczenia zerowych przedmiotów z Firebase
export async function cleanupInventory() {
    const user = auth.currentUser;
    if (!user) return;

    const userId = user.uid;
    const snapshot = await get(ref(db, `users/${userId}/inventory`));
    if (snapshot.exists()) {
        const inventory = snapshot.val();
        for (const [key, { item, quantity }] of Object.entries(inventory)) {
            if (quantity <= 0) {
                await set(ref(db, `users/${userId}/inventory/${key}`), null);
                console.log(`Przedmiot ${item} o ilości 0 został usunięty z Firebase`);
            }
        }
    }
}

// Funkcja zapisująca i czyszcząca ekwipunek
export async function saveAndCleanupInventory() {
    await saveInventory();
    await cleanupInventory();
}

// -------------------------- MODUŁ: TESTOWANIE --------------------------

function cos() {
    addItemToInventory("Sword", 1);
    addItemToInventory("Potion", 999);
    addItemToInventory("Shield", 55);
    saveAndCleanupInventory();
}

function tam() {
    addItemToInventory("Sword", -2);
    addItemToInventory("Potion", -111);
    addItemToInventory("Shield", -2);
    saveAndCleanupInventory();
}


// Eventy kliknięcia (do testowania)
document.getElementById("game-container-middle").addEventListener("click", cos);
document.getElementById("game-container-left").addEventListener("click", tam);
