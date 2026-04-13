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
