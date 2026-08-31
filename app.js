let workoutData = null;
let selectedType = null;
let selectedCardio = null;
let currentWorkout = null;
let calendarDate = new Date();

const cardioCard = document.getElementById("cardioCard");
const cardioBtn = document.getElementById("cardioBtn");
const workoutOutput = document.getElementById("workoutOutput");
const regenerateBtn = document.getElementById("regenerateBtn");
const completeBtn = document.getElementById("completeBtn");
const calendarTitle = document.getElementById("calendarTitle");
const calendarGrid = document.getElementById("calendarGrid");
const historyDetail = document.getElementById("historyDetail");
const typeButtons = document.querySelectorAll(".type-btn");

async function loadWorkoutData() {
  try {
    const response = await fetch("./workouts.json", { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`Could not load workouts.json (${response.status})`);
    }

    workoutData = await response.json();

    cardioCard.textContent = "Tap “Pick Cardio” to begin.";
    cardioCard.classList.add("muted");
    cardioBtn.disabled = false;
    typeButtons.forEach(btn => btn.disabled = false);
  } catch (error) {
    console.error(error);
    cardioCard.innerHTML = `
      <strong>Workout data could not be loaded.</strong><br>
      <span class="muted">Make sure workouts.json is in the same folder as index.html and app.js.</span>
    `;
  }
}

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function sample(arr, count) {
  const copy = [...arr];
  const results = [];

  while (copy.length && results.length < count) {
    const index = Math.floor(Math.random() * copy.length);
    results.push(copy.splice(index, 1)[0]);
  }

  return results;
}

function pickCardio() {
  if (!workoutData) return;

  selectedCardio = randomItem(workoutData.cardio);
  cardioCard.classList.remove("muted");
  cardioCard.innerHTML = `
    <strong>${selectedCardio.name}</strong><br>
    <span class="muted">${selectedCardio.detail}</span>
  `;
}

function generateWorkout(type) {
  if (!workoutData) return;

  selectedType = type;

  typeButtons.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.type === type);
  });

  if (!selectedCardio) pickCardio();

  const compound = randomItem(workoutData[type].compounds);
  const compoundScheme = randomItem(compound.schemes);

  const accessories = sample(compound.accessories, 4).map(name => ({
    name,
    scheme: randomItem(workoutData.accessorySchemes)
  }));

  currentWorkout = {
    date: new Date().toISOString(),
    type,
    cardio: selectedCardio,
    compound: {
      name: compound.name,
      scheme: compoundScheme
    },
    accessories
  };

  renderWorkout();
  regenerateBtn.disabled = false;
  completeBtn.disabled = false;
}

function renderWorkout() {
  if (!currentWorkout) return;

  const compound = currentWorkout.compound;

  workoutOutput.innerHTML = `
    <div class="exercise-card">
      <div class="exercise-label">CARDIO</div>
      <div class="exercise-name">${currentWorkout.cardio.name}</div>
      <div class="exercise-meta">
        <span class="pill">${currentWorkout.cardio.detail}</span>
      </div>
    </div>

    <div class="exercise-card compound">
      <div class="exercise-label">${currentWorkout.type} • COMPOUND</div>
      <div class="exercise-name">${compound.name}</div>
      <div class="exercise-meta">
        <span class="pill">${compound.scheme.sets} sets</span>
        <span class="pill">${compound.scheme.reps} reps</span>
        <span class="pill">Rest ${compound.scheme.rest}</span>
      </div>
    </div>

    ${currentWorkout.accessories.map((a, i) => `
      <div class="exercise-card">
        <div class="exercise-label">ACCESSORY ${i + 1}</div>
        <div class="exercise-name">${a.name}</div>
        <div class="exercise-meta">
          <span class="pill">${a.scheme.sets} sets</span>
          <span class="pill">${a.scheme.reps} reps</span>
          <span class="pill">Rest ${a.scheme.rest}</span>
        </div>
      </div>
    `).join("")}
  `;
}

function dateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getHistory() {
  return JSON.parse(localStorage.getItem("workoutHistory") || "{}");
}

function saveHistory(history) {
  localStorage.setItem("workoutHistory", JSON.stringify(history));
}

function completeWorkout() {
  if (!currentWorkout) return;

  const now = new Date();
  const key = dateKey(now);
  const history = getHistory();

  if (!history[key]) history[key] = [];

  history[key].push({
    ...currentWorkout,
    completedAt: now.toISOString()
  });

  saveHistory(history);
  renderCalendar();

  completeBtn.textContent = "Saved ✓";
  setTimeout(() => completeBtn.textContent = "Complete Workout", 1200);
}

function renderCalendar() {
  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();
  const history = getHistory();

  calendarTitle.textContent = calendarDate.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric"
  });

  calendarGrid.innerHTML = "";

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div");
    empty.className = "calendar-day empty";
    calendarGrid.appendChild(empty);
  }

  const todayKey = dateKey(new Date());

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const key = dateKey(date);
    const btn = document.createElement("button");
    btn.className = "calendar-day";
    btn.textContent = day;

    if (history[key]?.length) btn.classList.add("completed");
    if (key === todayKey) btn.classList.add("today");

    btn.addEventListener("click", () => showHistoryForDate(key));
    calendarGrid.appendChild(btn);
  }
}

function showHistoryForDate(key) {
  const history = getHistory();
  const entries = history[key] || [];

  if (!entries.length) {
    historyDetail.className = "history-detail muted";
    historyDetail.textContent = "No completed workout on this date.";
    return;
  }

  historyDetail.className = "history-detail";
  historyDetail.innerHTML = entries.map((entry, idx) => `
    <div>
      <h4>${entry.type} Workout${entries.length > 1 ? ` #${idx + 1}` : ""}</h4>
      <div><strong>Cardio:</strong> ${entry.cardio.name} — ${entry.cardio.detail}</div>
      <div>
        <strong>Compound:</strong>
        ${entry.compound.name} —
        ${entry.compound.scheme.sets} × ${entry.compound.scheme.reps},
        rest ${entry.compound.scheme.rest}
      </div>
      <ul>
        ${entry.accessories.map(a =>
          `<li>${a.name}: ${a.scheme.sets} × ${a.scheme.reps}, rest ${a.scheme.rest}</li>`
        ).join("")}
      </ul>
    </div>
  `).join("<hr>");
}

cardioBtn.addEventListener("click", pickCardio);

typeButtons.forEach(btn => {
  btn.addEventListener("click", () => generateWorkout(btn.dataset.type));
});

regenerateBtn.addEventListener("click", () => {
  if (selectedType) generateWorkout(selectedType);
});

completeBtn.addEventListener("click", completeWorkout);

document.getElementById("prevMonth").addEventListener("click", () => {
  calendarDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1);
  renderCalendar();
});

document.getElementById("nextMonth").addEventListener("click", () => {
  calendarDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1);
  renderCalendar();
});

renderCalendar();
loadWorkoutData();
