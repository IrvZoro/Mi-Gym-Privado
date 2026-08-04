// ============================================================
// FORJA — lógica de la app
// ============================================================

const STORAGE_KEY = "forja_perfil";
const PROGRESS_KEY = "forja_progreso"; // { "YYYY-MM-DD": ["p1","h2",...] }

const state = {
  biotipo: null,   // 'ectomorfo' | 'mesomorfo' | 'endomorfo'
  lugar: null,     // 'casa' | 'gym'
  activeTab: 0,
  activeMuscle: null,
};

function todayKey(){
  const d = new Date();
  return d.toISOString().slice(0,10);
}

function loadProgress(){
  try{ return JSON.parse(localStorage.getItem(PROGRESS_KEY)) || {}; }
  catch(e){ return {}; }
}
function saveProgress(p){ localStorage.setItem(PROGRESS_KEY, JSON.stringify(p)); }

function isDoneToday(exId){
  const p = loadProgress();
  const list = p[todayKey()] || [];
  return list.includes(exId);
}

function toggleDone(exId){
  const p = loadProgress();
  const key = todayKey();
  if(!p[key]) p[key] = [];
  const idx = p[key].indexOf(exId);
  if(idx >= 0){ p[key].splice(idx,1); }
  else{ p[key].push(exId); }
  saveProgress(p);
  return p[key].includes(exId);
}

function computeRacha(){
  const p = loadProgress();
  const days = Object.keys(p).filter(k => p[k] && p[k].length > 0).sort().reverse();
  if(days.length === 0) return 0;
  let racha = 0;
  let cursor = new Date();
  // permite que "hoy" cuente aunque aún no hayas marcado nada, empezando desde el día más reciente con actividad
  for(let i=0; i<days.length; i++){
    const expected = cursor.toISOString().slice(0,10);
    if(days[i] === expected){
      racha++;
      cursor.setDate(cursor.getDate()-1);
    } else if(i===0 && days[i] !== expected){
      // el día más reciente no es hoy: revisa si es ayer para no romper la racha por no haber abierto la app hoy
      const yesterday = new Date(); yesterday.setDate(yesterday.getDate()-1);
      if(days[i] === yesterday.toISOString().slice(0,10)){
        racha++;
        cursor = yesterday; cursor.setDate(cursor.getDate()-1);
      } else break;
    } else break;
  }
  return racha;
}

// Siluetas SVG simples por biotipo (path abstracto, no realista)
const SILHOUETTES = {
  ectomorfo: `<svg viewBox="0 0 46 70" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="23" cy="8" r="6" stroke="currentColor" stroke-width="3"/>
    <path d="M23 14 V40 M14 22 L23 26 L32 22 M14 62 L23 40 L32 62" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
  mesomorfo: `<svg viewBox="0 0 46 70" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="23" cy="8" r="6" stroke="currentColor" stroke-width="3"/>
    <path d="M23 14 V38 M8 20 L23 27 L38 20 M11 62 L23 38 L35 62" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
  endomorfo: `<svg viewBox="0 0 46 70" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="23" cy="8" r="6" stroke="currentColor" stroke-width="3"/>
    <path d="M23 14 V36 M6 22 L23 29 L40 22 M9 62 L23 36 L37 62" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
};

// Agrupación de la rutina semanal
const DAY_TABS = [
  { id: "empuje", nombre: "Empuje", grupos: ["pecho", "hombros"] },
  { id: "jalon",  nombre: "Jalón",  grupos: ["espalda", "brazos"] },
  { id: "piernas",nombre: "Piernas",grupos: ["piernas", "gluteos", "pantorrillas"] },
  { id: "core",   nombre: "Core",  grupos: ["abdomen"] },
];

const MUSCLE_LABELS = {
  pecho: "Pecho", espalda: "Espalda", hombros: "Hombros", brazos: "Brazos",
  piernas: "Piernas", gluteos: "Glúteos", abdomen: "Abdomen", pantorrillas: "Pantorrillas"
};

// ------------------------------------------------------------
// Utilidades
// ------------------------------------------------------------
function locationMatches(exLoc, chosenLugar){
  return exLoc === "ambos" || exLoc === chosenLugar;
}

function getExercisesFor(grupo, lugar, biotipo, limit=4){
  return EXERCISES
    .filter(e => e.grupo === grupo && locationMatches(e.location, lugar))
    .sort((a,b) => (b.body[biotipo] - a.body[biotipo]) || (a.cbum === b.cbum ? 0 : a.cbum ? 1 : -1))
    .slice(0, limit);
}

function applyBiotipoTheme(biotipo){
  const color = BODY_TYPES[biotipo].color;
  document.documentElement.style.setProperty("--accent", color);
  document.documentElement.style.setProperty("--accent-soft", color + "29");
}

// ------------------------------------------------------------
// Modal / Toast / Confetti
// ------------------------------------------------------------
function openModal(html){
  document.getElementById("modal-body").innerHTML = html;
  document.getElementById("modal-backdrop").classList.remove("hidden");
}
function closeModal(){
  document.getElementById("modal-backdrop").classList.add("hidden");
}
document.getElementById("modal-close").addEventListener("click", closeModal);
document.getElementById("modal-backdrop").addEventListener("click", (e) => {
  if(e.target.id === "modal-backdrop") closeModal();
});

let toastTimer = null;
function showToast(msg){
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.classList.remove("hidden");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.add("hidden"), 2200);
}

function spawnConfetti(){
  const layer = document.getElementById("confetti-layer");
  const colors = ["#c9a15a", "#6fa8dc", "#e06c75", "#d9a441", "#f2efe9"];
  for(let i=0; i<28; i++){
    const piece = document.createElement("div");
    piece.className = "confetti-piece";
    piece.style.left = Math.random()*100 + "vw";
    piece.style.background = colors[Math.floor(Math.random()*colors.length)];
    piece.style.animationDelay = (Math.random()*0.3) + "s";
    piece.style.animationDuration = (1.1 + Math.random()*0.8) + "s";
    layer.appendChild(piece);
    setTimeout(() => piece.remove(), 2200);
  }
}

function saveProfile(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ biotipo: state.biotipo, lugar: state.lugar }));
}
function loadProfile(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return null;
    return JSON.parse(raw);
  }catch(e){ return null; }
}

// ------------------------------------------------------------
// Navegación entre pasos
// ------------------------------------------------------------
function showStep(id){
  document.querySelectorAll(".step").forEach(s => s.classList.add("hidden"));
  document.getElementById("step-" + id).classList.remove("hidden");
}

// ------------------------------------------------------------
// Paso 1: biotipo
// ------------------------------------------------------------
function renderBiotipoGrid(){
  const grid = document.getElementById("biotipo-grid");
  grid.innerHTML = "";
  Object.keys(BODY_TYPES).forEach(key => {
    const bt = BODY_TYPES[key];
    const card = document.createElement("button");
    card.className = "biotipo-card";
    card.style.setProperty("--bt-color", bt.color);
    card.dataset.biotipo = key;
    card.innerHTML = `
      <div class="biotipo-silhouette">${SILHOUETTES[key]}</div>
      <div class="biotipo-info">
        <div class="name">${bt.nombre}</div>
        <div class="desc">${bt.resumen}</div>
      </div>
      <span class="check-badge">✓</span>`;
    card.addEventListener("click", () => {
      state.biotipo = key;
      document.querySelectorAll(".biotipo-card").forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");
      applyBiotipoTheme(key);
      setTimeout(() => showStep("lugar"), 180);
    });
    grid.appendChild(card);
  });
}

document.getElementById("btn-biotipo-help").addEventListener("click", () => {
  const html = Object.values(BODY_TYPES).map(b => `
    <div class="modal-bt-block">
      <div class="name" style="color:${b.color}">${b.nombre}</div>
      <div class="desc">${b.resumen} ${b.enfoque}</div>
    </div>`).join("");
  openModal(`<h3 class="step-title" style="margin-bottom:16px;">Diferencias entre biotipos</h3>${html}`);
});

// ------------------------------------------------------------
// Paso 2: lugar
// ------------------------------------------------------------
document.querySelectorAll(".lugar-card").forEach(card => {
  card.addEventListener("click", () => {
    state.lugar = card.dataset.lugar;
    document.querySelectorAll(".lugar-card").forEach(c => c.classList.remove("selected"));
    card.classList.add("selected");
    saveProfile();
    setTimeout(() => { buildPlan(); showStep("plan"); }, 150);
  });
});

// ------------------------------------------------------------
// Plan principal
// ------------------------------------------------------------
function buildPlan(){
  const bt = BODY_TYPES[state.biotipo];
  document.getElementById("plan-title").textContent = `Plan · ${bt.nombre}`;
  document.getElementById("plan-summary").textContent =
    `${bt.enfoque} Entrenando en: ${state.lugar === "casa" ? "casa" : "gimnasio"}.`;

  const tabsEl = document.getElementById("plan-tabs");
  tabsEl.innerHTML = "";
  DAY_TABS.forEach((day, i) => {
    const btn = document.createElement("button");
    btn.className = "tab-btn" + (i === state.activeTab ? " active" : "");
    btn.textContent = day.nombre;
    btn.addEventListener("click", () => {
      state.activeTab = i;
      renderPlanTab();
      document.querySelectorAll("#plan-tabs .tab-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    });
    tabsEl.appendChild(btn);
  });

  renderPlanTab();
}

function exerciseCardHTML(ex){
  const done = isDoneToday(ex.id);
  return `
    <div class="exercise-card${done ? " done" : ""}" data-ex-id="${ex.id}">
      <button class="ex-check${done ? " checked" : ""}" data-ex-id="${ex.id}" aria-label="Marcar como hecho">${done ? "✓" : ""}</button>
      <div class="exercise-body">
        <div class="exercise-info">
          <div class="ex-name">${ex.nombre}</div>
          <div class="ex-nota">${ex.nota}</div>
          <div class="ex-tags">
            ${ex.cbum ? '<span class="tag cbum">ESTILO CBUM</span>' : ""}
            <span class="tag">${ex.location === "ambos" ? "casa / gym" : ex.location}</span>
          </div>
        </div>
      </div>
      <div class="ex-sets">${ex.series}<span class="ex-equipo">${ex.equipo}</span></div>
    </div>`;
}

function attachCheckHandlers(container){
  container.querySelectorAll(".ex-check").forEach(btn => {
    btn.addEventListener("click", () => {
      const exId = btn.dataset.exId;
      const nowDone = toggleDone(exId);
      const card = container.querySelector(`.exercise-card[data-ex-id="${exId}"]`);
      btn.classList.toggle("checked", nowDone);
      btn.textContent = nowDone ? "✓" : "";
      card.classList.toggle("done", nowDone);
      if(nowDone) showToast("¡Ejercicio completado! 💪");
      updateProgressBar();
      updateRachaChip();
    });
  });
}

function currentTabExerciseIds(){
  const day = DAY_TABS[state.activeTab];
  let ids = [];
  day.grupos.forEach(grupo => {
    ids = ids.concat(getExercisesFor(grupo, state.lugar, state.biotipo, 4).map(e => e.id));
  });
  return ids;
}

function updateProgressBar(){
  const ids = currentTabExerciseIds();
  const p = loadProgress();
  const doneToday = p[todayKey()] || [];
  const doneCount = ids.filter(id => doneToday.includes(id)).length;
  const pct = ids.length ? Math.round((doneCount/ids.length)*100) : 0;
  const fill = document.getElementById("day-progress-fill");
  const label = document.getElementById("day-progress-label");
  if(!fill || !label) return;
  fill.style.width = pct + "%";
  label.textContent = `${doneCount}/${ids.length} hechos hoy`;
  if(ids.length > 0 && doneCount === ids.length && !fill.dataset.celebrated){
    fill.dataset.celebrated = "1";
    spawnConfetti();
    showToast("¡Día completado! 🔥");
  }
  if(doneCount < ids.length){
    fill.dataset.celebrated = "";
  }
}

function updateRachaChip(){
  const racha = computeRacha();
  const chip = document.getElementById("racha-chip");
  const num = document.getElementById("racha-num");
  if(!chip) return;
  if(racha > 0){
    num.textContent = racha;
    chip.classList.remove("hidden");
  } else {
    chip.classList.add("hidden");
  }
}

function renderPlanTab(){
  const day = DAY_TABS[state.activeTab];
  const container = document.getElementById("plan-content");
  container.innerHTML = "";

  day.grupos.forEach(grupo => {
    const exs = getExercisesFor(grupo, state.lugar, state.biotipo, 4);
    if(exs.length === 0) return;
    const block = document.createElement("div");
    block.className = "day-block";
    block.innerHTML = `<div class="day-heading">${MUSCLE_LABELS[grupo]}</div>` +
      exs.map(exerciseCardHTML).join("");
    container.appendChild(block);
  });

  attachCheckHandlers(container);
  updateProgressBar();
  updateRachaChip();
}

// ------------------------------------------------------------
// Entrenar músculo específico
// ------------------------------------------------------------
function renderMuscleChips(){
  const row = document.getElementById("muscle-chip-row");
  row.innerHTML = "";
  Object.keys(MUSCLE_LABELS).forEach(key => {
    const chip = document.createElement("button");
    chip.className = "muscle-chip" + (key === state.activeMuscle ? " active" : "");
    chip.textContent = MUSCLE_LABELS[key];
    chip.addEventListener("click", () => {
      state.activeMuscle = key;
      renderMuscleChips();
      renderMuscleContent();
    });
    row.appendChild(chip);
  });
}

function renderMuscleContent(){
  const container = document.getElementById("muscle-content");
  if(!state.activeMuscle){
    container.innerHTML = `<p class="plan-summary">Selecciona un grupo muscular arriba para ver los mejores ejercicios según tu biotipo y dónde entrenas.</p>`;
    return;
  }
  const exs = getExercisesFor(state.activeMuscle, state.lugar, state.biotipo, 8);
  container.innerHTML = `<div class="day-block"><div class="day-heading">${MUSCLE_LABELS[state.activeMuscle]}</div>` +
    exs.map(exerciseCardHTML).join("") + `</div>`;
  attachCheckHandlers(container);
}

document.getElementById("btn-goto-musculo").addEventListener("click", () => {
  renderMuscleChips();
  renderMuscleContent();
  showStep("musculo");
});
document.getElementById("btn-back-plan").addEventListener("click", () => showStep("plan"));
document.getElementById("btn-edit-perfil").addEventListener("click", () => showStep("biotipo"));

// ------------------------------------------------------------
// Inicio / reinicio
// ------------------------------------------------------------
document.getElementById("btn-start").addEventListener("click", () => showStep("biotipo"));

document.getElementById("btn-reset").addEventListener("click", () => {
  if(!confirm("Esto borrará tu biotipo y lugar guardados. ¿Continuar?")) return;
  localStorage.removeItem(STORAGE_KEY);
  state.biotipo = null; state.lugar = null; state.activeMuscle = null; state.activeTab = 0;
  document.documentElement.style.setProperty("--accent", "#c9a15a");
  document.documentElement.style.setProperty("--accent-soft", "rgba(201,161,90,0.16)");
  document.querySelectorAll(".biotipo-card").forEach(c => c.classList.remove("selected"));
  document.querySelectorAll(".lugar-card").forEach(c => c.classList.remove("selected"));
  document.getElementById("racha-chip").classList.add("hidden");
  showStep("welcome");
});

// ------------------------------------------------------------
// Arranque
// ------------------------------------------------------------
renderBiotipoGrid();

const saved = loadProfile();
if(saved && saved.biotipo && saved.lugar){
  state.biotipo = saved.biotipo;
  state.lugar = saved.lugar;
  applyBiotipoTheme(saved.biotipo);
  document.querySelector(`.biotipo-card[data-biotipo="${saved.biotipo}"]`)?.classList.add("selected");
  document.querySelector(`.lugar-card[data-lugar="${saved.lugar}"]`)?.classList.add("selected");
  buildPlan();
  showStep("plan");
} else {
  showStep("welcome");
}
