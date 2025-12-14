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


const pet = document.getElementById("pet");
const btnEat = document.getElementById("btnEat");
const eatSound = new Audio("sounds/eating.wav");
eatSound.volume = 0.4;

// start wandering
pet.classList.add("wandering");

btnEat.addEventListener("click", () => {
  // stop walking, start eating
  pet.classList.remove("wandering");
  pet.classList.add("eating");

  // play eating gif
  pet.src = "images/baby/babyfeed.gif";

  eatSound.currentTime = 0;
  eatSound.play();

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

  gameMsg.textContent = win ? `✅ Win! It was ${nextNum}` : `❌ Lose! It was ${nextNum}`;
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

  gameMsg.textContent =
    wins >= WIN_TARGET
      ? `🎉 ${wins}/${MAX_ROUNDS} wins!`
      : `😢 ${wins}/${MAX_ROUNDS} wins.`;

  // return to pet screen first
  setTimeout(() => {
    showPet();

    // ✅ trigger babysmile ONLY if 3–5 wins
    if (wins >= 3 && wins <= 5) {
      showHappyMood(1400);
    }
  }, 300);
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

// upset mood
const upsetSfx = new Audio("sounds/upset.wav");
upsetSfx.volume = 0.5;

