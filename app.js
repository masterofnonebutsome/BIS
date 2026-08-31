let workoutData = null;
let selectedType = null;
let selectedCardio = null;
let selectedCore = null;
let currentWorkout = null;
let calendarDate = new Date();

const cardioCard = document.getElementById("cardioCard");
const coreCard = document.getElementById("coreCard");
const cardioBtn = document.getElementById("cardioBtn");
const coreBtn = document.getElementById("coreBtn");
const workoutOutput = document.getElementById("workoutOutput");
const regenerateBtn = document.getElementById("regenerateBtn");
const completeBtn = document.getElementById("completeBtn");
const calendarTitle = document.getElementById("calendarTitle");
const calendarGrid = document.getElementById("calendarGrid");
const historyDetail = document.getElementById("historyDetail");
const typeButtons = document.querySelectorAll(".type-btn");

async function loadWorkoutData() {
  try {
    const response = await fetch("./workouts.json?v=3.1", { cache: "no-store" });
    if (!response.ok) throw new Error(`Could not load workouts.json (${response.status})`);
    workoutData = await response.json();
    cardioCard.textContent = "Tap “Pick Cardio” to begin.";
    cardioCard.classList.add("muted");
    coreCard.textContent = "Tap “Pick Core” for an optional core movement.";
    coreCard.classList.add("muted");
    cardioBtn.disabled = false;
    coreBtn.disabled = false;
    typeButtons.forEach(btn => btn.disabled = false);
  } catch (error) {
    console.error(error);
    cardioCard.innerHTML = `<strong>Workout data could not be loaded.</strong><br><span class="muted">Make sure workouts.json is in the same folder as index.html and app.js.</span>`;
  }
}

const randomItem = arr => arr[Math.floor(Math.random() * arr.length)];
function sample(arr, count) {
  const copy = [...arr], results = [];
  while (copy.length && results.length < count) results.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
  return results;
}
function exercise(name, label, scheme) { return { name, label, scheme }; }
function accessory(name, label = "ACCESSORY") { return exercise(name, label, workoutData.accessoryScheme); }

function pickCardio() {
  selectedCardio = randomItem(workoutData.cardio);
  cardioCard.classList.remove("muted");
  cardioCard.innerHTML = `<strong>${selectedCardio.name}</strong><br><span class="muted">${selectedCardio.detail}</span>`;
  syncIndependentSelections();
}

function pickCore() {
  if (!workoutData || !Array.isArray(workoutData.core) || !workoutData.core.length) {
    coreCard.classList.remove("muted");
    coreCard.innerHTML = `<strong>Core data is unavailable.</strong><br><span class="muted">Make sure the newest workouts.json is uploaded.</span>`;
    return;
  }
  selectedCore = randomItem(workoutData.core);
  coreCard.classList.remove("muted");
  coreCard.innerHTML = `<strong>${selectedCore.name}</strong><br><span class="muted">${selectedCore.scheme.sets} × ${selectedCore.scheme.reps}</span>`;
  syncIndependentSelections();
}

function syncIndependentSelections() {
  if (!currentWorkout) return;
  currentWorkout.cardio = selectedCardio;
  currentWorkout.core = selectedCore;
  renderWorkout();
}

function generateChest() {
  const d = workoutData.CHEST;
  const compound = randomItem(d.compounds);
  const triceps = sample(d.triceps, 2);
  const secondShoulder = randomItem(compound.kind === "shoulder" ? d.shoulderSecondShoulder : d.shoulderSecondChest);
  return [
    exercise(compound.name, "COMPOUND", randomItem(workoutData.compoundSchemes)),
    exercise(randomItem(compound.complementary), "COMPLEMENTARY PRESS", d.complementaryScheme),
    accessory(d.shoulderFirst, "SHOULDER"),
    accessory(triceps[0], "TRICEPS"),
    accessory(secondShoulder, "SHOULDER"),
    accessory(triceps[1], "TRICEPS")
  ];
}

function generateArms() {
  const d = workoutData.ARMS;
  const compound = randomItem(d.compounds);
  let categories;
  if (compound.kind === "biceps") categories = ["triceps", "biceps", "triceps", "biceps", "triceps"];
  else if (compound.kind === "triceps") categories = ["biceps", "triceps", "biceps", "triceps", "biceps"];
  else {
    const first = Math.random() < 0.5 ? "biceps" : "triceps";
    const other = first === "biceps" ? "triceps" : "biceps";
    categories = [first, other, first, other, first];
  }
  const neededB = categories.filter(x => x === "biceps").length;
  const neededT = categories.filter(x => x === "triceps").length;
  const biceps = sample(d.biceps, neededB), triceps = sample(d.triceps, neededT);
  let bi = 0, ti = 0;
  const middle = categories.map(cat => accessory(cat === "biceps" ? biceps[bi++] : triceps[ti++], cat.toUpperCase()));
  const forearm = randomItem(d.forearms);
  return [
    exercise(compound.name, "COMPOUND", randomItem(workoutData.compoundSchemes)),
    ...middle,
    accessory(d.lateralRaise, "SHOULDER"),
    exercise(forearm.name, "FOREARMS", forearm.scheme)
  ];
}

function generateLegs() {
  const d = workoutData.LEGS;
  const compound = randomItem(d.compounds);
  const scheme = randomItem(workoutData.compoundSchemes);
  let ex = [exercise(compound.name, "COMPOUND", scheme)];
  if (compound.kind === "squat") {
    const h = randomItem(d.hamstrings), q = sample(d.quads, 2), c = randomItem(d.calves);
    ex.push(accessory(d.smithRDL, "HAMSTRING / RDL"), accessory(q[0], "QUAD"), accessory(c, "CALF"), accessory(h, "HAMSTRING"), accessory(q[1], "QUAD"));
  } else if (compound.kind === "rdl") {
    const q2 = randomItem(d.squatPattern);
    const remainingQuads = d.quads.filter(x => x !== q2);
    ex.push(accessory(q2, "QUAD / SQUAT PATTERN"), accessory(randomItem(d.calves), "CALF"), accessory(randomItem(d.hamstrings), "HAMSTRING"), accessory(randomItem(remainingQuads), "QUAD"), accessory(randomItem(d.calves.filter(x => x !== ex[1]?.name)), "CALF"));
    // Ensure the two calf slots differ.
    if (ex[2].name === ex[5].name) ex[5] = accessory(randomItem(d.calves.filter(x => x !== ex[2].name)), "CALF");
  } else {
    const rdlChoices = d.rdlPattern.filter(x => x !== compound.name);
    const q = sample(d.quads, 2);
    ex.push(accessory(randomItem(rdlChoices), "HAMSTRING / RDL"), accessory(q[0], "QUAD"), accessory(randomItem(d.calves), "CALF"), accessory(randomItem(d.hamstrings), "HAMSTRING"), accessory(q[1], "QUAD"));
  }
  return ex;
}

function generateBack() {
  const d = workoutData.BACK;
  const biceps = sample(workoutData.ARMS.biceps, 2);
  const backs = sample(d.backAccessories, 2);
  return [
    exercise(randomItem(d.compounds), "COMPOUND", randomItem(workoutData.compoundSchemes)),
    accessory(randomItem(d.traps), "TRAPS"),
    accessory(backs[0], "BACK"),
    accessory(biceps[0], "BICEPS"),
    accessory(backs[1], "BACK"),
    accessory(biceps[1], "BICEPS")
  ];
}

function generateWorkout(type) {
  if (!workoutData) return;
  selectedType = type;
  typeButtons.forEach(btn => btn.classList.toggle("active", btn.dataset.type === type));
  if (!selectedCardio) pickCardio();
  const generators = { CHEST: generateChest, ARMS: generateArms, LEGS: generateLegs, BACK: generateBack };
  currentWorkout = { date: new Date().toISOString(), type, cardio: selectedCardio, core: selectedCore, exercises: generators[type]() };
  renderWorkout();
  regenerateBtn.disabled = false;
  completeBtn.disabled = false;
}

function renderScheme(s) {
  const rest = s.rest && s.rest !== "—" ? `<span class="pill">Rest ${s.rest}</span>` : "";
  return `<span class="pill">${s.sets} sets</span><span class="pill">${s.reps} reps</span>${rest}`;
}

function renderWorkout() {
  if (!currentWorkout) return;
  const cardio = currentWorkout.cardio ? `<div class="exercise-card"><div class="exercise-label">CARDIO</div><div class="exercise-name">${currentWorkout.cardio.name}</div><div class="exercise-meta"><span class="pill">${currentWorkout.cardio.detail}</span></div></div>` : "";
  const core = currentWorkout.core ? `<div class="exercise-card"><div class="exercise-label">CORE • OPTIONAL</div><div class="exercise-name">${currentWorkout.core.name}</div><div class="exercise-meta">${renderScheme(currentWorkout.core.scheme)}</div></div>` : "";
  workoutOutput.innerHTML = cardio + currentWorkout.exercises.map((e, i) => `<div class="exercise-card ${i === 0 ? "compound" : ""}"><div class="exercise-label">${currentWorkout.type} • ${i + 1} • ${e.label}</div><div class="exercise-name">${e.name}</div><div class="exercise-meta">${renderScheme(e.scheme)}</div></div>`).join("") + core;
}

function dateKey(date) { return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`; }
function getHistory() { return JSON.parse(localStorage.getItem("workoutHistory") || "{}"); }
function saveHistory(h) { localStorage.setItem("workoutHistory", JSON.stringify(h)); }

function completeWorkout() {
  if (!currentWorkout) return;
  const now = new Date(), key = dateKey(now), history = getHistory();
  if (!history[key]) history[key] = [];
  history[key].push({ ...currentWorkout, cardio: selectedCardio, core: selectedCore, completedAt: now.toISOString() });
  saveHistory(history); renderCalendar();
  completeBtn.textContent = "Saved ✓";
  setTimeout(() => completeBtn.textContent = "Complete Workout", 1200);
}

function renderCalendar() {
  const year = calendarDate.getFullYear(), month = calendarDate.getMonth(), history = getHistory();
  calendarTitle.textContent = calendarDate.toLocaleDateString(undefined, { month: "long", year: "numeric" });
  calendarGrid.innerHTML = "";
  const firstDay = new Date(year, month, 1).getDay(), daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let i=0; i<firstDay; i++) { const empty=document.createElement("div"); empty.className="calendar-day empty"; calendarGrid.appendChild(empty); }
  const todayKey = dateKey(new Date());
  for (let day=1; day<=daysInMonth; day++) {
    const key=dateKey(new Date(year,month,day)), btn=document.createElement("button"); btn.className="calendar-day"; btn.textContent=day;
    if (history[key]?.length) btn.classList.add("completed"); if (key===todayKey) btn.classList.add("today");
    btn.addEventListener("click",()=>showHistoryForDate(key)); calendarGrid.appendChild(btn);
  }
}

function showHistoryForDate(key) {
  const entries=getHistory()[key] || [];
  if (!entries.length) { historyDetail.className="history-detail muted"; historyDetail.textContent="No completed workout on this date."; return; }
  historyDetail.className="history-detail";
  historyDetail.innerHTML=entries.map((entry,idx)=>`<div><h4>${entry.type} Workout${entries.length>1?` #${idx+1}`:""}</h4>${entry.cardio?`<div><strong>Cardio:</strong> ${entry.cardio.name} — ${entry.cardio.detail}</div>`:""}${entry.core?`<div><strong>Core:</strong> ${entry.core.name} — ${entry.core.scheme.sets} × ${entry.core.scheme.reps}</div>`:""}<ol>${(entry.exercises||[]).map(e=>`<li><strong>${e.name}</strong> (${e.label}): ${e.scheme.sets} × ${e.scheme.reps}${e.scheme.rest&&e.scheme.rest!=="—"?`, rest ${e.scheme.rest}`:""}</li>`).join("")}</ol></div>`).join("<hr>");
}

cardioBtn.addEventListener("click", pickCardio);
coreBtn.addEventListener("click", pickCore);
typeButtons.forEach(btn => btn.addEventListener("click", () => generateWorkout(btn.dataset.type)));
regenerateBtn.addEventListener("click", () => { if (selectedType) generateWorkout(selectedType); });
completeBtn.addEventListener("click", completeWorkout);
document.getElementById("prevMonth").addEventListener("click", () => { calendarDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth()-1, 1); renderCalendar(); });
document.getElementById("nextMonth").addEventListener("click", () => { calendarDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth()+1, 1); renderCalendar(); });
renderCalendar(); loadWorkoutData();
