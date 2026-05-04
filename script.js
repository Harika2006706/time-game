let score = 0;
let timeLeft = 30;
let animationFrame;
let gameInterval;

const target = document.getElementById("target");
const gameArea = document.getElementById("gameArea");
const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");
const startBtn = document.getElementById("startBtn");

let mode = "classic";
let targets = []; // for chaos mode

// Movement
let x = 100, y = 100;
let dx = 2, dy = 2;

// 🎮 Set Mode
function setMode(selectedMode) {
  mode = selectedMode;
  document.getElementById("message").textContent =
    "Mode: " + mode.toUpperCase();
}

// ▶️ Start Game
startBtn.onclick = startGame;

function startGame() {
  cancelAnimationFrame(animationFrame);
  clearInterval(gameInterval);

  score = 0;
  timeLeft = 30;

  scoreDisplay.textContent = score;
  timeDisplay.textContent = timeLeft;

  clearTargets();

  if (mode === "chaos") {
    createMultipleTargets();
  } else {
    target.style.display = "block";
    moveClassic();
  }

  gameInterval = setInterval(() => {
    timeLeft--;
    timeDisplay.textContent = timeLeft;
    if (timeLeft <= 0) endGame();
  }, 1000);
}

// 🎯 CLASSIC MODE
function moveClassic() {
  const maxX = gameArea.clientWidth - target.offsetWidth;
  const maxY = gameArea.clientHeight - target.offsetHeight;

  x += dx;
  y += dy;

  if (x <= 0 || x >= maxX) dx *= -1;
  if (y <= 0 || y >= maxY) dy *= -1;

  target.style.left = x + "px";
  target.style.top = y + "px";

  animationFrame = requestAnimationFrame(moveClassic);
}

// ⚡ REACTION MODE
function spawnReactionTarget() {
  target.style.display = "block";

  const maxX = gameArea.clientWidth - target.offsetWidth;
  const maxY = gameArea.clientHeight - target.offsetHeight;

  target.style.left = Math.random() * maxX + "px";
  target.style.top = Math.random() * maxY + "px";

  setTimeout(() => {
    if (mode === "reaction") spawnReactionTarget();
  }, 1000);
}

// 🎯 PRECISION MODE
function enablePrecision() {
  target.style.width = "40px";
  target.style.height = "40px";
}

// 💥 CHAOS MODE
function createMultipleTargets() {
  for (let i = 0; i < 3; i++) {
    let t = document.createElement("div");
    t.className = "target";
    t.style.position = "absolute";
    t.style.width = "60px";
    t.style.height = "60px";
    t.style.borderRadius = "50%";
    t.style.background = "red";

    gameArea.appendChild(t);
    targets.push({
      el: t,
      x: Math.random() * 200,
      y: Math.random() * 200,
      dx: 2,
      dy: 2
    });

    t.onclick = () => score++;
  }

  moveChaos();
}

function moveChaos() {
  targets.forEach(t => {
    const maxX = gameArea.clientWidth - 60;
    const maxY = gameArea.clientHeight - 60;

    t.x += t.dx;
    t.y += t.dy;

    if (t.x <= 0 || t.x >= maxX) t.dx *= -1;
    if (t.y <= 0 || t.y >= maxY) t.dy *= -1;

    t.el.style.left = t.x + "px";
    t.el.style.top = t.y + "px";
  });

  animationFrame = requestAnimationFrame(moveChaos);
}

// 🧹 Clear targets
function clearTargets() {
  target.style.display = "none";
  targets.forEach(t => t.el.remove());
  targets = [];
}

// 💥 Hit logic
function hit() {
  score++;
  scoreDisplay.textContent = score;
}

target.onclick = () => {
  hit();

  if (mode === "reaction") {
    target.style.display = "none";
    setTimeout(spawnReactionTarget, 500);
  }
};

// 🏁 End
function endGame() {
  cancelAnimationFrame(animationFrame);
  clearInterval(gameInterval);

  clearTargets();

  document.getElementById("popup").style.display = "flex";
  document.getElementById("finalScore").textContent = score;
}