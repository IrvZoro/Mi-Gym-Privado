// ============================================================
// FORJA — lógica de la app
// ============================================================

const STORAGE_KEY = "forja_perfil";

const state = {
  biotipo: null,   // 'ectomorfo' | 'mesomorfo' | 'endomorfo'
  lugar: null,     // 'casa' | 'gym'
  activeTab: 0,
  activeMuscle: null,
};

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
      </div>`;
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
  const texto = Object.values(BODY_TYPES).map(b => `${b.nombre}: ${b.resumen}`).join("\n\n");
  alert(texto);
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
  return `
    <div class="exercise-card">
      <div class="exercise-info">
        <div class="ex-name">${ex.nombre}</div>
        <div class="ex-nota">${ex.nota}</div>
        <div class="ex-tags">
          ${ex.cbum ? '<span class="tag cbum">ESTILO CBUM</span>' : ""}
          <span class="tag">${ex.location === "ambos" ? "casa / gym" : ex.location}</span>
        </div>
      </div>
      <div class="ex-sets">${ex.series}<span class="ex-equipo">${ex.equipo}</span></div>
    </div>`;
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
