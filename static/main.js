import * as THREE from '/three';
import { StereoEffect } from './../node_modules/three/examples/jsm/effects/StereoEffect.js';
import { GLTFLoader } from './../node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import DeviceOrientationControls from './gyro_cam.js';

const width_factor = 0.9;

const scene = new THREE.Scene();
scene.background = new THREE.Color('grey');

const camera = new THREE.PerspectiveCamera(75, innerWidth * width_factor/ innerHeight, 0.01, 1000);
let controls = new DeviceOrientationControls(camera);

const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(devicePixelRatio)
renderer.setSize(innerWidth*width_factor, innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding

let effect = new StereoEffect(renderer);
effect.setSize(window.innerWidth * width_factor, window.innerHeight);

document.body.appendChild(renderer.domElement);


const loader = new GLTFLoader();

loader.load('untitled.gltf', (gltf) => {
	const root = gltf.scene;

	// root.rotateY(-89.55);

	// root.position.set(0, -0.7, 0);
	root.castShadow = true;
	gltf.scene.traverse(function (node) {
		if (node instanceof THREE.Mesh) {
			node.castShadow = true;
		}
	})

	scene.add(gltf.scene);
}, undefined, function (error) {

	console.error(error);

});




const light = new THREE.HemisphereLight('white', // bright sky color
	'darkslategrey', // dim ground color
	0.3, // intensity
)
scene.add(light)

let keys = [];
{
	let ws_url = "ws://" + location.host + "" + 1;
	console.log(ws_url)
	const ws = new WebSocket(ws_url)

	ws.onmessage = (msg) => {
		keys = JSON.parse(msg.data)
	};
}



let time = 0
function animate() {
	time++;
	controls.update();

	let cameraFacing = new THREE.Vector3(0, 0, - 1);
	let cameraUp = new THREE.Vector3(0, 1, 0);
	let cameraRight = new THREE.Vector3(-1, 0, 0);

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
	effect.render(scene, camera);
	requestAnimationFrame(animate);
}

renderer.domElement.addEventListener("click", () => {
	renderer.domElement.requestFullscreen();
	renderer.setPixelRatio(devicePixelRatio)
	renderer.setSize(innerWidth * width_factor, innerHeight);
	effect.setSize(window.innerWidth * width_factor, window.innerHeight);
	onWindowResize()

})

function onWindowResize() {

	camera.aspect = window.innerWidth * width_factor / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setPixelRatio(devicePixelRatio)
	renderer.setSize(innerWidth * width_factor, innerHeight);
	effect.setSize(window.innerWidth * width_factor, window.innerHeight);

}
window.onresize = onWindowResize;

animate()
