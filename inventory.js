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

// Funkcja dodająca przedmioty do ekwipunku
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

// Funkcja, która doda kilka różnych przedmiotów na raz
function cos() {
    addItemToInventory("Sword", 2, true);   // Dodaje 2 miecze
    addItemToInventory("Potion", 999, true); // Dodaje 999 mikstur
    addItemToInventory("Shield", 55, true);  // Dodaje 55 tarczy
    
    
}
function tam(){
    addItemToInventory("Sword", -2, true);   // Dodaje 2 miecze
    addItemToInventory("Potion", -111, true); // Dodaje 999 mikstur
    addItemToInventory("Shield", -2, true);  // Dodaje 55 tarczy
    
    
}

document.getElementById("game-container-middle").addEventListener("click", cos);
document.getElementById("game-container-left").addEventListener("click", tam);
