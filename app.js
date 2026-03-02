const PARTIES = ['PSOE', 'Sumar', 'PP', 'Vox'];
const COLORS  = { PSOE: '#E4003A', Sumar: '#E05A00', PP: '#0056A2', Vox: '#63BE21' };

// Logotipos oficiales en alta calidad (PNG con fondo transparente)
const LOGOS = { 
  PSOE: '<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Logo_PSOE.svg/512px-Logo_PSOE.svg.png" alt="PSOE">', 
  Sumar: '<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Logo_Sumar.svg/512px-Logo_Sumar.svg.png" alt="Sumar">', 
  PP: '<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Logo_del_Partido_Popular_%282019%29.svg/512px-Logo_del_Partido_Popular_%282019%29.svg.png" alt="PP">', 
  Vox: '<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Vox_logo.svg/512px-Vox_logo.svg.png" alt="Vox">' 
};

// stance: 1=apoya la propuesta, -1=se opone, 0=neutral
// orden columnas: [PSOE, Sumar, PP, Vox]
const QUESTIONS = [
  { topic: "Sanidad",         text: "El Estado debe reforzar la sanidad pública y reducir la gestión privada concertada",                    stance: [ 1,  1,  0, -1] },
  { topic: "Derechos",        text: "La ley del aborto vigente debe mantenerse sin restricciones adicionales",                                stance: [ 1,  1, -1, -1] },
  { topic: "Vivienda",        text: "Los precios del alquiler deben limitarse legalmente para garantizar el acceso a la vivienda",            stance: [ 1,  1, -1, -1] },
  { topic: "Fiscalidad",      text: "El impuesto a las grandes fortunas debe convertirse en permanente",                                      stance: [ 1,  1, -1, -1] },
  { topic: "Laboral",         text: "La reforma laboral aprobada en 2021 fue positiva para los derechos de los trabajadores",                stance: [ 1,  1, -1, -1] },
  { topic: "Laboral",         text: "La jornada laboral máxima debe reducirse a 37,5 horas semanales",                                       stance: [ 1,  1, -1, -1] },
  { topic: "Inmigración",     text: "España debe regularizar a los inmigrantes irregulares que llevan años viviendo y trabajando en el país", stance: [ 1,  1,  0, -1] },
  { topic: "Fiscalidad",      text: "Banca y grandes energéticas deben pagar un impuesto especial por sus beneficios extraordinarios",       stance: [ 1,  1, -1, -1] },
  { topic: "Medioambiente",   text: "España debe acelerar la transición a energías renovables aunque suponga costes económicos a corto plazo",stance: [ 1,  1,  0, -1] },
  { topic: "Educación",       text: "La educación afectivo-sexual debe ser obligatoria en todos los colegios españoles",                     stance: [ 1,  1, -1, -1] },
  { topic: "Familia",         text: "El Estado debe garantizar plazas de guardería pública gratuita para todos los niños de 0 a 3 años",    stance: [ 1,  1,  0, -1] },
  { topic: "Memoria",         text: "La Ley de Memoria Democrática aprobada en 2022 fue necesaria y positiva para España",                  stance: [ 1,  1, -1, -1] },
  { topic: "Laboral",         text: "El Salario Mínimo Interprofesional debe seguir subiendo por encima del IPC cada año",                  stance: [ 1,  1,  0, -1] },
  { topic: "Territorio",      text: "Los indultos a los líderes del procés catalán concedidos en 2021 fueron una decisión correcta",        stance: [ 1,  1, -1, -1] },
  { topic: "Infraestructuras",text: "España debe invertir más en transporte público ferroviario y colectivo",                               stance: [ 1,  1,  0,  0] },
  { topic: "Educación",       text: "La escuela pública debe ser completamente laica, sin asignatura de religión en horario escolar",       stance: [ 1,  1, -1, -1] },
  { topic: "Cultura",         text: "El Estado debe aumentar las subvenciones al cine, la música y las artes escénicas nacionales",         stance: [ 1,  1,  0, -1] },
  { topic: "Fiscalidad",      text: "El sistema fiscal debe reformarse para que quienes más ganan paguen proporcionalmente más",             stance: [ 1,  1, -1, -1] },
  { topic: "Sanidad",         text: "La gestión del Gobierno central durante la pandemia de COVID-19 fue adecuada",                         stance: [ 1,  0, -1, -1] },
  { topic: "Derechos",        text: "Debe aprobarse una ley que regule y sancione el discurso del odio en redes sociales",                  stance: [ 1,  1,  0, -1] },
  { topic: "Territorio",      text: "Cataluña debería poder celebrar un referéndum legal de autodeterminación",                             stance: [ 0,  1, -1, -1] },
  { topic: "Sanidad",         text: "La sanidad pública debe reducir los conciertos económicos con hospitales y clínicas privadas",         stance: [ 1,  1, -1, -1] },
  { topic: "Pensiones",       text: "Los planes de pensiones privados deben complementar el sistema público de pensiones",                  stance: [ 0, -1,  1,  1] },
  { topic: "Vivienda",        text: "El Estado debe intervenir activamente en el mercado inmobiliario para bajar el precio de la vivienda", stance: [ 1,  1, -1, -1] },
  { topic: "Igualdad",        text: "La ley del consentimiento sexual es una medida positiva para proteger a víctimas de agresión",       stance: [ 1,  1, -1, -1] },
  { topic: "Educación",       text: "La ley educativa vigente (LOMLOE) debe mantenerse y consolidarse en el sistema educativo",             stance: [ 1,  1, -1, -1] },
  { topic: "Defensa",         text: "España debe aumentar el gasto en defensa hasta alcanzar el 5% del PIB exigido por la OTAN y los EE.UU",           stance: [ 0, -1,  1,  1] },
  { topic: "Inmigración",     text: "España debe acoger más refugiados y solicitantes de asilo procedentes de zonas de conflicto",         stance: [ 1,  1,  0, -1] },
  { topic: "Pensiones",       text: "La reforma de las pensiones de 2023 que amplía los años de cotización fue beneficiosa",               stance: [ 1,  0, -1, -1] },
  { topic: "Justicia",        text: "El Consejo General del Poder Judicial debe reformarse para garantizar mayor independencia política",   stance: [ 0,  1,  1,  0] },
];

// Scoring por respuesta
function getScore(stance, answer) {
  if (answer === 2) return 1;
  if (answer === 0) return stance ===  1 ? 3 : stance === -1 ? 0 : 1;
  if (answer === 1) return stance === -1 ? 3 : stance ===  1 ? 0 : 1;
  return 1;
}

let cur = 0;
let ans = new Array(30).fill(null);

function startQuiz() {
  document.getElementById('hero-section').classList.add('hidden');
  document.getElementById('step-quiz').classList.remove('hidden');
  render();
}

function render() {
  const q = QUESTIONS[cur];
  document.getElementById('pfill').style.width  = `${(cur / 30) * 100}%`;
  document.getElementById('plabel').textContent  = `${cur + 1} / 30`;
  document.getElementById('tchip').textContent   = q.topic;
  document.getElementById('qtext').textContent   = q.text;

  ['btn-agree', 'btn-against', 'btn-abstain'].forEach((id, i) => {
    document.getElementById(id).classList.toggle('selected', ans[cur] === i);
  });

  document.getElementById('bnext').disabled       = ans[cur] === null;
  document.getElementById('bprev').style.display  = cur === 0 ? 'none' : '';
  document.getElementById('bnext').textContent    = cur === 29 ? 'Ver resultados →' : 'Siguiente →';
}

function pick(i) {
  ans[cur] = i;
  render();
}

document.getElementById('bnext').addEventListener('click', () => {
  if (cur < 29) { cur++; render(); }
  else showResults();
});

document.getElementById('bprev').addEventListener('click', () => {
  if (cur > 0) { cur--; render(); }
});

function showResults() {
  document.getElementById('step-quiz').classList.add('hidden');
  document.getElementById('step-results').classList.remove('hidden');

  const totals = { PSOE: 0, Sumar: 0, PP: 0, Vox: 0 };
  const max = 30 * 3;

  ans.forEach((a, qi) => {
    if (a === null) return;
    QUESTIONS[qi].stance.forEach((stance, pi) => {
      totals[PARTIES[pi]] += getScore(stance, a);
    });
  });

  const sorted = PARTIES.slice().sort((a, b) => totals[b] - totals[a]);
  const rl = document.getElementById('rlist');
  rl.innerHTML = '';

  sorted.forEach((p, idx) => {
    const pct = Math.round((totals[p] / max) * 100);
    const div = document.createElement('div');
    div.className = 'result-row' + (idx === 0 ? ' top' : '');
    if (idx === 0) div.style.borderColor = COLORS[p];
    div.innerHTML = `
      <div class="result-logo-big">${LOGOS[p]}</div>
      <div class="result-info">
        <div class="result-name-row">
          <span class="r-name" style="color:${COLORS[p]}">${p}</span>
          ${idx === 0 ? '<span class="top-badge">⭐ Más afín</span>' : ''}
        </div>
        <div class="result-bar-bg">
          <div class="result-bar-fill" id="bar-${p}" style="width:0%;background:${COLORS[p]}"></div>
        </div>
      </div>
      <div class="result-pct" style="color:${COLORS[p]}">${pct}%</div>`;
    rl.appendChild(div);
    setTimeout(() => {
      document.getElementById('bar-' + p).style.width = pct + '%';
    }, 100 + idx * 120);
  });
}

function restart() {
  cur = 0;
  ans = new Array(30).fill(null);
  document.getElementById('step-results').classList.add('hidden');
  document.getElementById('step-quiz').classList.add('hidden');
  document.getElementById('hero-section').classList.remove('hidden');
}