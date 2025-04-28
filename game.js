const settings = {
  easy:   { clickTime: 2000, size: 80, padding: 20 },
  normal: { clickTime: 1500, size: 60, padding: 30 },
  hard:   { clickTime: 1200, size: 40, padding: 50 },
  expert: { clickTime: 1000, size: 30, padding: 70 },
  insane: { clickTime:  800, size: 20, padding: 100 }
};

const colorMap = {
  Red:    'red',
  Green:  'green',
  Blue:   'blue',
  Yellow: 'yellow',
  Purple: 'purple',
  Orange: 'orange'
};

const menu        = document.getElementById('menu');
const gameScreen  = document.getElementById('game');
const startBtn    = document.getElementById('startBtn');
const diffSelect  = document.getElementById('difficulty');
const colorSelect = document.getElementById('color');
const scoreDisp   = document.getElementById('scoreDisplay');
const timeDisp    = document.getElementById('timeDisplay');
const field       = document.getElementById('gameField');

let score = 0,
    clickTime, size, padding, chosenColor,
    gameTimer = null,
    countdownTimer = null,
    currentSquare = null;

startBtn.addEventListener('click', () => {
  const diff = diffSelect.value;
  const col  = colorSelect.value;
  if (!col) {
    alert('Please choose a color!');
    return;
  }
  ({ clickTime, size, padding } = settings[diff]);
  chosenColor = colorMap[col];
  score = 0;
  updateScore();

  menu.style.display       = 'none';
  gameScreen.style.display = 'block';
  spawnNext();
});

function spawnNext() {
  if (currentSquare) currentSquare.remove();
  clearTimers();

  const sq = document.createElement('div');
  sq.className = 'square';
  sq.style.width      = size + 'px';
  sq.style.height     = size + 'px';
  sq.style.background = chosenColor;

  const maxX = field.clientWidth  - size - padding;
  const maxY = field.clientHeight - size - padding;
  const x = padding + Math.random() * maxX;
  const y = padding + Math.random() * maxY;
  sq.style.left = x + 'px';
  sq.style.top  = y + 'px';

  field.appendChild(sq);
  currentSquare = sq;

  gameTimer = setTimeout(endGame, clickTime);
  startCountdown(clickTime);

  sq.addEventListener('click', () => {
    clearTimers();
    score++;
    updateScore();
    spawnNext();
  }, { once: true });
}

function startCountdown(duration) {
  let timeLeft = duration / 1000;
  updateTime(timeLeft);
  countdownTimer = setInterval(() => {
    timeLeft = Math.max(0, timeLeft - 0.1);
    updateTime(timeLeft);
    if (timeLeft <= 0) clearInterval(countdownTimer);
  }, 100);
}

function updateScore() {
  scoreDisp.textContent = `Score: ${score}`;
}
function updateTime(t) {
  timeDisp.textContent = `Time left for click: ${t.toFixed(1)}s`;
}
function clearTimers() {
  clearTimeout(gameTimer);
  clearInterval(countdownTimer);
}

function endGame() {
  clearTimers();
  if (currentSquare) currentSquare.remove();
  alert(`Game over! Your score is ${score}.\nReload the page to play again.`);
}
