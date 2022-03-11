import { PointerLockControls } from "../elements/PointerLockControls.js";
import { Sky } from "../elements/sky.js";

// Use PointerLock effects in the control
let controls = new PointerLockControls(camera, renderer.domElement);

// Taking different HTML elements
const blocker = document.querySelector(".blocker");
const instructions = document.querySelector(".instructions");
const showroomAudio = document.querySelector(".showroomAudio");

let sky, sun;

function initSky() {
  // Add Sky
  sky = new Sky();
  sky.scale.setScalar(450000);
  scene.add(sky);

  sun = new THREE.Vector3();

  /// GUI

  const effectController = {
    turbidity: 10,
    rayleigh: 3,
    mieCoefficient: 0.005,
    mieDirectionalG: 0.7,
    inclination: 0.49, // elevation / inclination
    azimuth: 0.25, // Facing front,
    exposure: renderer.toneMappingExposure,
  };

  function guiChanged() {
    const uniforms = sky.material.uniforms;
    uniforms["turbidity"].value = effectController.turbidity;
    uniforms["rayleigh"].value = effectController.rayleigh;
    uniforms["mieCoefficient"].value = effectController.mieCoefficient;
    uniforms["mieDirectionalG"].value = effectController.mieDirectionalG;

    const theta = Math.PI * (effectController.inclination - 0.5);
    const phi = 2 * Math.PI * (effectController.azimuth - 0.5);

    sun.x = Math.cos(phi);
    sun.y = Math.sin(phi) * Math.sin(theta);
    sun.z = Math.sin(phi) * Math.cos(theta);

    uniforms["sunPosition"].value.copy(sun);

    renderer.toneMappingExposure = effectController.exposure;
    renderer.render(scene, camera);
  }
  guiChanged();
}
// Event listener that will lock the mouse
instructions.addEventListener("click", function () {
  controls.lock();
});

// Remove HTML elements
controls.addEventListener("lock", function () {
  instructions.style.display = "none";
  blocker.style.display = "none";
});

// If unlock mouse display HTML elements
controls.addEventListener("unlock", function () {
  blocker.style.display = "block";
  instructions.style.display = "";
});

// Selecting audio and some boolean
const audioPlayer = document.querySelector(".audioImg");
let isAudio = false;
let playAudio = false;

// Function that play / remove the audio
const setAudio = function (event) {
  if (!isAudio && !playAudio) {
    isAudio = !isAudio;
    playAudio = !playAudio;
    showroomAudio.play();
    audioPlayer.setAttribute("src", "/assets/audioOn.png");
  } else if (isAudio && playAudio) {
    isAudio = !isAudio;
    playAudio = !playAudio;
    audioPlayer.setAttribute("src", "/assets/audioOff.png");
    showroomAudio.pause();
  }
};
// Play / Remove the audio  on click
audioPlayer.addEventListener("click", setAudio);

// Adding objects in the scene
scene.add(controls.getObject());

// Function on key down, moving forward, left, right or backward
const onKeyDown = function (event) {
  switch (event.code) {
    case "ArrowUp":
    case "KeyW":
      moveForward = true;
      break;

    case "ArrowLeft":
    case "KeyA":
      moveLeft = true;
      break;

    case "ArrowDown":
    case "KeyS":
      moveBackward = true;
      break;

    case "ArrowRight":
    case "KeyD":
      moveRight = true;
      break;

    case "Space":
      if (canJump === true) velocity.y += 350;
      canJump = false;
      break;
  }
};

// Function that stop moving when key up
const onKeyUp = function (event) {
  switch (event.code) {
    case "ArrowUp":
    case "KeyW":
      moveForward = false;
      break;

    case "ArrowLeft":
    case "KeyA":
      moveLeft = false;
      break;

    case "ArrowDown":
    case "KeyS":
      moveBackward = false;
      break;

    case "ArrowRight":
    case "KeyD":
      moveRight = false;
      break;
  }
};

// Event listener to move or stop moving
document.addEventListener("keydown", onKeyDown);
document.addEventListener("keyup", onKeyUp);

const clock = new THREE.Clock();
controls.movementSpeed = 200;
controls.lookSpeed = 0.05;
controls.heigtCoef = 0;
controls.lookVertical = false;
controls.constrainVertical = false;
controls.verticalMin = 1.1;
controls.verticalMax = 2.2;

// Function to animate our camera, movement
function animate() {
  // renderer.render(scene, camera);
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  const time = performance.now();

  if (controls.isLocked === true) {
    const delta = (time - prevTime) / 1000;

    velocity.x -= velocity.x * 5.5 * delta;
    velocity.z -= velocity.z * 5.5 * delta;

    velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

    direction.z = Number(moveForward) - Number(moveBackward);
    direction.x = Number(moveRight) - Number(moveLeft);
    direction.normalize(); // this ensures consistent movements in all directions

    if (moveForward || moveBackward) velocity.z -= direction.z * 400.0 * delta;
    if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * delta;

    controls.moveRight(-velocity.x * delta);
    controls.moveForward(-velocity.z * delta);
  }

  prevTime = time;
}
initSky();

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
animate();
