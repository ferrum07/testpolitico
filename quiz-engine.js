// quiz-engine.js
let cur = 0, ans = [];

function startQuiz() {
  ans = new Array(QUIZ_DATA.questions.length).fill(null);
  cur = 0;
  document.getElementById('hero-section').classList.add('hidden');
  document.getElementById('step-quiz').classList.remove('hidden');
  render();
}

function render() {
  const q = QUIZ_DATA.questions[cur];
  const total = QUIZ_DATA.questions.length;
  document.getElementById('pfill').style.width = `${(cur / total) * 100}%`;
  document.getElementById('plabel').textContent = `${cur + 1} / ${total}`;
  document.getElementById('tchip').textContent = q.topic;
  document.getElementById('qtext').textContent = q.text;
  ['btn-agree', 'btn-against', 'btn-abstain'].forEach((id, i) => {
    document.getElementById(id).classList.toggle('selected', ans[cur] === i);
  });
  document.getElementById('bnext').disabled = ans[cur] === null;
  document.getElementById('bprev').style.display = cur === 0 ? 'none' : '';
  document.getElementById('bnext').textContent = cur === total - 1 ? 'Ver resultados →' : 'Siguiente →';
}

function pick(i) { ans[cur] = i; render(); }

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('bnext').addEventListener('click', () => {
    if (cur < QUIZ_DATA.questions.length - 1) { cur++; render(); }
    else showResults();
  });
  document.getElementById('bprev').addEventListener('click', () => {
    if (cur > 0) { cur--; render(); }
  });
});

function getScore(stance, answer) {
  if (answer === 2) return 1;
  if (answer === 0) return stance ===  1 ? 3 : stance === -1 ? 0 : 1;
  if (answer === 1) return stance === -1 ? 3 : stance ===  1 ? 0 : 1;
  return 1;
}

function showResults() {
  document.getElementById('step-quiz').classList.add('hidden');
  document.getElementById('step-results').classList.remove('hidden');
  const { parties, colors, logos = {}, partyNames = {} } = QUIZ_DATA;
  const maxScore = QUIZ_DATA.questions.length * 3;
  const totals = {};
  parties.forEach(p => totals[p] = 0);
  ans.forEach((a, qi) => {
    if (a === null) return;
    QUIZ_DATA.questions[qi].stance.forEach((stance, pi) => {
      totals[parties[pi]] += getScore(stance, a);
    });
  });
  const sorted = [...parties].sort((a, b) => totals[b] - totals[a]);
  const rl = document.getElementById('rlist');
  rl.innerHTML = '';
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
          ${idx === 0 ? '<span class="top-badge">Tu partido</span>' : ''}
        </div>
        <div class="result-bar-bg">
          <div class="result-bar-fill" style="width:0%;background:${colors[p]}" data-pct="${pct}"></div>
        </div>
      </div>
      <span class="result-pct" style="color:${colors[p]}">${pct}%</span>`;
    rl.appendChild(div);
  });
  setTimeout(() => {
    document.querySelectorAll('.result-bar-fill').forEach(b => b.style.width = b.dataset.pct + '%');
  }, 100);
}

function restartQuiz() {
  document.getElementById('step-results').classList.add('hidden');
  document.getElementById('hero-section').classList.remove('hidden');
  cur = 0; ans = [];
}

async function downloadImage() {
  const btn = document.getElementById('btn-download-img');
  btn.textContent = 'Generando…'; btn.disabled = true;
  try {
    const canvas = await html2canvas(document.getElementById('results-snapshot'), {
      scale: 2, useCORS: true, backgroundColor: '#F5F2EB'
    });
    const link = document.createElement('a');
    link.download = 'mi-resultado-indecisos.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch(e) { alert('No se pudo generar la imagen.'); }
  btn.textContent = '📷 Descargar imagen'; btn.disabled = false;
}

async function downloadPDF() {
  const btn = document.getElementById('btn-download-pdf');
  btn.textContent = 'Generando…'; btn.disabled = true;
  try {
    const canvas = await html2canvas(document.getElementById('results-snapshot'), {
      scale: 2, useCORS: true, backgroundColor: '#F5F2EB'
    });
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const imgW = 190, imgH = (canvas.height * imgW) / canvas.width;
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 10, 15, imgW, imgH);
    pdf.setFontSize(9); pdf.setTextColor(130, 120, 110);
    pdf.text('indecisos.es — Orientación de voto sin etiquetas', 105, imgH + 22, { align: 'center' });
    pdf.save('mi-resultado-indecisos.pdf');
  } catch(e) { alert('No se pudo generar el PDF.'); }
  btn.textContent = '📄 Descargar PDF'; btn.disabled = false;
}
