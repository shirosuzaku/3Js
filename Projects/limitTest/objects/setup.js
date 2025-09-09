import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const size = {
    width: window.innerWidth,
    height: window.innerHeight,
}

export function Setup(targetCanvas, sceneColor, cameraPosition, target,screenSize) {
    const renderer = new THREE.WebGL1Renderer({
        canvas: targetCanvas,
        antialias: true,
        alpha: true,
        premultipliedAlpha: false,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    // renderer.setSize(size.width, size.height);
    renderer.setSize(screenSize.x, screenSize.y);
    // renderer.setClearColor(sceneColor);
    renderer.setClearColor(0x000000,0);
    renderer.shadowMap.enabled = true
    // renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.shadowMap.type = THREE.BasicShadowMap;

    const mainCamera = new THREE.PerspectiveCamera(
        90,
        // size.width / size.height,
        screenSize.x / screenSize.y,
        0.1,  // Changed near plane
        1000
    );
    mainCamera.position.copy(cameraPosition);
    // console.log('Camera position:', mainCamera.position);

    const mainControls = new OrbitControls(mainCamera, renderer.domElement);
    mainControls.target.copy(target);
    mainControls.enableDamping = true;
    mainControls.dampingFactor = 0.05;
    mainControls.update(); // Force initial update

    return { renderer, mainCamera
        ,mainControls 
    };
}
