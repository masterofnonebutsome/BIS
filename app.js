let workoutData = null;
let selectedType = null;
let selectedCardio = null;
let selectedCore = null;
let currentWorkout = null;
let calendarDate = new Date();
let motivationVideos = [];

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
const motivationBtn = document.getElementById("motivationBtn");
const motivationModal = document.getElementById("motivationModal");
const motivationFrame = document.getElementById("motivationFrame");
const motivationFallback = document.getElementById("motivationFallback");
const closeMotivation = document.getElementById("closeMotivation");

async function loadWorkoutData() {
  try {
    const response = await fetch("./workouts.json?v=4.3", { cache: "no-store" });
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

async function loadMotivationVideos() {
  try {
    const response = await fetch("./motivation.json?v=4.3", { cache: "no-store" });
    if (!response.ok) throw new Error(`Could not load motivation.json (${response.status})`);
    const data = await response.json();
    motivationVideos = Array.isArray(data) ? data : (data.videos || []);
    motivationVideos = motivationVideos.map(extractYouTubeId).filter(Boolean);
    motivationBtn.disabled = motivationVideos.length === 0;
  } catch (error) {
    console.error(error);
    motivationBtn.disabled = true;
  }
}

function extractYouTubeId(value) {
  if (typeof value !== "string") return null;
  const text = value.trim();
  if (/^[A-Za-z0-9_-]{11}$/.test(text)) return text;
  try {
    const url = new URL(text);
    if (url.hostname.includes("youtu.be")) return url.pathname.split("/").filter(Boolean)[0] || null;
    if (url.hostname.includes("youtube.com") || url.hostname.includes("youtube-nocookie.com")) {
      if (url.searchParams.get("v")) return url.searchParams.get("v");
      const parts = url.pathname.split("/").filter(Boolean);
      const marker = parts.findIndex(part => ["embed", "shorts", "live"].includes(part));
      if (marker >= 0 && parts[marker + 1]) return parts[marker + 1];
    }
  } catch (_) {}
  return null;
}

function openMotivation() {
  if (!motivationVideos.length) return;
  const previous = localStorage.getItem("lastMotivationVideo");
  const choices = motivationVideos.length > 1 ? motivationVideos.filter(id => id !== previous) : motivationVideos;
  const id = randomItem(choices.length ? choices : motivationVideos);
  localStorage.setItem("lastMotivationVideo", id);
  motivationFrame.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
  motivationFallback.href = `https://www.youtube.com/watch?v=${id}`;
  motivationModal.classList.add("open");
  motivationModal.setAttribute("aria-hidden", "false");
}

function closeMotivationVideo() {
  motivationModal.classList.remove("open");
  motivationModal.setAttribute("aria-hidden", "true");
  motivationFrame.src = "";
}

const randomItem = arr => arr[Math.floor(Math.random() * arr.length)];
function sample(arr, count) {
  const copy = [...arr], results = [];
  while (copy.length && results.length < count) results.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
  return results;
}
function exercise(name, label, scheme) { return { name, label, scheme }; }
function accessory(name, label = "ACCESSORY") { return exercise(name, label, workoutData.accessoryScheme); }

function dateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
function getHistory() {
  try { return JSON.parse(localStorage.getItem("workoutHistory") || "{}"); }
  catch { return {}; }
}
function saveHistory(h) { localStorage.setItem("workoutHistory", JSON.stringify(h)); }
function getCompoundWeights() {
  try { return JSON.parse(localStorage.getItem("compoundWeights") || "{}"); }
  catch { return {}; }
}
function saveCompoundWeights(weights) { localStorage.setItem("compoundWeights", JSON.stringify(weights)); }


function compoundSchemeKey(compound) {
  return `${compound.name}::${compound.scheme.sets}x${compound.scheme.reps}`;
}

function rebuildCompoundWeightsFromHistory() {
  const history = getHistory();
  const latest = {};
  Object.values(history).flat().forEach(entry => {
    if (!entry || !Array.isArray(entry.exercises) || !entry.exercises.length) return;
    const compound = entry.exercises[0];
    if (!compound?.name || compound.weightUsed === undefined || compound.weightUsed === null || compound.weightUsed === "") return;
    const completedAt = entry.completedAt || entry.date || "";
    const key = compoundSchemeKey(compound);
    const existingTime = latest[key]?.completedAt ? new Date(latest[key].completedAt).getTime() : -Infinity;
    const candidateTime = completedAt ? new Date(completedAt).getTime() : -Infinity;
    if (!latest[key] || candidateTime >= existingTime) {
      latest[key] = { weight: compound.weightUsed, completedAt };
    }
  });
  saveCompoundWeights(latest);
}

function deleteWorkout(key, index) {
  const history = getHistory();
  const entries = history[key] || [];
  const entry = entries[index];
  if (!entry) return;

  const label = `${entry.type || "Workout"} workout`;
  if (!window.confirm(`Delete this ${label}? This cannot be undone.`)) return;

  entries.splice(index, 1);
  if (entries.length) history[key] = entries;
  else delete history[key];

  saveHistory(history);
  rebuildCompoundWeightsFromHistory();
  renderCalendar();
  showHistoryForDate(key);
  if (currentWorkout) renderWorkout();
}

function getMostRecentWorkout(type) {
  const history = getHistory();
  const entries = Object.values(history).flat().filter(entry => entry && entry.type === type);
  if (!entries.length) return null;
  return entries.sort((a, b) => {
    const aTime = new Date(a.completedAt || a.date || 0).getTime();
    const bTime = new Date(b.completedAt || b.date || 0).getTime();
    return bTime - aTime;
  })[0] || null;
}

function previousExerciseNames(type) {
  const previous = getMostRecentWorkout(type);
  return new Set((previous?.exercises || []).map(e => e.name));
}

function pickAvoidingRecent(items, recentNames, getName = item => item) {
  if (!Array.isArray(items) || !items.length) return null;
  const fresh = items.filter(item => !recentNames.has(getName(item)));
  return randomItem(fresh.length ? fresh : items);
}

function sampleAvoidingRecent(items, count, recentNames, getName = item => item) {
  const fresh = items.filter(item => !recentNames.has(getName(item)));
  const repeated = items.filter(item => recentNames.has(getName(item)));
  const result = sample(fresh, Math.min(count, fresh.length));
  if (result.length < count) {
    const chosenNames = new Set(result.map(getName));
    const leftovers = repeated.filter(item => !chosenNames.has(getName(item)));
    result.push(...sample(leftovers, count - result.length));
  }
  return result;
}

function pickCompound(type, compounds) {
  const previous = getMostRecentWorkout(type);
  const previousCompound = previous?.exercises?.[0]?.name;
  const choices = compounds.filter(item => {
    const name = typeof item === "string" ? item : item.name;
    return name !== previousCompound;
  });
  return randomItem(choices.length ? choices : compounds);
}

function nextCompoundScheme(type) {
  const previous = getMostRecentWorkout(type);
  const previousScheme = previous?.exercises?.[0]?.scheme;
  const targetReps = previousScheme?.sets === 5 && String(previousScheme.reps) === "5" ? "3" : "5";
  return workoutData.compoundSchemes.find(scheme => String(scheme.reps) === targetReps)
    || workoutData.compoundSchemes[0];
}


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
  const recent = previousExerciseNames("CHEST");
  const compound = pickCompound("CHEST", d.compounds);
  const triceps = sampleAvoidingRecent(d.triceps, 2, recent);
  const shoulderPool = compound.kind === "shoulder" ? d.shoulderSecondShoulder : d.shoulderSecondChest;
  const secondShoulder = pickAvoidingRecent(shoulderPool, recent);
  const complementary = pickAvoidingRecent(compound.complementary, recent);
  return [
    exercise(compound.name, "COMPOUND", nextCompoundScheme("CHEST")),
    exercise(complementary, "COMPLEMENTARY PRESS", d.complementaryScheme),
    accessory(d.shoulderFirst, "SHOULDER"),
    accessory(triceps[0], "TRICEPS"),
    accessory(secondShoulder, "SHOULDER"),
    accessory(triceps[1], "TRICEPS")
  ];
}

function generateArms() {
  const d = workoutData.ARMS;
  const recent = previousExerciseNames("ARMS");
  const compound = pickCompound("ARMS", d.compounds);
  let categories;
  if (compound.kind === "biceps") categories = ["triceps", "biceps", "triceps", "biceps"];
  else if (compound.kind === "triceps") categories = ["biceps", "triceps", "biceps", "triceps"];
  else {
    const first = Math.random() < 0.5 ? "biceps" : "triceps";
    const other = first === "biceps" ? "triceps" : "biceps";
    categories = [first, other, first, other];
  }
  const neededB = categories.filter(x => x === "biceps").length;
  const neededT = categories.filter(x => x === "triceps").length;
  const biceps = sampleAvoidingRecent(d.biceps, neededB, recent);
  const triceps = sampleAvoidingRecent(d.triceps, neededT, recent);
  let bi = 0, ti = 0;
  const middle = categories.map(cat => accessory(cat === "biceps" ? biceps[bi++] : triceps[ti++], cat.toUpperCase()));
  const forearm = pickAvoidingRecent(d.forearms, recent, item => item.name);
  return [
    exercise(compound.name, "COMPOUND", nextCompoundScheme("ARMS")),
    ...middle,
    accessory(d.lateralRaise, "SHOULDER"),
    exercise(forearm.name, "FOREARMS", forearm.scheme)
  ];
}

function generateLegs() {
  const d = workoutData.LEGS;
  const recent = previousExerciseNames("LEGS");
  const compound = pickCompound("LEGS", d.compounds);
  const scheme = nextCompoundScheme("LEGS");
  const ex = [exercise(compound.name, "COMPOUND", scheme)];

  if (compound.kind === "squat") {
    const h = pickAvoidingRecent(d.hamstrings, recent);
    const q = sampleAvoidingRecent(d.quads, 2, recent);
    const c = pickAvoidingRecent(d.calves, recent);
    ex.push(
      accessory(d.smithRDL, "HAMSTRING / RDL"),
      accessory(q[0], "QUAD"),
      accessory(c, "CALF"),
      accessory(h, "HAMSTRING"),
      accessory(q[1], "QUAD")
    );
  } else if (compound.kind === "rdl") {
    const q2 = pickAvoidingRecent(d.squatPattern, recent);
    const remainingQuads = d.quads.filter(x => x !== q2);
    const calves = sampleAvoidingRecent(d.calves, 2, recent);
    ex.push(
      accessory(q2, "QUAD / SQUAT PATTERN"),
      accessory(calves[0], "CALF"),
      accessory(pickAvoidingRecent(d.hamstrings, recent), "HAMSTRING"),
      accessory(pickAvoidingRecent(remainingQuads, recent), "QUAD"),
      accessory(calves[1], "CALF")
    );
  } else {
    const rdlChoices = d.rdlPattern.filter(x => x !== compound.name);
    const q = sampleAvoidingRecent(d.quads, 2, recent);
    ex.push(
      accessory(pickAvoidingRecent(rdlChoices, recent), "HAMSTRING / RDL"),
      accessory(q[0], "QUAD"),
      accessory(pickAvoidingRecent(d.calves, recent), "CALF"),
      accessory(pickAvoidingRecent(d.hamstrings, recent), "HAMSTRING"),
      accessory(q[1], "QUAD")
    );
  }
  return ex;
}

function generateBack() {
  const d = workoutData.BACK;
  const recent = previousExerciseNames("BACK");
  const compound = pickCompound("BACK", d.compounds);
  const verticalPool = d.verticalPulls.filter(name => name !== compound.name);
  const horizontalPool = d.horizontalPulls.filter(name => name !== compound.name);
  return [
    exercise(compound.name, "COMPOUND • " + compound.pattern.toUpperCase() + " PULL", nextCompoundScheme("BACK")),
    accessory(pickAvoidingRecent(d.traps, recent), "TRAPS"),
    accessory(pickAvoidingRecent(verticalPool, recent), "VERTICAL PULL"),
    accessory(pickAvoidingRecent(d.biceps, recent), "BICEPS"),
    accessory(pickAvoidingRecent(horizontalPool, recent), "HORIZONTAL PULL"),
    accessory(pickAvoidingRecent(d.rearDelts, recent), "REAR DELTS")
  ];
}

function generateWorkout(type) {
  if (!workoutData) return;
  selectedType = type;
  typeButtons.forEach(btn => btn.classList.toggle("active", btn.dataset.type === type));
  if (!selectedCardio) pickCardio();
  const generators = { CHEST: generateChest, ARMS: generateArms, LEGS: generateLegs, BACK: generateBack };
  currentWorkout = {
    date: new Date().toISOString(),
    type,
    cardio: selectedCardio,
    core: selectedCore,
    exercises: generators[type]()
  };
  renderWorkout();
  regenerateBtn.disabled = false;
  completeBtn.disabled = false;
}

function renderScheme(s) {
  const rest = s.rest && s.rest !== "—" ? `<span class="pill">Rest ${s.rest}</span>` : "";
  const effort = s.rir ? `<span class="pill">Stop with ${s.rir} reps left</span>` : "";
  return `<span class="pill">${s.sets} sets</span><span class="pill">${s.reps} reps</span>${rest}${effort}`;
}

function renderCompoundWeight(exerciseItem) {
  const weights = getCompoundWeights();
  const schemeKey = compoundSchemeKey(exerciseItem);
  const saved = weights[schemeKey] || weights[exerciseItem.name];
  const schemeLabel = `${exerciseItem.scheme.sets}×${exerciseItem.scheme.reps}`;
  const lastWeight = Number(saved?.weight);
  const increment = currentWorkout?.type === "LEGS" ? 10 : 5;
  const hasSavedWeight = saved?.weight !== undefined && saved?.weight !== "" && Number.isFinite(lastWeight);
  const lastText = hasSavedWeight
    ? `<div class="last-weight">Last ${schemeLabel}: <strong>${saved.weight} lb</strong></div>
       <div class="last-weight muted">If every rep was clean, try <strong>${lastWeight + increment} lb</strong>. Otherwise repeat ${saved.weight} lb.</div>`
    : `<div class="last-weight muted">No previous ${schemeLabel} weight saved. Start conservatively.</div>`;
  const value = exerciseItem.weightUsed ?? "";
  return `
    <div class="weight-box">
      ${lastText}
      <label class="weight-label" for="compoundWeightInput">Today's weight (lb)</label>
      <div class="weight-input-row">
        <input id="compoundWeightInput" class="weight-input" type="number" inputmode="decimal" min="0" step="0.5" placeholder="Enter weight" value="${value}">
        <span>lb</span>
      </div>
    </div>`;
}

function renderWorkout() {
  if (!currentWorkout) return;
  const cardio = currentWorkout.cardio
    ? `<div class="exercise-card"><div class="exercise-label">CARDIO</div><div class="exercise-name">${currentWorkout.cardio.name}</div><div class="exercise-meta"><span class="pill">${currentWorkout.cardio.detail}</span></div></div>`
    : "";
  const core = currentWorkout.core
    ? `<div class="exercise-card"><div class="exercise-label">CORE • OPTIONAL</div><div class="exercise-name">${currentWorkout.core.name}</div><div class="exercise-meta">${renderScheme(currentWorkout.core.scheme)}</div></div>`
    : "";
  const exerciseCards = currentWorkout.exercises.map((e, i) => `
    <div class="exercise-card ${i === 0 ? "compound" : ""}">
      <div class="exercise-label">${currentWorkout.type} • ${i + 1} • ${e.label}</div>
      <div class="exercise-name">${e.name}</div>
      <div class="exercise-meta">${renderScheme(e.scheme)}</div>
      ${i === 0 ? renderCompoundWeight(e) : ""}
    </div>`).join("");
  workoutOutput.innerHTML = cardio + exerciseCards + core;
}

function completeWorkout() {
  if (!currentWorkout) return;
  const compound = currentWorkout.exercises?.[0];
  if (compound) {
    const input = document.getElementById("compoundWeightInput");
    const weight = (input?.value ?? compound.weightUsed ?? "").toString().trim();
    if (weight !== "") {
      compound.weightUsed = weight;
      const weights = getCompoundWeights();
      weights[compoundSchemeKey(compound)] = { weight, completedAt: new Date().toISOString() };
      saveCompoundWeights(weights);
    }
  }

  const now = new Date(), key = dateKey(now), history = getHistory();
  if (!history[key]) history[key] = [];
  history[key].push({ ...currentWorkout, cardio: selectedCardio, core: selectedCore, completedAt: now.toISOString() });
  saveHistory(history);
  renderCalendar();
  renderWorkout();
  completeBtn.textContent = "Saved ✓";
  setTimeout(() => completeBtn.textContent = "Complete Workout", 1200);
}

function renderCalendar() {
  const year = calendarDate.getFullYear(), month = calendarDate.getMonth(), history = getHistory();
  calendarTitle.textContent = calendarDate.toLocaleDateString(undefined, { month: "long", year: "numeric" });
  calendarGrid.innerHTML = "";
  const firstDay = new Date(year, month, 1).getDay(), daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div");
    empty.className = "calendar-day empty";
    calendarGrid.appendChild(empty);
  }
  const todayKey = dateKey(new Date());
  for (let day = 1; day <= daysInMonth; day++) {
    const key = dateKey(new Date(year, month, day)), btn = document.createElement("button");
    btn.className = "calendar-day";
    btn.textContent = day;
    if (history[key]?.length) btn.classList.add("completed");
    if (key === todayKey) btn.classList.add("today");
    btn.addEventListener("click", () => showHistoryForDate(key));
    calendarGrid.appendChild(btn);
  }
}

function showHistoryForDate(key) {
  const entries = getHistory()[key] || [];
  if (!entries.length) {
    historyDetail.className = "history-detail muted";
    historyDetail.textContent = "No completed workout on this date.";
    return;
  }
  historyDetail.className = "history-detail";
  historyDetail.innerHTML = entries.map((entry, idx) => `
    <div>
      <h4>${entry.type} Workout${entries.length > 1 ? ` #${idx + 1}` : ""}</h4>
      ${entry.cardio ? `<div><strong>Cardio:</strong> ${entry.cardio.name} — ${entry.cardio.detail}</div>` : ""}
      ${entry.core ? `<div><strong>Core:</strong> ${entry.core.name} — ${entry.core.scheme.sets} × ${entry.core.scheme.reps}</div>` : ""}
      <ol>${(entry.exercises || []).map((e, i) => `<li><strong>${e.name}</strong> (${e.label}): ${e.scheme.sets} × ${e.scheme.reps}${e.scheme.rest && e.scheme.rest !== "—" ? `, rest ${e.scheme.rest}` : ""}${i === 0 && e.weightUsed ? ` — <strong>${e.weightUsed} lb</strong>` : ""}</li>`).join("")}</ol>
      <button class="delete-workout-btn" type="button" data-date="${key}" data-index="${idx}">Delete Workout</button>
    </div>`).join("<hr>");
  historyDetail.querySelectorAll(".delete-workout-btn").forEach(btn => {
    btn.addEventListener("click", () => deleteWorkout(btn.dataset.date, Number(btn.dataset.index)));
  });
}

motivationBtn.addEventListener("click", openMotivation);
closeMotivation.addEventListener("click", closeMotivationVideo);
motivationModal.addEventListener("click", event => { if (event.target === motivationModal) closeMotivationVideo(); });
document.addEventListener("keydown", event => { if (event.key === "Escape") closeMotivationVideo(); });
cardioBtn.addEventListener("click", pickCardio);
coreBtn.addEventListener("click", pickCore);
typeButtons.forEach(btn => btn.addEventListener("click", () => generateWorkout(btn.dataset.type)));
regenerateBtn.addEventListener("click", () => { if (selectedType) generateWorkout(selectedType); });
completeBtn.addEventListener("click", completeWorkout);
workoutOutput.addEventListener("input", event => {
  if (event.target.id === "compoundWeightInput" && currentWorkout?.exercises?.[0]) {
    currentWorkout.exercises[0].weightUsed = event.target.value;
  }
});
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
loadMotivationVideos();
