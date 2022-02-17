// import * as THREE from './../node_modules/three/build/three.module.js';
import * as THREE from '/three';
// import * as THREE from '/three';


import { GLTFLoader } from './../node_modules/three/examples/jsm/loaders/GLTFLoader.js';
//import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color('black');

const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.01, 1000);

console.log(camera);

const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(devicePixelRatio)
renderer.setSize(innerWidth, innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding
document.body.appendChild(renderer.domElement);

const loader = new GLTFLoader();

loader.load('untitled.gltf', function (gltf) {

  scene.add(gltf.scene);


}, undefined, function (error) {

  console.error(error);

});


const light = new THREE.HemisphereLight('white', // bright sky color
  'darkslategrey', // dim ground color
  0.3, // intensity
)
console.log(light)
scene.add(light)
console.log(scene)

// const light2 = new THREE.PointLight(0xffffff, 1);
// light2.position.set(0, 10, 0)
// scene.add(light2)

var keys = [];
var ratony = 0;
var ratonx = 0;

let ws_url = "ws://" + location.host + "" + 1;
console.log(ws_url)
const ws = new WebSocket(ws_url)

ws.onmessage = (msg) => {
  keys = JSON.parse(msg.data)
};


let time = 0
let speed = 0.1;
function animate() {
  time++;

  var cameraFacing = new THREE.Vector3(0, 0, - 1);
  var cameraUp = new THREE.Vector3(0, 1, 0);
  var cameraRight = new THREE.Vector3(-1, 0, 0);

  cameraFacing.applyQuaternion(camera.quaternion);
  cameraUp.applyQuaternion(camera.quaternion);
  cameraRight.applyQuaternion(camera.quaternion);


  if (keys[87]) { // w
    camera.position.add(cameraFacing);
  }
  if (keys[83]) { // s
    camera.position.sub(cameraFacing);
  }
  if (keys[65]) { // a
    camera.position.add(cameraRight);
  }
  if (keys[68]) { // d
    camera.position.sub(cameraRight);
  }
  if (keys[32]) { // space
    camera.position.add(cameraUp);
  }
  if (keys[160]) { // shift
    camera.position.sub(cameraUp);
  }



  renderer.render(scene, camera);
  requestAnimationFrame(animate);




}





window.addEventListener('mousemove', function onMouseover(e) {
  ratonx = e.clientX;
  ratony = e.clientY;
});

window.addEventListener('DOMMouseScroll', mouseWheelEvent);
window.addEventListener("wheel", mouseWheelEvent);
function mouseWheelEvent(e) {
  // console.log(e.wheelDelta ? e.wheelDelta : -e.detail);
  var movement = (e.wheelDelta ? e.wheelDelta : -e.detail);
  if (movement < 0) {
    ScrollUp();
  } else {
    ScrollDown();
  }
}

function ScrollUp() {

}
function ScrollDown() {

}


function handleOrientation(event) {
  var x = event.beta;  // In degree in the range [-180,180)
  var y = event.gamma + 90; // In degree in the range [-90,90)
  let z = event.alpha;

  console.log(x, y);
  camera.rotation._x = -y / 180 * Math.PI;
  camera.rotation._y = x / 180 * Math.PI;
  camera.rotation._z = z / 180 * Math.PI;

  camera.rotation._onChangeCallback();
}

window.addEventListener('deviceorientation', handleOrientation);

animate()
