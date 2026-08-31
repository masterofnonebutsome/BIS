const workoutData = {
  cardio: [
    { name: "Incline Treadmill Walk", detail: "20 min • moderate pace" },
    { name: "Stationary Bike", detail: "15 min • moderate intensity" },
    { name: "Run", detail: "1 mile • comfortable pace" },
    { name: "Stair Climber", detail: "15 min • moderate intensity" }
  ],

  CHEST: {
    compounds: [
      {
        name: "Barbell Bench Press",
        schemes: [
          { sets: 5, reps: "5", rest: "3 min" },
          { sets: 4, reps: "10", rest: "2 min" },
          { sets: 9, reps: "3", rest: "1 min" }
        ],
        accessories: [
          "Incline Dumbbell Press",
          "Cable Fly",
          "Skull Crushers",
          "Pec Deck",
          "Lateral Raise",
          "Triceps Pushdown",
          "Dumbbell Pullover"
        ]
      },
      {
        name: "Incline Barbell Bench Press",
        schemes: [
          { sets: 5, reps: "5", rest: "3 min" },
          { sets: 4, reps: "10", rest: "2 min" },
          { sets: 9, reps: "3", rest: "1 min" }
        ],
        accessories: [
          "Flat Dumbbell Press",
          "Low-to-High Cable Fly",
          "Pec Deck",
          "Lateral Raise",
          "Skull Crushers",
          "Triceps Pushdown"
        ]
      },
      {
        name: "Weighted Dips",
        schemes: [
          { sets: 4, reps: "6–8", rest: "2 min" },
          { sets: 3, reps: "8–10", rest: "90 sec" }
        ],
        accessories: [
          "Dumbbell Bench Press",
          "Cable Fly",
          "Lateral Raise",
          "Overhead Triceps Extension",
          "Skull Crushers",
          "Triceps Pushdown"
        ]
      }
    ]
  },

  ARMS: {
    compounds: [
      {
        name: "Close-Grip Bench Press",
        schemes: [
          { sets: 4, reps: "10", rest: "2 min" },
          { sets: 5, reps: "5", rest: "2 min" }
        ],
        accessories: [
          "EZ-Bar Curl",
          "Rope Pushdown",
          "Hammer Curl",
          "Overhead Cable Extension",
          "Preacher Curl",
          "Skull Crushers"
        ]
      },
      {
        name: "Weighted Chin-Up",
        schemes: [
          { sets: 4, reps: "5–8", rest: "2–3 min" },
          { sets: 3, reps: "6–10", rest: "2 min" }
        ],
        accessories: [
          "Incline Dumbbell Curl",
          "Rope Pushdown",
          "Cable Curl",
          "Overhead Triceps Extension",
          "Hammer Curl"
        ]
      }
    ]
  },

  LEGS: {
    compounds: [
      {
        name: "Back Squat",
        schemes: [
          { sets: 5, reps: "5", rest: "3 min" },
          { sets: 4, reps: "6–8", rest: "2–3 min" },
          { sets: 4, reps: "8", rest: "2 min" }
        ],
        accessories: [
          "Romanian Deadlift",
          "Walking Lunge",
          "Leg Extension",
          "Hamstring Curl",
          "Calf Raise",
          "Bulgarian Split Squat"
        ]
      },
      {
        name: "Romanian Deadlift",
        schemes: [
          { sets: 4, reps: "6–8", rest: "2–3 min" },
          { sets: 4, reps: "8–10", rest: "2 min" }
        ],
        accessories: [
          "Front Squat",
          "Leg Press",
          "Walking Lunge",
          "Hamstring Curl",
          "Leg Extension",
          "Calf Raise"
        ]
      },
      {
        name: "Leg Press",
        schemes: [
          { sets: 4, reps: "8–10", rest: "2 min" },
          { sets: 4, reps: "10–12", rest: "90 sec" }
        ],
        accessories: [
          "Romanian Deadlift",
          "Bulgarian Split Squat",
          "Leg Extension",
          "Hamstring Curl",
          "Calf Raise"
        ]
      }
    ]
  },

  BACK: {
    compounds: [
      {
        name: "Barbell Row",
        schemes: [
          { sets: 4, reps: "6–8", rest: "2 min" },
          { sets: 4, reps: "8–10", rest: "90 sec" }
        ],
        accessories: [
          "Lat Pulldown",
          "Seated Cable Row",
          "Face Pull",
          "Rear Delt Fly",
          "Straight-Arm Pulldown",
          "Hammer Curl"
        ]
      },
      {
        name: "Weighted Pull-Up",
        schemes: [
          { sets: 4, reps: "5–8", rest: "2–3 min" },
          { sets: 3, reps: "6–10", rest: "2 min" }
        ],
        accessories: [
          "Chest-Supported Row",
          "Lat Pulldown",
          "Face Pull",
          "Rear Delt Fly",
          "Cable Curl"
        ]
      },
      {
        name: "Deadlift",
        schemes: [
          { sets: 5, reps: "3", rest: "3–4 min" },
          { sets: 4, reps: "4–6", rest: "3 min" }
        ],
        accessories: [
          "Chest-Supported Row",
          "Lat Pulldown",
          "Face Pull",
          "Back Extension",
          "Rear Delt Fly"
        ]
      }
    ]
  },

  accessorySchemes: [
    { sets: 3, reps: "8–12", rest: "60–90 sec" },
    { sets: 4, reps: "10", rest: "75 sec" },
    { sets: 3, reps: "12–15", rest: "60 sec" },
    { sets: 4, reps: "8–10", rest: "90 sec" }
  ]
};

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
  selectedCardio = randomItem(workoutData.cardio);
  cardioCard.classList.remove("muted");
  cardioCard.innerHTML = `<strong>${selectedCardio.name}</strong><br><span class="muted">${selectedCardio.detail}</span>`;
}

function generateWorkout(type) {
  selectedType = type;
  document.querySelectorAll(".type-btn").forEach(btn => {
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
      <div class="exercise-meta"><span class="pill">${currentWorkout.cardio.detail}</span></div>
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
      <div><strong>Compound:</strong> ${entry.compound.name} — ${entry.compound.scheme.sets} × ${entry.compound.scheme.reps}, rest ${entry.compound.scheme.rest}</div>
      <ul>
        ${entry.accessories.map(a => `<li>${a.name}: ${a.scheme.sets} × ${a.scheme.reps}, rest ${a.scheme.rest}</li>`).join("")}
      </ul>
    </div>
  `).join("<hr>");
}

cardioBtn.addEventListener("click", pickCardio);

document.querySelectorAll(".type-btn").forEach(btn => {
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
