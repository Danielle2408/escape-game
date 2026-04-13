// ========== TIMER & SONS ==========
let gameActive = true;
let timerInterval = null;
let timeSeconds = 300;          // 5 minutes
const timerSpan = document.getElementById('timer');
const statusDiv = document.getElementById('status');

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
    document.getElementById('codeMessage').innerText = "Temps écoulé. Recommencez.";
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
