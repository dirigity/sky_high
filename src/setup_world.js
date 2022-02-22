import { StereoEffect } from 'three/examples/jsm/effects/StereoEffect';
import DeviceOrientationControls from './gyro_cam.js';
import * as THREE from 'three';
import * as OIMO from "./oimo.js"

function addStaticBox(x, y, z, sx, sy, sz, scene, world) {
    world.add({ size: [sx, sy, sz], pos: [x, y, z] });
    const geometry = new THREE.BoxGeometry(sx, sy, sz, 1, 1, 1);
    const material = new THREE.MeshPhongMaterial();
    const box = new THREE.Mesh(geometry, material);
    box.position.x = x;
    box.position.y = y;
    box.position.z = z;

    scene.add(box)
}

export default function SetUpWorld() {

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.01, 1000);
    const renderer = new THREE.WebGLRenderer();
    const stereo_effect = new StereoEffect(renderer);


    stereo_effect.setSize(window.innerWidth, window.innerHeight);

    scene.background = new THREE.Color(0x333333);


    renderer.setPixelRatio(devicePixelRatio)
    renderer.setSize(innerWidth, innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding

    document.body.appendChild(renderer.domElement);

    const light = new THREE.HemisphereLight('white',
        'darkslategrey',
        0.3,
    )
    scene.add(light)


    // create geometry


    let world = new OIMO.World();
    for (let i = 0; i < 100; i++) {
        addStaticBox(0, -5, -i * 5, 4, 1, 3, scene, world);

    }

    // create character hitbox

    var options = {
        type: 'box',
        size: [1, 2, 1],
        pos: [0, 3, 0],
        density: 1,
        move: true,
        friction: 1,
    }

    let hit_box = world.add(options);

    console.log(world)



    return {
        "scene": scene,
        "controls": new DeviceOrientationControls(camera),
        "camera": camera,
        "renderer": renderer,
        "stereo_effect": stereo_effect,
        "physics_world": world,
        "camera_body": hit_box,
    };

}