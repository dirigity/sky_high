
import * as THREE from 'three';
import SetUpWorld from "./setup_world.js"
import keys from "./key_reciver.js"

const { scene, camera, renderer, controls, stereo_effect, physics_world, camera_body } = SetUpWorld();

let vr_width_factor = 0.9 - 0.06;

let movement_mode = "fly"; // "fly" / "elitros" / "walk" 

let last_keys = [];
let time = 0
function animate() {

	time++;

	physics_world.step();


	camera.position.set(camera_body.getPosition().x, camera_body.getPosition().y, camera_body.getPosition().z)

	if (time % 100 == 0) console.log(camera_body.getPosition(), camera_body.linearVelocity, camera.position, camera.rotation)

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
	//let cameraUp = new THREE.Vector3(0, 1, 0);
	let cameraRight = new THREE.Vector3(-1, 0, 0);

	cameraFacing.applyQuaternion(camera.quaternion);
	//cameraUp.applyQuaternion(camera.quaternion);
	cameraRight.applyQuaternion(camera.quaternion);

	cameraFacing.setY(0);
	cameraFacing.setLength(1);

	cameraRight.setY(0);
	cameraRight.setLength(1);

	if (movement_mode == "fly") {

		const ACELERATION = 0.7
		const MAX_SPEED = 40;
		const DRAG = 0.97

		camera_body.setRotation({ x: 0, y: 0, z: 0 })

		// console.log(camera_body.linearVelocity, camera_body.linearVelocity.length())

		if (camera_body.linearVelocity.length() > MAX_SPEED) {
			camera_body.linearVelocity.normalize().multiplyScalar(MAX_SPEED)
			console.log("chill")
		}

		if (keys()[87] || keys()[83] || keys()[65] || keys()[68] || keys()[32] || keys()[160]) {
			camera_body.linearVelocity.multiplyScalar(1 - (1 - DRAG) * 0.7);
		} else {
			camera_body.linearVelocity.multiplyScalar(DRAG);

		}

		if (keys()[87]) { // w
			// camera.position.add(cameraFacing);
			camera_body.applyImpulse(camera_body.position, cameraFacing.multiplyScalar(ACELERATION));
		}
		if (keys()[83]) { // s
			// camera.position.sub(cameraFacing);
			camera_body.applyImpulse(camera_body.position, cameraFacing.multiplyScalar(-ACELERATION));

		}
		if (keys()[65]) { // a
			// camera.position.add(cameraRight);
			camera_body.applyImpulse(camera_body.position, cameraRight.multiplyScalar(ACELERATION));

		}
		if (keys()[68]) { // d
			// camera.position.sub(cameraRight);
			camera_body.applyImpulse(camera_body.position, cameraRight.multiplyScalar(-ACELERATION));

		}
		if (keys()[32]) { // space
			// camera.position.add(cameraUp);
			camera_body.applyImpulse(camera_body.position, new THREE.Vector3(0, ACELERATION, 0));

		}
		if (keys()[160]) { // shift
			// camera.position.sub(cameraUp);
			camera_body.applyImpulse(camera_body.position, new THREE.Vector3(0, -ACELERATION, 0));
		}

	} else if (movement_mode == "walk") {
		physics_world.gravity = { x: 0, y: -9.8, z: 0 };
		const ACELERATION = 0.7
		const MAX_SPEED = 40;
		const DRAG = 0.97

		// console.log(camera_body.linearVelocity, camera_body.linearVelocity.length())

		if (camera_body.linearVelocity.length() > MAX_SPEED) {
			camera_body.linearVelocity.normalize().multiplyScalar(MAX_SPEED)
			console.log("chill")
		}

		if (keys()[87] || keys()[83] || keys()[65] || keys()[68] || keys()[32] || keys()[160]) {
			camera_body.linearVelocity.multiplyScalar(1 - (1 - DRAG) * 0.7);
		} else {
			camera_body.linearVelocity.multiplyScalar(DRAG);

		}

		if (keys()[87]) { // w
			// camera.position.add(cameraFacing);
			camera_body.applyImpulse(camera_body.position, cameraFacing.multiplyScalar(ACELERATION));
		}
		if (keys()[83]) { // s
			// camera.position.sub(cameraFacing);
			camera_body.applyImpulse(camera_body.position, cameraFacing.multiplyScalar(-ACELERATION));

		}
		if (keys()[65]) { // a
			// camera.position.add(cameraRight);
			camera_body.applyImpulse(camera_body.position, cameraRight.multiplyScalar(ACELERATION));

		}
		if (keys()[68]) { // d
			// camera.position.sub(cameraRight);
			camera_body.applyImpulse(camera_body.position, cameraRight.multiplyScalar(-ACELERATION));

		}
		if (keys()[32]) { // space
			// camera.position.add(cameraUp);
			camera_body.applyImpulse(camera_body.position, new THREE.Vector3(0, ACELERATION, 0));

		}
		if (keys()[160]) { // shift
			// camera.position.sub(cameraUp);
			camera_body.applyImpulse(camera_body.position, new THREE.Vector3(0, -ACELERATION, 0));
		}
	}

	if (keys()[70] && !last_keys[70]) { // f
		if (movement_mode == "fly") {
			movement_mode = "walk"
		} else if (movement_mode == "walk") {
			movement_mode = "elitros"
		} else if (movement_mode == "elitros") {
			movement_mode = "fly"
		}
	}

	if (keys()[82] && !last_keys[82]) { // r
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
		stereo_effect.render(scene, camera);
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

	x_dif = 0;
	y_dif = 0;
	onWindowResize()

})



function onWindowResize() {
	let width_factor = vr ? vr_width_factor : 1;

	camera.aspect = window.innerWidth * width_factor / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setPixelRatio(devicePixelRatio)
	renderer.setSize(innerWidth * width_factor, innerHeight);
	stereo_effect.setSize(window.innerWidth * width_factor, window.innerHeight);

}
window.onresize = onWindowResize;

animate()
