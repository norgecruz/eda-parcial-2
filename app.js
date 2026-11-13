const key = "eda-parcial-2-v1";
const levels = ["Inicial","Intermedio","Avanzado"];
const root = document.querySelector("#screen");
const status = document.querySelector("#status");
const blank = () => ({view:"practica", topic:-1, level:0, q:0, drafts:{}, checked:{}, history:[], mock:null, paused:{}, codeQ:12, codeTopic:-1, codeDrafts:{}, codeChecked:{}});
function loadState() {
  try { return {...blank(), ...JSON.parse(localStorage.getItem(key))}; }
  catch { return blank(); }
}
let state = loadState();
function save() {
  try {
    localStorage.setItem(key, JSON.stringify(state));
    status.textContent = "Avance guardado en este navegador.";
  } catch {
    status.textContent = "El navegador bloqueó el guardado. El avance dura mientras esta página siga abierta.";
  }
}
const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const codeQuestion = q => Array.isArray(q.key) && typeof q.key[0] === "string";
const fmt = n => n.toLocaleString("es-UY",{maximumFractionDigits:1});
const count = () => new Set(state.history.map(r => r.id)).size;
const isMock = () => state.view === "simulacro";
const isCode = () => state.view === "codigo";
const selected = () => isMock() ? state.mock.ids[state.mock.done ? state.mock.review : state.mock.pos] : isCode() ? state.codeQ : state.q;
const draftStore = () => isCode() ? state.codeDrafts : state.drafts;
const resultStore = () => isCode() ? state.codeChecked : state.checked;
const codeList = () => questions.map((q,id)=>({...q,id})).filter(q=>codeQuestion(q) && (state.codeTopic < 0 || q.topic === state.codeTopic));
const eligible = () => questions.map((q,id) => ({...q,id})).filter(q => (state.topic < 0 || q.topic === state.topic) && (!state.level || q.level === state.level));
function move(view) {
  state.view = view;
  save();
  render();
}
function draw(data) {
  if (data.nodes) {
    const height = Math.max(...data.nodes.map(n=>n[2])) + 28;
    const edges = [], labels = [];
    data.nodes.forEach(([value,x,y,parent]) => {
      if (parent !== undefined) {
        const [name,px,py] = data.nodes[parent];
        edges.push(`<line x1="${px}" y1="${py}" x2="${x}" y2="${y}"/>`);
        labels.push(`${name} → ${value}`);
      } else labels.push(`Raíz ${value}`);
    });
    return `<div class="diagram"><svg viewBox="0 0 400 ${height}" role="img" aria-label="${escapeHtml(labels.join(". "))}">${edges.join("")}${data.nodes.map(([value,x,y])=>`<g><rect x="${x-27}" y="${y-15}" width="54" height="30" rx="9"/><text x="${x}" y="${y}">${escapeHtml(value)}</text></g>`).join("")}</svg></div><p class="legend">${escapeHtml(data.label)}</p>`;
  }
  if (data.line) {
    const stack = data.kind === "Pila";
    const separator = stack ? "" : data.kind.startsWith("Lista doble") ? "↔" : "→";
    const values = data.line.map(x => `<b>${escapeHtml(x)}</b>`).join(`<span aria-hidden="true">${separator}</span>`);
    return `<div class="diagram"><div class="cells ${stack ? "stack" : ""}">${values || "Vacía"}</div></div><p class="legend">${escapeHtml(data.kind)}${stack ? " · cima arriba" : data.kind === "Cola" ? " · frente a la izquierda" : ""}</p>`;
  }
  const coords = [[200,35],[103,105],[297,105],[52,176],[154,176],[246,176],[348,176]];
  const edges = [], nodes = [], descriptions = [];
  data.values.forEach((value,i) => {
    if (value == null) return;
    const [x,y] = coords[i];
    if (i) {
      const parent = Math.floor((i - 1) / 2);
      const [px,py] = coords[parent];
      edges.push(`<line x1="${px}" y1="${py}" x2="${x}" y2="${y}"/>`);
      descriptions.push(`${value}, hijo ${i % 2 ? "izquierdo" : "derecho"} de ${data.values[parent]}`);
    } else descriptions.push(`Raíz ${value}`);
    nodes.push(`<g><rect x="${x-35}" y="${y-17}" width="70" height="34" rx="9" class="${data.highlights.includes(i) ? "lit" : ""}"/><text x="${x}" y="${y}">${escapeHtml(value)}</text></g>`);
  });
  return `<div class="diagram"><svg viewBox="0 0 400 ${data.values.length > 3 ? 210 : 145}" role="img" aria-label="${escapeHtml(descriptions.join(". "))}">${edges.join("")}${nodes.join("")}</svg></div><p class="legend">ABB · izquierda &lt; raíz &lt; derecha</p>`;
}
function hero(title, subtitle) {
  return `<div class="hero"><div><p class="eyebrow">Preparación · Segundo parcial</p><h1>${title}</h1><p class="muted">${subtitle}</p></div><div class="progress"><div><span>Progreso</span><b>${count()} / ${questions.length}</b></div><progress aria-label="Ejercicios corregidos" value="${count()}" max="${questions.length}"></progress><small>Ejercicios con nota</small></div></div>`;
}
function filter(label, field, items, value) {
  return `<label>${label}<select data-filter="${field}">${items.map(([v,t]) => `<option value="${v}" ${v === value ? "selected" : ""}>${t}</option>`).join("")}</select></label>`;
}
function practice() {
  const list = eligible();
  const filters = filter("Tema","topic",[[-1,"Todos"],...topics.map((t,i)=>[i,t])],state.topic)
    + filter("Nivel","level",[[0,"Todos"],...levels.map((t,i)=>[i+1,t])],state.level);
  return hero("Práctica guiada","Una pregunta por vez. Resolvé, corregí y seguí.") +
    `<div class="filters">${filters}</div>` +
    (list.length ? questionView(state.q, list.findIndex(q=>q.id===state.q) + 1, list.length) : '<p class="panel">No hay ejercicios para esa combinación. Cambiá el tema o el nivel.</p>');
}
function codeView() {
  const list = codeList();
  const index = list.findIndex(q=>q.id===state.codeQ);
  return hero("Código desde cero","Leé la consigna, escribí tu solución y probala a mano antes de entregar.") +
    `<div class="filters">${filter("Tema","codeTopic",[[-1,"Todos"],...topics.map((t,i)=>[i,t]).filter(([i])=>questions.some(q=>q.topic===i&&codeQuestion(q)))],state.codeTopic)}${filter("Ejercicio","codeQ",list.map(q=>[q.id,q.title]),state.codeQ)}</div>` +
    questionView(state.codeQ,index+1,list.length);
}
function materialView() {
  return hero("Material de clase","Consultá los apuntes y las consignas originales.") + materials.map(([group,files])=>`<details class="panel material" ${group === "Enunciados y apuntes" ? "open" : ""}><summary>${escapeHtml(group)} · ${files.length}</summary><ul>${files.map(([file,title])=>`<li><a href="material/${encodeURIComponent(file)}" target="_blank" rel="noopener">${escapeHtml(title)}</a> <small>${file.endsWith(".pdf") ? "PDF" : "Imagen"}</small></li>`).join("")}</ul></details>`).join("");
}
function mockView() {
  const m = state.mock;
  const top = hero("Simulacro","Seis preguntas mixtas · 60 puntos.");
  if (!m) return top + '<section class="panel compact"><h2>Practicá en condiciones de parcial</h2><p>Respondé una pregunta por vez. La corrección se abre al entregar la última. Podés pausar y volver a tu respuesta.</p><button class="primary" data-action="start">Empezar simulacro</button></section>';
  if (!m.done) return top + '<p class="sim-note">Las soluciones se muestran al terminar.</p>' + questionView(selected(),m.pos+1,m.ids.length);
  const graded = m.ids.filter(id => m.results[id]?.score != null).length;
  const total = m.ids.reduce((sum,id)=>sum+(m.results[id]?.score ?? 0),0);
  return top + `<section class="panel mock-summary"><h2>${graded === m.ids.length ? fmt(total)+" / 60 puntos" : fmt(total)+" puntos · "+graded+" de 6 respuestas corregidas"}</h2><p>Revisá cada respuesta y completá las rúbricas de C++ para cerrar la nota.</p><div class="review-list">${m.ids.map((id,i)=>`<button data-review="${i}" aria-pressed="${i===m.review}">Pregunta ${i+1} · ${m.results[id]?.score == null ? "Pendiente" : fmt(m.results[id].score)+"/10"}</button>`).join("")}</div><button data-action="restart">Nuevo simulacro</button></section>` + questionView(selected(),m.review+1,m.ids.length);
}
function currentData(id) {
  if (isMock()) return {answer:state.mock.answers[id] || "", result:state.mock.results[id]};
  return {answer:draftStore()[id] || "", result:resultStore()[id]};
}
function questionView(id, position, total) {
  const q = questions[id];
  const {answer,result} = currentData(id);
  const reviewing = isMock() && state.mock.done;
  const code = codeQuestion(q);
  const disabled = result || reviewing ? "disabled" : "";
  const input = q.options
    ? `<div class="choices" aria-label="Opciones de respuesta">${q.options.map((option,i)=>`<button data-choice="${i}" aria-pressed="${option===answer}" ${disabled}>${escapeHtml(option)}</button>`).join("")}</div>`
    : code
      ? `<label for="answer">Tu código C++</label><textarea id="answer" spellcheck="false" placeholder="Escribí tu solución…" ${disabled}>${escapeHtml(answer)}</textarea>`
      : `<label for="answer">Tu respuesta</label><input id="answer" type="text" autocomplete="off" placeholder="Separá los números con espacios o comas" value="${escapeHtml(answer)}" ${disabled}>`;
  const feedback = result || reviewing ? correction(q,result) : "";
  const tests = q.tests || [["Entrada de la figura","Anotá el resultado esperado y recorré el código a mano."],["Caso límite","Probá vacío, un solo elemento o el valor de frontera, según la consigna."]];
  const workbench = isCode() && !result ? `<details class="workbench"><summary>Casos de prueba manual</summary><ul>${tests.map(([input,expected])=>`<li><strong>${escapeHtml(input)}</strong><br>${escapeHtml(expected)}</li>`).join("")}</ul></details><details class="workbench"><summary>Ver pista</summary><p>${escapeHtml(q.lesson)}</p></details>` : "";
  const tools = isCode() && !result ? '<div class="editor-tools" aria-label="Ayuda para escribir código"><button data-insert="    ">Sangría</button><button data-insert="{"> { </button><button data-insert="}"> } </button><button data-insert=";"> ; </button><button data-insert="-&gt;"> → </button><button data-insert="NULL">NULL</button></div>' : "";
  const controls = isMock()
    ? reviewing ? "" : `<button class="primary" data-action="submit">${position === total ? "Entregar simulacro" : "Guardar y seguir"}</button>`
    : result ? '<button class="primary" data-action="next">Siguiente ejercicio →</button><button data-action="retry">Reintentar</button>'
    : '<button class="primary" data-action="submit">Entregar y corregir →</button>';
  return `<div class="grid"><section class="panel"><div class="meta"><span>${position} / ${total} · ${topics[q.topic]}</span><span class="badge">${levels[q.level-1]}</span></div><h2 tabindex="-1" id="exercise-title">${q.title}</h2>${q.source ? `<p class="legend">${escapeHtml(q.source)}</p>` : ""}${isMock() || isCode() ? "" : `<p class="lesson">${q.lesson}</p>`}<p class="prompt">${q.prompt}</p>${input}${tools}${workbench}<div class="actions">${controls}${reviewing ? "" : '<button class="plain" data-action="pause">Pausar</button>'}</div><div id="validation" role="alert"></div>${feedback}</section><section class="panel"><p class="eyebrow">Estructura inicial</p>${draw(q.visual)}${result || reviewing ? `<div class="trace"><p class="eyebrow">Dibujo de la solución</p>${q.title==="stockear con poda" ? '<p class="legend">Ejemplo con cant = 2 e intervalo [30, 50].</p>' : ""}${draw(q.after)}</div>` : ""}</section></div>`;
}
function correction(q,result) {
  const rubric = codeQuestion(q) && result?.score == null ? `<p>Compará tu código con la solución y marcá los criterios cumplidos. La nota de C++ es una autoevaluación guiada.</p><div class="rubric">${q.key.map(c=>`<label><input type="checkbox"> ${c}</label>`).join("")}</div><button data-action="grade">Guardar nota</button>` : "";
  const score = result?.score == null ? "Corrección con rúbrica" : `${fmt(result.score)} / 10`;
  return `<section class="feedback" id="feedback" tabindex="-1"><p class="score ${result?.score < 10 ? "wrong" : ""}">${score}</p><h3>Respuesta ideal</h3>${codeQuestion(q) ? `<pre>${escapeHtml(q.ideal)}</pre>` : `<p>${escapeHtml(q.ideal)}</p>`}${rubric}</section>`;
}
function errorsView() {
  const errors = state.history.filter(r=>r.score<10).slice().reverse();
  return hero("Registro de errores","Revisá qué falló y volvé a intentar el ejercicio.") + '<div class="records">' + (errors.length ? errors.map(r=>`<article class="panel record"><div class="meta"><span>${topics[questions[r.id].topic]} · ${r.mode}</span><strong class="wrong">${fmt(r.score)} / 10</strong></div><h2>${questions[r.id].title}</h2><p>Tu respuesta</p><pre>${escapeHtml(r.answer)}</pre>${r.missed?.length ? `<p>${escapeHtml(r.missed.join(" · "))}</p>` : ""}<button data-retry="${r.id}">Volver a practicar</button></article>`).join("") : '<p class="panel">Todavía no hay errores registrados.</p>') + '</div>';
}
function render() {
  document.querySelectorAll("nav button").forEach(b => {
    if (b.dataset.view === state.view) b.setAttribute("aria-current","page");
    else b.removeAttribute("aria-current");
  });
  document.querySelector("#errors").textContent = state.history.filter(r=>r.score<10).length || "";
  if (state.paused[state.view]) {
    root.innerHTML = hero("Sesión en pausa","Tu respuesta y el ejercicio actual quedaron guardados.") + '<button class="primary" data-action="resume">Continuar donde quedé →</button>';
    return;
  }
  root.innerHTML = state.view === "errores" ? errorsView() : state.view === "material" ? materialView() : isMock() ? mockView() : isCode() ? codeView() : practice();
}
function setAnswer(value) {
  const id = selected();
  if (isMock()) state.mock.answers[id] = value;
  else draftStore()[id] = value;
  save();
}
function autoScore(q,answer) {
  if (!Array.isArray(q.key)) return answer === q.key ? 10 : 0;
  const valid = /^\s*-?\d+(?:[\s,;→]+-?\d+)*\s*$/.test(answer);
  const actual = valid ? answer.match(/-?\d+/g).map(Number) : [];
  const denominator = Math.max(actual.length,q.key.length);
  return Math.round(100*q.key.filter((value,i)=>value===actual[i]).length/denominator)/10;
}
function record(id,score,answer,missed=[]) {
  state.history.push({id,score,answer,missed,mode:isMock() ? "Simulacro" : isCode() ? "Código" : "Práctica"});
}
function submit() {
  const id = selected(), q = questions[id], {answer,result} = currentData(id);
  if (result || (isMock() && state.mock.done)) return;
  if (!answer.trim()) {
    document.querySelector("#validation").textContent = "Escribí o elegí una respuesta para seguir.";
    return;
  }
  if (isMock()) {
    const m = state.mock;
    if (m.pos < m.ids.length - 1) m.pos++;
    else {
      m.done = true;
      for (const i of m.ids) {
        const item = questions[i];
        if (!codeQuestion(item)) {
          const score = autoScore(item,m.answers[i]);
          m.results[i] = {score};
          record(i,score,m.answers[i]);
        }
      }
    }
  } else {
    const score = codeQuestion(q) ? null : autoScore(q,answer);
    resultStore()[id] = {score};
    if (score != null) record(id,score,answer);
  }
  save();
  render();
  (document.querySelector("#feedback") || document.querySelector("#exercise-title"))?.focus();
}
function grade() {
  const id = selected(), q = questions[id], {answer,result} = currentData(id);
  if (!codeQuestion(q) || result?.score != null) return;
  const checks = [...document.querySelectorAll(".rubric input")];
  const missed = q.key.filter((_,i)=>!checks[i].checked);
  const score = 10*(checks.length-missed.length)/checks.length;
  if (isMock()) state.mock.results[id] = {score};
  else resultStore()[id] = {score};
  record(id,score,answer,missed);
  save();
  render();
  document.querySelector("#feedback")?.focus();
}
function restart() {
  const round = (state.mock?.round ?? -1) + 1;
  const variants = [[2,3,4,10,12,18],[0,5,8,11,14,17],[1,6,7,9,16,20],[0,5,21,22,25,27]];
  state.mock = {round,ids:variants[round%variants.length],pos:0,review:0,answers:{},results:{},done:false};
}
function resetQuestion(id) {
  delete resultStore()[id];
  delete draftStore()[id];
}
document.addEventListener("click", event => {
  const nav = event.target.closest("[data-view]");
  if (nav) return move(nav.dataset.view);
  if (event.target.closest(".brand")) {
    event.preventDefault();
    return move("practica");
  }
  const button = event.target.closest("button");
  if (!button || button.disabled) return;
  const {action,choice,review,retry,insert} = button.dataset;
  if (insert != null) {
    const editor = root.querySelector("textarea");
    editor.focus();
    editor.setRangeText(insert, editor.selectionStart, editor.selectionEnd, "end");
    setAnswer(editor.value);
    return;
  }
  if (choice != null) {
    setAnswer(questions[selected()].options[Number(choice)]);
    root.querySelectorAll("[data-choice]").forEach(b=>b.setAttribute("aria-pressed",String(b===button)));
    return;
  }
  if (action === "submit") return submit();
  if (action === "grade") return grade();
  if (retry != null) {
    const id = Number(retry);
    if (codeQuestion(questions[id])) {
      state.codeQ = id;
      state.codeTopic = -1;
      delete state.paused.codigo;
      state.view = "codigo";
      resetQuestion(state.codeQ);
      return move("codigo");
    }
    state.q = id;
    state.topic = -1;
    state.level = 0;
    delete state.paused.practica;
    state.view = "practica";
    resetQuestion(state.q);
    return move("practica");
  }
  if (review != null) state.mock.review = Number(review);
  else if (action === "start" || action === "restart") restart();
  else if (action === "pause") state.paused[state.view] = true;
  else if (action === "resume") delete state.paused[state.view];
  else if (action === "retry") resetQuestion(selected());
  else if (action === "next") {
    if (resultStore()[selected()]?.score == null) {
      document.querySelector("#validation").textContent = "Completá la rúbrica para guardar tu nota.";
      return;
    }
    const list = isCode() ? codeList() : eligible();
    const i = list.findIndex(q=>q.id===selected());
    state[isCode() ? "codeQ" : "q"] = list[(i+1)%list.length].id;
  } else return;
  save();
  render();
  document.querySelector("#exercise-title")?.focus();
});
root.addEventListener("input", event => {
  if (event.target.id === "answer") setAnswer(event.target.value);
});
root.addEventListener("keydown", event => {
  if (event.key === "Enter" && event.target.matches("input#answer")) submit();
  const editor = event.target;
  if (event.key === "Enter" && editor.matches("textarea#answer") && !event.isComposing) {
    event.preventDefault();
    const before = editor.value.slice(0,editor.selectionStart).split("\n").at(-1);
    const indent = before.match(/^ */)[0] + (before.trimEnd().endsWith("{") ? "    " : "");
    editor.setRangeText("\n"+indent,editor.selectionStart,editor.selectionEnd,"end");
    setAnswer(editor.value);
  }
});
root.addEventListener("change", event => {
  const field = event.target.dataset.filter;
  if (!field) return;
  state[field] = Number(event.target.value);
  const list = isCode() ? codeList() : eligible();
  const position = isCode() ? "codeQ" : "q";
  if (list.length && !list.some(q=>q.id===state[position])) state[position] = list[0].id;
  save();
  render();
  root.querySelector(`[data-filter="${field}"]`)?.focus();
});
render();

const offlineButton = document.querySelector("#offline-enable");
const offlineStatus = document.querySelector("#offline-status");
async function prepareOffline() {
  offlineButton.disabled = true;
  offlineStatus.textContent = "Preparando los ejercicios para practicar sin conexión…";
  let timeout;
  try {
    await navigator.serviceWorker.register("./sw.js");
    const ready = await Promise.race([
      navigator.serviceWorker.ready,
      new Promise((_,reject)=>{ timeout = setTimeout(()=>reject(new Error("Instalación pendiente")),12000); })
    ]);
    if (!ready.active) throw new Error("Modo sin conexión pendiente");
    offlineStatus.textContent = "Listo para el bus. Los ejercicios funcionan sin conexión. Los PDFs y las fotos se consultan con conexión.";
    offlineButton.hidden = true;
  } catch {
    offlineStatus.textContent = "No se pudo preparar el modo sin conexión. Volvé a intentarlo con el sitio abierto y con internet.";
    offlineButton.hidden = false;
  } finally {
    clearTimeout(timeout);
    offlineButton.disabled = false;
  }
}
if ("serviceWorker" in navigator && window.isSecureContext) {
  offlineButton.hidden = false;
  offlineStatus.textContent = "Activá la práctica sin conexión antes de salir.";
  offlineButton.addEventListener("click",prepareOffline);
  navigator.serviceWorker.getRegistration().then(registration=>{
    if (registration?.active) prepareOffline();
  }).catch(()=>{});
} else {
  offlineStatus.textContent = "Este navegador no permite preparar el modo sin conexión.";
}
