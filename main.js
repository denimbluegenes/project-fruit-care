/*control noises :3 */
const buttonSound = new Audio("sounds/buttonpress.wav");
buttonSound.volume = 0.2;

/*press play */
function playButtonSound() {
  buttonSound.currentTime = 0;
  buttonSound.play().catch(() => {});
}

/*makes the images makes noise :3 */
document.querySelectorAll(".controls img").forEach((btn) => {
  btn.addEventListener("click", playButtonSound);
});

/*starting introo */
const pet = document.getElementById("pet");
const btnEat = document.getElementById("btnEat");

const eatSound = new Audio("sounds/eating.wav");
eatSound.volume = 0.4;

const upsetSfx = new Audio("sounds/upset.wav");
upsetSfx.volume = 0.5;

const careTimerEl = document.getElementById("careTimer");

function startCareTimer(duration = 30) {
  if (careTimerStarted) return;
  careTimerStarted = true;

  let remaining = duration;
  careTimerEl.textContent = `00:${remaining.toString().padStart(2, "0")}`;
  careTimerEl.classList.remove("hidden");

  const interval = setInterval(() => {
    remaining--;

    careTimerEl.textContent = `00:${remaining.toString().padStart(2, "0")}`;

    if (remaining <= 0) {
      clearInterval(interval);
      careTimerEl.classList.add("hidden");
      evolveToFruit();
    }
  }, 1000);
}


startCareTimer();



// ✅ FEED LIMIT
let feedCount = 0;
const MAX_FEEDS = 5;

// ===== FRUIT EVOLUTION (30s TEST) =====
const fruitEl = document.getElementById("fruit"); // make sure you have <img id="fruit" ...> in HTML
const FRUITS = {
  apple: "images/fruits/apple.gif",
  banana: "images/fruits/banana.gif", // rare (best care)
  cherry: "images/fruits/cherry.gif",
};

let careScore = 0;
let careTimerStarted = false;

function startCareTimer() {
  if (careTimerStarted) return;
  careTimerStarted = true;

  // 30 seconds test
  setTimeout(() => {
    evolveToFruit();
  }, 30000);
}

function evolveToFruit() {
  if (!fruitEl) return; // safety if fruit img isn't in HTML yet

  pet.classList.remove("wandering");
  pet.classList.remove("eating");
  pet.classList.add("hidden");

  // clamp
  careScore = Math.max(0, careScore);

  // thresholds tuned for 30s test
  // lots of interaction -> banana, some -> cherry, low -> apple
  let chosen;
  if (careScore >= 8) chosen = FRUITS.banana;      // 🍌 super good care (rare)
  else if (careScore >= 4) chosen = FRUITS.cherry; // 🍒 good care
  else chosen = FRUITS.apple;                      // 🍎 low care

  fruitEl.src = chosen;
  fruitEl.classList.remove("hidden");
}

function showUpsetMood(ms = 1400) {
  pet.classList.remove("wandering");
  pet.classList.remove("eating");
  pet.src = "images/baby/babyupset.gif";

  upsetSfx.currentTime = 0;
  upsetSfx.play().catch(() => {});

  setTimeout(() => {
    pet.src = "images/baby/baby.gif";
    pet.classList.add("wandering");
  }, ms);
}

// start wandering
pet.classList.add("wandering");

// start 30s test timer as soon as the site runs
startCareTimer();

btnEat.addEventListener("click", () => {
  // ✅ if full (already fed 5 times) -> upset + sound
  if (feedCount >= MAX_FEEDS) {
    showUpsetMood(1600);
    return;
  }

  feedCount++;

  // ✅ care scoring: feeding helps a bit
  careScore += 2;

  // stop walking, start eating
  pet.classList.remove("wandering");
  pet.classList.add("eating");

  // play eating gif
  pet.src = "images/baby/babyfeed.gif";

  eatSound.currentTime = 0;
  eatSound.play().catch(() => {});

  setTimeout(() => {
    // back to idle
    pet.src = "images/baby/baby.gif";
    pet.classList.remove("eating");
    pet.classList.add("wandering");
  }, 4100); // match your eat gif length
});

// ===== HIGH / LOW GAME (ADD ON) =====
const btnPlay = document.getElementById("btnPlay");

const petView = document.getElementById("petView");
const gameView = document.getElementById("gameView");

const currentNumEl = document.getElementById("currentNum");
const gameMsg = document.getElementById("gameMsg");
const roundInfo = document.getElementById("roundInfo");
const winInfo = document.getElementById("winInfo");

const btnHigher = document.getElementById("btnHigher");
const btnLower = document.getElementById("btnLower");
const btnExitGame = document.getElementById("btnExitGame");

// ✅ game buttons also make click noise
btnHigher.addEventListener("click", playButtonSound);
btnLower.addEventListener("click", playButtonSound);
btnExitGame.addEventListener("click", playButtonSound);

// hearts earned from game
let hearts = 0;
const MAX_HEARTS = 5;

const MAX_ROUNDS = 5;
const WIN_TARGET = 3;

let currentNum = 0;
let round = 0;
let wins = 0;
let gameActive = false;

function rand1to10() {
  return Math.floor(Math.random() * 10) + 1;
}

function showGame() {
  petView.classList.add("hidden");
  gameView.classList.remove("hidden");
}

function showPet() {
  gameView.classList.add("hidden");
  petView.classList.remove("hidden");
}

function startHighLow() {
  currentNum = rand1to10();
  currentNumEl.textContent = currentNum;

  round = 0;
  wins = 0;
  gameActive = true;

  roundInfo.textContent = `Round: 1 / ${MAX_ROUNDS}`;
  winInfo.textContent = `Wins: 0 (need ${WIN_TARGET}+)`;
  gameMsg.textContent = "Higher or Lower?";

  btnHigher.disabled = false;
  btnLower.disabled = false;
}

function handleGuess(choice) {
  if (!gameActive) return;

  let nextNum = rand1to10();
  while (nextNum === currentNum) nextNum = rand1to10(); // no ties

  const win =
    (choice === "higher" && nextNum > currentNum) ||
    (choice === "lower" && nextNum < currentNum);

  round++;
  if (win) wins++;

  gameMsg.textContent = win
    ? `✅ Win! It was ${nextNum}`
    : `❌ Lose! It was ${nextNum}`;

  currentNum = nextNum;
  currentNumEl.textContent = currentNum;

  roundInfo.textContent = `Round: ${Math.min(round + 1, MAX_ROUNDS)} / ${MAX_ROUNDS}`;
  winInfo.textContent = `Wins: ${wins} (need ${WIN_TARGET}+)`;

  if (round >= MAX_ROUNDS) endHighLow();
}

function endHighLow() {
  gameActive = false;
  btnHigher.disabled = true;
  btnLower.disabled = true;

  if (wins >= WIN_TARGET) {
    hearts = Math.min(MAX_HEARTS, hearts + 1);
    gameMsg.textContent = `🎉 ${wins}/${MAX_ROUNDS} wins! +1 heart!`;

    // ✅ care scoring: winning helps more
    careScore += 3;

    setTimeout(() => {
      showPet();
      showHappyMood(1400);
    }, 300);
  } else {
    gameMsg.textContent = `😢 ${wins}/${MAX_ROUNDS} wins. No heart.`;

    // ✅ care scoring: losing hurts a little
    careScore -= 1;

    setTimeout(() => {
      showPet();
      showUpsetMood(1600);
    }, 300);
  }
}

// hook up buttons
btnPlay.addEventListener("click", () => {
  showGame();
  startHighLow();
});

btnHigher.addEventListener("click", () => handleGuess("higher"));
btnLower.addEventListener("click", () => handleGuess("lower"));
btnExitGame.addEventListener("click", showPet);

const mood = document.getElementById("mood");
const happySfx = new Audio("sounds/happy.wav");
happySfx.volume = 0.6;

function showHappyMood(ms = 1400) {
  pet.classList.remove("wandering");
  pet.classList.add("hidden");

  mood.src = "images/baby/babysmile.gif";
  mood.classList.remove("hidden");

  happySfx.currentTime = 0;
  happySfx.play().catch(() => {});

  setTimeout(() => {
    mood.classList.add("hidden");
    pet.classList.remove("hidden");
    pet.classList.add("wandering");
  }, ms);
}

