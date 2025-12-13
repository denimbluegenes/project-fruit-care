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

