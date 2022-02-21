import * as THREE from '/three';
import { StereoEffect } from './../node_modules/three/examples/jsm/effects/StereoEffect.js';
import { GLTFLoader } from './../node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import DeviceOrientationControls from './gyro_cam.js';
import keys from "./key_reciver.js"

let vr_width_factor = 0.9 - 0.06;

const scene = new THREE.Scene();
scene.background = new THREE.Color('grey');

const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.01, 1000);
let controls = new DeviceOrientationControls(camera);

const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(devicePixelRatio)
renderer.setSize(innerWidth, innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding

let effect = new StereoEffect(renderer);
effect.setSize(window.innerWidth, window.innerHeight);

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

let last_keys = [];


const light = new THREE.HemisphereLight('white', // bright sky color
	'darkslategrey', // dim ground color
	0.3, // intensity
)
scene.add(light)




let time = 0
function animate() {
	time++;
	if (vr) {
		controls.update();
	} else {
		if (pressed) {

			let new_vector = new THREE.Vector3(start_cameraFacing.x, start_cameraFacing.y, start_cameraFacing.z);
			let copy_up = new THREE.Vector3(start_cameraUp.x, start_cameraUp.y, start_cameraUp.z);
			let copy_right = new THREE.Vector3(start_cameraRight.x, start_cameraRight.y, start_cameraRight.z);
			new_vector.add(copy_up.multiplyScalar(y_dif / 300))
			new_vector.add(copy_right.multiplyScalar(x_dif / 300))

			new_vector.add(camera.position);
			camera.lookAt(new_vector);

		}


	}

	let cameraFacing = new THREE.Vector3(0, 0, - 1);
	let cameraUp = new THREE.Vector3(0, 1, 0);
	let cameraRight = new THREE.Vector3(-1, 0, 0);

	cameraFacing.applyQuaternion(camera.quaternion);
	cameraUp.applyQuaternion(camera.quaternion);
	cameraRight.applyQuaternion(camera.quaternion);

	if (keys()[87]) { // w
		camera.position.add(cameraFacing);
	}
	if (keys()[83]) { // s
		camera.position.sub(cameraFacing);
	}
	if (keys()[65]) { // a
		camera.position.add(cameraRight);
	}
	if (keys()[68]) { // d
		camera.position.sub(cameraRight);
	}
	if (keys()[32]) { // space
		camera.position.add(cameraUp);
	}
	if (keys()[160]) { // shift
		camera.position.sub(cameraUp);
	}
	if (keys()[82] && !last_keys[82]) { // reload
		window.location.reload(false);
	}
	if (keys()[81] && !last_keys[81]) { // q
		vr_width_factor += 0.03;
		onWindowResize();

	}
	if (keys()[69] && !last_keys[69]) { // e
		vr_width_factor -= 0.03;
		onWindowResize();
	}

	if (vr) {
		effect.render(scene, camera);
	} else {
		renderer.render(scene, camera);
	}
	requestAnimationFrame(animate);

	last_keys = keys();
}

let vr = false;
let start_click_x = -1;
let start_click_y = -1;

let x_dif = 0;
let y_dif = 0;

let pressed = false

let start_cameraFacing;
let start_cameraUp;
let start_cameraRight;

renderer.domElement.addEventListener("mousedown", (e) => {
	pressed = true;
	start_cameraFacing = new THREE.Vector3(0, 0, -1);
	start_cameraUp = new THREE.Vector3(0, 1, 0);
	start_cameraRight = new THREE.Vector3(-1, 0, 0);

	start_cameraFacing.applyQuaternion(camera.quaternion);
	start_cameraUp.applyQuaternion(camera.quaternion);
	start_cameraRight.applyQuaternion(camera.quaternion);

	console.log("new origin",start_cameraFacing,
		start_cameraUp,
		start_cameraRight)

	start_click_x = e.clientX;
	start_click_y = e.clientY;
})

renderer.domElement.addEventListener("mousemove", (e) => {
	if (pressed) {
		x_dif = start_click_x - e.clientX;
		y_dif = start_click_y - e.clientY;
	}

})


renderer.domElement.addEventListener("mouseup", (e) => {
	pressed = false;


	let dif = (x_dif ** 2 + y_dif ** 2)

	if (dif < 10) {
		vr = !vr;
		if (vr) {
			renderer.domElement.requestFullscreen();
		} else {
			document.exitFullscreen();
		}


	}


	onWindowResize()

})



function onWindowResize() {
	let width_factor = vr ? vr_width_factor : 1;

	camera.aspect = window.innerWidth * width_factor / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setPixelRatio(devicePixelRatio)
	renderer.setSize(innerWidth * width_factor, innerHeight);
	effect.setSize(window.innerWidth * width_factor, window.innerHeight);

}
window.onresize = onWindowResize;

animate()
