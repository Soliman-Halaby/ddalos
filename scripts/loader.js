// Calling AOS library
AOS.init();

// Creating different elements and boolean
let scene, camera, renderer;
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;

let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

// Creating our scene
scene = new THREE.Scene();
// Color of the scene
scene.background = new THREE.Color(000000);

// Creating a camera
camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  1,
  5000
);

// Creating different position of the camera
camera.rotation.y = (5 / 180) * Math.PI;
camera.position.x = 222;
camera.position.y = -25;
camera.position.z = 479;

renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;

// Adding ambient lights
hlight = new THREE.AmbientLight(0x404040, 5);
scene.add(hlight);

// Adding directional light
directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
directionalLight.position.set(3, 1, 0);
directionalLight.castShadow = true;
scene.add(directionalLight);

directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
directionalLight.position.set(2, 5, 2);
directionalLight.castShadow = true;
scene.add(directionalLight);

// Adding lights on the scene
directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
directionalLight.position.set(-3, 1, 0);
directionalLight.castShadow = true;
scene.add(directionalLight);

// light = new THREE.PointLight(0xc4c4c4, 10);
// light.position.set(0, 300, 500);
// scene.add(light);

// light = new THREE.PointLight(0xc4c4c4, 10);
// light.position.set(500, 100, 0);
// scene.add(light);

// light = new THREE.PointLight(0xc4c4c4, 10);
// light.position.set(0, 100, -500);
// scene.add(light);

// light = new THREE.PointLight(0xc4c4c4, 10);
// light.position.set(-500, 300, 0);
// scene.add(light);

let loader = new THREE.GLTFLoader();
loader.load("https://ftp.tokinou.fr/soly/showroom.glb", function (gltf) {
  scene.add(gltf.scene);
});
