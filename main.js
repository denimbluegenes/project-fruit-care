/*control noises :3 */
const buttonSound = new Audio("sounds/buttonpress.wav");
buttonSound.volume = 0.2;

/*press play */
function playButtonSound() {
  buttonSound.currentTime = 0;
  buttonSound.play().catch(() => {});
}

/*makes the images makes noise :3 */

const pet = document.getElementById("pet");
const feedIcon = document.getElementById("feedIcon");

feedIcon.addEventListener("click", (e) => {
  e.preventDefault();

  // stop wandering
  pet.classList.remove("wandering");
  pet.style.animation = "none";

  // play eat gif (restart every time)
  pet.src = "images/baby/babyfeed.gif?" + Date.now();

  setTimeout(() => {
    pet.src = "images/baby/baby.gif?" + Date.now();
    pet.style.animation = "";
    pet.classList.add("wandering");
  }, 2000);
});