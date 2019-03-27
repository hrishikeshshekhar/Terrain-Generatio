// Terrain Gen with the Diamond - Square Algorithm
const width = window.innerWidth;
const height = window.innerHeight;
const ratio = width / height;
const view_ang = 45;
const near = 0.1;
const far = 1000;
let rotation_const = 0.01;
const zoom_lev = 4;
const init_min = 5;
const init_max = 10;
const viewX = 0 * zoom_lev;
const viewY = 5 * zoom_lev;
const viewZ = 5 * zoom_lev;
const roughness = 0.5;
const detail = 3;
const length = Math.pow(2, detail) + 1;
const max = length - 1;
const segment = 10;
let length_temp = max;

// Storing all the vertices into an array
let vertices = new Array();

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(view_ang, ratio, near, far);
camera.position.set(viewX, viewY, viewZ);
camera.lookAt(0, 0, 0);

// Creating and setting renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);

// Adding the onclick functionality
const container = document.getElementById("main");
container.appendChild(renderer.domElement);
document.body.onclick = function(){
    divide(length_temp);
    length_temp /= 2;
}

// Adding lights
const light = new THREE.DirectionalLight(0xFFFFFF, 1);
light.position.set(viewX, viewY, viewZ);
scene.add(light);

// Adding user controls
const controls = new THREE.OrbitControls( camera, renderer.domElement);