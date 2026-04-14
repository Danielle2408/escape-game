// ========== 1. VARIABLES GLOBALES ==========
let gameActive = true;
let timerInterval = null;
let timeSeconds = 300;          // 5 minutes
let secretCode = "";
let cluesData = {};
let discoveredClues = [];

// Éléments DOM
const timerSpan = document.getElementById('timer');
const statusDiv = document.getElementById('status');
const cluesListElem = document.getElementById('cluesList');
const codeInput = document.getElementById('codeInput');
const codeMsg = document.getElementById('codeMessage');
const doorEl = document.getElementById('door');
const resetBtn = document.getElementById('resetBtn');
const verifyBtn = document.getElementById('verifyBtn');

// ========== 2. CONFIGURATION DES OBJETS ==========
const objectsConfig = {
  desk:    { hasClue: true, digitPos: 0, operation: (d) => `${d} × 1 = ?`,    result: (d) => d },
  bag:     { hasClue: true, digitPos: 1, operation: (d) => `${d} × 1 = ?`,    result: (d) => d },
  blackboard: { hasClue: true, digitPos: 2, operation: (d) => `${d} × 1 = ?`, result: (d) => d },
  bookshelf: { hasClue: true, digitPos: 3, operation: (d) => `${d+5} – 5 = ?`, result: (d) => d },
  globe:   { hasClue: false, penalty: 5 },
  trash:   { hasClue: false, penalty: 3 }
};

// ========== 3. TIMER & SONS ==========
function updateTimerDisplay() {
  const m = Math.floor(timeSeconds / 60);
  const s = timeSeconds % 60;
  timerSpan.innerText = `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
  if (timeSeconds <= 0 && gameActive) {
    gameActive = false;
    clearInterval(timerInterval);
    statusDiv.innerText = "⏰ TEMPS ÉCOULÉ ! Vous avez perdu.";
    statusDiv.style.background = "#8b0000";
    playSound('error');
    codeMsg.innerText = "Temps écoulé. Recommencez.";
  }
}

function startTimer() {
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (gameActive && timeSeconds > 0) {
      timeSeconds--;
      updateTimerDisplay();
    }
  }, 1000);
}

function penalizeTime(seconds) {
  if (!gameActive) return;
  timeSeconds = Math.max(0, timeSeconds - seconds);
  updateTimerDisplay();
  playSound('error');
  statusDiv.innerText = `⏱️ -${seconds}s ! Objet inutile.`;
  statusDiv.style.background = "#a04e2a";
  setTimeout(() => { if (gameActive) statusDiv.style.background = "#2c4a3e"; }, 1500);
}

function playSound(type) {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.type = 'sine';
    let freq = 440, dur = 0.2;
    if (type === 'click') { freq = 660; dur = 0.1; }
    else if (type === 'success') { freq = 880; dur = 0.4; }
    else if (type === 'error') { freq = 220; dur = 0.3; }
    else if (type === 'door') { freq = 523.25; dur = 0.6; }
    osc.frequency.value = freq;
    gain.gain.value = 0.3;
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + dur);
    osc.stop(audioCtx.currentTime + dur);
    setTimeout(() => audioCtx.close(), dur * 1000 + 100);
  } catch(e) { console.log("Audio non supporté"); }
}

// ========== 4. INDICES & CALCULS ==========
function generateRandomCode() {
  const digits = [
    Math.floor(Math.random() * 10),
    Math.floor(Math.random() * 10),
    Math.floor(Math.random() * 10),
    Math.floor(Math.random() * 10)
  ];
  return digits.join('');
}

function buildCluesDataFromCode(code) {
  const digits = code.split('').map(Number);
  const data = {};
  for (const [id, cfg] of Object.entries(objectsConfig)) {
    if (cfg.hasClue) {
      const d = digits[cfg.digitPos];
      const opText = cfg.operation(d);
      const result = cfg.result(d);
      data[id] = {
        name: id,
        message: `📌 ${opText} → résultat = ${result}. C'est le chiffre ${d}, position ${cfg.digitPos+1}.`,
        clue: `Chiffre ${cfg.digitPos+1} = ${d} (calcul : ${opText})`,
        digit: d,
        position: cfg.digitPos
      };
    } else {
      data[id] = {
        name: id,
        message: `😵 Rien d'utile... -${cfg.penalty} secondes !`,
        penalty: cfg.penalty
      };
    }
  }
  return data;
}

// ========== 5. GESTION DES CLICS (objets) ==========
function addClue(objId, clueText, message) {
  if (discoveredClues.includes(objId)) return false;
  discoveredClues.push(objId);
  const li = document.createElement('li');
  li.textContent = `🔍 ${clueText}`;
  cluesListElem.appendChild(li);
  if (cluesListElem.querySelector('li em')) cluesListElem.innerHTML = '';
  statusDiv.innerText = message;
  statusDiv.style.background = "#3a6b4a";
  playSound('click');
  const el = document.getElementById(objId);
  if (el) {
    el.style.transform = 'scale(1.05)';
    setTimeout(() => { if(el) el.style.transform = ''; }, 200);
  }
  return true;
}

function onObjectClick(objId) {
  if (!gameActive) {
    statusDiv.innerText = "Partie terminée. Recommencez.";
    playSound('error');
    return;
  }
  const data = cluesData[objId];
  if (!data) return;
  if (data.penalty !== undefined) { // objet sans indice
    penalizeTime(data.penalty);
    const li = document.createElement('li');
    li.textContent = `⚠️ ${data.message}`;
    cluesListElem.appendChild(li);
    return;
  }
  if (!discoveredClues.includes(objId)) {
    addClue(objId, data.clue, data.message);
  } else {
    statusDiv.innerText = `(Déjà vu) ${data.message}`;
    playSound('click');
  }
}

function bindObjectClicks() {
  for (const id of Object.keys(objectsConfig)) {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', () => onObjectClick(id));
  }
}

// ========== 6. CODE & FIN DE JEU (validation + reset) ==========
function verifyCode() {
  if (!gameActive) {
    codeMsg.innerText = "Partie terminée. Recommencez.";
    playSound('error');
    return;
  }
  if (codeInput.value.trim() === secretCode) {
    gameActive = false;
    clearInterval(timerInterval);
    statusDiv.innerText = "🎉 BRAVO ! Porte ouverte. Vous êtes libre ! 🎉";
    statusDiv.style.background = "#2e8b57";
    playSound('success');
    playSound('door');
    doorEl.classList.add('door-open');
    doorEl.querySelector('span').innerHTML = "🚪✨";
    doorEl.querySelector('.object-label').innerText = "Porte (ouverte !)";
    codeMsg.innerText = "✅ Code correct ! Victoire !";
    for (const id of Object.keys(objectsConfig)) {
      const obj = document.getElementById(id);
      if (obj) obj.style.cursor = 'default';
    }
  } else {
    playSound('error');
    codeMsg.innerText = "❌ Code incorrect. Réessayez.";
    statusDiv.innerText = "Code erroné, cherchez mieux.";
    statusDiv.style.background = "#a04e2a";
    codeInput.value = '';
    codeInput.focus();
    codeInput.style.transform = 'translateX(4px)';
    setTimeout(() => codeInput.style.transform = '', 100);
  }
}

function resetGame() {
  secretCode = generateRandomCode();
  cluesData = buildCluesDataFromCode(secretCode);
  gameActive = true;
  timeSeconds = 300;
  discoveredClues = [];
  cluesListElem.innerHTML = '<li><em>Aucun indice pour l\'instant.</em></li>';
  statusDiv.innerText = "🔍 Nouvelle partie ! Trouvez les indices...";
  statusDiv.style.background = "#2c4a3e";
  codeInput.value = '';
  codeMsg.innerText = '';
  doorEl.classList.remove('door-open');
  doorEl.querySelector('span').innerHTML = "🚪";
  doorEl.querySelector('.object-label').innerText = "Porte (fermée)";
  for (const id of Object.keys(objectsConfig)) {
    const obj = document.getElementById(id);
    if (obj) { obj.style.cursor = 'pointer'; obj.style.opacity = '1'; }
  }
  if (timerInterval) clearInterval(timerInterval);
  updateTimerDisplay();
  startTimer();
  playSound('click');
}

// ========== 7. INITIALISATION ==========
resetGame();
bindObjectClicks();
verifyBtn.addEventListener('click', verifyCode);
resetBtn.addEventListener('click', resetGame);