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