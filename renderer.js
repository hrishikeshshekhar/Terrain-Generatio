// Terrain Gen with the Diamond - Square Algorithm
const width = window.innerWidth;
const height = window.innerHeight;
const ratio = width / height;
const view_ang = 45;
const near = 0.1;
const far = 1000;
let rotation_const = 0.01;
const zoom_lev = 40;
const init_min = 4;
const init_max = 8;
const viewX = 0 * zoom_lev;
const viewY = 5 * zoom_lev;
const viewZ = 5 * zoom_lev;
const roughness = 0.5;
const detail = 8;
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
// document.body.onclick = function(){
//     divide(length_temp);
//     updateVertices();
//     length_temp /= 2;
// }

// Adding lights
const light = new THREE.DirectionalLight(0xFFFFFF, 1);
light.position.set(viewX, viewY, viewZ);
scene.add(light);

// Creating a hemispherical light source
const light2 = new THREE.HemisphereLight( 0xEEEEFF, 0x777788, 1);
light.position.set(viewX, viewY, viewZ);
scene.add(light2);

// Adding user controls
const controls = new THREE.OrbitControls( camera, renderer.domElement);

// Adding fog
// scene.fog = new THREE.Fog(0xFFFFFF, near, far);

// Adding the urls
const urls = [
    "Skybox/bluecloud_lf.jpg",
    "Skybox/bluecloud_rt.jpg",
    "Skybox/bluecloud_dn.jpg",
    "Skybox/bluecloud_up.jpg",
    "Skybox/bluecloud_ft.jpg",
    "Skybox/bluecloud_bk.jpg",
];

// const urls = [
//     "Skybox2/plains-of-abraham_lf.tga",
//     "Skybox2/plains-of-abraham_rt.tga",
//     "Skybox2/plains-of-abraham_up.tga",
//     "Skybox2/plains-of-abraham_dn.tga",
//     "Skybox2/plains-of-abraham_ft.tga",
//     "Skybox2/plains-of-abraham_bk.tga",
// ];

scene.background = new THREE.CubeTextureLoader().load(urls);