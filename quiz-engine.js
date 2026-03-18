// quiz-engine.js — v3

let cur = 0, ans = [];

/* ── COLORES POR TEMA ── */
const TOPIC_COLORS = {
  'Sanidad':'#E53935','Economía':'#1E88E5','Vivienda':'#8E24AA',
  'Educación':'#43A047','Inmigración':'#FB8C00','Medio Ambiente':'#00ACC1',
  'Defensa':'#546E7A','Laboral':'#F4511E','Fiscalidad':'#3949AB',
  'Impuestos':'#3949AB','Justicia':'#6D4C41','Energía':'#FFB300',
  'Familia':'#E91E63','Derechos':'#AB47BC','Pensiones':'#5C6BC0',
  'Estado':'#78909C','Memoria':'#795548','Territorio':'#26A69A',
  'Animales':'#66BB6A','Empleo':'#F4511E','Transporte':'#29B6F6',
  'Cultura':'#EC407A','Rural':'#8D6E63','Política':'#78909C',
  'Exterior':'#42A5F5','Agua':'#26C6DA','Seguridad':'#EF5350',
  'Europa':'#1565C0','Despoblación':'#8D6E63','Caza':'#558B2F',
  'Descentralización':'#7B1FA2','Infraestructuras':'#0277BD',
  'Agricultura':'#2E7D32','Juventud':'#E91E63','Industria':'#37474F',
  'Patrimonio':'#A1887F','Transparencia':'#546E7A',
};
const getTopicColor = t => TOPIC_COLORS[t] || '#8A5A44';

/* ── SELECCIÓN ALEATORIA ── */
const QUESTIONS_PER_SESSION = 20;
function pickRandomQuestions(questions, n) {
  const pool = [...questions];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, n);
}
let sessionQuestions = [];

/* ── INICIO ── */
function startQuiz() {
  sessionQuestions = pickRandomQuestions(QUIZ_DATA.questions, QUESTIONS_PER_SESSION);
  ans = new Array(sessionQuestions.length).fill(null);
  cur = 0;
  document.getElementById('hero-section').classList.add('hidden');
  const quizEl = document.getElementById('step-quiz');
  quizEl.classList.remove('hidden');
  quizEl.style.opacity = '0';
  render();
  requestAnimationFrame(() => {
    quizEl.style.transition = 'opacity 0.3s ease';
    quizEl.style.opacity = '1';
  });
  trackEvent('quiz_start', { test: typeof QUIZ_DATA !== 'undefined' ? (QUIZ_DATA.partyNames ? Object.keys(QUIZ_DATA.partyNames).length + '_partidos' : 'test') : 'test' });
}

/* ── TRANSICIÓN ENTRE PREGUNTAS ── */
function transitionTo(newCur) {
  const card = document.querySelector('#step-quiz .card');
  if (!card) { cur = newCur; render(); return; }
  card.style.transition = 'opacity 0.18s ease, transform 0.18s ease';
  card.style.opacity    = '0';
  card.style.transform  = 'translateY(8px)';
  setTimeout(() => {
    cur = newCur;
    render();
    card.style.opacity   = '1';
    card.style.transform = 'translateY(0)';
  }, 180);
}

/* ── RENDER ── */
function render() {
  const q     = sessionQuestions[cur];
  const total = sessionQuestions.length;
  const color = getTopicColor(q.topic);

  // Progreso
  const pfill = document.getElementById('pfill');
  pfill.style.width           = `${((cur + 1) / total) * 100}%`;
  pfill.style.backgroundColor = color;
  document.getElementById('plabel').textContent = `${cur + 1} / ${total}`;

  // Chip de tema
  const chip = document.getElementById('tchip');
  chip.textContent       = q.topic;
  chip.style.background  = color + '1A';
  chip.style.color       = color;
  chip.style.borderColor = color + '40';

  // Texto propuesta
  document.getElementById('qtext').textContent = q.text;

  // Botones de voto
  ['btn-agree','btn-against','btn-abstain'].forEach((id, i) => {
    const btn = document.getElementById(id);
    btn.classList.toggle('selected', ans[cur] === i);
    // Accesibilidad: aria-pressed
    btn.setAttribute('aria-pressed', ans[cur] === i ? 'true' : 'false');
  });

  document.getElementById('bnext').disabled      = ans[cur] === null;
  document.getElementById('bprev').style.display = cur === 0 ? 'none' : '';
  document.getElementById('bnext').textContent   = cur === total - 1 ? 'Ver resultados →' : 'Siguiente →';
}

/* ── SELECCIÓN DE VOTO ── */
function pick(i) {
  ans[cur] = i;
  const ids = ['btn-agree','btn-against','btn-abstain'];
  const btn = document.getElementById(ids[i]);
  btn.classList.remove('bounce');
  void btn.offsetWidth;
  btn.classList.add('bounce');
  render();
}

/* ── NAVEGACIÓN ── */
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('bnext').addEventListener('click', () => {
    if (cur < sessionQuestions.length - 1) transitionTo(cur + 1);
    else showResults();
  });
  document.getElementById('bprev').addEventListener('click', () => {
    if (cur > 0) transitionTo(cur - 1);
  });

  // Navegación por teclado
  document.addEventListener('keydown', (e) => {
    const quizVisible = !document.getElementById('step-quiz').classList.contains('hidden');
    if (!quizVisible) return;
    if (e.key === '1' || e.key === 'a') pick(0);
    else if (e.key === '2' || e.key === 'e') pick(1);
    else if (e.key === '3' || e.key === 's') pick(2);
    else if (e.key === 'Enter' && ans[cur] !== null) {
      if (cur < sessionQuestions.length - 1) transitionTo(cur + 1);
      else showResults();
    } else if (e.key === 'ArrowLeft' && cur > 0) transitionTo(cur - 1);
  });
});

/* ── PUNTUACIÓN ── */
function getScore(stance, answer) {
  if (answer === 2) return 1;
  if (answer === 0) return stance ===  1 ? 3 : stance === -1 ? 0 : 1;
  if (answer === 1) return stance === -1 ? 3 : stance ===  1 ? 0 : 1;
  return 1;
}

/* ── DESGLOSE POR TEMAS ── */
function buildTopicBreakdown(sorted, totals) {
  const { parties, colors, partyNames = {} } = QUIZ_DATA;

  // Agrupar preguntas respondidas por tema
  const topicMap = {};
  sessionQuestions.forEach((q, qi) => {
    if (ans[qi] === null) return;
    if (!topicMap[q.topic]) topicMap[q.topic] = { questions: [], indices: [] };
    topicMap[q.topic].questions.push(q);
    topicMap[q.topic].indices.push(qi);
  });

  const topics = Object.keys(topicMap);
  if (topics.length === 0) return null;

  // Para cada tema, calcular qué partido tiene más afinidad
  const topicResults = topics.map(topic => {
    const topicTotals = {};
    parties.forEach(p => topicTotals[p] = 0);
    topicMap[topic].indices.forEach(qi => {
      sessionQuestions[qi].stance.forEach((stance, pi) => {
        topicTotals[parties[pi]] += getScore(stance, ans[qi]);
      });
    });
    const maxScore = topicMap[topic].indices.length * 3;
    const topParty = parties.reduce((a, b) => topicTotals[a] > topicTotals[b] ? a : b);
    const topPct   = Math.round((topicTotals[topParty] / maxScore) * 100);
    return { topic, topParty, topPct, color: getTopicColor(topic) };
  });

  // Mostrar solo los temas donde el partido ganador global NO es el favorito (más interesante)
  const winner = sorted[0];
  const interesting = topicResults.filter(t => t.topParty !== winner || t.topPct < 60);
  const toShow = interesting.length > 0 ? interesting.slice(0, 4) : topicResults.slice(0, 4);

  const container = document.createElement('div');
  container.className = 'topic-breakdown';
  container.innerHTML = `
    <div class="tb-title">Desglose por temas</div>
    <div class="tb-grid">
      ${toShow.map(t => `
        <div class="tb-item">
          <span class="tb-topic" style="background:${t.color}1A;color:${t.color};border-color:${t.color}40">${t.topic}</span>
          <span class="tb-party" style="color:${colors[t.topParty]}">${partyNames[t.topParty] || t.topParty} <strong>${t.topPct}%</strong></span>
        </div>`).join('')}
    </div>
    <p class="tb-note">Temas donde tu afinidad es más destacada</p>`;
  return container;
}

/* ── VARIABLES GLOBALES DESCARGA ── */
let _lastSorted = [], _lastTotals = {}, _lastMaxScore = 1;

/* ── RESULTADOS ── */
function showResults() {
  document.getElementById('step-quiz').classList.add('hidden');
  const resultsEl = document.getElementById('step-results');
  resultsEl.classList.remove('hidden');
  resultsEl.style.opacity = '0';
  requestAnimationFrame(() => {
    resultsEl.style.transition = 'opacity 0.35s ease';
    resultsEl.style.opacity = '1';
  });

  const { parties, colors, logos = {}, partyNames = {} } = QUIZ_DATA;
  const maxScore = sessionQuestions.length * 3;
  const totals   = {};
  parties.forEach(p => totals[p] = 0);
  ans.forEach((a, qi) => {
    if (a === null) return;
    sessionQuestions[qi].stance.forEach((stance, pi) => {
      totals[parties[pi]] += getScore(stance, a);
    });
  });

  const sorted = [...parties].sort((a, b) => totals[b] - totals[a]);
  _lastSorted = sorted;
  trackEvent('quiz_complete', { winner: (QUIZ_DATA.partyNames||{})[sorted[0]] || sorted[0] });
  _lastTotals = totals; _lastMaxScore = maxScore;

  const winner   = sorted[0];
  const winPct   = Math.round((totals[winner] / maxScore) * 100);
  const winName  = partyNames[winner] || winner;
  const winColor = colors[winner];

  // Tarjeta ganador
  const snap    = document.getElementById('results-snapshot');
  const winCard = document.createElement('div');
  winCard.className = 'result-winner-card';
  winCard.style.setProperty('--winner-color', winColor);
  winCard.innerHTML = `
    <div class="result-winner-logo">
      ${logos[winner]
        ? `<img src="${logos[winner]}" alt="${winName}">`
        : `<span class="logo-initial" style="background:${winColor}">${winName[0]}</span>`}
    </div>
    <div class="result-winner-name" style="color:${winColor}">${winName}</div>
    <div class="result-winner-pct" style="color:${winColor}">${winPct}%</div>
    <div class="result-winner-msg">de afinidad con tus respuestas</div>`;
  snap.querySelector('.results-header').insertAdjacentElement('afterend', winCard);

  // Lista con reveal escalonado
  const rlist = document.getElementById('rlist');
  rlist.innerHTML = '';
  sorted.forEach((p, idx) => {
    const pct  = Math.round((totals[p] / maxScore) * 100);
    const name = partyNames[p] || p;
    const div  = document.createElement('div');
    div.className = 'result-row' + (idx === 0 ? ' top' : '');
    if (idx === 0) div.style.borderColor = colors[p];
    div.innerHTML = `
      <div class="result-logo-big">
        ${logos[p]
          ? `<img src="${logos[p]}" alt="${name}">`
          : `<span class="logo-initial" style="background:${colors[p]}">${name[0]}</span>`}
      </div>
      <div class="result-info">
        <div class="result-name-row">
          <span class="r-name">${name}</span>
          ${idx === 0 ? '<span class="top-badge">Mayor afinidad</span>' : ''}
        </div>
        <div class="result-bar-bg">
          <div class="result-bar-fill" style="width:0%;background:${colors[p]}" data-pct="${pct}"></div>
        </div>
      </div>
      <span class="result-pct" style="color:${colors[p]}">${pct}%</span>`;
    rlist.appendChild(div);
    setTimeout(() => {
      div.classList.add('visible');
      setTimeout(() => { div.querySelector('.result-bar-fill').style.width = pct + '%'; }, 150);
    }, 120 + idx * 130);
  });

  // Desglose por temas (tras la lista)
  const breakdown = buildTopicBreakdown(sorted, totals);
  if (breakdown) rlist.insertAdjacentElement('afterend', breakdown);

  // Botones compartir
  const shareText   = `He hecho el test en indecisos.es y coincido un ${winPct}% con ${winName}. ¿Y tú? 🗳️`;
  const shareUrl    = 'https://indecisos.es';
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
  const twitterUrl  = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;

  const shareDiv = document.createElement('div');
  shareDiv.className = 'share-actions';
  shareDiv.innerHTML = `
    <a href="${whatsappUrl}" target="_blank" class="btn-share btn-share--whatsapp" onclick="trackEvent('share',{medio:'whatsapp'})">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      WhatsApp
    </a>
    <a href="${twitterUrl}" target="_blank" class="btn-share btn-share--twitter" onclick="trackEvent('share',{medio:'twitter'})">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
      Twitter / X
    </a>
    <button class="btn-share btn-share--copy" onclick="copyResult('${shareText.replace(/'/g,"\\'")} ${shareUrl}', this)">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
      Copiar
    </button>`;
  snap.insertAdjacentElement('afterend', shareDiv);

  // Donaciones
  const donateDiv = document.createElement('div');
  donateDiv.className = 'donation-section';
  donateDiv.innerHTML = `
    <span class="donation-icon">☕</span>
    <div class="donation-title">¿Te ha sido útil? Apoya el proyecto</div>
    <p class="donation-desc">indecisos.es es un proyecto independiente, sin publicidad ni financiación política. Con tu aportación ayudas a mantenerlo.</p>
    <div class="donation-buttons">
      <a href="https://www.paypal.com/donate/?hosted_button_id=XXXXXXXXXXXXXXX" target="_blank" rel="noopener" class="btn-donate btn-donate--paypal">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.816-5.09a.932.932 0 0 1 .923-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.777-4.471z"/></svg>
        Donar con PayPal
      </a>
      <a href="https://buy.stripe.com/XXXXXXXXXXXXXXX" target="_blank" rel="noopener" class="btn-donate btn-donate--stripe">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C4.358 23.1 7.277 24 11.127 24c2.704 0 4.954-.608 6.542-1.899 1.679-1.372 2.572-3.354 2.572-5.706 0-4.111-2.377-5.917-6.265-7.245z"/></svg>
        Donar con Tarjeta
      </a>
    </div>
    <p class="donation-note">🔒 Pago seguro · Cualquier cantidad ayuda · Gracias 💙</p>`;
  shareDiv.insertAdjacentElement('afterend', donateDiv);
}

/* ── COPIAR ── */
function copyResult(text, btn) {
  navigator.clipboard.writeText(text).then(() => {
    btn.textContent = '✓ ¡Copiado!';
    setTimeout(() => {
      btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Copiar`;
    }, 2000);
  });
}

/* ── REINICIAR ── */
function restartQuiz() {
  document.getElementById('step-results').classList.add('hidden');
  document.getElementById('hero-section').classList.remove('hidden');
  document.querySelector('.result-winner-card')?.remove();
  document.querySelector('.share-actions')?.remove();
  document.querySelector('.donation-section')?.remove();
  document.querySelector('.topic-breakdown')?.remove();
  cur = 0; ans = [];
}

/* ══════════════════════════════════════════════
   DESCARGA — Canvas nativo (horizontal + stories)
   ══════════════════════════════════════════════ */

function buildResultCanvas(lastSorted, lastTotals, lastMaxScore) {
  const { parties, colors, partyNames = {} } = QUIZ_DATA;
  const W=800, ROW_H=72, PAD=40, HEADER=180, WINNER=220, FOOTER=56;
  const H = HEADER + WINNER + lastSorted.length * ROW_H + PAD + FOOTER;
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#F5F2EB'; ctx.fillRect(0,0,W,H);
  const winner = lastSorted[0];
  const winColor = colors[winner], winName = partyNames[winner]||winner;
  const winPct = Math.round((lastTotals[winner]/lastMaxScore)*100);
  ctx.fillStyle=winColor; ctx.fillRect(0,0,W,6);
  ctx.fillStyle='#85786E'; ctx.font='bold 13px Inter,sans-serif'; ctx.textAlign='center';
  ctx.fillText('TU RESULTADO · INDECISOS.ES',W/2,40);
  ctx.fillStyle='#2D241E'; ctx.font='bold 32px Inter,sans-serif';
  ctx.fillText('Afinidad Política',W/2,84);
  ctx.strokeStyle='#E6DFD3'; ctx.lineWidth=1;
  ctx.beginPath(); ctx.moveTo(PAD,104); ctx.lineTo(W-PAD,104); ctx.stroke();
  const wy=120, lsz=80, lx=W/2-lsz/2;
  roundRect(ctx,lx,wy,lsz,lsz,16,'#FFFFFF');
  ctx.strokeStyle='#E6DFD3'; ctx.lineWidth=2; roundRectStroke(ctx,lx,wy,lsz,lsz,16);
  ctx.fillStyle=winColor; ctx.font='bold 28px Inter,sans-serif'; ctx.textAlign='center';
  ctx.fillText(winName,W/2,wy+lsz+34);
  ctx.font='bold 56px Inter,sans-serif'; ctx.fillText(winPct+'%',W/2,wy+lsz+92);
  ctx.fillStyle='#85786E'; ctx.font='14px Inter,sans-serif';
  ctx.fillText('de afinidad con tus respuestas',W/2,wy+lsz+116);
  let rowY = HEADER+WINNER+8;
  lastSorted.forEach((p,idx) => {
    const pct=Math.round((lastTotals[p]/lastMaxScore)*100), name=partyNames[p]||p, col=colors[p];
    roundRect(ctx,PAD,rowY,W-PAD*2,ROW_H-6,10,idx===0?'#FFFFFF':'#FAF8F4');
    ctx.strokeStyle=idx===0?col:'#E6DFD3'; ctx.lineWidth=idx===0?2:1;
    roundRectStroke(ctx,PAD,rowY,W-PAD*2,ROW_H-6,10);
    const lsz2=36, ly2=rowY+(ROW_H-6)/2-lsz2/2;
    roundRect(ctx,PAD+12,ly2,lsz2,lsz2,8,'#FFFFFF');
    ctx.strokeStyle='#E6DFD3'; ctx.lineWidth=1; roundRectStroke(ctx,PAD+12,ly2,lsz2,lsz2,8);
    ctx.fillStyle=col; ctx.font='bold 16px Inter,sans-serif'; ctx.textAlign='center';
    ctx.fillText(name[0].toUpperCase(),PAD+12+lsz2/2,rowY+(ROW_H-6)/2+6);
    ctx.fillStyle='#2D241E'; ctx.font='bold 15px Inter,sans-serif'; ctx.textAlign='left';
    ctx.fillText(name,PAD+12+lsz2+12,rowY+26);
    const barX=PAD+12+lsz2+12, barW=W-PAD*2-lsz2-24-70, barY2=rowY+36;
    roundRect(ctx,barX,barY2,barW,8,4,'#EBE5D9');
    roundRect(ctx,barX,barY2,Math.max(4,barW*pct/100),8,4,col);
    ctx.fillStyle=col; ctx.font='bold 16px Inter,sans-serif'; ctx.textAlign='right';
    ctx.fillText(pct+'%',W-PAD-12,rowY+30);
    rowY+=ROW_H;
  });
  ctx.fillStyle='#B0A89E'; ctx.font='12px Inter,sans-serif'; ctx.textAlign='center';
  ctx.fillText('indecisos.es · Orientación de voto sin etiquetas',W/2,H-18);
  return canvas;
}

/* ── Canvas formato Stories 9:16 ── */
function buildStoriesCanvas(lastSorted, lastTotals, lastMaxScore) {
  const { parties, colors, partyNames = {} } = QUIZ_DATA;
  const W=1080, H=1920;
  const canvas = document.createElement('canvas');
  canvas.width=W; canvas.height=H;
  const ctx = canvas.getContext('2d');
  const winner = lastSorted[0];
  const winColor = colors[winner], winName = partyNames[winner]||winner;
  const winPct = Math.round((lastTotals[winner]/lastMaxScore)*100);

  // Fondo con gradiente sutil
  const grad = ctx.createLinearGradient(0,0,0,H);
  grad.addColorStop(0,'#F8F5EE'); grad.addColorStop(1,'#EDE8DC');
  ctx.fillStyle=grad; ctx.fillRect(0,0,W,H);

  // Barra de color superior
  ctx.fillStyle=winColor; ctx.fillRect(0,0,W,18);

  // Logo/inicial del ganador
  const CX=W/2, CY=580, R=180;
  roundRect(ctx,CX-R,CY-R,R*2,R*2,48,'#FFFFFF');
  ctx.shadowColor='rgba(0,0,0,0.1)'; ctx.shadowBlur=40; ctx.shadowOffsetY=12;
  roundRectStroke2(ctx,CX-R,CY-R,R*2,R*2,48,winColor,4);
  ctx.shadowColor='transparent'; ctx.shadowBlur=0; ctx.shadowOffsetY=0;
  ctx.fillStyle=winColor; ctx.font='bold 140px Inter,sans-serif'; ctx.textAlign='center';
  ctx.fillText(winName[0].toUpperCase(),CX,CY+50);

  // Nombre partido
  ctx.fillStyle=winColor; ctx.font='bold 88px Inter,sans-serif'; ctx.textAlign='center';
  ctx.fillText(winName,CX,820);

  // Porcentaje
  ctx.fillStyle='#2D241E'; ctx.font='bold 200px Inter,sans-serif'; ctx.textAlign='center';
  ctx.fillText(winPct+'%',CX,1060);

  ctx.fillStyle='#85786E'; ctx.font='52px Inter,sans-serif';
  ctx.fillText('de afinidad',CX,1140);

  // Línea divisoria
  ctx.strokeStyle='#E6DFD3'; ctx.lineWidth=2;
  ctx.beginPath(); ctx.moveTo(120,1200); ctx.lineTo(W-120,1200); ctx.stroke();

  // Resto de partidos (los 3 siguientes)
  const rest = lastSorted.slice(1, 4);
  rest.forEach((p, idx) => {
    const pct=Math.round((lastTotals[p]/lastMaxScore)*100), name=partyNames[p]||p, col=colors[p];
    const y = 1270 + idx * 160;
    roundRect(ctx,100,y,W-200,120,20,'#FFFFFF');
    ctx.fillStyle=col; ctx.font='bold 42px Inter,sans-serif'; ctx.textAlign='left';
    ctx.fillText(name,160,y+72);
    const barX=160+280, barW=W-200-280-180-60, barY=y+60;
    roundRect(ctx,barX,barY,barW,16,8,'#EBE5D9');
    roundRect(ctx,barX,barY,Math.max(8,barW*pct/100),16,8,col);
    ctx.fillStyle=col; ctx.font='bold 42px Inter,sans-serif'; ctx.textAlign='right';
    ctx.fillText(pct+'%',W-140,y+72);
  });

  // Footer
  ctx.fillStyle='#B0A89E'; ctx.font='bold 40px Inter,sans-serif'; ctx.textAlign='center';
  ctx.fillText('indecisos.es',CX,H-80);
  ctx.font='36px Inter,sans-serif';
  ctx.fillText('Descubre tu afinidad política',CX,H-30);

  return canvas;
}

function roundRectStroke2(ctx,x,y,w,h,r,stroke,lw) {
  ctx.beginPath();
  ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y); ctx.quadraticCurveTo(x+w,y,x+w,y+r);
  ctx.lineTo(x+w,y+h-r); ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  ctx.lineTo(x+r,y+h); ctx.quadraticCurveTo(x,y+h,x,y+h-r);
  ctx.lineTo(x,y+r); ctx.quadraticCurveTo(x,y,x+r,y); ctx.closePath();
  ctx.strokeStyle=stroke; ctx.lineWidth=lw; ctx.stroke();
}

function roundRect(ctx,x,y,w,h,r,fill) {
  ctx.beginPath();
  ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y); ctx.quadraticCurveTo(x+w,y,x+w,y+r);
  ctx.lineTo(x+w,y+h-r); ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  ctx.lineTo(x+r,y+h); ctx.quadraticCurveTo(x,y+h,x,y+h-r);
  ctx.lineTo(x,y+r); ctx.quadraticCurveTo(x,y,x+r,y); ctx.closePath();
  if(fill){ctx.fillStyle=fill; ctx.fill();}
}
function roundRectStroke(ctx,x,y,w,h,r) {
  ctx.beginPath();
  ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y); ctx.quadraticCurveTo(x+w,y,x+w,y+r);
  ctx.lineTo(x+w,y+h-r); ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  ctx.lineTo(x+r,y+h); ctx.quadraticCurveTo(x,y+h,x,y+h-r);
  ctx.lineTo(x,y+r); ctx.quadraticCurveTo(x,y,x+r,y); ctx.closePath(); ctx.stroke();
}

async function downloadImage() {
  const btn = document.getElementById('btn-download-img');
  btn.textContent='Generando…'; btn.disabled=true;
  try {
    const canvas=buildResultCanvas(_lastSorted,_lastTotals,_lastMaxScore);
    const link=document.createElement('a');
    link.download='mi-resultado-indecisos.png'; link.href=canvas.toDataURL('image/png');
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  } catch(e){ alert('Error: '+e.message); }
  btn.textContent='📷 Descargar imagen'; btn.disabled=false;
}

async function downloadStories() {
  const btn = document.getElementById('btn-download-stories');
  if (!btn) return;
  btn.textContent='Generando…'; btn.disabled=true;
  try {
    const canvas=buildStoriesCanvas(_lastSorted,_lastTotals,_lastMaxScore);
    const link=document.createElement('a');
    link.download='mi-resultado-stories.png'; link.href=canvas.toDataURL('image/png');
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  } catch(e){ alert('Error: '+e.message); }
  btn.textContent='📱 Stories (9:16)'; btn.disabled=false;
}

async function downloadPDF() {
  const btn = document.getElementById('btn-download-pdf');
  btn.textContent='Generando…'; btn.disabled=true;
  try {
    const canvas=buildResultCanvas(_lastSorted,_lastTotals,_lastMaxScore);
    const imgData=canvas.toDataURL('image/png');
    const {jsPDF}=window.jspdf;
    const pdf=new jsPDF({orientation:'portrait',unit:'mm',format:'a4'});
    const imgW=190, imgH=(canvas.height*imgW)/canvas.width;
    const pageH=pdf.internal.pageSize.getHeight();
    pdf.addImage(imgData,'PNG',10,Math.max(10,(pageH-imgH)/2),imgW,imgH);
    pdf.setFontSize(8); pdf.setTextColor(150,140,130);
    pdf.text('indecisos.es · Orientación de voto sin etiquetas',105,pageH-8,{align:'center'});
    pdf.save('mi-resultado-indecisos.pdf');
  } catch(e){ alert('Error: '+e.message); }
  btn.textContent='📄 Descargar PDF'; btn.disabled=false;
}

/* ── HINT TECLADO: mostrar solo en desktop ── */
(function() {
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.addEventListener('keydown', function showHint() {
      const hint = document.getElementById('kb-hint');
      if (hint) hint.style.display = '';
      document.removeEventListener('keydown', showHint);
    }, { once: true });
  }
})();

/* ── PLAUSIBLE: eventos clave ── */
function trackEvent(name, props) {
  if (typeof plausible !== 'undefined') {
    plausible(name, { props });
  }
}
