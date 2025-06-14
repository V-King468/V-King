// poll.js

// TODO: Замени с твоите Firebase настройки
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
  set,
  get,
  child,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

const firebaseConfig = { apiKey: "AIzaSyCvuO2wODfZN6ZR7GApyLeX9eGv8mUrWNw", authDomain: "v-king-site.firebaseapp.com", databaseURL: "https://v-king-site-default-rtdb.europe-west1.firebasedatabase.app", projectId: "v-king-site", storageBucket: "v-king-site.firebasestorage.app", messagingSenderId: "291733702378", appId: "1:291733702378:web:f1243d7b42145d8c33b993" };

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const votesRef = ref(db, "brawlerVotes");

let votes = {}; // ще пазим гласовете локално

// Зареждаме гласовете от Firebase
function loadVotes() {
  get(votesRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        votes = snapshot.val();
      } else {
        votes = {};
      }
      renderResults();
    })
    .catch((error) => {
      console.error("Error loading votes:", error);
    });
}

// Показваме резултатите на страницата
function renderResults() {
  const resultsDiv = document.getElementById("results");
  if (!resultsDiv) return;

  resultsDiv.innerHTML = "<h3>Current votes:</h3>";

  // Ако няма гласове още
  if (Object.keys(votes).length === 0) {
    resultsDiv.innerHTML += "<p>No votes yet.</p>";
    return;
  }

  // Създаваме списък с гласовете
  const ul = document.createElement("ul");
  for (const [brawler, count] of Object.entries(votes)) {
    const li = document.createElement("li");
    li.textContent = `${brawler}: ${count} votes`;
    ul.appendChild(li);
  }
  resultsDiv.appendChild(ul);
}

// Функция за гласуване
window.vote = function (brawlerName) {
  if (!brawlerName) return;
  // Увеличаваме гласа локално
  if (!votes[brawlerName]) {
    votes[brawlerName] = 0;
  }
  votes[brawlerName]++;

  // Записваме в Firebase
  set(votesRef, votes)
    .then(() => {
      renderResults();
      alert(`Thanks for voting for ${brawlerName}!`);
    })
    .catch((error) => {
      console.error("Error saving vote:", error);
      alert("Sorry, something went wrong while saving your vote.");
    });
};

// Зареждаме гласовете при стартиране
loadVotes();