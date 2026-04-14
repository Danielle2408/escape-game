// ========== CODE & FIN DE JEU ==========
const codeInput = document.getElementById('codeInput');
const verifyBtn = document.getElementById('verifyBtn');
const codeMsg = document.getElementById('codeMessage');
const doorEl = document.getElementById('door');
const resetBtn = document.getElementById('resetBtn');

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

// Initialisation
resetGame();
bindObjectClicks();
verifyBtn.addEventListener('click', verifyCode);
resetBtn.addEventListener('click', resetGame);