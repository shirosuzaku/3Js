import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const size = {
    width: window.innerWidth,
    height: window.innerHeight,
}

export function Setup(targetCanvas, sceneColor, cameraPosition, target) {
    const renderer = new THREE.WebGL1Renderer({
        canvas: targetCanvas,
        antialias: true,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(size.width, size.height);
    renderer.setClearColor(sceneColor);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // optional

    const mainCamera = new THREE.PerspectiveCamera(
        75,
        size.width / size.height,
        0.1,  // Changed near plane
        1000
    );
    mainCamera.position.copy(cameraPosition);
    console.log('Camera position:', mainCamera.position);

    const mainControls = new OrbitControls(mainCamera, renderer.domElement);
    mainControls.target.copy(target);
    mainControls.enableDamping = true;
    mainControls.dampingFactor = 0.05;
    mainControls.screenSpacePanning  = false;
    // mainControls.minPolarAngle = Math.PI * 0.2
    // mainControls.maxPolarAngle = Math.PI * 0.4
    mainControls.update(); // Force initial update

    return { renderer, mainCamera, mainControls };
}
