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
    renderer.shadowMap.enabled = true

    const halfWidth = size.width / 2;
    const halfHeight = size.height / 2;
    const mainCamera = new THREE.OrthographicCamera(
        -halfWidth,
        halfWidth,
        halfHeight,
        -halfHeight,
        0.1,
        100
    );
    mainCamera.zoom = 50
    mainCamera.position.copy(cameraPosition);
    mainCamera.updateProjectionMatrix();

    const mainControls = new OrbitControls(mainCamera, renderer.domElement);
    mainControls.target.copy(target);
    mainControls.enableDamping = true;
    mainControls.dampingFactor = 0.05;
    mainControls.update(); // Force initial update

    return { renderer, mainCamera, mainControls };
}
