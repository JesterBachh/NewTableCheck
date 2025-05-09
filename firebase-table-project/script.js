import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getDatabase, ref, push, set, onValue, update, remove } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const usersRef = ref(db, "users");

const tbody = document.querySelector("tbody");
const form = document.getElementById("addUserForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");

function renderTable(users) {
  tbody.innerHTML = "";
  Object.entries(users || {}).forEach(([id, user]) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${id}</td>
      <td contenteditable="true" data-id="${id}" data-field="name">${user.name}</td>
      <td contenteditable="true" data-id="${id}" data-field="email">${user.email}</td>
      <td>
        <button class="save" data-id="${id}">Save</button>
        <button class="delete" data-id="${id}">Delete</button>
      </td>`;
    tbody.appendChild(row);
  });
}

onValue(usersRef, (snapshot) => {
  renderTable(snapshot.val());
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = nameInput.value;
  const email = emailInput.value;
  const newUserRef = push(usersRef);
  set(newUserRef, { name, email });
  nameInput.value = "";
  emailInput.value = "";
});

tbody.addEventListener("click", (e) => {
  const id = e.target.dataset.id;
  if (e.target.classList.contains("save")) {
    const row = e.target.closest("tr");
    const name = row.querySelector('[data-field="name"]').innerText;
    const email = row.querySelector('[data-field="email"]').innerText;
    update(ref(db, "users/" + id), { name, email });
  } else if (e.target.classList.contains("delete")) {
    remove(ref(db, "users/" + id));
  }
});
