// Base de datos de ejercicios
// bodyType score: 1 (poco recomendado) a 3 (muy recomendado)
// location: "casa", "gym", "ambos"
// cbum: true => ejercicio de aislamiento/estética estilo bodybuilding clásico (simetría, "mind-muscle", detalle)

const EXERCISES = [

  // ============ PECHO ============
  { id:"p1", nombre:"Press de banca plano", grupo:"pecho", location:"gym", equipo:"Barra + banco",
    body:{ecto:3, meso:3, endo:2}, series:"4x6-8", cbum:false,
    nota:"Base para masa y fuerza en el pecho." },
  { id:"p2", nombre:"Press inclinado con mancuernas", grupo:"pecho", location:"gym", equipo:"Mancuernas + banco inclinado",
    body:{ecto:3, meso:3, endo:2}, series:"4x8-10", cbum:false,
    nota:"Prioriza la parte alta del pecho, clave para el look estético." },
  { id:"p3", nombre:"Aperturas en polea (cable crossover)", grupo:"pecho", location:"gym", equipo:"Polea",
    body:{ecto:2, meso:3, endo:3}, series:"3x12-15", cbum:true,
    nota:"Ejercicio de aislamiento estilo CBUM para marcar la separación del pecho." },
  { id:"p4", nombre:"Flexiones de pecho", grupo:"pecho", location:"casa", equipo:"Peso corporal",
    body:{ecto:2, meso:3, endo:3}, series:"4x15-20", cbum:false,
    nota:"Ideal para casa, se puede elevar los pies para más dificultad." },
  { id:"p5", nombre:"Flexiones diamante", grupo:"pecho", location:"casa", equipo:"Peso corporal",
    body:{ecto:2, meso:3, endo:3}, series:"3x12-15", cbum:false,
    nota:"Enfatiza pecho interno y tríceps." },
  { id:"p6", nombre:"Press con mochila cargada (piso)", grupo:"pecho", location:"casa", equipo:"Mochila con peso",
    body:{ecto:3, meso:3, endo:2}, series:"4x10-12", cbum:false,
    nota:"Sustituto casero del press de banca cuando no hay barra." },
  { id:"p7", nombre:"Press de pecho en máquina", grupo:"pecho", location:"gym", equipo:"Máquina",
    body:{ecto:2, meso:3, endo:3}, series:"3x10-12", cbum:false,
    nota:"Más seguro y controlado, bueno para volumen sin fatiga articular." },

  // ============ ESPALDA ============
  { id:"e1", nombre:"Dominadas (pull-ups)", grupo:"espalda", location:"ambos", equipo:"Barra fija",
    body:{ecto:3, meso:3, endo:2}, series:"4x6-10", cbum:false,
    nota:"El mejor ejercicio para ensanchar la espalda (V-taper)." },
  { id:"e2", nombre:"Remo con barra", grupo:"espalda", location:"gym", equipo:"Barra",
    body:{ecto:3, meso:3, endo:2}, series:"4x8-10", cbum:false,
    nota:"Grosor y densidad de espalda media." },
  { id:"e3", nombre:"Jalón al pecho en polea", grupo:"espalda", location:"gym", equipo:"Polea alta",
    body:{ecto:2, meso:3, endo:3}, series:"4x10-12", cbum:false,
    nota:"Alternativa controlada a dominadas, buena para todos los biotipos." },
  { id:"e4", nombre:"Remo con mancuerna a una mano", grupo:"espalda", location:"gym", equipo:"Mancuerna + banco",
    body:{ecto:2, meso:3, endo:3}, series:"3x10-12", cbum:true,
    nota:"Estilo CBUM: pausa de 1 seg. arriba para maximizar contracción." },
  { id:"e5", nombre:"Pull-over con mancuerna", grupo:"espalda", location:"gym", equipo:"Mancuerna + banco",
    body:{ecto:3, meso:2, endo:1}, series:"3x12-15", cbum:true,
    nota:"Estira el dorsal y ayuda a dar sensación de \"caja torácica\" amplia." },
  { id:"e6", nombre:"Remo con mochila/toalla (puerta)", grupo:"espalda", location:"casa", equipo:"Mochila con peso o banda",
    body:{ecto:2, meso:3, endo:3}, series:"4x12-15", cbum:false,
    nota:"Sustituto de remo con barra usando peso casero o banda elástica." },
  { id:"e7", nombre:"Superman", grupo:"espalda", location:"casa", equipo:"Peso corporal",
    body:{ecto:2, meso:2, endo:3}, series:"3x15-20", cbum:false,
    nota:"Activa lumbares y espalda baja, buen calentamiento." },

  // ============ HOMBROS ============
  { id:"h1", nombre:"Press militar con barra", grupo:"hombros", location:"gym", equipo:"Barra",
    body:{ecto:3, meso:3, endo:2}, series:"4x6-8", cbum:false,
    nota:"Fuerza y masa general de hombro." },
  { id:"h2", nombre:"Elevaciones laterales con mancuerna", grupo:"hombros", location:"gym", equipo:"Mancuernas",
    body:{ecto:2, meso:3, endo:3}, series:"4x12-15", cbum:true,
    nota:"El ejercicio clave para hombros \"anchos\" estilo CBUM. Peso ligero, técnica estricta." },
  { id:"h3", nombre:"Press con mancuernas sentado", grupo:"hombros", location:"gym", equipo:"Mancuernas + banco",
    body:{ecto:3, meso:3, endo:2}, series:"4x8-10", cbum:false,
    nota:"Mayor rango de movimiento que la barra." },
  { id:"h4", nombre:"Pájaros (deltoide posterior)", grupo:"hombros", location:"gym", equipo:"Mancuernas",
    body:{ecto:2, meso:3, endo:3}, series:"3x15", cbum:true,
    nota:"Estilo CBUM: clave para la vista de espalda/hombro 3D." },
  { id:"h5", nombre:"Flexiones pike (pino asistido)", grupo:"hombros", location:"casa", equipo:"Peso corporal",
    body:{ecto:2, meso:3, endo:2}, series:"3x10-12", cbum:false,
    nota:"Sustituto de press militar en casa." },
  { id:"h6", nombre:"Elevaciones laterales con mochila/garrafón", grupo:"hombros", location:"casa", equipo:"Peso casero",
    body:{ecto:2, meso:3, endo:3}, series:"4x15", cbum:true,
    nota:"Mismo principio estético que en gym, con objetos caseros." },

  // ============ BRAZOS (bíceps/tríceps) ============
  { id:"b1", nombre:"Curl de bíceps con barra", grupo:"brazos", location:"gym", equipo:"Barra",
    body:{ecto:3, meso:3, endo:2}, series:"4x8-10", cbum:false,
    nota:"Base para volumen de bíceps." },
  { id:"b2", nombre:"Curl inclinado con mancuerna", grupo:"brazos", location:"gym", equipo:"Mancuernas + banco",
    body:{ecto:2, meso:3, endo:3}, series:"3x10-12", cbum:true,
    nota:"Estilo CBUM: estiramiento profundo del bíceps, muy usado para el \"pico\"." },
  { id:"b3", nombre:"Press francés (tríceps)", grupo:"brazos", location:"gym", equipo:"Barra Z o mancuerna",
    body:{ecto:3, meso:3, endo:2}, series:"4x8-10", cbum:false,
    nota:"Masa de la cabeza larga del tríceps." },
  { id:"b4", nombre:"Extensión de tríceps en polea (pushdown)", grupo:"brazos", location:"gym", equipo:"Polea",
    body:{ecto:2, meso:3, endo:3}, series:"3x12-15", cbum:true,
    nota:"Estilo CBUM: contracción máxima al final del movimiento, ideal para definición." },
  { id:"b5", nombre:"Fondos en banco (tríceps)", grupo:"brazos", location:"casa", equipo:"Banco o silla",
    body:{ecto:2, meso:3, endo:2}, series:"3x12-15", cbum:false,
    nota:"Muy efectivo sin equipo." },
  { id:"b6", nombre:"Curl con mochila cargada", grupo:"brazos", location:"casa", equipo:"Mochila con peso",
    body:{ecto:2, meso:3, endo:3}, series:"4x12-15", cbum:false,
    nota:"Sustituto casero de curl con barra." },
  { id:"b7", nombre:"Flexiones cerradas (tríceps)", grupo:"brazos", location:"casa", equipo:"Peso corporal",
    body:{ecto:2, meso:3, endo:3}, series:"3x15", cbum:false,
    nota:"Complementa el trabajo de tríceps en casa." },

  // ============ PIERNAS ============
  { id:"l1", nombre:"Sentadilla con barra", grupo:"piernas", location:"gym", equipo:"Barra + rack",
    body:{ecto:3, meso:3, endo:2}, series:"4x6-8", cbum:false,
    nota:"El ejercicio más completo para piernas y fuerza general." },
  { id:"l2", nombre:"Prensa de piernas", grupo:"piernas", location:"gym", equipo:"Máquina",
    body:{ecto:2, meso:3, endo:3}, series:"4x10-12", cbum:false,
    nota:"Permite mucho volumen con menor fatiga en espalda baja." },
  { id:"l3", nombre:"Peso muerto rumano", grupo:"piernas", location:"gym", equipo:"Barra o mancuernas",
    body:{ecto:3, meso:3, endo:2}, series:"4x8-10", cbum:false,
    nota:"Isquiotibiales y glúteo, clave para el balance de la pierna." },
  { id:"l4", nombre:"Extensión de cuádriceps en máquina", grupo:"piernas", location:"gym", equipo:"Máquina",
    body:{ecto:2, meso:3, endo:3}, series:"3x15", cbum:true,
    nota:"Estilo CBUM: separación de cuádriceps (\"quad sweep\"), pausa arriba." },
  { id:"l5", nombre:"Curl femoral en máquina", grupo:"piernas", location:"gym", equipo:"Máquina",
    body:{ecto:2, meso:3, endo:3}, series:"3x12-15", cbum:true,
    nota:"Aislamiento estilo CBUM para isquiotibiales bien marcados." },
  { id:"l6", nombre:"Sentadilla búlgara", grupo:"piernas", location:"ambos", equipo:"Banco (mancuernas opcional)",
    body:{ecto:2, meso:3, endo:3}, series:"3x10-12 c/pierna", cbum:false,
    nota:"Excelente en casa o gym, trabaja simetría entre piernas." },
  { id:"l7", nombre:"Sentadilla a una pierna (pistol asistido)", grupo:"piernas", location:"casa", equipo:"Peso corporal",
    body:{ecto:2, meso:3, endo:2}, series:"3x8-10 c/pierna", cbum:false,
    nota:"Alternativa en casa a la sentadilla con barra." },
  { id:"l8", nombre:"Zancadas caminando", grupo:"piernas", location:"casa", equipo:"Peso corporal / mochila",
    body:{ecto:2, meso:3, endo:3}, series:"4x12 c/pierna", cbum:false,
    nota:"Buen volumen para piernas sin necesitar máquinas." },

  // ============ GLÚTEOS ============
  { id:"g1", nombre:"Hip thrust con barra", grupo:"gluteos", location:"gym", equipo:"Barra + banco",
    body:{ecto:2, meso:3, endo:3}, series:"4x8-10", cbum:false,
    nota:"El mejor ejercicio de activación y fuerza de glúteo." },
  { id:"g2", nombre:"Patada de glúteo en polea", grupo:"gluteos", location:"gym", equipo:"Polea baja",
    body:{ecto:2, meso:3, endo:3}, series:"3x15", cbum:true,
    nota:"Estilo CBUM: aislamiento puro, enfoque en la contracción." },
  { id:"g3", nombre:"Hip thrust a una pierna (casa)", grupo:"gluteos", location:"casa", equipo:"Peso corporal",
    body:{ecto:2, meso:3, endo:3}, series:"3x15 c/pierna", cbum:false,
    nota:"Sustituto casero del hip thrust con barra." },
  { id:"g4", nombre:"Puente de glúteo con banda", grupo:"gluteos", location:"casa", equipo:"Banda elástica",
    body:{ecto:2, meso:3, endo:3}, series:"4x15-20", cbum:false,
    nota:"Fácil de progresar en casa con bandas de resistencia." },

  // ============ ABDOMEN ============
  { id:"a1", nombre:"Plancha (plank)", grupo:"abdomen", location:"casa", equipo:"Peso corporal",
    body:{ecto:2, meso:2, endo:3}, series:"3x40-60 seg", cbum:false,
    nota:"Base de estabilidad de core para cualquier biotipo." },
  { id:"a2", nombre:"Elevación de piernas colgado", grupo:"abdomen", location:"gym", equipo:"Barra fija",
    body:{ecto:2, meso:3, endo:2}, series:"4x12-15", cbum:true,
    nota:"Estilo CBUM: control total en la bajada para marcar el abdomen bajo." },
  { id:"a3", nombre:"Rueda abdominal (ab wheel)", grupo:"abdomen", location:"ambos", equipo:"Rueda abdominal",
    body:{ecto:2, meso:3, endo:2}, series:"3x10-12", cbum:false,
    nota:"Exigente, trabaja todo el core en un solo movimiento." },
  { id:"a4", nombre:"Crunch en polea alta", grupo:"abdomen", location:"gym", equipo:"Polea",
    body:{ecto:2, meso:2, endo:3}, series:"3x15-20", cbum:true,
    nota:"Estilo CBUM: permite sobrecarga progresiva del abdomen." },
  { id:"a5", nombre:"Bicicleta (crunch cruzado)", grupo:"abdomen", location:"casa", equipo:"Peso corporal",
    body:{ecto:2, meso:2, endo:3}, series:"3x20", cbum:false,
    nota:"Trabaja oblicuos y recto abdominal en casa." },

  // ============ PANTORRILLAS ============
  { id:"c1", nombre:"Elevación de talones de pie", grupo:"pantorrillas", location:"gym", equipo:"Máquina o mancuernas",
    body:{ecto:2, meso:3, endo:2}, series:"4x15-20", cbum:true,
    nota:"Estilo CBUM: pausa de 1-2 seg arriba y estiramiento completo abajo." },
  { id:"c2", nombre:"Elevación de talones en escalón (casa)", grupo:"pantorrillas", location:"casa", equipo:"Escalón",
    body:{ecto:2, meso:3, endo:2}, series:"4x20", cbum:false,
    nota:"Sustituto casero, usar mochila con peso para sobrecargar." },
];

// Descripciones de biotipos usadas en el onboarding
const BODY_TYPES = {
  ectomorfo: {
    nombre: "Ectomorfo",
    resumen: "Complexión delgada, metabolismo rápido, le cuesta ganar masa.",
    enfoque: "Prioriza básicos multiarticulares, pocas series pesadas, más descanso entre series (90-120s) y menos volumen de aislamiento para no sobre-fatigar. Objetivo principal: ganar masa muscular total.",
    color: "#6FA8DC"
  },
  mesomorfo: {
    nombre: "Mesomorfo",
    resumen: "Complexión atlética, responde bien tanto a fuerza como a estética.",
    enfoque: "Buen balance entre básicos pesados y aislamiento estético. Puede manejar mayor volumen total y frecuencia. Objetivo principal: maximizar forma y simetría.",
    color: "#E06C75"
  },
  endomorfo: {
    nombre: "Endomorfo",
    resumen: "Complexión más robusta, metabolismo lento, gana músculo y grasa con facilidad.",
    enfoque: "Más volumen, descansos cortos (45-60s), circuitos y ejercicios que también eleven el gasto calórico. Objetivo principal: definición y control de composición corporal.",
    color: "#D9A441"
  }
};

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

const MUSCLE_ICON = {
  pecho:"press_horizontal", espalda:"pull_vertical", hombros:"press_vertical", brazos:"curl",
  piernas:"squat", gluteos:"hip_thrust", abdomen:"plank", pantorrillas:"calf_raise"
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
      <button class="pose-badge" data-pose-id="${ex.id}" aria-label="Ver ilustración del ejercicio">${getPoseSVG(ex.id)}</button>
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

function attachPoseHandlers(container){
  container.querySelectorAll(".pose-badge").forEach(btn => {
    btn.addEventListener("click", () => {
      const exId = btn.dataset.poseId;
      const ex = EXERCISES.find(e => e.id === exId);
      if(!ex) return;
      openModal(`
        <div class="pose-modal-illustration">${getPoseSVG(ex.id)}</div>
        <h3 class="step-title" style="margin-bottom:4px; text-align:center;">${ex.nombre}</h3>
        <p class="plan-summary" style="text-align:center; margin-bottom:14px;">${ex.nota}</p>
        <div class="pose-modal-meta">
          <span class="tag">${ex.series}</span>
          <span class="tag">${ex.equipo}</span>
          ${ex.cbum ? '<span class="tag cbum">ESTILO CBUM</span>' : ""}
        </div>`);
    });
  });
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
    block.innerHTML = `<div class="day-heading"><span class="chip-icon heading-icon">${POSES[MUSCLE_ICON[grupo]] || ""}</span>${MUSCLE_LABELS[grupo]}</div>` +
      exs.map(exerciseCardHTML).join("");
    container.appendChild(block);
  });

  attachCheckHandlers(container);
  attachPoseHandlers(container);
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
    chip.innerHTML = `<span class="chip-icon">${POSES[MUSCLE_ICON[key]] || ""}</span><span>${MUSCLE_LABELS[key]}</span>`;
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
  container.innerHTML = `<div class="day-block"><div class="day-heading"><span class="chip-icon heading-icon">${POSES[MUSCLE_ICON[state.activeMuscle]] || ""}</span>${MUSCLE_LABELS[state.activeMuscle]}</div>` +
    exs.map(exerciseCardHTML).join("") + `</div>`;
  attachCheckHandlers(container);
  attachPoseHandlers(container);
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
