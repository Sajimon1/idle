function zapiszDane() {
  set(ref(db, "gracze/user123"), {
    nick: "Gracz123",
    punkty: 100,
    poziom: 2
  }).then(() => {
    console.log("Dane zapisane pomyślnie!");
  }).catch((error) => {
    console.error("Błąd zapisu:", error);
  });
}

document.getElementById("zapisz").addEventListener("click", zapiszDane);

addEventListener;