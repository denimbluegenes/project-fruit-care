/* =========================
   SFX (button + moods)
   ========================= */
const buttonSound = new Audio("sounds/buttonpress.wav");
buttonSound.volume = 0.2;

function playButtonSound() {
  buttonSound.currentTime = 0;
  buttonSound.play().catch(() => {});
}

/* =========================
   GET ELEMENTS
   ========================= */
const pet = document.getElementById("pet");
const mood = document.getElementById("mood");      // overlay gif (smile)
const fruitEl = document.getElementById("fruit");  // evolution result
const careTimerEl = document.getElementById("careTimer");
const hungerEl = document.getElementById("hunger"); // hunger UI number

const btnEat = document.getElementById("btnEat");
const btnPlay = document.getElementById("btnPlay");

const petView =
  document.getElementById("petView") || document.getElementById("petview"); // supports either id
const gameView = document.getElementById("gameView");

const currentNumEl = document.getElementById("currentNum");
const gameMsg = document.getElementById("gameMsg");
const roundInfo = document.getElementById("roundInfo");
const winInfo = document.getElementById("winInfo");

const btnHigher = document.getElementById("btnHigher");
const btnLower = document.getElementById("btnLower");
const btnExitGame = document.getElementById("btnExitGame");

/* =========================
   CLICK SOUNDS FOR UI
   ========================= */
document.querySelectorAll(".controls img").forEach((img) => {
  img.addEventListener("click", playButtonSound);
});

// game buttons click sound too
[btnHigher, btnLower, btnExitGame].forEach((b) => {
  if (b) b.addEventListener("click", playButtonSound);
});

/* =========================
   PET ANIMS + MOOD SFX
   ========================= */
const eatSound = new Audio("sounds/eating.wav");
eatSound.volume = 0.4;

const upsetSfx = new Audio("sounds/upset.wav");
upsetSfx.volume = 0.5;

const happySfx = new Audio("sounds/happy.wav");
happySfx.volume = 0.6;

function showHappyMood(ms = 1400) {
  if (!mood) return;

  // hide pet temporarily so smile is clean
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

function showUpsetMood(ms = 1600) {
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

/* =========================
   HUNGER (drops every 10s)
   ========================= */
let hunger = 5;
const MAX_HUNGER = 5;

function updateHungerUI() {
  if (hungerEl) hungerEl.textContent = hunger;
}

updateHungerUI();

// hunger drops every 10 seconds
setInterval(() => {
  hunger = Math.max(0, hunger - 1);
  updateHungerUI();

  if (hunger === 0) {
    showUpsetMood(1600);
  }
}, 10000);

/* =========================
   CARE SCORE + EVOLUTION (30s test)
   ========================= */
const FRUITS = {
  apple: "images/fruits/apple.gif",
  banana: "images/fruits/banana.gif", // rare/best care
  cherry: "images/fruits/cherry.gif",
};

let careScore = 0;
let careTimerStarted = false;

function evolveToFruit() {
  // ensure pet screen visible
  showPet();

  // stop pet and hide moods
  pet.classList.remove("wandering");
  pet.classList.remove("eating");
  pet.classList.add("hidden");
  if (mood) mood.classList.add("hidden");

  // clamp careScore
  careScore = Math.max(0, careScore);

  // choose fruit by careScore
  let chosenFruit;
  if (careScore >= 8) chosenFruit = FRUITS.banana;     // 🍌 super good care
  else if (careScore >= 4) chosenFruit = FRUITS.cherry; // 🍒 good care
  else chosenFruit = FRUITS.apple;                      // 🍎 low care

  if (fruitEl) {
    fruitEl.src = chosenFruit;
    fruitEl.classList.remove("hidden");
  }
}

function startCareTimer(duration = 30) {
  if (!careTimerEl) return;
  if (careTimerStarted) return;
  careTimerStarted = true;

  let remaining = duration;

  const render = () => {
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

  careTimerEl.textContent =
    `${minutes}:${String(seconds).padStart(2, "0")}`;
};

  careTimerEl.classList.remove("hidden");
  render();

  const intervalId = setInterval(() => {
    remaining -= 1;
    render();

    if (remaining <= 0) {
      clearInterval(intervalId);
      careTimerEl.classList.add("hidden");
      evolveToFruit();
    }
  }, 1000);
}

/* =========================
   FEEDING (max 5)
   ========================= */
let feedCount = 0;
const MAX_FEEDS = 5;

// start wandering on load
pet.classList.add("wandering");

btnEat.addEventListener("click", () => {
  // if already full -> upset
  if (feedCount >= MAX_FEEDS) {
    showUpsetMood(1600);
    return;
  }

  feedCount++;

  // refill hunger by 1 (cap at 5)
  hunger = Math.min(MAX_HUNGER, hunger + 1);
  updateHungerUI();

  // care score boost for feeding
  careScore += 2;

  // stop wander while eating
  pet.classList.remove("wandering");
  pet.classList.add("eating");

  pet.src = "images/baby/babyfeed.gif";

  eatSound.currentTime = 0;
  eatSound.play().catch(() => {});

  setTimeout(() => {
    pet.src = "images/baby/baby.gif";
    pet.classList.remove("eating");
    pet.classList.add("wandering");
  }, 4100); // match your eat gif length
});

/* =========================
   HIGH / LOW GAME (1–21)
   ========================= */
const MAX_ROUNDS = 5;
const WIN_TARGET = 3;

let currentNum = 0;
let round = 0;
let wins = 0;
let gameActive = false;

// hearts earned from game
let hearts = 0;
const MAX_HEARTS = 5;

function rand1to21() {
  return Math.floor(Math.random() * 21) + 1;
}

function showGame() {
  if (petView) petView.classList.add("hidden");
  if (gameView) gameView.classList.remove("hidden");
}

function showPet() {
  if (gameView) gameView.classList.add("hidden");
  if (petView) petView.classList.remove("hidden");
}

function startHighLow() {
  currentNum = rand1to21();
  if (currentNumEl) currentNumEl.textContent = currentNum;

  round = 0;
  wins = 0;
  gameActive = true;

  if (roundInfo) roundInfo.textContent = `Round: 1 / ${MAX_ROUNDS}`;
  if (winInfo) winInfo.textContent = `Wins: 0 (need ${WIN_TARGET}+)`;
  if (gameMsg) gameMsg.textContent = "Higher or Lower?";

  if (btnHigher) btnHigher.disabled = false;
  if (btnLower) btnLower.disabled = false;
}

function handleGuess(choice) {
  if (!gameActive) return;

  let nextNum = rand1to21();
  while (nextNum === currentNum) nextNum = rand1to21(); // no ties

  const win =
    (choice === "higher" && nextNum > currentNum) ||
    (choice === "lower" && nextNum < currentNum);

  round++;
  if (win) wins++;

  if (gameMsg) {
    gameMsg.textContent = win
      ? `✅ Win! It was ${nextNum}`
      : `❌ Lose! It was ${nextNum}`;
  }

  currentNum = nextNum;
  if (currentNumEl) currentNumEl.textContent = currentNum;

  if (roundInfo) {
    roundInfo.textContent = `Round: ${Math.min(round + 1, MAX_ROUNDS)} / ${MAX_ROUNDS}`;
  }
  if (winInfo) winInfo.textContent = `Wins: ${wins} (need ${WIN_TARGET}+)`;

  if (round >= MAX_ROUNDS) endHighLow();
}

function endHighLow() {
  gameActive = false;
  if (btnHigher) btnHigher.disabled = true;
  if (btnLower) btnLower.disabled = true;

  if (wins >= WIN_TARGET) {
    hearts = Math.min(MAX_HEARTS, hearts + 1);
    if (gameMsg) gameMsg.textContent = `🎉 ${wins}/${MAX_ROUNDS} wins! +1 heart!`;

    // care boost for winning
    careScore += 3;

    // show happy ONLY when hearts are 3–5
    if (hearts >= 3) {
      setTimeout(() => {
        showPet();
        showHappyMood(1400);
      }, 300);
    } else {
      setTimeout(showPet, 900);
    }
  } else {
    if (gameMsg) gameMsg.textContent = `😢 ${wins}/${MAX_ROUNDS} wins. No heart.`;

    // small penalty
    careScore -= 1;

    setTimeout(() => {
      showPet();
      showUpsetMood(1600);
    }, 300);
  }
}

/* hook up game buttons */
btnPlay.addEventListener("click", () => {
  showGame();
  startHighLow();
});

btnHigher.addEventListener("click", () => handleGuess("higher"));
btnLower.addEventListener("click", () => handleGuess("lower"));
btnExitGame.addEventListener("click", showPet);

/* =========================
   START CARE TIMER ON LOAD
   ========================= */
startCareTimer(60);